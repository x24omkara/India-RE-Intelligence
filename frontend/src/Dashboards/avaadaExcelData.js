import * as XLSX from "xlsx";

const AVAADA_ALIASES = new Set(["AVAADA", "Avaada Energy", "Avaada"]);
const DEV_ALIAS = {
  AVAADA: "Avaada",
  "Avaada Energy": "Avaada",
  "Renew Power": "Renew",
  ReNew: "Renew",
};

const ALL_FYS = ["FY 2021", "FY 2022", "FY 2023", "FY 2024", "FY 2025", "FY 2026"];

const TECHS = ["Solar", "Hybrid", "RTC/FDRE", "ESS/BESS", "Wind", "Solar+ESS", "BESS"];
const AUTHORITIES = ["SECI", "NHPC", "NTPC", "SJVN", "GUVNL", "MSEDCL", "MSAPL", "IREDA", "RUVNL"];

const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

function emptyFyObj() {
  return Object.fromEntries(ALL_FYS.map((fy) => [fy, 0]));
}

function ensureNested(obj, key) {
  if (!obj[key]) obj[key] = {};
  return obj[key];
}

function wAvgPairs(rowsByFy) {
  const out = {};
  for (const [fy, pair] of Object.entries(rowsByFy)) {
    out[fy] = pair.cap > 0 ? pair.w / pair.cap : 0;
  }
  return out;
}

/** Round to 2 decimal places (tariff / premium display). */
function round2(x) {
  if (x == null || !Number.isFinite(Number(x))) return null;
  return Math.round(Number(x) * 100) / 100;
}

export function deriveAvaadaDataFromExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Unable to read Excel file."));
    reader.onload = () => {
      try {
        const wb = XLSX.read(reader.result, { type: "array" });
        const sheet = wb.Sheets["M. Data"] || wb.Sheets[wb.SheetNames[0]];
        if (!sheet) throw new Error("No worksheet found.");
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });

        const FY_MARKET = emptyFyObj();
        const AVAADA_FY = emptyFyObj();
        const TECH_BY_FY = {};
        const AUTH_BY_FY = {};
        const AVAADA_TECH_FY = {};
        const CO_BY_FY = {};
        /** Tariff trajectory 6.1.1: groupby FY × Category (exact category, no BESS→ESS merge). */
        const tariffTrajAcc = {};
        /** BESS column: rows with Category in BESS/Solar+ESS/ESS/BESS AND Type in BESS/Solar+ESS only. */
        const bessTrajByFy = {};
        const reiaAcc = {};
        const ippAcc = {};
        const devTechAcc = {};
        const devAuthAll = {};
        const devAuthFy25 = {};
        /** Developer × authority won MW by fiscal year (for FY chip filters). */
        const devAuthByFy = {};
        /** REIA type buckets per FY × developer. */
        const reiaByFy = {};
        /** Developer tech buckets per FY (same keys as devTechAcc). */
        const devTechByFy = {};
        const coTechTariffAcc = { all: {}, fy25: {}, fy26: {} };
        const connectivityByFyRaw = {};
        /** Capacity-weighted tariff sums for ISTS (incl. CTU+ISTS) vs STU — won MW only. */
        const connectivityTariffAcc = { ISTS: { w: 0, cap: 0 }, STU: { w: 0, cap: 0 } };
        const avaadaTariffRows = [];
        const avaadaDeals = [];
        let avaadaTotalBids = 0;
        let avaadaWonBids = 0;
        let avaadaLoaIssued = 0;
        let avaadaPpaSigned = 0;
        let bessCodMw = 0;
        let bessFy25TariffMin = null;
        let bessFy25TariffMax = null;

        for (const r of rows) {
          const fy = String(r["Financial Year"] ?? "").trim();
          const won = toNum(r["Won Capacity"]);
          const bid = toNum(r["Bid Capacity"]);
          const rawCat = String(r["Category"] ?? "").trim();
          const cat = rawCat === "FDRE" ? "RTC/FDRE" : rawCat;
          const companyRaw = String(r["Group Company"] ?? "").trim();
          const company = DEV_ALIAS[companyRaw] || companyRaw;
          const authority = String(r["Bidding Authority"] ?? "").trim();
          const reia = String(r["REIA"] ?? "").trim();
          const statusNorm = String(r["Status (e-RA/LOA/PPA/COD)"] ?? "").trim().toLowerCase();
          const tariff = toNum(r["Final Tariff"]);
          const connectivity = String(r["Connectivity"] ?? "").trim();
          const typeVal = String(r["Type"] ?? "").trim();

          if (FY_MARKET[fy] !== undefined) FY_MARKET[fy] += won;
          if (AVAADA_ALIASES.has(companyRaw) && AVAADA_FY[fy] !== undefined) AVAADA_FY[fy] += won;
          if (AVAADA_ALIASES.has(companyRaw)) {
            avaadaTotalBids += bid > 0 ? 1 : 0;
            if (String(r["Bidding Result"] ?? "").trim().toLowerCase() !== "unsuccessful") avaadaWonBids += 1;
            if (statusNorm === "loa issued") avaadaLoaIssued += won;
            if (statusNorm === "ppa signed") avaadaPpaSigned += won;
          }

          if (TECHS.includes(cat) && fy) {
            const byFy = ensureNested(TECH_BY_FY, fy);
            byFy[cat] = (byFy[cat] || 0) + won;
          }
          if (AVAADA_ALIASES.has(companyRaw) && TECHS.includes(cat) && fy) {
            const byFy = ensureNested(AVAADA_TECH_FY, fy);
            byFy[cat] = (byFy[cat] || 0) + won;
          }

          if (fy && authority) {
            const byFy = ensureNested(AUTH_BY_FY, fy);
            byFy[authority] = (byFy[authority] || 0) + won;
          }

          if (fy) {
            const byFy = ensureNested(CO_BY_FY, fy);
            byFy[company] = (byFy[company] || 0) + won;
            byFy.TOTAL = (byFy.TOTAL || 0) + won;
          }

          if (fy && connectivity) {
            if (!connectivityByFyRaw[fy]) connectivityByFyRaw[fy] = {};
            connectivityByFyRaw[fy][connectivity] = (connectivityByFyRaw[fy][connectivity] || 0) + won;
          }

          if (won > 0 && tariff > 0) {
            const connKey =
              connectivity === "ISTS" || connectivity === "CTU+ISTS"
                ? "ISTS"
                : connectivity === "STU"
                  ? "STU"
                  : null;
            if (connKey) {
              connectivityTariffAcc[connKey].w += tariff * won;
              connectivityTariffAcc[connKey].cap += won;
            }
          }

          if (TECHS.includes(cat) && won > 0 && fy) {
            if (!tariffTrajAcc[cat]) tariffTrajAcc[cat] = {};
            if (!tariffTrajAcc[cat][fy]) tariffTrajAcc[cat][fy] = { w: 0, cap: 0 };
            tariffTrajAcc[cat][fy].w += tariff * won;
            tariffTrajAcc[cat][fy].cap += won;
          }

          if (
            won > 0 &&
            fy &&
            ["BESS", "Solar+ESS", "ESS/BESS"].includes(cat) &&
            (typeVal === "BESS" || typeVal === "Solar+ESS")
          ) {
            if (!bessTrajByFy[fy]) bessTrajByFy[fy] = { w: 0, cap: 0 };
            bessTrajByFy[fy].w += tariff * won;
            bessTrajByFy[fy].cap += won;
          }

          if (reia && company) {
            if (!reiaAcc[company]) reiaAcc[company] = {};
            reiaAcc[company][reia] = (reiaAcc[company][reia] || 0) + won;
            if (fy && FY_MARKET[fy] !== undefined) {
              if (!reiaByFy[fy]) reiaByFy[fy] = {};
              if (!reiaByFy[fy][company]) reiaByFy[fy][company] = {};
              reiaByFy[fy][company][reia] = (reiaByFy[fy][company][reia] || 0) + won;
            }
          }

          if (!ippAcc[company]) ippAcc[company] = { op: 0, uc: 0 };
          if (statusNorm === "cod achieved") ippAcc[company].op += won;
          if (statusNorm === "ppa signed") ippAcc[company].uc += won;

          if (!devAuthAll[company]) devAuthAll[company] = {};
          if (authority) devAuthAll[company][authority] = (devAuthAll[company][authority] || 0) + won;
          if (fy === "FY 2025") {
            if (!devAuthFy25[company]) devAuthFy25[company] = {};
            if (authority) devAuthFy25[company][authority] = (devAuthFy25[company][authority] || 0) + won;
          }
          if (fy && FY_MARKET[fy] !== undefined) {
            if (!devAuthByFy[fy]) devAuthByFy[fy] = {};
            if (!devAuthByFy[fy][company]) devAuthByFy[fy][company] = {};
            if (authority) {
              devAuthByFy[fy][company][authority] =
                (devAuthByFy[fy][company][authority] || 0) + won;
            }
          }

          if (!devTechAcc[company]) devTechAcc[company] = {};
          if (TECHS.includes(cat)) devTechAcc[company][cat] = (devTechAcc[company][cat] || 0) + won;
          if (TECHS.includes(cat) && fy && FY_MARKET[fy] !== undefined) {
            if (!devTechByFy[fy]) devTechByFy[fy] = {};
            if (!devTechByFy[fy][company]) devTechByFy[fy][company] = {};
            devTechByFy[fy][company][cat] = (devTechByFy[fy][company][cat] || 0) + won;
          }

          if (["Solar", "Hybrid", "RTC/FDRE"].includes(cat) && won > 0) {
            const putTariff = (scope) => {
              if (!coTechTariffAcc[scope][company]) coTechTariffAcc[scope][company] = {};
              if (!coTechTariffAcc[scope][company][cat]) coTechTariffAcc[scope][company][cat] = { w: 0, c: 0 };
              coTechTariffAcc[scope][company][cat].w += tariff * won;
              coTechTariffAcc[scope][company][cat].c += won;
            };
            putTariff("all");
            if (fy === "FY 2025") putTariff("fy25");
            if (fy === "FY 2026") putTariff("fy26");
          }

          if (
            AVAADA_ALIASES.has(companyRaw) &&
            (fy === "FY 2024" || fy === "FY 2025")
          ) {
            avaadaDeals.push({
              t: String(r["RFS No."] ?? "").trim(),
              a: authority,
              c: cat,
              cn: String(r["Connectivity"] ?? "").trim(),
              cap: won,
              ta: tariff,
              fy: fy.replace("FY ", "FY"),
              s: String(r["Status (e-RA/LOA/PPA/COD)"] ?? "").trim(),
              bid,
            });
          }

          if (won > 0 && tariff > 0 && r["RFS No."]) {
            avaadaTariffRows.push({
              rfs: String(r["RFS No."]).trim(),
              dev: company,
              tariff,
            });
          }

          if (["BESS", "Solar+ESS", "ESS/BESS"].includes(cat)) {
            if (statusNorm === "cod achieved" && won > 0) {
              bessCodMw += won;
            }
            if (fy === "FY 2025" && won > 0 && tariff > 0) {
              bessFy25TariffMin =
                bessFy25TariffMin == null ? tariff : Math.min(bessFy25TariffMin, tariff);
              bessFy25TariffMax =
                bessFy25TariffMax == null ? tariff : Math.max(bessFy25TariffMax, tariff);
            }
          }
        }

        for (const fy of ALL_FYS) {
          if (!TECH_BY_FY[fy]) TECH_BY_FY[fy] = {};
          TECH_BY_FY[fy]["ESS/BESS"] =
            (TECH_BY_FY[fy]["ESS/BESS"] || 0) +
            (TECH_BY_FY[fy]["BESS"] || 0) +
            (TECH_BY_FY[fy]["Solar+ESS"] || 0);
          delete TECH_BY_FY[fy]["BESS"];
          delete TECH_BY_FY[fy]["Solar+ESS"];

          if (!AVAADA_TECH_FY[fy]) AVAADA_TECH_FY[fy] = {};
          delete AVAADA_TECH_FY[fy]["BESS"];
          delete AVAADA_TECH_FY[fy]["ESS/BESS"];
          delete AVAADA_TECH_FY[fy]["FSPV"];

          const byDevFy = devTechByFy[fy];
          if (byDevFy) {
            for (const dev of Object.keys(byDevFy)) {
              const b = byDevFy[dev];
              b["ESS/BESS"] =
                (b["ESS/BESS"] || 0) + (b["BESS"] || 0) + (b["Solar+ESS"] || 0);
              delete b["BESS"];
              delete b["Solar+ESS"];
              delete b["FSPV"];
            }
          }
        }

        const TARIFF_BY_TECH = {
          Solar: wAvgPairs(tariffTrajAcc.Solar || {}),
          Hybrid: wAvgPairs(tariffTrajAcc.Hybrid || {}),
          "RTC/FDRE": wAvgPairs(tariffTrajAcc["RTC/FDRE"] || {}),
          Wind: wAvgPairs(tariffTrajAcc.Wind || {}),
          "ESS/BESS": wAvgPairs(bessTrajByFy),
        };

        let bessAwardedMwTotal = 0;
        for (const fy of ALL_FYS) {
          bessAwardedMwTotal += toNum((TECH_BY_FY[fy] || {})["ESS/BESS"]);
        }

        const v24Bess = TARIFF_BY_TECH["ESS/BESS"]?.["FY 2024"];
        const fy25Wt = TARIFF_BY_TECH["ESS/BESS"]?.["FY 2025"];
        let bessFy25VsFy24Pct = null;
        if (
          v24Bess != null &&
          fy25Wt != null &&
          Number(v24Bess) > 0 &&
          Number(fy25Wt) < Number(v24Bess)
        ) {
          bessFy25VsFy24Pct = Math.round((1 - Number(fy25Wt) / Number(v24Bess)) * 100);
        }

        const BESS_INSIGHT = {
          codMw: bessCodMw,
          awardedMwTotal: bessAwardedMwTotal,
          fy25TariffMin: bessFy25TariffMin,
          fy25TariffMax: bessFy25TariffMax,
          fy25VsFy24TariffDropPct: bessFy25VsFy24Pct,
        };

        const REIA_ALL = {};
        for (const [dev, buckets] of Object.entries(reiaAcc)) {
          REIA_ALL[dev] = {
            "Central REIA": toNum(buckets["Central REIA"]),
            State: toNum(buckets["State"]),
          };
        }

        const REIA_BY_FY = {};
        for (const fy of ALL_FYS) {
          const o = {};
          for (const [dev, buckets] of Object.entries(reiaByFy[fy] || {})) {
            o[dev] = {
              "Central REIA": toNum(buckets["Central REIA"]),
              State: toNum(buckets["State"]),
            };
          }
          REIA_BY_FY[fy] = o;
        }

        const IPP_DATA = Object.entries(ippAcc)
          .map(([c, v]) => ({ c, op: toNum(v.op), uc: toNum(v.uc) }))
          .filter((x) => x.op > 0 || x.uc > 0)
          .sort((a, b) => b.op + b.uc - (a.op + a.uc));

        const DEALS_ALL = [...avaadaDeals].sort((a, b) => b.cap - a.cap);
        const DEALS = DEALS_ALL.slice(0, 16);
        const AVAADA_METRICS = {
          totalWon: Object.values(AVAADA_FY).reduce((s, v) => s + toNum(v), 0),
          winRate: avaadaTotalBids > 0 ? (avaadaWonBids / avaadaTotalBids) * 100 : 0,
          bidsWon: avaadaWonBids,
          totalBids: avaadaTotalBids,
          loaIssued: avaadaLoaIssued,
          ppaSigned: avaadaPpaSigned,
        };

        const authorityKeys = ["SECI", "NHPC", "NTPC", "SJVN", "GUVNL", "MSEDCL", "MSAPL", "RUMSL", "REMCL", "RUVNL"];
        const mapAuthMatrix = (src) => {
          const out = {};
          for (const [dev, buckets] of Object.entries(src)) {
            out[dev] = {};
            for (const k of authorityKeys) out[dev][k] = toNum(buckets[k]);
          }
          return out;
        };
        const HM_AUTH_ALL = mapAuthMatrix(devAuthAll);
        const HM_AUTH_FY25 = mapAuthMatrix(devAuthFy25);
        const HM_AUTH_BY_FY = {};
        for (const fy of ALL_FYS) {
          if (devAuthByFy[fy] && Object.keys(devAuthByFy[fy]).length) {
            HM_AUTH_BY_FY[fy] = mapAuthMatrix(devAuthByFy[fy]);
          } else {
            HM_AUTH_BY_FY[fy] = {};
          }
        }

        const buildTechMatrixFromBuckets = (devAcc) =>
          Object.entries(devAcc || {})
            .map(([dev, b]) => {
              const bess = toNum(b["ESS/BESS"]) + toNum(b.BESS) + toNum(b["Solar+ESS"]);
              const solar = toNum(b.Solar);
              const hybrid = toNum(b.Hybrid);
              const fdre = toNum(b["RTC/FDRE"]) + toNum(b.FDRE);
              const wind = toNum(b.Wind);
              const total = solar + hybrid + fdre + bess + wind + toNum(b.SFPV);
              return {
                dev,
                solar: solar || null,
                hybrid: hybrid || null,
                fdre: fdre || null,
                bess: bess || null,
                wind: wind || null,
                total,
                isAvaada: dev === "Avaada",
              };
            })
            .filter((r) => r.total > 0)
            .sort((a, b) => b.total - a.total);

        const TECH_MATRIX = buildTechMatrixFromBuckets(devTechAcc);

        const TECH_MATRIX_BY_FY = {};
        for (const fy of ALL_FYS) {
          const acc = devTechByFy[fy];
          TECH_MATRIX_BY_FY[fy] =
            acc && Object.keys(acc).length ? buildTechMatrixFromBuckets(acc) : [];
        }

        const CO_TECH_TARIFF = { all: {}, fy25: {}, fy26: {} };
        for (const scope of ["all", "fy25", "fy26"]) {
          for (const [dev, cats] of Object.entries(coTechTariffAcc[scope])) {
            CO_TECH_TARIFF[scope][dev] = {};
            for (const [cat, v] of Object.entries(cats)) {
              CO_TECH_TARIFF[scope][dev][cat] = {
                t: round2(v.c > 0 ? v.w / v.c : null),
                c: v.c,
              };
            }
          }
        }

        const CONNECTIVITY_BY_FY = ALL_FYS.map((fy) => {
          const buckets = connectivityByFyRaw[fy] || {};
          const ists = toNum(buckets.ISTS) + toNum(buckets["CTU+ISTS"]);
          const stu = toNum(buckets.STU);
          const others = Object.entries(buckets)
            .filter(([k]) => !["ISTS", "CTU+ISTS", "STU"].includes(k))
            .reduce((s, [, v]) => s + toNum(v), 0);
          return { fy, ISTS: ists, STU: stu, Others: others };
        });

        const OVERALL_CONNECTIVITY_SPLIT = CONNECTIVITY_BY_FY.reduce(
          (acc, row) => {
            acc.ISTS += row.ISTS;
            acc.STU += row.STU;
            acc.Others += row.Others;
            return acc;
          },
          { ISTS: 0, STU: 0, Others: 0 }
        );

        const istsT = connectivityTariffAcc.ISTS;
        const stuT = connectivityTariffAcc.STU;
        const istsWtdTariff = istsT.cap > 0 ? istsT.w / istsT.cap : null;
        const stuWtdTariff = stuT.cap > 0 ? stuT.w / stuT.cap : null;
        const CONNECTIVITY_TARIFF =
          istsWtdTariff != null && stuWtdTariff != null
            ? {
                istsWtdAvg: istsWtdTariff,
                stuWtdAvg: stuWtdTariff,
                /** Positive when STU clears higher → ISTS lower by this margin (₹/kWh). */
                stuPremiumVsIsts: stuWtdTariff - istsWtdTariff,
              }
            : { istsWtdAvg: null, stuWtdAvg: null, stuPremiumVsIsts: null };

        const groupedTariff = {};
        for (const row of avaadaTariffRows) {
          if (!groupedTariff[row.rfs]) groupedTariff[row.rfs] = { avaada: [], other: [] };
          if (row.dev === "Avaada") groupedTariff[row.rfs].avaada.push(row.tariff);
          else groupedTariff[row.rfs].other.push(row.tariff);
        }
        const PREMIUM_DATA = Object.entries(groupedTariff)
          .map(([t, v]) => {
            if (!v.avaada.length || !v.other.length) return null;
            const premRupee = Math.max(0, Math.min(...v.avaada) - Math.min(...v.other));
            return { t, p: round2(premRupee * 100) };
          })
          .filter(Boolean)
          .sort((a, b) => b.p - a.p)
          .slice(0, 14);

        const FDRE_LEADERS = Object.entries(devTechAcc)
          .map(([name, b]) => ({ name, v: toNum(b["RTC/FDRE"]) }))
          .filter((x) => x.v > 0)
          .sort((a, b) => b.v - a.v)
          .slice(0, 7);

        for (const fy of ALL_FYS) {
          if (!AUTH_BY_FY[fy]) AUTH_BY_FY[fy] = {};
          for (const a of AUTHORITIES) AUTH_BY_FY[fy][a] = toNum(AUTH_BY_FY[fy][a]);
        }

        const fyPresent = new Set();
        for (const r of rows) {
          const fy = String(r["Financial Year"] ?? "").trim();
          if (fy) fyPresent.add(fy);
        }
        const fySorted = [...fyPresent].sort((a, b) => {
          const ya = parseInt(String(a).replace(/\D/g, ""), 10) || 0;
          const yb = parseInt(String(b).replace(/\D/g, ""), 10) || 0;
          return ya - yb;
        });
        let WORKBOOK_FY_RANGE_LABEL = null;
        if (fySorted.length === 1) {
          WORKBOOK_FY_RANGE_LABEL = fySorted[0].replace(/\s+/g, "");
        } else if (fySorted.length > 1) {
          WORKBOOK_FY_RANGE_LABEL = `${fySorted[0].replace(/\s+/g, "")}–${fySorted[fySorted.length - 1].replace(/\s+/g, "")}`;
        }

        resolve({
          WORKBOOK_ROW_COUNT: rows.length,
          WORKBOOK_FY_RANGE_LABEL,
          FY_MARKET,
          AVAADA_FY,
          TECH_BY_FY,
          TARIFF_BY_TECH,
          CO_BY_FY,
          AUTH_BY_FY,
          AVAADA_TECH_FY,
          CO_TECH_TARIFF,
          HM_AUTH_ALL,
          HM_AUTH_FY25,
          HM_AUTH_BY_FY,
          REIA_ALL,
          REIA_BY_FY,
          TECH_MATRIX_BY_FY,
          IPP_DATA,
          TECH_MATRIX,
          CONNECTIVITY_BY_FY,
          OVERALL_CONNECTIVITY_SPLIT,
          CONNECTIVITY_TARIFF,
          PREMIUM_DATA,
          BESS_INSIGHT,
          FDRE_LEADERS,
          AVAADA_METRICS,
          DEALS,
          DEALS_ALL,
        });
      } catch (e) {
        reject(new Error(`Failed to derive dashboard data from Excel: ${e.message}`));
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

export function deriveAvaadaDataFromExcelArrayBuffer(buffer) {
  return new Promise((resolve, reject) => {
    try {
      const wb = XLSX.read(buffer, { type: "array" });
      const sheet = wb.Sheets["M. Data"] || wb.Sheets[wb.SheetNames[0]];
      if (!sheet) throw new Error("No worksheet found.");
      const fileLike = new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })]);
      const asFile = new File([fileLike], "data.xlsx");
      deriveAvaadaDataFromExcelFile(asFile).then(resolve).catch(reject);
    } catch (e) {
      reject(new Error(`Failed to derive dashboard data from Excel: ${e.message}`));
    }
  });
}

