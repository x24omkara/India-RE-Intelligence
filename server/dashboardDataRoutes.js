import express from "express";
import multer from "multer";
import {
  bufferLooksLikeXlsx,
  parseDashboardSheet,
  validateColumnsAgainstSpec,
  validateDataRows,
} from "./dashboardExcelValidate.js";
import { DASHBOARD_XLSX_COLUMN_NAMES } from "./excelColumnSpec.js";
import {
  createS3Client,
  getCurrentDashboardRowCount,
  getDashboardS3Config,
  getDashboardXlsxObject,
  getWorkbookMetaForApi,
  replaceDashboardWorkbookWithHistory,
} from "./dashboardS3.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 80 * 1024 * 1024 },
});

export function createDashboardDataRouter() {
  const router = express.Router();
  let cached = null;
  function s3ctx() {
    if (!cached) {
      const cfg = getDashboardS3Config();
      cached = { cfg, client: createS3Client(cfg) };
    }
    return cached;
  }

  function requireS3(res) {
    try {
      return s3ctx();
    } catch (e) {
      res.status(503).json({
        ok: false,
        message:
          e?.message ||
          "S3 is not configured. Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET, and AWS_S3_DASHBOARD_XLSX_KEY.",
      });
      return null;
    }
  }

  router.get("/expected-columns", (req, res) => {
    res.json({ ok: true, columns: [...DASHBOARD_XLSX_COLUMN_NAMES] });
  });

  router.get("/xlsx", async (req, res) => {
    const ctx = requireS3(res);
    if (!ctx) return;
    try {
      const { cfg, client } = ctx;
      const { buffer: buf, lastModified } = await getDashboardXlsxObject(client, cfg.bucket, cfg.key);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", 'attachment; filename="re-intel-data.xlsx"');
      if (lastModified && !isNaN(lastModified.getTime())) {
        res.setHeader("Last-Modified", lastModified.toUTCString());
        res.setHeader("X-Dashboard-File-Updated-At", lastModified.toISOString());
      }
      res.send(buf);
    } catch (e) {
      const code = e?.Code || e?.name;
      const status = e?.$metadata?.httpStatusCode;
      if (code === "NoSuchKey" || status === 404) {
        return res.status(404).json({
          ok: false,
          code: "NO_FILE",
          message: "No dashboard Excel file is stored in S3 yet. Upload a file first.",
        });
      }
      console.error("GET /api/dashboard-data/xlsx", e);
      return res.status(500).json({ ok: false, message: e?.message || "Failed to load file from S3." });
    }
  });

  router.post("/upload", (req, res) => {
    upload.single("file")(req, res, async (multerErr) => {
      if (multerErr) {
        const msg =
          multerErr.code === "LIMIT_FILE_SIZE"
            ? "File is too large (max 80 MB)."
            : multerErr.message || "Upload failed.";
        return res.status(400).json({ ok: false, code: "UPLOAD_ERROR", message: msg });
      }

      const file = req.file;
      if (!file || !file.buffer) {
        return res.status(400).json({ ok: false, code: "NO_FILE", message: "No file was uploaded." });
      }

      const name = String(file.originalname || "").toLowerCase();
      if (!name.endsWith(".xlsx")) {
        return res.status(400).json({
          ok: false,
          code: "INVALID_FORMAT",
          message: "Only .xlsx (Excel Open XML) files are accepted.",
        });
      }

      const mime = String(file.mimetype || "").toLowerCase();
      if (
        mime &&
        mime !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
        mime !== "application/octet-stream"
      ) {
        return res.status(400).json({
          ok: false,
          code: "INVALID_FORMAT",
          message: `Unexpected file type (${file.mimetype}). Use a valid .xlsx workbook.`,
        });
      }

      if (!bufferLooksLikeXlsx(file.buffer)) {
        return res.status(400).json({
          ok: false,
          code: "INVALID_FORMAT",
          message: "File does not look like a valid .xlsx (ZIP/OOXML) workbook.",
        });
      }

      let rows;
      let headerRow;
      try {
        const parsed = parseDashboardSheet(file.buffer);
        rows = parsed.rows;
        headerRow = parsed.headerRow;
      } catch (e) {
        return res.status(400).json({
          ok: false,
          code: "PARSE_ERROR",
          message: e?.message || "Could not read the Excel workbook.",
        });
      }

      const colCheck = validateColumnsAgainstSpec(headerRow);
      if (!colCheck.ok) {
        return res.status(400).json({
          ok: false,
          code: colCheck.code,
          message: colCheck.message,
          expectedColumns: colCheck.expectedColumns,
          headerLabels: colCheck.headerLabels,
          columnCountExpected: colCheck.columnCountExpected,
          columnCountFound: colCheck.columnCountFound,
          missingColumns: colCheck.missingColumns,
          extraColumns: colCheck.extraColumns,
          duplicateHeaders: colCheck.duplicateHeaders,
        });
      }

      const emptyCheck = validateDataRows(rows);
      if (!emptyCheck.ok) {
        return res.status(400).json({ ok: false, code: emptyCheck.code, message: emptyCheck.message });
      }

      const confirm =
        String(req.body?.confirmLowerRowCount || "").toLowerCase() === "true" ||
        String(req.body?.confirmLowerRowCount || "") === "1";

      try {
        const ctx = requireS3(res);
        if (!ctx) return;
        const { cfg, client } = ctx;
        const current = await getCurrentDashboardRowCount(client, cfg.bucket, cfg.key);
        const uploadedCount = rows.length;

        if (!current.missing && current.rowCount > uploadedCount && !confirm) {
          return res.status(409).json({
            ok: false,
            code: "ROW_COUNT_LOWER",
            message: "Uploaded file has fewer data rows than the file currently in storage.",
            currentRowCount: current.rowCount,
            uploadedRowCount: uploadedCount,
            deficit: current.rowCount - uploadedCount,
          });
        }

        await replaceDashboardWorkbookWithHistory(client, cfg.bucket, cfg.key, file.buffer, {
          previousBuffer: current.missing ? null : current.buffer,
        });
        return res.json({
          ok: true,
          rowCount: uploadedCount,
          message: "File uploaded successfully.",
        });
      } catch (e) {
        console.error("POST /api/dashboard-data/upload", e);
        return res.status(500).json({
          ok: false,
          message: e?.message || "Failed to upload to S3.",
        });
      }
    });
  });

  return router;
}
