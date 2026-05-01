import { DASHBOARD_XLSX_COLUMN_NAMES } from "./excelColumnSpec.js";

export { bufferLooksLikeXlsx, getSheetHeaderRow, parseDashboardSheet } from "./dashboardXlsxParse.js";

/** Drop trailing blank header cells. */
function trimTrailingEmpty(cells) {
  const row = Array.isArray(cells) ? [...cells] : [];
  while (row.length && row[row.length - 1] === "") row.pop();
  return row;
}

/**
 * Headers must be the same set as DASHBOARD_XLSX_COLUMN_NAMES: each name exactly once; order ignored.
 */
export function validateColumnsAgainstSpec(headerRow) {
  const expected = DASHBOARD_XLSX_COLUMN_NAMES;
  if (!headerRow || headerRow.length === 0 || headerRow.every((h) => h === "")) {
    return {
      ok: false,
      code: "NO_COLUMNS",
      message: "The file has no column headers in the first row.",
      expectedColumns: [...expected],
      headerLabels: [],
      columnCountExpected: expected.length,
      columnCountFound: 0,
    };
  }

  const actual = trimTrailingEmpty(headerRow);
  if (actual.some((h) => h === "")) {
    return {
      ok: false,
      code: "COLUMN_MISMATCH",
      message:
        "The header row has blank column name(s). Every column needs a name that matches the template (no empty headers).",
      expectedColumns: [...expected],
      headerLabels: actual.filter((h) => h !== ""),
      columnCountExpected: expected.length,
      columnCountFound: actual.filter((h) => h !== "").length,
    };
  }

  const counts = new Map();
  for (const h of actual) {
    counts.set(h, (counts.get(h) || 0) + 1);
  }
  const duplicateHeaders = [...counts.entries()]
    .filter(([, n]) => n > 1)
    .map(([h]) => h)
    .sort();

  const expectedSet = new Set(expected);
  const uniqueActual = new Set(actual);
  const missingColumns = expected.filter((x) => !uniqueActual.has(x));
  const extraColumns = [...new Set(actual.filter((h) => !expectedSet.has(h)))].sort();

  const badSet =
    duplicateHeaders.length > 0 || missingColumns.length > 0 || extraColumns.length > 0;
  const countBad = actual.length !== expected.length;

  if (!badSet && !countBad) {
    return { ok: true };
  }

  const parts = [];
  if (duplicateHeaders.length) parts.push("duplicate header name(s)");
  if (missingColumns.length) parts.push("missing column(s)");
  if (extraColumns.length) parts.push("extra column(s)");
  if (countBad && !parts.length) {
    parts.push(`expected ${expected.length} columns, found ${actual.length}`);
  } else if (countBad && parts.length) {
    parts.push(`(${actual.length} headers vs ${expected.length} required)`);
  }

  return {
    ok: false,
    code: "COLUMN_MISMATCH",
    message: `Column headers must match the dashboard template (same ${expected.length} names, any order): ${parts.join("; ")}.`,
    expectedColumns: [...expected],
    headerLabels: [...actual],
    columnCountExpected: expected.length,
    columnCountFound: actual.length,
    missingColumns,
    extraColumns,
    duplicateHeaders,
  };
}

export function validateDataRows(rows) {
  if (!rows.length) {
    return {
      ok: false,
      code: "EMPTY_DATA",
      message: "The file has no data rows (only headers or an empty sheet). Add data before uploading.",
    };
  }
  return { ok: true };
}
