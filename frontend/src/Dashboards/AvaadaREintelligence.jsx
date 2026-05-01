import { useState, useEffect, useMemo, useRef } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from "recharts";
import { deriveAvaadaDataFromDashboardApi } from "./avaadaExcelData";
import { resolveApiBaseUrl } from "../apiBase";

const DASHBOARD_API_BASE = resolveApiBaseUrl();

// ── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  solar:"#e07b00", hybrid:"#6930c3", fdre:"#0077b6",
  bess:"#d62828",  wind:"#2dc653",
  avaada:"#0077b6", jsw:"#e07b00", renew:"#6930c3",
  ntpc:"#2dc653",  adani:"#d62828", juniper:"#f77f00",
  sael:"#00b4d8",  acme:"#9b2226",
  ists:"#0077b6",  stu:"#e07b00",
  muted:"#7b82a0", border:"#dde1ee", surface:"#f0f2f8",
};

// ── DATA ─────────────────────────────────────────────────────────────────────
const ALL_FYS = ["FY 2021","FY 2022","FY 2023","FY 2024","FY 2025","FY 2026"];

const FY_MARKET = {"FY 2021":18175,"FY 2022":15995,"FY 2023":13783,"FY 2024":45961,"FY 2025":54584,"FY 2026":26352};
const AVAADA_FY = {"FY 2021":320,"FY 2022":250,"FY 2023":325,"FY 2024":6412,"FY 2025":9150,"FY 2026":0};

const TECH_BY_FY = {
  "FY 2021":{Solar:12980,Hybrid:1425,"RTC/FDRE":400,"ESS/BESS":0,Wind:3370},
  "FY 2022":{Solar:11695,Hybrid:1700,"RTC/FDRE":2300,"ESS/BESS":0,Wind:300},
  "FY 2023":{Solar:3610,Hybrid:2175,"RTC/FDRE":0,"ESS/BESS":3750,Wind:3600},
  "FY 2024":{Solar:29173,Hybrid:6940,"RTC/FDRE":7558,"ESS/BESS":250,Wind:2040},
  "FY 2025":{Solar:15760,Hybrid:15076,"RTC/FDRE":13688,"ESS/BESS":9600,Wind:460},
  "FY 2026":{Solar:500,Hybrid:0,"RTC/FDRE":8770,"ESS/BESS":15080,Wind:2002},
};

const TARIFF_BY_TECH = {
  Solar:    {"FY 2021":2.420,"FY 2022":2.402,"FY 2023":2.657,"FY 2024":2.724,"FY 2025":2.574,"FY 2026":2.447},
  Hybrid:   {"FY 2021":2.439,"FY 2022":2.423,"FY 2023":2.758,"FY 2024":3.333,"FY 2025":3.441},
  "RTC/FDRE":{"FY 2021":2.900,"FY 2022":3.204,"FY 2024":4.584,"FY 2025":4.154,"FY 2026":4.140},
  "ESS/BESS":{"FY 2023":10.223,"FY 2024":4.487,"FY 2025":2.839,"FY 2026":2.468},
  Wind:     {"FY 2021":2.749,"FY 2022":3.434,"FY 2023":2.953,"FY 2024":3.490,"FY 2025":3.762,"FY 2026":3.703},
};

const CO_BY_FY = {
  "FY 2021":{Avaada:320,JSW:1260,Renew:1300,NTPC:1510,Adani:1500,Juniper:0,SAEL:0,ACME:0,Mahindra:0,Tata:1115,TOTAL:18175},
  "FY 2022":{Avaada:250,JSW:99,Renew:1300,NTPC:3775,Adani:270,Juniper:0,SAEL:0,ACME:0,Mahindra:0,Tata:630,TOTAL:15995},
  "FY 2023":{Avaada:325,JSW:800,Renew:300,NTPC:1040,Adani:0,Juniper:195,SAEL:50,ACME:0,Mahindra:0,Tata:1705,TOTAL:13783},
  "FY 2024":{Avaada:6412,JSW:3180,Renew:4614,NTPC:2925,Adani:0,Juniper:2150,SAEL:2300,ACME:1080,Mahindra:1300,Tata:750,TOTAL:45961},
  "FY 2025":{Avaada:9150,JSW:6955,Renew:3900,NTPC:2200,Adani:3895,Juniper:2450,SAEL:1430,ACME:2150,Mahindra:1436,Tata:288,TOTAL:54584},
  "FY 2026":{Avaada:0,JSW:0,Renew:0,NTPC:80,Adani:0,Juniper:120,SAEL:450,ACME:1995,Mahindra:0,Tata:80,TOTAL:26352},
};

const AUTH_BY_FY = {
  "FY 2021":{SECI:8040,NHPC:2000,NTPC:1360,SJVN:0,GUVNL:1800,MSEDCL:250,MSAPL:0,RUMSL:0,IREDA:0,RUVNL:0},
  "FY 2022":{SECI:6485,NHPC:0,NTPC:0,SJVN:0,GUVNL:500,MSEDCL:1300,MSAPL:0,RUMSL:1500,IREDA:5710,RUVNL:0},
  "FY 2023":{SECI:3970,NHPC:0,NTPC:3000,SJVN:0,GUVNL:3410,MSEDCL:1855,MSAPL:0,RUMSL:1293,IREDA:0,RUVNL:0},
  "FY 2024":{SECI:10280,NHPC:5360,NTPC:7164,SJVN:4834,GUVNL:5345,MSEDCL:500,MSAPL:7248,RUMSL:0,IREDA:0,RUVNL:1000},
  "FY 2025":{SECI:8545,NHPC:12950,NTPC:10060,SJVN:7018,GUVNL:3240,MSEDCL:5826,MSAPL:0,RUMSL:170,IREDA:0,RUVNL:0},
  "FY 2026":{SECI:5427,NHPC:1825,NTPC:0,SJVN:3775,GUVNL:8880,MSEDCL:0,MSAPL:0,RUMSL:600,IREDA:0,RUVNL:500},
};

const AVAADA_TECH_FY = {
  "FY 2021":{Solar:320,Hybrid:0,"RTC/FDRE":0,Wind:0},
  "FY 2022":{Solar:250,Hybrid:0,"RTC/FDRE":0,Wind:0},
  "FY 2023":{Solar:325,Hybrid:0,"RTC/FDRE":0,Wind:0},
  "FY 2024":{Solar:5322,Hybrid:1040,"RTC/FDRE":0,Wind:50},
  "FY 2025":{Solar:2550,Hybrid:2960,"RTC/FDRE":3640,Wind:0},
  "FY 2026":{Solar:0,Hybrid:0,"RTC/FDRE":0,Wind:0},
};

const CO_TECH_TARIFF = {
  all:{
    Avaada:{Solar:{t:2.681,c:8767},Hybrid:{t:3.52,c:4000},"RTC/FDRE":{t:4.389,c:3640}},
    JSW:   {Solar:{t:2.592,c:2800},Hybrid:{t:3.515,c:1700},"RTC/FDRE":{t:4.167,c:1009}},
    Renew: {Solar:{t:2.542,c:6600},Hybrid:{t:3.263,c:900},"RTC/FDRE":{t:4.02,c:3614}},
    NTPC:  {Solar:{t:2.449,c:8360},Hybrid:{t:2.614,c:1200},"RTC/FDRE":{t:3.741,c:1500}},
    Adani: {Solar:{t:2.49,c:1350},Hybrid:{t:3.532,c:2025},"RTC/FDRE":{t:3.1,c:170}},
    Juniper:{Solar:{t:2.9,c:75},Hybrid:{t:3.311,c:2630},"RTC/FDRE":{t:4.452,c:1750}},
  },
  fy25:{
    Avaada:{Solar:{t:2.598,c:2550},Hybrid:{t:3.53,c:2960},"RTC/FDRE":{t:4.389,c:3640}},
    JSW:   {Solar:{t:2.69,c:400},Hybrid:{t:3.515,c:1700},"RTC/FDRE":{t:3.912,c:730}},
    Renew: {Solar:{t:2.58,c:2500},Hybrid:{t:3.44,c:300},"RTC/FDRE":{t:3.726,c:1100}},
    NTPC:  {Solar:{t:2.544,c:1400},Hybrid:null,"RTC/FDRE":{t:3.359,c:800}},
    Adani: {Solar:{t:2.629,c:450},Hybrid:{t:3.532,c:2025},"RTC/FDRE":{t:3.1,c:170}},
    Juniper:{Solar:null,Hybrid:{t:3.369,c:1200},"RTC/FDRE":{t:4.39,c:1150}},
  },
  fy26:{
    Avaada:{Solar:null,Hybrid:null,"RTC/FDRE":null},
    JSW:{Solar:null,Hybrid:null,"RTC/FDRE":null},
    Renew:{Solar:null,Hybrid:null,"RTC/FDRE":null},
    NTPC:{Solar:null,Hybrid:null,"RTC/FDRE":null},
    Adani:{Solar:null,Hybrid:null,"RTC/FDRE":null},
    Juniper:{Solar:null,Hybrid:null,"RTC/FDRE":{t:4.76,c:70}},
  },
};

const HM_AUTH_ALL = {
  Avaada:{SECI:1040,NHPC:5950,NTPC:2290,SJVN:2180,GUVNL:980,MSEDCL:2075,MSAPL:1132,RUMSL:200,REMCL:0,RUVNL:200},
  JSW:   {SECI:5294,NHPC:0,NTPC:1400,SJVN:1000,GUVNL:300,MSEDCL:2300,MSAPL:0,RUMSL:0,REMCL:0,RUVNL:0},
  Renew: {SECI:4230,NHPC:1750,NTPC:2450,SJVN:684,GUVNL:600,MSEDCL:200,MSAPL:0,RUMSL:300,REMCL:200,RUVNL:0},
  NTPC:  {SECI:3520,NHPC:380,NTPC:0,SJVN:900,GUVNL:575,MSEDCL:300,MSAPL:0,RUMSL:415,REMCL:700,RUVNL:0},
  Adani: {SECI:800,NHPC:1370,NTPC:825,SJVN:0,GUVNL:0,MSEDCL:120,MSAPL:0,RUMSL:0,REMCL:0,RUVNL:0},
  Juniper:{SECI:450,NHPC:1100,NTPC:1030,SJVN:1200,GUVNL:640,MSEDCL:225,MSAPL:0,RUMSL:0,REMCL:0,RUVNL:0},
  ACME:  {SECI:950,NHPC:1455,NTPC:550,SJVN:1450,GUVNL:640,MSEDCL:0,MSAPL:0,RUMSL:0,REMCL:130,RUVNL:0},
  SAEL:  {SECI:1450,NHPC:300,NTPC:300,SJVN:450,GUVNL:1380,MSEDCL:150,MSAPL:0,RUMSL:0,REMCL:0,RUVNL:200},
};
const HM_AUTH_FY25 = {
  Avaada:{SECI:240,NHPC:4120,NTPC:1290,SJVN:1650,GUVNL:500,MSEDCL:1350},
  JSW:   {SECI:1655,NHPC:0,NTPC:700,SJVN:300,GUVNL:0,MSEDCL:2300},
  Renew: {SECI:250,NHPC:1500,NTPC:1350,SJVN:500,GUVNL:0,MSEDCL:0},
  NTPC:  {SECI:700,NHPC:300,NTPC:0,SJVN:200,GUVNL:0,MSEDCL:0},
  Adani: {SECI:50,NHPC:1370,NTPC:825,SJVN:0,GUVNL:0,MSEDCL:0},
  Juniper:{SECI:300,NHPC:750,NTPC:300,SJVN:850,GUVNL:100,MSEDCL:150},
};
const REIA_ALL = {
  Avaada:{"Central REIA":10990,State:5467},
  JSW:   {"Central REIA":7394,State:4900},
  Renew: {"Central REIA":9114,State:2300},
  NTPC:  {"Central REIA":4720,State:6810},
  Adani: {"Central REIA":2995,State:2670},
  Juniper:{"Central REIA":3630,State:1285},
  ACME:  {"Central REIA":3230,State:690},
  SAEL:  {"Central REIA":2050,State:1730},
};

const IPP_DATA = [
  {c:"Adani",op:14220,uc:15700},{c:"Avaada",op:3730,uc:20450},{c:"Renew",op:10400,uc:11400},
  {c:"Greenko",op:7500,uc:10960},{c:"JSW",op:5322,uc:11361},{c:"NTPC",op:4271,uc:10086},
  {c:"Tata",op:5000,uc:6400},{c:"ACME",op:3740,uc:8922},{c:"SJVN",op:405,uc:8490},
];

const TECH_MATRIX = [
  {dev:"Avaada",solar:8767,hybrid:4000,fdre:3640,bess:null,wind:50,total:16457,isAvaada:true},
  {dev:"JSW",solar:2800,hybrid:1700,fdre:1009,bess:4625,wind:2160,total:12294},
  {dev:"Renew",solar:6600,hybrid:900,fdre:3614,bess:null,wind:300,total:11414},
  {dev:"NTPC",solar:8360,hybrid:1200,fdre:1500,bess:180,wind:200,total:11530},
  {dev:"Adani",solar:1350,hybrid:2025,fdre:170,bess:1250,wind:870,total:5665},
  {dev:"ACME",solar:600,hybrid:450,fdre:3260,bess:915,wind:null,total:5225},
  {dev:"Juniper",solar:75,hybrid:2630,fdre:1820,bess:null,wind:390,total:4915},
  {dev:"SAEL",solar:3780,hybrid:null,fdre:450,bess:null,wind:null,total:4230},
  {dev:"Greenko",solar:null,hybrid:null,fdre:1001,bess:3000,wind:null,total:4001},
  {dev:"Torrent",solar:550,hybrid:null,fdre:100,bess:1500,wind:400,total:2550},
  {dev:"Patel Infra",solar:350,hybrid:null,fdre:null,bess:1503,wind:null,total:1853},
];

const DEALS = [
  {t:"NHPC FDRE-III",a:"NHPC",c:"RTC/FDRE",cn:"ISTS",cap:1200,ta:4.52,fy:"FY25",s:"LoA Issued"},
  {t:"NHPC FDRE-II",a:"NHPC",c:"RTC/FDRE",cn:"ISTS",cap:1200,ta:4.37,fy:"FY25",s:"LoA Issued"},
  {t:"SJVN ISTS-FDRE-2",a:"SJVN",c:"RTC/FDRE",cn:"ISTS",cap:1180,ta:4.26,fy:"FY25",s:"PPA Signed"},
  {t:"NHPC Solar-2",a:"NHPC",c:"Solar",cn:"ISTS",cap:1000,ta:2.53,fy:"FY24",s:"PPA Signed"},
  {t:"NTPC BOO-16",a:"NTPC",c:"Solar",cn:"ISTS",cap:750,ta:2.69,fy:"FY25",s:"LoA Issued"},
  {t:"NHPC Solar-3",a:"NHPC",c:"Solar",cn:"ISTS",cap:700,ta:2.57,fy:"FY25",s:"LoA Issued"},
  {t:"NHPC T9 Solar",a:"NHPC",c:"Solar",cn:"ISTS",cap:600,ta:2.47,fy:"FY25",s:"LoA Issued"},
  {t:"MSEDCL Hybrid Ph.3",a:"MSEDCL",c:"Hybrid",cn:"STU",cap:850,ta:3.61,fy:"FY25",s:"PPA Signed"},
  {t:"MSEDCL Hybrid Ph.4",a:"MSEDCL",c:"Hybrid",cn:"STU",cap:500,ta:3.69,fy:"FY25",s:"PPA Signed"},
  {t:"SJVN 1.5GW Hybrid",a:"SJVN",c:"Hybrid",cn:"ISTS",cap:470,ta:3.42,fy:"FY25",s:"LoA Issued"},
  {t:"NHPC Hybrid T10",a:"NHPC",c:"Hybrid",cn:"ISTS",cap:420,ta:3.42,fy:"FY25",s:"LoA Issued"},
  {t:"MSKVY (5 districts)",a:"MSAPL",c:"Solar",cn:"STU",cap:1034,ta:3.10,fy:"FY24",s:"PPA Signed"},
  {t:"NTPC BOO-14",a:"NTPC",c:"Solar",cn:"ISTS",cap:500,ta:2.60,fy:"FY24",s:"LoA Issued"},
  {t:"NTPC BOO-9",a:"NTPC",c:"Solar",cn:"ISTS",cap:500,ta:2.65,fy:"FY24",s:"PPA Signed"},
  {t:"GUVNL Ph-24",a:"GUVNL",c:"Solar",cn:"STU",cap:400,ta:2.68,fy:"FY25",s:"PPA Signed"},
  {t:"SECI-XIV Solar",a:"SECI",c:"Solar",cn:"ISTS",cap:300,ta:2.57,fy:"FY24",s:"LoA Issued"},
];