export async function deriveAvaadaDataFromExcelUrl(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Could not load ${url} (HTTP ${response.status}).`);
  }
  const contentType = (response.headers.get("content-type") || "").toLowerCase();
  if (contentType.includes("text/html")) {
    throw new Error(
      `Expected an Excel file at ${url}, but received HTML. Place data.xlsx in frontend/public/ (or set VITE_DASHBOARD_DATA_XLSX_URL to a direct .xlsx URL).`
    );
  }
  const buffer = await response.arrayBuffer();
  return deriveAvaadaDataFromExcelArrayBuffer(buffer);
}

function trimApiBase(base) {
  if (typeof base !== "string") return "";
  return base.trim().replace(/\/$/, "");
}

/** Load dashboard workbook from the API (S3-backed GET /api/dashboard-data/xlsx). Requires session cookie. */
export async function deriveAvaadaDataFromDashboardApi(apiBase) {
  const base = trimApiBase(apiBase);
  if (!base) throw new Error("API base URL is not configured.");
  const xlsxUrl = `${base}/api/dashboard-data/xlsx`;
  const metaUrl = `${base}/api/dashboard-data/workbook-meta`;
  const [res, metaRes] = await Promise.all([
    fetch(xlsxUrl, { credentials: "include", cache: "no-store" }),
    fetch(metaUrl, { credentials: "include", cache: "no-store" }),
  ]);

  const metaJson = metaRes.ok ? await metaRes.json().catch(() => ({})) : {};

  const ct = (res.headers.get("content-type") || "").toLowerCase();
  if (!res.ok) {
    if (ct.includes("application/json")) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j.message || `Could not load dashboard file (HTTP ${res.status}).`);
    }
    throw new Error(`Could not load dashboard file (HTTP ${res.status}).`);
  }
  if (ct.includes("application/json")) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.message || "Server returned JSON instead of an Excel file.");
  }

  let fileUpdatedAt =
    typeof metaJson.lastModified === "string" && metaJson.lastModified
      ? metaJson.lastModified
      : null;
  if (!fileUpdatedAt) {
    fileUpdatedAt =
      res.headers.get("x-dashboard-file-updated-at") ||
      (res.headers.get("last-modified")
        ? new Date(res.headers.get("last-modified")).toISOString()
        : null);
  }

  const buffer = await res.arrayBuffer();
  const derived = await deriveAvaadaDataFromExcelArrayBuffer(buffer);
  return {
    ...derived,
    WORKBOOK_FILE_UPDATED_AT: fileUpdatedAt && !isNaN(new Date(fileUpdatedAt).getTime()) ? fileUpdatedAt : null,
  };
}
