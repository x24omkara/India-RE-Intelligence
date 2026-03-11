import React, { useState, useMemo, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";

// ══════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════

// --- TRANSMISSION PHASES (verified from CERC, PGCIL, CTUIL sources) ---
const PHASES = [
  {
    id: "ph1", label: "Phase I", gw: 3,
    color: "#22c55e", status: "commissioned",
    period: "2021–Mar 2025",
    description: "Initial pooling station infrastructure + first 765kV HVAC backbone",
    parts: [
      { id:"ph1a", name:"KPS-1 Initial (Sec-A)", spv:"Khavda Bhuj Transmission Ltd", developer:"AESL", scope:"765/400kV GIS KPS-1, 3×1500 MVA (Sec-A); 41 ckm KPS1–KPS2 D/C line", scod:"Jan 2025", doco:"Mar 2025", cost:"~₹880 cr", status:"commissioned", delay:"~2 months" },
      { id:"ph1b", name:"KPS-1 Augmentation (Sec-B)", spv:"KPS1 Transmission Ltd", developer:"AESL (acq. from MEIL, Apr 2023)", scope:"4×1500 MVA ICTs at KPS-1 Sec-B + 1×1500 MVA RTM Sec-A", scod:"Feb 2025", doco:"Mar 2025", cost:"~₹800 cr", status:"commissioned", delay:"~1 month" },
      { id:"ph1c", name:"KPS-2 Initial", spv:"Powergrid KPS2 Transmission System Ltd", developer:"PGCIL", scope:"765/400kV GIS KPS-2, 4×1500 MVA (2 each Sec-A & B)", scod:"Dec 2024", doco:"Apr 2025", cost:"~₹880 cr", status:"commissioned", delay:"~4 months" },
      { id:"ph1d", name:"KPS-3 Establishment", spv:"Powergrid KPS3 Transmission Ltd", developer:"PGCIL", scope:"765/400kV GIS KPS-3, 3×1500 MVA; 30 ckm KPS3–KPS2 D/C line", scod:"Dec 2024", doco:"Aug 2025", cost:"₹789 cr", status:"commissioned", delay:"~8 months" },
    ]
  },
  {
    id: "ph2", label: "Phase II", gw: 4.5,
    color: "#3b82f6", status: "commissioned",
    period: "Mar 2023–Feb 2026",
    description: "4.5 GW evacuation via 765kV D/C lines from KPS-2 to Navsari (Maharashtra border)",
    parts: [
      { id:"ph2a", name:"Part A: KPS2 → Lakadia", spv:"Khavda II-A Transmission Ltd", developer:"AESL", scope:"355 ckm 765kV D/C line, KPS2 to Lakadia PS. No substation.", scod:"Mar 2025", doco:"Mar 2025", cost:"~₹1,100 cr", status:"commissioned", delay:"On schedule" },
      { id:"ph2b", name:"Part B: Lakadia → Ahmedabad", spv:"Powergrid Khavda II-B Transmission Ltd", developer:"PGCIL", scope:"368 ckm 765kV D/C line, Lakadia PS to Ahmedabad.", scod:"Mar 2025", doco:"Dec 2025", cost:"₹1,238 cr (tariff ₹1,106 M/yr)", status:"commissioned", delay:"~9 months (RoW, forest)" },
      { id:"ph2c", name:"Part C: Ahmedabad → Navsari", spv:"Powergrid Khavda II-C Transmission Ltd", developer:"PGCIL", scope:"590 ckm 765kV D/C line + new 765/400kV 3×1500 MVA Ahmedabad (New) substation.", scod:"Mar 2025", doco:"Feb 2, 2026", cost:"₹2,821 cr", status:"commissioned", delay:"~10 months (forest clearance)" },
      { id:"ph2d", name:"Part D: LILO at Ahmedabad", spv:"Torrent Power Grid Ltd (TGPL)", developer:"Torrent/PGCIL JV (74:26)", scope:"LILO of 400kV Pirana–Pirana line at Ahmedabad (New) SS.", scod:"—", doco:"Jan 2026", cost:"—", status:"commissioned", delay:"—" },
    ]
  },
  {
    id: "ph3", label: "Phase III", gw: 7,
    color: "#f59e0b", status: "commissioned",
    period: "Mar 2023–Aug 2025",
    description: "7 GW: Banaskantha–Ahmedabad 765kV corridor + KPS-2 augmentation to 4+4 ICTs",
    parts: [
      { id:"ph3a", name:"Banaskantha → Ahmedabad 765kV", spv:"Powergrid Khavda RE Transmission System Ltd", developer:"PGCIL", scope:"270 ckm 765kV D/C line, Banaskantha (Raghanesda) GIS to Ahmedabad.", scod:"Mar 2025", doco:"Jul 2025", cost:"₹953 cr", status:"commissioned", delay:"~4 months" },
      { id:"ph3b", name:"KPS-2 Augmentation (4 ICTs)", spv:"Powergrid KPS2 Transmission System Ltd", developer:"PGCIL", scope:"4×1500 MVA 765/400kV ICTs at KPS-2 (2 each Sec-A & B). KPS-2 → 8 ICTs total.", scod:"Dec 2024", doco:"Apr 2025", cost:"~₹880 cr", status:"commissioned", delay:"~4 months" },
    ]
  },
  {
    id: "ph4", label: "Phase IV", gw: 7,
    color: "#f97316", status: "under-construction",
    period: "Aug 2024–Nov 2026",
    description: "7 GW HVAC expansion: 8 parts covering new KPS-3 Sec-B, South Olpad GIS, Boisar-II, and KPS augmentation",
    parts: [
      { id:"ph4a", name:"Part A: KPS-3 Sec-B + Lines", spv:"Khavda IV-A Power Transmission Ltd", developer:"AESL (Aug 2024)", scope:"KPS-3 765kV Bus Sec-II; 298 ckm 765kV D/C KPS3→Lakadia & KPS3→Bhuj; 3×1500 MVA; 300 MVAr STATCOM.", scod:"Aug 2026", doco:"—", cost:"₹4,100 cr (tariff ₹5,090 M/yr)", status:"under-construction", delay:"SCOD Aug 2026" },
      { id:"ph4b", name:"Part B: South Olpad GIS + Lines", spv:"Powergrid Khavda IV-B Transmission Ltd", developer:"PGCIL (Sep 2024)", scope:"765/400/220kV GIS substation at South Olpad, Gujarat; 765kV + 400kV D/C lines.", scod:"Sep 2026", doco:"—", cost:"~₹4,766 cr (tariff ₹5,567 M/yr)", status:"under-construction", delay:"SCOD Sep 2026" },
      { id:"ph4c", name:"Part C: South Olpad → Boisar-II", spv:"Khavda IV-C Power Transmission Ltd", developer:"Sterlite Power (Aug 2024)", scope:"258 ckm 765kV D/C South Olpad→Boisar-II; Boisar-II 6,000 MVA 765/400/220kV GIS; 162 ckm LILO lines.", scod:"Aug 2026", doco:"—", cost:"₹5,340 cr NCT → revised ~₹12,000 cr; tariff ₹13,148 M/yr (record)", status:"under-construction", delay:"SCOD ~Aug 2026" },
      { id:"ph4d", name:"Part D: Pune Area Infrastructure", spv:"Pune-III Transmission Ltd", developer:"AESL (Nov 2024)", scope:"Transmission infrastructure serving Pune / Maharashtra corridor.", scod:"Nov 2026", doco:"—", cost:"~₹5,892 M tariff/yr", status:"under-construction", delay:"SCOD Nov 2026" },
      { id:"ph4e2", name:"Part E2: KPS-1 & KPS-2 ICT Augmentation", spv:"Powergrid Khavda IV-E2 Power Transmission Ltd", developer:"PGCIL (May 2024)", scope:"2×1500 MVA ICTs each at KPS-1 Sec-B and KPS-2 (making KPS-1: 9 ICTs, KPS-2: 8+1).", scod:"Feb 2026", doco:"—", cost:"₹679 cr (tariff ₹990 M/yr)", status:"under-construction", delay:"SCOD Feb 2026" },
      { id:"ph4e1", name:"Part E1 (RTM): KPS-1 Augmentation", spv:"AESL RTM subsidiary", developer:"AESL (RTM)", scope:"KPS-1 augmentation (minor). Augments KPS-1 transformation.", scod:"~2026", doco:"—", cost:"<₹500 cr", status:"under-construction", delay:"RTM – minor works" },
      { id:"ph4e3", name:"Part E3 (RTM): KPS-3 Augmentation", spv:"PGCIL RTM subsidiary", developer:"PGCIL (RTM)", scope:"KPS-3 augmentation works.", scod:"~2026", doco:"—", cost:"<₹500 cr", status:"under-construction", delay:"RTM – minor works" },
      { id:"ph4e4", name:"Part E4 (RTM): Padghe GIS Augmentation", spv:"PGCIL direct", developer:"PGCIL (RTM)", scope:"Augmentation of Padghe GIS substation in Maharashtra.", scod:"~2026", doco:"—", cost:"<₹500 cr", status:"under-construction", delay:"RTM – minor works" },
    ]
  },
  {
    id: "ph5", label: "Phase V", gw: 8,
    color: "#8b5cf6", status: "awarded",
    period: "Nov 2024–May 2029",
    description: "8 GW: India's first HVDC-TBCB projects — ±800kV LCC (6 GW) + ±500kV VSC (2.5 GW) + KPS augmentations",
    parts: [
      { id:"ph5a", name:"Part A: ±800kV HVDC LCC — KPS2 to Nagpur", spv:"Khavda V-A Power Transmission Ltd", developer:"PGCIL (Nov 2024) — FIRST EVER HVDC-TBCB", scope:"±800kV 6,000 MW LCC bipole (Hexa Lapwing), 1,200 km KPS-2 HVDC terminal → Nagpur HVDC terminal. 6×1500 MVA ICTs at Nagpur. Lines: KEC International + Jyoti Structures. Terminals: BHEL + Hitachi Energy India.", scod:"Pole 1: Nov 2028 / Pole 2: May 2029", doco:"—", cost:"₹24,819 cr (tariff ₹40,829 M/yr — record)", status:"awarded", delay:"54-month completion. Land acquisition at Nagpur pending." },
      { id:"ph5c", name:"Part C: ±500kV HVDC VSC — KPS3 to South Olpad", spv:"KPS III HVDC Transmission Ltd", developer:"AESL (Dec 2025)", scope:"±500kV 2,500 MW VSC bipole, 600 km. KPS-3 HVDC terminal to South Olpad HVDC terminal, both in Gujarat. GE Vernova T&D India awarded HVDC terminal contract.", scod:"Dec 2029 (48 months from Dec 2025)", doco:"—", cost:"₹12,000 cr NCT est. (tariff ~₹2,300 cr/yr)", status:"awarded", delay:"48-month completion. Under early engineering." },
      { id:"ph5b1b2", name:"Part B1/B2: KPS-1 & KPS-2 ICT Augmentation", spv:"Powergrid KPS 1 and 2 Augmentation Transmission Ltd", developer:"PGCIL (Feb 2025)", scope:"1×1500 MVA ICT at KPS-1 Sec-B + 1×1500 MVA at KPS-2 Sec-I (9th ICT each).", scod:"Feb 2027", doco:"—", cost:"₹466 cr (tariff ₹699 M/yr)", status:"awarded", delay:"SCOD Feb 2027" },
      { id:"ph5b3", name:"Part B3 (RTM): KPS-3 ICT Augmentation", spv:"Khavda IV-A (AESL RTM subsidiary)", developer:"AESL (RTM, ~2025)", scope:"1×1500 MVA ICT at KPS-3 Sec-B (8th ICT at KPS-3).", scod:"~2026–27", doco:"—", cost:"₹252 cr", status:"awarded", delay:"RTM" },
      { id:"ph5stat", name:"STATCOM at KPS-1 & KPS-3", spv:"Powergrid Khavda PS1 and 3 Transmission Ltd", developer:"PGCIL (Sep 2024)", scope:"±300 MVAr STATCOM + 1×125 MVAr MSC + 2×125 MVAr MSR at KPS-1 Bus-1&2 and KPS-3 Bus-1.", scod:"Nov 2026", doco:"—", cost:"₹501 cr", status:"awarded", delay:"SCOD Nov 2026" },
    ]
  }
];

// --- BAY ALLOCATION DATA ---
const BAY_DATA = [
  // KPS-I
  { ps:"KPS-I", bay:"401", section:"A", developer:"Adani Renewable Energy Holding Four Ltd.", group:"Adani Group", mw:2500, margin:0 },
  { ps:"KPS-I", bay:"404", section:"A", developer:"Adani Renewable Energy Holding Four Ltd.", group:"Adani Group", mw:1000, margin:0 },
  { ps:"KPS-I", bay:"412", section:"A", developer:"Adani Green Energy Ltd.", group:"Adani Group", mw:1050, margin:0 },
  { ps:"KPS-I", bay:"421", section:"B", developer:"Adani Green Energy Ltd.", group:"Adani Group", mw:1650, margin:0 },
  { ps:"KPS-I", bay:"424", section:"B", developer:"Adani Green Energy Ltd.", group:"Adani Group", mw:1160, margin:0 },
  { ps:"KPS-I", bay:"7",   section:"B", developer:"Adani Green Energy Ltd.", group:"Adani Group", mw:1300, margin:0 },
  { ps:"KPS-I", bay:"8",   section:"B", developer:"Sarjan Realties Pvt. Ltd.", group:"Sarjan (Suzlon)", mw:1150, margin:0 },
  { ps:"KPS-I", bay:"9",   section:"B", developer:"Reliance Industries Limited", group:"Reliance", mw:690, margin:0 },
  // KPS-II
  { ps:"KPS-II", bay:"421", section:"A", developer:"Gujarat State Electricity Corporation Ltd.", group:"GSECL", mw:1964, margin:0 },
  { ps:"KPS-II", bay:"418", section:"A", developer:"Gujarat Industries Power Company", group:"GIPCL", mw:1200, margin:0 },
  { ps:"KPS-II", bay:"4",   section:"A", developer:"NTPC REL", group:"NTPC Group", mw:1995, margin:0 },
  { ps:"KPS-II", bay:"429", section:"B", developer:"NTPC Renewable Energy Ltd.", group:"NTPC Group", mw:1555, margin:0 },
  { ps:"KPS-II", bay:"7",   section:"B", developer:"Gujarat State Electricity Corporation Ltd.", group:"GSECL", mw:1361, margin:0 },
  { ps:"KPS-II", bay:"8",   section:"B", developer:"Gujarat Industries Power Corporation Ltd.", group:"GIPCL", mw:1175, margin:0 },
  // KPS-III
  { ps:"KPS-III", bay:"406", section:"A", developer:"Adani Green Energy Ltd.", group:"Adani Group", mw:1050, margin:0 },
  { ps:"KPS-III", bay:"403", section:"A", developer:"NTPC Renewable Energy Ltd.", group:"NTPC Group", mw:1200, margin:0 },
  { ps:"KPS-III", bay:"412", section:"A", developer:"Sarjan Realties Pvt. Ltd.", group:"Sarjan (Suzlon)", mw:1250, margin:0 },
  { ps:"KPS-III", bay:"4",   section:"B", developer:"Sarjan Realties Pvt. Ltd.", group:"Sarjan (Suzlon)", mw:1100, margin:0 },
  { ps:"KPS-III", bay:"5",   section:"B", developer:"Sarjan Realties Pvt. Ltd.", group:"Sarjan (Suzlon)", mw:1250, margin:0 },
  { ps:"KPS-III", bay:"6",   section:"B", developer:"NHPC Ltd.", group:"NHPC", mw:600, margin:0 },
  { ps:"KPS-III", bay:"7",   section:"B", developer:"Adani Green Energy Ltd.", group:"Adani Group", mw:1325, margin:0 },
  { ps:"KPS-III", bay:"8",   section:"B", developer:"Adani Green Energy Ltd.", group:"Adani Group", mw:1160, margin:0 },
  // KPS-IV (Adani Power — separate section, likely Adani Power thermal/storage offtake bays)
  { ps:"KPS-IV", bay:"1", section:"—", developer:"Adani Power Limited", group:"Adani Power", mw:1250, margin:0 },
  { ps:"KPS-IV", bay:"2", section:"—", developer:"Adani Power Limited", group:"Adani Power", mw:1250, margin:0 },
  { ps:"KPS-IV", bay:"3", section:"—", developer:"Adani Power Limited", group:"Adani Power", mw:1250, margin:0 },
  { ps:"KPS-IV", bay:"4", section:"—", developer:"Adani Power Limited", group:"Adani Power", mw:625, margin:0 },
  { ps:"KPS-IV", bay:"5", section:"—", developer:"Adani Power Limited", group:"Adani Power", mw:625, margin:0 },
  { ps:"KPS-IV", bay:"6", section:"—", developer:"Adani Power Limited", group:"Adani Power", mw:1250, margin:0 },
  { ps:"KPS-IV", bay:"7", section:"—", developer:"Adani Power Limited", group:"Adani Power", mw:1250, margin:0 },
  { ps:"KPS-IV", bay:"8", section:"—", developer:"Adani Power Limited", group:"Adani Power", mw:1250, margin:0 },
  // KPS-V
  { ps:"KPS-V", bay:"1", section:"—", developer:"Adani Power Limited", group:"Adani Power", mw:1250, margin:0 },
  { ps:"KPS-V", bay:"2", section:"—", developer:"Adani Power Limited", group:"Adani Power", mw:1250, margin:0 },
  { ps:"KPS-V", bay:"3", section:"—", developer:"Adani Power Limited", group:"Adani Power", mw:1250, margin:0 },
];

// --- KPS STATION PROFILES ---
const KPS_PROFILES = [
  {
    id:"KPS-I", owner:"AESL",
    voltage:"765/400kV GIS",
    status:"commissioned",
    coords:"24°04'N 69°31'E",
    icts_commissioned: 8,
    icts_planned: 1, // Ph V-B1
    icts_total: 9,
    mva_each: 1500,
    sec_a_icts: 4, sec_b_icts: 5,
    capacity_commissioned_mva: 12000,
    capacity_total_mva: 13500,
    hvdc: false,
    color:"#22c55e",
    notes:"AESL-built. 4 ICTs Sec-A (Khavda Bhuj Transmission) + 4 ICTs Sec-B (KPS1 Transmission) + 1 RTM ICT. 9th ICT via Ph V-B1 (SCOD Feb 2027).",
    margin_note: "Bays fully allocated to Adani Group (all three sections). No open bays.",
    margin_mw: 0,
  },
  {
    id:"KPS-II", owner:"PGCIL",
    voltage:"765/400kV GIS",
    status:"commissioned",
    coords:"24°04'N 69°31'E",
    icts_commissioned: 8,
    icts_planned: 1, // Ph V-B2
    icts_total: 9,
    mva_each: 1500,
    sec_a_icts: 4, sec_b_icts: 4,
    capacity_commissioned_mva: 12000,
    capacity_total_mva: 13500,
    hvdc: true,
    hvdc_note:"±800kV LCC HVDC terminal (6,000 MW) under construction — KPS-2 to Nagpur, PGCIL, SCOD Nov 2028",
    color:"#3b82f6",
    notes:"PGCIL-built. 4 ICTs via Powergrid KPS2 Transmission System Ltd + 4 ICTs via Khavda IV-E2 = 8 ICTs. 9th ICT via Ph V-B2 (SCOD Feb 2027). HVDC terminal under construction alongside AC.",
    margin_note: "Bays fully allocated — GSECL, GIPCL, NTPC. No open bays.",
    margin_mw: 0,
  },
  {
    id:"KPS-III", owner:"PGCIL",
    voltage:"765/400kV GIS",
    status:"commissioned Aug 2025",
    coords:"24°20'N 69°50'E (approx)",
    icts_commissioned: 3,
    icts_planned: 5, // Ph IV-A adds 3 ICTs + RTM + Ph V-B3
    icts_total: 8,
    mva_each: 1500,
    sec_a_icts: 3, sec_b_icts: 0,
    capacity_commissioned_mva: 4500,
    capacity_total_mva: 12000,
    hvdc: true,
    hvdc_note:"±500kV VSC HVDC terminal (2,500 MW) under construction — KPS-3 to South Olpad, AESL, SCOD Dec 2029",
    color:"#f59e0b",
    notes:"Initially 3×1500 MVA (PGCIL). Ph IV-A adding 765kV Bus Sec-II + 3×1500 MVA ICTs (AESL, SCOD Aug 2026). Ph V-B3 adds 8th ICT. Sec-B bays being activated by Phase IV-A.",
    margin_note: "Sec-A bays allocated. Sec-B bays partially allocated — some capacity for new developers via Phase IV-A expansion.",
    margin_mw: 500,
  },
  {
    id:"KPS-IV", owner:"AESL (SCOD Aug 2026)",
    voltage:"765/400kV",
    status:"under-construction",
    coords:"24°20'N 71°29'E",
    icts_commissioned: 0,
    icts_planned: 3,
    icts_total: 3,
    mva_each: 1500,
    capacity_commissioned_mva: 0,
    capacity_total_mva: 4500,
    hvdc: false,
    color:"#f97316",
    notes:"Being developed under Phase IV-B (PGCIL, South Olpad GIS). Current CTUIL allocation shows Adani Power Limited holding 8,750 MW across 8 bays at this station.",
    margin_note: "Primarily Adani Power bays. Limited open capacity for third-party RE developers in current allocation.",
    margin_mw: 250,
  },
  {
    id:"KPS-V", owner:"Phase V planning",
    voltage:"765/400kV",
    status:"planned",
    coords:"24°27'N 71°24'E",
    icts_commissioned: 0,
    icts_planned: 0,
    icts_total: 0,
    mva_each: 1500,
    capacity_commissioned_mva: 0,
    capacity_total_mva: 0,
    hvdc: false,
    color:"#8b5cf6",
    notes:"Planning stage. CTUIL connectivity register shows 3 bays allocated — all to Adani Power Limited (1,250 + 1,250 + 1,250 MW). Station not yet formally awarded.",
    margin_note: "Station under planning. No formal tender yet. Connectivity applications may be accepted as Phase V progresses.",
    margin_mw: 1500,
  },
];

// --- HVDC PROJECTS ---
const HVDC_PROJECTS = [
  {
    id:"va",
    name:"Khavda V-A: KPS2 → Nagpur",
    label:"±800 kV LCC",
    capacity_mw: 6000,
    technology:"LCC (Line Commutated Converter)",
    route:"KPS-2 (Gujarat) → Nagpur (Maharashtra)",
    length_km: 1200,
    ckm: 2412,
    developer:"PGCIL",
    spv:"Khavda V-A Power Transmission Ltd",
    awarded:"Nov 19, 2024",
    cost_cr: 24819,
    tariff_m_yr: 40829, // CERC-approved: Rs.40,828.67 M/yr
    pole1_scod:"Nov 2028",
    pole2_scod:"May 2029",
    status:"under-construction",
    color:"#a78bfa",
    packages:[
      { name:"HVDC Terminal Stations (KPS2 + Nagpur)", contractor:"BHEL + Hitachi Energy India (consortium)", value:"Undisclosed", note:"±800kV, 4×1500 MW each terminal. Thyristor valves from BHEL Bengaluru. Converter transformers, shunt reactors from BHEL Bhopal." },
      { name:"HVDC Bipole Line — Package 01", contractor:"Jyoti Structures Ltd", value:"₹741 cr", note:"Hexa Lapwing conductor. First package of multi-package award." },
      { name:"HVDC Bipole Line — Package (KEC)", contractor:"KEC International", value:"Undisclosed (~140 km)", note:"Part of multi-package line award." },
    ],
    constraints:[
      "Nagpur land acquisition: 405 acres of private land pending — application submitted Dec 2024 to District Magistrate.",
      "Engineering & survey under progress across 2,412 ckm route.",
      "6×1500 MVA ICTs at Nagpur substation also part of scope.",
    ],
    significance:"India's first HVDC project under TBCB. Largest ISTS-TBCB scheme ever by capital outlay and annual tariff. SPV renamed to 'Powergrid West Central Transmission Ltd' by PGCIL. Removes reactive power limitations of long HVAC corridors for 6 GW transfer from Gujarat to Maharashtra.",
  },
  {
    id:"vc",
    name:"KPS III HVDC: KPS3 → South Olpad",
    label:"±500 kV VSC",
    capacity_mw: 2500,
    technology:"VSC (Voltage Source Converter)",
    route:"KPS-3 (Gujarat) → South Olpad (Gujarat)",
    length_km: 600,
    ckm: 600,
    developer:"AESL",
    spv:"KPS III HVDC Transmission Ltd",
    awarded:"Dec 12, 2025",
    cost_cr: 12000,
    tariff_m_yr: 23920,
    pole1_scod:"Dec 2029",
    pole2_scod:"Dec 2029",
    status:"awarded",
    color:"#f472b6",
    packages:[
      { name:"HVDC VSC Terminal Stations (KPS3 + South Olpad)", contractor:"GE Vernova T&D India", value:"Undisclosed (multi-year)", note:"2×1250 MW, ±500kV VSC terminals. Both located in Gujarat — intra-state HVDC route." },
    ],
    constraints:[
      "48-month completion schedule from Dec 2025 → target Dec 2029.",
      "GE Vernova awarded terminals contract; line contracts pending.",
      "VSC technology chosen for flexibility and reactive power control.",
    ],
    significance:"India's third HVDC-TBCB project (after V-A by PGCIL Nov 2024, Rajasthan Part-I by AESL Jan 2025). First VSC-based HVDC under TBCB. Intra-Gujarat route both terminals in Gujarat — feeds South Olpad which has Phase IV-B 765kV HVAC. GE Vernova contract signed Dec 20, 2025.",
  },
];

// ══════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════
const STATUS_COLORS = {
  "commissioned":"#22c55e",
  "under-construction":"#f97316",
  "awarded":"#8b5cf6",
  "planned":"#6b7280",
};
const STATUS_BG = {
  "commissioned":"#052e16",
  "under-construction":"#431407",
  "awarded":"#2e1065",
  "planned":"#111827",
};
const STATUS_LABEL = {
  "commissioned":"Commissioned",
  "under-construction":"Under Construction",
  "awarded":"Awarded",
  "planned":"Planned",
};

function Badge({ status }) {
  return (
    <span className="text-xs font-bold px-2 py-0.5 rounded"
      style={{ background: STATUS_BG[status], color: STATUS_COLORS[status] }}>
      {STATUS_LABEL[status]}
    </span>
  );
}

const GROUP_COLORS = {
  "Adani Group": "#3b82f6",
  "Adani Power": "#60a5fa",
  "NTPC Group": "#10b981",
  "GSECL": "#22d3ee",
  "GIPCL": "#a78bfa",
  "Sarjan (Suzlon)": "#f59e0b",
  "NHPC": "#34d399",
  "Reliance": "#f87171",
};

const PS_COLORS = { "KPS-I":"#22c55e", "KPS-II":"#3b82f6", "KPS-III":"#f59e0b", "KPS-IV":"#f97316", "KPS-V":"#8b5cf6" };

// ══════════════════════════════════════════════════════════════
// SECTION 1: TRANSMISSION PHASES TIMELINE
// ══════════════════════════════════════════════════════════════
function PhaseTimeline() {
  const [selPhase, setSelPhase] = useState("ph4");
  const [selPart, setSelPart] = useState(null);

  const phase = PHASES.find(p => p.id === selPhase);
  const part = selPart ? phase?.parts.find(p => p.id === selPart) : null;

  return (
    <div className="space-y-5">
      {/* Phase selector strip */}
      <div className="flex gap-0 overflow-x-auto">
        {PHASES.map((ph, i) => {
          const isActive = selPhase === ph.id;
          return (
            <button key={ph.id}
              onClick={() => { setSelPhase(ph.id); setSelPart(null); }}
              className="flex-1 min-w-40 text-center py-3 px-2 border-b-2 transition-all relative"
              style={{
                borderBottomColor: isActive ? ph.color : "transparent",
                background: isActive ? ph.color + "15" : "transparent",
              }}>
              <div className="text-sm font-bold" style={{ color: isActive ? ph.color : "#6b7280" }}>
                {ph.label}
              </div>
              <div className="text-xs font-bold mt-0.5" style={{ color: isActive ? "white" : "#4b5563" }}>
                {ph.gw} GW
              </div>
              <div className="text-xs mt-0.5" style={{ color: isActive ? ph.color : "#374151" }}>
                {ph.period}
              </div>
              <div className="mt-1.5 flex justify-center">
                <Badge status={ph.status} />
              </div>
            </button>
          );
        })}
      </div>

      {phase && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: phase summary */}
          <div className="lg:col-span-1 space-y-3">
            <div className="rounded-xl border p-4" style={{ borderColor: phase.color + "40", background: phase.color + "08" }}>
              <div className="text-2xl font-black" style={{ color: phase.color }}>{phase.label}</div>
              <div className="text-3xl font-black text-white mt-1">{phase.gw} GW</div>
              <div className="text-gray-400 text-sm mt-2 leading-relaxed">{phase.description}</div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge status={phase.status} />
                <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-800 rounded">{phase.period}</span>
                <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-800 rounded">{phase.parts.length} parts</span>
              </div>
            </div>

            {/* Cumulative context */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Cumulative RE Evacuation Capacity</div>
              {PHASES.map((ph, i) => {
                const cumGW = PHASES.slice(0, i + 1).reduce((s, p) => s + p.gw, 0);
                const isThis = ph.id === phase.id;
                return (
                  <div key={ph.id} className="flex items-center gap-2 mb-2 last:mb-0">
                    <div className="w-16 text-xs font-bold" style={{ color: ph.color }}>{ph.label}</div>
                    <div className="flex-1 h-5 bg-gray-900 rounded-sm overflow-hidden">
                      <div className="h-full rounded-sm transition-all"
                        style={{ width: `${(cumGW / 30) * 100}%`, background: ph.color, opacity: isThis ? 1 : 0.45 }} />
                    </div>
                    <div className="w-12 text-right text-xs font-mono text-gray-400">{cumGW} GW</div>
                  </div>
                );
              })}
              <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-600">
                Target: 30 GW total from Khavda RE Park
              </div>
            </div>
          </div>

          {/* Right: parts list + detail */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              {phase.parts.length} transmission parts — click any to expand
            </div>
            <div className="space-y-2">
              {phase.parts.map(pt => {
                const isSel = selPart === pt.id;
                return (
                  <div key={pt.id}
                    className="rounded-xl border cursor-pointer transition-all"
                    style={{
                      borderColor: isSel ? phase.color : "#374151",
                      background: isSel ? phase.color + "0a" : "#111827",
                    }}
                    onClick={() => setSelPart(isSel ? null : pt.id)}>
                    <div className="flex items-start gap-3 p-3">
                      <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: STATUS_COLORS[pt.status] }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-sm text-white">{pt.name}</span>
                          <Badge status={pt.status} />
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 truncate">{pt.developer} · {pt.spv}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-gray-400">SCOD</div>
                        <div className="text-sm font-bold" style={{ color: pt.status === "commissioned" ? "#22c55e" : "#f97316" }}>
                          {pt.doco || pt.scod}
                        </div>
                      </div>
                      <div className="text-gray-500 text-sm">{isSel ? "▲" : "▼"}</div>
                    </div>
                    {isSel && (
                      <div className="px-4 pb-4 space-y-3 border-t border-gray-700 pt-3">
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Scope</div>
                          <div className="text-sm text-gray-300 leading-relaxed">{pt.scope}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div><span className="text-gray-500">Developer: </span><span className="text-gray-200">{pt.developer}</span></div>
                          <div><span className="text-gray-500">Cost: </span><span className="text-gray-200">{pt.cost}</span></div>
                          <div><span className="text-gray-500">Original SCOD: </span><span className="text-gray-200">{pt.scod}</span></div>
                          <div><span className="text-gray-500">Actual DOCO: </span>
                            <span className={pt.doco && pt.doco !== "—" ? "text-green-400" : "text-yellow-400"}>
                              {pt.doco && pt.doco !== "—" ? pt.doco : "Pending"}
                            </span>
                          </div>
                          <div className="col-span-2"><span className="text-gray-500">Note: </span><span className="text-yellow-300">{pt.delay}</span></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SECTION 2: KPS STATION STATUS & BAY CAPACITY
// ══════════════════════════════════════════════════════════════
function StationProfiles() {
  const [selPS, setSelPS] = useState("KPS-III");

  const station = KPS_PROFILES.find(s => s.id === selPS);
  const bays = BAY_DATA.filter(b => b.ps === selPS);
  const totalAllocated = bays.reduce((s, b) => s + b.mw, 0);

  // Group bays by developer group
  const byGroup = {};
  bays.forEach(b => {
    if (!byGroup[b.group]) byGroup[b.group] = 0;
    byGroup[b.group] += b.mw;
  });
  const groupEntries = Object.entries(byGroup).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-4">
      {/* Station selector */}
      <div className="flex gap-2 flex-wrap">
        {KPS_PROFILES.map(ps => (
          <button key={ps.id}
            onClick={() => setSelPS(ps.id)}
            className="px-4 py-2 rounded-xl border font-semibold text-sm transition-all"
            style={selPS === ps.id
              ? { background: ps.color + "25", borderColor: ps.color, color: ps.color }
              : { background: "#111827", borderColor: "#374151", color: "#6b7280" }}>
            {ps.id}
            <span className="ml-2 text-xs font-normal">{STATUS_LABEL[ps.status]}</span>
          </button>
        ))}
      </div>

      {station && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Station card */}
          <div className="space-y-3">
            <div className="rounded-xl border p-4" style={{ borderColor: station.color + "40", background: station.color + "08" }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl font-black text-white">{station.id}</div>
                  <div className="text-sm text-gray-400 mt-0.5">{station.voltage}</div>
                </div>
                <Badge status={station.status} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-900 rounded-lg p-2">
                  <div className="text-gray-500 text-xs">Owner/TSO</div>
                  <div className="text-white font-bold text-sm">{station.owner}</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-2">
                  <div className="text-gray-500 text-xs">Coords</div>
                  <div className="text-white text-xs font-mono">{station.coords}</div>
                </div>
              </div>

              {/* ICT build-up */}
              <div className="mt-3">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">ICT Build-Up (1,500 MVA each)</div>
                <div className="flex gap-1 flex-wrap">
                  {Array.from({ length: station.icts_total || station.icts_commissioned + station.icts_planned }).map((_, i) => (
                    <div key={i}
                      className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold"
                      style={i < station.icts_commissioned
                        ? { background: station.color + "30", border: `1.5px solid ${station.color}`, color: station.color }
                        : i < (station.icts_commissioned + station.icts_planned)
                          ? { background: "#431407", border: "1.5px solid #f97316", color: "#f97316" }
                          : { background: "#111827", border: "1px solid #374151", color: "#374151" }}>
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ background: station.color + "30", border: `1px solid ${station.color}` }} />
                    <span className="text-gray-500">Commissioned ({station.icts_commissioned})</span>
                  </div>
                  {station.icts_planned > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded" style={{ background: "#431407", border: "1px solid #f97316" }} />
                      <span className="text-gray-500">Planned ({station.icts_planned})</span>
                    </div>
                  )}
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Commissioned: <span className="text-white font-bold">{station.capacity_commissioned_mva.toLocaleString()} MVA</span>
                  {station.capacity_total_mva > station.capacity_commissioned_mva && (
                    <> → Total: <span className="text-yellow-400 font-bold">{station.capacity_total_mva.toLocaleString()} MVA</span></>
                  )}
                </div>
              </div>

              {station.hvdc && (
                <div className="mt-3 p-2 rounded-lg border border-purple-700 bg-purple-900 bg-opacity-20">
                  <div className="text-xs font-bold text-purple-400 mb-1">⚡ HVDC Terminal</div>
                  <div className="text-xs text-purple-300">{station.hvdc_note}</div>
                </div>
              )}
            </div>

            {/* Bay margin indicator */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Bay Margin Available</div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-black"
                  style={{ color: station.margin_mw > 1000 ? "#22c55e" : station.margin_mw > 200 ? "#f59e0b" : "#ef4444" }}>
                  {station.margin_mw > 0 ? `~${station.margin_mw.toLocaleString()} MW` : "None"}
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-2 leading-relaxed">{station.margin_note}</div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Notes</div>
              <div className="text-xs text-gray-400 leading-relaxed">{station.notes}</div>
            </div>
          </div>

          {/* Bay allocation table */}
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                <div className="text-sm font-semibold text-white">
                  Bay Allocation Register — {selPS}
                  <span className="ml-2 text-xs text-gray-500">CTUIL May 2025</span>
                </div>
                <div className="text-sm font-bold" style={{ color: PS_COLORS[selPS] }}>
                  {totalAllocated.toLocaleString()} MW total
                </div>
              </div>
              {bays.length > 0 ? (
                <table className="w-full text-sm">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs text-gray-500 uppercase">Bay</th>
                      <th className="px-3 py-2 text-left text-xs text-gray-500 uppercase">Section</th>
                      <th className="px-3 py-2 text-left text-xs text-gray-500 uppercase">Developer</th>
                      <th className="px-3 py-2 text-left text-xs text-gray-500 uppercase">Group</th>
                      <th className="px-3 py-2 text-right text-xs text-gray-500 uppercase">MW</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bays.map((b, i) => (
                      <tr key={i} className="border-t border-gray-700 hover:bg-gray-700">
                        <td className="px-3 py-2 font-mono text-xs text-gray-300 font-bold">{b.bay}</td>
                        <td className="px-3 py-2 text-xs text-gray-500">{b.section}</td>
                        <td className="px-3 py-2 text-xs text-gray-300 max-w-48 truncate">{b.developer}</td>
                        <td className="px-3 py-2">
                          <span className="text-xs px-2 py-0.5 rounded font-medium"
                            style={{ background: (GROUP_COLORS[b.group] || "#6b7280") + "20", color: GROUP_COLORS[b.group] || "#6b7280" }}>
                            {b.group}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right font-mono font-bold text-white">{b.mw.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-900">
                    <tr>
                      <td className="px-3 py-2 text-xs text-gray-500" colSpan={4}>Total allocated</td>
                      <td className="px-3 py-2 text-right font-mono font-black text-white">{totalAllocated.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm">No bay allocations recorded yet for {selPS}</div>
              )}
            </div>

            {/* Group bar chart */}
            {groupEntries.length > 0 && (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">By Group — MW Share</div>
                <div className="space-y-2">
                  {groupEntries.map(([g, mw]) => (
                    <div key={g} className="flex items-center gap-2">
                      <div className="w-28 text-xs truncate" style={{ color: GROUP_COLORS[g] || "#9ca3af" }}>{g}</div>
                      <div className="flex-1 h-4 bg-gray-900 rounded overflow-hidden">
                        <div className="h-full rounded transition-all"
                          style={{ width: `${(mw / totalAllocated) * 100}%`, background: GROUP_COLORS[g] || "#6b7280" }} />
                      </div>
                      <div className="w-20 text-right text-xs font-mono text-gray-400">{mw.toLocaleString()} MW</div>
                      <div className="w-10 text-right text-xs text-gray-600">{((mw / totalAllocated) * 100).toFixed(0)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SECTION 3: BAY MARGINS DASHBOARD
// ══════════════════════════════════════════════════════════════
function BayMargins() {
  // ── MARGIN METHODOLOGY NOTE ──────────────────────────────────────────────
  // "Phase design capacity" = NCT-approved MW target for the phase(s) that
  // a given KPS primarily serves. This is the only MW ceiling that has a
  // published source (CERC/CTUIL scheme documents).
  //
  // allocated_mw  → summed from CTUIL Bay Allocation Register (May 2025) via BAY_DATA
  // phase_design_mw → NCT-approved capacity for the phases feeding this station
  // margin_mw     → phase_design_mw − allocated_mw  (computed, not hardcoded)
  // fill gauge    → allocated_mw / phase_design_mw
  //
  // KPS-I  : Phase I (3 GW) + Phase II partial contribution → 10,500 MW designed
  //          (Phases I–III collectively sized KPS-I for 10,500 MW CTUIL bays)
  //          CTUIL register has 8 bays totalling 10,500 MW → fill = 100%
  // KPS-II : Phase I + II + III → 9,250 MW allocated across 6 CTUIL bays
  //          NCT sized KPS-II for ~9,250 MW at Phases I–III → fill = 100%
  // KPS-III: Phase I–III establishes 3×1500 MVA Sec-A; Phase IV-A adds Sec-B
  //          (3+5 = 8 ICTs = 12,000 MVA nameplate). CTUIL shows 8,935 MW bays.
  //          Phase IV design target for KPS-III = 12,000 MW (8 ICTs × 1500 MVA)
  // KPS-IV : Phase IV design = 9,000 MW (6×1500 MVA ICTs in CERC IV-A scope);
  //          CTUIL shows 8,750 MW allocated → margin = 250 MW
  // KPS-V  : Phase V planning stage. NCT-sized capacity not yet published.
  //          CTUIL shows 3 bays = 3,750 MW. Design target assumed = 5,250 MW
  //          (3,750 + ~1,500 MW expected from connectivity applications in progress)
  //          Margin = 1,500 MW (indicative only — flagged as estimate)
  // ─────────────────────────────────────────────────────────────────────────

  const buildMarginData = () => {
    const alloc = (ps) => BAY_DATA.filter(b => b.ps === ps).reduce((s, b) => s + b.mw, 0);
    const bayCount = (ps) => BAY_DATA.filter(b => b.ps === ps).length;

    // phase_design_mw: the MW ceiling against which fill is computed
    // For KPS-I and KPS-II: CTUIL-registered bays themselves define the ceiling
    //   (all bays taken → 100% fill). Use allocated_mw as ceiling so gauge = 100%.
    // For KPS-III onward: use NCT/CERC scheme capacity as the forward-looking ceiling.
    const rows = [
      {
        ps: "KPS-I", color: "#22c55e", status: "commissioned",
        phase_design_mw: alloc("KPS-I"), // 10,500 MW — all 8 CTUIL bays taken; ceiling = allocated
        phase_design_src: "CTUIL register (8 bays, all allocated — ceiling = allocated MW)",
        bays_ctuil: bayCount("KPS-I"),
        bays_open: 0,
        next_capacity: "9th ICT via Ph V-B1 (Feb 2027) — expected to be taken by existing Adani entities.",
        margin_note: "All 8 CTUIL bays allocated to Adani Group. Zero open bays. 9th ICT (V-B1) yet to be notified.",
      },
      {
        ps: "KPS-II", color: "#3b82f6", status: "commissioned",
        phase_design_mw: alloc("KPS-II"), // 9,250 MW — all 6 CTUIL bays taken
        phase_design_src: "CTUIL register (6 bays, all allocated — ceiling = allocated MW)",
        bays_ctuil: bayCount("KPS-II"),
        bays_open: 0,
        next_capacity: "9th ICT via Ph V-B2 (Feb 2027). ±800kV HVDC terminal (6 GW) under construction alongside.",
        margin_note: "All 6 CTUIL bays allocated — GSECL, GIPCL, NTPC. Zero open bays. HVDC corridor adds separate 6 GW pathway.",
      },
      {
        ps: "KPS-III", color: "#f59e0b", status: "partially active",
        phase_design_mw: 12000, // 8 ICTs × 1500 MVA — NCT/CERC Phase IV-A scheme scope
        phase_design_src: "NCT Phase IV-A scheme: 8 ICTs × 1,500 MVA = 12,000 MVA nameplate",
        bays_ctuil: bayCount("KPS-III"),
        bays_open: 0, // all 8 listed bays allocated; new Sec-B bays from Ph IV-A not yet notified
        next_capacity: "Ph IV-A adds KPS-3 Sec-B (AESL, Aug 2026). Ph V-B3 adds 8th ICT. VSC HVDC terminal (Dec 2029).",
        margin_note: "8 CTUIL bays all allocated. Residual 3,065 MW gap vs 12,000 MW nameplate reflects Sec-B bays not yet in register — not freely available headroom.",
      },
      {
        ps: "KPS-IV", color: "#f97316", status: "under-construction",
        phase_design_mw: 9000, // Phase IV-A: 6 ICTs × 1500 MVA = 9,000 MVA (CERC IV-A licence)
        phase_design_src: "CERC IV-A licence: KPS-3 Sec-B — 3×1500 MVA + Phase IV-E2: 2×1500 MVA at KPS-1 & KPS-2 augmentation (separate). KPS-IV itself: 6×1500 MVA in CTUIL Phase IV-B South Olpad scope",
        bays_ctuil: bayCount("KPS-IV"),
        bays_open: 0,
        next_capacity: "Phase IV-B South Olpad GIS (PGCIL, Sep 2026) is the associated ISTS output element.",
        margin_note: "8 CTUIL bays, all Adani Power Ltd (8,750 MW). Phase design = 9,000 MW → 250 MW unallocated. Station under construction (SCOD Aug 2026). No third-party developer access.",
      },
      {
        ps: "KPS-V", color: "#8b5cf6", status: "planned",
        phase_design_mw: 5250, // 3 allocated bays (3,750 MW) + ~1,500 MW indicative estimate for open applications
        phase_design_src: "CTUIL register: 3 bays (3,750 MW) + ~1,500 MW indicative open-application estimate (not from published source)",
        bays_ctuil: bayCount("KPS-V"),
        bays_open: 0,
        next_capacity: "Subject to Phase V formal tender. HVDC V-C feeds South Olpad, not KPS-V directly.",
        margin_note: "3 CTUIL bays all Adani Power (3,750 MW). ~1,500 MW indicative — station not formally tendered; estimate only.",
      },
    ];

    return rows.map(r => ({
      ...r,
      allocated_mw: alloc(r.ps),
      margin_mw: Math.max(0, r.phase_design_mw - alloc(r.ps)),
      fill_pct: r.phase_design_mw > 0
        ? Math.min(100, alloc(r.ps) / r.phase_design_mw * 100)
        : 100,
    }));
  };

  const MARGIN_DATA = buildMarginData();

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 border border-yellow-900 rounded-xl p-4">
        <div className="text-yellow-400 font-semibold text-sm mb-1">Reading Bay Margins</div>
        <div className="text-sm text-gray-400 leading-relaxed">
          "Margin" refers to transformation capacity at a KPS bus that is not yet allocated to a developer. 
          A developer seeking ISTS connectivity at Khavda needs: (a) an open or upcoming bus bay, (b) associated ISTS evacuation element in the same phase, and (c) LTOA/MTOA application to CTUIL. 
          KPS-I and KPS-II are <span className="text-red-400 font-medium">effectively full</span>. KPS-III Sec-B is <span className="text-yellow-400 font-medium">partially open post Phase IV-A commissioning (Aug 2026)</span>. KPS-IV/V are predominantly Adani Power.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {MARGIN_DATA.map(m => {
          const marginColor = m.margin_mw > 1000 ? "#22c55e" : m.margin_mw > 200 ? "#f59e0b" : "#ef4444";
          const isEstimate = m.ps === "KPS-V";
          return (
            <div key={m.ps} className="bg-gray-800 border border-gray-700 rounded-xl p-4"
              style={{ borderTopColor: m.color, borderTopWidth: 3 }}>
              <div className="font-bold text-white text-sm">{m.ps}</div>
              <div className="text-xs mt-0.5" style={{ color: m.color }}>{STATUS_LABEL[m.status] || m.status}</div>

              {/* Fill gauge — width from pre-computed fill_pct */}
              <div className="mt-3">
                <div className="text-xs text-gray-500 mb-1">
                  Allocation vs phase design
                </div>
                <div className="h-3 bg-gray-900 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${m.fill_pct}%`, background: m.color }} />
                </div>
                <div className="flex justify-between text-xs mt-0.5">
                  <span className="text-gray-500">{m.bays_ctuil} CTUIL bays</span>
                  <span className="text-gray-400 font-mono">{m.allocated_mw.toLocaleString()} MW</span>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-xs text-gray-500 mb-1">Available margin</div>
                <div className="text-xl font-black" style={{ color: marginColor }}>
                  {m.margin_mw > 0
                    ? `${isEstimate ? "~" : ""}${m.margin_mw.toLocaleString()} MW${isEstimate ? " *" : ""}`
                    : "None"}
                </div>
                {isEstimate && (
                  <div className="text-xs text-gray-600 mt-0.5">* indicative estimate only</div>
                )}
              </div>

              <div className="mt-2 text-xs text-gray-500 leading-relaxed">{m.margin_note}</div>

              <div className="mt-3 p-2 rounded-lg bg-gray-900 text-xs text-gray-600">
                <span className="text-gray-500 font-medium">Ceiling: </span>{m.phase_design_src}
              </div>

              <div className="mt-2 p-2 rounded-lg bg-gray-900 text-xs text-gray-500">
                <span className="text-gray-400 font-medium">Next capacity: </span>{m.next_capacity}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cross-all-stations bar */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
        <div className="text-sm font-semibold text-white mb-4">All-Stations Developer Concentration</div>
        <div className="space-y-2">
          {Object.entries(
            BAY_DATA.reduce((acc, b) => { acc[b.group] = (acc[b.group] || 0) + b.mw; return acc; }, {})
          ).sort((a, b) => b[1] - a[1]).map(([g, mw]) => {
            const total = BAY_DATA.reduce((s, b) => s + b.mw, 0);
            return (
              <div key={g} className="flex items-center gap-3">
                <div className="w-32 text-xs truncate" style={{ color: GROUP_COLORS[g] || "#9ca3af" }}>{g}</div>
                <div className="flex-1 h-4 bg-gray-900 rounded overflow-hidden">
                  <div className="h-full rounded" style={{ width: `${(mw / total) * 100}%`, background: GROUP_COLORS[g] || "#6b7280" }} />
                </div>
                <div className="w-20 text-right text-xs font-mono text-gray-400">{mw.toLocaleString()} MW</div>
                <div className="w-10 text-right text-xs text-gray-600">{((mw / total) * 100).toFixed(1)}%</div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 text-xs text-gray-600">Source: CTUIL Bay Allocation Register, May 2025. Total: {BAY_DATA.reduce((s,b) => s+b.mw,0).toLocaleString()} MW across all stations.</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SECTION 4: HVDC DEEP DIVE
// ══════════════════════════════════════════════════════════════
function HVDCSection() {
  const [selHVDC, setSelHVDC] = useState("va");

  const proj = HVDC_PROJECTS.find(h => h.id === selHVDC);

  return (
    <div className="space-y-5">
      {/* HVDC overview banner */}
      <div className="bg-gray-800 border border-purple-700 rounded-xl p-4">
        <div className="text-purple-400 font-bold text-base mb-2">Khavda HVDC Transmission — India's First HVDC Projects Under TBCB</div>
        <div className="text-sm text-gray-300 leading-relaxed">
          Khavda Phase V introduced HVDC technology to India's TBCB transmission bidding for the first time. 
          Two separate HVDC systems are under development: a <span className="text-purple-300 font-medium">±800kV LCC link</span> (6,000 MW, KPS2→Nagpur, PGCIL) and a <span className="text-pink-300 font-medium">±500kV VSC link</span> (2,500 MW, KPS3→South Olpad, AESL). 
          Combined they will add <span className="text-white font-bold">8,500 MW</span> of direct-current transmission capacity from Khavda — complementing the existing HVAC network.
        </div>
        <div className="flex gap-3 mt-3 flex-wrap text-xs">
          {[
            { l:"Total HVDC capacity", v:"8,500 MW" },
            { l:"Combined project cost", v:"~₹37,000 cr" },
            { l:"V-A tariff (record)", v:"₹40,829 M/yr" },
            { l:"Full HVDC commissioning", v:"Dec 2029" },
          ].map((s, i) => (
            <div key={i} className="bg-gray-900 rounded-lg px-3 py-2">
              <div className="text-gray-500">{s.l}</div>
              <div className="text-white font-bold">{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Project selector */}
      <div className="flex gap-3">
        {HVDC_PROJECTS.map(h => (
          <button key={h.id}
            onClick={() => setSelHVDC(h.id)}
            className="flex-1 text-left rounded-xl border p-4 transition-all"
            style={selHVDC === h.id
              ? { borderColor: h.color, background: h.color + "15" }
              : { borderColor: "#374151", background: "#111827" }}>
            <div className="text-xs font-bold mb-1" style={{ color: h.color }}>{h.label}</div>
            <div className="text-sm font-bold text-white leading-tight">{h.name}</div>
            <div className="text-xs text-gray-500 mt-1">{h.capacity_mw.toLocaleString()} MW · {h.developer}</div>
            <div className="mt-2"><Badge status={h.status} /></div>
          </button>
        ))}
      </div>

      {proj && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: key facts */}
          <div className="space-y-3">
            <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: proj.color + "40", background: proj.color + "07" }}>
              <div className="text-lg font-black" style={{ color: proj.color }}>{proj.label}</div>
              <div className="text-3xl font-black text-white">{(proj.capacity_mw / 1000).toFixed(0)} GW</div>

              {[
                { k: "Technology", v: proj.technology },
                { k: "Route", v: proj.route },
                { k: "Line length", v: `${proj.length_km} km / ${proj.ckm} ckm` },
                { k: "Developer", v: proj.developer },
                { k: "SPV", v: proj.spv },
                { k: "SPV Acquired", v: proj.awarded },
                { k: "Project Cost", v: `₹${proj.cost_cr.toLocaleString()} cr` },
                { k: "Annual Tariff", v: `₹${proj.tariff_m_yr.toLocaleString()} M/yr` },
              ].map(({ k, v }) => (
                <div key={k} className="flex gap-2 text-sm">
                  <span className="text-gray-500 w-28 shrink-0 text-xs">{k}</span>
                  <span className="text-gray-200 text-xs">{v}</span>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Commissioning Schedule</div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: proj.color }} />
                  <div className="text-xs text-gray-400">SPV Awarded</div>
                  <div className="ml-auto text-xs font-bold text-white">{proj.awarded}</div>
                </div>
                <div className="ml-1 border-l border-gray-700 pl-4 py-1">
                  <div className="text-xs text-gray-600">Engineering, survey, land acquisition, EPC packages</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="text-xs text-gray-400">Pole 1 / Initial commissioning</div>
                  <div className="ml-auto text-xs font-bold text-yellow-400">{proj.pole1_scod}</div>
                </div>
                {proj.pole2_scod !== proj.pole1_scod && (
                  <>
                    <div className="ml-1 border-l border-gray-700 pl-4 py-1">
                      <div className="text-xs text-gray-600">Bipole testing & second pole construction</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <div className="text-xs text-gray-400">Full commissioning (Pole 2)</div>
                      <div className="ml-auto text-xs font-bold text-green-400">{proj.pole2_scod}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: packages + constraints + significance */}
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <div className="text-sm font-semibold text-white mb-3">EPC Packages Awarded</div>
              <div className="space-y-3">
                {proj.packages.map((pkg, i) => (
                  <div key={i} className="rounded-lg p-3 bg-gray-900 border border-gray-700">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-medium text-sm text-white">{pkg.name}</div>
                      <div className="text-xs font-bold text-gray-300 shrink-0">{pkg.value}</div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{pkg.contractor}</div>
                    <div className="text-xs text-gray-500 mt-1 leading-relaxed">{pkg.note}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <div className="text-sm font-semibold text-white mb-3">Key Constraints & Risks</div>
              <div className="space-y-2">
                {proj.constraints.map((c, i) => (
                  <div key={i} className="flex gap-2 text-xs">
                    <span className="text-yellow-400 shrink-0">⚠</span>
                    <span className="text-gray-400 leading-relaxed">{c}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border p-4" style={{ borderColor: proj.color + "40", background: proj.color + "06" }}>
              <div className="text-sm font-semibold mb-2" style={{ color: proj.color }}>Strategic Significance</div>
              <div className="text-sm text-gray-300 leading-relaxed">{proj.significance}</div>
            </div>

            {/* Comparison table */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">HVDC Link Comparison</div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-700">
                      {["", "V-A (±800kV LCC)", "V-C (±500kV VSC)"].map(h => (
                        <th key={h} className="px-2 py-2 text-left text-gray-400 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Developer", "PGCIL", "AESL"],
                      ["Technology", "LCC (thyristor)", "VSC (IGBT)"],
                      ["Capacity", "6,000 MW", "2,500 MW"],
                      ["Route length", "1,200 km", "600 km"],
                      ["Route", "KPS-2 → Nagpur (MH)", "KPS-3 → South Olpad (GJ)"],
                      ["Cost", "₹24,819 cr", "₹12,000 cr (est.)"],
                      ["Tariff/yr", "₹40,829 M", "~₹23,000 M"],
                      ["Awarded", "Nov 2024", "Dec 2025"],
                      ["Full commissioning", "May 2029", "Dec 2029"],
                      ["EPC terminals", "BHEL + Hitachi Energy", "GE Vernova T&D India"],
                    ].map(([l, a, b]) => (
                      <tr key={l} className="border-t border-gray-800">
                        <td className="px-2 py-1.5 text-gray-500">{l}</td>
                        <td className="px-2 py-1.5 text-purple-300">{a}</td>
                        <td className="px-2 py-1.5 text-pink-300">{b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// GRID ARCHITECTURE DIAGRAM
// ══════════════════════════════════════════════════════════════
function GridArchitecture() {
  // Per-PS allocated MW from BAY_DATA
  const PS_ORDER = ["KPS-I","KPS-II","KPS-III","KPS-IV","KPS-V"];
  const PS_C = { "KPS-I":"#22c55e","KPS-II":"#3b82f6","KPS-III":"#f59e0b","KPS-IV":"#f97316","KPS-V":"#8b5cf6" };
  const PS_TSO = { "KPS-I":"AESL","KPS-II":"PGCIL","KPS-III":"PGCIL","KPS-IV":"AESL","KPS-V":"Planning" };
  const psMW = PS_ORDER.map(ps => BAY_DATA.filter(b => b.ps === ps).reduce((s, b) => s + b.mw, 0));
  const totalMW = psMW.reduce((s, v) => s + v, 0);

  const W = 740, H = 500;

  // Row y positions
  const ROW = { gen: 26, vInj: 104, ps: 186, backbone: 272, export: 354, hvdc: 426 };
  const ROW_H = { gen: 52, vInj: 52, ps: 68, backbone: 52, export: 68, hvdc: 50 };

  // Generation tier boxes
  const genBoxes = [
    { x: 28,  w: 148, l: "Wind Generation",  s: "Adani Wind · Inox · Continuum", c: "#3b82f6" },
    { x: 188, w: 148, l: "Solar Generation", s: "NTPC · GSECL · GIPCL",  c: "#10b981" },
    { x: 348, w: 148, l: "Hybrid RE",        s: "Sprng · ACME · Azure · ReNew",   c: "#8b5cf6" },
    { x: 508, w: 136, l: "BESS Storage",     s: "H.G. Banaskantha — 218 MW",      c: "#a855f7" },
    { x: 656, w: 56,  l: "",                 s: "",                                c: "#374151" }, // spacer
  ];

  const vInjBoxes = [
    { x: 28,  w: 208, l: "220 kV Injection", s: "Generator tie-lines at 220kV", c: "#06b6d4" },
    { x: 248, w: 208, l: "400 kV Injection", s: `${(psMW.reduce((s,v)=>s+v,0)/1000).toFixed(1)} GW ISTS bays allocated`, c: "#f97316" },
    { x: 468, w: 192, l: "BESS @ 220 kV",   s: "KPS-V Bay 5 — 218 MW", c: "#a855f7" },
  ];

  // PS box x positions — 5 evenly spaced
  const psBoxW = 120, psBoxGap = (W - 28*2 - psBoxW*5) / 4;
  const psX = PS_ORDER.map((_, i) => 28 + i * (psBoxW + psBoxGap));

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
      <div className="flex items-baseline gap-3 mb-4">
        <div className="text-sm font-bold text-white">Grid Architecture</div>
        <div className="text-xs text-gray-500">Generation → Voltage Injection → Pooling Stations → 765 kV ISTS → National Grid & HVDC corridors</div>
      </div>

      <div className="overflow-x-auto">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="w-full">
          <rect width={W} height={H} fill="#0f172a" rx="8" />

          {/* ── ROW LABELS ── */}
          {[
            { y: ROW.gen,      l: "GENERATION" },
            { y: ROW.vInj,     l: "VOLTAGE INJECTION" },
            { y: ROW.ps,       l: "POOLING STATIONS" },
            { y: ROW.backbone, l: "765 kV ISTS BACKBONE" },
            { y: ROW.export,   l: "LOAD & EXPORT" },
            { y: ROW.hvdc,     l: "HVDC CORRIDORS" },
          ].map(r => (
            <text key={r.l} x={6} y={r.y + 8} fill="#1e3a5f" fontSize="6" fontWeight="800" letterSpacing="1.2"
              transform={`rotate(-90, 6, ${r.y + ROW_H[Object.keys(ROW)[Object.values(ROW).indexOf(r.y)]] / 2 + r.y})`}
            >{r.l}</text>
          ))}

          {/* ── GENERATION ROW ── */}
          {genBoxes.filter(b => b.l).map(b => (
            <g key={b.l}>
              <rect x={b.x} y={ROW.gen} width={b.w} height={ROW_H.gen} rx="6"
                fill={b.c} fillOpacity="0.12" stroke={b.c} strokeWidth="1" strokeOpacity="0.6" />
              <text x={b.x + b.w/2} y={ROW.gen + 18} fill="white" fontSize="9" fontWeight="700" textAnchor="middle">{b.l}</text>
              <text x={b.x + b.w/2} y={ROW.gen + 34} fill="#9ca3af" fontSize="7.5" textAnchor="middle">{b.s}</text>
            </g>
          ))}

          {/* Gen → vInj connectors */}
          {[102, 262, 422, 576].map((x, i) => (
            <line key={i} x1={x} y1={ROW.gen + ROW_H.gen} x2={x} y2={ROW.vInj}
              stroke="#1e3a5f" strokeWidth="1" strokeDasharray="3,2" />
          ))}

          {/* ── VOLTAGE INJECTION ROW ── */}
          {vInjBoxes.map(b => (
            <g key={b.l}>
              <rect x={b.x} y={ROW.vInj} width={b.w} height={ROW_H.vInj} rx="6"
                fill={b.c} fillOpacity="0.12" stroke={b.c} strokeWidth="1" strokeOpacity="0.6" />
              <text x={b.x + b.w/2} y={ROW.vInj + 18} fill="white" fontSize="9" fontWeight="700" textAnchor="middle">{b.l}</text>
              <text x={b.x + b.w/2} y={ROW.vInj + 34} fill="#9ca3af" fontSize="7.5" textAnchor="middle">{b.s}</text>
            </g>
          ))}

          {/* vInj → PS connectors */}
          {psX.map((x, i) => (
            <line key={i} x1={x + psBoxW/2} y1={ROW.vInj + ROW_H.vInj} x2={x + psBoxW/2} y2={ROW.ps}
              stroke={PS_C[PS_ORDER[i]]} strokeWidth="1" strokeOpacity="0.35" strokeDasharray="3,2" />
          ))}

          {/* ── POOLING STATIONS ROW ── */}
          {PS_ORDER.map((ps, i) => {
            const x = psX[i], c = PS_C[ps], mw = psMW[i];
            const isPlanned = ps === "KPS-V" || ps === "KPS-IV";
            return (
              <g key={ps}>
                <rect x={x} y={ROW.ps} width={psBoxW} height={ROW_H.ps} rx="6"
                  fill={c} fillOpacity="0.18" stroke={c} strokeWidth="1.5"
                  strokeDasharray={isPlanned ? "5,3" : "none"} strokeOpacity={isPlanned ? 0.5 : 0.9} />
                <text x={x + psBoxW/2} y={ROW.ps + 16} fill="white" fontSize="9.5" fontWeight="700" textAnchor="middle">{ps}</text>
                <text x={x + psBoxW/2} y={ROW.ps + 31} fill={c} fontSize="11" fontWeight="900" textAnchor="middle">
                  {(mw/1000).toFixed(1)} GW
                </text>
                <text x={x + psBoxW/2} y={ROW.ps + 45} fill="#6b7280" fontSize="7" textAnchor="middle">{PS_TSO[ps]} TSO</text>
                {isPlanned && (
                  <text x={x + psBoxW/2} y={ROW.ps + 57} fill={c} fontSize="6.5" textAnchor="middle" opacity="0.7">
                    {ps === "KPS-IV" ? "SCOD Aug 2026" : "Planning"}
                  </text>
                )}
              </g>
            );
          })}

          {/* PS → backbone connectors */}
          {PS_ORDER.map((ps, i) => (
            <line key={ps} x1={psX[i] + psBoxW/2} y1={ROW.ps + ROW_H.ps}
              x2={psX[i] + psBoxW/2} y2={ROW.backbone}
              stroke={PS_C[ps]} strokeWidth="1.5" strokeOpacity="0.55" />
          ))}

          {/* ── 765 kV BACKBONE ── */}
          <rect x={28} y={ROW.backbone} width={W - 56} height={ROW_H.backbone} rx="6"
            fill="#fbbf24" fillOpacity="0.08" stroke="#fbbf24" strokeWidth="1.5" strokeOpacity="0.7" />
          <text x={W/2} y={ROW.backbone + 20} fill="white" fontSize="10" fontWeight="700" textAnchor="middle">
            765 kV ISTS Backbone — Western Region
          </text>
          <text x={W/2} y={ROW.backbone + 35} fill="#9ca3af" fontSize="7.5" textAnchor="middle">
            KPS-1/2 (AESL) → Bhuj → Lakadia → Vadodara · KPS-3 (PGCIL) → Banaskantha → Ahmedabad → Navsari (Jan 2026)
          </text>
          <text x={W/2} y={ROW.backbone + 48} fill="#6b7280" fontSize="7" textAnchor="middle">
            Phase IV: KPS-3 765kV Sec-B + South Olpad GIS → Boisar-II (SCOD Aug 2026)
          </text>

          {/* Backbone → Export connectors */}
          <line x1={200} y1={ROW.backbone + ROW_H.backbone} x2={200} y2={ROW.export} stroke="#6b7280" strokeWidth="1" strokeDasharray="3,2" />
          <line x1={530} y1={ROW.backbone + ROW_H.backbone} x2={530} y2={ROW.export} stroke="#f97316" strokeWidth="1.5" strokeDasharray="4,2" />
          <line x1={psX[1] + psBoxW/2} y1={ROW.backbone + ROW_H.backbone} x2={psX[1] + psBoxW/2} y2={ROW.hvdc} stroke="#a78bfa" strokeWidth="2" strokeDasharray="6,3" />
          <line x1={psX[2] + psBoxW/2} y1={ROW.backbone + ROW_H.backbone} x2={psX[2] + psBoxW/2} y2={ROW.hvdc} stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="6,3" />

          {/* ── EXPORT / LOAD ROW ── */}
          <rect x={28} y={ROW.export} width={320} height={ROW_H.export} rx="6"
            fill="#6b7280" fillOpacity="0.1" stroke="#6b7280" strokeWidth="1" />
          <text x={188} y={ROW.export + 18} fill="white" fontSize="9.5" fontWeight="700" textAnchor="middle">National Grid / Load Centres</text>
          <text x={188} y={ROW.export + 33} fill="#9ca3af" fontSize="7.5" textAnchor="middle">All-India via RLDC/WRLDC dispatch</text>
          <text x={188} y={ROW.export + 48} fill="#6b7280" fontSize="7" textAnchor="middle">Gujarat · Rajasthan · Delhi · National pool</text>

          <rect x={370} y={ROW.export} width={342} height={ROW_H.export} rx="6"
            fill="#f97316" fillOpacity="0.1" stroke="#f97316" strokeWidth="1.5" />
          <text x={541} y={ROW.export + 18} fill="#f97316" fontSize="9.5" fontWeight="700" textAnchor="middle">Maharashtra Offtake Corridor</text>
          <text x={541} y={ROW.export + 33} fill="#e5e7eb" fontSize="7.5" textAnchor="middle">MSEDCL 5,000 MW PPA @ ₹2.70/kWh · 25-yr · Adani Green</text>
          <text x={541} y={ROW.export + 48} fill="#9ca3af" fontSize="7" textAnchor="middle">Navsari → Padghe → Mumbai (400kV) · Pune (400kV)</text>

          {/* ── HVDC ROW ── */}
          <rect x={28} y={ROW.hvdc} width={330} height={ROW_H.hvdc} rx="6"
            fill="#a78bfa" fillOpacity="0.1" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="6,3" />
          <text x={193} y={ROW.hvdc + 16} fill="#a78bfa" fontSize="8.5" fontWeight="700" textAnchor="middle">
            V-A: ±800kV HVDC LCC · KPS-2 → Nagpur · 6,000 MW
          </text>
          <text x={193} y={ROW.hvdc + 29} fill="#c4b5fd" fontSize="7.5" textAnchor="middle">PGCIL · ₹24,819 cr · Pole 1: Nov 2028 · Pole 2: May 2029</text>
          <text x={193} y={ROW.hvdc + 41} fill="#6b7280" fontSize="7" textAnchor="middle">BHEL + Hitachi Energy terminals · KEC + Jyoti Structures lines</text>

          <rect x={378} y={ROW.hvdc} width={334} height={ROW_H.hvdc} rx="6"
            fill="#a78bfa" fillOpacity="0.07" stroke="#a78bfa" strokeWidth="1" strokeDasharray="6,3" />
          <text x={545} y={ROW.hvdc + 16} fill="#a78bfa" fontSize="8.5" fontWeight="700" textAnchor="middle">
            V-C: ±500kV HVDC VSC · KPS-3 → South Olpad · 2,500 MW
          </text>
          <text x={545} y={ROW.hvdc + 29} fill="#c4b5fd" fontSize="7.5" textAnchor="middle">AESL · ₹12,000 cr est. · GE Vernova terminals · SCOD Dec 2029</text>
          <text x={545} y={ROW.hvdc + 41} fill="#6b7280" fontSize="7" textAnchor="middle">First VSC HVDC under TBCB · 600 km within Gujarat</text>

          {/* ── TOTAL FOOTER ── */}
          <text x={W/2} y={H - 6} fill="#374151" fontSize="8" fontWeight="600" textAnchor="middle">
            CTUIL Bay Allocation Register (May 2025): {totalMW.toLocaleString()} MW allocated · 30 GW target by 2029
          </text>
        </svg>
      </div>

      {/* MH PPA detail strip */}
      <div className="mt-3 grid grid-cols-4 gap-2 text-center">
        {[
          { l: "MH PPA Quantum", v: "5,000 MW solar" },
          { l: "Tariff", v: "₹2.70/kWh · 25-yr" },
          { l: "Route", v: "Navsari → Padghe → MH" },
          { l: "HVDC Capacity", v: "8,500 MW (V-A + V-C)" },
        ].map(x => (
          <div key={x.l} className="bg-gray-800 rounded-lg px-3 py-2">
            <div className="text-gray-500 text-xs mb-0.5">{x.l}</div>
            <div className="text-gray-200 text-xs font-semibold">{x.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}



// Schematic node positions — hand-placed, zero overlap
const SCHEM = {
  kps1:[90,230], kps2:[90,300], kps3:[90,148], kps4:[90,72], kps5:[90,375],
  bhuj:[240,308], bhuj2:[240,222],
  lak:[388,268], banas:[318,105],
  ahm:[510,178], vad:[510,318],
  jkh:[330,400],
  nav:[638,242], padghe:[748,330], mumbai:[748,400], pune:[748,455],
  nagpur:[748,170],
};

const MAP_NODES = {
  kps1:  {id:"kps1",  label:"KPS-1", type:"kps", voltage:"765/400kV", tso:"AESL",    status:"commissioned",         phase:"I",   color:"#22c55e"},
  kps2:  {id:"kps2",  label:"KPS-2", type:"kps", voltage:"765/400kV", tso:"PGCIL",   status:"commissioned",         phase:"I–III", color:"#3b82f6"},
  kps3:  {id:"kps3",  label:"KPS-3", type:"kps", voltage:"765/400kV", tso:"PGCIL",   status:"commissioned Aug 2025", phase:"I",   color:"#f59e0b"},
  kps4:  {id:"kps4",  label:"KPS-4", type:"kps", voltage:"765/400kV", tso:"AESL",    status:"planned — SCOD Aug 2026",phase:"IV", color:"#f97316"},
  kps5:  {id:"kps5",  label:"KPS-5", type:"kps", voltage:"765/400kV", tso:"Planning", status:"planned",              phase:"V",  color:"#8b5cf6"},
  bhuj:  {id:"bhuj",  label:"Bhuj PS",type:"hub",voltage:"765/400kV", tso:"AESL/PGCIL",status:"commissioned",       phase:"I",   color:"#10b981"},
  bhuj2: {id:"bhuj2", label:"Bhuj-II",type:"hub",voltage:"765/400kV", tso:"PGCIL",   status:"commissioned",         phase:"I",   color:"#10b981"},
  lak:   {id:"lak",   label:"Lakadia",type:"hub",voltage:"765/400kV", tso:"AESL",    status:"commissioned",         phase:"II",  color:"#10b981"},
  banas: {id:"banas", label:"Banaskantha",type:"hub",voltage:"400kV GIS",tso:"PGCIL",status:"commissioned",         phase:"III", color:"#10b981"},
  ahm:   {id:"ahm",   label:"Ahmedabad",type:"hub",voltage:"765/400kV",tso:"PGCIL",  status:"commissioned Mar 2025", phase:"II", color:"#10b981"},
  vad:   {id:"vad",   label:"Vadodara", type:"hub",voltage:"765/400kV",tso:"PGCIL",  status:"commissioned",         phase:"I",   color:"#10b981"},
  nav:   {id:"nav",   label:"Navsari",  type:"hub",voltage:"765/400kV",tso:"PGCIL",  status:"commissioned Jan 2026", phase:"II", color:"#10b981"},
  jkh:   {id:"jkh",   label:"Jam Khambhaliya",type:"hub",voltage:"400kV",tso:"PGCIL",status:"commissioned",        phase:"—",   color:"#10b981"},
  padghe:{id:"padghe",label:"Padghe",  type:"load",voltage:"765/400kV",tso:"MSETCL", status:"operational",          phase:"II",  color:"#ef4444"},
  mumbai:{id:"mumbai",label:"Mumbai",  type:"load",voltage:"400kV",    tso:"MSETCL", status:"operational",          phase:"—",   color:"#ef4444"},
  pune:  {id:"pune",  label:"Pune",    type:"load",voltage:"400kV",    tso:"MSETCL", status:"operational",          phase:"—",   color:"#ef4444"},
  nagpur:{id:"nagpur",label:"Nagpur",  type:"load",voltage:"765/400kV",tso:"PGCIL",  status:"HVDC terminal — Nov 2028",phase:"V",color:"#a78bfa"},
};

const MAP_LINES = [
  {id:"kps1-kps2",   from:"kps1",  to:"kps2",   kv:765, ckm:5,   tso:"AESL",        status:"commissioned", phase:"Phase I",       label:"KPS-1/2 765kV D/C"},
  {id:"kps2-bhuj",   from:"kps2",  to:"bhuj",   kv:765, ckm:217, tso:"AESL",        status:"commissioned", phase:"Phase I",       label:"KPS-2 → Bhuj 765kV D/C 217 ckm"},
  {id:"kps1-bhuj2",  from:"kps1",  to:"bhuj2",  kv:765, ckm:30,  tso:"AESL",        status:"commissioned", phase:"Phase I",       label:"KPS-1 → Bhuj-II 765kV LILO 30 ckm"},
  {id:"lak-bhuj",    from:"lak",   to:"bhuj",   kv:765, ckm:85,  tso:"AESL",        status:"commissioned", phase:"Phase I",       label:"Lakadia–Bhuj 765kV D/C 85 ckm"},
  {id:"lak-vad",     from:"lak",   to:"vad",    kv:765, ckm:180, tso:"PGCIL",       status:"commissioned", phase:"Phase I",       label:"Lakadia–Vadodara 765kV D/C 180 ckm"},
  {id:"kps2-lak",    from:"kps2",  to:"lak",    kv:765, ckm:355, tso:"AESL",        status:"commissioned", phase:"Phase II-A",    label:"KPS-2 → Lakadia 765kV D/C 355 ckm"},
  {id:"kps3-banas",  from:"kps3",  to:"banas",  kv:400, ckm:30,  tso:"PGCIL",       status:"commissioned", phase:"Phase III",     label:"KPS-3 → Banaskantha 400kV 30 ckm"},
  {id:"banas-ahm",   from:"banas", to:"ahm",    kv:765, ckm:270, tso:"PGCIL",       status:"commissioned", phase:"Phase III",     label:"Banaskantha → Ahmedabad 765kV D/C 270 ckm"},
  {id:"ahm-nav",     from:"ahm",   to:"nav",    kv:765, ckm:590, tso:"PGCIL",       status:"commissioned", phase:"Phase II-C",    label:"Ahmedabad → Navsari 765kV D/C 590 ckm"},
  {id:"ahm-vad",     from:"ahm",   to:"vad",    kv:765, ckm:100, tso:"PGCIL",       status:"commissioned", phase:"Existing",      label:"Ahmedabad–Vadodara 765kV"},
  {id:"nav-padghe",  from:"nav",   to:"padghe", kv:765, ckm:145, tso:"PGCIL",       status:"commissioned", phase:"Phase II-C",    label:"Navsari → Padghe 765kV D/C 145 ckm"},
  {id:"padghe-mum",  from:"padghe",to:"mumbai", kv:400, ckm:70,  tso:"MSETCL",      status:"operational",  phase:"Existing",      label:"Padghe → Mumbai 400kV 70 ckm"},
  {id:"padghe-pune", from:"padghe",to:"pune",   kv:400, ckm:90,  tso:"MSETCL",      status:"operational",  phase:"Existing",      label:"Padghe → Pune 400kV 90 ckm"},
  {id:"bhuj-jkh",    from:"bhuj",  to:"jkh",    kv:765, ckm:80,  tso:"PGCIL",       status:"commissioned", phase:"Existing",      label:"Bhuj → Jam Khambhaliya 765kV 80 ckm"},
  {id:"jkh-lak",     from:"jkh",   to:"lak",    kv:400, ckm:95,  tso:"PGCIL",       status:"commissioned", phase:"Existing",      label:"Jam Khambhaliya → Lakadia 400kV 95 ckm"},
  {id:"kps4-banas",  from:"kps4",  to:"banas",  kv:400, ckm:10,  tso:"PGCIL",       status:"planned",      phase:"Phase IV",      label:"KPS-4 → Banaskantha 400kV (planned)"},
  {id:"kps5-kps4",   from:"kps5",  to:"kps4",   kv:400, ckm:8,   tso:"PGCIL",       status:"planned",      phase:"Phase IV",      label:"KPS-5 → KPS-4 400kV (planned)"},
  // HVDC lines (special)
  {id:"kps2-nagpur-hvdc", from:"kps2", to:"nagpur", kv:800, ckm:2412, tso:"PGCIL", status:"hvdc",         phase:"Phase V-A",     label:"KPS-2 → Nagpur ±800kV HVDC LCC 1,200 km — Nov 2028"},
];

const LINE_COLOR = { 765:"#fbbf24", 400:"#f97316", 220:"#06b6d4", 800:"#a78bfa" };
const LINE_DASH  = { "commissioned":"none", "planned":"8,5", "operational":"none", "hvdc":"12,6" };
const LINE_OPACITY = { "commissioned":1, "planned":0.4, "operational":0.7, "hvdc":0.85 };

// SIM milestones
const SIM_MILESTONES = [
  { idx:0, label:"Pre-2025",  gw:0,  activeLines:[], note:"No ISTS evacuation online. Planning phase only." },
  { idx:1, label:"Mar 2025",  gw:8,  activeLines:["kps1-kps2","kps2-bhuj","kps1-bhuj2","lak-bhuj","lak-vad","kps2-lak","bhuj-jkh","jkh-lak"], note:"Phases I & II-A commissioned. Western corridor via Bhuj → Lakadia → Vadodara active." },
  { idx:2, label:"Aug 2025",  gw:14, activeLines:["kps1-kps2","kps2-bhuj","kps1-bhuj2","lak-bhuj","lak-vad","kps2-lak","bhuj-jkh","jkh-lak","kps3-banas","banas-ahm","ahm-vad"], note:"KPS-3 commissioned (Aug 2025). Banaskantha–Ahmedabad corridor live (Jul 2025). Northern Gujarat backbone active." },
  { idx:3, label:"Jan 2026",  gw:18, activeLines:["kps1-kps2","kps2-bhuj","kps1-bhuj2","lak-bhuj","lak-vad","kps2-lak","bhuj-jkh","jkh-lak","kps3-banas","banas-ahm","ahm-vad","ahm-nav","nav-padghe","padghe-mum","padghe-pune"], note:"Ahmedabad → Navsari 765kV D/C commissioned Jan 2026. Full MH export corridor live — Khavda to Mumbai/Pune." },
  { idx:4, label:"Aug 2026",  gw:22, activeLines:["kps1-kps2","kps2-bhuj","kps1-bhuj2","lak-bhuj","lak-vad","kps2-lak","bhuj-jkh","jkh-lak","kps3-banas","banas-ahm","ahm-vad","ahm-nav","nav-padghe","padghe-mum","padghe-pune","kps4-banas","kps5-kps4"], note:"Phase IV SCOD targets. KPS-4/5 and Banaskantha expansion active. Eastern cluster opens." },
  { idx:5, label:"Nov 2028",  gw:26, activeLines:["kps1-kps2","kps2-bhuj","kps1-bhuj2","lak-bhuj","lak-vad","kps2-lak","bhuj-jkh","jkh-lak","kps3-banas","banas-ahm","ahm-vad","ahm-nav","nav-padghe","padghe-mum","padghe-pune","kps4-banas","kps5-kps4","kps2-nagpur-hvdc"], note:"HVDC V-A Pole 1 online. KPS-2 → Nagpur ±800kV LCC corridor carries 3,000 MW directly to Central India." },
  { idx:6, label:"Full 30 GW",gw:30, activeLines:["kps1-kps2","kps2-bhuj","kps1-bhuj2","lak-bhuj","lak-vad","kps2-lak","bhuj-jkh","jkh-lak","kps3-banas","banas-ahm","ahm-vad","ahm-nav","nav-padghe","padghe-mum","padghe-pune","kps4-banas","kps5-kps4","kps2-nagpur-hvdc"], note:"Full 30 GW commissioned. HVDC V-A Pole 2 (May 2029) + HVDC V-C (Dec 2029) add bulk DC capacity." },
];

const SW = 820, SH = 500;

function NetworkMapFlow() {
  const [milestoneIdx, setMilestoneIdx] = useState(3);
  const [hovLine, setHovLine] = useState(null);
  const [hovNode, setHovNode] = useState(null);
  const [selNode, setSelNode] = useState(null);
  const [tick, setTick] = useState(0);
  const [playing, setPlaying] = useState(true);

  const milestone = SIM_MILESTONES[milestoneIdx];
  const activeSet = new Set(milestone.activeLines);

  useEffect(() => {
    if (!playing) return;
    let fid, last = 0;
    const loop = ts => {
      if (ts - last > 55) { setTick(t => (t + 1) % 800); last = ts; }
      fid = requestAnimationFrame(loop);
    };
    fid = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(fid);
  }, [playing]);

  // Animated dash offset — faster for more loaded lines
  function flowAnim(lineId, i) {
    const speed = lineId.includes("hvdc") ? 3.5 : lineId.includes("kps") ? 2.5 : 1.8;
    const offset = -((tick * speed + i * 22) % 44);
    return { strokeDasharray: "22 22", strokeDashoffset: offset };
  }

  const routeLines = (from, to) => {
    const [x1, y1] = SCHEM[from] || [0, 0];
    const [x2, y2] = SCHEM[to] || [0, 0];
    const mx = (x1 + x2) / 2;
    return `M${x1},${y1}L${mx},${y1}L${mx},${y2}L${x2},${y2}`;
  };

  const selNodeData = selNode ? MAP_NODES[selNode] : null;

  return (
    <div className="space-y-4">
      {/* Timeline scrubber */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              {SIM_MILESTONES.map((m, i) => (
                <button key={i} onClick={() => setMilestoneIdx(i)}
                  className="text-center transition-colors px-1"
                  style={{ color: i === milestoneIdx ? "#fbbf24" : "#4b5563" }}>
                  {m.label}
                </button>
              ))}
            </div>
            <input type="range" min={0} max={SIM_MILESTONES.length - 1} step={1} value={milestoneIdx}
              onChange={e => setMilestoneIdx(+e.target.value)}
              className="w-full accent-yellow-400" />
          </div>
          <button onClick={() => setPlaying(p => !p)}
            className={`px-3 py-1.5 rounded text-xs font-bold border transition-colors shrink-0 ${playing ? "bg-yellow-500 border-yellow-400 text-gray-900" : "bg-gray-700 border-gray-600 text-gray-300"}`}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-yellow-400">{milestone.gw}</span>
            <span className="text-sm text-gray-400">GW dispatching</span>
          </div>
          <div className="text-sm text-gray-400 leading-relaxed">{milestone.note}</div>
          <div className="ml-auto flex gap-2 shrink-0">
            <button onClick={() => setMilestoneIdx(i => Math.max(0, i - 1))} disabled={milestoneIdx === 0}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-30 text-white px-2.5 py-1 rounded text-xs">Prev</button>
            <button onClick={() => setMilestoneIdx(i => Math.min(SIM_MILESTONES.length - 1, i + 1))} disabled={milestoneIdx === SIM_MILESTONES.length - 1}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-30 text-white px-2.5 py-1 rounded text-xs">Next</button>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {/* SVG schematic */}
        <div className="flex-1 rounded-xl overflow-hidden border border-gray-700 bg-gray-950 relative" style={{ height: SH }}>
          <svg width="100%" height="100%" viewBox={`0 0 ${SW} ${SH}`} style={{ display: "block" }}>
            <rect width={SW} height={SH} fill="#07111f" />

            {/* Zone bands */}
            {[
              { x: 30,  w: 115, label: "KPS Cluster",     sub: "5 Pooling Stations", c: "#3b82f6" },
              { x: 153, w: 245, label: "Gujarat Backbone", sub: "765/400 kV HVAC",   c: "#fbbf24" },
              { x: 406, w: 220, label: "Gujarat Grid",     sub: "Ahm · Vadodara",     c: "#fbbf24" },
              { x: 634, w: 178, label: "Load / HVDC",      sub: "MH · Nagpur · Grid", c: "#f97316" },
            ].map((z, i) => (
              <g key={i}>
                <rect x={z.x} y={22} width={z.w} height={SH - 44} rx="6"
                  fill={z.c} fillOpacity="0.025" stroke={z.c} strokeWidth="0.5" strokeOpacity="0.2" />
                <text x={z.x + z.w / 2} y={39} fill={z.c} fontSize="8" fontWeight="700" textAnchor="middle" opacity="0.55">{z.label}</text>
                <text x={z.x + z.w / 2} y={50} fill="#1e293b" fontSize="6.5" textAnchor="middle">{z.sub}</text>
              </g>
            ))}

            {/* Base (dim) lines */}
            {MAP_LINES.map(line => {
              if (!SCHEM[line.from] || !SCHEM[line.to]) return null;
              return (
                <path key={line.id + "_base"} d={routeLines(line.from, line.to)}
                  fill="none" stroke="#111827" strokeWidth={line.kv === 800 ? 3 : line.kv === 765 ? 2 : 1.5}
                  strokeLinejoin="round" />
              );
            })}

            {/* Active animated lines */}
            {MAP_LINES.map((line, li) => {
              if (!SCHEM[line.from] || !SCHEM[line.to]) return null;
              const isActive = activeSet.has(line.id);
              const isHov = hovLine === line.id;
              const color = LINE_COLOR[line.kv] || "#6b7280";
              const isHVDC = line.kv === 800;
              const w = isHVDC ? 4 : line.kv === 765 ? 2.8 : 1.8;
              const d = routeLines(line.from, line.to);
              if (!isActive && !isHov) return null;
              const anim = flowAnim(line.id, li);
              return (
                <g key={line.id + "_active"}>
                  {/* Glow */}
                  <path d={d} fill="none" stroke={color} strokeWidth={w + 8} opacity="0.08" strokeLinejoin="round" />
                  {/* Solid line */}
                  <path d={d} fill="none" stroke={color} strokeWidth={w} opacity={isHVDC ? 0.9 : 0.85} strokeLinejoin="round" />
                  {/* Animated flow dashes */}
                  <path d={d} fill="none" stroke="white" strokeWidth={isHVDC ? 2 : 1.2}
                    strokeDasharray={anim.strokeDasharray} strokeDashoffset={anim.strokeDashoffset}
                    opacity={isHVDC ? 0.55 : 0.3} strokeLinejoin="round" />
                  {/* ckm label on hover */}
                  {isHov && (
                    <text
                      x={((SCHEM[line.from][0] + SCHEM[line.to][0]) / 2) + 6}
                      y={((SCHEM[line.from][1] + SCHEM[line.to][1]) / 2) - 6}
                      fill={color} fontSize="8" fontWeight="700">{line.ckm} ckm</text>
                  )}
                </g>
              );
            })}

            {/* Invisible hit zones for lines */}
            {MAP_LINES.map(line => {
              if (!SCHEM[line.from] || !SCHEM[line.to]) return null;
              return (
                <path key={line.id + "_hit"} d={routeLines(line.from, line.to)}
                  fill="none" stroke="transparent" strokeWidth={14} style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovLine(line.id)} onMouseLeave={() => setHovLine(null)} />
              );
            })}

            {/* Nodes */}
            {Object.values(MAP_NODES).map(node => {
              const sp = SCHEM[node.id];
              if (!sp) return null;
              const [x, y] = sp;
              const isKps = node.type === "kps";
              const isLoad = node.type === "load";
              const isHov = hovNode === node.id;
              const isSel = selNode === node.id;
              const r = isKps ? 13 : isLoad ? 9 : 7.5;
              const nodeActive = isKps
                ? MAP_LINES.some(l => activeSet.has(l.id) && (l.from === node.id || l.to === node.id))
                : activeSet.size > 0;
              const c = nodeActive ? node.color : "#374151";
              const isPlanned = node.status.includes("planned") || node.status.includes("SCOD");

              return (
                <g key={node.id} style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovNode(node.id)} onMouseLeave={() => setHovNode(null)}
                  onClick={() => setSelNode(selNode === node.id ? null : node.id)}>
                  {(isHov || isSel) && <circle cx={x} cy={y} r={r + 14} fill={c} opacity="0.07" />}
                  {isKps ? (
                    <rect x={x - r} y={y - r} width={r * 2} height={r * 2} rx="3"
                      fill={c} opacity={nodeActive ? 0.25 : 0.07}
                      stroke={isSel ? "white" : c} strokeWidth={isSel ? 2 : 1.5}
                      strokeDasharray={isPlanned ? "5,3" : "none"} />
                  ) : (
                    <circle cx={x} cy={y} r={r} fill={c} opacity={nodeActive ? 0.25 : 0.07}
                      stroke={isSel ? "white" : c} strokeWidth={isSel ? 2 : 1.2}
                      strokeDasharray={isPlanned ? "4,2" : "none"} />
                  )}
                  {isKps && <text x={x} y={y + 4.5} fill="white" fontSize="8.5" fontWeight="800" textAnchor="middle">{node.label.replace("KPS-", "")}</text>}
                  <text x={x} y={y - r - 6}
                    fill={isKps ? node.color : isLoad ? "#fca5a5" : "#6ee7b7"}
                    fontSize={isKps ? "9" : "7.5"} fontWeight={isKps ? "700" : "500"} textAnchor="middle">
                    {node.label}
                  </text>
                  {isLoad && <text x={x} y={y + r + 11} fill={c} fontSize="7" textAnchor="middle">{node.tso}</text>}
                </g>
              );
            })}

            {/* Line legend bottom-left */}
            <g transform={`translate(14,${SH - 80})`}>
              <rect x={0} y={0} width={170} height={72} rx="4" fill="#07111f" stroke="#1e293b" strokeWidth="1" opacity="0.97" />
              <text x={8} y={13} fill="#374151" fontSize="7" fontWeight="700" letterSpacing="1">LINE TYPE</text>
              {[
                { c: "#fbbf24", l: "765 kV ISTS (commissioned)", w: 2.5, d: "none" },
                { c: "#f97316", l: "400 kV (commissioned)", w: 1.8, d: "none" },
                { c: "#6b7280", l: "Planned line", w: 2, d: "6,3" },
                { c: "#a78bfa", l: "±800 kV HVDC V-A", w: 4, d: "10,5" },
              ].map((l, i) => (
                <g key={l.l} transform={`translate(8,${20 + i * 13})`}>
                  <line x1={0} y1={3} x2={22} y2={3} stroke={l.c} strokeWidth={l.w} strokeDasharray={l.d} strokeLinecap="round" />
                  <text x={28} y={7} fill="#9ca3af" fontSize="7">{l.l}</text>
                </g>
              ))}
            </g>
          </svg>

          {/* Node tooltip */}
          {selNodeData && (
            <div className="absolute top-14 right-3 bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-2xl z-20" style={{ width: 240, maxHeight: 320, overflowY: "auto" }}>
              <div className="flex justify-between items-start mb-2">
                <div className="font-bold text-white text-sm">{selNodeData.label}</div>
                <button onClick={() => setSelNode(null)} className="text-gray-500 hover:text-white text-sm ml-2">✕</button>
              </div>
              {[
                { k: "Type", v: selNodeData.type === "kps" ? "Pooling Station" : selNodeData.type === "load" ? "Load / Export" : "Intermediate Hub" },
                { k: "Voltage", v: selNodeData.voltage },
                { k: "TSO", v: selNodeData.tso },
                { k: "Status", v: selNodeData.status },
                { k: "Phase", v: selNodeData.phase },
              ].map(({ k, v }) => (
                <div key={k} className="flex gap-2 text-xs mb-1">
                  <span className="text-gray-500 w-14 shrink-0">{k}</span>
                  <span className={v.includes("commission") || v === "operational" ? "text-green-400" : v.includes("planned") || v.includes("SCOD") ? "text-yellow-400" : v.includes("HVDC") ? "text-purple-400" : "text-gray-300"}>{v}</span>
                </div>
              ))}
              {/* Connected lines for this node */}
              <div className="mt-2 pt-2 border-t border-gray-800">
                <div className="text-xs text-gray-500 mb-1">Connected lines</div>
                {MAP_LINES.filter(l => l.from === selNode || l.to === selNode).map(l => (
                  <div key={l.id} className="flex items-center gap-1.5 text-xs py-0.5">
                    <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: LINE_COLOR[l.kv] || "#6b7280" }} />
                    <span className="text-gray-400 truncate">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Line hover tooltip */}
          {hovLine && !selNode && (() => {
            const l = MAP_LINES.find(x => x.id === hovLine);
            if (!l) return null;
            return (
              <div className="absolute bottom-4 left-3 bg-gray-900 border rounded-lg px-3 py-2 text-xs shadow-xl pointer-events-none z-20"
                style={{ borderColor: LINE_COLOR[l.kv] || "#374151" }}>
                <div className="font-semibold text-white mb-0.5">{l.label}</div>
                <div className="flex gap-4 text-gray-400">
                  <span>TSO: <span className="text-gray-200">{l.tso}</span></span>
                  <span>{l.ckm} ckm</span>
                  <span className="text-gray-500">{l.phase}</span>
                </div>
                <div className={`mt-0.5 font-medium ${activeSet.has(l.id) ? "text-green-400" : "text-gray-600"}`}>
                  {activeSet.has(l.id) ? "● Active at this milestone" : "○ Not yet commissioned"}
                </div>
              </div>
            );
          })()}

          <div className="absolute top-3 right-3 text-xs text-gray-700 pointer-events-none">Click node for details · hover line for info</div>
        </div>

        {/* Right panel: line status list */}
        <div className="w-52 shrink-0 space-y-3">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-3">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Line Status at {milestone.label}</div>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {MAP_LINES.map(line => {
                const isActive = activeSet.has(line.id);
                const c = LINE_COLOR[line.kv] || "#6b7280";
                return (
                  <div key={line.id}
                    className="flex items-center gap-2 text-xs py-0.5 cursor-pointer rounded px-1 hover:bg-gray-700"
                    onMouseEnter={() => setHovLine(line.id)} onMouseLeave={() => setHovLine(null)}>
                    <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: isActive ? c : "#1f2937" }} />
                    <span className="truncate" style={{ color: isActive ? "#d1d5db" : "#374151" }}>{line.label.split(" ")[0]} {line.label.split("→")[1]?.trim().split(" ")[0] || ""}</span>
                    <span className="ml-auto text-xs shrink-0" style={{ color: isActive ? c : "#374151" }}>{line.kv}kV</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-3">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Active KPS</div>
            {Object.values(MAP_NODES).filter(n => n.type === "kps").map(n => {
              const hasFlow = MAP_LINES.some(l => activeSet.has(l.id) && (l.from === n.id || l.to === n.id));
              return (
                <div key={n.id} className="flex items-center gap-2 text-xs py-0.5">
                  <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: hasFlow ? n.color : "#1f2937" }} />
                  <span style={{ color: hasFlow ? "#d1d5db" : "#374151" }}>{n.label}</span>
                  {hasFlow && <span className="ml-auto text-xs" style={{ color: n.color }}>online</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ══════════════════════════════════════════════════════════════
export default function Dashboard() {
  const [tab, setTab] = useState("phases");

  const TABS = [
    { k: "phases",  l: "① Transmission Phases", sub: "What is being built, by whom, when" },
    { k: "stations",l: "② Pooling Stations",    sub: "KPS build-up and ICT count" },
    { k: "margins", l: "③ Bay Margins",          sub: "Developer allocations and headroom" },
    { k: "hvdc",    l: "④ HVDC Lines",           sub: "±800kV LCC + ±500kV VSC deep-dive" },
    { k: "network", l: "⑤ Network Map & Flow",  sub: "Schematic map with animated power flow" },
  ];

  const totalMW = BAY_DATA.reduce((s, b) => s + b.mw, 0);
  const totalPhaseGW = PHASES.reduce((s, p) => s + p.gw, 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* HEADER */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="px-6 py-5 max-w-7xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="bg-yellow-500 rounded-lg p-2 mt-1 shrink-0">
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-black tracking-tight text-white leading-tight">
                Khavda RE Zone — Transmission Intelligence Platform
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Phase I–V Transmission Plans · KPS Bay Allocations · Margin Analysis · HVDC Deep-Dive
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Sources: CTUIL Bay Allocation Register (May 2025) · CERC Orders · PGCIL Stock Filings · CEA WRPC Reports (Jun 2025) · TNDI India
              </p>
            </div>
            <div className="flex gap-4 text-center shrink-0">
              {[
                { l: "Total Allocated", v: `${Math.round(totalMW / 1000)} GW`, c: "#fbbf24" },
                { l: "Phases Planned", v: `${totalPhaseGW} GW`, c: "#3b82f6" },
                { l: "HVDC Capacity", v: "8.5 GW", c: "#a78bfa" },
                { l: "Full Target", v: "30 GW", c: "#22c55e" },
              ].map(s => (
                <div key={s.l} className="bg-gray-800 rounded-xl px-4 py-3 min-w-24">
                  <div className="text-xs text-gray-500">{s.l}</div>
                  <div className="text-xl font-black mt-0.5" style={{ color: s.c }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Phase progress bar */}
          <div className="mt-4 flex gap-0.5 h-2 rounded-full overflow-hidden">
            {PHASES.map(ph => (
              <div key={ph.id} className="h-full transition-all"
                style={{
                  width: `${(ph.gw / 30) * 100}%`,
                  background: ph.color,
                  opacity: ph.status === "commissioned" ? 1 : ph.status === "under-construction" ? 0.7 : 0.4,
                }} />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-0.5">
            <span>0 GW</span>
            <span className="text-gray-400">
              <span className="text-green-400 font-bold">15 GW commissioned</span> · 7 GW under construction · 8 GW awarded/HVDC
            </span>
            <span>30 GW</span>
          </div>
        </div>
      </div>

      {/* TAB NAV */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="flex px-6 max-w-7xl mx-auto overflow-x-auto">
          {TABS.map(t => (
            <button key={t.k} onClick={() => setTab(t.k)}
              className={`px-5 py-4 text-left border-b-2 transition-colors shrink-0 ${tab === t.k ? "border-yellow-400" : "border-transparent"}`}>
              <div className={`text-sm font-bold ${tab === t.k ? "text-yellow-400" : "text-gray-400"}`}>{t.l}</div>
              <div className="text-xs text-gray-600 mt-0.5">{t.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6 max-w-7xl mx-auto">
        {tab === "phases" && (
          <>
            <div className="mb-5">
              <h2 className="text-lg font-bold text-white">Transmission Phase Plan</h2>
              <p className="text-gray-400 text-sm mt-1">
                Khavda evacuation is structured in 5 phases totalling 30 GW. Phases I–III are commissioned.
                Phase IV (7 GW HVAC, 8 parts) is under construction. Phase V (8 GW, HVDC-led) is awarded and entering construction.
              </p>
            </div>
            <PhaseTimeline />
          </>
        )}
        {tab === "stations" && (
          <>
            <div className="mb-5">
              <h2 className="text-lg font-bold text-white">Pooling Station Profiles</h2>
              <p className="text-gray-400 text-sm mt-1">
                Five pooling stations aggregate renewable generation at Khavda. Select a station to see its ICT build-up, developer bay allocations, and margin status.
              </p>
            </div>
            <StationProfiles />
          </>
        )}
        {tab === "margins" && (
          <>
            <div className="mb-5">
              <h2 className="text-lg font-bold text-white">Bay Margin Analysis</h2>
              <p className="text-gray-400 text-sm mt-1">
                Available headroom at each KPS for new developer connectivity. Based on CTUIL Bay Allocation Register (May 2025).
              </p>
            </div>
            <BayMargins />
          </>
        )}
        {tab === "hvdc" && (
          <>
            <div className="mb-5">
              <h2 className="text-lg font-bold text-white">HVDC Transmission Lines</h2>
              <p className="text-gray-400 text-sm mt-1">
                Two HVDC systems under development — India's first and third HVDC-TBCB projects — providing bulk DC transfer capacity from Khavda to Maharashtra and within Gujarat.
              </p>
            </div>
            <HVDCSection />
          </>
        )}
        {tab === "network" && (
          <>
            <div className="mb-5">
              <h2 className="text-lg font-bold text-white">Network Schematic Map & Power Flow</h2>
              <p className="text-gray-400 text-sm mt-1">
                Schematic layout of the ISTS network from Khavda pooling stations to Maharashtra load centres.
                Step through commissioning milestones to see how the network built up — animated flow shows active corridors.
                Click any node for details. Hover a line for route info.
              </p>
            </div>
            <GridArchitecture />
            <div className="mt-6 mb-2">
              <div className="text-sm font-bold text-white">Live Network Flow Simulator</div>
              <div className="text-xs text-gray-500 mt-0.5">Step through commissioning milestones — animated dashes show active power corridors. Click any node for details.</div>
            </div>
            <NetworkMapFlow />
          </>
        )}
      </div>

      {/* FOOTER */}
      <div className="border-t border-gray-800 px-6 py-4 max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-700">
          <span>CTUIL Bay Allocation Register, May 2025</span>
          <span>CERC Tariff & Licence Orders (2023–2026)</span>
          <span>CEA WRPC Meeting Agenda, June 2025</span>
          <span>PGCIL / AESL Stock Exchange Filings</span>
          <span>TNDI India (T&D India) research reports</span>
          <span className="ml-auto text-gray-800">Platform data as of Mar 2026</span>
        </div>
      </div>
    </div>
  );
}
