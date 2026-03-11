<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Avaada | RE Competitive Intelligence v3</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #f5f6fa;
  --surface: #ffffff;
  --surface2: #f0f2f8;
  --surface3: #e8ebf4;
  --border: #dde1ee;
  --border2: #c8cde0;
  --text: #1a1f36;
  --text2: #3d4466;
  --muted: #7b82a0;
  --muted2: #c5cad8;

  /* Distinct palette — no adjacent colours too similar */
  --c-solar:   #e07b00;   /* amber-orange */
  --c-hybrid:  #6930c3;   /* vivid purple */
  --c-fdre:    #0077b6;   /* ocean blue */
  --c-bess:    #d62828;   /* strong red */
  --c-wind:    #2dc653;   /* green */
  --c-fspv:    #e5383b;

  --c-avaada:  #0077b6;
  --c-jsw:     #e07b00;
  --c-renew:   #6930c3;
  --c-ntpc:    #2dc653;
  --c-adani:   #d62828;
  --c-juniper: #f77f00;
  --c-sael:    #00b4d8;
  --c-acme:    #9b2226;

  --c-ists:    #0077b6;
  --c-stu:     #e07b00;

  --green: #2dc653;
  --red:   #d62828;
  --amber: #e07b00;

  --accent:  #0077b6;
  --accent2: #e07b00;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; font-size: 13px; }

