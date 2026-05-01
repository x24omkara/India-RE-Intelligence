import XLSX from "xlsx";
import { DASHBOARD_XLSX_SHEET_PRIMARY } from "./excelColumnSpec.js";

/** OOXML ZIP signature */
export function bufferLooksLikeXlsx(buf) {
  if (!buf || buf.length < 4) return false;
  return buf[0] === 0x50 && buf[1] === 0x4b; // PK
}

/** First-row header labels left-to-right (empty cells as ""). */
export function getSheetHeaderRow(sheet) {
  const ref = sheet["!ref"];
  if (!ref) return [];
  const range = XLSX.utils.decode_range(ref);
  const row = [];
  for (let C = range.s.c; C <= range.e.c; C++) {
    const addr = XLSX.utils.encode_cell({ r: range.s.r, c: C });
    const cell = sheet[addr];
    const raw = cell != null && cell.v != null ? String(cell.v) : "";
    row.push(raw.trim());
  }
  return row;
}

export function parseDashboardSheet(buffer) {
  const wb = XLSX.read(buffer, { type: "buffer" });
  const sheet = wb.Sheets[DASHBOARD_XLSX_SHEET_PRIMARY] || wb.Sheets[wb.SheetNames[0]];
  if (!sheet) {
    const err = new Error("No worksheet found.");
    err.code = "NO_SHEET";
    throw err;
  }
  const headerRow = getSheetHeaderRow(sheet);
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
  return {
    wb,
    sheetName: wb.SheetNames.includes(DASHBOARD_XLSX_SHEET_PRIMARY) ? DASHBOARD_XLSX_SHEET_PRIMARY : wb.SheetNames[0],
    headerRow,
    rows,
  };
}
