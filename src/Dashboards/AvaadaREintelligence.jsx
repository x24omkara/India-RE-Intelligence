import { useState, useEffect, useRef, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from "recharts";

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

// ── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (n) => n >= 1000 ? (n/1000).toFixed(1)+"k" : n.toLocaleString();
const fmtMW = (n) => n ? n.toLocaleString() + " MW" : "—";

function hmColor(val, max) {
  if (!val || val === 0) return null;
  const p = val / max;
  if (p < 0.12) return {bg:"#d0eaf8",fg:"#2a6e97"};
  if (p < 0.30) return {bg:"#7ec8e3",fg:"#fff"};
  if (p < 0.55) return {bg:"#2196c4",fg:"#fff"};
  if (p < 0.78) return {bg:"#0077b6",fg:"#fff"};
  return {bg:"#004e7a",fg:"#fff"};
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

const ScopeBadge = ({scope}) => {
  const map = {all:["#0077b6","ALL DATA"],fy25:["#6930c3","FY 2025"],fy26:["#d62828","FY 2026"]};
  const [bg, txt] = map[scope]||map.all;
  return <span style={{background:bg,color:"#fff",fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:3,letterSpacing:1.2}}>{txt}</span>;
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

  // Aggregate helpers
  const sumFYs = (obj) => fys.reduce((s,f) => s+(obj[f]||0), 0);
  const authSum = (auth) => fys.reduce((s,f) => s+((AUTH_BY_FY[f]||{})[auth]||0), 0);
  const coSum = (co) => fys.reduce((s,f) => s+((CO_BY_FY[f]||{})[co]||0), 0);
  const techSum = (tech) => fys.reduce((s,f) => s+((TECH_BY_FY[f]||{})[tech]||0), 0);

  const totalMW = sumFYs(FY_MARKET);
  const avaadaMW = sumFYs(AVAADA_FY);
  const share = totalMW > 0 ? ((avaadaMW/totalMW)*100).toFixed(1) : "0";
  const peakFY = fys.sort ? [...fys].sort((a,b)=>(FY_MARKET[b]||0)-(FY_MARKET[a]||0))[0] : null;

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

  const authData = ["SECI","NHPC","NTPC","SJVN","GUVNL","MSEDCL","MSAPL","IREDA"]
    .map(a=>({name:a, value:authSum(a)}))
    .sort((a,b)=>b.value-a.value);

  const cos = ["Avaada","JSW","Renew","NTPC","Adani","Juniper","SAEL","ACME","Mahindra","Tata"];
  const cosColors = [C.avaada,C.jsw,C.renew,C.ntpc,C.adani,C.juniper,C.sael,C.acme,"#888","#aaa"];
  const topCosData = cos.map((co,i)=>({name:co,value:coSum(co),color:cosColors[i]}))
    .sort((a,b)=>b.value-a.value);

  const tariffLines = fys.map(f=>({
    name: f.replace("FY ",""),
    Solar: (TARIFF_BY_TECH.Solar||{})[f]||null,
    Hybrid: (TARIFF_BY_TECH.Hybrid||{})[f]||null,
    "RTC/FDRE": (TARIFF_BY_TECH["RTC/FDRE"]||{})[f]||null,
    "ESS/BESS": (TARIFF_BY_TECH["ESS/BESS"]||{})[f]||null,
    Wind: (TARIFF_BY_TECH.Wind||{})[f]||null,
  }));

  const tariffScope = scope==="fy25"?"fy25":scope==="fy26"?"fy26":"all";
  const tariffData = CO_TECH_TARIFF[tariffScope];
  const tariffCos = ["Avaada","JSW","Renew","NTPC","Adani","Juniper"];
  const tariffCats = ["Solar","Hybrid","RTC/FDRE"];
  const colStats = {};
  tariffCats.forEach(cat=>{
    const vals = tariffCos.map(co=>tariffData[co]&&tariffData[co][cat]?tariffData[co][cat].t:null).filter(v=>v!==null);
    colStats[cat] = {min:Math.min(...vals),max:Math.max(...vals)};
  });
  const overall = (co) => {
    const d = tariffData[co]; if (!d) return null;
    let sw=0,st=0;
    tariffCats.forEach(c=>{ if(d[c]){st+=d[c].t*d[c].c; sw+=d[c].c;} });
    return sw>0?(st/sw).toFixed(3):null;
  };

  // Avaada tech by FY chart
  const avaadaTechData = ALL_FYS.slice(0,5).map(f=>({
    name: f.replace("FY ",""),
    Solar: (AVAADA_TECH_FY[f]||{}).Solar||0,
    Hybrid: (AVAADA_TECH_FY[f]||{}).Hybrid||0,
    "RTC/FDRE": (AVAADA_TECH_FY[f]||{})["RTC/FDRE"]||0,
    Wind: (AVAADA_TECH_FY[f]||{}).Wind||0,
  }));

  const avaadaTechPie = [
    {name:"Solar",value:8767,color:C.solar},
    {name:"Hybrid",value:4000,color:C.hybrid},
    {name:"FDRE/RTC",value:3640,color:C.fdre},
    {name:"Wind",value:50,color:C.wind},
  ];
  const mktSharePie = [
    {name:"Avaada",value:15562,color:C.avaada},{name:"JSW",value:10135,color:C.jsw},
    {name:"Renew",value:8514,color:C.renew},{name:"NTPC",value:5125,color:C.ntpc},
    {name:"Juniper",value:4600,color:C.juniper},{name:"Adani",value:3895,color:C.adani},
    {name:"SAEL",value:3730,color:C.sael},{name:"ACME",value:3230,color:C.acme},
    {name:"Others",value:9006,color:"#ccc"},
  ];

  const premiumData = [
    {t:"MSKVY-MSE-01",p:11.0},{t:"NTPC BOO-9",p:5.0},{t:"NHPC T9",p:4.0},
    {t:"GUVNL Ph.19",p:2.0},{t:"NTPC BOO-16",p:1.0},{t:"NHPC Solar-2",p:1.0},
    {t:"NTPC BOO-14",p:1.0},{t:"ISTS-XI",p:1.0},{t:"NHPC Solar-3",p:0.5},
    {t:"GUVNL Ph-24",p:0.5},{t:"SECI-XII",p:0.0},{t:"SECI-XIV",p:0.0},
    {t:"MSEDCL Ph.10",p:0.0},{t:"MSKVY-Pune",p:0.0},
  ].map(d=>({...d,fill:d.p===0?C.wind+"99":d.p<=1?"#f5a623cc":d.p<=5?C.jsw+"cc":C.bess+"cc"}));

  const fy26TopCos = [
    {name:"ACME",value:1995,color:C.acme},{name:"Patel Infra",value:1853,color:C.hybrid},
    {name:"NLC India",value:1600,color:C.ntpc},{name:"Enerica",value:765,color:C.fdre},
    {name:"Rel. Anil",value:750,color:C.jsw},{name:"Shivalaya",value:600,color:C.wind},
    {name:"KP Group",value:565,color:"#888"},
  ];

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div style={{background:"#f5f6fa",minHeight:"100vh",fontFamily:"'Inter',system-ui,sans-serif",fontSize:13,color:"#1a1f36"}}>

      {/* HEADER */}
      <div style={{background:"#fff",borderBottom:"2px solid #dde1ee",padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:300,boxShadow:"0 1px 6px rgba(0,0,0,.06)"}}>
        <div>
          <span style={{fontWeight:800,fontSize:17,color:C.avaada,letterSpacing:-.5}}>Avaada</span>
          <span style={{color:C.muted,fontWeight:400,marginLeft:6,fontSize:13}}>RE Competitive Intelligence</span>
        </div>
        <div style={{fontSize:10,color:C.muted,textAlign:"right",lineHeight:1.7}}>
          <strong style={{color:"#3d4466"}}>Data: March 2, 2026</strong> · v3
          <br/>FY2021–FY2026 · 1,299 bid records
        </div>
      </div>

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
      <div style={{padding:"20px 24px",maxWidth:1280,margin:"0 auto"}}>

        {/* ── MARKET OVERVIEW ── */}
        {activeTab==="overview" && (
          <div>
            <div style={{marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:14,fontWeight:700,color:"#1a1f36"}}>Market Overview</span>
              <ScopeBadge scope={scope}/>
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
                <CardTitle tag="All FY · Won MW">Top Bidding Authorities</CardTitle>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={authData} layout="vertical" margin={{top:5,right:30,bottom:5,left:10}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaecf4" horizontal={false}/>
                    <XAxis type="number" tickFormatter={v=>(v/1000)+"k"} tick={{fontSize:10,fill:C.muted}}/>
                    <YAxis type="category" dataKey="name" tick={{fontSize:10,fill:C.muted}} width={55}/>
                    <Tooltip content={customTooltip("MW")}/>
                    <Bar dataKey="value" radius={[0,3,3,0]}>
                      {authData.map((d,i)=><Cell key={i} fill={cosColors[i]||"#888"} fillOpacity={0.8}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
            <Card>
              <CardTitle tag="All FY · Won MW">Top Developers by Won Capacity</CardTitle>
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
            <div style={{marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:14,fontWeight:700}}>Technology Mix</span>
              <ScopeBadge scope={scope}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,marginBottom:14}}>
              <Card>
                <CardTitle tag="Stacked MW by tech">Annual Technology Stack</CardTitle>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={techStackData} margin={{top:5,right:10,bottom:5,left:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaecf4"/>
                    <XAxis dataKey="name" tick={{fontSize:10,fill:C.muted}}/>
                    <YAxis tickFormatter={v=>(v/1000)+"k"} tick={{fontSize:10,fill:C.muted}}/>
                    <Tooltip content={customTooltip("MW")}/>
                    <Legend wrapperStyle={{fontSize:10}}/>
                    <Bar dataKey="Solar" stackId="a" fill={C.solar+"cc"} stroke={C.solar} strokeWidth={1}/>
                    <Bar dataKey="Hybrid" stackId="a" fill={C.hybrid+"cc"} stroke={C.hybrid} strokeWidth={1}/>
                    <Bar dataKey="RTC/FDRE" stackId="a" fill={C.fdre+"cc"} stroke={C.fdre} strokeWidth={1}/>
                    <Bar dataKey="ESS/BESS" stackId="a" fill={C.bess+"cc"} stroke={C.bess} strokeWidth={1}/>
                    <Bar dataKey="Wind" stackId="a" fill={C.wind+"cc"} stroke={C.wind} strokeWidth={1} radius={[3,3,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <Card>
                  <CardTitle tag="FY25">Technology Pie FY25</CardTitle>
                  <ResponsiveContainer width="100%" height={130}>
                    <PieChart>
                      <Pie data={[{name:"Solar",value:15760,color:C.solar},{name:"Hybrid",value:15076,color:C.hybrid},{name:"FDRE/RTC",value:13688,color:C.fdre},{name:"BESS",value:9600,color:C.bess},{name:"Wind",value:460,color:C.wind}]}
                        cx="40%" cy="50%" outerRadius={55} innerRadius={32} dataKey="value">
                        {[C.solar,C.hybrid,C.fdre,C.bess,C.wind].map((c,i)=><Cell key={i} fill={c}/>)}
                      </Pie>
                      <Legend iconSize={8} wrapperStyle={{fontSize:9}} layout="vertical" align="right" verticalAlign="middle"/>
                      <Tooltip formatter={(v)=>[v.toLocaleString()+" MW"]}/>
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
                <Card>
                  <CardTitle tag="FY26">Technology Pie FY26</CardTitle>
                  <ResponsiveContainer width="100%" height={130}>
                    <PieChart>
                      <Pie data={[{name:"BESS",value:15080,color:C.bess},{name:"FDRE",value:8770,color:C.fdre},{name:"Wind",value:2002,color:C.wind},{name:"Solar",value:500,color:C.solar}]}
                        cx="40%" cy="50%" outerRadius={55} innerRadius={32} dataKey="value">
                        {[C.bess,C.fdre,C.wind,C.solar].map((c,i)=><Cell key={i} fill={c}/>)}
                      </Pie>
                      <Legend iconSize={8} wrapperStyle={{fontSize:9}} layout="vertical" align="right" verticalAlign="middle"/>
                      <Tooltip formatter={(v)=>[v.toLocaleString()+" MW"]}/>
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </div>
            <Note>
              <strong>FY26 mix:</strong> BESS/ESS = 57% of awards (15,080 MW of 26,352 MW total), up from 18% in FY25 — reflecting the VGF scheme driving standalone storage tenders.
            </Note>

            {/* Technology Strategy Matrix */}
            <Card style={{marginTop:14}}>
              <CardTitle tag="All FY · Won MW per Developer">Technology Strategy Matrix</CardTitle>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead>
                    <tr style={{borderBottom:"1px solid #dde1ee"}}>
                      {["Developer",<span style={{color:C.solar}}>Solar</span>,<span style={{color:C.hybrid}}>Hybrid</span>,<span style={{color:C.fdre}}>FDRE/RTC</span>,<span style={{color:C.bess}}>BESS/ESS</span>,<span style={{color:C.wind}}>Wind</span>,"Total","BESS %"].map((h,i)=>(
                        <th key={i} style={{textAlign:i===0?"left":"right",padding:"5px 8px",color:C.muted,fontWeight:600,fontSize:10}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TECH_MATRIX.map(row=>{
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
                Avaada's portfolio is concentrated in Solar, Hybrid and FDRE/RTC — segments where it holds a strong track record. JSW (4,625 MW), Greenko (3,000 MW) and Adani (1,250 MW) have been active in BESS alongside their core portfolios. Greenko, Torrent and Patel Infra are largely storage-specialist developers. BESS is shown for reference — it is a structurally different market requiring different balance-sheet, EPC and technology capabilities.
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
                <CardTitle tag="FY21–25 · MW">ISTS vs STU by Year</CardTitle>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={[
                    {name:"FY21",ISTS:12000,STU:5500},{name:"FY22",ISTS:10500,STU:4800},
                    {name:"FY23",ISTS:6800,STU:5500},{name:"FY24",ISTS:32000,STU:12000},
                    {name:"FY25",ISTS:42000,STU:11000},
                  ]} margin={{top:5,right:10,bottom:5,left:0}}>
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
                <CardTitle tag="All FY">Overall Connectivity Split</CardTitle>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={[{name:"ISTS",value:104181},{name:"STU",value:47452},{name:"CTU",value:9275},{name:"Other",value:11990}]}
                      cx="40%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value">
                      {[C.ists,C.stu,"#6930c3","#888"].map((c,i)=><Cell key={i} fill={c}/>)}
                    </Pie>
                    <Legend iconSize={10} wrapperStyle={{fontSize:10}} layout="vertical" align="right" verticalAlign="middle"/>
                    <Tooltip formatter={(v)=>[v.toLocaleString()+" MW"]}/>
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
            <Note>ISTS dominates at ~60% of total awarded capacity (104,181 MW). STU = ~27% (47,452 MW). ISTS projects structurally clear at ₹0.36/kWh lower than STU — important for tariff comparisons.</Note>
          </div>
        )}

        {/* ── AVAADA DEEP DIVE ── */}
        {activeTab==="avaada" && (
          <div>
            <div style={{marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:14,fontWeight:700}}>Avaada Deep Dive</span>
            </div>
            <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
              <KPIBox label="Total Won (All FY)" value="16,457 MW" sub="#1 IPP by FY24+25" color={C.avaada}/>
              <KPIBox label="Win Rate" value="52.5%" sub="42 wins / 80 bids" color={C.wind}/>
              <KPIBox label="LoA Issued" value="8,360 MW" sub="PPA not yet signed" color={C.jsw}/>
              <KPIBox label="PPA Signed" value="7,482 MW" sub="Pipeline secured" color={C.ntpc}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,marginBottom:14}}>
              <Card>
                <CardTitle tag="FY21–25 · Won MW">Avaada Win by Technology per FY</CardTitle>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={avaadaTechData} margin={{top:5,right:10,bottom:5,left:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaecf4"/>
                    <XAxis dataKey="name" tick={{fontSize:10,fill:C.muted}}/>
                    <YAxis tickFormatter={v=>(v/1000)+"k"} tick={{fontSize:10,fill:C.muted}}/>
                    <Tooltip content={customTooltip("MW")}/>
                    <Legend wrapperStyle={{fontSize:10}}/>
                    <Bar dataKey="Solar" stackId="a" fill={C.solar+"bb"} stroke={C.solar} strokeWidth={1.5} radius={[0,0,0,0]}/>
                    <Bar dataKey="Hybrid" stackId="a" fill={C.hybrid+"bb"} stroke={C.hybrid} strokeWidth={1.5}/>
                    <Bar dataKey="RTC/FDRE" stackId="a" fill={C.fdre+"bb"} stroke={C.fdre} strokeWidth={1.5}/>
                    <Bar dataKey="Wind" stackId="a" fill={C.wind+"bb"} stroke={C.wind} strokeWidth={1.5} radius={[3,3,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <CardTitle tag="All FY">Portfolio Tech Mix</CardTitle>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={avaadaTechPie} cx="40%" cy="50%" outerRadius={85} innerRadius={48} dataKey="value">
                      {avaadaTechPie.map((d,i)=><Cell key={i} fill={d.color+"cc"}/>)}
                    </Pie>
                    <Legend iconSize={9} wrapperStyle={{fontSize:9}} layout="vertical" align="right" verticalAlign="middle"
                      formatter={(v,e)=>`${v}: ${(e.payload.value/1000).toFixed(1)}k`}/>
                    <Tooltip formatter={(v)=>[v.toLocaleString()+" MW"]}/>
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
            <Card>
              <CardTitle tag="FY24+25 · Top 16 wins">Key Deals</CardTitle>
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
                    {DEALS.map((d,i)=>(
                      <tr key={i} style={{borderBottom:"1px solid #f0f2f8"}}>
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
            </Card>
          </div>
        )}

        {/* ── COMPETITIVE LANDSCAPE ── */}
        {activeTab==="competitive" && (
          <div>
            <div style={{marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:14,fontWeight:700}}>Competitive Landscape</span>
              <ScopeBadge scope={scope}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              <Card>
                <CardTitle tag="FY24+25 · Market Share">FY24+25 Developer Share</CardTitle>
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie data={mktSharePie} cx="40%" cy="50%" outerRadius={90} innerRadius={46} dataKey="value">
                      {mktSharePie.map((d,i)=><Cell key={i} fill={d.color+"cc"}/>)}
                    </Pie>
                    <Legend iconSize={9} wrapperStyle={{fontSize:9}} layout="vertical" align="right" verticalAlign="middle"
                      formatter={(v,e)=>`${v}: ${(e.payload.value/1000).toFixed(1)}k`}/>
                    <Tooltip formatter={(v)=>[v.toLocaleString()+" MW"]}/>
                  </PieChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <CardTitle tag="FY24+25 · FDRE/RTC">FDRE Leaders FY24+25</CardTitle>
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart layout="vertical"
                    data={[{name:"Avaada",v:3640},{name:"Renew",v:2814},{name:"ACME",v:2180},{name:"Juniper",v:1750},{name:"NTPC",v:1500},{name:"Hero",v:1440},{name:"JSW",v:910}]}
                    margin={{top:5,right:30,bottom:5,left:5}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaecf4" horizontal={false}/>
                    <XAxis type="number" tick={{fontSize:10,fill:C.muted}}/>
                    <YAxis type="category" dataKey="name" tick={{fontSize:10,fill:C.muted}} width={55}/>
                    <Tooltip content={customTooltip("MW")}/>
                    <Bar dataKey="v" radius={[0,3,3,0]}>
                      {[C.avaada,C.renew,C.acme,C.juniper,C.ntpc,"#9b6e00",C.jsw].map((c,i)=><Cell key={i} fill={c+"cc"}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
            <Card>
              <CardTitle tag="Mar 2025">IPP Portfolio — Operational vs Under Construction</CardTitle>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={IPP_DATA.map(d=>({...d,name:d.c}))} margin={{top:5,right:10,bottom:5,left:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eaecf4"/>
                  <XAxis dataKey="name" tick={{fontSize:10,fill:C.muted}}/>
                  <YAxis tickFormatter={v=>(v/1000)+"k"} tick={{fontSize:10,fill:C.muted}}/>
                  <Tooltip content={customTooltip("MW")}/>
                  <Legend wrapperStyle={{fontSize:10}}/>
                  <Bar dataKey="op" name="Operational" fill="#bdd7ee" stroke={C.avaada} strokeWidth={1.5} radius={[2,2,0,0]}/>
                  <Bar dataKey="uc" name="UC + Secured" fill="#f6cba0" stroke={C.jsw} strokeWidth={1.5} radius={[2,2,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
              <Note>Avaada's operational ratio (15.4%) is the lowest among top IPPs — highest execution risk. 84.6% of portfolio is unexecuted as of Mar 2025.</Note>
            </Card>
          </div>
        )}

        {/* ── TARIFF INTELLIGENCE ── */}
        {activeTab==="tariff" && (
          <div>
            <div style={{marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:14,fontWeight:700}}>Tariff Intelligence</span>
              <ScopeBadge scope={scope}/>
            </div>
            <Card>
              <CardTitle tag="₹/kWh by technology">Tariff Trajectory by Technology</CardTitle>
              <Note>
                <strong>FDRE:</strong> Peaked ₹4.58 FY24 → ₹4.15 FY25 as competition intensified. <strong>FY26 BESS growth:</strong> 57% of new awards are storage-led (15,080 MW of 26,352 MW total), reflecting rapid market expansion.
              </Note>
              <ResponsiveContainer width="100%" height={260} style={{marginTop:12}}>
                <LineChart data={tariffLines} margin={{top:5,right:10,bottom:5,left:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eaecf4"/>
                  <XAxis dataKey="name" tick={{fontSize:10,fill:C.muted}}/>
                  <YAxis tickFormatter={v=>"₹"+v.toFixed(2)} tick={{fontSize:10,fill:C.muted}}/>
                  <Tooltip formatter={(v,n)=>[v?"₹"+Number(v).toFixed(3):"—",n]}/>
                  <Legend wrapperStyle={{fontSize:10}}/>
                  {[["Solar",C.solar],["Hybrid",C.hybrid],["RTC/FDRE",C.fdre],["ESS/BESS",C.bess],["Wind",C.wind]].map(([key,col])=>(
                    <Line key={key} type="monotone" dataKey={key} stroke={col} strokeWidth={2.5}
                      dot={{r:4,fill:col}} activeDot={{r:6}} connectNulls={true}/>
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </Card>
            <Note type="warn" style={{marginBottom:14}}>
              <strong>Why BESS tariffs collapsed 76% in 3 years — it's the tender design, not just battery costs</strong><br/>
              <br/><strong>1. Duration shift</strong> — FY23's ₹10.22 benchmark was SECI's first-ever standalone BESS tender (Aug 2022, 500 MW / 1,000 MWh, 2-hr duration). Moving to 4-hr standard allows amortisation of fixed costs over more MWh.
              <br/><br/><strong>2. Tenure extension</strong> — 12-year SECI PPAs → 25-year NTPC → 40-year PCKL. Longer tenures distribute capex recovery, the single most influential tender design variable (IEEFA).
              <br/><br/><strong>3. VGF subsidy</strong> — Cabinet's Sep 2023 scheme covers up to 30% capex / ₹4.6 lakh per MWh. Maharashtra and Rajasthan FY25 awards cleared at ₹2.19–2.21 lakh/MW/month — ~40% below pre-VGF prices.
              <br/><br/><strong>4. Hardware crash</strong> — Li-ion pack prices fell ~40% in 2024 alone (ICRA). FY26 bids imply sub-$120/kWh pack cost vs ~$300/kWh in 2022.
              <br/><br/><strong>5. ISTS charge waiver</strong> — solar+BESS waiver extended to 2028, reducing effective inter-state project costs.
              <br/><br/><span style={{color:C.bess,fontWeight:600}}>Risk flag:</span> Only 758 MWh commissioned vs 12+ GWh awarded. IEEFA warns of aggressive underbidding — developers pricing in unrealistic future battery cost declines. Chinese export controls and rising metal prices could stress FY26 tariff assumptions.
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
                                  <span style={{fontWeight:700,color:cat==="Solar"?C.solar:cat==="Hybrid"?C.hybrid:C.fdre}}>₹{t}</span>
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
                    <YAxis type="category" dataKey="t" tick={{fontSize:9,fill:C.muted}} width={95}/>
                    <Tooltip formatter={(v)=>[v+"p","Premium"]}/>
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
              <ScopeBadge scope={scope}/>
            </div>
            <Card>
              <CardTitle tag={scope==="fy25"?"FY25 · Won MW":"All FY · Won MW"}>Developer × Bidding Authority</CardTitle>
              <HeatmapTable
                data={scope==="fy25" ? HM_AUTH_FY25 : HM_AUTH_ALL}
                keys={scope==="fy25" ? ["SECI","NHPC","NTPC","SJVN","GUVNL","MSEDCL"] : ["SECI","NHPC","NTPC","SJVN","GUVNL","MSEDCL","MSAPL","RUMSL","REMCL","RUVNL"]}
              />
              <Note>
                <strong>Avaada:</strong> NHPC anchor (5,950 MW) + NTPC + SJVN; low SECI presence where JSW (5,294 MW) and Renew (4,230 MW) dominate.<br/>
                <strong>JSW:</strong> SECI-centric (5,294 MW) + MSEDCL (2,300 MW).<br/>
                <strong>Renew:</strong> Most diversified — SECI + NTPC + NHPC across all auths.
              </Note>
            </Card>
            <Card style={{marginTop:14}}>
              <CardTitle tag="All FY · Won MW">Developer × REIA Type</CardTitle>
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
                    {Object.entries(REIA_ALL).map(([co,row])=>{
                      const allVals = Object.values(REIA_ALL).flatMap(r=>Object.values(r));
                      const maxV = Math.max(...allVals,1);
                      const c = row["Central REIA"]||0, s = row.State||0;
                      const pct = (c+s)>0 ? Math.round(c/(c+s)*100)+"%" : "—";
                      const isAv = co==="Avaada";
                      return (
                        <tr key={co} style={{background:isAv?"#e8f4fd":"transparent",borderBottom:"1px solid #f0f2f8"}}>
                          <td style={{padding:"5px 8px",fontWeight:isAv?800:600,color:isAv?C.avaada:"#1a1f36"}}>{co}</td>
                          {[c,s].map((v,i)=>{
                            const allV2 = Object.values(REIA_ALL).flatMap(r=>Object.values(r));
                            const mx = Math.max(...allV2,1);
                            const col = hmColor(v,mx);
                            return v===0 ? <td key={i} style={{textAlign:"center",padding:"5px 8px"}}><span style={{color:C.muted}}>—</span></td> :
                              <td key={i} style={{textAlign:"center",padding:"5px 6px"}}>
                                <span style={{background:col.bg,color:col.fg,padding:"2px 7px",borderRadius:3,fontSize:10,fontWeight:600,display:"inline-block"}}>
                                  {(v/1000).toFixed(1)}k
                                </span>
                              </td>;
                          })}
                          <td style={{textAlign:"right",padding:"5px 8px",fontWeight:700}}>{pct}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Note>Avaada: 67% Central REIA. NTPC most state-heavy at 59% state. Renew most central-focused at 80%.</Note>
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
                <CardTitle tag="FY26 · Won MW so far">FY26 Early Leaders</CardTitle>
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={fy26TopCos.map(d=>({name:d.name,value:d.value,fill:d.color}))} layout="vertical"
                    margin={{top:5,right:30,bottom:5,left:5}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaecf4" horizontal={false}/>
                    <XAxis type="number" tick={{fontSize:10,fill:C.muted}}/>
                    <YAxis type="category" dataKey="name" tick={{fontSize:9,fill:C.muted}} width={75}/>
                    <Tooltip content={customTooltip("MW")}/>
                    <Bar dataKey="value" radius={[0,3,3,0]}>
                      {fy26TopCos.map((d,i)=><Cell key={i} fill={d.color+"cc"}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
            <Note>
              FY26 is early-stage with 26,352 MW awarded to date. ACME leads at 1,995 MW; storage-specialist developers (Patel Infra, Greenko, Enerica) are active in the BESS segment. Avaada's FY26 pipeline is yet to materialise — consistent with its FY24–25 pattern of back-loaded closings.
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
    </div>
  );
}
