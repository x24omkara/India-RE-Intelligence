import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { parseDashboardSheet } from "./dashboardXlsxParse.js";

function requireEnv(name) {
  const v = process.env[name];
  if (typeof v !== "string" || !v.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return v.trim();
}

const DEFAULT_HISTORY_MAX = 5;

function historyMaxVersions() {
  const n = Number(process.env.DASHBOARD_S3_HISTORY_MAX);
  if (Number.isFinite(n) && n >= 1 && n <= 100) return Math.floor(n);
  return DEFAULT_HISTORY_MAX;
}

/** Trim and strip a leading slash so S3 keys match the console. */
export function normalizeDashboardS3Key(key) {
  return String(key || "")
    .trim()
    .replace(/^\/+/, "");
}

export function getDashboardS3Config() {
  return {
    region: requireEnv("AWS_REGION"),
    bucket: requireEnv("AWS_S3_BUCKET"),
    key: normalizeDashboardS3Key(requireEnv("AWS_S3_DASHBOARD_XLSX_KEY")),
    accessKeyId: requireEnv("AWS_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("AWS_SECRET_ACCESS_KEY"),
  };
}

export function createS3Client(cfg) {
  return new S3Client({
    region: cfg.region,
    credentials: {
      accessKeyId: cfg.accessKeyId,
      secretAccessKey: cfg.secretAccessKey,
    },
  });
}

/** e.g. "folder/re-intel-data.xlsx" -> "folder/history/" */
export function dashboardHistoryPrefix(mainKey) {
  const k = String(mainKey || "").replace(/^\//, "");
  const i = k.lastIndexOf("/");
  const dir = i >= 0 ? k.slice(0, i) : "";
  return dir ? `${dir}/history/` : `history/`;
}

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

/** @returns {{ buffer: Buffer, lastModified: Date | null }} */
export async function getDashboardXlsxObject(client, bucket, key) {
  const out = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const buf = await streamToBuffer(out.Body);
  const lastModified = out.LastModified instanceof Date ? out.LastModified : null;
  return { buffer: buf, lastModified };
}

export async function getDashboardXlsxBuffer(client, bucket, key) {
  const { buffer } = await getDashboardXlsxObject(client, bucket, key);
  return buffer;
}

export async function putDashboardXlsxBuffer(client, bucket, key, buffer) {
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
  );
}

/** @returns {{ lastModified: Date | null, contentLength: number | null } | null} */
export async function headDashboardWorkbook(client, bucket, key) {
  try {
    const out = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return {
      lastModified: out.LastModified instanceof Date ? out.LastModified : null,
      contentLength: out.ContentLength ?? null,
    };
  } catch (e) {
    const status = e?.$metadata?.httpStatusCode;
    const code = e?.Code || e?.name;
    const msg = String(e?.message || "");
    if (
      status === 404 ||
      code === "NotFound" ||
      code === "NoSuchKey" ||
      /404|not found|nosuchkey/i.test(msg)
    ) {
      return null;
    }
    throw e;
  }
}

export async function getWorkbookMetaForApi(client, bucket, key) {
  const h = await headDashboardWorkbook(client, bucket, key);
  if (!h) {
    return { ok: true, lastModified: null, contentLength: null };
  }
  return {
    ok: true,
    lastModified:
      h.lastModified && !isNaN(h.lastModified.getTime()) ? h.lastModified.toISOString() : null,
    contentLength: h.contentLength,
  };
}

/**
 * If `previousBuffer` is the current workbook bytes (from a prior Get), writes them under history/
 * before replacing the main key. Avoids CopyObject (fragile CopySource + extra IAM).
 * Then uploads newBuffer to mainKey and trims history to `historyMaxVersions()` objects.
 *
 * @param {Buffer | null | undefined} options.previousBuffer — bytes of existing object; omit or null if none
 */
export async function replaceDashboardWorkbookWithHistory(
  client,
  bucket,
  mainKey,
  newBuffer,
  options = {}
) {
  const { previousBuffer = null } = options;
  const maxHist = historyMaxVersions();
  const key = normalizeDashboardS3Key(mainKey);
  const histPrefix = dashboardHistoryPrefix(key);

  const prev =
    previousBuffer != null && Buffer.isBuffer(previousBuffer) && previousBuffer.length > 0
      ? previousBuffer
      : null;

  if (prev) {
    const archiveName = `re-intel-data-${Date.now()}.xlsx`;
    const destKey = `${histPrefix}${archiveName}`;
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: destKey,
        Body: prev,
        ContentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
    );
  }

  await putDashboardXlsxBuffer(client, bucket, key, newBuffer);

  let continuationToken;
  const all = [];
  do {
    const listOut = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: histPrefix,
        ContinuationToken: continuationToken,
      })
    );
    if (listOut.Contents?.length) all.push(...listOut.Contents);
    continuationToken = listOut.IsTruncated ? listOut.NextContinuationToken : undefined;
  } while (continuationToken);

  if (all.length <= maxHist) return;

  all.sort((a, b) => {
    const ta = a.LastModified instanceof Date ? a.LastModified.getTime() : 0;
    const tb = b.LastModified instanceof Date ? b.LastModified.getTime() : 0;
    if (ta !== tb) return ta - tb;
    return String(a.Key || "").localeCompare(String(b.Key || ""));
  });

  const excess = all.length - maxHist;
  for (let i = 0; i < excess; i++) {
    const k = all[i].Key;
    if (k) {
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: k }));
    }
  }
}

export async function getCurrentDashboardRowCount(client, bucket, key) {
  try {
    const buf = await getDashboardXlsxBuffer(client, bucket, key);
    const { rows } = parseDashboardSheet(buf);
    return { rowCount: rows.length, buffer: buf };
  } catch (e) {
    const status = e?.$metadata?.httpStatusCode;
    const code = e?.Code || e?.name;
    if (code === "NoSuchKey" || status === 404) {
      return { rowCount: 0, buffer: null, missing: true };
    }
    throw e;
  }
}