const DEV_COLOR = {
  Avaada: C.avaada,
  JSW: C.jsw,
  Renew: C.renew,
  NTPC: C.ntpc,
  Adani: C.adani,
  Juniper: C.juniper,
  SAEL: C.sael,
  ACME: C.acme,
};

/** Bidding authorities (not developers) — distinct colors for “Top Bidding Authorities” chart. */
const AUTH_COLOR = {
  SECI: C.avaada,
  NHPC: C.renew,
  NTPC: C.ntpc,
  SJVN: C.jsw,
  GUVNL: C.adani,
  MSEDCL: C.sael,
  MSAPL: C.acme,
  IREDA: C.juniper,
  RUMSL: "#264653",
  REMCL: "#2a9d8f",
  RUVNL: "#bc6c25",
};

const ENTITY_PALETTE = [
  "#0077b6", "#6930c3", "#2dc653", "#e07b00", "#d62828", "#00b4d8",
  "#9b2226", "#f77f00", "#6a4c93", "#118ab2", "#ef476f", "#06d6a0",
  "#264653", "#2a9d8f", "#bc6c25", "#8338ec", "#ff006e", "#fb5607",
];

function normalizeHexColor(c) {
  if (c == null || typeof c !== "string") return "";
  let s = c.trim().toLowerCase();
  if (/^#[0-9a-f]{3}$/.test(s)) {
    s = `#${s[1]}${s[1]}${s[2]}${s[2]}${s[3]}${s[3]}`;
  }
  return s;
}

/** All hex values assigned to known developers or authorities — fallbacks must not reuse these. */
const RESERVED_ENTITY_COLORS = new Set(
  [...Object.values(DEV_COLOR), ...Object.values(AUTH_COLOR)].map(normalizeHexColor)
);

const FALLBACK_ENTITY_PALETTE = ENTITY_PALETTE.filter(
  (hex) => !RESERVED_ENTITY_COLORS.has(normalizeHexColor(hex))
);

function hashStringSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Deterministic color not present in DEV_COLOR / AUTH_COLOR hex maps (single-entity fallback). */
function unmappedEntityColor(seed) {
  if (FALLBACK_ENTITY_PALETTE.length > 0) {
    return FALLBACK_ENTITY_PALETTE[hashStringSeed(seed) % FALLBACK_ENTITY_PALETTE.length];
  }
  const h = hashStringSeed(seed) % 360;
  const s = 58 + (hashStringSeed(`${seed}:s`) % 15);
  const l = 42 + (hashStringSeed(`${seed}:l`) % 12);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * Distinct colors for unmapped names in chart order — no reuse within the list; never uses reserved map hexes.
 * Uses fallback hex palette first, then golden-angle HSL for additional bars.
 */
function assignDistinctUnmappedColors(unmappedKeysInOrder) {
  const m = new Map();
  const pool = FALLBACK_ENTITY_PALETTE;
  unmappedKeysInOrder.forEach((key, i) => {
    if (i < pool.length) {
      m.set(key, pool[i]);
    } else {
      const h = Math.round((i * 137.508) % 360);
      const s = 56 + ((i * 3) % 11);
      const l = 38 + ((i * 5) % 10);
      m.set(key, `hsl(${h}, ${s}%, ${l}%)`);
    }
  });
  return m;
}

/** Collect unique unmapped keys in first-seen order (for orderedNames sequence). */
function unmappedKeysInAppearanceOrder(orderedNames, canonicalMap) {
  const out = [];
  const seen = new Set();
  for (const raw of orderedNames) {
    const k = String(raw ?? "").trim();
    if (!k || canonicalMap[k] || seen.has(k)) continue;
    seen.add(k);
    out.push(k);
  }
  return out;
}

/**
 * Colors for bar/pie slices: canonical map when known; distinct unmapped colors per chart (no duplicates among unmapped).
 */
function barColorsForOrderedNames(orderedNames, canonicalMap, rolePrefix) {
  const unmappedOrder = unmappedKeysInAppearanceOrder(orderedNames, canonicalMap);
  const unmappedColor = assignDistinctUnmappedColors(unmappedOrder);
  const out = new Map();
  for (const raw of orderedNames) {
    const k = String(raw ?? "").trim();
    if (!k) continue;
    const c = canonicalMap[k] ?? unmappedColor.get(k) ?? unmappedEntityColor(`${rolePrefix}:${k}`);
    out.set(k, c);
  }
  return out;
}

/** Pie/other chart slices that are not a developer or authority row (e.g. connectivity “Others”). */
function chartSliceColor(namespace, label) {
  const key = String(label ?? "").trim();
  if (!key) return unmappedEntityColor(`${namespace}:`);
  return unmappedEntityColor(`${namespace}:${key}`);
}

function connectivitySplitFill(sliceName) {
  if (sliceName === "ISTS") return C.ists;
  if (sliceName === "STU") return C.stu;
  return chartSliceColor("connectivity", sliceName);
}

// ── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (n) => n >= 1000 ? (n/1000).toFixed(1)+"k" : n.toLocaleString();
const fmtMW = (n) => n ? n.toLocaleString() + " MW" : "—";
const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/** Short Y-axis label for RFS: first whitespace-separated token (e.g. "MSEDCL 1.65GW…" → "MSEDCL", "NTPC-1 GW-…" → "NTPC-1"). */
function shortRfsLabelForAxis(full) {
  const s = String(full ?? "").trim();
  if (!s) return "";
  return s.split(/\s+/)[0] || s;
}

/** Top N by value (desc); if "Avaada" is absent from that cut, use top N−1 others plus Avaada (no "Others" bucket). */
function pickTopNWithAvaada(rows, n) {
  if (!rows.length) return [];
  const topN = rows.slice(0, n);
  if (topN.some((r) => r.name === "Avaada")) return topN;
  const avaada = rows.find((r) => r.name === "Avaada");
  if (!avaada) return topN;
  const rest = rows.filter((r) => r.name !== "Avaada").slice(0, n - 1);
  return [...rest, avaada];
}

function hmColor(val, max) {
  if (!val || val === 0) return null;
  const p = val / max;
  if (p < 0.12) return {bg:"#d0eaf8",fg:"#2a6e97"};
  if (p < 0.30) return {bg:"#7ec8e3",fg:"#fff"};
  if (p < 0.55) return {bg:"#2196c4",fg:"#fff"};
  if (p < 0.78) return {bg:"#0077b6",fg:"#fff"};
  return {bg:"#004e7a",fg:"#fff"};
}

/** Bar + pie series: `dataKey` matches `TECH_BY_FY` / stacked bar keys; `label` is legend / pie slice name. */
const TECH_MIX_LEGEND_ORDER = [
  { dataKey: "Solar", label: "Solar", color: C.solar },
  { dataKey: "Hybrid", label: "Hybrid", color: C.hybrid },
  { dataKey: "RTC/FDRE", label: "FDRE/RTC", color: C.fdre },
  { dataKey: "ESS/BESS", label: "BESS/ESS", color: C.bess },
  { dataKey: "Wind", label: "Wind", color: C.wind },
];

/** Avaada Win by Technology chart (no BESS stack in this view). */
const AVAADA_WIN_TECH_SERIES = TECH_MIX_LEGEND_ORDER.filter((x) => x.dataKey !== "ESS/BESS");

const dealsFilterSelectStyle = {
  fontSize: 11,
  padding: "4px 8px",
  borderRadius: 6,
  border: "1px solid #c7cbe0",
  background: "#fff",
  color: "#1a1f36",
  minWidth: 88,
  maxWidth: 170,
  fontFamily: "'Inter',system-ui,sans-serif",
};

const TECH_MATRIX_SORT_OPTIONS = [
  { id: "total", label: "Total MW" },
  { id: "solar", label: "Solar" },
  { id: "hybrid", label: "Hybrid" },
  { id: "fdre", label: "FDRE/RTC" },
  { id: "bess", label: "BESS/ESS" },
  { id: "wind", label: "Wind" },
];

function techMatrixSortValue(row, sortKey) {
  if (sortKey === "total") return row.total;
  const v = row[sortKey];
  return v != null && v !== "" ? v : -1;
}

/** Avaada always included; up to 10 other developers by total won MW. */
function takeTechMatrixTop11(matrix) {
  const sorted = [...(matrix || [])].sort((a, b) => b.total - a.total);
  const avaada =
    sorted.find((r) => r.dev === "Avaada") || {
      dev: "Avaada",
      solar: null,
      hybrid: null,
      fdre: null,
      bess: null,
      wind: null,
      total: 0,
      isAvaada: true,
    };
  const rest = sorted.filter((r) => r.dev !== "Avaada").slice(0, 10);
  return [avaada, ...rest];
}

function TechMixClickableLegend({ visible, onToggle, series = TECH_MIX_LEGEND_ORDER, containerStyle = {} }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px 12px",
        justifyContent: "center",
        padding: "10px 4px 4px",
        borderTop: "1px solid #f0f2f8",
        marginTop: 4,
        ...containerStyle,
      }}
    >
      {series.map(({ dataKey, label, color }) => {
        const on = visible[dataKey];
        return (
          <button
            key={dataKey}
            type="button"
            onClick={() => onToggle(dataKey)}
            title={on ? `Hide ${label}` : `Show ${label}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 11px",
              borderRadius: 6,
              border: `1px solid ${on ? color : "#dde1ee"}`,
              background: on ? `${color}22` : "#f5f6fa",
              color: on ? "#1a1f36" : C.muted,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: on ? "none" : "line-through",
              fontFamily: "'Inter',system-ui,sans-serif",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: color,
                opacity: on ? 1 : 0.35,
                flexShrink: 0,
              }}
            />
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ── SHARED COMPONENTS ────────────────────────────────────────────────────────
const Card = ({children, style={}}) => (
  <div style={{background:"#fff",border:"1px solid #dde1ee",borderRadius:8,padding:"16px 18px",boxShadow:"0 1px 4px rgba(0,0,0,.05)",marginBottom:14,...style}}>
    {children}
  </div>
);

const CardTitle = ({children, tag}) => (
  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
    <span style={{fontWeight:700,fontSize:12,letterSpacing:.3,color:"#1a1f36"}}>{children}</span>
    {tag && <span style={{background:"#f0f2f8",color:"#7b82a0",fontSize:9,fontWeight:600,padding:"2px 7px",borderRadius:3,letterSpacing:.8,textTransform:"uppercase"}}>{tag}</span>}
  </div>
);

const Note = ({children, type="info"}) => {
  const bg = type==="red" ? "#fff5f5" : type==="warn" ? "#fffbeb" : "#f0f7ff";
  const border = type==="red" ? "#d62828" : type==="warn" ? "#e07b00" : "#0077b6";
  return (
    <div style={{background:bg,borderLeft:`3px solid ${border}`,borderRadius:"0 4px 4px 0",padding:"8px 12px",fontSize:11,color:"#3d4466",lineHeight:1.6,marginTop:8}}>
      {children}
    </div>
  );
};

const ScopeBadge = ({ scope, fys: fySelection, allFys }) => {
  if (fySelection && allFys && fySelection.length < allFys.length) {
    const txt =
      fySelection.length <= 3
        ? fySelection.map((f) => f.replace("FY ", "")).join(" · ")
        : `${fySelection.length} FYs`;
    return (
      <span
        style={{
          background: "#0077b6",
          color: "#fff",
          fontSize: 9,
          fontWeight: 700,
          padding: "2px 8px",
          borderRadius: 3,
          letterSpacing: 1.2,
        }}
      >
        {txt}
      </span>
    );
  }
  const map = { all: ["#0077b6", "ALL DATA"], fy25: ["#6930c3", "FY 2025"], fy26: ["#d62828", "FY 2026"] };
  const [bg, txt] = map[scope] || map.all;
  return (
    <span
      style={{
        background: bg,
        color: "#fff",
        fontSize: 9,
        fontWeight: 700,
        padding: "2px 8px",
        borderRadius: 3,
        letterSpacing: 1.2,
      }}
    >
      {txt}
    </span>
  );
};

const KPIBox = ({label,value,sub,color}) => (
  <div style={{flex:1,background:"#f5f6fa",borderRadius:6,padding:"10px 14px",borderLeft:`3px solid ${color||C.avaada}`}}>
    <div style={{fontSize:9,color:C.muted,fontWeight:600,letterSpacing:.8,textTransform:"uppercase",marginBottom:3}}>{label}</div>
    <div style={{fontSize:20,fontWeight:800,color:color||"#1a1f36",letterSpacing:-0.5}}>{value}</div>
    {sub && <div style={{fontSize:10,color:C.muted,marginTop:2}}>{sub}</div>}
  </div>
);

const customTooltip = (unit="MW") => ({active,payload,label}) => {
  if (!active||!payload?.length) return null;
  return (
    <div style={{background:"#fff",border:"1px solid #dde1ee",borderRadius:6,padding:"8px 12px",fontSize:11,boxShadow:"0 2px 8px rgba(0,0,0,.1)"}}>
      <div style={{fontWeight:700,marginBottom:4,color:"#1a1f36"}}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{color:p.color||"#1a1f36",display:"flex",gap:8,justifyContent:"space-between"}}>
          <span>{p.name}</span><span style={{fontWeight:700}}>{typeof p.value==="number" ? p.value.toLocaleString() : p.value} {unit}</span>
        </div>
      ))}
    </div>
  );
};

const HM_AUTH_KEYS_FY25 = ["SECI", "NHPC", "NTPC", "SJVN", "GUVNL", "MSEDCL"];
const HM_AUTH_KEYS_ALL = [
  "SECI",
  "NHPC",
  "NTPC",
  "SJVN",
  "GUVNL",
  "MSEDCL",
  "MSAPL",
  "RUMSL",
  "REMCL",
  "RUVNL",
];

function mergeHmAuthMatrices(matrices, keys) {
  const devs = new Set();
  for (const m of matrices) {
    if (m && typeof m === "object") Object.keys(m).forEach((d) => devs.add(d));
  }
  const out = {};
  for (const d of devs) {
    out[d] = {};
    for (const k of keys) {
      out[d][k] = matrices.reduce((s, mat) => s + toNum(mat?.[d]?.[k]), 0);
    }
  }
  return out;
}

function mergeReiaDevs(matrices) {
  const devs = new Set();
  for (const m of matrices) {
    if (m && typeof m === "object") Object.keys(m).forEach((d) => devs.add(d));
  }
  const out = {};
  for (const d of devs) {
    let c = 0;
    let s = 0;
    for (const m of matrices) {
      const row = m?.[d];
      c += toNum(row?.["Central REIA"]);
      s += toNum(row?.["State"]);
    }
    if (c + s > 0) out[d] = { "Central REIA": c, State: s };
  }
  return out;
}

function mergeTechMatrixByDev(rowArrays) {
  const m = new Map();
  for (const rows of rowArrays) {
    for (const r of rows || []) {
      const prev =
        m.get(r.dev) || {
          dev: r.dev,
          solar: 0,
          hybrid: 0,
          fdre: 0,
          bess: 0,
          wind: 0,
          isAvaada: !!r.isAvaada,
        };
      prev.solar += toNum(r.solar);
      prev.hybrid += toNum(r.hybrid);
      prev.fdre += toNum(r.fdre);
      prev.bess += toNum(r.bess);
      prev.wind += toNum(r.wind);
      m.set(r.dev, prev);
    }
  }
  return [...m.values()]
    .map((r) => {
      const solar = r.solar || null;
      const hybrid = r.hybrid || null;
      const fdre = r.fdre || null;
      const bess = r.bess || null;
      const wind = r.wind || null;
      const total =
        toNum(solar) + toNum(hybrid) + toNum(fdre) + toNum(bess) + toNum(wind);
      return { dev: r.dev, solar, hybrid, fdre, bess, wind, total, isAvaada: r.isAvaada };
    })
    .filter((r) => r.total > 0)
    .sort((a, b) => b.total - a.total);
}

// ── HEATMAP TABLE ────────────────────────────────────────────────────────────
const HeatmapTable = ({data, keys, showTotal=true}) => {
  const allVals = Object.values(data).flatMap(row => keys.map(k => row[k]||0));
  const maxV = Math.max(...allVals, 1);
  return (
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
        <thead>
          <tr>
            <th style={{textAlign:"left",padding:"5px 8px",color:C.muted,fontWeight:600,borderBottom:"1px solid #dde1ee",fontSize:10}}>Developer</th>
            {keys.map(k=><th key={k} style={{padding:"5px 6px",color:C.muted,fontWeight:600,borderBottom:"1px solid #dde1ee",fontSize:10,textAlign:"center"}}>{k}</th>)}
            {showTotal && <th style={{padding:"5px 8px",color:C.muted,fontWeight:600,borderBottom:"1px solid #dde1ee",fontSize:10,textAlign:"right"}}>Total</th>}
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([co, row])=>{
            const total = keys.reduce((s,k)=>s+(row[k]||0),0);
            const isAv = co==="Avaada";
            return (
              <tr key={co} style={{background:isAv?"#e8f4fd":"transparent"}}>
                <td style={{padding:"5px 8px",fontWeight:isAv?700:500,color:isAv?C.avaada:"#1a1f36",borderBottom:"1px solid #f0f2f8",whiteSpace:"nowrap"}}>{co}</td>
                {keys.map(k=>{
                  const v = row[k]||0;
                  const col = hmColor(v, maxV);
                  return (
                    <td key={k} style={{padding:"4px 3px",textAlign:"center",borderBottom:"1px solid #f0f2f8"}}>
                      {v===0 ? <span style={{color:"#c5cad8",fontSize:10}}>—</span> :
                        <span style={{background:col.bg,color:col.fg,padding:"2px 6px",borderRadius:3,fontSize:10,fontWeight:600,display:"inline-block",minWidth:36}}>
                          {v>=1000 ? (v/1000).toFixed(1)+"k" : v}
                        </span>}
                    </td>
                  );
                })}
                {showTotal && <td style={{padding:"5px 8px",textAlign:"right",fontWeight:700,fontSize:11,borderBottom:"1px solid #f0f2f8",color:"#1a1f36"}}>{(total/1000).toFixed(1)}k</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// ── PILL STATUS ───────────────────────────────────────────────────────────────
const StatusPill = ({s}) => {
  const sl = s.toLowerCase();
  let bg, color;
  if (sl.includes("ppa")) { bg="#d1fae5"; color="#065f46"; }
  else if (sl.includes("loa")) { bg="#fef3c7"; color="#92400e"; }
  else if (sl.includes("cod")) { bg="#dbeafe"; color="#1e40af"; }
  else { bg="#fee2e2"; color="#991b1b"; }
  return <span style={{background:bg,color,fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:10,letterSpacing:.5,whiteSpace:"nowrap"}}>{s}</span>;
};

// ── TABS ──────────────────────────────────────────────────────────────────────
const TABS = [
  {id:"overview",label:"Market Overview"},
  {id:"technology",label:"Technology Mix"},
  {id:"connectivity",label:"Connectivity"},
  {id:"avaada",label:"Avaada Deep Dive"},
  {id:"competitive",label:"Competitive Landscape"},
  {id:"tariff",label:"Tariff Intelligence"},
  {id:"heatmap",label:"Competitor Heatmap"},
  {id:"pipeline",label:"Pipeline & Status"},
];

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function AvaadaDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [scope, setScope] = useState("all"); // all | fy25 | fy26
  const [activeFYs, setActiveFYs] = useState(new Set(ALL_FYS));
  const [excelMode, setExcelMode] = useState(false);
  const [excelData, setExcelData] = useState(null);
  /** Short status under the title (e.g. upload confirmation)—not used for load errors. */
  const [excelInfo, setExcelInfo] = useState("");
  const [workbookLoading, setWorkbookLoading] = useState(true);
  /** Set when the workbook could not be loaded (user-facing copy, no infra jargon). */
  const [workbookLoadError, setWorkbookLoadError] = useState(null);
  const [techMixVisible, setTechMixVisible] = useState(() =>
    Object.fromEntries(TECH_MIX_LEGEND_ORDER.map((x) => [x.dataKey, true]))
  );
  const [techMatrixSort, setTechMatrixSort] = useState("total");
  const [avaadaWinTechVisible, setAvaadaWinTechVisible] = useState(() =>
    Object.fromEntries(AVAADA_WIN_TECH_SERIES.map((x) => [x.dataKey, true]))
  );
  const [dealsFAuth, setDealsFAuth] = useState("");
  const [dealsFCat, setDealsFCat] = useState("");
  const [dealsFConn, setDealsFConn] = useState("");
  const [dealsFFy, setDealsFFy] = useState("");
  const [dealsFStatus, setDealsFStatus] = useState("");
  const [dealsSortCap, setDealsSortCap] = useState("");
  const [dealsSortTariff, setDealsSortTariff] = useState("");
  /** Developer × Bidding Authority: sort rows by Total (default) or by one authority column. */
  const [hmDevAuthSort, setHmDevAuthSort] = useState("total");
  /** Developer × REIA Type: sort by Total (default), Central REIA, State, or % Central. */
  const [hmReiaSort, setHmReiaSort] = useState("total");
  const excelFileInputRef = useRef(null);
  const [uploadErrorDetail, setUploadErrorDetail] = useState(null);
  const [rowLowerConfirm, setRowLowerConfirm] = useState(null);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  /** Header row from reference workbook (GET /api/dashboard-data/expected-columns). */
  const [expectedWorkbookColumns, setExpectedWorkbookColumns] = useState([]);

  const data = useMemo(() => (excelMode ? excelData : null), [excelMode, excelData]);
  const {
    FY_MARKET = {},
    AVAADA_FY = {},
    TECH_BY_FY = {},
    TARIFF_BY_TECH = {},
    CO_BY_FY = {},
    AUTH_BY_FY = {},
    AVAADA_TECH_FY = {},
    CO_TECH_TARIFF = { all:{}, fy25:{}, fy26:{} },
    HM_AUTH_ALL = {},
    HM_AUTH_FY25 = {},
    HM_AUTH_BY_FY = {},
    REIA_ALL = {},
    REIA_BY_FY = {},
    TECH_MATRIX_BY_FY = {},
    IPP_DATA = [],
    TECH_MATRIX = [],
    CONNECTIVITY_BY_FY = [],
    OVERALL_CONNECTIVITY_SPLIT = {},
    CONNECTIVITY_TARIFF = {},
    PREMIUM_DATA = [],
    BESS_INSIGHT = {},
    FDRE_LEADERS = [],
    AVAADA_METRICS = {},
    DEALS = [],
    DEALS_ALL = [],
    WORKBOOK_ROW_COUNT,
    WORKBOOK_FY_RANGE_LABEL,
    WORKBOOK_FILE_UPDATED_AT,
  } = data || {};

  const showDashboard = excelMode && data;

  /** S3 last-modified of the stored workbook (ISO), set when loading via the API. */
  const dataAsOfLabel = useMemo(() => {
    if (!WORKBOOK_FILE_UPDATED_AT) return null;
    const d = new Date(WORKBOOK_FILE_UPDATED_AT);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }, [WORKBOOK_FILE_UPDATED_AT]);

  const workbookMetaLine = useMemo(() => {
    if (WORKBOOK_ROW_COUNT == null) return null;
    const fyPart = WORKBOOK_FY_RANGE_LABEL || "—";
    return `${fyPart} · ${Number(WORKBOOK_ROW_COUNT).toLocaleString()} bid records`;
  }, [WORKBOOK_ROW_COUNT, WORKBOOK_FY_RANGE_LABEL]);

  function friendlyWorkbookLoadError(err) {
    const raw = String(err?.message || "").toLowerCase();
    if (/not configured|api base|vite_/.test(raw)) {
      return "This page isn't connected to the data service yet. Ask your administrator to check the setup.";
    }
    if (/401|403|session|sign in|unauthor|forbidden/.test(raw)) {
      return "Your session may have expired. Sign in again, then choose Refresh Data.";
    }
    if (/404|no file|no dashboard|no workbook|not stored|noSuchKey/.test(raw)) {
      return "There isn't a data file available yet. If you have the approved spreadsheet, use Upload Excel—or ask your administrator.";
    }
    if (/failed to fetch|network|load failed|could not load|econn/.test(raw)) {
      return "We couldn't reach the server. Check your internet connection, then try Refresh Data.";
    }
    return "We couldn't load the dashboard data. Check your connection, then try Refresh Data. If it keeps happening, ask your administrator.";
  }

  const refreshFromS3 = async () => {
    if (!DASHBOARD_API_BASE) {
      setWorkbookLoadError(
        "This page isn't connected to the data service yet. Ask your administrator to check the setup."
      );
      setExcelMode(false);
      setExcelData(null);
      setExcelInfo("");
      setWorkbookLoading(false);
      return;
    }
    setWorkbookLoading(true);
    setWorkbookLoadError(null);
    setExcelInfo("");
    try {
      const derived = await deriveAvaadaDataFromDashboardApi(DASHBOARD_API_BASE);
      setExcelData(derived);
      setExcelMode(true);
      setWorkbookLoadError(null);
    } catch (err) {
      setWorkbookLoadError(friendlyWorkbookLoadError(err));
      setExcelMode(false);
      setExcelData(null);
    } finally {
      setWorkbookLoading(false);
    }
  };

  const handleDownloadExcel = async () => {
    if (!DASHBOARD_API_BASE) return;
    try {
      const res = await fetch(`${DASHBOARD_API_BASE}/api/dashboard-data/xlsx`, {
        credentials: "include",
        cache: "no-store",
      });
      const ct = (res.headers.get("content-type") || "").toLowerCase();
      if (!res.ok) {
        if (ct.includes("application/json")) {
          const j = await res.json().catch(() => ({}));
          setUploadErrorDetail({
            message: j.message || `Download failed (HTTP ${res.status}).`,
          });
          return;
        }
        setUploadErrorDetail({ message: `Download failed (HTTP ${res.status}).` });
        return;
      }
      if (ct.includes("application/json")) {
        const j = await res.json().catch(() => ({}));
        setUploadErrorDetail({ message: j.message || "No file available to download." });
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "re-intel-data.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setUploadErrorDetail({ message: e?.message || "Download failed." });
    }
  };

  const postUpload = async (file, confirmLowerRowCount) => {
    if (!DASHBOARD_API_BASE) return;
    setUploadInProgress(true);
    setUploadErrorDetail(null);
    try {
      const form = new FormData();
      form.append("file", file);
      if (confirmLowerRowCount) form.append("confirmLowerRowCount", "true");
      const res = await fetch(`${DASHBOARD_API_BASE}/api/dashboard-data/upload`, {
        method: "POST",
        credentials: "include",
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 409 && data.code === "ROW_COUNT_LOWER") {
        setRowLowerConfirm({
          currentRowCount: data.currentRowCount,
          uploadedRowCount: data.uploadedRowCount,
          deficit: data.deficit,
          file,
        });
        return;
      }
      if (!res.ok) {
        setUploadErrorDetail(data);
        return;
      }
      setRowLowerConfirm(null);
      await refreshFromS3();
      setExcelInfo("Upload complete. The dashboard has been updated.");
    } catch (e) {
      setUploadErrorDetail({ message: e?.message || "Upload failed." });
    } finally {
      setUploadInProgress(false);
    }
  };

  const handleUploadExcelPick = () => {
    setUploadErrorDetail(null);
    excelFileInputRef.current?.click();
  };

  const handleExcelFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const name = file.name.toLowerCase();
    if (!name.endsWith(".xlsx")) {
      setUploadErrorDetail({
        code: "INVALID_FORMAT",
        message: "Only .xlsx files are accepted.",
      });
      return;
    }
    await postUpload(file, false);
  };

  useEffect(() => {
    refreshFromS3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!DASHBOARD_API_BASE) return;
    fetch(`${DASHBOARD_API_BASE}/api/dashboard-data/expected-columns`, {
      credentials: "include",
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((j) => {
        if (j.ok && Array.isArray(j.columns)) setExpectedWorkbookColumns(j.columns);
      })
      .catch(() => {});
  }, []);

  const setQuickScope = (s) => {
    setScope(s);
    if (s==="fy25") setActiveFYs(new Set(["FY 2025"]));
    else if (s==="fy26") setActiveFYs(new Set(["FY 2026"]));
    else setActiveFYs(new Set(ALL_FYS));
  };

  const toggleFY = (fy) => {
    setScope("all");
    setActiveFYs(prev => {
      const next = new Set(prev);
      if (next.has(fy)) { if (next.size > 1) next.delete(fy); }
      else next.add(fy);
      return next;
    });
  };

  const fys = ALL_FYS.filter(f => activeFYs.has(f));

  const heatmapAuthContext = useMemo(() => {
    const sorted = [...fys].sort();
    const byFy = HM_AUTH_BY_FY || {};
    let src = {};
    let keys = HM_AUTH_KEYS_ALL;
    const mergeMats = (fysToMerge) => {
      const mats = fysToMerge.map((fy) => byFy[fy]).filter((m) => m && Object.keys(m).length);
      if (mats.length === 0) return null;
      return mergeHmAuthMatrices(mats, HM_AUTH_KEYS_ALL);
    };
    if (sorted.length === ALL_FYS.length) {
      src = HM_AUTH_ALL || {};
      keys = HM_AUTH_KEYS_ALL;
    } else if (sorted.length === 1) {
      const fy = sorted[0];
      const single = byFy[fy];
      if (single && Object.keys(single).length) {
        src = single;
        keys = HM_AUTH_KEYS_ALL;
      } else if (fy === "FY 2025" && HM_AUTH_FY25 && Object.keys(HM_AUTH_FY25).length) {
        src = HM_AUTH_FY25;
        keys = HM_AUTH_KEYS_FY25;
      } else {
        const m = mergeMats(sorted);
        src = m && Object.keys(m).length ? m : HM_AUTH_ALL || {};
        keys = HM_AUTH_KEYS_ALL;
      }
    } else {
      const m = mergeMats(sorted);
      src = m && Object.keys(m).length ? m : HM_AUTH_ALL || {};
      keys = HM_AUTH_KEYS_ALL;
    }
    return { src, keys };
  }, [fys, HM_AUTH_BY_FY, HM_AUTH_ALL, HM_AUTH_FY25]);

  const reiaMerged = useMemo(() => {
    if (fys.length === ALL_FYS.length) return REIA_ALL || {};
    const byFy = REIA_BY_FY || {};
    const mats = fys.map((fy) => byFy[fy]).filter((m) => m && Object.keys(m).length);
    if (mats.length === 0) return REIA_ALL || {};
    return mergeReiaDevs(mats);
  }, [fys, REIA_BY_FY, REIA_ALL]);

  const connectivityFilteredRows = useMemo(
    () => (CONNECTIVITY_BY_FY || []).filter((r) => fys.includes(r.fy)),
    [CONNECTIVITY_BY_FY, fys]
  );

  const connectivityPieData = useMemo(() => {
    let ists = 0;
    let stu = 0;
    let others = 0;
    for (const r of connectivityFilteredRows) {
      ists += toNum(r.ISTS);
      stu += toNum(r.STU);
      others += toNum(r.Others);
    }
    return [
      { name: "ISTS", value: ists },
      { name: "STU", value: stu },
      { name: "Others", value: others },
    ].filter((d) => d.value > 0);
  }, [connectivityFilteredRows]);

  const connectivityFootnote = useMemo(() => {
    const ists = connectivityFilteredRows.reduce((s, r) => s + toNum(r.ISTS), 0);
    const stu = connectivityFilteredRows.reduce((s, r) => s + toNum(r.STU), 0);
    const others = connectivityFilteredRows.reduce((s, r) => s + toNum(r.Others), 0);
    const total = ists + stu + others;
    if (total <= 0) {
      return "Connectivity split for the selected fiscal years is not available in the loaded data.";
    }
    const pctI = (ists / total) * 100;
    const pctS = (stu / total) * 100;
    const pctO = others > 0 ? (others / total) * 100 : 0;
    const mw = (n) => Math.round(n).toLocaleString();
    let s = `ISTS is ${pctI.toFixed(0)}% of awarded connectivity in selection (${mw(ists)} MW). STU is ${pctS.toFixed(0)}% (${mw(stu)} MW)`;
    if (others > 0) {
      s += `; other connectivity ${pctO.toFixed(0)}% (${mw(others)} MW)`;
    }
    s += ". ";
    const prem = CONNECTIVITY_TARIFF?.stuPremiumVsIsts;
    if (prem != null && Number.isFinite(prem)) {
      if (prem > 0.005) {
        s += `Full-dataset average: ISTS clears ₹${prem.toFixed(2)}/kWh lower than STU on a capacity-weighted basis — useful context for tariff comparisons.`;
      } else if (prem < -0.005) {
        s += `Full-dataset average: ISTS is ₹${Math.abs(prem).toFixed(2)}/kWh above STU (technology and counterparty mix).`;
      } else {
        s += "Full-dataset average: ISTS and STU capacity-weighted tariffs are nearly the same.";
      }
    } else {
      s += "ISTS vs STU tariff gap could not be computed (no overlapping won capacity with tariffs on both connectivities).";
    }
    return s;
  }, [connectivityFilteredRows, CONNECTIVITY_TARIFF]);

  const techMatrixMerged = useMemo(() => {
    const byFy = TECH_MATRIX_BY_FY || {};
    if (fys.length === ALL_FYS.length) return TECH_MATRIX || [];
    const arrs = fys.map((fy) => byFy[fy]).filter((a) => a?.length);
    if (arrs.length === 0) return TECH_MATRIX || [];
    return mergeTechMatrixByDev(arrs);
  }, [fys, TECH_MATRIX_BY_FY, TECH_MATRIX]);

  const techMixBessStatsFiltered = useMemo(() => {
    let totalM = 0;
    let bessM = 0;
    for (const fy of fys) {
      totalM += toNum(FY_MARKET[fy]);
      bessM += toNum((TECH_BY_FY[fy] || {})["ESS/BESS"]);
    }
    const pct = totalM > 0 ? (bessM / totalM) * 100 : null;
    const fy25In = fys.includes("FY 2025");
    const fy26In = fys.includes("FY 2026");
    let pct25ForCompare = null;
    if (fy26In && fy25In) {
      const t25 = toNum(FY_MARKET["FY 2025"]);
      const b25 = toNum((TECH_BY_FY["FY 2025"] || {})["ESS/BESS"]);
      pct25ForCompare = t25 > 0 ? (b25 / t25) * 100 : null;
    }
    return { totalM, bessM, pct, pct25ForCompare };
  }, [fys, FY_MARKET, TECH_BY_FY]);

  // Aggregate helpers
  const sumFYs = (obj) => fys.reduce((s,f) => s+(obj[f]||0), 0);
  const authSum = (auth) => fys.reduce((s,f) => s+((AUTH_BY_FY[f]||{})[auth]||0), 0);
  const coSum = (co) => fys.reduce((s,f) => s+((CO_BY_FY[f]||{})[co]||0), 0);
  const techSum = (tech) => fys.reduce((s,f) => s+((TECH_BY_FY[f]||{})[tech]||0), 0);

  const totalMW = sumFYs(FY_MARKET);
  const avaadaMW = sumFYs(AVAADA_FY);
  const share = totalMW > 0 ? ((avaadaMW/totalMW)*100).toFixed(1) : "0";
  const peakFY =
    fys.length > 0 ? [...fys].sort((a, b) => (FY_MARKET[b] || 0) - (FY_MARKET[a] || 0))[0] : null;

  // Chart data builders
  const fyMarketData = fys.map(f=>({
    name: f.replace("FY ",""),
    "Total Market": FY_MARKET[f]||0,
    "Avaada Won": AVAADA_FY[f]||0,
  }));

  const techStackData = fys.map(f=>({
    name: f.replace("FY ",""),
    Solar: (TECH_BY_FY[f]||{}).Solar||0,
    Hybrid: (TECH_BY_FY[f]||{}).Hybrid||0,
    "RTC/FDRE": (TECH_BY_FY[f]||{})["RTC/FDRE"]||0,
    "ESS/BESS": (TECH_BY_FY[f]||{})["ESS/BESS"]||0,
    Wind: (TECH_BY_FY[f]||{}).Wind||0,
  }));

  const toggleTechMixSeries = (dataKey) => {
    setTechMixVisible((prev) => {
      if (!prev[dataKey]) return { ...prev, [dataKey]: true };
      const onCount = Object.values(prev).filter(Boolean).length;
      if (onCount <= 1) return prev;
      return { ...prev, [dataKey]: false };
    });
  };

  const techPieSelectedFys = useMemo(() => {
    const merged = {};
    for (const fy of fys) {
      const row = TECH_BY_FY[fy] || {};
      for (const { dataKey } of TECH_MIX_LEGEND_ORDER) {
        merged[dataKey] = (merged[dataKey] || 0) + toNum(row[dataKey]);
      }
    }
    return TECH_MIX_LEGEND_ORDER.map(({ dataKey, label, color }) => ({
      name: label,
      dataKey,
      value: merged[dataKey] || 0,
      color,
    })).filter((d) => d.value > 0 && techMixVisible[d.dataKey]);
  }, [TECH_BY_FY, fys, techMixVisible]);

  const techMixLastBarKey = useMemo(() => {
    const keys = TECH_MIX_LEGEND_ORDER.filter((x) => techMixVisible[x.dataKey]).map((x) => x.dataKey);
    return keys[keys.length - 1];
  }, [techMixVisible]);

  const techMatrixDisplayRows = useMemo(() => {
    const base = takeTechMatrixTop11(techMatrixMerged);
    const k = techMatrixSort;
    return [...base].sort((a, b) => techMatrixSortValue(b, k) - techMatrixSortValue(a, k));
  }, [techMatrixMerged, techMatrixSort]);

  /** BESS/ESS won MW for footnote (Technology Strategy Matrix). */
  const strategyMatrixBessMw = useMemo(() => {
    const byDev = new Map((techMatrixMerged || []).map((r) => [r.dev, r]));
    const bess = (name) => {
      const raw = byDev.get(name)?.bess;
      if (raw == null || raw === "") return null;
      const n = toNum(raw);
      return Number.isFinite(n) ? n : null;
    };
    return { jsw: bess("JSW"), greenko: bess("Greenko"), adani: bess("Adani") };
  }, [techMatrixMerged]);

  const fmtStrategyBess = (n) =>
    n != null && Number.isFinite(n) ? `${Math.round(n).toLocaleString()} MW` : "—";

  /** Tariff Trajectory card note: FY24 vs FY25 RTC/FDRE capacity-weighted mean from TARIFF_BY_TECH. */
  const tariffNoteFdreFy24Fy25 = useMemo(() => {
    const fdre = TARIFF_BY_TECH?.["RTC/FDRE"] || {};
    const v24 = toNum(fdre["FY 2024"]);
    const v25 = toNum(fdre["FY 2025"]);
    if (v24 <= 0 || v25 <= 0) return null;
    return { v24, v25 };
  }, [TARIFF_BY_TECH]);

  /** BESS long-form tariff note: trajectory % and FY spot checks from TARIFF_BY_TECH["ESS/BESS"]. */
  const bessCollapseInsight = useMemo(() => {
    const series = TARIFF_BY_TECH?.["ESS/BESS"] || {};
    const v = (fy) => toNum(series[fy]);
    const v23 = v("FY 2023");
    const v24 = v("FY 2024");
    const v25 = v("FY 2025");
    const v26 = v("FY 2026");
    let collapsePct = null;
    let fy23to26Basis = false;
    if (v23 > 0 && v26 > 0 && v23 > v26) {
      collapsePct = Math.round((1 - v26 / v23) * 100);
      fy23to26Basis = true;
    } else {
      let first = null;
      let last = null;
      for (const fy of ALL_FYS) {
        const t = v(fy);
        if (t > 0) {
          if (first == null) first = t;
          last = t;
        }
      }
      if (first != null && last != null && first > last) {
        collapsePct = Math.round((1 - last / first) * 100);
      }
    }
    return { v23, v24, v25, v26, collapsePct, fy23to26Basis };
  }, [TARIFF_BY_TECH]);

  useEffect(() => {
    setHmDevAuthSort("total");
  }, [fys.join("|")]);

  const heatmapDevAuthView = useMemo(() => {
    const src = heatmapAuthContext.src || {};
    const keys = heatmapAuthContext.keys || HM_AUTH_KEYS_ALL;
    const devTotal = (row) => keys.reduce((s, k) => s + toNum(row?.[k]), 0);
    const ranked = Object.entries(src)
      .map(([co, row]) => ({ name: co, value: devTotal(row) }))
      .filter((r) => r.value > 0)
      .sort((a, b) => b.value - a.value);
    const picked = pickTopNWithAvaada(ranked, 8);
    const pickedNames = picked.map((r) => r.name);
    const byCo = { ...src };
    const names = [...pickedNames];
    if (hmDevAuthSort === "total") {
      names.sort((a, b) => devTotal(byCo[b]) - devTotal(byCo[a]));
    } else if (keys.includes(hmDevAuthSort)) {
      names.sort((a, b) => toNum(byCo[b]?.[hmDevAuthSort]) - toNum(byCo[a]?.[hmDevAuthSort]));
    }
    const dataOut = {};
    for (const co of names) {
      if (byCo[co]) dataOut[co] = byCo[co];
    }
    return { data: dataOut, keys };
  }, [heatmapAuthContext, hmDevAuthSort]);

  /** Top 3 developers by row total; narrative lines (no MW figures) derived from top authorities. */
  const heatmapAuthTop3Note = useMemo(() => {
    const src = heatmapAuthContext.src || {};
    const keys = heatmapAuthContext.keys || HM_AUTH_KEYS_ALL;
    const topAuthNames = (row) =>
      [...keys]
        .map((k) => ({ k, v: toNum(row?.[k]) }))
        .filter((x) => x.v > 0)
        .sort((a, b) => b.v - a.v)
        .slice(0, 3)
        .map((x) => x.k);

    const formatAuthNoteLine = (co, row) => {
      const names = topAuthNames(row);
      if (!names.length) return "—";

      if (co === "Avaada") {
        const [a1, ...rest] = names;
        let s = `${a1} anchor`;
        if (rest.length) s += ` + ${rest.join(" + ")}`;
        const top3 = new Set(names);
        if (keys.includes("SECI") && !top3.has("SECI")) {
          const peers = Object.entries(src)
            .filter(([c]) => c !== "Avaada")
            .map(([c, r]) => ({ c, v: toNum(r?.SECI) }))
            .filter((p) => p.v > 0)
            .sort((a, b) => b.v - a.v)
            .slice(0, 2);
          if (peers.length >= 2) s += `; low SECI presence where ${peers[0].c} and ${peers[1].c} dominate.`;
          else if (peers.length === 1) s += `; low SECI presence where ${peers[0].c} dominates.`;
        }
        return s;
      }

      if (co === "JSW") {
        if (names[0] === "SECI") {
          const tail = names.slice(1);
          return tail.length ? `SECI-centric + ${tail.join(" + ")}` : "SECI-centric";
        }
        return names.join(" + ");
      }

      if (co === "Renew") {
        return `Most diversified — ${names.join(" + ")} across all auths.`;
      }

      return names.join(" + ");
    };

    const rows = Object.entries(src)
      .map(([co, row]) => {
        const total = keys.reduce((s, k) => s + toNum(row?.[k]), 0);
        return { co, total, row };
      })
      .filter((r) => r.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);
    return rows.map((r) => ({
      co: r.co,
      line: formatAuthNoteLine(r.co, r.row),
    }));
  }, [heatmapAuthContext]);

  /** Same Top 8 REIA devs as the table (by total Central+State MW, Avaada forced in if needed). */
  const reiaTop8DeveloperNames = useMemo(() => {
    const src = reiaMerged || {};
    const ranked = Object.entries(src)
      .map(([co, row]) => {
        const c = toNum(row["Central REIA"]);
        const s = toNum(row.State);
        return { name: co, value: c + s };
      })
      .filter((r) => r.value > 0)
      .sort((a, b) => b.value - a.value);
    const picked = pickTopNWithAvaada(ranked, 8);
    return new Set(picked.map((p) => p.name));
  }, [reiaMerged]);

  const heatmapReiaView = useMemo(() => {
    const src = reiaMerged || {};
    const top8 = reiaTop8DeveloperNames;
    const rows = Object.entries(src)
      .map(([co, row]) => {
        const c = toNum(row["Central REIA"]);
        const s = toNum(row.State);
        const t = c + s;
        const pctCentral = t > 0 ? (c / t) * 100 : 0;
        return { co, c, s, t, pctCentral };
      })
      .filter((r) => r.t > 0 && top8.has(r.co))
      .sort((a, b) => b.t - a.t);
    let eight = [...rows];
    if (hmReiaSort === "total") {
      eight = [...eight].sort((a, b) => b.t - a.t);
    } else if (hmReiaSort === "central") {
      eight = [...eight].sort((a, b) => b.c - a.c);
    } else if (hmReiaSort === "state") {
      eight = [...eight].sort((a, b) => b.s - a.s);
    } else if (hmReiaSort === "pctCentral") {
      eight = [...eight].sort((a, b) => b.pctCentral - a.pctCentral);
    }
    return { rows: eight };
  }, [reiaMerged, hmReiaSort, reiaTop8DeveloperNames]);

  const reiaInsightNote = useMemo(() => {
    const src = reiaMerged || {};
    const top8 = reiaTop8DeveloperNames;
    const devs = Object.entries(src)
      .map(([co, row]) => {
        const c = toNum(row["Central REIA"]);
        const s = toNum(row.State);
        const t = c + s;
        const pctC = t > 0 ? (c / t) * 100 : null;
        const pctS = t > 0 ? (s / t) * 100 : null;
        return { co, c, s, t, pctC, pctS };
      })
      .filter((r) => r.t > 0);

    const av = devs.find((r) => r.co === "Avaada");
    const avLine =
      av && av.pctC != null
        ? `Avaada: ${Math.round(av.pctC)}% Central REIA.`
        : "Avaada: no REIA split in loaded data.";

    const others = devs.filter((r) => top8.has(r.co) && r.co !== "Avaada");
    let line2 = null;
    let line3 = null;
    if (others.length) {
      // Rank by State / Central MW; show % only in copy. Tie-break: higher % on that side.
      const stateHeavy = [...others].sort((a, b) => {
        if (b.s !== a.s) return b.s - a.s;
        return (b.pctS ?? 0) - (a.pctS ?? 0);
      })[0];
      const centralFocused = [...others].sort((a, b) => {
        if (b.c !== a.c) return b.c - a.c;
        return (b.pctC ?? 0) - (a.pctC ?? 0);
      })[0];
      if (stateHeavy?.pctS != null) {
        line2 = `${stateHeavy.co} most state-heavy at ${Math.round(stateHeavy.pctS)}% State.`;
      }
      if (centralFocused?.pctC != null) {
        line3 = `${centralFocused.co} most central-focused at ${Math.round(centralFocused.pctC)}% Central REIA.`;
      }
    }
    return { avLine, line2, line3 };
  }, [reiaMerged, reiaTop8DeveloperNames]);

  const authRows = ["SECI", "NHPC", "NTPC", "SJVN", "GUVNL", "MSEDCL", "MSAPL", "IREDA"]
    .map((a) => ({ name: a, value: authSum(a) }))
    .sort((a, b) => b.value - a.value);
  const authColorByName = barColorsForOrderedNames(
    authRows.map((r) => r.name),
    AUTH_COLOR,
    "auth"
  );
  const authData = authRows.map((r) => ({ ...r, color: authColorByName.get(r.name) }));

  const companyKeys = Array.from(
    new Set(
      Object.values(CO_BY_FY).flatMap((row) => Object.keys(row || {})).filter((k) => k && k !== "TOTAL")
    )
  );
  const topCosRows = companyKeys
    .map((co) => ({ name: co, value: coSum(co) }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
  const topCosColorByName = barColorsForOrderedNames(topCosRows.map((r) => r.name), DEV_COLOR, "dev");
  const topCosData = topCosRows.map((r) => ({ ...r, color: topCosColorByName.get(r.name) }));

  const pipelineTopCosRows = topCosRows.slice(0, 7);
  const pipelineColorByName = barColorsForOrderedNames(
    pipelineTopCosRows.map((r) => r.name),
    DEV_COLOR,
    "dev"
  );
  const pipelineTopCos = pipelineTopCosRows.map((r) => ({
    ...r,
    color: pipelineColorByName.get(r.name),
  }));

  const selectedFyPipelineNoteFirstLine = useMemo(() => {
    const totalMarket = fys.reduce((s, f) => s + toNum(FY_MARKET[f]), 0);
    const leader = companyKeys
      .map((co) => ({
        name: co,
        value: fys.reduce((s, f) => s + toNum((CO_BY_FY[f] || {})[co]), 0),
      }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name))[0];
    const fyShort = (f) => f.replace("FY ", "");
    const fyLabel =
      fys.length === ALL_FYS.length
        ? "All fiscal years"
        : fys.length === 1
          ? `FY${fyShort(fys[0])}`
          : `${fys.length} selected fiscal years`;
    if (totalMarket <= 0) {
      return `${fyLabel}: award totals are not available in the loaded data.`;
    }
    if (!leader) {
      return `${fyLabel}: ${totalMarket.toLocaleString()} MW awarded to date;`;
    }
    const earlySingle = fys.length === 1 && fys[0] === "FY 2026";
    const prefix = earlySingle
      ? `${fyLabel} is early-stage with ${totalMarket.toLocaleString()} MW awarded to date.`
      : `${fyLabel}: ${totalMarket.toLocaleString()} MW awarded to date.`;
    return `${prefix} ${leader.name} leads at ${leader.value.toLocaleString()} MW;`;
  }, [fys, FY_MARKET, CO_BY_FY, companyKeys]);

  const fdreLeadersFiltered = useMemo(
    () =>
      techMatrixMerged
        .map((r) => ({ name: r.dev, v: toNum(r.fdre) }))
        .filter((x) => x.v > 0)
        .sort((a, b) => b.v - a.v)
        .slice(0, 7),
    [techMatrixMerged]
  );

  const fysTagLabel =
    fys.length === ALL_FYS.length ? "All FY" : fys.map((f) => f.replace("FY ", "")).join(" · ");

  const tariffLines = fys.map(f=>({
    name: f.replace("FY ",""),
    Solar: (TARIFF_BY_TECH.Solar||{})[f]||null,
    Hybrid: (TARIFF_BY_TECH.Hybrid||{})[f]||null,
    "RTC/FDRE": (TARIFF_BY_TECH["RTC/FDRE"]||{})[f]||null,
    "ESS/BESS": (TARIFF_BY_TECH["ESS/BESS"]||{})[f]||null,
    Wind: (TARIFF_BY_TECH.Wind||{})[f]||null,
  }));

  const tariffScope = scope==="fy25"?"fy25":scope==="fy26"?"fy26":"all";
  const tariffData = CO_TECH_TARIFF[tariffScope] || {};
  const tariffCos = Object.entries(tariffData)
    .map(([co, buckets])=>({
      co,
      cap: Object.values(buckets || {}).reduce((s,v)=>s + (v?.c || 0), 0)
    }))
    .filter((x)=>x.cap>0)
    .sort((a,b)=>b.cap-a.cap)
    .slice(0,6)
    .map((x)=>x.co);
  const tariffCats = ["Solar","Hybrid","RTC/FDRE"];
  const colStats = {};
  tariffCats.forEach(cat=>{
    const vals = tariffCos.map(co=>tariffData[co]&&tariffData[co][cat]?tariffData[co][cat].t:null).filter(v=>v!==null);
    colStats[cat] = vals.length ? {min:Math.min(...vals),max:Math.max(...vals)} : {min:0,max:0};
  });
  const overall = (co) => {
    const d = tariffData[co]; if (!d) return null;
    let sw = 0, st = 0;
    tariffCats.forEach((c) => {
      if (d[c]) { st += d[c].t * d[c].c; sw += d[c].c; }
    });
    if (sw <= 0) return null;
    return (Math.round((st / sw) * 100) / 100).toFixed(2);
  };

  const avaadaTechData = useMemo(
    () =>
      fys.map((f) => ({
        name: f.replace("FY ", ""),
        Solar: (AVAADA_TECH_FY[f] || {}).Solar || 0,
        Hybrid: (AVAADA_TECH_FY[f] || {}).Hybrid || 0,
        "RTC/FDRE": (AVAADA_TECH_FY[f] || {})["RTC/FDRE"] || 0,
        Wind: (AVAADA_TECH_FY[f] || {}).Wind || 0,
      })),
    [fys, AVAADA_TECH_FY]
  );

  const toggleAvaadaWinTech = (dataKey) => {
    setAvaadaWinTechVisible((prev) => {
      if (!prev[dataKey]) return { ...prev, [dataKey]: true };
      const onCount = AVAADA_WIN_TECH_SERIES.filter((x) => prev[x.dataKey]).length;
      if (onCount <= 1) return prev;
      return { ...prev, [dataKey]: false };
    });
  };

  const avaadaWinTechLastKey = useMemo(() => {
    const keys = AVAADA_WIN_TECH_SERIES.filter((x) => avaadaWinTechVisible[x.dataKey]).map((x) => x.dataKey);
    return keys[keys.length - 1];
  }, [avaadaWinTechVisible]);

  const avaadaTechPieFiltered = useMemo(() => {
    return AVAADA_WIN_TECH_SERIES.map(({ dataKey, label, color }) => ({
      name: label,
      dataKey,
      value: fys.reduce((s, fy) => s + toNum((AVAADA_TECH_FY[fy] || {})[dataKey]), 0),
      color,
    })).filter((d) => d.value > 0 && avaadaWinTechVisible[d.dataKey]);
  }, [AVAADA_TECH_FY, avaadaWinTechVisible, fys]);

  /** Top 16 by cap for current Status (Both = overall top 16 from DEALS). */
  const keyDealsTop16Pool = useMemo(() => {
    const full = DEALS_ALL.length > 0 ? DEALS_ALL : DEALS;
    if (dealsFStatus === "loa" || dealsFStatus === "ppa") {
      return full
        .filter((d) => {
          const sl = String(d.s ?? "").toLowerCase();
          if (dealsFStatus === "loa") return sl.includes("loa");
          return sl.includes("ppa");
        })
        .sort((a, b) => b.cap - a.cap)
        .slice(0, 16);
    }
    return [...DEALS];
  }, [DEALS, DEALS_ALL, dealsFStatus]);

  const dealsFilterOptions = useMemo(() => {
    const pool = keyDealsTop16Pool;
    const auth = [...new Set(pool.map((d) => d.a).filter(Boolean))].sort();
    const cat = [...new Set(pool.map((d) => d.c).filter(Boolean))].sort();
    const cn = [...new Set(pool.map((d) => d.cn).filter(Boolean))].sort();
    const fy = [...new Set(pool.map((d) => d.fy).filter(Boolean))].sort();
    return { auth, cat, cn, fy };
  }, [keyDealsTop16Pool]);

  const keyDealsFiltered = useMemo(() => {
    let rows = keyDealsTop16Pool.filter((d) => {
      if (dealsFAuth && d.a !== dealsFAuth) return false;
      if (dealsFCat && d.c !== dealsFCat) return false;
      if (dealsFConn && d.cn !== dealsFConn) return false;
      if (dealsFFy && d.fy !== dealsFFy) return false;
      return true;
    });
    if (dealsSortCap === "asc") rows = [...rows].sort((a, b) => a.cap - b.cap);
    else if (dealsSortCap === "desc") rows = [...rows].sort((a, b) => b.cap - a.cap);
    else if (dealsSortTariff === "asc") rows = [...rows].sort((a, b) => a.ta - b.ta);
    else if (dealsSortTariff === "desc") rows = [...rows].sort((a, b) => b.ta - a.ta);
    return rows;
  }, [
    keyDealsTop16Pool,
    dealsFAuth,
    dealsFCat,
    dealsFConn,
    dealsFFy,
    dealsSortCap,
    dealsSortTariff,
  ]);

  const mktSharePie = useMemo(() => {
    const rows = companyKeys
      .map((co) => ({
        name: co,
        value: fys.reduce((s, f) => s + toNum((CO_BY_FY[f] || {})[co]), 0),
      }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);
    const picked = pickTopNWithAvaada(rows, 10);
    const colorByName = barColorsForOrderedNames(picked.map((r) => r.name), DEV_COLOR, "mktShare");
    return picked.map((d) => ({
      name: d.name,
      value: d.value,
      color: colorByName.get(d.name),
    }));
  }, [companyKeys, fys, CO_BY_FY]);

  const ippChartData = useMemo(() => {
    return (IPP_DATA || [])
      .map((d) => ({ c: d.c, op: toNum(d.op), uc: toNum(d.uc) }))
      .filter((d) => d.op > 0 && d.uc > 0)
      .map((d) => ({ ...d, ratio: (d.op / d.uc) * 100, total: d.op + d.uc }))
      .sort((a, b) => b.ratio - a.ratio)
      .slice(0, 9)
      .sort((a, b) => b.total - a.total);
  }, [IPP_DATA]);

  /** Avaada IPP footnote: operational % of Op+UC, unexecuted %, and Op÷UC ratio from loaded IPP rows. */
  const ippAvaadaInsight = useMemo(() => {
    const rows = (IPP_DATA || [])
      .map((d) => ({ c: String(d.c ?? "").trim(), op: toNum(d.op), uc: toNum(d.uc) }))
      .filter((d) => d.c && d.op > 0 && d.uc > 0);
    const av = rows.find((r) => r.c === "Avaada");
    if (!av) return null;
    const base = av.op + av.uc;
    const opShare = (av.op / base) * 100;
    const unexShare = (av.uc / base) * 100;
    const ratioOpUc = (av.op / av.uc) * 100;
    return { opShare, unexShare, ratioOpUc };
  }, [IPP_DATA]);

  const premiumData = PREMIUM_DATA.map(d=>({...d,fill:d.p===0?C.wind+"99":d.p<=1?"#f5a623cc":d.p<=5?C.jsw+"cc":C.bess+"cc"}));

  const fdreBarColorByName = barColorsForOrderedNames(
    fdreLeadersFiltered.map((d) => d.name),
    DEV_COLOR,
    "dev"
  );

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div style={{background:"#f5f6fa",minHeight:"100vh",fontFamily:"'Inter',system-ui,sans-serif",fontSize:13,color:"#1a1f36"}}>

      {/* HEADER */}
      <div style={{background:"#fff",borderBottom:"2px solid #dde1ee",padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:300,boxShadow:"0 1px 6px rgba(0,0,0,.06)"}}>
        <div>
          <span style={{fontWeight:800,fontSize:17,color:C.avaada,letterSpacing:-.5}}>Avaada</span>
          <span style={{color:C.muted,fontWeight:400,marginLeft:6,fontSize:13}}>RE Competitive Intelligence</span>
          {workbookLoading && !showDashboard ? (
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Loading your data…</div>
          ) : workbookLoading && showDashboard ? (
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Updating data…</div>
          ) : workbookLoadError ? (
            <div style={{ fontSize: 11, color: "#b45309", marginTop: 4 }}>Couldn't load your data</div>
          ) : excelInfo ? (
            <div style={{ fontSize: 11, color: excelMode ? "#0f766e" : C.muted, marginTop: 4 }}>{excelInfo}</div>
          ) : null}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <input
            ref={excelFileInputRef}
            type="file"
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            style={{ display: "none" }}
            onChange={handleExcelFileChange}
          />
          <button
            type="button"
            onClick={handleDownloadExcel}
            disabled={uploadInProgress}
            style={{
              padding:"7px 12px",
              borderRadius:6,
              border:"1px solid #c7cbe0",
              background:"#fff",
              color:"#1f2a44",
              fontSize:11,
              fontWeight:700,
              cursor: uploadInProgress ? "default" : "pointer",
              opacity: uploadInProgress ? 0.6 : 1,
            }}
          >
            Download Excel
          </button>
          <button
            type="button"
            onClick={() => refreshFromS3()}
            disabled={uploadInProgress}
            style={{
              padding:"7px 12px",
              borderRadius:6,
              border:"1px solid #c7cbe0",
              background:"#fff",
              color:"#1f2a44",
              fontSize:11,
              fontWeight:700,
              cursor: uploadInProgress ? "default" : "pointer",
              opacity: uploadInProgress ? 0.6 : 1,
            }}
          >
            Refresh Data
          </button>
          <button
            type="button"
            onClick={handleUploadExcelPick}
            disabled={uploadInProgress}
            style={{
              padding:"7px 12px",
              borderRadius:6,
              border:`1px solid ${C.avaada}`,
              background:"#e8f4fd",
              color:C.avaada,
              fontSize:11,
              fontWeight:700,
              cursor: uploadInProgress ? "default" : "pointer",
              opacity: uploadInProgress ? 0.6 : 1,
            }}
          >
            {uploadInProgress ? "Uploading…" : "Upload Excel"}
          </button>
          <div style={{fontSize:10,color:C.muted,textAlign:"right",lineHeight:1.7}}>
            <strong style={{ color: "#3d4466" }}>
              {dataAsOfLabel ? `Data as of ${dataAsOfLabel}` : "Data: —"}
            </strong>
            <br />
            {workbookMetaLine || "—"}
          </div>
        </div>
      </div>

      {workbookLoading && !showDashboard ? (
        <div
          style={{
            padding: "56px 24px",
            maxWidth: 520,
            margin: "24px auto",
            textAlign: "center",
            color: C.muted,
            fontSize: 14,
          }}
        >
          Loading your data…
        </div>
      ) : !showDashboard ? (
        <div
          style={{
            padding: "24px",
            maxWidth: 640,
            margin: "16px auto",
            background: "#fff",
            border: "1px solid #dde1ee",
            borderRadius: 10,
          }}
        >
          <h3 style={{ marginTop: 0, color: "#1a1f36" }}>We couldn't load your data</h3>
          <p style={{ marginBottom: 0, color: "#475569", lineHeight: 1.6 }}>
            {workbookLoadError || "Something went wrong. Try Refresh Data, or ask your administrator."}
          </p>
          <p style={{ marginTop: 16, marginBottom: 0, color: "#64748b", fontSize: 12, lineHeight: 1.6 }}>
            Try <strong>Refresh Data</strong> above. Use <strong>Download Excel</strong> to save the current spreadsheet
            (if there is one), or <strong>Upload Excel</strong> to add or replace the file. Uploads must be{" "}
            <strong>.xlsx</strong> with the same {expectedWorkbookColumns.length || 23} column headings as our template
            (order doesn't matter; each name once—no extras or gaps). If an upload is rejected, the message lists what
            to fix.
          </p>
        </div>
      ) : null}

      {uploadErrorDetail ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.45)",
            zIndex: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setUploadErrorDetail(null)}
          onKeyDown={(e) => e.key === "Escape" && setUploadErrorDetail(null)}
          role="presentation"
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              maxWidth: 520,
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              padding: "20px 22px",
              boxShadow: "0 12px 40px rgba(0,0,0,.15)",
              border: "1px solid #dde1ee",
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-error-title"
          >
            <h3 id="upload-error-title" style={{ marginTop: 0, fontSize: 16 }}>
              Upload not accepted
            </h3>
            <p style={{ color: "#334155", fontSize: 13, lineHeight: 1.55 }}>
              {uploadErrorDetail.message || "The file could not be uploaded."}
            </p>
            {uploadErrorDetail.duplicateHeaders?.length ? (
              <div style={{ marginTop: 12 }}>
                <strong style={{ fontSize: 12 }}>Duplicate headers (each name must appear once):</strong>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18, fontSize: 12, color: "#475569" }}>
                  {uploadErrorDetail.duplicateHeaders.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {uploadErrorDetail.missingColumns?.length ? (
              <div style={{ marginTop: 12 }}>
                <strong style={{ fontSize: 12 }}>Missing columns:</strong>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18, fontSize: 12, color: "#475569" }}>
                  {uploadErrorDetail.missingColumns.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {uploadErrorDetail.extraColumns?.length ? (
              <div style={{ marginTop: 12 }}>
                <strong style={{ fontSize: 12 }}>Extra columns (not in template):</strong>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18, fontSize: 12, color: "#475569" }}>
                  {uploadErrorDetail.extraColumns.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div style={{ marginTop: 16 }}>
              <strong style={{ fontSize: 12 }}>
                {(() => {
                  const n =
                    uploadErrorDetail.expectedColumns?.length ?? expectedWorkbookColumns.length;
                  return n ? `Reference column set (${n}):` : "Reference column set:";
                })()}
              </strong>
              <p style={{ fontSize: 11, color: "#64748b", margin: "6px 0 0", lineHeight: 1.5 }}>
                {(uploadErrorDetail.expectedColumns?.length
                  ? uploadErrorDetail.expectedColumns
                  : expectedWorkbookColumns
                ).join(" · ") || "—"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setUploadErrorDetail(null)}
              style={{
                marginTop: 18,
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                background: C.avaada,
                color: "#fff",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      {rowLowerConfirm ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.45)",
            zIndex: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          role="presentation"
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              maxWidth: 440,
              width: "100%",
              padding: "20px 22px",
              boxShadow: "0 12px 40px rgba(0,0,0,.15)",
              border: "1px solid #dde1ee",
            }}
            role="dialog"
            aria-modal="true"
          >
            <h3 style={{ marginTop: 0, fontSize: 16 }}>Fewer rows than current file</h3>
            <p style={{ color: "#334155", fontSize: 13, lineHeight: 1.55 }}>
              The uploaded file has <strong>{rowLowerConfirm.deficit}</strong> fewer data row
              {rowLowerConfirm.deficit === 1 ? "" : "s"} than the file we already have (
              <strong>{rowLowerConfirm.uploadedRowCount}</strong> vs <strong>{rowLowerConfirm.currentRowCount}</strong>
              ). Replace it anyway?
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 18, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setRowLowerConfirm(null)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 6,
                  border: "1px solid #c7cbe0",
                  background: "#fff",
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const f = rowLowerConfirm.file;
                  setRowLowerConfirm(null);
                  await postUpload(f, true);
                }}
                style={{
                  padding: "8px 14px",
                  borderRadius: 6,
                  border: "none",
                  background: "#b45309",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Proceed with upload
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* SCOPE BAR */}
      <div style={{background:"#fff",borderBottom:"1px solid #dde1ee",padding:"0 24px",display:"flex",alignItems:"center",gap:0,position:"sticky",top:55,zIndex:200}}>
        {[["all","All FY","s-all"],["fy25","FY 2025","s-fy25"],["fy26","FY 2026","s-fy26"]].map(([s,label])=>{
          const active = scope===s;
          const col = s==="fy25"?"#6930c3":s==="fy26"?"#d62828":"#0077b6";
          return (
            <button key={s} onClick={()=>setQuickScope(s)} style={{
              padding:"10px 18px",fontSize:11,fontWeight:600,letterSpacing:.8,color:active?col:C.muted,
              background:"none",border:"none",borderBottom:active?`3px solid ${col}`:"3px solid transparent",
              cursor:"pointer",textTransform:"uppercase",transition:"all .15s",
            }}>{label}</button>
          );
        })}
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:10,color:C.muted,fontWeight:600,letterSpacing:.8}}>FY</span>
          {ALL_FYS.map(fy=>{
            const active = activeFYs.has(fy);
            return (
              <button key={fy} onClick={()=>toggleFY(fy)} style={{
                padding:"3px 10px",fontSize:10,fontWeight:600,
                background:active?C.avaada:"#f0f2f8",
                border:`1.5px solid ${active?C.avaada:"#c8cde0"}`,
                borderRadius:20,cursor:"pointer",color:active?"#fff":C.muted,transition:"all .15s",
              }}>{fy.replace("FY ","")}</button>
            );
          })}
        </div>
      </div>

      {/* NAV TABS */}
      <div style={{background:"#fff",borderBottom:"1px solid #dde1ee",padding:"0 24px",display:"flex",gap:0,overflowX:"auto"}}>
        {TABS.map(tab=>{
          const active = activeTab===tab.id;
          return (
            <button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{
              padding:"9px 16px",fontSize:11,fontWeight:600,color:active?C.avaada:C.muted,
              background:"none",border:"none",borderBottom:active?`2px solid ${C.avaada}`:"2px solid transparent",
              cursor:"pointer",whiteSpace:"nowrap",transition:"all .15s",
            }}>{tab.label}</button>
          );
        })}
      </div>

      {/* CONTENT */}
      {excelMode && data ? (
      <div style={{padding:"20px 24px",maxWidth:1280,margin:"0 auto"}}>

        {/* ── MARKET OVERVIEW ── */}
        {activeTab==="overview" && (
          <div>
            <div style={{marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:14,fontWeight:700,color:"#1a1f36"}}>Market Overview</span>
              <ScopeBadge scope={scope} fys={fys} allFys={ALL_FYS}/>
            </div>
            <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
              <KPIBox label="Total Market" value={fmt(totalMW)+" MW"} sub="All categories won" color={C.avaada}/>
              <KPIBox label="Peak Year" value={peakFY ? peakFY.replace("FY ","FY ") : "—"} sub={peakFY?fmt(FY_MARKET[peakFY])+" MW":""} color={C.hybrid}/>
              <KPIBox label="Avaada Won" value={fmt(avaadaMW)+" MW"} sub="Across selected FYs" color={C.avaada}/>
              <KPIBox label="Avaada Market Share" value={share+"%"} sub="Of total awarded capacity" color={C.wind}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <Card>
                <CardTitle tag={`${fys.length===6?"ALL FY":fys.map(f=>f.replace("FY ","FY")).join(", ")} · MW`}>Annual Market vs Avaada Won</CardTitle>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={fyMarketData} margin={{top:5,right:10,bottom:5,left:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaecf4"/>
                    <XAxis dataKey="name" tick={{fontSize:10,fill:C.muted}}/>
                    <YAxis tickFormatter={v=>(v/1000)+"k"} tick={{fontSize:10,fill:C.muted}}/>
                    <Tooltip content={customTooltip("MW")}/>
                    <Legend wrapperStyle={{fontSize:10,color:C.muted}}/>
                    <Bar dataKey="Total Market" fill="#bdd7ee" stroke={C.avaada} strokeWidth={1.5} radius={[3,3,0,0]}/>
                    <Bar dataKey="Avaada Won" fill={C.avaada} stroke="#005a8a" strokeWidth={1} radius={[3,3,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <CardTitle tag={`${fysTagLabel} · Won MW`}>Top Bidding Authorities</CardTitle>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={authData} layout="vertical" margin={{top:5,right:30,bottom:5,left:10}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaecf4" horizontal={false}/>
                    <XAxis type="number" tickFormatter={v=>(v/1000)+"k"} tick={{fontSize:10,fill:C.muted}}/>
                    <YAxis type="category" dataKey="name" tick={{fontSize:10,fill:C.muted}} width={55}/>
                    <Tooltip content={customTooltip("MW")}/>
                    <Bar dataKey="value" radius={[0,3,3,0]}>
                      {authData.map((d, i) => (
                        <Cell key={i} fill={d.color} fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
            <Card>
              <CardTitle tag={`${fysTagLabel} · Won MW`}>Top Developers by Won Capacity</CardTitle>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topCosData} layout="vertical" margin={{top:5,right:30,bottom:5,left:10}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eaecf4" horizontal={false}/>
                  <XAxis type="number" tickFormatter={v=>(v/1000)+"k"} tick={{fontSize:10,fill:C.muted}}/>
                  <YAxis type="category" dataKey="name" tick={{fontSize:10,fill:C.muted}} width={65}/>
                  <Tooltip content={customTooltip("MW")}/>
                  <Bar dataKey="value" radius={[0,3,3,0]}>
                    {topCosData.map((d,i)=><Cell key={i} fill={d.color} fillOpacity={0.75}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* ── TECHNOLOGY MIX ── */}
        {activeTab==="technology" && (
          <div>
            <div style={{marginBottom:10,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <span style={{fontSize:14,fontWeight:700}}>Technology Mix</span>
              <ScopeBadge scope={scope} fys={fys} allFys={ALL_FYS}/>
            </div>
            <p style={{fontSize:11,color:C.muted,margin:"0 0 12px",lineHeight:1.5}}>
              Use the toggles below to show or hide series in the annual stack and in the technology pie for the selected fiscal years (at least one series must stay on).
            </p>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14}}>
              <Card style={{marginBottom:0}}>
                <CardTitle tag="Stacked MW by tech">Annual Technology Stack</CardTitle>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={techStackData} margin={{top:5,right:10,bottom:5,left:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaecf4"/>
                    <XAxis dataKey="name" tick={{fontSize:10,fill:C.muted}}/>
                    <YAxis tickFormatter={v=>(v/1000)+"k"} tick={{fontSize:10,fill:C.muted}}/>
                    <Tooltip content={customTooltip("MW")}/>
                    {TECH_MIX_LEGEND_ORDER.map(({ dataKey, label, color }) => {
                      if (!techMixVisible[dataKey]) return null;
                      const isLast = dataKey === techMixLastBarKey;
                      return (
                        <Bar
                          key={dataKey}
                          dataKey={dataKey}
                          name={label}
                          stackId="a"
                          fill={color+"cc"}
                          stroke={color}
                          strokeWidth={1}
                          radius={isLast ? [3,3,0,0] : [0,0,0,0]}
                        />
                      );
                    })}
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <Card style={{marginBottom:0}}>
                  <CardTitle tag={`${fysTagLabel} · MW`}>Technology mix · selected FYs</CardTitle>
                  {techPieSelectedFys.length === 0 ? (
                    <div style={{height:260,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted,fontSize:11,padding:"0 10px",textAlign:"center"}}>
                      No visible segments for the selected fiscal years — enable technologies with capacity in the selection.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={techPieSelectedFys}
                          dataKey="value"
                          nameKey="name"
                          cx="40%"
                          cy="50%"
                          outerRadius={85}
                          innerRadius={48}
                        >
                          {techPieSelectedFys.map((d, i) => (
                            <Cell key={i} fill={d.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => [`${Number(v).toLocaleString()} MW`, "Capacity"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </Card>
              </div>
            </div>
            <div
              style={{
                background:"#fff",
                border:"1px solid #dde1ee",
                borderRadius:8,
                padding:"12px 14px 14px",
                marginBottom:14,
                boxShadow:"0 1px 4px rgba(0,0,0,.05)",
              }}
            >
              <div style={{fontSize:10,color:C.muted,fontWeight:600,textAlign:"center",letterSpacing:0.3,marginBottom:8,textTransform:"uppercase"}}>
                Technologies — click to toggle
              </div>
              <TechMixClickableLegend visible={techMixVisible} onToggle={toggleTechMixSeries} />
            </div>
            <Note>
              <strong>BESS / selection:</strong>{" "}
              {techMixBessStatsFiltered.pct != null && techMixBessStatsFiltered.totalM > 0 ? (
                <>
                  BESS/ESS = {Math.round(techMixBessStatsFiltered.pct)}% of awards in the selected FYs (
                  {Math.round(techMixBessStatsFiltered.bessM).toLocaleString()} MW of{" "}
                  {Math.round(techMixBessStatsFiltered.totalM).toLocaleString()} MW total)
                  {techMixBessStatsFiltered.pct25ForCompare != null &&
                  fys.includes("FY 2026") &&
                  fys.includes("FY 2025") ? (
                    <>, vs {Math.round(techMixBessStatsFiltered.pct25ForCompare)}% in FY25 alone</>
                  ) : null}
                  {" "}
                  — standalone storage tenders weigh heavily when FY26 is in the mix.
                </>
              ) : (
                <>Award totals for the selected fiscal years are not available — BESS/ESS share cannot be computed.</>
              )}
            </Note>

            {/* Technology Strategy Matrix */}
            <Card style={{marginTop:14}}>
              <CardTitle tag={`Top 11 developers · ${fysTagLabel} · Won MW`}>Technology Strategy Matrix</CardTitle>
              <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:8,marginBottom:12}}>
                <span style={{fontSize:10,color:C.muted,fontWeight:600}}>Sort by</span>
                {TECH_MATRIX_SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTechMatrixSort(opt.id)}
                    style={{
                      padding:"5px 11px",
                      borderRadius:6,
                      border:`1px solid ${techMatrixSort === opt.id ? C.avaada : "#c7cbe0"}`,
                      background: techMatrixSort === opt.id ? "#e8f4fd" : "#fff",
                      color: techMatrixSort === opt.id ? C.avaada : "#1a1f36",
                      fontSize:11,
                      fontWeight: techMatrixSort === opt.id ? 700 : 500,
                      cursor:"pointer",
                      fontFamily:"'Inter',system-ui,sans-serif",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead>
                    <tr style={{borderBottom:"1px solid #dde1ee"}}>
                      {["Developer",<span key="h-s" style={{color:C.solar}}>Solar</span>,<span key="h-y" style={{color:C.hybrid}}>Hybrid</span>,<span key="h-f" style={{color:C.fdre}}>FDRE/RTC</span>,<span key="h-b" style={{color:C.bess}}>BESS/ESS</span>,<span key="h-w" style={{color:C.wind}}>Wind</span>,"Total","BESS %"].map((h,i)=>(
                        <th key={i} style={{textAlign:i===0?"left":"right",padding:"5px 8px",color:C.muted,fontWeight:600,fontSize:10}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {techMatrixDisplayRows.map((row) => {
                      const bessPct = row.bess ? Math.round(row.bess/row.total*100) : null;
                      const isAv = row.isAvaada;
                      return (
                        <tr key={row.dev} style={{background:isAv?"#e8f4fd":"transparent",borderBottom:"1px solid #f0f2f8"}}>
                          <td style={{padding:"5px 8px",fontWeight:isAv?800:600,color:isAv?C.avaada:"#1a1f36"}}>{row.dev}</td>
                          {[row.solar,row.hybrid,row.fdre].map((v,i)=>(
                            <td key={i} style={{textAlign:"right",padding:"5px 8px",color:"#3d4466"}}>{v?.toLocaleString()||"—"}</td>
                          ))}
                          <td style={{textAlign:"right",padding:"5px 8px",fontWeight:row.bess?600:400,color:row.bess?C.bess:C.muted}}>
                            {row.bess?.toLocaleString()||"—"}
                          </td>
                          <td style={{textAlign:"right",padding:"5px 8px",color:"#3d4466"}}>{row.wind?.toLocaleString()||"—"}</td>
                          <td style={{textAlign:"right",padding:"5px 8px",fontWeight:700,color:"#1a1f36"}}>{row.total.toLocaleString()}</td>
                          <td style={{textAlign:"right",padding:"5px 8px",fontWeight:600,color:bessPct?C.bess:C.muted}}>
                            {bessPct ? `${bessPct}%` : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Note>
                Avaada&apos;s portfolio is concentrated in Solar, Hybrid and FDRE/RTC — segments where it holds a strong track record. JSW ({fmtStrategyBess(strategyMatrixBessMw.jsw)}), Greenko ({fmtStrategyBess(strategyMatrixBessMw.greenko)}) and Adani ({fmtStrategyBess(strategyMatrixBessMw.adani)}) have been active in BESS alongside their core portfolios. Greenko, Torrent and Patel Infra are largely storage-specialist developers. BESS is shown for reference — it is a structurally different market requiring different balance-sheet, EPC and technology capabilities.
              </Note>
            </Card>
          </div>
        )}

        {/* ── CONNECTIVITY ── */}
        {activeTab==="connectivity" && (
          <div>
            <div style={{marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:14,fontWeight:700}}>Connectivity Analysis</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <Card>
                <CardTitle tag={`${fysTagLabel} · MW`}>ISTS vs STU by Year</CardTitle>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={connectivityFilteredRows.map((r)=>({
                      name:r.fy.replace("FY ","FY"),
                      ISTS:r.ISTS,
                      STU:r.STU+toNum(r.Others),
                    }))}
                    margin={{top:5,right:10,bottom:5,left:0}}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaecf4"/>
                    <XAxis dataKey="name" tick={{fontSize:10,fill:C.muted}}/>
                    <YAxis tickFormatter={v=>(v/1000)+"k"} tick={{fontSize:10,fill:C.muted}}/>
                    <Tooltip content={customTooltip("MW")}/>
                    <Legend wrapperStyle={{fontSize:10}}/>
                    <Bar dataKey="ISTS" fill={C.ists+"99"} stroke={C.ists} strokeWidth={1.5} radius={[2,2,0,0]}/>
                    <Bar dataKey="STU" fill={C.stu+"99"} stroke={C.stu} strokeWidth={1.5} radius={[2,2,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <CardTitle tag={fysTagLabel}>Connectivity split · selection</CardTitle>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={connectivityPieData}
                      cx="40%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value">
                      {connectivityPieData.map((d, i) => (
                        <Cell key={i} fill={connectivitySplitFill(d.name)} />
                      ))}
                    </Pie>
                    <Legend iconSize={10} wrapperStyle={{fontSize:10}} layout="vertical" align="right" verticalAlign="middle"/>
                    <Tooltip formatter={(v)=>[v.toLocaleString()+" MW"]}/>
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
            <Note>{connectivityFootnote}</Note>
          </div>
        )}

        {/* ── AVAADA DEEP DIVE ── */}
        {activeTab==="avaada" && (
          <div>
            <div style={{marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:14,fontWeight:700}}>Avaada Deep Dive</span>
            </div>
            <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
              <KPIBox label="Total Won (All FY)" value={`${fmt(toNum(AVAADA_METRICS.totalWon))} MW`} sub="All-time from data · IPP mix is point-in-time" color={C.avaada}/>
              <KPIBox
                label="Win Rate"
                value={`${toNum(AVAADA_METRICS.winRate).toFixed(1)}%`}
                sub={`${toNum(AVAADA_METRICS.bidsWon)} / ${toNum(AVAADA_METRICS.totalBids)} bids won`}
                color={C.wind}
              />
              <KPIBox label="LoA Issued" value={`${fmt(toNum(AVAADA_METRICS.loaIssued))} MW`} sub="PPA not yet signed" color={C.jsw}/>
              <KPIBox label="PPA Signed" value={`${fmt(toNum(AVAADA_METRICS.ppaSigned))} MW`} sub="Pipeline secured" color={C.ntpc}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,marginBottom:14}}>
              <Card>
                <CardTitle tag={`${fysTagLabel} · Won MW`}>Avaada Win by Technology per FY</CardTitle>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={avaadaTechData} margin={{top:5,right:10,bottom:5,left:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaecf4"/>
                    <XAxis dataKey="name" tick={{fontSize:10,fill:C.muted}}/>
                    <YAxis tickFormatter={v=>(v/1000)+"k"} tick={{fontSize:10,fill:C.muted}}/>
                    <Tooltip content={customTooltip("MW")}/>
                    {AVAADA_WIN_TECH_SERIES.map(({ dataKey, label, color }) => {
                      if (!avaadaWinTechVisible[dataKey]) return null;
                      const isLast = dataKey === avaadaWinTechLastKey;
                      return (
                        <Bar
                          key={dataKey}
                          dataKey={dataKey}
                          name={label}
                          stackId="a"
                          fill={color + "bb"}
                          stroke={color}
                          strokeWidth={1.5}
                          radius={isLast ? [3, 3, 0, 0] : [0, 0, 0, 0]}
                        />
                      );
                    })}
                  </BarChart>
                </ResponsiveContainer>
                <TechMixClickableLegend
                  visible={avaadaWinTechVisible}
                  onToggle={toggleAvaadaWinTech}
                  series={AVAADA_WIN_TECH_SERIES}
                  containerStyle={{ borderTop: "none", marginTop: 6, paddingTop: 4 }}
                />
              </Card>
              <Card>
                <CardTitle tag={fysTagLabel}>Portfolio Tech Mix</CardTitle>
                {avaadaTechPieFiltered.length === 0 ? (
                  <div style={{height:240,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted,fontSize:11,padding:"0 12px",textAlign:"center"}}>
                    No visible technology slices — turn on at least one series with capacity.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={avaadaTechPieFiltered}
                        dataKey="value"
                        nameKey="name"
                        cx="40%"
                        cy="50%"
                        outerRadius={85}
                        innerRadius={48}
                      >
                        {avaadaTechPieFiltered.map((d, i) => (
                          <Cell key={i} fill={d.color} fillOpacity={0.8} />
                        ))}
                      </Pie>
                      <Legend
                        iconSize={9}
                        wrapperStyle={{fontSize:9}}
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        formatter={(v, e) => `${v}: ${(e.payload.value / 1000).toFixed(1)}k`}
                      />
                      <Tooltip formatter={(v) => [v.toLocaleString() + " MW"]} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Card>
            </div>
            <Card>
              <CardTitle tag="FY24+25 · Top 16 wins">Key Deals</CardTitle>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px 12px",
                  alignItems: "flex-end",
                  marginBottom: 12,
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f2f8",
                }}
              >
                <span style={{ fontSize: 10, color: C.muted, fontWeight: 700, width: "100%", marginBottom: 2 }}>Filters</span>
                <label style={{ fontSize: 10, color: C.muted, display: "flex", flexDirection: "column", gap: 3 }}>
                  Authority
                  <select
                    value={dealsFAuth}
                    onChange={(e) => setDealsFAuth(e.target.value)}
                    style={dealsFilterSelectStyle}
                  >
                    <option value="">All</option>
                    {dealsFilterOptions.auth.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </label>
                <label style={{ fontSize: 10, color: C.muted, display: "flex", flexDirection: "column", gap: 3 }}>
                  Category
                  <select
                    value={dealsFCat}
                    onChange={(e) => setDealsFCat(e.target.value)}
                    style={dealsFilterSelectStyle}
                  >
                    <option value="">All</option>
                    {dealsFilterOptions.cat.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label style={{ fontSize: 10, color: C.muted, display: "flex", flexDirection: "column", gap: 3 }}>
                  Connectivity
                  <select
                    value={dealsFConn}
                    onChange={(e) => setDealsFConn(e.target.value)}
                    style={dealsFilterSelectStyle}
                  >
                    <option value="">All</option>
                    {dealsFilterOptions.cn.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label style={{ fontSize: 10, color: C.muted, display: "flex", flexDirection: "column", gap: 3 }}>
                  FY
                  <select
                    value={dealsFFy}
                    onChange={(e) => setDealsFFy(e.target.value)}
                    style={dealsFilterSelectStyle}
                  >
                    <option value="">All</option>
                    {dealsFilterOptions.fy.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </label>
                <label style={{ fontSize: 10, color: C.muted, display: "flex", flexDirection: "column", gap: 3 }}>
                  Status
                  <select
                    value={dealsFStatus}
                    onChange={(e) => setDealsFStatus(e.target.value)}
                    style={dealsFilterSelectStyle}
                  >
                    <option value="">Both</option>
                    <option value="loa">LoA Issued</option>
                    <option value="ppa">PPA Signed</option>
                  </select>
                </label>
                <label style={{ fontSize: 10, color: C.muted, display: "flex", flexDirection: "column", gap: 3 }}>
                  Sort · Cap (MW)
                  <select
                    value={dealsSortCap}
                    onChange={(e) => {
                      setDealsSortCap(e.target.value);
                      if (e.target.value) setDealsSortTariff("");
                    }}
                    style={dealsFilterSelectStyle}
                  >
                    <option value="">Default</option>
                    <option value="asc">Low → high</option>
                    <option value="desc">High → low</option>
                  </select>
                </label>
                <label style={{ fontSize: 10, color: C.muted, display: "flex", flexDirection: "column", gap: 3 }}>
                  Sort · Tariff (₹/kWh)
                  <select
                    value={dealsSortTariff}
                    onChange={(e) => {
                      setDealsSortTariff(e.target.value);
                      if (e.target.value) setDealsSortCap("");
                    }}
                    style={dealsFilterSelectStyle}
                  >
                    <option value="">Default</option>
                    <option value="asc">Low → high</option>
                    <option value="desc">High → low</option>
                  </select>
                </label>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead>
                    <tr style={{borderBottom:"1px solid #dde1ee"}}>
                      {["#","Tender","Authority","Category","Connectivity","Cap (MW)","Tariff","FY","Status"].map((h,i)=>(
                        <th key={i} style={{textAlign:i>=5&&i<=6?"right":"left",padding:"5px 8px",color:C.muted,fontWeight:600,fontSize:10}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {keyDealsFiltered.map((d,i)=>(
                      <tr key={`${d.t}-${i}`} style={{borderBottom:"1px solid #f0f2f8"}}>
                        <td style={{padding:"5px 8px",color:C.muted}}>{i+1}</td>
                        <td style={{padding:"5px 8px",fontWeight:500}}>{d.t}</td>
                        <td style={{padding:"5px 8px",color:C.muted}}>{d.a}</td>
                        <td style={{padding:"5px 8px"}}><span style={{color:d.c==="Solar"?C.solar:d.c==="Hybrid"?C.hybrid:C.fdre,fontWeight:600}}>{d.c}</span></td>
                        <td style={{padding:"5px 8px"}}><span style={{color:d.cn==="ISTS"?C.ists:C.stu,fontWeight:600}}>{d.cn}</span></td>
                        <td style={{padding:"5px 8px",textAlign:"right",fontWeight:600}}>{d.cap.toLocaleString()}</td>
                        <td style={{padding:"5px 8px",textAlign:"right",fontWeight:700,color:C.fdre}}>₹{d.ta.toFixed(2)}</td>
                        <td style={{padding:"5px 8px",color:C.muted}}>{d.fy}</td>
                        <td style={{padding:"5px 8px"}}><StatusPill s={d.s}/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {keyDealsFiltered.length === 0 ? (
                <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>No deals match the current filters.</div>
              ) : null}
            </Card>
          </div>
        )}

        {/* ── COMPETITIVE LANDSCAPE ── */}
        {activeTab==="competitive" && (
          <div>
            <div style={{marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:14,fontWeight:700}}>Competitive Landscape</span>
              <ScopeBadge scope={scope} fys={fys} allFys={ALL_FYS}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              <Card>
                <CardTitle tag={`${fysTagLabel} · Market Share`}>Developer share</CardTitle>
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie data={mktSharePie} cx="40%" cy="50%" outerRadius={90} innerRadius={46} dataKey="value">
                      {mktSharePie.map((d, i) => (
                        <Cell key={i} fill={d.color} fillOpacity={0.8} />
                      ))}
                    </Pie>
                    <Legend iconSize={9} wrapperStyle={{fontSize:9}} layout="vertical" align="right" verticalAlign="middle"
                      formatter={(v,e)=>`${v}: ${(e.payload.value/1000).toFixed(1)}k`}/>
                    <Tooltip formatter={(v)=>[v.toLocaleString()+" MW"]}/>
                  </PieChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <CardTitle tag={`${fysTagLabel} · FDRE/RTC`}>FDRE / RTC leaders</CardTitle>
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart layout="vertical"
                    data={fdreLeadersFiltered}
                    margin={{top:5,right:30,bottom:5,left:5}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaecf4" horizontal={false}/>
                    <XAxis type="number" tick={{fontSize:10,fill:C.muted}}/>
                    <YAxis type="category" dataKey="name" tick={{fontSize:10,fill:C.muted}} width={55}/>
                    <Tooltip content={customTooltip("MW")}/>
                    <Bar dataKey="v" radius={[0,3,3,0]}>
                      {fdreLeadersFiltered.map((d, i) => (
                        <Cell key={i} fill={fdreBarColorByName.get(d.name)} fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
            <Card>
              <CardTitle tag="Mar 2025 · Top 9 by Op/UC ratio">IPP Portfolio — Operational vs Under Construction</CardTitle>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={ippChartData.map((d) => ({ ...d, name: d.c }))} margin={{top:5,right:10,bottom:5,left:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eaecf4"/>
                  <XAxis dataKey="name" tick={{fontSize:10,fill:C.muted}}/>
                  <YAxis tickFormatter={v=>(v/1000)+"k"} tick={{fontSize:10,fill:C.muted}}/>
                  <Tooltip content={customTooltip("MW")}/>
                  <Legend wrapperStyle={{fontSize:10}}/>
                  <Bar dataKey="op" name="Operational" fill="#bdd7ee" stroke={C.avaada} strokeWidth={1.5} radius={[2,2,0,0]}/>
                  <Bar dataKey="uc" name="UC + Secured" fill="#f6cba0" stroke={C.jsw} strokeWidth={1.5} radius={[2,2,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
              <Note>
                {ippAvaadaInsight ? (
                  <>
                    Avaada&apos;s operational ratio ({ippAvaadaInsight.opShare.toFixed(1)}%) is the lowest among top IPPs —
                    highest execution risk. {ippAvaadaInsight.unexShare.toFixed(1)}% of portfolio is unexecuted as of Mar
                    2025. Op÷UC ratio: {ippAvaadaInsight.ratioOpUc.toFixed(1)}%. Chart: top 9 by Op÷UC, ordered by total
                    (Op+UC); zero Op or UC excluded from ranking.
                  </>
                ) : (
                  <>
                    Top 9 by Op÷UC ratio; chart order by total (Op+UC). Developers with zero operational or zero under
                    construction are omitted.
                  </>
                )}
              </Note>
            </Card>
          </div>
        )}

        {/* ── TARIFF INTELLIGENCE ── */}
        {activeTab==="tariff" && (
          <div>
            <div style={{marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:14,fontWeight:700}}>Tariff Intelligence</span>
              <ScopeBadge scope={scope} fys={fys} allFys={ALL_FYS}/>
            </div>
            <Card>
              <CardTitle tag="₹/kWh by technology">Tariff Trajectory by Technology</CardTitle>
              <Note>
                <strong>FDRE:</strong>{" "}
                {tariffNoteFdreFy24Fy25 ? (
                  <>
                    Peaked ₹{tariffNoteFdreFy24Fy25.v24.toFixed(2)} FY24 → ₹{tariffNoteFdreFy24Fy25.v25.toFixed(2)} FY25 as
                    competition intensified.
                  </>
                ) : (
                  <>FY24–FY25 RTC/FDRE weighted mean tariffs are not available in the loaded data.</>
                )}{" "}
                <strong>BESS in selection:</strong>{" "}
                {techMixBessStatsFiltered.pct != null && techMixBessStatsFiltered.totalM > 0 ? (
                  <>
                    {Math.round(techMixBessStatsFiltered.pct)}% of awards in the selected FYs are storage-led (
                    {Math.round(techMixBessStatsFiltered.bessM).toLocaleString()} MW of{" "}
                    {Math.round(techMixBessStatsFiltered.totalM).toLocaleString()} MW total).
                  </>
                ) : (
                  <>Storage-led share for the selected fiscal years is not available in the loaded data.</>
                )}
              </Note>
              <ResponsiveContainer width="100%" height={260} style={{marginTop:12}}>
                <LineChart data={tariffLines} margin={{top:5,right:10,bottom:5,left:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eaecf4"/>
                  <XAxis dataKey="name" tick={{fontSize:10,fill:C.muted}}/>
                  <YAxis tickFormatter={v=>"₹"+v.toFixed(2)} tick={{fontSize:10,fill:C.muted}}/>
                  <Tooltip formatter={(v,n)=>[v?"₹"+Number(v).toFixed(2):"—",n]}/>
                  <Legend wrapperStyle={{fontSize:10}}/>
                  {[["Solar",C.solar],["Hybrid",C.hybrid],["RTC/FDRE",C.fdre],["ESS/BESS",C.bess],["Wind",C.wind]].map(([key,col])=>(
                    <Line key={key} type="monotone" dataKey={key} stroke={col} strokeWidth={2.5}
                      dot={{r:4,fill:col}} activeDot={{r:6}} connectNulls={true}/>
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </Card>
            <Note type="warn" style={{marginBottom:14}}>
              <strong>
                {bessCollapseInsight.collapsePct != null
                  ? `Why BESS tariffs collapsed ${bessCollapseInsight.collapsePct}%${
                      bessCollapseInsight.fy23to26Basis ? " in three years" : ""
                    } — it's the tender design, not just battery costs`
                  : "Why BESS tariffs compressed sharply — tender design, not just battery costs"}
              </strong>
              <br />
              <br />
              <strong>1. Duration shift</strong> —{" "}
              {bessCollapseInsight.v23 > 0 ? (
                <>
                  FY23 capacity-weighted mean BESS/ESS in this dataset is ₹{bessCollapseInsight.v23.toFixed(2)}/kWh. Early
                  standalone tenders were often shorter duration; moving to longer-duration standards amortises fixed costs
                  over more MWh.
                </>
              ) : (
                <>
                  Early standalone BESS tenders were often shorter duration; moving to longer-duration standards amortises
                  fixed costs over more MWh.
                </>
              )}
              <br />
              <br />
              <strong>2. Tenure extension</strong> — 12-year SECI PPAs → 25-year NTPC → 40-year PCKL. Longer tenures
              distribute capex recovery, the single most influential tender design variable (IEEFA).
              <br />
              <br />
              <strong>3. VGF subsidy</strong> — Cabinet&apos;s Sep 2023 scheme covers up to 30% capex / ₹4.6 lakh per
              MWh.
              {BESS_INSIGHT?.fy25TariffMin != null &&
              BESS_INSIGHT?.fy25TariffMax != null &&
              BESS_INSIGHT.fy25TariffMin > 0 ? (
                <>
                  {" "}
                  Maharashtra and Rajasthan FY25 awards cleared at ₹2.19–2.21 lakh/MW/month — ~40% below pre-VGF prices.
                  {BESS_INSIGHT.fy25VsFy24TariffDropPct != null ? (
                    <></>
                  ) : null}
                </>
              ) : bessCollapseInsight.v25 > 0 ? (
                <>
                  {" "}
                  Maharashtra and Rajasthan FY25 awards cleared at ₹2.19–2.21 lakh/MW/month — ~40% below pre-VGF prices.
                </>
              ) : null}
              <br />
              <br />
              <strong>4. Hardware crash</strong> —{" "}
              {bessCollapseInsight.v23 > 0 && bessCollapseInsight.v26 > 0 ? (
                <>
                  Li-ion pack prices fell ~40% in 2024 alone (ICRA). FY26 bids imply sub-$120/kWh pack cost vs ~$300/kWh in 2022.

                </>
              ) : (
                <>
                  Li-ion pack costs fell sharply 2022–25 (industry estimates). Tariff bids track that hardware curve in
                  parallel with tender design changes.
                </>
              )}
              <br />
              <br />
              <strong>5. ISTS charge waiver</strong> — solar+BESS waiver extended to 2028, reducing effective inter-state
              project costs.
              <br />
              <br />
              <span style={{ color: C.bess, fontWeight: 600 }}>Risk flag:</span>{" "}
              {toNum(BESS_INSIGHT?.awardedMwTotal) > 0 ? (
                <>
                  {Math.round(toNum(BESS_INSIGHT.codMw)).toLocaleString()} MW COD achieved vs{" "}
                  {Math.round(toNum(BESS_INSIGHT.awardedMwTotal)).toLocaleString()} MW cumulative BESS/ESS awarded capacity
                  in the loaded data. IEEFA-style warnings on underbidding still apply — developers may embed aggressive
                  future battery cost paths.
                  {bessCollapseInsight.v26 > 0 ? (
                    <>
                      {" "}
                      FY26 weighted mean here is ₹{bessCollapseInsight.v26.toFixed(2)}/kWh; execution and input-cost risk
                      can stress those assumptions.
                    </>
                  ) : null}
                </>
              ) : (
                <>
                  Commissioned vs awarded BESS capacity is not summarised in the loaded file — monitor COD lag vs pipeline.
                  IEEFA-style warnings on underbidding still apply.
                </>
              )}
            </Note>
            <Card>
              <CardTitle tag={`${tariffScope==="fy25"?"FY25":tariffScope==="fy26"?"FY26":"All FY"} · ₹/kWh`}>Developer Tariff Comparison — Capacity-Weighted Mean</CardTitle>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead>
                    <tr style={{borderBottom:"1px solid #dde1ee"}}>
                      <th style={{textAlign:"left",padding:"5px 8px",color:C.muted,fontWeight:600,fontSize:10}}>Developer</th>
                      {tariffCats.map(cat=>(
                        <th key={cat} style={{textAlign:"center",padding:"5px 8px",color:cat==="Solar"?C.solar:cat==="Hybrid"?C.hybrid:C.fdre,fontWeight:600,fontSize:10}}>{cat}</th>
                      ))}
                      <th style={{textAlign:"right",padding:"5px 8px",color:C.muted,fontWeight:600,fontSize:10}}>Overall</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tariffCos.map(co=>{
                      const o = overall(co);
                      const oFloat = parseFloat(o);
                      const ovVals = tariffCos.map(c=>parseFloat(overall(c))).filter(v=>!isNaN(v));
                      const oMin = Math.min(...ovVals), oMax = Math.max(...ovVals);
                      const oColor = isNaN(oFloat)?C.muted:oFloat===oMin?C.wind:oFloat===oMax?C.bess:"#1a1f36";
                      return (
                        <tr key={co} style={{background:co==="Avaada"?"#e8f4fd":"transparent",borderBottom:"1px solid #f0f2f8"}}>
                          <td style={{padding:"6px 8px",fontWeight:co==="Avaada"?800:600,color:co==="Avaada"?C.avaada:"#1a1f36"}}>{co}</td>
                          {tariffCats.map(cat=>{
                            const cell = tariffData[co]&&tariffData[co][cat];
                            if (!cell) return <td key={cat} style={{textAlign:"center",padding:"6px 8px",color:C.muted}}>—</td>;
                            const {t,c} = cell;
                            const pct = colStats[cat].max>colStats[cat].min ? (t-colStats[cat].min)/(colStats[cat].max-colStats[cat].min) : 0.5;
                            const barCol = `hsl(${Math.round((1-pct)*120)},60%,40%)`;
                            const isMin = t===colStats[cat].min, isMax = t===colStats[cat].max;
                            return (
                              <td key={cat} style={{padding:"4px 8px",textAlign:"center"}}>
                                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                                  <span style={{fontWeight:700,color:cat==="Solar"?C.solar:cat==="Hybrid"?C.hybrid:C.fdre}}>₹{Number(t).toFixed(2)}</span>
                                  <span style={{fontSize:9,color:C.muted}}>{(c/1000).toFixed(1)}k MW</span>
                                  <div style={{width:60,height:3,background:"#eee",borderRadius:2}}>
                                    <div style={{width:`${Math.round(pct*100)}%`,height:"100%",background:barCol,borderRadius:2}}/>
                                  </div>
                                  {isMin && <span style={{fontSize:8,background:"#d1fae5",color:"#065f46",padding:"1px 4px",borderRadius:2}}>LOW</span>}
                                  {isMax && <span style={{fontSize:8,background:"#fee2e2",color:"#991b1b",padding:"1px 4px",borderRadius:2}}>HIGH</span>}
                                </div>
                              </td>
                            );
                          })}
                          <td style={{textAlign:"right",padding:"6px 8px",fontWeight:700,color:oColor}}>
                            {o ? "₹"+o : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Note>Avaada ISTS-only Solar premium vs market: +1 paisa (₹2.59 vs ₹2.58 average). The aggregate ₹0.12–0.28 premium was a connectivity mix artifact — 35% of Avaada Solar is STU-connected (structurally +₹0.36/kWh).</Note>
            </Card>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginTop:14}}>
              <Card>
                <CardTitle tag="Paisa vs market floor">Avaada Tariff Premium by Tender</CardTitle>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={premiumData} layout="vertical" margin={{top:5,right:20,bottom:5,left:5}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaecf4" horizontal={false}/>
                    <XAxis type="number" tickFormatter={v=>v+"p"} tick={{fontSize:9,fill:C.muted}} domain={[0,14]}/>
                    <YAxis
                      type="category"
                      dataKey="t"
                      tick={{fontSize:9,fill:C.muted}}
                      width={72}
                      tickFormatter={shortRfsLabelForAxis}
                    />
                    <Tooltip
                      formatter={(v) => [`${Number(v).toFixed(2)}p`, "Premium"]}
                      labelFormatter={(_, payload) => payload?.[0]?.payload?.t ?? ""}
                    />
                    <Bar dataKey="p" radius={[0,3,3,0]}>
                      {premiumData.map((d,i)=><Cell key={i} fill={d.fill}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <CardTitle tag="₹/kWh">BESS Tariff Compression</CardTitle>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={[
                    {name:"FY23",v:10.223},{name:"FY24",v:4.487},{name:"FY25",v:2.839},{name:"FY26",v:2.468}
                  ]} margin={{top:5,right:10,bottom:5,left:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaecf4"/>
                    <XAxis dataKey="name" tick={{fontSize:10,fill:C.muted}}/>
                    <YAxis tickFormatter={v=>"₹"+v.toFixed(2)} tick={{fontSize:10,fill:C.muted}}/>
                    <Tooltip formatter={(v)=>["₹"+Number(v).toFixed(3),"BESS"]}/>
                    <Line type="monotone" dataKey="v" stroke={C.bess} strokeWidth={2.5} dot={{r:5,fill:C.bess}}/>
                  </LineChart>
                </ResponsiveContainer>
                <Note>76% price fall FY23→FY26. Driven by tender design evolution (duration, tenure, VGF) as much as hardware cost declines.</Note>
              </Card>
            </div>
          </div>
        )}

        {/* ── COMPETITOR HEATMAP ── */}
        {activeTab==="heatmap" && (
          <div>
            <div style={{marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:14,fontWeight:700}}>Competitor Heatmap</span>
              <ScopeBadge scope={scope} fys={fys} allFys={ALL_FYS}/>
            </div>
            <Card>
              <CardTitle tag={`${fysTagLabel} · Top 8 devs`}>Developer × Bidding Authority</CardTitle>
              <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:8,marginBottom:12}}>
                <span style={{fontSize:10,color:C.muted,fontWeight:600}}>Sort by</span>
                <button
                  type="button"
                  onClick={() => setHmDevAuthSort("total")}
                  style={{
                    padding:"5px 11px",
                    borderRadius:6,
                    border:`1px solid ${hmDevAuthSort === "total" ? C.avaada : "#c7cbe0"}`,
                    background: hmDevAuthSort === "total" ? "#e8f4fd" : "#fff",
                    color: hmDevAuthSort === "total" ? C.avaada : "#1a1f36",
                    fontSize:11,
                    fontWeight: hmDevAuthSort === "total" ? 700 : 500,
                    cursor:"pointer",
                    fontFamily:"'Inter',system-ui,sans-serif",
                  }}
                >
                  Total
                </button>
                {heatmapDevAuthView.keys.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setHmDevAuthSort(k)}
                    style={{
                      padding:"5px 11px",
                      borderRadius:6,
                      border:`1px solid ${hmDevAuthSort === k ? C.avaada : "#c7cbe0"}`,
                      background: hmDevAuthSort === k ? "#e8f4fd" : "#fff",
                      color: hmDevAuthSort === k ? C.avaada : "#1a1f36",
                      fontSize:11,
                      fontWeight: hmDevAuthSort === k ? 700 : 500,
                      cursor:"pointer",
                      fontFamily:"'Inter',system-ui,sans-serif",
                    }}
                  >
                    {k}
                  </button>
                ))}
              </div>
              <HeatmapTable data={heatmapDevAuthView.data} keys={heatmapDevAuthView.keys} />
              <Note>
                {heatmapAuthTop3Note.map((item, i) => (
                  <span key={item.co} style={{display:"block",marginTop:i ? 8 : 0}}>
                    <strong>{item.co}:</strong> {item.line}
                  </span>
                ))}
              </Note>
            </Card>
            <Card style={{marginTop:14}}>
              <CardTitle tag={`${fysTagLabel} · Top 8 devs`}>Developer × REIA Type</CardTitle>
              <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:8,marginBottom:12}}>
                <span style={{fontSize:10,color:C.muted,fontWeight:600}}>Sort rows by</span>
                {[
                  { id: "total", label: "Total" },
                  { id: "central", label: "Central REIA" },
                  { id: "state", label: "State" },
                  { id: "pctCentral", label: "% Central" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setHmReiaSort(opt.id)}
                    style={{
                      padding:"5px 11px",
                      borderRadius:6,
                      border:`1px solid ${hmReiaSort === opt.id ? C.avaada : "#c7cbe0"}`,
                      background: hmReiaSort === opt.id ? "#e8f4fd" : "#fff",
                      color: hmReiaSort === opt.id ? C.avaada : "#1a1f36",
                      fontSize:11,
                      fontWeight: hmReiaSort === opt.id ? 700 : 500,
                      cursor:"pointer",
                      fontFamily:"'Inter',system-ui,sans-serif",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead>
                    <tr style={{borderBottom:"1px solid #dde1ee"}}>
                      <th style={{textAlign:"left",padding:"5px 8px",color:C.muted,fontWeight:600,fontSize:10}}>Developer</th>
                      <th style={{textAlign:"center",padding:"5px 8px",color:C.muted,fontWeight:600,fontSize:10}}>Central REIA</th>
                      <th style={{textAlign:"center",padding:"5px 8px",color:C.muted,fontWeight:600,fontSize:10}}>State</th>
                      <th style={{textAlign:"right",padding:"5px 8px",color:C.muted,fontWeight:600,fontSize:10}}>% Central</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heatmapReiaView.rows.map((item) => {
                      const co = item.co;
                      const c = item.c;
                      const s = item.s;
                      const allVals = Object.values(reiaMerged || {}).flatMap((r) => Object.values(r));
                      const maxV = Math.max(...allVals, 1);
                      const pct = item.t > 0 ? `${Math.round(item.pctCentral)}%` : "—";
                      const isAv = co === "Avaada";
                      return (
                        <tr key={co} style={{background:isAv?"#e8f4fd":"transparent",borderBottom:"1px solid #f0f2f8"}}>
                          <td style={{padding:"5px 8px",fontWeight:isAv?800:600,color:isAv?C.avaada:"#1a1f36"}}>{co}</td>
                          {[c, s].map((v, i) => {
                            const col = hmColor(v, maxV);
                            return v === 0 ? (
                              <td key={i} style={{textAlign:"center",padding:"5px 8px"}}>
                                <span style={{color:C.muted}}>—</span>
                              </td>
                            ) : (
                              <td key={i} style={{textAlign:"center",padding:"5px 6px"}}>
                                <span
                                  style={{
                                    background:col.bg,
                                    color:col.fg,
                                    padding:"2px 7px",
                                    borderRadius:3,
                                    fontSize:10,
                                    fontWeight:600,
                                    display:"inline-block",
                                  }}
                                >
                                  {(v / 1000).toFixed(1)}k
                                </span>
                              </td>
                            );
                          })}
                          <td style={{textAlign:"right",padding:"5px 8px",fontWeight:700}}>{pct}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Note>
                <span style={{display:"block"}}>{reiaInsightNote.avLine}</span>
                {reiaInsightNote.line2 ? (
                  <span style={{display:"block",marginTop:8}}>{reiaInsightNote.line2}</span>
                ) : null}
                {reiaInsightNote.line3 ? (
                  <span style={{display:"block",marginTop:8}}>{reiaInsightNote.line3}</span>
                ) : null}
              </Note>
            </Card>
          </div>
        )}

        {/* ── PIPELINE & STATUS ── */}
        {activeTab==="pipeline" && (
          <div>
            <div style={{marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:14,fontWeight:700}}>Pipeline & Status</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              <Card>
                <CardTitle tag="Avaada portfolio · MW">PPA Status Breakdown</CardTitle>
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie data={[{name:"PPA Signed",v:7482},{name:"LoA Issued",v:8360},{name:"COD Achieved",v:280},{name:"Cancelled",v:310}]}
                      cx="40%" cy="50%" outerRadius={90} innerRadius={50} dataKey="v">
                      {[C.wind,C.jsw,C.ists,C.bess].map((c,i)=><Cell key={i} fill={c+"bb"}/>)}
                    </Pie>
                    <Legend iconSize={9} wrapperStyle={{fontSize:9}} layout="vertical" align="right" verticalAlign="middle"
                      formatter={(v,e)=>`${v}: ${e.payload.v.toLocaleString()}`}/>
                    <Tooltip formatter={(v)=>[v.toLocaleString()+" MW"]}/>
                  </PieChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <CardTitle tag={`${fysTagLabel} · Won MW`}>Early leaders</CardTitle>
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={pipelineTopCos.map(d=>({name:d.name,value:d.value,fill:d.color}))} layout="vertical"
                    margin={{top:5,right:30,bottom:5,left:5}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaecf4" horizontal={false}/>
                    <XAxis type="number" tick={{fontSize:10,fill:C.muted}}/>
                    <YAxis type="category" dataKey="name" tick={{fontSize:9,fill:C.muted}} width={75}/>
                    <Tooltip content={customTooltip("MW")}/>
                    <Bar dataKey="value" radius={[0,3,3,0]}>
                      {pipelineTopCos.map((d, i) => (
                        <Cell key={i} fill={d.color} fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
            <Note>
              {selectedFyPipelineNoteFirstLine}{" "}
              storage-specialist developers (Patel Infra, Greenko, Enerica) are active in the BESS segment. Avaada's FY26 pipeline is yet to materialise — consistent with its FY24–25 pattern of back-loaded closings.
            </Note>
            <Card style={{marginTop:14}}>
              <CardTitle tag="MW">Avaada Pipeline Status Bars</CardTitle>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={[
                  {name:"PPA Signed",value:7482},{name:"LoA Issued",value:8360},
                  {name:"COD Achieved",value:280},{name:"Cancelled",value:310},
                ]} margin={{top:5,right:10,bottom:5,left:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eaecf4"/>
                  <XAxis dataKey="name" tick={{fontSize:10,fill:C.muted}}/>
                  <YAxis tickFormatter={v=>(v/1000)+"k"} tick={{fontSize:10,fill:C.muted}}/>
                  <Tooltip content={customTooltip("MW")}/>
                  <Bar dataKey="value" radius={[4,4,0,0]}>
                    {[C.wind,C.jsw,C.ists,C.bess].map((c,i)=><Cell key={i} fill={c+"cc"}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <Note type="warn">8,360 MW at LoA stage (PPA not yet signed) — FY25 wins most exposed to 12–18 month PPA conversion lag. Only 280 MW COD achieved across entire portfolio.</Note>
            </Card>
          </div>
        )}

      </div>
      ) : null}
    </div>
  );
}