/* ── HEADER ── */
.header {
  background: var(--surface);
  border-bottom: 2px solid var(--border);
  padding: 13px 28px;
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; z-index: 300;
  box-shadow: 0 1px 6px rgba(0,0,0,.06);
}
.logo { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 18px; color: var(--accent); letter-spacing: -0.5px; }
.logo span { color: var(--muted); font-weight: 400; }
.hbadge { background: var(--accent); color: #fff; font-size: 9px; font-weight: 700; padding: 3px 9px; border-radius: 3px; letter-spacing: 1.5px; }
.hmeta { font-size: 10px; color: var(--muted); text-align: right; line-height: 1.7; }
.hmeta strong { color: var(--text2); }

/* ── SCOPE BAR ── */
.scope-bar {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 0 28px;
  display: flex; align-items: center; gap: 0;
  position: sticky; top: 55px; z-index: 200;
}
.scope-btn {
  padding: 11px 20px; font-size: 11px; font-weight: 600; letter-spacing: .8px;
  color: var(--muted); cursor: pointer; border-bottom: 3px solid transparent;
  text-transform: uppercase; transition: all .18s; white-space: nowrap;
}
.scope-btn:hover { color: var(--text); }
.scope-btn.active         { color: var(--accent);  border-bottom-color: var(--accent); }
.scope-btn.s-fy25.active  { color: #6930c3;         border-bottom-color: #6930c3; }
.scope-btn.s-fy26.active  { color: #d62828;         border-bottom-color: #d62828; }
.scope-divider { width: 1px; height: 22px; background: var(--border); margin: 0 6px; }

/* ── FY PILLS ── */
.date-range { margin-left: auto; display: flex; align-items: center; gap: 8px; }
.dr-label { font-size: 10px; color: var(--muted); letter-spacing: .8px; font-weight: 600; }
.fy-pills { display: flex; gap: 4px; }
.fy-pill {
  padding: 4px 11px; font-size: 10px; font-weight: 600;
  background: var(--surface2); border: 1.5px solid var(--border2);
  border-radius: 20px; cursor: pointer; color: var(--muted);
  transition: all .15s;
}
.fy-pill:hover { border-color: var(--accent); color: var(--accent); }
.fy-pill.active { background: var(--accent); border-color: var(--accent); color: #fff; }

/* ── NAV ── */
.nav {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 0 28px;
  display: flex; overflow-x: auto;
  position: sticky; top: 99px; z-index: 200;
}
.nav::-webkit-scrollbar { display: none; }
.nav-tab {
  padding: 10px 17px; font-size: 11px; font-weight: 600; letter-spacing: .5px;
  color: var(--muted); cursor: pointer; border-bottom: 3px solid transparent;
  white-space: nowrap; transition: all .15s;
}
.nav-tab:hover { color: var(--text); }
.nav-tab.active { color: var(--accent); border-bottom-color: var(--accent); }

/* ── SCOPE BADGE ── */
.scope-badge { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 9px; font-weight: 700; letter-spacing: .8px; margin-left: 6px; vertical-align: middle; }
.sb-all  { background: #e8f4fd; color: var(--accent); }
.sb-fy25 { background: #f0ebfd; color: #6930c3; }
.sb-fy26 { background: #fdeaea; color: #d62828; }

/* ── LAYOUT ── */
.section { display: none; padding: 20px 28px; }
.section.active { display: block; }

.kpi-row { display: grid; gap: 12px; margin-bottom: 16px; }
.kpi-5 { grid-template-columns: repeat(5,1fr); }
.kpi-4 { grid-template-columns: repeat(4,1fr); }

.kpi {
  background: var(--surface); border: 1.5px solid var(--border);
  padding: 14px 16px; border-radius: 8px;
  border-top: 3px solid transparent;
}
.kpi.k1 { border-top-color: var(--c-avaada); }
.kpi.k2 { border-top-color: var(--c-jsw); }
.kpi.k3 { border-top-color: var(--c-hybrid); }
.kpi.k4 { border-top-color: var(--c-fdre); }
.kpi.k5 { border-top-color: var(--green); }
.kpi-label { font-size: 9px; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 5px; font-weight: 600; }
.kpi-value { font-size: 24px; font-weight: 800; line-height: 1; color: var(--text); }
.kpi-sub { font-size: 9px; color: var(--muted); margin-top: 5px; }
.tag-up { font-size: 9px; padding: 1px 6px; border-radius: 10px; background: #eafaf1; color: var(--green); font-weight: 600; }
.tag-dn { font-size: 9px; padding: 1px 6px; border-radius: 10px; background: #fdeaea; color: var(--red); font-weight: 600; }

.grid-2  { display: grid; grid-template-columns: 1fr 1fr;   gap: 14px; margin-bottom: 14px; }
.grid-3  { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 14px; }
.grid-32 { display: grid; grid-template-columns: 3fr 2fr;   gap: 14px; margin-bottom: 14px; }
.grid-23 { display: grid; grid-template-columns: 2fr 3fr;   gap: 14px; margin-bottom: 14px; }

.card {
  background: var(--surface); border: 1.5px solid var(--border);
  border-radius: 8px; padding: 16px 18px;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
}
.card-title {
  font-size: 11px; font-weight: 700; letter-spacing: .6px; text-transform: uppercase;
  color: var(--text2); margin-bottom: 14px;
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
}
.ctag {
  font-size: 9px; font-weight: 500; background: var(--surface2);
  border: 1px solid var(--border2); padding: 2px 7px; border-radius: 3px; color: var(--muted);
}
.chart-wrap canvas { max-height: 230px; }
.chart-wrap.tall canvas { max-height: 280px; }
.chart-wrap.xtall canvas { max-height: 340px; }

/* ── BAR ROWS ── */
.bar-row { display: flex; align-items: center; gap: 8px; margin-bottom: 7px; }
.bar-label { width: 82px; font-size: 11px; color: var(--text2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-shrink: 0; }
.bar-track { flex: 1; background: var(--surface3); border-radius: 3px; height: 7px; }
.bar-fill  { height: 100%; border-radius: 3px; transition: width .4s; }
.bar-val   { width: 70px; text-align: right; font-size: 11px; font-weight: 600; color: var(--text2); }

/* ── NOTE BOXES ── */
.note {
  background: #eaf5fd; border: 1px solid #b3d9f0; border-left: 3px solid var(--accent);
  padding: 9px 12px; font-size: 10px; color: var(--text2); border-radius: 0 6px 6px 0;
  margin-top: 10px; line-height: 1.7;
}
.note strong { color: var(--text); }
.note.warn   { background: #fff7ed; border-color: #fcd9aa; border-left-color: var(--amber); }
.note.red    { background: #fdeaea; border-color: #f5b8b8; border-left-color: var(--red); }
.note.green  { background: #eafaf1; border-color: #aee8c4; border-left-color: var(--green); }

/* ── HEATMAP ── */
.heatmap-wrap { overflow-x: auto; }
.heatmap { border-collapse: collapse; width: 100%; font-size: 11px; }
.heatmap th {
  padding: 7px 10px; font-size: 9px; letter-spacing: .8px; color: var(--muted);
  border-bottom: 2px solid var(--border); font-weight: 700; text-transform: uppercase;
  white-space: nowrap; text-align: center; background: var(--surface2);
}
.heatmap th.row-h { text-align: left; }
.heatmap td { padding: 5px 8px; text-align: center; border-bottom: 1px solid var(--border); }
.heatmap td.row-label { text-align: left; font-weight: 700; color: var(--text); border-right: 2px solid var(--border); padding-right: 12px; }
.heatmap tr.avaada-row td.row-label { color: var(--accent); }
.heatmap tr:hover td { background: var(--surface2); }
.hm-cell { display: inline-block; padding: 3px 8px; border-radius: 4px; min-width: 56px; font-size: 11px; font-weight: 600; }
.hm-0 { color: var(--muted2); }

/* ── TECH TARIFF TABLE ── */
.tt-table { width: 100%; border-collapse: collapse; }
.tt-table th {
  padding: 8px 12px; font-size: 9px; letter-spacing: .8px; color: var(--muted);
  border-bottom: 2px solid var(--border); text-transform: uppercase; text-align: center;
  background: var(--surface2); font-weight: 700;
}
.tt-table th:first-child { text-align: left; }
.tt-table td { padding: 8px 12px; border-bottom: 1px solid var(--border); text-align: center; vertical-align: middle; }
.tt-table td:first-child { text-align: left; font-weight: 700; color: var(--text); }
.tt-table tr.avaada-row td:first-child { color: var(--accent); }
.tt-table tr:last-child td { border-bottom: none; }
.tt-table tr:hover td { background: var(--surface2); }
.tariff-cell { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.t-val { font-size: 13px; font-weight: 700; }
.t-cap { font-size: 9px; color: var(--muted); }
.t-bar { width: 52px; height: 4px; background: var(--surface3); border-radius: 2px; margin-top: 2px; }
.t-bar-fill { height: 100%; border-radius: 2px; }
.t-na { color: var(--muted2); font-size: 11px; }
.best-tag  { font-size: 8px; padding: 1px 5px; border-radius: 3px; background: #eafaf1; color: var(--green); font-weight: 700; }
.worst-tag { font-size: 8px; padding: 1px 5px; border-radius: 3px; background: #fdeaea; color: var(--red); font-weight: 700; }

/* ── STATUS PILLS ── */
.pill { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 9px; font-weight: 700; }
.pill-ppa    { background: #eafaf1; color: #1a7a40; }
.pill-loa    { background: #fff7ed; color: #b35400; }
.pill-cod    { background: #e8f4fd; color: #005f99; }
.pill-cancel { background: #fdeaea; color: #9b1c1c; }

/* ── PEER CARDS ── */
.peer-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
.peer-card {
  background: var(--surface2); border: 1.5px solid var(--border);
  border-radius: 7px; padding: 12px 14px;
}
.peer-card.ac { border-color: var(--accent); background: #eaf5fd; }
.peer-name { font-weight: 800; font-size: 13px; margin-bottom: 7px; color: var(--text); }
.peer-card.ac .peer-name { color: var(--accent); }
.peer-stats { display: flex; flex-wrap: wrap; gap: 10px; font-size: 11px; }
.ps-label { font-size: 9px; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: .5px; }
.ps-val   { font-size: 12px; font-weight: 700; color: var(--text); }
.win-bar  { height: 4px; background: var(--surface3); border-radius: 2px; margin-top: 8px; }
.win-fill { height: 100%; border-radius: 2px; }

/* ── SCROLL TABLE ── */
.scroll-table { overflow-y: auto; max-height: 320px; }
.scroll-table::-webkit-scrollbar { width: 4px; }
.scroll-table::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }
.data-table { width: 100%; border-collapse: collapse; font-size: 11px; }
.data-table th {
  padding: 8px 10px; font-size: 9px; letter-spacing: .8px; color: var(--muted);
  border-bottom: 2px solid var(--border); font-weight: 700; text-transform: uppercase;
  position: sticky; top: 0; background: var(--surface); z-index: 10;
}
.data-table td { padding: 7px 10px; border-bottom: 1px solid var(--border); }
.data-table tr:hover td { background: var(--surface2); }

/* ── SEC HEADER ── */
.sec-hdr { margin-bottom: 16px; padding-bottom: 10px; border-bottom: 2px solid var(--border); display: flex; align-items: flex-end; justify-content: space-between; }
.sec-title { font-size: 20px; font-weight: 800; color: var(--text); }
.sec-sub { font-size: 11px; color: var(--muted); margin-top: 3px; }
.sec-note { font-size: 10px; color: var(--muted); }

@media(max-width: 960px){
  .kpi-5,.kpi-4 { grid-template-columns: repeat(2,1fr); }
  .grid-2,.grid-3,.grid-32,.grid-23 { grid-template-columns: 1fr; }
  .peer-grid { grid-template-columns: 1fr 1fr; }
}
</style>
</head>
<body>

<!-- HEADER -->
<div class="header">
  <div style="display:flex;align-items:center;gap:12px">
    <div class="logo">AVAADA <span>/ RE Intel</span></div>

  </div>
  <div class="hmeta">India Utility RE Auctions · FY2021–FY2026 · 675 successful bids · 1,299 total records<br>
    <strong>Data: March 2, 2026</strong> · v3
  </div>
</div>

<!-- SCOPE + DATE RANGE -->
<div class="scope-bar">
  <div class="scope-btn s-all active" onclick="setScope('all',this)">All Data</div>
  <div class="scope-divider"></div>
  <div class="scope-btn s-fy25" onclick="setScope('fy25',this)">FY 2025</div>
  <div class="scope-btn s-fy26" onclick="setScope('fy26',this)">FY 2026</div>
  <div class="date-range">
    <span class="dr-label">FY RANGE:</span>
    <div class="fy-pills" id="fyPills">
      <div class="fy-pill active" data-fy="FY 2021" onclick="toggleFY(this)">FY21</div>
      <div class="fy-pill active" data-fy="FY 2022" onclick="toggleFY(this)">FY22</div>
      <div class="fy-pill active" data-fy="FY 2023" onclick="toggleFY(this)">FY23</div>
      <div class="fy-pill active" data-fy="FY 2024" onclick="toggleFY(this)">FY24</div>
      <div class="fy-pill active" data-fy="FY 2025" onclick="toggleFY(this)">FY25</div>
      <div class="fy-pill active" data-fy="FY 2026" onclick="toggleFY(this)">FY26</div>
    </div>
  </div>
</div>

<!-- NAV -->
<div class="nav">
  <div class="nav-tab active" onclick="showSection('overview',this)">Market Overview</div>
  <div class="nav-tab" onclick="showSection('technology',this)">Technology Mix</div>
  <div class="nav-tab" onclick="showSection('connectivity',this)">Connectivity</div>
  <div class="nav-tab" onclick="showSection('avaada',this)">Avaada Deep Dive</div>
  <div class="nav-tab" onclick="showSection('peers',this)">Competitive Landscape</div>
  <div class="nav-tab" onclick="showSection('tariff',this)">Tariff Intelligence</div>
  <div class="nav-tab" onclick="showSection('heatmap',this)">Competitor Heatmap</div>
  <div class="nav-tab" onclick="showSection('pipeline',this)">Pipeline & Status</div>
</div>

<!-- ═══════════════════════════════════════════════ OVERVIEW -->
<div class="section active" id="overview">
  <div class="sec-hdr">
    <div>
      <div class="sec-title">Market Overview <span id="ovBadge" class="scope-badge sb-all">ALL DATA</span></div>
      <div class="sec-sub">Utility-scale RE capacity awarded · Central & State REIAs</div>
    </div>
    <div class="sec-note">Capacities in MW · Tariffs in ₹/kWh</div>
  </div>
  <div class="kpi-row kpi-5">
    <div class="kpi k1"><div class="kpi-label">Total Awarded</div><div class="kpi-value" id="kv-total">—</div><div class="kpi-sub">MW in selected range</div></div>
    <div class="kpi k2"><div class="kpi-label">Peak FY</div><div class="kpi-value" id="kv-peak">—</div><div class="kpi-sub">MW in peak year</div></div>
    <div class="kpi k3"><div class="kpi-label">Avaada Won</div><div class="kpi-value" id="kv-av">—</div><div class="kpi-sub">MW in range</div></div>
    <div class="kpi k4"><div class="kpi-label">Avaada Market Share</div><div class="kpi-value" id="kv-share">—</div><div class="kpi-sub">of total market</div></div>
    <div class="kpi k5"><div class="kpi-label">ISTS Dominance</div><div class="kpi-value" style="color:var(--c-ists)">60%</div><div class="kpi-sub">104,181 MW inter-state</div></div>
  </div>
  <div class="grid-32">
    <div class="card">
      <div class="card-title">Annual Capacity Awarded <span class="ctag" id="ovChartLabel">ALL FY · MW</span></div>
      <div class="chart-wrap tall"><canvas id="fyMarketChart"></canvas></div>
    </div>
    <div class="card">
      <div class="card-title">Top Bidding Authorities <span class="ctag" id="authLabel">ALL FY · MW</span></div>
      <div id="authBars" style="margin-top:6px"></div>
    </div>
  </div>
  <div class="grid-2">
    <div class="card">
      <div class="card-title">Top Developers — Won Capacity <span class="ctag" id="topCoLabel">FY RANGE</span></div>
      <div class="chart-wrap tall"><canvas id="topCosChart"></canvas></div>
    </div>
    <div class="card">
      <div class="card-title">IPP Portfolio — Operational vs Secured <span class="ctag">Mar 2025</span></div>
      <div class="chart-wrap tall"><canvas id="ippPortChart"></canvas></div>
      <div class="note warn"><strong>Avaada flag:</strong> 84.6% under-construction/secured — lowest operational ratio among all top IPPs. Execution risk is the #1 strategic concern.</div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════ TECHNOLOGY -->
<div class="section" id="technology">
  <div class="sec-hdr">
    <div>
      <div class="sec-title">Technology Mix <span id="techBadge" class="scope-badge sb-all">ALL DATA</span></div>
      <div class="sec-sub">Solar · Hybrid · RTC/FDRE · BESS/ESS · Wind — India's evolving energy portfolio</div>
    </div>
  </div>
  <div class="grid-2">
    <div class="card">
      <div class="card-title">Market Tech Mix by FY <span class="ctag" id="techStackLabel">Stacked MW</span></div>
      <div class="chart-wrap xtall"><canvas id="techStackChart"></canvas></div>
    </div>
    <div class="card">
      <div class="card-title">Tariff Trajectory by Technology <span class="ctag" id="tariffTechLabel">₹/kWh · All FY</span></div>
      <div class="chart-wrap xtall"><canvas id="tariffTechChart"></canvas></div>
      <div class="note"><strong>FDRE:</strong> Peaked ₹4.58 FY24 → ₹4.15 FY25 as competition intensified. <strong>FY26 BESS growth:</strong> 57% of new awards are storage-led (15,080 MW of 26,352 MW total), reflecting rapid market expansion.</div>
      <div class="note warn" style="margin-top:8px">
        <strong>Why BESS tariffs collapsed 76% in 3 years — it's the tender design, not just battery costs</strong><br><br>
        <strong>1. Duration shift — 4-hr replaced 2-hr as standard.</strong> FY23's ₹10.22 benchmark was SECI's first-ever standalone BESS tender (Aug 2022, 500 MW / 1,000 MWh, 2-hr duration). Longer duration batteries allow developers to amortise fixed costs over more MWh, slashing the per-kWh tariff even before hardware prices moved.<br><br>
        <strong>2. Tenure extension — 12yr → 25yr contracts.</strong> Early SECI tenders ran 12-year PPAs. NTPC moved to 25-year and PCKL to 40-year terms. Longer tenures spread capex recovery over more cycles, directly lowering the bid tariff. IEEFA notes tenure is the single most influential tender variable on discovered price.<br><br>
        <strong>3. VGF subsidy — up to 30% capex support.</strong> The Cabinet-approved VGF scheme (Sep 2023, ₹3,760 Cr for 4 GWh Tranche-1; expanded to 30 GWh in 2025) subsidises up to ₹4.6 lakh/MWh. Maharashtra (Aug 2024, 300 MW) and Rajasthan (Nov 2024, 500 MW) cleared at ₹2.19–2.21 lakh/MW/month with VGF — ~40% below pre-VGF auctions.<br><br>
        <strong>4. Hardware cost crash.</strong> Li-ion pack prices fell ~40% in 2024 alone (ICRA). SECI's first tender assumed ~$300/kWh capex; FY26 bids are being priced at sub-$120/kWh implied pack cost, driven by Chinese oversupply.<br><br>
        <strong>5. ISTS charge waiver.</strong> MoP extended ISTS charge waiver for solar+BESS to 2028 (standalone BESS waiver runs to Jun 2026), materially reducing the effective cost of inter-state storage projects.<br><br>
        <em style="color:var(--red);font-weight:600">Risk flag:</em> Only 758 MWh commissioned vs 12+ GWh awarded. IEEFA warns of aggressive underbidding — developers pricing in unrealistic future battery cost declines. Chinese export controls and rising metal prices could stress FY26 tariff assumptions.
      </div>
    </div>
  </div>
  <div class="grid-3">
    <div class="card">
      <div class="card-title">FY25 Market — Technology Share</div>
      <div class="chart-wrap"><canvas id="techPie25"></canvas></div>
    </div>
    <div class="card">
      <div class="card-title">FY26 Early Awards — Tech Share</div>
      <div class="chart-wrap"><canvas id="techPie26"></canvas></div>
      <div class="note" style="margin-top:8px"><strong>FY26 mix:</strong> BESS/ESS = 57% of awards (15,080 MW of 26,352 MW total), up from 18% in FY25 — reflecting the VGF scheme driving standalone storage tenders.</div>
    </div>
    <div class="card">
      <div class="card-title">Avaada Tech Mix — All FY</div>
      <div class="chart-wrap"><canvas id="avaadaTechPie"></canvas></div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════ CONNECTIVITY -->
<div class="section" id="connectivity">
  <div class="sec-hdr">
    <div>
      <div class="sec-title">Connectivity & Grid Analysis</div>
      <div class="sec-sub">ISTS · STU · CTU · Khavda — tariff implications of grid type</div>
    </div>
  </div>
  <div class="kpi-row kpi-4">
    <div class="kpi k1"><div class="kpi-label">ISTS</div><div class="kpi-value" style="color:var(--c-ists)">104,181</div><div class="kpi-sub">MW · Solar avg ₹2.58</div></div>
    <div class="kpi k2"><div class="kpi-label">STU</div><div class="kpi-value" style="color:var(--c-stu)">47,452</div><div class="kpi-sub">MW · Solar avg ₹2.94</div></div>
    <div class="kpi k4"><div class="kpi-label">CTU + Khavda</div><div class="kpi-value" style="color:var(--c-hybrid)">10,875</div><div class="kpi-sub">MW · Gujarat cluster</div></div>
    <div class="kpi k3"><div class="kpi-label">ISTS–STU Solar Gap</div><div class="kpi-value" style="color:var(--c-fdre)">₹0.36</div><div class="kpi-sub">Per kWh structural premium</div></div>
  </div>
  <div class="grid-2">
    <div class="card">
      <div class="card-title">Connectivity Split by FY</div>
      <div class="chart-wrap tall"><canvas id="connYearChart"></canvas></div>
    </div>
    <div class="card">
      <div class="card-title">Overall Connectivity Share</div>
      <div class="chart-wrap"><canvas id="connPieChart"></canvas></div>
      <div class="note">ISTS dominance reflects Central REIA route (SECI/NHPC/NTPC/SJVN) = 60% of all capacity — park-scale projects without STU congestion constraints.</div>
    </div>
  </div>
  <div class="grid-2">
    <div class="card">
      <div class="card-title">Solar Tariff: ISTS vs STU <span class="ctag">FY24+25 Scatter</span></div>
      <div class="chart-wrap"><canvas id="iststuChart"></canvas></div>
    </div>
    <div class="card">
      <div class="card-title">Avaada Solar Mix — Grid Type</div>
      <div style="margin-top:16px">
        <div class="bar-row"><div class="bar-label" style="color:var(--c-ists)">ISTS</div><div class="bar-track"><div class="bar-fill" style="width:64%;background:var(--c-ists)"></div></div><div class="bar-val">5,150 MW</div></div>
        <div class="bar-row"><div class="bar-label" style="color:var(--c-stu)">STU (All)</div><div class="bar-track"><div class="bar-fill" style="width:34%;background:var(--c-stu)"></div></div><div class="bar-val">2,722 MW</div></div>
        <div class="bar-row"><div class="bar-label">GETCO Prph.</div><div class="bar-track"><div class="bar-fill" style="width:3.5%;background:var(--c-hybrid)"></div></div><div class="bar-val">280 MW</div></div>
        <div class="bar-row"><div class="bar-label">Rajasthan</div><div class="bar-track"><div class="bar-fill" style="width:2.5%;background:var(--muted)"></div></div><div class="bar-val">200 MW</div></div>
      </div>
      <div class="note warn" style="margin-top:14px"><strong>Why Avaada's aggregate Solar tariff looks elevated:</strong><br>35% of Solar portfolio is STU-connected (MSKVY, GUVNL-STU, MSEDCL), clearing at ₹2.67–3.10 vs. ISTS ₹2.47–2.60. This inflates the aggregate by ~₹0.14/kWh. In same-tender ISTS comparisons, Avaada bids within <strong>1 paisa</strong> of the floor in 13 of 17 tenders.</div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════ AVAADA -->
<div class="section" id="avaada">
  <div class="sec-hdr">
    <div>
      <div class="sec-title">Avaada — Strategic Deep Dive <span id="avBadge" class="scope-badge sb-all">ALL DATA</span></div>
      <div class="sec-sub">80 bids · 16,457 MW won · #1 IPP by FY24+25 capacity</div>
    </div>
  </div>
  <div class="kpi-row kpi-5">
    <div class="kpi k1"><div class="kpi-label">FY25 Won</div><div class="kpi-value" style="color:var(--accent)">9,150</div><div class="kpi-sub"><span class="tag-up">+43% vs FY24</span></div></div>
    <div class="kpi k2"><div class="kpi-label">FDRE Leadership</div><div class="kpi-value" style="color:var(--c-fdre)">3,640</div><div class="kpi-sub">MW RTC/FDRE — #1</div></div>
    <div class="kpi k3"><div class="kpi-label">Win Rate</div><div class="kpi-value" style="color:var(--c-hybrid)">52.5%</div><div class="kpi-sub">42 of 80 bids won</div></div>
    <div class="kpi k4"><div class="kpi-label">NHPC Concentration</div><div class="kpi-value" style="color:var(--amber)">36%</div><div class="kpi-sub">5,950 MW via NHPC</div></div>
    <div class="kpi k5"><div class="kpi-label">FY26 Wins</div><div class="kpi-value" style="color:var(--red)">0</div><div class="kpi-sub"><span class="tag-dn">No wins yet</span></div></div>
  </div>
  <div class="grid-32">
    <div class="card">
      <div class="card-title">Avaada Annual Wins by Technology</div>
      <div class="chart-wrap xtall"><canvas id="avWinChart"></canvas></div>
    </div>
    <div class="card">
      <div class="card-title">Wins by Bidding Authority <span class="ctag">Total MW</span></div>
      <div style="margin-top:8px">
        <div class="bar-row"><div class="bar-label">NHPC</div><div class="bar-track"><div class="bar-fill" style="width:100%;background:var(--accent)"></div></div><div class="bar-val">5,950 MW</div></div>
        <div class="bar-row"><div class="bar-label">NTPC</div><div class="bar-track"><div class="bar-fill" style="width:38.5%;background:var(--c-fdre)"></div></div><div class="bar-val">2,290 MW</div></div>
        <div class="bar-row"><div class="bar-label">SJVN</div><div class="bar-track"><div class="bar-fill" style="width:36.6%;background:var(--c-hybrid)"></div></div><div class="bar-val">2,180 MW</div></div>
        <div class="bar-row"><div class="bar-label">MSEDCL</div><div class="bar-track"><div class="bar-fill" style="width:34.9%;background:var(--c-jsw)"></div></div><div class="bar-val">2,075 MW</div></div>
        <div class="bar-row"><div class="bar-label">MSAPL</div><div class="bar-track"><div class="bar-fill" style="width:19%;background:var(--c-wind)"></div></div><div class="bar-val">1,132 MW</div></div>
        <div class="bar-row"><div class="bar-label">SECI</div><div class="bar-track"><div class="bar-fill" style="width:17.5%;background:var(--c-bess)"></div></div><div class="bar-val">1,040 MW</div></div>
        <div class="bar-row"><div class="bar-label">GUVNL</div><div class="bar-track"><div class="bar-fill" style="width:16.5%;background:#888"></div></div><div class="bar-val">980 MW</div></div>
      </div>
      <div class="note"><strong>NHPC concentration:</strong> 36% of all won capacity tied to one offtaker. NHPC FDRE-II+III alone = 2,400 MW at ₹4.37–4.52/kWh.</div>
    </div>
  </div>
  <div class="grid-2">
    <div class="card">
      <div class="card-title">PPA / LOA Execution Status <span class="ctag">Won MW by Stage</span></div>
      <div class="chart-wrap"><canvas id="statusChart"></canvas></div>
      <div class="note warn"><strong>Execution wall:</strong> 8,360 MW at LoA stage — PPA not yet signed. FY25 wins (6,120 MW LoA) face 12–18 month conversion risk.</div>
    </div>
    <div class="card">
      <div class="card-title">FDRE Segment Leadership <span class="ctag">FY24+25 · MW Won</span></div>
      <div class="chart-wrap tall"><canvas id="fdreChart"></canvas></div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════ PEERS -->
<div class="section" id="peers">
  <div class="sec-hdr">
    <div>
      <div class="sec-title">Competitive Landscape <span id="peerBadge" class="scope-badge sb-all">ALL DATA</span></div>
      <div class="sec-sub">Win rates · capacity won · technology strategies</div>
    </div>
  </div>
  <div class="grid-2">
    <div class="card">
      <div class="card-title">Developer Scorecards <span class="ctag">FY21–26</span></div>
      <div class="peer-grid" style="margin-top:6px">
        <div class="peer-card ac"><div class="peer-name">Avaada</div><div class="peer-stats"><div><div class="ps-label">FY24+25</div><div class="ps-val">15,562 MW</div></div><div><div class="ps-label">Win Rate</div><div class="ps-val" style="color:var(--amber)">52.5%</div></div></div><div class="win-bar"><div class="win-fill" style="width:52.5%;background:var(--accent)"></div></div></div>
        <div class="peer-card"><div class="peer-name">JSW</div><div class="peer-stats"><div><div class="ps-label">FY24+25</div><div class="ps-val">10,135 MW</div></div><div><div class="ps-label">Win Rate</div><div class="ps-val" style="color:var(--green)">69.4%</div></div></div><div class="win-bar"><div class="win-fill" style="width:69.4%;background:var(--c-jsw)"></div></div></div>
        <div class="peer-card"><div class="peer-name">Renew</div><div class="peer-stats"><div><div class="ps-label">FY24+25</div><div class="ps-val">8,514 MW</div></div><div><div class="ps-label">Win Rate</div><div class="ps-val">49.0%</div></div></div><div class="win-bar"><div class="win-fill" style="width:49%;background:var(--c-renew)"></div></div></div>
        <div class="peer-card"><div class="peer-name">NTPC</div><div class="peer-stats"><div><div class="ps-label">FY24+25</div><div class="ps-val">5,125 MW</div></div><div><div class="ps-label">Win Rate</div><div class="ps-val">47.5%</div></div></div><div class="win-bar"><div class="win-fill" style="width:47.5%;background:var(--c-ntpc)"></div></div></div>
        <div class="peer-card"><div class="peer-name">Adani</div><div class="peer-stats"><div><div class="ps-label">FY24+25</div><div class="ps-val">3,895 MW</div></div><div><div class="ps-label">Win Rate</div><div class="ps-val">46.7%</div></div></div><div class="win-bar"><div class="win-fill" style="width:46.7%;background:var(--c-adani)"></div></div></div>
        <div class="peer-card"><div class="peer-name">Juniper</div><div class="peer-stats"><div><div class="ps-label">FY24+25</div><div class="ps-val">4,600 MW</div></div><div><div class="ps-label">Win Rate</div><div class="ps-val" style="color:var(--green)">70.7%</div></div></div><div class="win-bar"><div class="win-fill" style="width:70.7%;background:var(--c-juniper)"></div></div></div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">FY24+25 Market Share <span class="ctag">% of 66,533 MW</span></div>
      <div class="chart-wrap xtall"><canvas id="mktShareChart"></canvas></div>
    </div>
  </div>
  <div class="card" style="margin-bottom:14px">
    <div class="card-title">Technology Strategy Matrix <span class="ctag">All FY · Won MW per Developer</span></div>
    <div style="overflow-x:auto">
      <table class="data-table" style="min-width:780px">
        <thead>
          <tr>
            <th>Developer</th>
            <th style="color:var(--c-solar)">Solar</th>
            <th style="color:var(--c-hybrid)">Hybrid</th>
            <th style="color:var(--c-fdre)">FDRE/RTC</th>
            <th style="color:var(--c-bess)">BESS/ESS</th>
            <th style="color:var(--c-wind)">Wind</th>
            <th>Total</th>
            <th>BESS %</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background:#eaf5fd;"><td style="font-weight:800;color:var(--accent)">Avaada</td><td>8,767</td><td>4,000</td><td style="color:var(--c-fdre);font-weight:600">3,640</td><td style="color:var(--muted)">—</td><td>50</td><td><strong>16,457</strong></td><td style="color:var(--muted)">—</td></tr>
          <tr><td style="font-weight:700">JSW</td><td>2,800</td><td>1,700</td><td>1,009</td><td style="color:var(--c-bess);font-weight:600">4,625</td><td>2,160</td><td>12,294</td><td style="color:var(--c-bess)">38%</td></tr>
          <tr><td style="font-weight:700">Renew</td><td>6,600</td><td>900</td><td>3,614</td><td style="color:var(--muted)">—</td><td>300</td><td>11,414</td><td style="color:var(--muted)">—</td></tr>
          <tr><td style="font-weight:700">NTPC</td><td>8,360</td><td>1,200</td><td>1,500</td><td>180</td><td>200</td><td>11,530</td><td>2%</td></tr>
          <tr><td style="font-weight:700">Adani</td><td>1,350</td><td>2,025</td><td>170</td><td style="color:var(--c-bess);font-weight:600">1,250</td><td>870</td><td>5,665</td><td style="color:var(--c-bess)">22%</td></tr>
          <tr><td style="font-weight:700">ACME</td><td>600</td><td>450</td><td>3,260</td><td style="color:var(--c-bess);font-weight:600">915</td><td>—</td><td>5,225</td><td style="color:var(--c-bess)">18%</td></tr>
          <tr><td style="font-weight:700">Juniper</td><td>75</td><td>2,630</td><td>1,820</td><td style="color:var(--muted)">—</td><td>390</td><td>4,915</td><td style="color:var(--muted)">—</td></tr>
          <tr><td style="font-weight:700">SAEL</td><td>3,780</td><td>—</td><td>450</td><td style="color:var(--muted)">—</td><td>—</td><td>4,230</td><td style="color:var(--muted)">—</td></tr>
          <tr style="border-top:1px solid var(--border2);background:var(--surface2)"><td style="font-weight:700;color:var(--muted)">Greenko</td><td>—</td><td>—</td><td>1,001</td><td style="color:var(--c-bess);font-weight:600">3,000</td><td>—</td><td>4,001</td><td style="color:var(--c-bess)">75%</td></tr>
          <tr style="background:var(--surface2)"><td style="font-weight:700;color:var(--muted)">Torrent</td><td>550</td><td>—</td><td>100</td><td style="color:var(--c-bess);font-weight:600">1,500</td><td>400</td><td>2,550</td><td style="color:var(--c-bess)">59%</td></tr>
          <tr style="background:var(--surface2)"><td style="font-weight:700;color:var(--muted)">Patel Infra</td><td>350</td><td>—</td><td>—</td><td style="color:var(--c-bess);font-weight:600">1,503</td><td>—</td><td>1,853</td><td style="color:var(--c-bess)">81%</td></tr>
        </tbody>
      </table>
    </div>
    <div class="note" style="margin-top:10px">
      Avaada's portfolio is concentrated in Solar, Hybrid and FDRE/RTC — segments where it holds a strong track record. JSW (4,625 MW), Greenko (3,000 MW) and Adani (1,250 MW) have been active in BESS alongside their core portfolios. Greenko, Torrent and Patel Infra are largely storage-specialist developers with limited presence in other segments. BESS is shown for reference — it is a structurally different market requiring different balance-sheet, EPC and technology capabilities.
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════ TARIFF -->
<div class="section" id="tariff">
  <div class="sec-hdr">
    <div>
      <div class="sec-title">Tariff Intelligence <span id="tariffBadge" class="scope-badge sb-all">ALL DATA</span></div>
      <div class="sec-sub">Technology-wise mean tariff · same-tender benchmarking · top 6 competitor comparison</div>
    </div>
  </div>
  <div class="card" style="margin-bottom:14px">
    <div class="card-title">Top 6 Competitors — Technology-Wise Weighted Mean Tariff <span class="ctag" id="ttScope">ALL FY · Cap-Weighted ₹/kWh</span></div>
    <div style="overflow-x:auto">
      <table class="tt-table" id="techTariffTable" style="min-width:680px">
        <thead>
          <tr>
            <th style="text-align:left">Developer</th>
            <th><span style="color:var(--c-solar)">●</span> Solar</th>
            <th><span style="color:var(--c-hybrid)">●</span> Hybrid</th>
            <th><span style="color:var(--c-fdre)">●</span> FDRE / RTC</th>
            <th>Overall (cap-wtd)</th>
          </tr>
        </thead>
        <tbody id="ttBody"></tbody>
      </table>
    </div>
    <div class="note" style="margin-top:10px"><strong>Green = lowest in column · Red = highest.</strong> NTPC's PSU balance sheet enables aggressive Solar pricing at ₹2.45. Avaada's Solar premium vs peers is ~1 paisa on ISTS apples-to-apples — connectivity mix artefact explains the rest.</div>
  </div>
  <div class="grid-2">
    <div class="card">
      <div class="card-title">Avaada Same-Tender Premium vs Floor <span class="ctag">Solar · Paisa · FY24+25</span></div>
      <div class="chart-wrap tall"><canvas id="premiumChart"></canvas></div>
      <div class="note green">Median premium: <strong>0.5 paisa</strong>. In 10/23 Solar tenders, Avaada bid at the exact floor price.</div>
    </div>
    <div class="card">
      <div class="card-title">ISTS Solar — Peer Benchmark <span class="ctag">FY24+25 · ₹/kWh</span></div>
      <div style="margin-top:12px">
        <div class="bar-row"><div class="bar-label">Rays Power</div><div class="bar-track"><div class="bar-fill" style="width:84%;background:var(--green)"></div></div><div class="bar-val" style="color:var(--green)">₹2.50</div></div>
        <div class="bar-row"><div class="bar-label">SAEL</div><div class="bar-track"><div class="bar-fill" style="width:85%;background:var(--green)"></div></div><div class="bar-val" style="color:var(--green)">₹2.53</div></div>
        <div class="bar-row"><div class="bar-label">NTPC</div><div class="bar-track"><div class="bar-fill" style="width:86%;background:var(--c-ntpc)"></div></div><div class="bar-val">₹2.54</div></div>
        <div class="bar-row"><div class="bar-label">Renew</div><div class="bar-track"><div class="bar-fill" style="width:87%;background:var(--c-renew)"></div></div><div class="bar-val">₹2.58</div></div>
        <div class="bar-row"><div class="bar-label" style="color:var(--accent);font-weight:700">Avaada ◀</div><div class="bar-track"><div class="bar-fill" style="width:88%;background:var(--accent)"></div></div><div class="bar-val" style="color:var(--accent);font-weight:700">₹2.59</div></div>
        <div class="bar-row"><div class="bar-label">JSW</div><div class="bar-track"><div class="bar-fill" style="width:89%;background:var(--c-jsw)"></div></div><div class="bar-val">₹2.60</div></div>
        <div class="bar-row"><div class="bar-label">ACME</div><div class="bar-track"><div class="bar-fill" style="width:97%;background:var(--red)"></div></div><div class="bar-val" style="color:var(--red)">₹2.79</div></div>
      </div>
      <div class="note warn"><strong>Avaada ISTS position:</strong> Mid-tier — 1 paisa above market average. Scale-over-margin bidding in contested large tenders.</div>
    </div>
  </div>
  <div class="grid-3">
    <div class="card">
      <div class="card-title">Solar Tariff Trend <span class="ctag">₹/kWh</span></div>
      <div class="chart-wrap"><canvas id="sTariff"></canvas></div>
    </div>
    <div class="card">
      <div class="card-title">FDRE/RTC Tariff Trend <span class="ctag">₹/kWh</span></div>
      <div class="chart-wrap"><canvas id="fTariff"></canvas></div>
    </div>
    <div class="card">
      <div class="card-title">BESS Tariff Trend <span class="ctag">₹/kWh — dramatic compression</span></div>
      <div class="chart-wrap"><canvas id="bTariff"></canvas></div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════ HEATMAP -->
<div class="section" id="heatmap">
  <div class="sec-hdr">
    <div>
      <div class="sec-title">Competitor Heatmap vs REIA / Bidding Authority <span id="hmBadge" class="scope-badge sb-all">ALL DATA</span></div>
      <div class="sec-sub">Won capacity (MW) by developer × procuring authority — reveals strategic offtaker relationships</div>
    </div>
  </div>
  <div class="card" style="margin-bottom:14px">
    <div class="card-title">Developer × Bidding Authority <span class="ctag" id="hmLabel">ALL FY · Won MW</span>
      <span style="margin-left:auto;font-size:9px;color:var(--muted);display:flex;align-items:center;gap:10px">
        <span style="display:flex;align-items:center;gap:4px"><span style="display:inline-block;width:12px;height:12px;background:#d0eaf8;border-radius:3px;border:1px solid #93c5e0"></span>Low</span>
        <span style="display:flex;align-items:center;gap:4px"><span style="display:inline-block;width:12px;height:12px;background:#5baed4;border-radius:3px"></span>Mid</span>
        <span style="display:flex;align-items:center;gap:4px"><span style="display:inline-block;width:12px;height:12px;background:#0077b6;border-radius:3px"></span>High</span>
      </span>
    </div>
    <div class="heatmap-wrap"><table class="heatmap" id="hmTable"></table></div>
    <div class="note" style="margin-top:10px">
      <strong>Avaada:</strong> NHPC anchor (5,950 MW) + NTPC + SJVN; conspicuously absent from SECI large tenders where JSW (5,294 MW) and Renew (4,230 MW) dominate.<br>
      <strong>JSW:</strong> SECI-centric + MSEDCL — two-offtaker concentration.<br>
      <strong>Renew:</strong> Most diversified across SECI/NHPC/NTPC.
    </div>
  </div>
  <div class="grid-2">
    <div class="card">
      <div class="card-title">Developer × REIA Type <span class="ctag" id="reiaHmLabel">ALL FY · Won MW</span></div>
      <div class="heatmap-wrap"><table class="heatmap" id="reiaHmTable"></table></div>
      <div class="note" style="margin-top:8px"><strong>Central REIA</strong> = lower tariffs, larger sizes, ISTS. <strong>State REIA</strong> = higher tariffs, relationship-dependent.</div>
    </div>
    <div class="card">
      <div class="card-title">FY25 Developer × Authority <span class="ctag">FY 2025 Only</span></div>
      <div class="heatmap-wrap"><table class="heatmap" id="hmFY25Table"></table></div>
      <div class="note warn" style="margin-top:8px"><strong>FY25:</strong> Avaada's NHPC dependence intensified (4,120 MW = 45% of total FY25 wins). JSW pivoted to MSEDCL.</div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════ PIPELINE -->
<div class="section" id="pipeline">
  <div class="sec-hdr">
    <div>
      <div class="sec-title">Pipeline & Execution Status</div>
      <div class="sec-sub">PPA · LOA · COD stage tracking · FY26 emerging landscape</div>
    </div>
  </div>
  <div class="grid-2">
    <div class="card">
      <div class="card-title">Avaada Pipeline Stages <span class="ctag">MW by Status</span></div>
      <div class="chart-wrap tall"><canvas id="pipelineChart"></canvas></div>
      <div class="note warn"><strong>8,360 MW at LoA</strong> — PPA not yet signed. LoA→PPA slippage 12–18 months industry-wide.</div>
    </div>
    <div class="card">
      <div class="card-title">FY26 Early Winners <span class="ctag">MW Won · Mar 2026</span></div>
      <div class="chart-wrap"><canvas id="fy26Chart"></canvas></div>
      <div class="note" style="margin-top:10px">FY26 is early-stage with 26,352 MW awarded to date. ACME leads at 1,995 MW; storage-specialist developers (Patel Infra, Greenko, Enerica) are active in the BESS segment. Avaada's FY26 pipeline is yet to materialise — consistent with its FY24–25 pattern of back-loaded closings.</div>
    </div>
  </div>
  <div class="card">
    <div class="card-title">Avaada Key Won Deals — FY24+25</div>
    <div class="scroll-table">
      <table class="data-table"><thead><tr><th>#</th><th>Tender</th><th>Authority</th><th>Category</th><th>Conn.</th><th style="text-align:right">Cap (MW)</th><th style="text-align:right">Tariff (₹)</th><th>FY</th><th>Status</th></tr></thead>
      <tbody id="dealBody"></tbody></table>
    </div>
  </div>
</div>

<script>
// ═══════════════════════════════════════════════ MASTER DATA
const ALL_FYS = ['FY 2021','FY 2022','FY 2023','FY 2024','FY 2025','FY 2026'];

const FY_MARKET = {'FY 2021':18175,'FY 2022':15995,'FY 2023':13783,'FY 2024':45961,'FY 2025':54584,'FY 2026':26352};
const AVAADA_FY = {'FY 2021':320,'FY 2022':250,'FY 2023':325,'FY 2024':6412,'FY 2025':9150,'FY 2026':0};

const TECH_BY_FY = {
  'FY 2021':{'Solar':12980,'Hybrid':1425,'RTC/FDRE':400,'ESS/BESS':0,'Wind':3370},
  'FY 2022':{'Solar':11695,'Hybrid':1700,'RTC/FDRE':2300,'ESS/BESS':0,'Wind':300},
  'FY 2023':{'Solar':3610,'Hybrid':2175,'RTC/FDRE':0,'ESS/BESS':3750,'Wind':3600},
  'FY 2024':{'Solar':29173,'Hybrid':6940,'RTC/FDRE':7558,'ESS/BESS':250,'Wind':2040},
  'FY 2025':{'Solar':15760,'Hybrid':15076,'RTC/FDRE':13688,'ESS/BESS':9600,'Wind':460},
  'FY 2026':{'Solar':500,'Hybrid':0,'RTC/FDRE':8770,'ESS/BESS':15080,'Wind':2002}
};

const TARIFF_BY_TECH = {
  'Solar':    {'FY 2021':2.420,'FY 2022':2.402,'FY 2023':2.657,'FY 2024':2.724,'FY 2025':2.574,'FY 2026':2.447},
  'Hybrid':   {'FY 2021':2.439,'FY 2022':2.423,'FY 2023':2.758,'FY 2024':3.333,'FY 2025':3.441},
  'RTC/FDRE': {'FY 2021':2.900,'FY 2022':3.204,'FY 2024':4.584,'FY 2025':4.154,'FY 2026':4.140},
  'ESS/BESS': {'FY 2023':10.223,'FY 2024':4.487,'FY 2025':2.839,'FY 2026':2.468},
  'Wind':     {'FY 2021':2.749,'FY 2022':3.434,'FY 2023':2.953,'FY 2024':3.490,'FY 2025':3.762,'FY 2026':3.703}
};

const CO_BY_FY = {
  'FY 2021':{'Avaada':320,'JSW':1260,'Renew':1300,'NTPC':1510,'Adani':1500,'Juniper':0,'SAEL':0,'ACME':0,'Mahindra':0,'Tata':1115,'TOTAL':18175},
  'FY 2022':{'Avaada':250,'JSW':99,'Renew':1300,'NTPC':3775,'Adani':270,'Juniper':0,'SAEL':0,'ACME':0,'Mahindra':0,'Tata':630,'TOTAL':15995},
  'FY 2023':{'Avaada':325,'JSW':800,'Renew':300,'NTPC':1040,'Adani':0,'Juniper':195,'SAEL':50,'ACME':0,'Mahindra':0,'Tata':1705,'TOTAL':13783},
  'FY 2024':{'Avaada':6412,'JSW':3180,'Renew':4614,'NTPC':2925,'Adani':0,'Juniper':2150,'SAEL':2300,'ACME':1080,'Mahindra':1300,'Tata':750,'TOTAL':45961},
  'FY 2025':{'Avaada':9150,'JSW':6955,'Renew':3900,'NTPC':2200,'Adani':3895,'Juniper':2450,'SAEL':1430,'ACME':2150,'Mahindra':1436,'Tata':288,'TOTAL':54584},
  'FY 2026':{'Avaada':0,'JSW':0,'Renew':0,'NTPC':80,'Adani':0,'Juniper':120,'SAEL':450,'ACME':1995,'Mahindra':0,'Tata':80,'TOTAL':26352}
};

const AUTH_BY_FY = {
  'FY 2021':{'SECI':8040,'NHPC':2000,'NTPC':1360,'SJVN':0,'GUVNL':1800,'MSEDCL':250,'MSAPL':0,'RUMSL':0,'IREDA':0,'RUVNL':0},
  'FY 2022':{'SECI':6485,'NHPC':0,'NTPC':0,'SJVN':0,'GUVNL':500,'MSEDCL':1300,'MSAPL':0,'RUMSL':1500,'IREDA':5710,'RUVNL':0},
  'FY 2023':{'SECI':3970,'NHPC':0,'NTPC':3000,'SJVN':0,'GUVNL':3410,'MSEDCL':1855,'MSAPL':0,'RUMSL':1293,'IREDA':0,'RUVNL':0},
  'FY 2024':{'SECI':10280,'NHPC':5360,'NTPC':7164,'SJVN':4834,'GUVNL':5345,'MSEDCL':500,'MSAPL':7248,'RUMSL':0,'IREDA':0,'RUVNL':1000},
  'FY 2025':{'SECI':8545,'NHPC':12950,'NTPC':10060,'SJVN':7018,'GUVNL':3240,'MSEDCL':5826,'MSAPL':0,'RUMSL':170,'IREDA':0,'RUVNL':0},
  'FY 2026':{'SECI':5427,'NHPC':1825,'NTPC':0,'SJVN':3775,'GUVNL':8880,'MSEDCL':0,'MSAPL':0,'RUMSL':600,'IREDA':0,'RUVNL':500}
};

const AVAADA_TECH_FY = {
  'FY 2021':{'Solar':320,'Hybrid':0,'RTC/FDRE':0,'Wind':0},
  'FY 2022':{'Solar':250,'Hybrid':0,'RTC/FDRE':0,'Wind':0},
  'FY 2023':{'Solar':325,'Hybrid':0,'RTC/FDRE':0,'Wind':0},
  'FY 2024':{'Solar':5322,'Hybrid':1040,'RTC/FDRE':0,'Wind':50},
  'FY 2025':{'Solar':2550,'Hybrid':2960,'RTC/FDRE':3640,'Wind':0},
  'FY 2026':{'Solar':0,'Hybrid':0,'RTC/FDRE':0,'Wind':0}
};

const CO_TECH_TARIFF = {
  all:{
    Avaada: {Solar:{t:2.681,c:8767},Hybrid:{t:3.52,c:4000},'RTC/FDRE':{t:4.389,c:3640}},
    JSW:    {Solar:{t:2.592,c:2800},Hybrid:{t:3.515,c:1700},'RTC/FDRE':{t:4.167,c:1009}},
    Renew:  {Solar:{t:2.542,c:6600},Hybrid:{t:3.263,c:900},'RTC/FDRE':{t:4.02,c:3614}},
    NTPC:   {Solar:{t:2.449,c:8360},Hybrid:{t:2.614,c:1200},'RTC/FDRE':{t:3.741,c:1500}},
    Adani:  {Solar:{t:2.49,c:1350},Hybrid:{t:3.532,c:2025},'RTC/FDRE':{t:3.1,c:170}},
    Juniper:{Solar:{t:2.9,c:75},Hybrid:{t:3.311,c:2630},'RTC/FDRE':{t:4.452,c:1750}}
  },
  fy25:{
    Avaada: {Solar:{t:2.598,c:2550},Hybrid:{t:3.53,c:2960},'RTC/FDRE':{t:4.389,c:3640}},
    JSW:    {Solar:{t:2.69,c:400},Hybrid:{t:3.515,c:1700},'RTC/FDRE':{t:3.912,c:730}},
    Renew:  {Solar:{t:2.58,c:2500},Hybrid:{t:3.44,c:300},'RTC/FDRE':{t:3.726,c:1100}},
    NTPC:   {Solar:{t:2.544,c:1400},Hybrid:null,'RTC/FDRE':{t:3.359,c:800}},
    Adani:  {Solar:{t:2.629,c:450},Hybrid:{t:3.532,c:2025},'RTC/FDRE':{t:3.1,c:170}},
    Juniper:{Solar:null,Hybrid:{t:3.369,c:1200},'RTC/FDRE':{t:4.39,c:1150}}
  },
  fy26:{
    Avaada: {Solar:null,Hybrid:null,'RTC/FDRE':null},
    JSW:    {Solar:null,Hybrid:null,'RTC/FDRE':null},
    Renew:  {Solar:null,Hybrid:null,'RTC/FDRE':null},
    NTPC:   {Solar:null,Hybrid:null,'RTC/FDRE':null},
    Adani:  {Solar:null,Hybrid:null,'RTC/FDRE':null},
    Juniper:{Solar:null,Hybrid:null,'RTC/FDRE':{t:4.76,c:70}}
  }
};

const HM_AUTH_ALL = {
  Avaada: {SECI:1040,NHPC:5950,NTPC:2290,SJVN:2180,GUVNL:980,MSEDCL:2075,MSAPL:1132,RUMSL:200,REMCL:0,RUVNL:200},
  JSW:    {SECI:5294,NHPC:0,NTPC:1400,SJVN:1000,GUVNL:300,MSEDCL:2300,MSAPL:0,RUMSL:0,REMCL:0,RUVNL:0},
  Renew:  {SECI:4230,NHPC:1750,NTPC:2450,SJVN:684,GUVNL:600,MSEDCL:200,MSAPL:0,RUMSL:300,REMCL:200,RUVNL:0},
  NTPC:   {SECI:3520,NHPC:380,NTPC:0,SJVN:900,GUVNL:575,MSEDCL:300,MSAPL:0,RUMSL:415,REMCL:700,RUVNL:0},
  Adani:  {SECI:800,NHPC:1370,NTPC:825,SJVN:0,GUVNL:0,MSEDCL:120,MSAPL:0,RUMSL:0,REMCL:0,RUVNL:0},
  Juniper:{SECI:450,NHPC:1100,NTPC:1030,SJVN:1200,GUVNL:640,MSEDCL:225,MSAPL:0,RUMSL:0,REMCL:0,RUVNL:0},
  ACME:   {SECI:950,NHPC:1455,NTPC:550,SJVN:1450,GUVNL:640,MSEDCL:0,MSAPL:0,RUMSL:0,REMCL:130,RUVNL:0},
  SAEL:   {SECI:1450,NHPC:300,NTPC:300,SJVN:450,GUVNL:1380,MSEDCL:150,MSAPL:0,RUMSL:0,REMCL:0,RUVNL:200}
};
const HM_AUTH_FY25 = {
  Avaada: {SECI:240,NHPC:4120,NTPC:1290,SJVN:1650,GUVNL:500,MSEDCL:1350},
  JSW:    {SECI:1655,NHPC:0,NTPC:700,SJVN:300,GUVNL:0,MSEDCL:2300},
  Renew:  {SECI:250,NHPC:1500,NTPC:1350,SJVN:500,GUVNL:0,MSEDCL:0},
  NTPC:   {SECI:700,NHPC:300,NTPC:0,SJVN:200,GUVNL:0,MSEDCL:0},
  Adani:  {SECI:50,NHPC:1370,NTPC:825,SJVN:0,GUVNL:0,MSEDCL:0},
  Juniper:{SECI:300,NHPC:750,NTPC:300,SJVN:850,GUVNL:100,MSEDCL:150}
};
const REIA_ALL = {
  Avaada: {'Central REIA':10990,State:5467},
  JSW:    {'Central REIA':7394,State:4900},
  Renew:  {'Central REIA':9114,State:2300},
  NTPC:   {'Central REIA':4720,State:6810},
  Adani:  {'Central REIA':2995,State:2670},
  Juniper:{'Central REIA':3630,State:1285},
  ACME:   {'Central REIA':3230,State:690},
  SAEL:   {'Central REIA':2050,State:1730}
};

// ═══════════════════════════════════════════════ STATE
let currentScope = 'all';
let activeFYs = new Set(ALL_FYS);
const charts = {};

// ═══════════════════════════════════════════════ CHART DEFAULTS
const FONT = "'Inter', sans-serif";
Chart.defaults.font.family = FONT;
Chart.defaults.color = '#7b82a0';
Chart.defaults.borderColor = '#dde1ee';

const GRID = { color: '#eaecf4', tickLength: 0 };
const TICK = { color: '#7b82a0', font: { size: 10, family: FONT } };
const NO_LEG = { display: false };

// Colour palette — visually distinct
const C = {
  solar:   '#e07b00', hybrid:  '#6930c3', fdre:    '#0077b6',
  bess:    '#d62828', wind:    '#2dc653', fspv:    '#888',
  avaada:  '#0077b6', jsw:     '#e07b00', renew:   '#6930c3',
  ntpc:    '#2dc653', adani:   '#d62828', juniper: '#f77f00',
  sael:    '#00b4d8', acme:    '#9b2226',
  ists:    '#0077b6', stu:     '#e07b00'
};

function mkChart(id, cfg) {
  if (charts[id]) charts[id].destroy();
  charts[id] = new Chart(document.getElementById(id), cfg);
  return charts[id];
}

// ═══════════════════════════════════════════════ SCOPE / FILTER
function getActiveFYs() {
  return ALL_FYS.filter(f => activeFYs.has(f));
}

function setScope(scope, el) {
  currentScope = scope;
  document.querySelectorAll('.scope-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  if (scope === 'fy25') {
    activeFYs = new Set(['FY 2025']);
  } else if (scope === 'fy26') {
    activeFYs = new Set(['FY 2026']);
  } else {
    activeFYs = new Set(ALL_FYS);
  }
  syncPills();
  rebuildAll();
}

function toggleFY(el) {
  currentScope = 'all';
  document.querySelectorAll('.scope-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.s-all').classList.add('active');
  const fy = el.dataset.fy;
  if (activeFYs.has(fy)) {
    if (activeFYs.size > 1) { activeFYs.delete(fy); el.classList.remove('active'); }
  } else {
    activeFYs.add(fy); el.classList.add('active');
  }
  rebuildAll();
}

function syncPills() {
  document.querySelectorAll('.fy-pill').forEach(p => {
    p.classList.toggle('active', activeFYs.has(p.dataset.fy));
  });
}

function scopeText() {
  const fys = getActiveFYs();
  if (fys.length === 6) return 'ALL FY';
  if (fys.length === 1) return fys[0];
  return fys.map(f => f.replace('FY ', 'FY')).join(', ');
}

function badgeCls() {
  if (currentScope === 'fy25') return 'sb-fy25';
  if (currentScope === 'fy26') return 'sb-fy26';
  return 'sb-all';
}
function badgeTxt() {
  if (currentScope === 'fy25') return 'FY 2025';
  if (currentScope === 'fy26') return 'FY 2026';
  return 'ALL DATA';
}

// ═══════════════════════════════════════════════ AGGREGATE HELPERS
function sumFY(dataObj) {
  return getActiveFYs().reduce((s, f) => s + (dataObj[f] || 0), 0);
}
function sumFYTech(tech) {
  return getActiveFYs().reduce((s, f) => s + ((TECH_BY_FY[f] || {})[tech] || 0), 0);
}
function authSum(auth) {
  return getActiveFYs().reduce((s, f) => s + ((AUTH_BY_FY[f] || {})[auth] || 0), 0);
}
function coSum(co) {
  return getActiveFYs().reduce((s, f) => s + ((CO_BY_FY[f] || {})[co] || 0), 0);
}

// Weighted tariff for a tech across selected FYs
function weightedTariff(tech) {
  let sumWC = 0, sumT = 0;
  getActiveFYs().forEach(f => {
    const t = (TARIFF_BY_TECH[tech] || {})[f];
    const c = tech === 'ESS/BESS'
      ? ((TECH_BY_FY[f] || {})['ESS/BESS'] || 0)
      : ((TECH_BY_FY[f] || {})[tech] || 0);
    if (t && c > 0) { sumT += t * c; sumWC += c; }
  });
  return sumWC > 0 ? sumT / sumWC : null;
}

// ═══════════════════════════════════════════════ REBUILD ALL
function rebuildAll() {
  updateBadges();
  buildOvKPIs();
  buildFYMarketChart();
  buildAuthBars();
  buildTopCosChart();
  buildTechStackChart();
  buildTariffTechChart();
  buildTechTariffTable();
  buildHeatmaps();
}

function updateBadges() {
  const bc = badgeCls(), bt = badgeTxt(), sl = scopeText();
  ['ovBadge','techBadge','avBadge','peerBadge','tariffBadge','hmBadge'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.className = 'scope-badge ' + bc; el.textContent = bt; }
  });
  ['ovChartLabel','authLabel','topCoLabel','techStackLabel','tariffTechLabel','ttScope','hmLabel','reiaHmLabel'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = sl + ' · MW';
  });
}

// ═══════════════════════════════════════════════ OV KPIs
function buildOvKPIs() {
  const fys = getActiveFYs();
  const total = fys.reduce((s, f) => s + (FY_MARKET[f] || 0), 0);
  const av = fys.reduce((s, f) => s + (AVAADA_FY[f] || 0), 0);
  const share = total > 0 ? ((av / total) * 100).toFixed(1) + '%' : '—';
  const peakFY = fys.sort((a, b) => (FY_MARKET[b] || 0) - (FY_MARKET[a] || 0))[0];
  document.getElementById('kv-total').textContent = total.toLocaleString();
  document.getElementById('kv-peak').textContent = peakFY ? peakFY.replace('FY ', '') + ': ' + Math.round((FY_MARKET[peakFY] || 0) / 1000) + 'k' : '—';
  document.getElementById('kv-av').textContent = av.toLocaleString();
  document.getElementById('kv-share').textContent = share;
}

// ═══════════════════════════════════════════════ FY MARKET CHART
function buildFYMarketChart() {
  const fys = getActiveFYs();
  mkChart('fyMarketChart', {
    type: 'bar',
    data: {
      labels: fys.map(f => f.replace('FY ', '')),
      datasets: [
        { label: 'Total Market', data: fys.map(f => FY_MARKET[f] || 0), backgroundColor: '#bdd7ee', borderColor: '#0077b6', borderWidth: 1.5, borderRadius: 3, order: 2 },
        { label: 'Avaada Won', data: fys.map(f => AVAADA_FY[f] || 0), backgroundColor: '#0077b6', borderColor: '#005a8a', borderWidth: 1, borderRadius: 3, order: 1 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { display: true, labels: { color: '#7b82a0', font: { size: 10, family: FONT }, boxWidth: 10 } } },
      scales: { x: { grid: GRID, ticks: TICK }, y: { grid: GRID, ticks: { ...TICK, callback: v => (v / 1000) + 'k' } } }
    }
  });
}

// ═══════════════════════════════════════════════ AUTH BARS
function buildAuthBars() {
  const auths = ['SECI', 'GUVNL', 'NHPC', 'NTPC', 'SJVN', 'MSEDCL', 'MSAPL', 'IREDA'];
  const colors = [C.avaada, C.jsw, C.renew, C.ntpc, C.adani, C.juniper, C.sael, C.acme];
  const vals = auths.map(a => authSum(a));
  const maxV = Math.max(...vals, 1);
  document.getElementById('authBars').innerHTML = auths.map((a, i) => `
    <div class="bar-row">
      <div class="bar-label">${a}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(vals[i]/maxV*100).toFixed(1)}%;background:${colors[i]}"></div></div>
      <div class="bar-val">${vals[i].toLocaleString()}</div>
    </div>`).join('');
}

// ═══════════════════════════════════════════════ TOP COS
function buildTopCosChart() {
  const cos = ['Avaada','JSW','Renew','NTPC','Adani','Juniper','SAEL','ACME','Mahindra','Tata'];
  const cosColors = [C.avaada, C.jsw, C.renew, C.ntpc, C.adani, C.juniper, C.sael, C.acme, '#888', '#aaa'];
  const vals = cos.map(co => coSum(co));
  const sorted = cos.map((co, i) => ({ co, v: vals[i], col: cosColors[i] })).sort((a, b) => b.v - a.v);
  mkChart('topCosChart', {
    type: 'bar',
    data: {
      labels: sorted.map(d => d.co),
      datasets: [{ data: sorted.map(d => d.v), backgroundColor: sorted.map(d => d.col + 'bb'), borderColor: sorted.map(d => d.col), borderWidth: 1.5, borderRadius: 3 }]
    },
    options: {
      indexAxis: 'y', responsive: true, maintainAspectRatio: true,
      plugins: { legend: NO_LEG, tooltip: { callbacks: { label: c => ` ${c.raw.toLocaleString()} MW` } } },
      scales: { x: { grid: GRID, ticks: { ...TICK, callback: v => (v / 1000) + 'k' } }, y: { grid: { display: false }, ticks: TICK } }
    }
  });
}

// ═══════════════════════════════════════════════ TECH STACK
function buildTechStackChart() {
  const fys = getActiveFYs();
  const techs = [
    { key: 'Solar', color: C.solar },
    { key: 'Hybrid', color: C.hybrid },
    { key: 'RTC/FDRE', color: C.fdre },
    { key: 'ESS/BESS', color: C.bess },
    { key: 'Wind', color: C.wind }
  ];
  mkChart('techStackChart', {
    type: 'bar',
    data: {
      labels: fys.map(f => f.replace('FY ', '')),
      datasets: techs.map(t => ({
        label: t.key,
        data: fys.map(f => (TECH_BY_FY[f] || {})[t.key] || 0),
        backgroundColor: t.color + 'cc',
        borderColor: t.color,
        borderWidth: 1, borderRadius: 1
      }))
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { display: true, labels: { color: '#7b82a0', font: { size: 10, family: FONT }, boxWidth: 10 } } },
      scales: {
        x: { stacked: true, grid: GRID, ticks: TICK },
        y: { stacked: true, grid: GRID, ticks: { ...TICK, callback: v => (v / 1000) + 'k' } }
      }
    }
  });
}

// ═══════════════════════════════════════════════ TARIFF TECH CHART (reactive with BESS)
function buildTariffTechChart() {
  const fys = getActiveFYs();
  const techs = [
    { key: 'Solar',    color: C.solar,  label: 'Solar' },
    { key: 'Hybrid',   color: C.hybrid, label: 'Hybrid' },
    { key: 'RTC/FDRE', color: C.fdre,   label: 'FDRE/RTC' },
    { key: 'ESS/BESS', color: C.bess,   label: 'BESS/ESS' },
    { key: 'Wind',     color: C.wind,   label: 'Wind' }
  ];
  mkChart('tariffTechChart', {
    type: 'line',
    data: {
      labels: fys.map(f => f.replace('FY ', '')),
      datasets: techs.map(t => ({
        label: t.label,
        data: fys.map(f => (TARIFF_BY_TECH[t.key] || {})[f] || null),
        borderColor: t.color,
        backgroundColor: t.color + '18',
        tension: 0.35,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2.5,
        spanGaps: true
      }))
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { display: true, labels: { color: '#7b82a0', font: { size: 10, family: FONT }, boxWidth: 10 } } },
      scales: {
        x: { grid: GRID, ticks: TICK },
        y: { grid: GRID, ticks: { ...TICK, callback: v => '₹' + v.toFixed(2) } }
      }
    }
  });
}

// ═══════════════════════════════════════════════ TECH TARIFF TABLE
function buildTechTariffTable() {
  const scope = currentScope === 'fy25' ? 'fy25' : currentScope === 'fy26' ? 'fy26' : 'all';
  const data = CO_TECH_TARIFF[scope];
  const companies = ['Avaada','JSW','Renew','NTPC','Adani','Juniper'];
  const cats = ['Solar','Hybrid','RTC/FDRE'];
  const catColors = { Solar: C.solar, Hybrid: C.hybrid, 'RTC/FDRE': C.fdre };

  const colStats = {};
  cats.forEach(cat => {
    const vals = companies.map(co => data[co] && data[co][cat] ? data[co][cat].t : null).filter(v => v !== null);
    colStats[cat] = { min: Math.min(...vals) || null, max: Math.max(...vals) || null };
  });

  function overall(co) {
    const d = data[co]; if (!d) return null;
    let sw = 0, st = 0;
    cats.forEach(c => { if (d[c]) { st += d[c].t * d[c].c; sw += d[c].c; } });
    return sw > 0 ? (st / sw).toFixed(3) : null;
  }
  const ov = companies.map(co => parseFloat(overall(co))).filter(v => !isNaN(v));
  const oMin = Math.min(...ov), oMax = Math.max(...ov);

  document.getElementById('ttBody').innerHTML = companies.map(co => {
    const o = overall(co);
    const oFloat = parseFloat(o);
    const oCol = isNaN(oFloat) ? '#7b82a0' : oFloat === oMin ? C.wind : oFloat === oMax ? C.bess : C.text;
    return `<tr class="${co === 'Avaada' ? 'avaada-row' : ''}">
      <td>${co}</td>
      ${cats.map(cat => {
        const cell = data[co] && data[co][cat];
        if (!cell) return `<td><span class="t-na">—</span></td>`;
        const { t, c } = cell;
        const isMin = t === colStats[cat].min, isMax = t === colStats[cat].max;
        const pct = colStats[cat].max > colStats[cat].min
          ? (t - colStats[cat].min) / (colStats[cat].max - colStats[cat].min) : 0.5;
        const barCol = `hsl(${Math.round((1 - pct) * 120)},60%,40%)`;
        const tag = isMin ? '<span class="best-tag">LOW</span>' : isMax ? '<span class="worst-tag">HIGH</span>' : '';
        return `<td><div class="tariff-cell">
          <span class="t-val" style="color:${catColors[cat]}">₹${t}</span>
          <span class="t-cap">${(c / 1000).toFixed(1)}k MW</span>
          <div class="t-bar"><div class="t-bar-fill" style="width:${Math.round(pct * 100)}%;background:${barCol}"></div></div>
          ${tag}
        </div></td>`;
      }).join('')}
      <td><span style="color:${oCol};font-weight:700">${o ? '₹' + o : '—'}</span></td>
    </tr>`;
  }).join('');
}

// ═══════════════════════════════════════════════ HEATMAPS
function hmColor(val, max) {
  if (!val || val === 0) return null;
  const p = val / max;
  if (p < 0.12) return { bg: '#d0eaf8', fg: '#2a6e97' };
  if (p < 0.30) return { bg: '#7ec8e3', fg: '#ffffff' };
  if (p < 0.55) return { bg: '#2196c4', fg: '#ffffff' };
  if (p < 0.78) return { bg: '#0077b6', fg: '#ffffff' };
  return { bg: '#004e7a', fg: '#ffffff' };
}

function renderHM(tableId, hmData, keys) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const cos = Object.keys(hmData);
  const allV = cos.flatMap(co => keys.map(k => hmData[co][k] || 0));
  const maxV = Math.max(...allV, 1);
  let html = `<thead><tr><th class="row-h">Developer</th>${keys.map(k => `<th>${k}</th>`).join('')}<th>Total</th></tr></thead><tbody>`;
  cos.forEach(co => {
    const isAv = co === 'Avaada';
    const rowTotal = keys.reduce((s, k) => s + (hmData[co][k] || 0), 0);
    html += `<tr class="${isAv ? 'avaada-row' : ''}"><td class="row-label">${co}</td>`;
    keys.forEach(k => {
      const v = hmData[co][k] || 0;
      if (v === 0) { html += `<td><span class="hm-0">—</span></td>`; return; }
      const c = hmColor(v, maxV);
      html += `<td><span class="hm-cell" style="background:${c.bg};color:${c.fg}">${v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v}</span></td>`;
    });
    html += `<td><strong>${(rowTotal / 1000).toFixed(1)}k</strong></td></tr>`;
  });
  table.innerHTML = html + '</tbody>';
}

function renderREIAHM() {
  const table = document.getElementById('reiaHmTable');
  if (!table) return;
  const cos = Object.keys(REIA_ALL), reias = ['Central REIA', 'State'];
  const allV = cos.flatMap(co => reias.map(r => REIA_ALL[co][r] || 0));
  const maxV = Math.max(...allV, 1);
  let html = `<thead><tr><th class="row-h">Developer</th>${reias.map(r => `<th>${r}</th>`).join('')}<th>% Central</th></tr></thead><tbody>`;
  cos.forEach(co => {
    const c = REIA_ALL[co]['Central REIA'] || 0, s = REIA_ALL[co]['State'] || 0;
    const pct = (c + s) > 0 ? Math.round(c / (c + s) * 100) + '%' : '—';
    html += `<tr class="${co === 'Avaada' ? 'avaada-row' : ''}"><td class="row-label">${co}</td>`;
    [c, s].forEach(v => {
      if (v === 0) { html += `<td><span class="hm-0">—</span></td>`; return; }
      const col = hmColor(v, maxV);
      html += `<td><span class="hm-cell" style="background:${col.bg};color:${col.fg}">${(v / 1000).toFixed(1)}k</span></td>`;
    });
    html += `<td><strong>${pct}</strong></td></tr>`;
  });
  table.innerHTML = html + '</tbody>';
}

function buildHeatmaps() {
  const auths = ['SECI','NHPC','NTPC','SJVN','GUVNL','MSEDCL','MSAPL','RUMSL','REMCL','RUVNL'];
  const mainData = currentScope === 'fy25' ? HM_AUTH_FY25 : HM_AUTH_ALL;
  const mainKeys = currentScope === 'fy25' ? ['SECI','NHPC','NTPC','SJVN','GUVNL','MSEDCL'] : auths;
  renderHM('hmTable', mainData, mainKeys);
  renderHM('hmFY25Table', HM_AUTH_FY25, ['SECI','NHPC','NTPC','SJVN','GUVNL','MSEDCL']);
  renderREIAHM();
}

// ═══════════════════════════════════════════════ STATIC CHARTS (built once)
function buildStaticCharts() {
  // IPP Portfolio
  const ipp = [
    {c:'Adani',op:14220,uc:15700},{c:'Avaada',op:3730,uc:20450},{c:'Renew',op:10400,uc:11400},
    {c:'Greenko',op:7500,uc:10960},{c:'JSW',op:5322,uc:11361},{c:'NTPC',op:4271,uc:10086},
    {c:'Tata',op:5000,uc:6400},{c:'Acme',op:3740,uc:8922},{c:'SJVN',op:405,uc:8490}
  ];
  mkChart('ippPortChart', {
    type: 'bar',
    data: {
      labels: ipp.map(d => d.c),
      datasets: [
        { label: 'Operational', data: ipp.map(d => d.op), backgroundColor: '#bdd7ee', borderColor: C.avaada, borderWidth: 1.5, borderRadius: 2 },
        { label: 'UC + Secured', data: ipp.map(d => d.uc), backgroundColor: '#f6cba0', borderColor: C.jsw, borderWidth: 1.5, borderRadius: 2 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { display: true, labels: { color: '#7b82a0', font: { size: 10, family: FONT }, boxWidth: 10 } } },
      scales: { x: { grid: GRID, ticks: TICK }, y: { grid: GRID, ticks: { ...TICK, callback: v => (v / 1000) + 'k' } } }
    }
  });

  // Pie FY25
  mkChart('techPie25', {
    type: 'doughnut',
    data: { labels: ['Solar','Hybrid','FDRE/RTC','BESS/ESS','Wind'], datasets: [{ data: [15760,15076,13688,9600,460], backgroundColor: [C.solar+'cc',C.hybrid+'cc',C.fdre+'cc',C.bess+'cc',C.wind+'cc'], borderColor: [C.solar,C.hybrid,C.fdre,C.bess,C.wind], borderWidth: 2 }] },
    options: { responsive: true, cutout: '60%', plugins: { legend: { display: true, position: 'right', labels: { color: '#7b82a0', font: { size: 10, family: FONT }, boxWidth: 10 } } } }
  });

  // Pie FY26
  mkChart('techPie26', {
    type: 'doughnut',
    data: { labels: ['BESS/ESS','RTC/FDRE','Wind','Solar'], datasets: [{ data: [15080,8770,2002,500], backgroundColor: [C.bess+'cc',C.fdre+'cc',C.wind+'cc',C.solar+'cc'], borderColor: [C.bess,C.fdre,C.wind,C.solar], borderWidth: 2 }] },
    options: { responsive: true, cutout: '60%', plugins: { legend: { display: true, position: 'right', labels: { color: '#7b82a0', font: { size: 10, family: FONT }, boxWidth: 10 } } } }
  });

  // Avaada tech pie
  mkChart('avaadaTechPie', {
    type: 'doughnut',
    data: { labels: ['Solar','Hybrid','FDRE/RTC','Wind'], datasets: [{ data: [8767,4000,3640,50], backgroundColor: [C.solar+'cc',C.hybrid+'cc',C.fdre+'cc',C.wind+'cc'], borderColor: [C.solar,C.hybrid,C.fdre,C.wind], borderWidth: 2 }] },
    options: { responsive: true, cutout: '60%', plugins: { legend: { display: true, position: 'right', labels: { color: '#7b82a0', font: { size: 10, family: FONT }, boxWidth: 10 } } } }
  });

  // Connectivity year
  mkChart('connYearChart', {
    type: 'bar',
    data: {
      labels: ['FY21','FY22','FY23','FY24','FY25'],
      datasets: [
        { label: 'ISTS', data: [12000,10500,6800,32000,42000], backgroundColor: C.ists+'99', borderColor: C.ists, borderWidth: 1.5, borderRadius: 2 },
        { label: 'STU', data: [5500,4800,5500,12000,11000], backgroundColor: C.stu+'99', borderColor: C.stu, borderWidth: 1.5, borderRadius: 2 },
        { label: 'CTU/Khavda', data: [600,700,1500,2000,1600], backgroundColor: C.hybrid+'99', borderColor: C.hybrid, borderWidth: 1.5, borderRadius: 2 }
      ]
    },
    options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: true, labels: { color: '#7b82a0', font: { size: 10, family: FONT }, boxWidth: 10 } } }, scales: { x: { stacked: true, grid: GRID, ticks: TICK }, y: { stacked: true, grid: GRID, ticks: { ...TICK, callback: v => (v / 1000) + 'k' } } } }
  });

  // Conn pie
  mkChart('connPieChart', {
    type: 'doughnut',
    data: { labels: ['ISTS','STU','CTU+Khavda','ISTS/STU'], datasets: [{ data: [104181,47452,10875,7750], backgroundColor: [C.ists+'bb',C.stu+'bb',C.hybrid+'bb','#888bb'], borderColor: [C.ists,C.stu,C.hybrid,'#888'], borderWidth: 2 }] },
    options: { responsive: true, cutout: '58%', plugins: { legend: { display: true, position: 'right', labels: { color: '#7b82a0', font: { size: 10, family: FONT }, boxWidth: 10 } } } }
  });

  // ISTS vs STU scatter
  mkChart('iststuChart', {
    type: 'scatter',
    data: {
      datasets: [
        { label: 'ISTS Solar', data: [{x:1,y:2.52},{x:2,y:2.53},{x:3,y:2.56},{x:4,y:2.57},{x:5,y:2.60},{x:6,y:2.65},{x:7,y:2.69}], backgroundColor: C.ists + 'cc', borderColor: C.ists, pointRadius: 6 },
        { label: 'STU Solar',  data: [{x:1,y:2.60},{x:2,y:2.64},{x:3,y:2.67},{x:4,y:2.79},{x:5,y:2.94},{x:6,y:3.10}], backgroundColor: C.stu + 'cc', borderColor: C.stu, pointRadius: 6 }
      ]
    },
    options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: true, labels: { color: '#7b82a0', font: { size: 10, family: FONT }, boxWidth: 10 } } }, scales: { x: { display: false, min: 0, max: 8 }, y: { grid: GRID, ticks: { ...TICK, callback: v => '₹' + v } } } }
  });

  // Avaada wins by tech
  mkChart('avWinChart', {
    type: 'bar',
    data: {
      labels: ['FY21','FY22','FY23','FY24','FY25'],
      datasets: [
        { label: 'Solar',    data: [320,250,325,5322,2550], backgroundColor: C.solar+'bb', borderColor: C.solar, borderWidth: 1.5, borderRadius: 2 },
        { label: 'Hybrid',   data: [0,0,0,1040,2960], backgroundColor: C.hybrid+'bb', borderColor: C.hybrid, borderWidth: 1.5, borderRadius: 2 },
        { label: 'FDRE/RTC', data: [0,0,0,0,3640], backgroundColor: C.fdre+'bb', borderColor: C.fdre, borderWidth: 1.5, borderRadius: 2 },
        { label: 'Wind',     data: [0,0,0,50,0], backgroundColor: C.wind+'bb', borderColor: C.wind, borderWidth: 1.5, borderRadius: 2 }
      ]
    },
    options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: true, labels: { color: '#7b82a0', font: { size: 10, family: FONT }, boxWidth: 10 } } }, scales: { x: { stacked: true, grid: GRID, ticks: TICK }, y: { stacked: true, grid: GRID, ticks: { ...TICK, callback: v => (v / 1000) + 'k' } } } }
  });

  // Status doughnut
  mkChart('statusChart', {
    type: 'doughnut',
    data: { labels: ['PPA Signed','LoA Issued','COD Achieved','Cancelled'], datasets: [{ data: [7482,8360,280,310], backgroundColor: [C.wind+'bb',C.jsw+'bb',C.ists+'bb',C.bess+'bb'], borderColor: [C.wind,C.jsw,C.ists,C.bess], borderWidth: 2 }] },
    options: { responsive: true, cutout: '60%', plugins: { legend: { display: true, position: 'right', labels: { color: '#7b82a0', font: { size: 10, family: FONT }, boxWidth: 10 } } } }
  });

  // FDRE bar
  mkChart('fdreChart', {
    type: 'bar',
    data: {
      labels: ['Avaada','ACME','Juniper','Renew','NTPC','Hero','JSW'],
      datasets: [{ data: [3640,2180,1750,2814,1500,1440,910], backgroundColor: [C.avaada,C.acme,C.juniper,C.renew,C.ntpc,'#9b6e00',C.jsw].map(c=>c+'cc'), borderColor: [C.avaada,C.acme,C.juniper,C.renew,C.ntpc,'#9b6e00',C.jsw], borderWidth: 1.5, borderRadius: 3 }]
    },
    options: { indexAxis: 'y', responsive: true, maintainAspectRatio: true, plugins: { legend: NO_LEG }, scales: { x: { grid: GRID, ticks: TICK }, y: { grid: { display: false }, ticks: TICK } } }
  });

  // Market share doughnut
  mkChart('mktShareChart', {
    type: 'doughnut',
    data: {
      labels: ['Avaada','JSW','Renew','NTPC','Juniper','Adani','SAEL','ACME','Mahindra','Others'],
      datasets: [{ data: [15562,10135,8514,5125,4600,3895,3730,3230,2736,9006], backgroundColor: [C.avaada,C.jsw,C.renew,C.ntpc,C.juniper,C.adani,C.sael,C.acme,'#888','#ccc'].map(c=>c+'cc'), borderColor: [C.avaada,C.jsw,C.renew,C.ntpc,C.juniper,C.adani,C.sael,C.acme,'#888','#ccc'], borderWidth: 1.5 }]
    },
    options: { responsive: true, cutout: '52%', plugins: { legend: { display: true, position: 'right', labels: { color: '#7b82a0', font: { size: 9, family: FONT }, boxWidth: 9, padding: 4 } } } }
  });

  // Premium
  const prem = [
    {t:'MSKVY-MSE-01',p:11.0},{t:'NTPC BOO-9',p:5.0},{t:'NHPC T9',p:4.0},
    {t:'GUVNL Ph.19',p:2.0},{t:'NTPC BOO-16',p:1.0},{t:'NHPC Solar-2',p:1.0},
    {t:'NTPC BOO-14',p:1.0},{t:'ISTS-XI',p:1.0},{t:'NHPC Solar-3',p:0.5},
    {t:'GUVNL Ph-24',p:0.5},{t:'SECI-XII',p:0.0},{t:'SECI-XIV',p:0.0},
    {t:'MSEDCL Ph.10',p:0.0},{t:'MSKVY-Pune',p:0.0}
  ];
  mkChart('premiumChart', {
    type: 'bar',
    data: {
      labels: prem.map(d => d.t),
      datasets: [{ label: 'Premium (paisa)', data: prem.map(d => d.p), backgroundColor: prem.map(d => d.p === 0 ? C.wind + '99' : d.p <= 1 ? '#f5a623cc' : d.p <= 5 ? C.jsw + 'cc' : C.bess + 'cc'), borderColor: prem.map(d => d.p === 0 ? C.wind : d.p <= 1 ? '#f5a623' : d.p <= 5 ? C.jsw : C.bess), borderWidth: 1.5, borderRadius: 3 }]
    },
    options: { indexAxis: 'y', responsive: true, maintainAspectRatio: true, plugins: { legend: NO_LEG }, scales: { x: { grid: GRID, ticks: { ...TICK, callback: v => v + 'p' }, max: 14 }, y: { grid: { display: false }, ticks: { ...TICK, font: { size: 9 } } } } }
  });

  // Mini tariff lines
  const mkLine = (id, data, color, label) => mkChart(id, {
    type: 'line',
    data: { labels: Object.keys(data), datasets: [{ label, data: Object.values(data), borderColor: color, backgroundColor: color + '18', tension: 0.35, pointRadius: 4, borderWidth: 2.5 }] },
    options: { responsive: true, maintainAspectRatio: true, plugins: { legend: NO_LEG }, scales: { x: { grid: GRID, ticks: { ...TICK, font: { size: 9 } } }, y: { grid: GRID, ticks: { ...TICK, callback: v => '₹' + v.toFixed(2) } } } }
  });
  mkLine('sTariff', TARIFF_BY_TECH['Solar'], C.solar, 'Solar');
  mkLine('fTariff', TARIFF_BY_TECH['RTC/FDRE'], C.fdre, 'FDRE');
  mkLine('bTariff', TARIFF_BY_TECH['ESS/BESS'], C.bess, 'BESS');

  // Pipeline bar
  mkChart('pipelineChart', {
    type: 'bar',
    data: { labels: ['PPA Signed','LoA Issued','COD Achieved','Cancelled'], datasets: [{ data: [7482,8360,280,310], backgroundColor: [C.wind+'cc',C.jsw+'cc',C.ists+'cc',C.bess+'cc'], borderColor: [C.wind,C.jsw,C.ists,C.bess], borderWidth: 1.5, borderRadius: 4 }] },
    options: { responsive: true, maintainAspectRatio: true, plugins: { legend: NO_LEG }, scales: { x: { grid: { display: false }, ticks: TICK }, y: { grid: GRID, ticks: { ...TICK, callback: v => (v / 1000) + 'k' } } } }
  });

  // FY26 chart
  mkChart('fy26Chart', {
    type: 'bar',
    data: { labels: ['ACME','Patel Infra','NLC India','Enerica','Rel. Anil','Shivalaya','KP Group'], datasets: [{ data: [1995,1853,1600,765,750,600,565], backgroundColor: [C.acme,C.hybrid,C.ntpc,C.fdre,C.jsw,C.wind,'#888'].map(c=>c+'cc'), borderColor: [C.acme,C.hybrid,C.ntpc,C.fdre,C.jsw,C.wind,'#888'], borderWidth: 1.5, borderRadius: 3 }] },
    options: { responsive: true, maintainAspectRatio: true, plugins: { legend: NO_LEG }, scales: { x: { grid: { display: false }, ticks: { ...TICK, font: { size: 9 } } }, y: { grid: GRID, ticks: TICK } } }
  });

  // Deal table
  const deals = [
    {t:'NHPC FDRE-III',a:'NHPC',c:'RTC/FDRE',cn:'ISTS',cap:1200,ta:4.52,fy:'FY25',s:'LoA Issued'},
    {t:'NHPC FDRE-II',a:'NHPC',c:'RTC/FDRE',cn:'ISTS',cap:1200,ta:4.37,fy:'FY25',s:'LoA Issued'},
    {t:'SJVN ISTS-FDRE-2',a:'SJVN',c:'RTC/FDRE',cn:'ISTS',cap:1180,ta:4.26,fy:'FY25',s:'PPA Signed'},
    {t:'NHPC Solar-2',a:'NHPC',c:'Solar',cn:'ISTS',cap:1000,ta:2.53,fy:'FY24',s:'PPA Signed'},
    {t:'NTPC BOO-16',a:'NTPC',c:'Solar',cn:'ISTS',cap:750,ta:2.69,fy:'FY25',s:'LoA Issued'},
    {t:'NHPC Solar-3',a:'NHPC',c:'Solar',cn:'ISTS',cap:700,ta:2.57,fy:'FY25',s:'LoA Issued'},
    {t:'NHPC T9 Solar',a:'NHPC',c:'Solar',cn:'ISTS',cap:600,ta:2.47,fy:'FY25',s:'LoA Issued'},
    {t:'MSEDCL Hybrid Ph.3',a:'MSEDCL',c:'Hybrid',cn:'STU',cap:850,ta:3.61,fy:'FY25',s:'PPA Signed'},
    {t:'MSEDCL Hybrid Ph.4',a:'MSEDCL',c:'Hybrid',cn:'STU',cap:500,ta:3.69,fy:'FY25',s:'PPA Signed'},
    {t:'SJVN 1.5GW Hybrid',a:'SJVN',c:'Hybrid',cn:'ISTS',cap:470,ta:3.42,fy:'FY25',s:'LoA Issued'},
    {t:'NHPC Hybrid T10',a:'NHPC',c:'Hybrid',cn:'ISTS',cap:420,ta:3.42,fy:'FY25',s:'LoA Issued'},
    {t:'MSKVY (5 districts)',a:'MSAPL',c:'Solar',cn:'STU',cap:1034,ta:3.10,fy:'FY24',s:'PPA Signed'},
    {t:'NTPC BOO-14',a:'NTPC',c:'Solar',cn:'ISTS',cap:500,ta:2.60,fy:'FY24',s:'LoA Issued'},
    {t:'NTPC BOO-9',a:'NTPC',c:'Solar',cn:'ISTS',cap:500,ta:2.65,fy:'FY24',s:'PPA Signed'},
    {t:'GUVNL Ph-24',a:'GUVNL',c:'Solar',cn:'STU',cap:400,ta:2.68,fy:'FY25',s:'PPA Signed'},
    {t:'SECI-XIV Solar',a:'SECI',c:'Solar',cn:'ISTS',cap:300,ta:2.57,fy:'FY24',s:'LoA Issued'}
  ];
  const catCol = c => c === 'Solar' ? C.solar : c === 'Hybrid' ? C.hybrid : c === 'RTC/FDRE' ? C.fdre : '#888';
  const connCol = c => c === 'ISTS' ? C.ists : C.stu;
  const sPill = s => {
    const sl = s.toLowerCase();
    if (sl.includes('ppa')) return `<span class="pill pill-ppa">${s}</span>`;
    if (sl.includes('loa')) return `<span class="pill pill-loa">${s}</span>`;
    if (sl.includes('cod')) return `<span class="pill pill-cod">${s}</span>`;
    return `<span class="pill pill-cancel">${s}</span>`;
  };
  document.getElementById('dealBody').innerHTML = deals.map((d, i) => `
    <tr><td style="color:var(--muted)">${i + 1}</td><td>${d.t}</td><td style="color:var(--muted)">${d.a}</td>
    <td><span style="color:${catCol(d.c)};font-weight:600">${d.c}</span></td>
    <td><span style="color:${connCol(d.cn)};font-weight:600">${d.cn}</span></td>
    <td style="text-align:right;font-weight:600">${d.cap.toLocaleString()}</td>
    <td style="text-align:right;font-weight:700;color:var(--c-fdre)">₹${d.ta.toFixed(2)}</td>
    <td style="color:var(--muted)">${d.fy}</td><td>${sPill(d.s)}</td></tr>`).join('');
}

// ═══════════════════════════════════════════════ NAV
function showSection(id, el) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  el.classList.add('active');
}

// ═══════════════════════════════════════════════ INIT
buildStaticCharts();
rebuildAll();
</script>
</body>
</html>
