// Data & Constants
import React, { useState, useMemo, useRef, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// ═══════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════
const khavdaConnectivity = [

/* KHAVDA PS-I (220kV) */

{ developer:"Sitac Kabini Renewables Pvt. Ltd.", group:"Independent", mw:300, voltage:"220kV", substation:"Khavda PS-I", bay:"201", bess:false },
{ developer:"Sarjan Energy Systems Pvt. Ltd.", group:"Sarjan Group", mw:238.5, voltage:"220kV", substation:"Khavda PS-I", bay:"201", bess:false },
{ developer:"Adani Green Energy Ltd.", group:"Adani Group", mw:300, voltage:"220kV", substation:"Khavda PS-I", bay:"202", bess:false },
{ developer:"Inox Wind Infrastructure Services Ltd.", group:"Inox Group", mw:300, voltage:"220kV", substation:"Khavda PS-I", bay:"204", bess:false },
{ developer:"NTPC Renewable Energy Ltd.", group:"NTPC Group", mw:350, voltage:"220kV", substation:"Khavda PS-I", bay:"205", bess:false },
{ developer:"SJVN Green Energy Ltd.", group:"SJVN Group", mw:360, voltage:"220kV", substation:"Khavda PS-I", bay:"211", bess:false },

{ developer:"ABREL (RJ) Projects Ltd.", group:"Aditya Birla Group", mw:314, voltage:"220kV", substation:"Khavda PS-I", bay:"8", bess:false },
{ developer:"Aditya Birla Renewables Subsidiary Ltd.", group:"Aditya Birla Group", mw:362, voltage:"220kV", substation:"Khavda PS-I", bay:"9", bess:false },
{ developer:"Avaada Energy Pvt. Ltd.", group:"Avaada Group", mw:300, voltage:"220kV", substation:"Khavda PS-I", bay:"12", bess:false },
{ developer:"Adani Green Energy Thirty-Two Ltd.", group:"Adani Group", mw:260.5, voltage:"220kV", substation:"Khavda PS-I", bay:"12", bess:false },
{ developer:"Adani Renewable Energy Eight Ltd.", group:"Adani Group", mw:115, voltage:"220kV", substation:"Khavda PS-I", bay:"13", bess:false },

/* KHAVDA PS-II (400kV) */

{ developer:"Adani Renewable Energy Holding Four Ltd.", group:"Adani Group", mw:2500, voltage:"400kV", substation:"Khavda PS-II", bay:"401", bess:false },
{ developer:"Adani Renewable Energy Holding Four Ltd.", group:"Adani Group", mw:1000, voltage:"400kV", substation:"Khavda PS-II", bay:"404", bess:false },
{ developer:"Adani Green Energy Ltd.", group:"Adani Group", mw:1050, voltage:"400kV", substation:"Khavda PS-II", bay:"412", bess:false },
{ developer:"Adani Green Energy Ltd.", group:"Adani Group", mw:1650, voltage:"400kV", substation:"Khavda PS-II", bay:"421", bess:false },
{ developer:"Adani Green Energy Ltd.", group:"Adani Group", mw:1160, voltage:"400kV", substation:"Khavda PS-II", bay:"424", bess:false },
{ developer:"Adani Green Energy Ltd.", group:"Adani Group", mw:1300, voltage:"400kV", substation:"Khavda PS-II", bay:"7", bess:false },
{ developer:"Sarjan Realties Pvt. Ltd.", group:"Sarjan Group", mw:1150, voltage:"400kV", substation:"Khavda PS-II", bay:"8", bess:false },
{ developer:"Reliance Industries Limited", group:"Reliance Group", mw:690, voltage:"400kV", substation:"Khavda PS-II", bay:"9", bess:false },

/* KHAVDA PS-III (400kV) */

{ developer:"Adani Green Energy Ltd.", group:"Adani Group", mw:1050, voltage:"400kV", substation:"Khavda PS-III", bay:"406", bess:false },
{ developer:"NTPC Renewable Energy Ltd.", group:"NTPC Group", mw:1200, voltage:"400kV", substation:"Khavda PS-III", bay:"403", bess:false },
{ developer:"Sarjan Realties Pvt. Ltd.", group:"Sarjan Group", mw:1250, voltage:"400kV", substation:"Khavda PS-III", bay:"412", bess:false },
{ developer:"Sarjan Realties Pvt. Ltd.", group:"Sarjan Group", mw:1100, voltage:"400kV", substation:"Khavda PS-III", bay:"4", bess:false },
{ developer:"Sarjan Realties Pvt. Ltd.", group:"Sarjan Group", mw:1250, voltage:"400kV", substation:"Khavda PS-III", bay:"5", bess:false },
{ developer:"NHPC Ltd.", group:"NHPC", mw:600, voltage:"400kV", substation:"Khavda PS-III", bay:"6", bess:false },
{ developer:"Adani Green Energy Ltd.", group:"Adani Group", mw:1325, voltage:"400kV", substation:"Khavda PS-III", bay:"7", bess:false },
{ developer:"Adani Green Energy Ltd.", group:"Adani Group", mw:1160, voltage:"400kV", substation:"Khavda PS-III", bay:"8", bess:false },

/* KHAVDA PS-IV (400kV) */

{ developer:"Adani Power Limited", group:"Adani Group", mw:1250, voltage:"400kV", substation:"Khavda PS-IV", bay:"1", bess:false },
{ developer:"Adani Power Limited", group:"Adani Group", mw:1250, voltage:"400kV", substation:"Khavda PS-IV", bay:"2", bess:false },
{ developer:"Adani Power Limited", group:"Adani Group", mw:1250, voltage:"400kV", substation:"Khavda PS-IV", bay:"3", bess:false },
{ developer:"Adani Power Limited", group:"Adani Group", mw:625, voltage:"400kV", substation:"Khavda PS-IV", bay:"4", bess:false },
{ developer:"Adani Power Limited", group:"Adani Group", mw:625, voltage:"400kV", substation:"Khavda PS-IV", bay:"5", bess:false },
{ developer:"Adani Power Limited", group:"Adani Group", mw:1250, voltage:"400kV", substation:"Khavda PS-IV", bay:"6", bess:false },
{ developer:"Adani Power Limited", group:"Adani Group", mw:1250, voltage:"400kV", substation:"Khavda PS-IV", bay:"7", bess:false },
{ developer:"Adani Power Limited", group:"Adani Group", mw:1250, voltage:"400kV", substation:"Khavda PS-IV", bay:"8", bess:false },

/* KHAVDA PS-V (400kV) */

{ developer:"Adani Power Limited", group:"Adani Group", mw:1250, voltage:"400kV", substation:"Khavda PS-V", bay:"1", bess:false },
{ developer:"Adani Power Limited", group:"Adani Group", mw:1250, voltage:"400kV", substation:"Khavda PS-V", bay:"2", bess:false },
{ developer:"Adani Power Limited", group:"Adani Group", mw:1250, voltage:"400kV", substation:"Khavda PS-V", bay:"3", bess:false }

];


const TIMELINE = [
  { date:"Jan 2025", event:"KPS-I Section-II (4×1500 MVA, 765/400kV ICTs) SCOD", station:"Khavda PS-I", status:"commissioned", source:"TNDI India / CTUIL IE reports" },
  { date:"Mar 2025", event:"Khavda Phase-II Parts A–D SCOD (PGCIL, 4.5 GW)", station:"Khavda PS-II", status:"commissioned", source:"CERC Order, Mercom India" },
  { date:"Jul 2025", event:"Banaskantha–Ahmedabad 765kV D/C ~270 ckm commissioned", station:"Corridor", status:"commissioned", source:"TNDI India, Aug 2025" },
  { date:"Aug 2025", event:"KPS-3 commissioned (DOCO 18 Aug 2025, PGCIL)", station:"Khavda PS-III", status:"commissioned", source:"Wire & Cable India, Aug 2025" },
  { date:"Jan 2026", event:"Ahmedabad–Navsari 765kV D/C ~590 ckm commissioned", station:"Corridor", status:"commissioned", source:"PGCIL stock filing, Feb 2026" },
  { date:"Aug 2026", event:"Khavda IV-A SCOD – 765kV bus Sec-II at KPS3 (AESL)", station:"Khavda PS-III", status:"planned", source:"CERC Licence Order, Jan 2025" },
  { date:"Dec 2026", event:"GSECL 2.3 GW Khavda Solar Park full commissioning target", station:"Khavda PS-II", status:"planned", source:"PV Tech / Vikram Solar, May 2025" },
  { date:"Dec 2026–Mar 2027", event:"Khavda Phase-V (4 GW HVDC, KPS-III HVDC TSA)", station:"Khavda PS-III", status:"planned", source:"PV Tech / CTUIL Phase-V TSA, 2024" },
  { date:"2026–2027", event:"Adani Green 5 GW MSEDCL PPA staggered delivery", station:"Khavda PS-II/IV", status:"planned", source:"Adani / MSEDCL LOI, Sep 2024" },
  { date:"Beyond 2027", event:"Khavda Phase-VI 4 GW HVDC upgrade + 765kV", station:"All Stations", status:"future", source:"PV Tech / CTUIL Phase-VI Planning" },
];

// ═══════════════════════════════════════════════════════════════════════════
// TRANSMISSION MAP DATA
// ═══════════════════════════════════════════════════════════════════════════
const MAP_BOUNDS = { lonMin:68.2, lonMax:75.5, latMin:18.8, latMax:25.8 };
const MW=820, MH=560;
function project(lon,lat){
  const x=((lon-MAP_BOUNDS.lonMin)/(MAP_BOUNDS.lonMax-MAP_BOUNDS.lonMin))*MW;
  const y=MH-((lat-MAP_BOUNDS.latMin)/(MAP_BOUNDS.latMax-MAP_BOUNDS.latMin))*MH;
  return [x,y];
}
const MAP_NODES = {
  kps1: {id:"kps1",label:"KPS-1",lon:69.142,lat:23.374,type:"kps",voltage:"765/400/220kV",tso:"AESL",status:"commissioned",capacity:"~3 GW Phase-I",psKey:"Khavda PS-I"},
  kps2: {id:"kps2",label:"KPS-2",lon:69.158,lat:23.365,type:"kps",voltage:"765/400/220kV",tso:"PGCIL",status:"commissioned",capacity:"~19.7 GW",psKey:"Khavda PS-II"},
  kps3: {id:"kps3",label:"KPS-3",lon:69.494,lat:24.208,type:"kps",voltage:"765/400/220kV",tso:"PGCIL",status:"commissioned Aug 2025",capacity:"~7.8 GW",psKey:"Khavda PS-III"},
  kps4: {id:"kps4",label:"KPS-4",lon:71.403,lat:24.449,type:"kps",voltage:"765/400kV",tso:"AESL (SCOD Aug 2026)",status:"planned",capacity:"~13.8 GW",psKey:"Khavda PS-IV"},
  kps5: {id:"kps5",label:"KPS-5",lon:71.487,lat:24.453,type:"kps",voltage:"765/400/220kV",tso:"Under planning",status:"planned",capacity:"~6.1 GW",psKey:"Khavda PS-V"},
  bhuj: {id:"bhuj",label:"Bhuj PS",lon:69.671,lat:23.243,type:"hub",voltage:"765/400kV",tso:"PGCIL/AESL",status:"commissioned",capacity:"Junction hub"},
  bhuj2:{id:"bhuj2",label:"Bhuj-II",lon:69.563,lat:23.374,type:"hub",voltage:"765/400/220kV",tso:"PGCIL",status:"commissioned",capacity:""},
  lak:  {id:"lak",label:"Lakadia",lon:70.598,lat:23.393,type:"hub",voltage:"765/400kV",tso:"PGCIL/AESL",status:"commissioned",capacity:"Intermediate hub"},
  banas:{id:"banas",label:"Banaskantha",lon:71.450,lat:24.230,type:"hub",voltage:"400/220kV GIS",tso:"PGCIL",status:"commissioned",capacity:"Radhanesda GIS"},
  vad:  {id:"vad",label:"Vadodara",lon:73.183,lat:22.307,type:"hub",voltage:"765/400kV",tso:"PGCIL",status:"commissioned",capacity:"WR key node"},
  ahm:  {id:"ahm",label:"Ahmedabad (new)",lon:72.585,lat:23.033,type:"hub",voltage:"765/400kV",tso:"PGCIL",status:"commissioned Mar 2025",capacity:"3×1500 MVA"},
  nav:  {id:"nav",label:"Navsari (Digital)",lon:72.952,lat:20.950,type:"hub",voltage:"765/400kV",tso:"PGCIL",status:"commissioned Jan 2026",capacity:"World's 1st digital 765kV SS"},
  jkh:  {id:"jkh",label:"Jam Khambhaliya",lon:70.046,lat:22.200,type:"hub",voltage:"400/220kV GIS",tso:"PGCIL/AESL",status:"commissioned",capacity:""},
  padghe:{id:"padghe",label:"Padghe (MH)",lon:73.060,lat:19.370,type:"load",voltage:"765/400kV",tso:"MSETCL",status:"operational",capacity:"MH import point"},
  mumbai:{id:"mumbai",label:"Mumbai",lon:72.870,lat:19.078,type:"load",voltage:"400/220kV",tso:"MSETCL/TPC",status:"operational",capacity:"~4,000 MW demand"},
  pune:  {id:"pune",label:"Pune",lon:73.348,lat:18.620,type:"load",voltage:"400kV",tso:"MSETCL",status:"operational",capacity:"MH load centre"},
};
const MAP_LINES = [
  {id:"kps1-kps2",from:"kps1",to:"kps2",kv:765,ckm:5,tso:"AESL",status:"commissioned",phase:"Phase-I",label:"KPS1–KPS2 765kV D/C"},
  {id:"kps1-bhuj2",from:"kps1",to:"bhuj2",kv:765,ckm:30,tso:"AESL",status:"commissioned",phase:"Phase-I",label:"KPS1–Bhuj-II 765kV LILO"},
  {id:"kps2-bhuj",from:"kps2",to:"bhuj",kv:765,ckm:217,tso:"AESL",status:"commissioned",phase:"Phase-I",label:"KPS1/2–Bhuj 765kV D/C 217 ckm"},
  {id:"kps2-lak",from:"kps2",to:"lak",kv:765,ckm:140,tso:"AESL",status:"commissioned",phase:"Phase-II",label:"KPS2–Lakadia 765kV D/C"},
  {id:"lak-bhuj",from:"lak",to:"bhuj",kv:765,ckm:85,tso:"AESL",status:"commissioned",phase:"Phase-I",label:"Bhuj–Lakadia 765kV D/C"},
  {id:"lak-vad",from:"lak",to:"vad",kv:765,ckm:180,tso:"PGCIL",status:"commissioned",phase:"Phase-I",label:"Lakadia–Vadodara 765kV D/C"},
  {id:"kps3-banas",from:"kps3",to:"banas",kv:400,ckm:30,tso:"PGCIL",status:"commissioned",phase:"Phase-III",label:"KPS3–Banaskantha 400kV"},
  {id:"banas-ahm",from:"banas",to:"ahm",kv:765,ckm:270,tso:"PGCIL",status:"commissioned",phase:"Phase-III",label:"Banaskantha–Ahmedabad 765kV D/C 270 ckm"},
  {id:"ahm-nav",from:"ahm",to:"nav",kv:765,ckm:590,tso:"PGCIL",status:"commissioned",phase:"Phase-II Part C",label:"Ahmedabad–Navsari 765kV D/C 590 ckm"},
  {id:"ahm-vad",from:"ahm",to:"vad",kv:765,ckm:100,tso:"PGCIL",status:"commissioned",phase:"existing",label:"Ahmedabad–Vadodara 765kV"},
  {id:"nav-padghe",from:"nav",to:"padghe",kv:765,ckm:145,tso:"PGCIL/MSETCL",status:"commissioned",phase:"Phase-II Part C",label:"Navsari–Padghe 765kV D/C (MH corridor)"},
  {id:"padghe-mum",from:"padghe",to:"mumbai",kv:400,ckm:70,tso:"MSETCL/TPC",status:"operational",phase:"existing",label:"Padghe–Mumbai 400kV"},
  {id:"padghe-pune",from:"padghe",to:"pune",kv:400,ckm:90,tso:"MSETCL",status:"operational",phase:"existing",label:"Padghe–Pune 400kV"},
  {id:"kps4-banas",from:"kps4",to:"banas",kv:400,ckm:10,tso:"PGCIL",status:"planned",phase:"Phase-IV",label:"KPS4–Banaskantha 400kV"},
  {id:"kps5-kps4",from:"kps5",to:"kps4",kv:400,ckm:8,tso:"PGCIL",status:"planned",phase:"Phase-IV",label:"KPS5–KPS4 400kV"},
  {id:"jkh-lak",from:"jkh",to:"lak",kv:400,ckm:95,tso:"PGCIL",status:"commissioned",phase:"existing",label:"Jam Khambhaliya–Lakadia 400kV"},
  {id:"bhuj-jkh",from:"bhuj",to:"jkh",kv:765,ckm:80,tso:"PGCIL",status:"commissioned",phase:"existing",label:"Bhuj–Jam Khambhaliya 765kV"},
];

const VKV_COLORS={765:"#fbbf24",400:"#f97316",220:"#06b6d4"};
const STATUS_DASH={"commissioned":"none","commissioned Jul 2025":"none","commissioned Jan 2026":"none","commissioned Mar 2025":"none","commissioned Aug 2025":"none","planned":"8,5","operational":"none"};
const STATUS_OPACITY={"commissioned":1,"commissioned Jul 2025":1,"commissioned Jan 2026":1,"commissioned Mar 2025":1,"commissioned Aug 2025":1,"planned":0.4,"operational":0.7};
const NODE_COLORS={kps:"#3b82f6",hub:"#10b981",load:"#ef4444",nr:"#8b5cf6"};
const NODE_R={kps:11,hub:7,load:6,nr:5};

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════
const PALETTE=["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#84cc16","#ec4899","#6366f1","#14b8a6","#a855f7","#fb923c","#22d3ee","#d946ef","#4ade80","#facc15","#f87171","#60a5fa","#34d399"];
const PS_COLORS={"Khavda PS-I":"#3b82f6","Khavda PS-II":"#10b981","Khavda PS-III":"#f59e0b","Khavda PS-IV":"#ef4444","Khavda PS-V":"#8b5cf6"};
const V_COLORS={"220kV":"#06b6d4","400kV":"#f97316"};
function sumBy(arr,key){return arr.reduce((s,r)=>s+(r[key]||0),0);}
function consolidate(data){const m={};data.forEach(r=>{m[r.developer]=(m[r.developer]||0)+r.mw;});return Object.entries(m).map(([developer,mw])=>({developer,mw})).sort((a,b)=>b.mw-a.mw);}
function ptStr(pts){return pts.map(([x,y])=>`${x.toFixed(1)},${y.toFixed(1)}`).join(" ");}
function linePath([x1,y1],[x2,y2],c=0){if(!c)return`M${x1},${y1}L${x2},${y2}`;const mx=(x1+x2)/2+c,my=(y1+y2)/2-Math.abs(c)*0.3;return`M${x1},${y1}Q${mx},${my}${x2},${y2}`;}

// ═══════════════════════════════════════════════════════════════════════════
// SMALL SVG HELPER (avoids IIFE-in-JSX transpiler issues)


// ─── KhavdaREZone + PSKeyPanel ───
function KhavdaREZone(){
  const[x1,y1]=project(68.8,23.8);
  const[x2,y2]=project(70.0,22.9);
  return(<g><rect x={Math.min(x1,x2)} y={Math.min(y1,y2)} width={Math.abs(x2-x1)} height={Math.abs(y2-y1)} fill="#1a3030" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="7,4" rx="5" opacity="0.7"/><text x={(x1+x2)/2} y={Math.min(y1,y2)-5} fill="#60a5fa" fontSize="9" fontWeight="700" textAnchor="middle">Khavda RE Zone (30 GW)</text></g>);
}
function PSKeyPanel({psKey}){
  const rows=khavdaConnectivity.filter(r=>r.substation===psKey);
  const total=Math.round(sumBy(rows,"mw"));
  const devs=[...new Set(rows.map(r=>r.developer))];
  return(<div className="mt-2 pt-2 border-t border-gray-800">
    <div className="text-xs text-gray-400 mb-1">CTUIL Allocation: <span className="text-white font-bold">{total.toLocaleString()} MW</span> · {devs.length} entries</div>
    <div className="max-h-32 overflow-y-auto space-y-0.5">
      {devs.map((d,i)=>{
        const dmw=sumBy(rows.filter(r=>r.developer===d),"mw");
        return(<div key={i} className="flex justify-between text-xs py-0.5 border-b border-gray-800"><span className="text-gray-400 truncate pr-2" style={{maxWidth:165}}>{d}</span><span className="text-white font-mono shrink-0">{Math.round(dmw)}</span></div>);
      })}
    </div>
  </div>);
  
  return (
    <>
      <div>
        <h1>Connectivity Dashboard</h1>
               <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )

}

// ═══════════════════════════════════════════════════════════════════════════
// TRANSMISSION MAP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════


// ─── Transmission Map ───
function TransmissionMap(){
  const [hovNode,setHovNode]=useState(null);
  const [selNode,setSelNode]=useState(null);
  const [hovLine,setHovLine]=useState(null);
  const [filters,setFilters]=useState({kv765:true,kv400:true,planned:true});
  const [zoom,setZoom]=useState(1);
  const [pan,setPan]=useState({x:0,y:0});
  const [dragging,setDragging]=useState(false);
  const [dragStart,setDragStart]=useState(null);
  const [viewMode,setViewMode]=useState("geo");

  const nodePos={};
  Object.values(MAP_NODES).forEach(n=>{nodePos[n.id]=project(n.lon,n.lat);});

  // Schematic: hand-placed to eliminate all overlaps
  const SCHEM={
    kps1:[90,220], kps2:[90,290], kps3:[90,145], kps4:[90,72], kps5:[90,360],
    bhuj:[230,300], bhuj2:[230,220],
    lak:[370,265], banas:[310,100],
    ahm:[500,170], vad:[500,310],
    jkh:[310,390],
    nav:[630,240], padghe:[740,380], mumbai:[740,445], pune:[740,490],
  };

  const getPos=id=>viewMode==="schematic"?(SCHEM[id]||[0,0]):(nodePos[id]||[0,0]);

  const visLines=MAP_LINES.filter(l=>{
    if(!filters.kv765&&l.kv===765)return false;
    if(!filters.kv400&&l.kv===400)return false;
    if(!filters.planned&&l.status==="planned")return false;
    return true;
  });

  const svgRef=useRef(null);
  const onWheel=e=>{
    if(viewMode!=="geo")return;
    e.preventDefault();
    const factor=e.deltaY>0?0.85:1.18;
    const newZoom=Math.max(0.5,Math.min(5,zoom*factor));
    // zoom toward cursor position
    const rect=svgRef.current?.getBoundingClientRect();
    if(rect){
      const cx=e.clientX-rect.left;
      const cy=e.clientY-rect.top;
      const scaleRatio=newZoom/zoom;
      setPan(p=>({x:cx-(cx-p.x)*scaleRatio, y:cy-(cy-p.y)*scaleRatio}));
    }
    setZoom(newZoom);
  };
  const onMouseDown=e=>{
    if(viewMode!=="geo")return;
    setDragging(true);
    setDragStart({x:e.clientX-pan.x,y:e.clientY-pan.y});
  };
  const onMouseMove=e=>{if(!dragging||!dragStart)return;setPan({x:e.clientX-dragStart.x,y:e.clientY-dragStart.y});};
  const onMouseUp=()=>{setDragging(false);setDragStart(null);};

  const gujaratBorder=[[68.2,24.7],[68.8,24.7],[69.8,24.2],[70.5,24.6],[71.5,24.7],[72.1,24.4],[73.0,24.0],[74.0,23.3],[74.5,22.5],[74.4,21.5],[73.8,20.6],[73.2,20.2],[72.6,20.8],[72.0,21.1],[71.2,21.0],[70.5,21.3],[70.0,22.0],[69.2,22.3],[68.7,23.0],[68.2,23.5],[68.2,24.7]].map(([lo,la])=>project(lo,la));
  const mhBorder=[[72.6,20.2],[73.2,20.0],[73.8,19.8],[74.2,19.0],[74.5,18.5],[73.8,18.0],[73.0,18.2],[72.5,18.6],[72.0,19.2],[71.5,19.8],[72.0,20.2],[72.6,20.2]].map(([lo,la])=>project(lo,la));
  const rann=[[68.8,23.4],[70.5,23.8],[71.5,24.1],[72.0,23.9],[71.8,23.5],[70.5,23.2],[69.2,23.0],[68.8,23.4]].map(([lo,la])=>project(lo,la));

  const sel=selNode?MAP_NODES[selNode]:null;
  const selLine=hovLine?MAP_LINES.find(l=>l.id===hovLine):null;

  return(
    <div className="relative rounded-xl overflow-hidden border border-gray-700" style={{height:560}}>
      {/* Controls top-left */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2 items-center">
        {[{k:"kv765",l:"765 kV",c:"#fbbf24"},{k:"kv400",l:"400 kV",c:"#f97316"},{k:"planned",l:"Planned",c:"#6b7280"}].map(f=>(
          <button key={f.k} onClick={()=>setFilters(p=>({...p,[f.k]:!p[f.k]}))}
            className="text-xs px-2.5 py-1 rounded-full border font-medium transition-all"
            style={filters[f.k]?{background:f.c+"28",borderColor:f.c,color:f.c}:{background:"#1f2937",borderColor:"#374151",color:"#6b7280"}}>
            {f.l}
          </button>
        ))}
        {viewMode==="geo"&&(
          <div className="flex gap-1 ml-1">
            <button onClick={()=>setZoom(z=>Math.min(5,z*1.3))} className="bg-gray-800 hover:bg-gray-700 text-white w-7 h-7 rounded text-sm font-bold flex items-center justify-center">+</button>
            <button onClick={()=>setZoom(z=>Math.max(0.5,z*0.77))} className="bg-gray-800 hover:bg-gray-700 text-white w-7 h-7 rounded text-sm font-bold flex items-center justify-center">&#8722;</button>
            <button onClick={()=>{setZoom(1);setPan({x:0,y:0});}} className="bg-gray-800 hover:bg-gray-700 text-gray-400 px-2 h-7 rounded text-xs">&#8635;</button>
          </div>
        )}
      </div>

      {/* View toggle top-right */}
      <div className="absolute top-3 right-3 z-10 flex rounded-lg overflow-hidden border border-gray-600">
        {[{v:"geo",l:"Geographic"},{v:"schematic",l:"Schematic"}].map(opt=>(
          <button key={opt.v}
            onClick={()=>{setViewMode(opt.v);setZoom(1);setPan({x:0,y:0});setSelNode(null);}}
            className="text-xs px-3 py-1.5 font-medium transition-colors"
            style={viewMode===opt.v?{background:"#3b82f6",color:"white"}:{background:"#1f2937",color:"#6b7280"}}>
            {opt.l}
          </button>
        ))}
      </div>

      <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${MW} ${MH}`}
        style={{cursor:viewMode==="geo"?(dragging?"grabbing":"grab"):"default",background:"#0a1020",display:"block"}}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp} onWheel={onWheel}>

        {viewMode==="geo"?(
          <g transform={`translate(${pan.x},${pan.y}) scale(${zoom}) translate(${(1/zoom-1)*MW/2},${(1/zoom-1)*MH/2})`}>
            <rect x="-200" y="-200" width={MW+400} height={MH+400} fill="#0a1020"/>
            <polygon points={ptStr(gujaratBorder)} fill="#131f2e" stroke="#1e3a2f" strokeWidth="1.5"/>
            <polygon points={ptStr(rann)} fill="#1a2a1a" opacity="0.7"/>
            <text x={project(70.0,23.55)[0]} y={project(70.0,23.55)[1]} fill="#1f3525" fontSize="10" textAnchor="middle">Rann of Kutch</text>
            <polygon points={ptStr(mhBorder)} fill="#0f1c2e" stroke="#1e2a3f" strokeWidth="1"/>
            <text x={project(71.5,23.1)[0]} y={project(71.5,23.1)[1]} fill="#1e3a4a" fontSize="18" fontWeight="700" textAnchor="middle" opacity="0.4">GUJARAT</text>
            <text x={project(73.2,19.2)[0]} y={project(73.2,19.2)[1]} fill="#1e2a3a" fontSize="14" fontWeight="700" textAnchor="middle" opacity="0.35">MAHARASHTRA</text>
            <KhavdaREZone/>
            {visLines.map(line=>{
              const[x1,y1]=nodePos[line.from]||[0,0];
              const[x2,y2]=nodePos[line.to]||[0,0];
              const color=VKV_COLORS[line.kv]||"#6b7280";
              const dash=STATUS_DASH[line.status]||"8,5";
              const opacity=STATUS_OPACITY[line.status]||0.4;
              const isHov=hovLine===line.id;
              const w=line.kv===765?(isHov?4.5:2.5):(isHov?3:1.8);
              const curve=line.id==="lak-bhuj"?18:line.id==="kps2-lak"?-14:0;
              return(
                <g key={line.id}>
                  <path d={linePath([x1,y1],[x2,y2],curve)} fill="none" stroke="transparent" strokeWidth="14" style={{cursor:"pointer"}} onMouseEnter={()=>setHovLine(line.id)} onMouseLeave={()=>setHovLine(null)}/>
                  <path d={linePath([x1,y1],[x2,y2],curve)} fill="none" stroke={color} strokeWidth={w} strokeDasharray={dash} opacity={opacity} style={{pointerEvents:"none"}}/>
                </g>
              );
            })}
            {Object.values(MAP_NODES).map(node=>{
              const[x,y]=nodePos[node.id];
              const r=NODE_R[node.type];
              const color=NODE_COLORS[node.type];
              const isSel=selNode===node.id;
              const isHov=hovNode===node.id;
              const isKps=node.type==="kps";
              return(
                <g key={node.id} style={{cursor:"pointer"}} onMouseEnter={()=>setHovNode(node.id)} onMouseLeave={()=>setHovNode(null)} onClick={()=>setSelNode(selNode===node.id?null:node.id)}>
                  {(isSel||isHov)&&<circle cx={x} cy={y} r={r+10} fill={color} opacity="0.15"/>}
                  <circle cx={x} cy={y} r={r+4} fill={color} opacity={isSel?0.3:0.1}/>
                  <circle cx={x} cy={y} r={r} fill={color} stroke={isSel?"white":"rgba(255,255,255,0.25)"} strokeWidth={isSel?2:1}/>
                  {isKps&&<text x={x} y={y+3.5} fill="white" fontSize="8" fontWeight="800" textAnchor="middle">{node.label.replace("KPS-","")}</text>}
                  {(isKps||isHov||isSel)&&<text x={x} y={y-r-5} fill={isKps?"#93c5fd":node.type==="load"?"#fca5a5":"#a7f3d0"} fontSize={isKps?"9.5":"8"} fontWeight={isKps?"700":"500"} textAnchor="middle">{node.label}</text>}
                  {!isKps&&!isHov&&!isSel&&<text x={x+r+3} y={y+3} fill="#6b7280" fontSize="7">{node.label.split(" ")[0]}</text>}
                </g>
              );
            })}
            <g transform={`translate(16,${MH-130})`}>
              <rect x={0} y={0} width={185} height={125} rx="6" fill="#0d1117" stroke="#1f2937" strokeWidth="1" opacity="0.92"/>
              <text x={10} y={17} fill="#6b7280" fontSize="8" fontWeight="700" letterSpacing="1">LEGEND</text>
              {[{c:"#fbbf24",l:"765 kV ISTS (commissioned)",d:"none",y:32},{c:"#fbbf24",l:"765 kV ISTS (planned)",d:"8,4",y:47},{c:"#f97316",l:"400 kV ISTS Line",d:"none",y:62},{c:"#3b82f6",l:"Khavda Pooling Station",dot:true,y:77},{c:"#10b981",l:"Intermediate Substation",dot:true,y:92},{c:"#ef4444",l:"Load Centre (MH)",dot:true,y:107}].map((l,i)=>(
                <g key={i}>{l.dot?<circle cx={17} cy={l.y-3} r={5} fill={l.c}/>:<line x1={7} y1={l.y-3} x2={27} y2={l.y-3} stroke={l.c} strokeWidth={2.5} strokeDasharray={l.d}/>}<text x={32} y={l.y} fill="#d1d5db" fontSize="8">{l.l}</text></g>
              ))}
            </g>
            <g transform={`translate(${MW-36},32)`}>
              <circle r={14} fill="#0d1117" stroke="#374151" strokeWidth="1"/>
              <polygon points="0,-10 -3,5 0,2 3,5" fill="#9ca3af"/>
              <text x={0} y={-12} fill="#9ca3af" fontSize="7.5" textAnchor="middle" fontWeight="700">N</text>
            </g>
          </g>
        ):(
          <g>
            <rect width={MW} height={MH} fill="#08111e"/>
            {/* Zone bands */}
            <rect x={30}  y={40} width={120} height={MH-80} rx="8" fill="#3b82f6" fillOpacity="0.04" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.25"/>
            <rect x={160} y={40} width={290} height={MH-80} rx="8" fill="#fbbf24" fillOpacity="0.03" stroke="#fbbf24" strokeWidth="0.5" strokeOpacity="0.2"/>
            <rect x={460} y={40} width={175} height={MH-80} rx="8" fill="#fbbf24" fillOpacity="0.025" stroke="#fbbf24" strokeWidth="0.5" strokeOpacity="0.15"/>
            <rect x={645} y={40} width={160} height={MH-80} rx="8" fill="#f97316" fillOpacity="0.03" stroke="#f97316" strokeWidth="0.5" strokeOpacity="0.2"/>
            {[
              {label:"Khavda Cluster",sub:"5 Pooling Stations",x:90,c:"#3b82f6"},
              {label:"Gujarat Backbone",sub:"765 kV HVAC",x:305,c:"#fbbf24"},
              {label:"Gujarat Grid",sub:"Ahm · Vadodara",x:547,c:"#fbbf24"},
              {label:"Maharashtra",sub:"Padghe · Mumbai · Pune",x:725,c:"#f97316"},
            ].map((z,i)=>(
              <g key={i}>
                <text x={z.x} y={56} fill={z.c} fontSize="8.5" fontWeight="700" textAnchor="middle" opacity="0.7">{z.label}</text>
                <text x={z.x} y={67} fill="#374151" fontSize="6.5" textAnchor="middle">{z.sub}</text>
              </g>
            ))}
            {/* Lines */}
            {visLines.map(line=>{
              const p1=SCHEM[line.from],p2=SCHEM[line.to];
              if(!p1||!p2)return null;
              const[x1,y1]=p1,[x2,y2]=p2;
              const mx=(x1+x2)/2;
              const d=`M${x1},${y1}L${mx},${y1}L${mx},${y2}L${x2},${y2}`;
              const color=VKV_COLORS[line.kv]||"#6b7280";
              const isHov=hovLine===line.id;
              const w=line.kv===765?(isHov?5:3):(isHov?3.5:2);
              return(
                <g key={line.id}>
                  <path d={d} fill="none" stroke="transparent" strokeWidth="16" style={{cursor:"pointer"}} onMouseEnter={()=>setHovLine(line.id)} onMouseLeave={()=>setHovLine(null)}/>
                  {isHov&&<path d={d} fill="none" stroke={color} strokeWidth={w+6} opacity="0.12" strokeLinejoin="round"/>}
                  <path d={d} fill="none" stroke={color} strokeWidth={w}
                    strokeDasharray={STATUS_DASH[line.status]||"8,5"}
                    opacity={isHov?1:STATUS_OPACITY[line.status]||0.5} strokeLinejoin="round"/>
                  {isHov&&<text x={(x1+x2)/2} y={Math.min(y1,y2)-6} fill={color} fontSize="8" textAnchor="middle" fontWeight="600">{line.ckm} ckm</text>}
                </g>
              );
            })}
            {/* Nodes */}
            {Object.values(MAP_NODES).map(node=>{
              const sp=SCHEM[node.id];
              if(!sp)return null;
              const[x,y]=sp;
              const isKps=node.type==="kps";
              const isLoad=node.type==="load";
              const color=NODE_COLORS[node.type];
              const r=isKps?13:isLoad?9:8;
              const isSel=selNode===node.id;
              const isHov=hovNode===node.id;
              const isPlanned=node.status==="planned";
              return(
                <g key={node.id} style={{cursor:"pointer"}} onMouseEnter={()=>setHovNode(node.id)} onMouseLeave={()=>setHovNode(null)} onClick={()=>setSelNode(selNode===node.id?null:node.id)}>
                  {(isSel||isHov)&&<circle cx={x} cy={y} r={r+12} fill={color} opacity="0.1"/>}
                  {isKps?(
                    <rect x={x-r} y={y-r} width={r*2} height={r*2} rx="4"
                      fill={color} opacity={isSel?0.4:0.18}
                      stroke={isSel?"white":isPlanned?"#4b5563":color}
                      strokeWidth={isSel?2:1.5}
                      strokeDasharray={isPlanned?"5,3":"none"}/>
                  ):(
                    <circle cx={x} cy={y} r={r}
                      fill={color} opacity={isSel?0.45:0.18}
                      stroke={isSel?"white":isPlanned?"#4b5563":color}
                      strokeWidth={isSel?2:1.5}
                      strokeDasharray={isPlanned?"4,2":"none"}/>
                  )}
                  {isKps&&<text x={x} y={y+4} fill="white" fontSize="8.5" fontWeight="800" textAnchor="middle">{node.label.replace("KPS-","")}</text>}
                  <text x={x} y={y-r-7} fill={isKps?"#93c5fd":isLoad?"#fca5a5":"#a7f3d0"} fontSize={isKps?"9":"8"} fontWeight={isKps?"700":"500"} textAnchor="middle">{node.label}</text>
                  <text x={x} y={y+r+11} fill="#374151" fontSize="6.5" textAnchor="middle">{node.voltage.split("/")[0]}</text>
                  {isPlanned&&<text x={x} y={y+r+20} fill="#92400e" fontSize="6" textAnchor="middle">planned</text>}
                </g>
              );
            })}
            {/* Schematic legend */}
            <g transform={`translate(12,${MH-96})`}>
              <rect x={0} y={0} width={196} height={84} rx="5" fill="#08111e" stroke="#1e293b" strokeWidth="1" opacity="0.95"/>
              <text x={8} y={14} fill="#4b5563" fontSize="7.5" fontWeight="700" letterSpacing="1">LEGEND</text>
              {[
                {c:"#fbbf24",l:"765 kV commissioned",d:"none",y:28,lw:2.5},
                {c:"#f97316",l:"400 kV commissioned",d:"none",y:43,lw:2},
                {c:"#6b7280",l:"Planned line",d:"7,4",y:58,lw:2},
                {c:"#3b82f6",l:"Pooling station (KPS)",rect:true,y:73},
                {c:"#10b981",l:"Hub substation",dot:true,y:73},
              ].map((l,i)=>{
                const xoff=i>=3?(i===4?108:8):8;
                return(
                  <g key={i} transform={`translate(${xoff},0)`}>
                    {l.rect?<rect x={0} y={l.y-8} width={18} height={10} rx="2" fill={l.c} opacity="0.25" stroke={l.c} strokeWidth="1"/>
                    :l.dot?<circle cx={9} cy={l.y-3} r={5} fill={l.c} opacity="0.35" stroke={l.c} strokeWidth="1"/>
                    :<line x1={0} y1={l.y-3} x2={18} y2={l.y-3} stroke={l.c} strokeWidth={l.lw||2} strokeDasharray={l.d}/>}
                    <text x={24} y={l.y} fill="#9ca3af" fontSize="7.5">{l.l}</text>
                  </g>
                );
              })}
            </g>
            <text x={MW/2} y={MH-8} fill="#1e293b" fontSize="8" textAnchor="middle">Schematic — nodes de-overlapped for clarity. Click any node for details.</text>
          </g>
        )}
      </svg>

      {/* Node detail panel — same in both modes */}
      {sel&&(
        <div className="absolute top-12 right-3 bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-2xl z-20" style={{width:256,maxHeight:360,overflowY:"auto"}}>
          <div className="flex justify-between items-start mb-2">
            <div className="font-bold text-white text-sm leading-tight">{sel.label}</div>
            <button onClick={()=>setSelNode(null)} className="text-gray-500 hover:text-white ml-2 shrink-0 text-sm">&#10005;</button>
          </div>
          {[{k:"Voltage",v:sel.voltage},{k:"TSO",v:sel.tso},{k:"Status",v:sel.status},{k:"Note",v:sel.capacity||"—"},{k:"Coords",v:`${sel.lat.toFixed(3)}N, ${sel.lon.toFixed(3)}E`}].map(({k,v})=>(
            <div key={k} className="flex gap-2 text-xs mb-1">
              <span className="text-gray-500 w-14 shrink-0">{k}</span>
              <span className={v.includes("commission")?"text-green-400":v.includes("planned")?"text-yellow-400":"text-gray-300"}>{v}</span>
            </div>
          ))}
          {sel.psKey&&<PSKeyPanel psKey={sel.psKey}/>}
          {visLines.filter(l=>l.from===sel.id||l.to===sel.id).length>0&&(
            <div className="mt-2 pt-2 border-t border-gray-800">
              <div className="text-xs text-gray-500 mb-1">Connected lines</div>
              {visLines.filter(l=>l.from===sel.id||l.to===sel.id).map(l=>(
                <div key={l.id} className="flex items-center gap-1.5 text-xs py-0.5">
                  <div className="w-2 h-2 rounded-sm shrink-0" style={{background:VKV_COLORS[l.kv]}}/>
                  <span className="text-gray-400 truncate">{l.label}</span>
                  <span className="text-gray-600 ml-auto shrink-0">{l.ckm} ckm</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Line hover tooltip */}
      {selLine&&!sel&&(
        <div className="absolute bottom-4 left-3 bg-gray-900 border rounded-lg px-3 py-2 text-xs shadow-xl pointer-events-none z-20" style={{borderColor:VKV_COLORS[selLine.kv]}}>
          <div className="font-semibold text-white mb-0.5">{selLine.label}</div>
          <div className="flex gap-4 text-gray-400">
            <span>TSO: <span className="text-gray-200">{selLine.tso}</span></span>
            <span>~{selLine.ckm} ckm</span>
            <span>{selLine.phase}</span>
          </div>
          <div className={`mt-0.5 font-medium text-xs ${selLine.status.includes("commission")?"text-green-400":selLine.status==="planned"?"text-yellow-400":"text-blue-400"}`}>{selLine.status}</div>
        </div>
      )}

      {/* Geo zoom hint */}
      {viewMode==="geo"&&zoom===1&&(
        <div className="absolute bottom-4 right-3 text-xs text-gray-700 pointer-events-none">Scroll to zoom &middot; drag to pan</div>
      )}
    </div>
  );
}


// ─── Charts & Helpers ───
function MetricCard({label,value,sub,color}){
  return(<div className="bg-gray-800 border rounded-lg p-4 flex flex-col gap-1" style={{borderColor:color||"#374151",borderTopColor:color,borderTopWidth:color?3:1}}>
    <div className="text-gray-400 text-xs uppercase tracking-wider">{label}</div>
    <div className="text-2xl font-bold text-white">{value}</div>
    {sub&&<div className="text-gray-500 text-xs">{sub}</div>}
  </div>);
}
function SectionHeader({title,subtitle}){
  return(<div className="mb-4"><h2 className="text-lg font-semibold text-white">{title}</h2>{subtitle&&<p className="text-gray-400 text-sm">{subtitle}</p>}</div>);
}

// ═══════════════════════════════════════════════════════════════════════════
// SANKEY
// ═══════════════════════════════════════════════════════════════════════════
function SankeyDiagram({data}){
  const topDevs=useMemo(()=>{const c={};data.forEach(r=>{c[r.developer]=(c[r.developer]||0)+r.mw;});return Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,7).map(([d])=>d);},[data]);
  const stations=Object.keys(PS_COLORS);
  const W2=700,H2=340,BAR=12,col1x=10,col2x=270,col3x=530;
  const totalMW=data.reduce((s,r)=>s+r.mw,0);
  const scale=v=>Math.max(4,v/totalMW*(H2-60));
  const devMWs=topDevs.map(d=>data.filter(r=>r.developer===d).reduce((s,r)=>s+r.mw,0));
  const devH=devMWs.map(scale);
  const devGap=(H2-40-devH.reduce((s,h)=>s+h,0))/(topDevs.length+1);
  const devY=[];let cy=20;devH.forEach(h=>{cy+=devGap;devY.push(cy);cy+=h;});
  const psMWs=stations.map(ps=>data.filter(r=>r.substation===ps).reduce((s,r)=>s+r.mw,0));
  const psH=psMWs.map(scale);
  const psGap=(H2-40-psH.reduce((s,h)=>s+h,0))/(stations.length+1);
  const psY=[];cy=20;psH.forEach(h=>{cy+=psGap;psY.push(cy);cy+=h;});
  const vMWs=["220kV","400kV"].map(v=>data.filter(r=>r.voltage===v).reduce((s,r)=>s+r.mw,0));
  const vH=vMWs.map(scale);
  const vGap=(H2-40-vH.reduce((s,h)=>s+h,0))/3;
  const vY=[20+vGap,20+vGap+vH[0]+vGap];
  const devOut=Object.fromEntries(topDevs.map((d,i)=>[d,devY[i]]));
  const psIn=Object.fromEntries(stations.map((ps,i)=>[ps,psY[i]]));
  const psOut=Object.fromEntries(stations.map((ps,i)=>[ps,psY[i]]));
  const vIn={"220 kV":vY[0],"400 kV":vY[1]};
  const dpFlows=[];topDevs.forEach(dev=>stations.forEach(ps=>{const val=data.filter(r=>r.developer===dev&&r.substation===ps).reduce((s,r)=>s+r.mw,0);if(val>0)dpFlows.push({dev,ps,val});}));
  const pvFlows=[];stations.forEach(ps=>["220kV","400kV"].forEach(v=>{const val=data.filter(r=>r.substation===ps&&r.voltage===v).reduce((s,r)=>s+r.mw,0);if(val>0)pvFlows.push({ps,v:v.replace("V"," V"),val});}));
  const PSC=Object.values(PS_COLORS);
  const VC=["#06b6d4","#f97316"];
  return(<div className="overflow-x-auto"><svg width={W2} height={H2} viewBox={`0 0 ${W2} ${H2}`} className="w-full" style={{maxHeight:340}}>
    {dpFlows.map(({dev,ps,val},i)=>{
      const di=topDevs.indexOf(dev);
      const h=scale(val);
      const sy=devOut[dev];devOut[dev]+=h;
      const ty=psIn[ps];psIn[ps]+=h;
      const x1=col1x+BAR,x2=col2x,mx=(x1+x2)/2;
      return <path key={`dp${i}`} d={`M${x1},${sy}C${mx},${sy}${mx},${ty}${x2},${ty}L${x2},${ty+h}C${mx},${ty+h}${mx},${sy+h}${x1},${sy+h}Z`} fill={PALETTE[di%PALETTE.length]} opacity="0.35"/>;
    })}
    {pvFlows.map(({ps,v,val},i)=>{
      const pi=stations.indexOf(ps);
      const h=scale(val);
      const sy=psOut[ps];psOut[ps]+=h;
      const ty=vIn[v];vIn[v]+=h;
      const x1=col2x+BAR,x2=col3x,mx=(x1+x2)/2;
      return <path key={`pv${i}`} d={`M${x1},${sy}C${mx},${sy}${mx},${ty}${x2},${ty}L${x2},${ty+h}C${mx},${ty+h}${mx},${sy+h}${x1},${sy+h}Z`} fill={PSC[pi]} opacity="0.35"/>;
    })}
    {topDevs.map((d,i)=><g key={d}><rect x={col1x}y={devY[i]}width={BAR}height={devH[i]}fill={PALETTE[i%PALETTE.length]}rx="2"/><text x={col1x+BAR+4}y={devY[i]+devH[i]/2+4}fill="#e5e7eb"fontSize="8.5">{d.split(" ").slice(0,3).join(" ")}</text></g>)}
    {stations.map((ps,i)=><g key={ps}><rect x={col2x}y={psY[i]}width={BAR}height={psH[i]}fill={PSC[i]}rx="2"/><text x={col2x+BAR+4}y={psY[i]+psH[i]/2+4}fill="#e5e7eb"fontSize="8.5">{ps}</text></g>)}
    {["220 kV","400 kV"].map((v,i)=><g key={v}><rect x={col3x}y={vY[i]}width={BAR}height={vH[i]}fill={VC[i]}rx="2"/><text x={col3x+BAR+4}y={vY[i]+vH[i]/2+4}fill="#e5e7eb"fontSize="9"fontWeight="600">{v}</text><text x={col3x+BAR+4}y={vY[i]+vH[i]/2+15}fill="#9ca3af"fontSize="8">{Math.round(vMWs[i]).toLocaleString()} MW</text></g>)}
    {[["Developers (Top 7)",col1x],["Pooling Stations",col2x],["Voltage Level",col3x]].map(([l,x])=><text key={l}x={x+BAR/2}y={H2-5}fill="#6b7280"fontSize="9"textAnchor="middle">{l}</text>)}
  </svg></div>);
}

// ═══════════════════════════════════════════════════════════════════════════
// ARCHITECTURE DIAGRAM
// ═══════════════════════════════════════════════════════════════════════════
function ArchDiagram({data}){
  const totalMW=Math.round(data.reduce((s,r)=>s+r.mw,0));
  const t220=Math.round(data.filter(r=>r.voltage==="220kV").reduce((s,r)=>s+r.mw,0));
  const t400=Math.round(data.filter(r=>r.voltage==="400kV").reduce((s,r)=>s+r.mw,0));

  // Per-PS stats
  const psStats=Object.keys(PS_COLORS).map(ps=>{
    const rows=data.filter(r=>r.substation===ps);
    const mw=Math.round(sumBy(rows,"mw"));
    const v220=Math.round(sumBy(rows.filter(r=>r.voltage==="220kV"),"mw"));
    const v400=Math.round(sumBy(rows.filter(r=>r.voltage==="400kV"),"mw"));
    const devs=new Set(rows.map(r=>r.developer)).size;
    const tso=ps==="Khavda PS-I"||ps==="Khavda PS-IV"?"AESL":"PGCIL";
    const status=ps==="Khavda PS-IV"||ps==="Khavda PS-V"?"planned":"commissioned";
    const hvdc=ps==="Khavda PS-III"?"HVDC Phase-V (Dec 2026)":null;
    return {ps,mw,v220,v400,devs,tso,status,hvdc,c:PS_COLORS[ps]};
  });

  const W=760,H=820;
  const col=(i,n,W,pad=40)=>pad+(i*(W-2*pad))/(n-1);

  // Layer Y positions
  const yGen=38, yBus=145, yPS=265, yIsts=410, yEvac=530, yLoad=700;

  // Generation source blocks
  const genBlocks=[
    {l:"Wind",sub:"Adani Wind · Inox · Continuum · ReNew + 8 others",mw:Math.round(sumBy(data.filter(r=>r.developer.toLowerCase().includes("wind")||r.group==="Inox Group"),"mw")),c:"#3b82f6",x:30},
    {l:"Solar",sub:"NTPC · GSECL · Avaada · GIPCL · Sarjan + more",mw:Math.round(sumBy(data.filter(r=>r.group==="GSECL"||r.group==="GIPCL"||r.group==="Avaada Group"||r.group==="Sarjan Group"),"mw")),c:"#f59e0b",x:220},
    {l:"Hybrid RE",sub:"Sprng Energy · ACME · Azure Power · JSW",mw:Math.round(sumBy(data.filter(r=>r.group==="Sprng Energy"||r.group==="ACME Group"||r.group==="Azure Power"||r.group==="JSW Group"),"mw")),c:"#10b981",x:420},
    {l:"Large-scale IPP",sub:"Adani Green · Adani Power · Reliance · NHPC · NLC",mw:Math.round(sumBy(data.filter(r=>r.group==="Adani Group"||r.group==="Reliance Group"||r.group==="NHPC"),"mw")),c:"#6366f1",x:590},
  ];

  // Voltage bus blocks
  const busBocks=[
    {l:"220 kV Bus",sub:`${(t220/1000).toFixed(1)} GW · PS-I, II, V`,c:"#06b6d4",x:120,w:180},
    {l:"400 kV Bus",sub:`${(t400/1000).toFixed(1)} GW · PS-II, III, IV, V`,c:"#f97316",x:350,w:180},
    {l:"BESS",sub:"217.64 MW · PS-V Bay 5\nH.G. Banaskantha",c:"#a855f7",x:580,w:150},
  ];

  // Evacuation corridor segments
  const corridors=[
    {l:"Corridor A",route:"KPS1/2 → Bhuj → Lakadia → Vadodara",kv:"765 kV D/C",ckm:"~430 ckm",tso:"AESL",status:"commissioned",c:"#fbbf24",x:30,w:200},
    {l:"Corridor B",route:"KPS3 → Banaskantha → Ahmedabad",kv:"765 kV D/C",ckm:"~300 ckm",tso:"PGCIL",status:"commissioned",c:"#fbbf24",x:250,w:200},
    {l:"Corridor C",route:"Ahmedabad → Navsari → Padghe",kv:"765 kV D/C",ckm:"~735 ckm",tso:"PGCIL/MSETCL",status:"commissioned",c:"#fbbf24",x:470,w:200},
    {l:"Phase-V HVDC",route:"KPS-III → ±800 kV HVDC",kv:"HVDC ±800 kV",ckm:"~1,000 ckm est.",tso:"PGCIL",status:"planned",c:"#a78bfa",x:690,w:60},
  ];

  // Load / offtake nodes
  const loads=[
    {l:"Western Region Grid",sub:"Vadodara · Lakadia hub\nRLDC / WRLDC dispatch",c:"#6b7280",x:60,w:155},
    {l:"Gujarat Load",sub:"GUVNL / DISCOMS\nDomestic consumption",c:"#10b981",x:235,w:140},
    {l:"Mumbai Metro",sub:"MSETCL → Padghe\n400 kV onward to TPC/BEST",c:"#f97316",x:395,w:145},
    {l:"Pune / Rest MH",sub:"MSETCL network\nMSEDCL DISCOMS",c:"#f97316",x:560,w:130},
    {l:"Northern Grid",sub:"Inter-regional transfer\nvia Vadodara 765 kV",c:"#6b7280",x:710,w:40},
  ];

  const bw=128, bh=72;

  return(
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-4 overflow-x-auto">
      {/* Layer labels */}
      <div className="flex text-xs text-gray-600 font-semibold uppercase tracking-widest mb-2 pl-1 gap-0">
        {[
          {l:"① Generation",w:"14%"},{l:"② Voltage Bus",w:"14%"},{l:"③ Pooling Stations",w:"14%"},
          {l:"④ 765 kV ISTS Backbone",w:"14%"},{l:"⑤ Evacuation Corridors",w:"14%"},{l:"⑥ Load / Offtake",w:"14%"},
        ].map(lbl=>(
          <div key={lbl.l} style={{flex:1}} className="text-center text-gray-600 text-xs">{lbl.l}</div>
        ))}
      </div>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{minWidth:700}}>
        <defs>
          <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#4b5563"/>
          </marker>
          <marker id="arr-y" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#fbbf24"/>
          </marker>
          <marker id="arr-o" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#f97316"/>
          </marker>
        </defs>

        {/* ── LAYER BANDS ── */}
        {[
          {y:yGen-16,h:94,c:"#3b82f6",label:"GENERATION"},
          {y:yBus-16,h:82,c:"#06b6d4",label:"VOLTAGE INJECTION BUS"},
          {y:yPS-16,h:108,c:"#10b981",label:"POOLING STATIONS (ISTS)"},
          {y:yIsts-16,h:82,c:"#fbbf24",label:"765 kV ISTS BACKBONE"},
          {y:yEvac-16,h:130,c:"#f97316",label:"EVACUATION CORRIDORS"},
          {y:yLoad-16,h:100,c:"#6b7280",label:"LOAD / OFFTAKE"},
        ].map((band,i)=>(
          <g key={i}>
            <rect x={0} y={band.y} width={W} height={band.h} fill={band.c} opacity="0.04" rx="4"/>
            <rect x={0} y={band.y} width={3} height={band.h} fill={band.c} opacity="0.5" rx="1"/>
            <text x={8} y={band.y+11} fill={band.c} fontSize="7.5" fontWeight="700" opacity="0.5" letterSpacing="1">{band.label}</text>
          </g>
        ))}

        {/* ── GENERATION BLOCKS ── */}
        {genBlocks.map((b,i)=>(
          <g key={b.l}>
            <rect x={b.x} y={yGen} width={175} height={62} rx="7" fill={b.c} opacity="0.12" stroke={b.c} strokeWidth="1.2"/>
            <text x={b.x+88} y={yGen+15} fill="white" fontSize="9.5" fontWeight="700" textAnchor="middle">{b.l}</text>
            <text x={b.x+88} y={yGen+27} fill="#9ca3af" fontSize="7.5" textAnchor="middle">{b.sub.split("·")[0].trim()}</text>
            <text x={b.x+88} y={yGen+38} fill="#6b7280" fontSize="7" textAnchor="middle">{b.sub.split("·").slice(1).join("·").trim()}</text>
            {b.mw>0&&<text x={b.x+88} y={yGen+52} fill={b.c} fontSize="8.5" fontWeight="800" textAnchor="middle">{(b.mw/1000).toFixed(1)} GW allocated</text>}
          </g>
        ))}

        {/* Gen → Bus connector lines */}
        {[88,308,508,677].map((x,i)=>(
          <line key={i} x1={x} y1={yGen+62} x2={x} y2={yBus-2} stroke="#374151" strokeWidth="1.2" strokeDasharray="3,3" markerEnd="url(#arr)"/>
        ))}

        {/* ── VOLTAGE BUS BLOCKS ── */}
        {busBocks.map((b,i)=>(
          <g key={b.l}>
            <rect x={b.x} y={yBus} width={b.w} height={52} rx="7" fill={b.c} opacity="0.15" stroke={b.c} strokeWidth="1.5"/>
            <text x={b.x+b.w/2} y={yBus+16} fill="white" fontSize="10" fontWeight="700" textAnchor="middle">{b.l}</text>
            <text x={b.x+b.w/2} y={yBus+30} fill="#e5e7eb" fontSize="9" fontWeight="600" textAnchor="middle">{b.sub.split("\n")[0]}</text>
            {b.sub.split("\n")[1]&&<text x={b.x+b.w/2} y={yBus+42} fill="#9ca3af" fontSize="7.5" textAnchor="middle">{b.sub.split("\n")[1]}</text>}
          </g>
        ))}

        {/* Bus → PS connectors */}
        {[210,440,655].map((x,i)=>(
          <line key={i} x1={x} y1={yBus+52} x2={x} y2={yPS-2} stroke="#374151" strokeWidth="1.2" strokeDasharray="3,3" markerEnd="url(#arr)"/>
        ))}

        {/* ── POOLING STATION BLOCKS ── */}
        {psStats.map((ps,i)=>{
          const x=10+i*148, w=134, h=82;
          const isPlanned=ps.status==="planned";
          return(
            <g key={ps.ps}>
              <rect x={x} y={yPS} width={w} height={h} rx="7" fill={ps.c} opacity={isPlanned?0.1:0.18} stroke={ps.c} strokeWidth={isPlanned?1:1.8} strokeDasharray={isPlanned?"6,3":"none"}/>
              {/* TSO badge */}
              <rect x={x+w-38} y={yPS+4} width={34} height={13} rx="3" fill={ps.tso==="AESL"?"#1e3a5f":"#1a3320"} opacity="0.9"/>
              <text x={x+w-21} y={yPS+13} fill={ps.tso==="AESL"?"#60a5fa":"#4ade80"} fontSize="7" fontWeight="700" textAnchor="middle">{ps.tso}</text>
              {/* Status badge */}
              <rect x={x+4} y={yPS+4} width={isPlanned?38:52} height={13} rx="3" fill={isPlanned?"#451a03":"#052e16"} opacity="0.9"/>
              <text x={x+4+(isPlanned?19:26)} y={yPS+13} fill={isPlanned?"#fb923c":"#4ade80"} fontSize="7" fontWeight="600" textAnchor="middle">{isPlanned?"Planned":"Commissioned"}</text>
              <text x={x+w/2} y={yPS+32} fill="white" fontSize="9" fontWeight="700" textAnchor="middle">{ps.ps.replace("Khavda ","")}</text>
              <text x={x+w/2} y={yPS+46} fill="#e5e7eb" fontSize="11" fontWeight="800" textAnchor="middle">{(ps.mw/1000).toFixed(1)} GW</text>
              <text x={x+w/2} y={yPS+58} fill="#6b7280" fontSize="7" textAnchor="middle">{ps.devs} entries</text>
              {/* Voltage pills */}
              <g>
                {ps.v220>0&&<><rect x={x+4} y={yPS+63} width={60} height={13} rx="3" fill="#164e63" opacity="0.8"/><text x={x+34} y={yPS+72} fill="#22d3ee" fontSize="6.5" fontWeight="600" textAnchor="middle">{Math.round(ps.v220/1000*10)/10}GW 220kV</text></>}
                {ps.v400>0&&<><rect x={x+68} y={yPS+63} width={60} height={13} rx="3" fill="#431407" opacity="0.8"/><text x={x+98} y={yPS+72} fill="#fb923c" fontSize="6.5" fontWeight="600" textAnchor="middle">{Math.round(ps.v400/1000*10)/10}GW 400kV</text></>}
              </g>
              {ps.hvdc&&<><rect x={x+4} y={yPS+79} width={w-8} height={0} rx="0" fill="none"/></>}
            </g>
          );
        })}

        {/* PS → ISTS backbone connectors */}
        {[77,225,373,477,625].map((x,i)=>(
          <line key={i} x1={x} y1={yPS+82} x2={x} y2={yIsts-2} stroke={Object.values(PS_COLORS)[i]} strokeWidth="1.5" opacity="0.7" markerEnd="url(#arr-y)"/>
        ))}

        {/* ── 765 kV ISTS BACKBONE ── */}
        <rect x={10} y={yIsts} width={W-20} height={52} rx="8" fill="#fbbf24" opacity="0.1" stroke="#fbbf24" strokeWidth="1.8"/>
        <text x={W/2} y={yIsts+18} fill="white" fontSize="11" fontWeight="800" textAnchor="middle">765 kV ISTS Backbone — Western Region (WRPC)</text>
        <text x={W/2} y={yIsts+32} fill="#fcd34d" fontSize="8" textAnchor="middle">KPS1/2 → Bhuj (217 ckm) → Lakadia → Vadodara   ·   KPS3 → Banaskantha (30 ckm) → Ahmedabad (270 ckm)</text>
        <text x={W/2} y={yIsts+44} fill="#9ca3af" fontSize="7.5" textAnchor="middle">AESL corridor (west) · PGCIL corridor (north-east) · Total backbone ~800 ckm commissioned</text>

        {/* ISTS → Corridors */}
        {[110,340,570,725].map((x,i)=>(
          <line key={i} x1={x} y1={yIsts+52} x2={x} y2={yEvac-2} stroke={i===3?"#a78bfa":"#fbbf24"} strokeWidth={i===3?1.5:1.8} strokeDasharray={i===3?"6,3":"none"} opacity="0.6" markerEnd={i===3?"url(#arr)":"url(#arr-y)"}/>
        ))}

        {/* ── EVACUATION CORRIDORS ── */}
        {corridors.map((c,i)=>{
          const isPlanned=c.status==="planned";
          return(
            <g key={c.l}>
              <rect x={c.x} y={yEvac} width={c.w} height={100} rx="7" fill={c.c} opacity={isPlanned?0.07:0.12} stroke={c.c} strokeWidth={isPlanned?1:1.5} strokeDasharray={isPlanned?"6,3":"none"}/>
              <text x={c.x+c.w/2} y={yEvac+16} fill={c.c} fontSize="8.5" fontWeight="700" textAnchor="middle">{c.l}</text>
              <text x={c.x+c.w/2} y={yEvac+30} fill="white" fontSize="7.5" textAnchor="middle">{c.route.split("→")[0].trim()} →</text>
              <text x={c.x+c.w/2} y={yEvac+41} fill="white" fontSize="7.5" textAnchor="middle">{c.route.split("→").slice(1).join("→")}</text>
              <text x={c.x+c.w/2} y={yEvac+55} fill={c.c} fontSize="8" fontWeight="600" textAnchor="middle">{c.kv}</text>
              <text x={c.x+c.w/2} y={yEvac+67} fill="#9ca3af" fontSize="7.5" textAnchor="middle">{c.ckm}</text>
              <rect x={c.x+c.w/2-28} y={yEvac+72} width={56} height={12} rx="3" fill={isPlanned?"#451a03":"#052e16"} opacity="0.8"/>
              <text x={c.x+c.w/2} y={yEvac+80} fill={isPlanned?"#fb923c":"#4ade80"} fontSize="6.5" fontWeight="600" textAnchor="middle">{isPlanned?"Planned":"Commissioned"}</text>
              <text x={c.x+c.w/2} y={yEvac+94} fill="#6b7280" fontSize="7" textAnchor="middle">TSO: {c.tso}</text>
            </g>
          );
        })}

        {/* Corridors → Load nodes */}
        {[110,340,545,640,725].map((x,i)=>(
          <line key={i} x1={x} y1={yEvac+100} x2={x} y2={yLoad-2} stroke={i>=2?"#f97316":"#6b7280"} strokeWidth="1.2" strokeDasharray="3,3" opacity="0.5" markerEnd="url(#arr-o)"/>
        ))}

        {/* ── LOAD / OFFTAKE ── */}
        {loads.map((l,i)=>(
          <g key={l.l}>
            <rect x={l.x} y={yLoad} width={l.w} height={68} rx="7" fill={l.c} opacity="0.1" stroke={l.c} strokeWidth="1.2"/>
            <text x={l.x+l.w/2} y={yLoad+16} fill="white" fontSize="8.5" fontWeight="700" textAnchor="middle">{l.l}</text>
            <text x={l.x+l.w/2} y={yLoad+30} fill="#9ca3af" fontSize="7" textAnchor="middle">{l.sub.split("\n")[0]}</text>
            <text x={l.x+l.w/2} y={yLoad+41} fill="#6b7280" fontSize="6.5" textAnchor="middle">{l.sub.split("\n")[1]}</text>
          </g>
        ))}

        {/* Total MW footer */}
        <text x={W/2} y={H-6} fill="#374151" fontSize="9" textAnchor="middle">
          Total ISTS Connectivity (CTUIL Aug 2025): {totalMW.toLocaleString()} MW across 5 pooling stations · 220 kV: {t220.toLocaleString()} MW · 400 kV: {t400.toLocaleString()} MW
        </text>
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// POWER FLOW SIMULATOR
// ═══════════════════════════════════════════════════════════════════════════

// Corridor definitions: ordered waypoints through the real topology


// ─── Power Flow Simulator ───
// Timeline milestones mapped to numeric indices for the slider
const SIM_MILESTONES = [
  { idx:0, label:"Pre-2025",    date:"Before Jan 2025", gw:0,  corridors:{"corr-a":false,"corr-b":false,"corr-c":false,"corr-d":false}, note:"Planning phase. No ISTS evacuation capacity online." },
  { idx:1, label:"Jan 2025",    date:"Jan 2025",        gw:3,  corridors:{"corr-a":true, "corr-b":false,"corr-c":false,"corr-d":false}, note:"KPS-I Section-II SCOD (4x1500 MVA). Phase-I western corridor active." },
  { idx:2, label:"Mar 2025",    date:"Mar 2025",        gw:8,  corridors:{"corr-a":true, "corr-b":false,"corr-c":false,"corr-d":false}, note:"Khavda Phase-II Parts A-D commissioned (PGCIL, 4.5 GW). KPS-II online." },
  { idx:3, label:"Jul 2025",    date:"Jul 2025",        gw:10, corridors:{"corr-a":true, "corr-b":false,"corr-c":false,"corr-d":false}, note:"Banaskantha-Ahmedabad 765kV D/C (~270 ckm) commissioned." },
  { idx:4, label:"Aug 2025",    date:"Aug 2025",        gw:14, corridors:{"corr-a":true, "corr-b":true, "corr-c":false,"corr-d":false}, note:"KPS-3 commissioned (DOCO 18 Aug 2025, PGCIL). Northern corridor partially active." },
  { idx:5, label:"Jan 2026",    date:"Jan 2026",        gw:18, corridors:{"corr-a":true, "corr-b":true, "corr-c":false,"corr-d":false}, note:"Ahmedabad-Navsari 765kV D/C (~590 ckm) commissioned. Full MH export corridor live." },
  { idx:6, label:"Aug 2026",    date:"Aug 2026 (plan)", gw:22, corridors:{"corr-a":true, "corr-b":true, "corr-c":true, "corr-d":false}, note:"KPS-IV SCOD target (AESL). Eastern expansion corridor opens." },
  { idx:7, label:"Dec 2026",    date:"Dec 2026 (plan)", gw:26, corridors:{"corr-a":true, "corr-b":true, "corr-c":true, "corr-d":false}, note:"GSECL 2.3GW Khavda Solar Park full commissioning target. Peak HVAC capacity." },
  { idx:8, label:"Mar 2027",    date:"Mar 2027 (plan)", gw:30, corridors:{"corr-a":true, "corr-b":true, "corr-c":true, "corr-d":true }, note:"Phase-V HVDC commissioned. Full 30 GW target capacity reached." },
];

const CORRIDORS = [
  { id:"corr-a", label:"Corridor A", fullLabel:"Western Gujarat Backbone",
    color:"#fbbf24", nodes:["kps1","kps2","bhuj","lak","vad"],
    description:"KPS-1/2 to Bhuj (217 ckm) to Lakadia to Vadodara to WR Grid",
    phase:"Phase I-II", maxGW:15,
    why:"First corridor built. AESL-owned 765 kV D/C spine carrying Phase-I/II generation westward into the Western Region grid at Vadodara." },
  { id:"corr-b", label:"Corridor B", fullLabel:"Northern Gujarat / Maharashtra Export",
    color:"#f97316", nodes:["kps3","banas","ahm","nav","padghe","mumbai"],
    description:"KPS-3 to Banaskantha to Ahmedabad to Navsari to Padghe to Mumbai",
    phase:"Phase III-IV", maxGW:10,
    why:"PGCIL-built northern route. Ahmedabad-Navsari 765 kV D/C (~590 ckm) commissioned Jan 2026. Enables direct Khavda-to-Maharashtra export through the world's first digital 765 kV substation at Navsari." },
  { id:"corr-c", label:"Corridor C", fullLabel:"Eastern Expansion",
    color:"#06b6d4", nodes:["kps4","kps5","banas","ahm","vad"],
    description:"KPS-4/5 to Banaskantha to Ahmedabad to Vadodara",
    phase:"Phase IV (planned)", maxGW:7, planned:true,
    why:"Phase-IV expansion adding KPS-4 (AESL, SCOD Aug 2026) and KPS-5. Routes eastward through Banaskantha GIS into the Ahmedabad-Vadodara 765 kV backbone." },
  { id:"corr-d", label:"Corridor D", fullLabel:"HVDC Phase-V",
    color:"#a78bfa", nodes:["kps3","banas","ahm","nav","padghe","pune"],
    description:"KPS-3 HVDC terminal to 800 kV HVDC to Pune / Maharashtra",
    phase:"Phase V (planned Dec 2026)", maxGW:4, planned:true,
    why:"800 kV HVDC bulk transfer (~4 GW, ~1000 ckm). Eliminates reactive power constraints of long HVAC corridors. KPS-III HVDC TSA signed 2024. Dedicated Maharashtra delivery." },
];

const GEN_NODES=[
  {id:"gen-wind",  label:"Wind",   lon:68.85,lat:23.60,color:"#3b82f6",mwFraction:0.45},
  {id:"gen-solar", label:"Solar",  lon:68.80,lat:23.20,color:"#f59e0b",mwFraction:0.45},
  {id:"gen-hybrid",label:"Hybrid", lon:69.00,lat:23.80,color:"#10b981",mwFraction:0.10},
];

function simLineStyle(mw){
  if(mw<=0)    return{color:"#1f2937",width:1.5,opacity:0.2};
  if(mw<1000)  return{color:"#06b6d4",width:2.5,opacity:0.7};
  if(mw<3000)  return{color:"#f97316",width:4,  opacity:0.85};
  return             {color:"#fbbf24",width:6,  opacity:1};
}

// Schematic positions - hand placed, zero overlap
const SIM_SCHEMA={
  "gen-wind":[52,130], "gen-solar":[52,290], "gen-hybrid":[52,210],
  kps1:[168,215], kps2:[168,285], kps3:[168,140], kps4:[168,68], kps5:[168,355],
  bhuj:[300,270], bhuj2:[300,185],
  lak:[425,250], banas:[365,95],
  ahm:[525,168], vad:[525,308],
  jkh:[420,388],
  nav:[640,230], padghe:[750,325], mumbai:[750,400], pune:[750,455],
};
const SIM_W=820, SIM_H=510;

function NodeTooltip({node, x, y, mw, glow}){
  const tx=x>SIM_W*0.7?x-148:x+16;
  const ty=y>SIM_H*0.78?y-80:y+12;
  const flowText=mw>0?(mw>=1000?`${(mw/1000).toFixed(2)} GW`:`${mw} MW`)+" flowing":"No flow";
  const statusColor=node.status.includes("commission")?"#4ade80":"#fb923c";
  return(
    <g>
      <rect x={tx} y={ty} width={144} height={70} rx="5" fill="#0f172a" stroke="#334155" strokeWidth="1" opacity="0.97"/>
      <text x={tx+8} y={ty+15} fill="white" fontSize="9" fontWeight="700">{node.label}</text>
      <text x={tx+8} y={ty+27} fill="#6b7280" fontSize="7.5">{node.voltage}</text>
      <text x={tx+8} y={ty+39} fill="#9ca3af" fontSize="7.5">TSO: {node.tso}</text>
      <text x={tx+8} y={ty+52} fill={mw>0?glow:"#4b5563"} fontSize="8" fontWeight="600">{flowText}</text>
      <text x={tx+8} y={ty+63} fill={statusColor} fontSize="6.5">{node.status}</text>
    </g>
  );
}

function PowerFlowSimulator(){
  const [milestoneIdx,setMilestoneIdx]=useState(5); // Jan 2026 default
  const [manualGW,setManualGW]=useState(null); // null = use milestone GW
  const [activeCorridors,setActiveCorridors]=useState(SIM_MILESTONES[5].corridors);
  const [playing,setPlaying]=useState(true);
  const [hovNode,setHovNode]=useState(null);
  const [selCorrId,setSelCorrId]=useState(null);
  const [tick,setTick]=useState(0);
  const [mode,setMode]=useState("timeline"); // "timeline" | "manual"

  const milestone=SIM_MILESTONES[milestoneIdx];

  // When timeline mode changes milestone, sync corridors + GW
  const applyMilestone=idx=>{
    const m=SIM_MILESTONES[idx];
    setMilestoneIdx(idx);
    setActiveCorridors(m.corridors);
    setManualGW(null);
  };

  const dispatchGW=manualGW!==null?manualGW:milestone.gw;

  useEffect(()=>{
    if(!playing)return;
    let fid,last=0;
    const loop=ts=>{
      if(ts-last>50){setTick(t=>(t+1)%1000);last=ts;}
      fid=requestAnimationFrame(loop);
    };
    fid=requestAnimationFrame(loop);
    return()=>cancelAnimationFrame(fid);
  },[playing]);

  const totalCap=CORRIDORS.filter(c=>activeCorridors[c.id]).reduce((s,c)=>s+c.maxGW,0)||1;

  const corridorMW=useMemo(()=>{
    const r={};
    CORRIDORS.forEach(c=>{
      r[c.id]=activeCorridors[c.id]?Math.round(dispatchGW*(c.maxGW/totalCap)*1000):0;
    });
    return r;
  },[dispatchGW,activeCorridors,totalCap]);

  const lineMW=useMemo(()=>{
    const m={};
    CORRIDORS.forEach(corr=>{
      const mw=corridorMW[corr.id]||0;
      if(!mw)return;
      for(let i=0;i<corr.nodes.length-1;i++){
        const k=[corr.nodes[i],corr.nodes[i+1]].sort().join("--");
        m[k]=(m[k]||0)+mw;
      }
    });
    return m;
  },[corridorMW]);

  const nodeMW=useMemo(()=>{
    const nm={};
    CORRIDORS.forEach(corr=>{
      const mw=corridorMW[corr.id]||0;
      corr.nodes.forEach(n=>{nm[n]=(nm[n]||0)+mw;});
    });
    GEN_NODES.forEach(gn=>{nm[gn.id]=Math.round(dispatchGW*gn.mwFraction*1000);});
    return nm;
  },[corridorMW,dispatchGW]);

  function flowDash(mw,idx){
    const speed=Math.max(0.4,Math.min(4,mw/2500));
    const offset=((tick*speed*2)+(idx*14))%28;
    return{strokeDasharray:"14 14",strokeDashoffset:-offset};
  }
  function nodeGlow(id){
    const mw=nodeMW[id]||0;
    if(mw>5000)return"#fbbf24";
    if(mw>2000)return"#f97316";
    if(mw>300) return"#06b6d4";
    return"#1e293b";
  }

  const selCorr=selCorrId?CORRIDORS.find(c=>c.id===selCorrId):null;
  const dispatchMW=Math.round(dispatchGW*1000);

  const activeSegKeys=new Set();
  if(selCorr){
    for(let i=0;i<selCorr.nodes.length-1;i++){
      activeSegKeys.add([selCorr.nodes[i],selCorr.nodes[i+1]].sort().join("--"));
    }
  }

  return(
    <div className="space-y-4">

      {/* Narrative header */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
        <div className="flex flex-wrap gap-6 items-start">
          <div className="flex-1 min-w-64">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">What this shows</div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Renewable power generated at Khavda flows through pooling stations into the 765 kV ISTS backbone,
              then splits across evacuation corridors to serve the Western Region grid and Maharashtra.
              Use the <span className="text-yellow-400 font-medium">timeline slider</span> to step through actual commissioning milestones,
              or switch to <span className="text-blue-400 font-medium">manual mode</span> to freely adjust dispatch and active corridors.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center shrink-0">
            {[
              {label:"Dispatching",  value:`${dispatchGW} GW`, sub:`of 30 GW target`,     color:"#fbbf24"},
              {label:"Active corr.", value:CORRIDORS.filter(c=>activeCorridors[c.id]).length, sub:"of 4 corridors", color:"#10b981"},
              {label:"Western flow", value:`${((corridorMW["corr-a"]||0)/1000).toFixed(1)} GW`, sub:"Corridor A", color:"#fbbf24"},
              {label:"MH export",    value:`${(((corridorMW["corr-b"]||0)+(corridorMW["corr-d"]||0))/1000).toFixed(1)} GW`, sub:"B+D", color:"#f97316"},
            ].map((s,i)=>(
              <div key={i} className="bg-gray-900 rounded-lg px-4 py-2 min-w-28">
                <div className="text-xs text-gray-500 mb-0.5">{s.label}</div>
                <div className="text-xl font-bold" style={{color:s.color}}>{s.value}</div>
                <div className="text-xs text-gray-600">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <div className="flex border-b border-gray-700">
          {[{v:"timeline",l:"Timeline — step through commissioning history"},{v:"manual",l:"Manual — free dispatch control"}].map(t=>(
            <button key={t.v} onClick={()=>setMode(t.v)}
              className="px-4 py-2.5 text-xs font-medium transition-colors"
              style={mode===t.v?{background:"#1e3a5f",color:"#93c5fd",borderBottom:"2px solid #3b82f6"}:{color:"#6b7280"}}>
              {t.l}
            </button>
          ))}
          <div className="ml-auto flex items-center px-4">
            <button onClick={()=>setPlaying(p=>!p)}
              className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${playing?"bg-yellow-500 border-yellow-400 text-gray-900":"bg-gray-700 border-gray-600 text-gray-300"}`}>
              {playing?"Pause":"Play"}
            </button>
          </div>
        </div>

        <div className="p-4">
          {mode==="timeline"?(
            <div>
              {/* Timeline scrubber */}
              <div className="mb-4">
                <input type="range" min={0} max={SIM_MILESTONES.length-1} step={1} value={milestoneIdx}
                  onChange={e=>applyMilestone(parseInt(e.target.value))}
                  className="w-full accent-yellow-400"/>
                {/* Milestone tick labels */}
                <div className="flex justify-between mt-1">
                  {SIM_MILESTONES.map((m,i)=>(
                    <button key={i} onClick={()=>applyMilestone(i)}
                      className="text-center transition-colors"
                      style={{minWidth:0,flex:1}}>
                      <div className={`text-xs font-medium truncate ${i===milestoneIdx?"text-yellow-400":"text-gray-600 hover:text-gray-400"}`}>
                        {m.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              {/* Selected milestone context */}
              <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
                <div className="flex items-start gap-3">
                  <div className={`text-xs font-bold px-2 py-1 rounded shrink-0 ${milestone.corridors["corr-b"]||milestone.corridors["corr-c"]?"bg-green-900 text-green-300":"bg-yellow-900 text-yellow-300"}`}>
                    {milestone.date}
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium mb-0.5">{milestone.gw} GW dispatched</div>
                    <div className="text-xs text-gray-400 leading-relaxed">{milestone.note}</div>
                  </div>
                  <div className="ml-auto shrink-0 flex gap-1">
                    <button onClick={()=>applyMilestone(Math.max(0,milestoneIdx-1))} disabled={milestoneIdx===0}
                      className="bg-gray-800 hover:bg-gray-700 disabled:opacity-30 text-white px-2 py-1 rounded text-xs">Prev</button>
                    <button onClick={()=>applyMilestone(Math.min(SIM_MILESTONES.length-1,milestoneIdx+1))} disabled={milestoneIdx===SIM_MILESTONES.length-1}
                      className="bg-gray-800 hover:bg-gray-700 disabled:opacity-30 text-white px-2 py-1 rounded text-xs">Next</button>
                  </div>
                </div>
                {/* Corridor status at this milestone */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {CORRIDORS.map(c=>{
                    const isActive=milestone.corridors[c.id];
                    return(
                      <div key={c.id} className="flex items-center gap-1.5 text-xs px-2 py-1 rounded border"
                        style={isActive?{background:c.color+"15",borderColor:c.color+"60",color:c.color}:{background:"#0f172a",borderColor:"#1f2937",color:"#374151"}}>
                        <span className="w-2 h-2 rounded-full" style={{background:isActive?c.color:"#374151"}}/>
                        {c.label}
                        <span className="opacity-60">{isActive?"online":"not yet"}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ):(
            <div className="space-y-3">
              {/* Manual dispatch slider */}
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm font-semibold text-white">Generation Dispatch</span>
                  <span className="text-2xl font-bold text-yellow-400">{dispatchGW} <span className="text-sm text-gray-400">GW</span></span>
                </div>
                <input type="range" min={0} max={30} step={0.5} value={dispatchGW}
                  onChange={e=>setManualGW(parseFloat(e.target.value))}
                  className="w-full accent-yellow-400"/>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  {["0","5","10","15","20","25","30 GW"].map(v=><span key={v}>{v}</span>)}
                </div>
              </div>
              {/* Corridor toggles */}
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Active corridors — click to toggle</div>
                <div className="flex flex-wrap gap-2">
                  {CORRIDORS.map(c=>{
                    const isActive=activeCorridors[c.id];
                    const isSel=selCorrId===c.id;
                    const mw=corridorMW[c.id]||0;
                    return(
                      <button key={c.id}
                        onClick={()=>setSelCorrId(isSel?null:c.id)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all"
                        style={isSel
                          ?{background:c.color+"30",borderColor:c.color,color:"white"}
                          :isActive
                          ?{background:c.color+"12",borderColor:c.color+"70",color:c.color}
                          :{background:"#0f172a",borderColor:"#1f2937",color:"#374151"}}>
                        <span className="w-2 h-2 rounded-full" style={{background:isActive?c.color:"#374151"}}/>
                        <span className="font-semibold">{c.label}</span>
                        {c.planned&&<span className="opacity-50">(planned)</span>}
                        {isActive&&mw>0&&<span className="font-bold ml-1">{(mw/1000).toFixed(1)} GW</span>}
                        <span className="opacity-40 ml-1"
                          onClick={e=>{e.stopPropagation();setActiveCorridors(p=>({...p,[c.id]:!p[c.id]}));}}>
                          {isActive?"x":"+"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected corridor explainer */}
      {selCorr&&(
        <div className="rounded-xl border p-4" style={{borderColor:selCorr.color+"50",background:selCorr.color+"08"}}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <div className="font-semibold mb-1" style={{color:selCorr.color}}>
                {selCorr.label} — {selCorr.fullLabel}
                <span className="ml-2 text-xs font-normal text-gray-500">{selCorr.phase}</span>
              </div>
              <div className="text-xs text-gray-500 font-mono mb-2">{selCorr.description}</div>
              <p className="text-xs text-gray-400 leading-relaxed">{selCorr.why}</p>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-xs text-gray-500 mb-1">Simulated flow</div>
              <div className="text-2xl font-bold" style={{color:selCorr.color}}>
                {((corridorMW[selCorr.id]||0)/1000).toFixed(1)} GW
              </div>
              <div className="text-xs text-gray-600">of {selCorr.maxGW} GW max</div>
              <div className="mt-2 h-1.5 w-24 bg-gray-700 rounded-full overflow-hidden ml-auto">
                <div className="h-full rounded-full transition-all duration-300" style={{width:`${Math.min(100,(corridorMW[selCorr.id]||0)/1000/selCorr.maxGW*100)}%`,background:selCorr.color}}/>
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5 items-center">
            {selCorr.nodes.map((nid,i)=>{
              const node=MAP_NODES[nid];
              const mw=nodeMW[nid]||0;
              return(
                <div key={nid} className="flex items-center gap-1.5">
                  <div className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs">
                    <span className="text-white font-medium">{node?node.label:nid}</span>
                    {mw>0&&<span className="ml-1 font-bold" style={{color:selCorr.color}}>{(mw/1000).toFixed(1)} GW</span>}
                  </div>
                  {i<selCorr.nodes.length-1&&<span className="text-gray-600 text-xs">&#x2192;</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Map + right panel */}
      <div className="flex gap-4">
        <div className="flex-1 relative rounded-xl overflow-hidden border border-gray-700 bg-gray-950" style={{height:SIM_H}}>
          <svg width="100%" height="100%" viewBox={`0 0 ${SIM_W} ${SIM_H}`} style={{display:"block"}}>
            <rect width={SIM_W} height={SIM_H} fill="#07111f"/>

            {/* Zone bands */}
            {[
              {x:28, w:108,label:"Generation",   sub:"Wind  Solar  Hybrid",color:"#10b981"},
              {x:144,w:118,label:"KPS Cluster",  sub:"Pooling Stations 1-5",color:"#3b82f6"},
              {x:270,w:210,label:"Backbone",     sub:"765 kV HVAC",color:"#fbbf24"},
              {x:488,w:162,label:"Gujarat Grid", sub:"Ahm  Vadodara",color:"#fbbf24"},
              {x:658,w:152,label:"Load / Export",sub:"MH  WR Grid",color:"#f97316"},
            ].map((z,i)=>(
              <g key={i}>
                <rect x={z.x} y={26} width={z.w} height={SIM_H-52} rx="6"
                  fill={z.color} fillOpacity="0.025" stroke={z.color} strokeWidth="0.5" strokeOpacity="0.18"/>
                <text x={z.x+z.w/2} y={43} fill={z.color} fontSize="8" fontWeight="700" textAnchor="middle" opacity="0.6">{z.label}</text>
                <text x={z.x+z.w/2} y={54} fill="#2d3748" fontSize="6.5" textAnchor="middle">{z.sub}</text>
              </g>
            ))}

            {/* Base topology lines (dim) */}
            {MAP_LINES.map(line=>{
              const p1=SIM_SCHEMA[line.from],p2=SIM_SCHEMA[line.to];
              if(!p1||!p2)return null;
              const[x1,y1]=p1,[x2,y2]=p2;
              const mx=(x1+x2)/2;
              return(
                <path key={line.id+"b"}
                  d={`M${x1},${y1}L${mx},${y1}L${mx},${y2}L${x2},${y2}`}
                  fill="none" stroke="#1a2535" strokeWidth="1.5" strokeLinejoin="round"/>
              );
            })}

            {/* Gen feeder lines */}
            {GEN_NODES.map((gn,gi)=>{
              const[gx,gy]=SIM_SCHEMA[gn.id]||[0,0];
              return["kps1","kps2","kps3"].map((kid,ki)=>{
                const[kx,ky]=SIM_SCHEMA[kid]||[0,0];
                const mw=Math.round(dispatchMW*gn.mwFraction/3);
                const fd=flowDash(mw,gi*3+ki+30);
                return(
                  <g key={gn.id+kid}>
                    <line x1={gx} y1={gy} x2={kx} y2={ky} stroke={gn.color} strokeWidth="1" opacity="0.18"/>
                    <line x1={gx} y1={gy} x2={kx} y2={ky} stroke={gn.color} strokeWidth="1"
                      strokeDasharray={fd.strokeDasharray} strokeDashoffset={fd.strokeDashoffset} opacity="0.55"/>
                  </g>
                );
              });
            })}

            {/* Animated flow lines */}
            {MAP_LINES.map((line,li)=>{
              const p1=SIM_SCHEMA[line.from],p2=SIM_SCHEMA[line.to];
              if(!p1||!p2)return null;
              const key=[line.from,line.to].sort().join("--");
              const mw=lineMW[key]||0;
              if(mw<=0)return null;
              const[x1,y1]=p1,[x2,y2]=p2;
              const mx=(x1+x2)/2;
              const d=`M${x1},${y1}L${mx},${y1}L${mx},${y2}L${x2},${y2}`;
              const st=simLineStyle(mw);
              const fd=flowDash(mw,li);
              const isHighlit=activeSegKeys.has(key);
              const dimmed=selCorrId&&!isHighlit;
              return(
                <g key={line.id+"f"} opacity={dimmed?0.15:1}>
                  <path d={d} fill="none" stroke={st.color} strokeWidth={st.width+8} opacity="0.07" strokeLinejoin="round"/>
                  <path d={d} fill="none" stroke={st.color} strokeWidth={st.width} opacity={st.opacity} strokeLinejoin="round"/>
                  <path d={d} fill="none" stroke="white" strokeWidth={st.width*0.35}
                    strokeDasharray={fd.strokeDasharray} strokeDashoffset={fd.strokeDashoffset}
                    opacity="0.38" strokeLinejoin="round"/>
                  {!dimmed&&(
                    <text x={(x1+x2)/2} y={Math.min(y1,y2)-5} fill={st.color} fontSize="7.5" fontWeight="700" textAnchor="middle">
                      {mw>=1000?`${(mw/1000).toFixed(1)}GW`:`${mw}MW`}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Generation nodes */}
            {GEN_NODES.map(gn=>{
              const[x,y]=SIM_SCHEMA[gn.id]||[0,0];
              const mw=Math.round(dispatchMW*gn.mwFraction);
              const pulse=7+Math.sin(tick*0.18+GEN_NODES.indexOf(gn)*1.2)*2;
              return(
                <g key={gn.id}>
                  <circle cx={x} cy={y} r={pulse+8} fill={gn.color} opacity="0.06"/>
                  <circle cx={x} cy={y} r={pulse} fill={gn.color} opacity="0.18" stroke={gn.color} strokeWidth="1.2"/>
                  <text x={x} y={y+3.5} fill="white" fontSize="7" fontWeight="700" textAnchor="middle">{gn.label}</text>
                  <text x={x} y={y-pulse-6} fill={gn.color} fontSize="7.5" fontWeight="700" textAnchor="middle">{(mw/1000).toFixed(1)} GW</text>
                </g>
              );
            })}

            {/* Transmission nodes */}
            {Object.values(MAP_NODES).map(node=>{
              const sp=SIM_SCHEMA[node.id];
              if(!sp)return null;
              const[x,y]=sp;
              const mw=nodeMW[node.id]||0;
              const glow=nodeGlow(node.id);
              const isKps=node.type==="kps";
              const isLoad=node.type==="load";
              const r=isKps?12:isLoad?8:7;
              const baseColor=NODE_COLORS[node.type];
              const isHov=hovNode===node.id;
              const isPlanned=node.status==="planned";
              return(
                <g key={node.id} onMouseEnter={()=>setHovNode(node.id)} onMouseLeave={()=>setHovNode(null)} style={{cursor:"default"}}>
                  {mw>0&&<circle cx={x} cy={y} r={r+10} fill={glow} opacity={0.09+(mw/35000)*0.18}/>}
                  {isKps?(
                    <rect x={x-r} y={y-r} width={r*2} height={r*2} rx="3"
                      fill={baseColor} opacity={mw>0?0.3:0.1}
                      stroke={mw>0?glow:isPlanned?"#4b5563":baseColor}
                      strokeWidth={mw>0?2:1.5}
                      strokeDasharray={isPlanned?"5,3":"none"}/>
                  ):(
                    <circle cx={x} cy={y} r={r} fill={baseColor} opacity={mw>0?0.3:0.1}
                      stroke={mw>0?glow:isPlanned?"#4b5563":baseColor}
                      strokeWidth={mw>0?2:1.5}
                      strokeDasharray={isPlanned?"4,2":"none"}/>
                  )}
                  {isKps&&<text x={x} y={y+4} fill="white" fontSize="8" fontWeight="800" textAnchor="middle">{node.label.replace("KPS-","")}</text>}
                  <text x={x} y={y-r-6} fill={isKps?"#93c5fd":isLoad?"#fca5a5":"#a7f3d0"} fontSize={isKps?"9":"7.5"} fontWeight={isKps?"700":"500"} textAnchor="middle">{node.label}</text>
                  {mw>0&&(
                    <text x={x} y={y+r+11} fill={glow} fontSize="7.5" fontWeight="700" textAnchor="middle">
                      {mw>=1000?`${(mw/1000).toFixed(1)} GW`:`${mw} MW`}
                    </text>
                  )}
                  {isHov&&<NodeTooltip node={node} x={x} y={y} mw={mw} glow={glow}/>}
                </g>
              );
            })}

            {/* Line loading legend */}
            <g transform={`translate(10,${SIM_H-68})`}>
              <rect x={0} y={0} width={148} height={60} rx="4" fill="#07111f" stroke="#1e293b" strokeWidth="1" opacity="0.95"/>
              <text x={8} y={13} fill="#374151" fontSize="7" fontWeight="700" letterSpacing="1">LINE LOADING</text>
              {[{l:"No flow",c:"#1e293b",w:1.5},{l:"< 1 GW",c:"#06b6d4",w:2.5},{l:"1-3 GW",c:"#f97316",w:4},{l:"> 3 GW",c:"#fbbf24",w:6}].map((item,i)=>(
                <g key={item.l} transform={`translate(8,${20+i*11})`}>
                  <line x1={0} y1={3} x2={24} y2={3} stroke={item.c} strokeWidth={item.w} strokeLinecap="round"/>
                  <text x={30} y={7} fill="#9ca3af" fontSize="7">{item.l}</text>
                </g>
              ))}
            </g>

            <text x={SIM_W/2} y={SIM_H-6} fill="#1e293b" fontSize="8" textAnchor="middle">
              Schematic layout  Dispatch: {dispatchGW} GW  CTUIL Aug 2025
            </text>
          </svg>
        </div>

        {/* Right panel */}
        <div className="w-52 flex flex-col gap-3 shrink-0">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Corridor Loading</div>
            {CORRIDORS.map(c=>{
              const mw=corridorMW[c.id]||0;
              const pct=c.maxGW>0?Math.min(100,(mw/1000)/c.maxGW*100):0;
              const isActive=activeCorridors[c.id];
              return(
                <div key={c.id} className="mb-3 last:mb-0">
                  <div className="flex justify-between text-xs mb-1">
                    <button onClick={()=>setSelCorrId(selCorrId===c.id?null:c.id)}
                      className="font-semibold hover:underline text-left transition-colors"
                      style={{color:isActive?c.color:"#4b5563"}}>
                      {c.label}
                    </button>
                    <span className="text-gray-400 font-mono">{mw>0?`${(mw/1000).toFixed(1)}GW`:"off"}</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-300" style={{width:`${pct}%`,background:isActive?c.color:"#374151"}}/>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-0.5">
                    <span>{c.phase.split(" ")[0]}</span>
                    <span>{c.maxGW} GW max</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Node Flows</div>
            <div className="space-y-1.5">
              {["kps1","kps2","kps3","lak","ahm","vad","padghe"].map(nid=>{
                const mw=nodeMW[nid]||0;
                const node=MAP_NODES[nid];
                if(!node)return null;
                return(
                  <div key={nid} className="flex justify-between text-xs">
                    <span className="text-gray-500 truncate">{node.label}</span>
                    <span className="font-bold font-mono ml-2" style={{color:mw>0?nodeGlow(nid):"#374151"}}>
                      {mw>0?(mw>=1000?`${(mw/1000).toFixed(1)}GW`:`${mw}MW`):"—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-xs text-gray-600 leading-relaxed">
            <span className="text-gray-500 font-semibold block mb-1">Simulation note</span>
            MW distributed proportionally by corridor capacity. Real dispatch subject to RLDC scheduling, availability, and grid constraints.
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── Dashboard ───
export default function Dashboard(){
  const [search,setSearch]=useState("");
  const [filterV,setFilterV]=useState("All");
  const [filterPS,setFilterPS]=useState("All");
  const [filterGroup,setFilterGroup]=useState("All");
  const [filterBay,setFilterBay]=useState("All");
  const [expanded,setExpanded]=useState({});
  const [sortCol,setSortCol]=useState("mw");
  const [sortDir,setSortDir]=useState(-1);
  const [tab,setTab]=useState("overview");

  const totalMW=useMemo(()=>sumBy(khavdaConnectivity,"mw"),[]);
  const t220=useMemo(()=>sumBy(khavdaConnectivity.filter(r=>r.voltage==="220kV"),"mw"),[]);
  const t400=useMemo(()=>sumBy(khavdaConnectivity.filter(r=>r.voltage==="400kV"),"mw"),[]);
  const devCount=useMemo(()=>new Set(khavdaConnectivity.map(r=>r.developer)).size,[]);

  const tableData=useMemo(()=>{
    let d=[...khavdaConnectivity];
    if(filterV!=="All")d=d.filter(r=>r.voltage===filterV);
    if(filterPS!=="All")d=d.filter(r=>r.substation===filterPS);
    if(filterGroup!=="All")d=d.filter(r=>r.group===filterGroup);
    if(filterBay==="allocated")d=d.filter(r=>r.bay&&!r.bay.toLowerCase().includes("not specified"));
    if(filterBay==="unallocated")d=d.filter(r=>!r.bay||r.bay.toLowerCase().includes("not specified"));
    if(search)d=d.filter(r=>r.developer.toLowerCase().includes(search.toLowerCase())||r.substation.toLowerCase().includes(search.toLowerCase())||r.group.toLowerCase().includes(search.toLowerCase()));
    d.sort((a,b)=>sortDir*(typeof a[sortCol]==="number"?a[sortCol]-b[sortCol]:a[sortCol].localeCompare(b[sortCol])));
    return d;
  },[search,filterV,filterPS,filterGroup,filterBay,sortCol,sortDir]);

  const grouped=useMemo(()=>{
    const m={};
    tableData.forEach(r=>{if(!m[r.group])m[r.group]={group:r.group,totalMW:0,entries:[]};m[r.group].totalMW+=r.mw;m[r.group].entries.push(r);});
    return Object.values(m).sort((a,b)=>b.totalMW-a.totalMW);
  },[tableData]);

  const devShare=useMemo(()=>{const cons=consolidate(khavdaConnectivity);const top10=cons.slice(0,10);const oth=cons.slice(10).reduce((s,r)=>s+r.mw,0);if(oth>0)top10.push({developer:"Others",mw:oth});return top10;},[]);
  const voltData=[{voltage:"220 kV",mw:Math.round(t220)},{voltage:"400 kV",mw:Math.round(t400)}];
  const psData=useMemo(()=>Object.keys(PS_COLORS).map(ps=>{const rows=khavdaConnectivity.filter(r=>r.substation===ps);return{name:ps.replace("Khavda ",""),"220kV":Math.round(sumBy(rows.filter(r=>r.voltage==="220kV"),"mw")),"400kV":Math.round(sumBy(rows.filter(r=>r.voltage==="400kV"),"mw"))};}),[]);

  function SortTh({col,label}){return(<th onClick={()=>{if(sortCol===col)setSortDir(d=>-d);else{setSortCol(col);setSortDir(-1);}}} className="px-3 py-2 text-left text-xs text-gray-400 uppercase cursor-pointer hover:text-white select-none whitespace-nowrap">{label}{sortCol===col?(sortDir===-1?" ↓":" ↑"):" ↕"}</th>);}

  const TABS=[{k:"overview",l:"Overview"},{k:"map",l:"Transmission Map"},{k:"table",l:"Developer Register"},{k:"charts",l:"Analytics"},{k:"architecture",l:"Grid Architecture"},{k:"timeline",l:"Timeline"},{k:"simulator",l:"⚡ Flow Simulator"}];

  return(
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* HEADER */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-5">
        <div className="flex items-start gap-4">
          <div className="bg-blue-600 rounded-lg p-2 mt-1 shrink-0"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></div>
          <div>
            <h1 className="text-xl font-bold leading-tight">Khavda Renewable Energy Zone — Transmission Connectivity Intelligence Platform</h1>
            <p className="text-blue-400 text-sm mt-1">CTUIL Bay Allocation Register (Aug 2025) · CERC/WRPC/CEA Transmission Sources</p>
          </div>
        </div>
        <div className="mt-4 bg-gray-800 rounded-lg p-4 text-sm text-gray-300 leading-relaxed">
          <span className="text-blue-400 font-semibold">System Context: </span>
          Khavda Renewable Energy Park in Kutch, Gujarat is India's largest renewable energy zone targeting approximately <span className="text-white">30 GW of generation capacity</span>. Five pooling stations (PS-I through PS-V) aggregate renewable power and inject it into the <span className="text-white">765 kV Inter-State Transmission System (ISTS)</span>. Primary evacuation corridors include the <span className="text-gray-200">Western Corridor</span> (Bhuj → Lakadia → Vadodara) and the <span className="text-gray-200">Northern Corridor</span> (Banaskantha → Ahmedabad → Navsari → Maharashtra), enabling large-scale renewable power transfer into Western Region demand centres including Mumbai and Pune.
        </div>
      </div>

      {/* TABS */}
      <div className="bg-gray-900 border-b border-gray-800 px-6">
        <div className="flex gap-0 overflow-x-auto">
          {TABS.map(t=>(
            <button key={t.k} onClick={()=>setTab(t.k)} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tab===t.k?"border-blue-500 text-blue-400":"border-transparent text-gray-400 hover:text-white"}`}>{t.l}</button>
          ))}
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">

        {/* ── OVERVIEW ── */}
        {tab==="overview"&&(<>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <MetricCard label="Total Connectivity" value={`${Math.round(totalMW).toLocaleString()} MW`} sub="All Khavda PS" color="#3b82f6"/>
            <MetricCard label="Developers" value={devCount} sub="Unique entities" color="#10b981"/>
            <MetricCard label="Pooling Stations" value={5} sub="PS-I through PS-V" color="#f59e0b"/>
            <MetricCard label="220 kV" value={`${Math.round(t220).toLocaleString()} MW`} sub={`${((t220/totalMW)*100).toFixed(1)}%`} color="#06b6d4"/>
            <MetricCard label="400 kV" value={`${Math.round(t400).toLocaleString()} MW`} sub={`${((t400/totalMW)*100).toFixed(1)}%`} color="#f97316"/>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-6">
            <SectionHeader title="Evacuation Corridors from the Khavda Renewable Energy Zone" subtitle="Transmission pathways carrying renewable generation from Khavda pooling stations into the Western Region grid"/>
            <TransmissionMap/>
            <p className="text-gray-600 text-xs mt-2">Sources: CERC orders, CEA UC-TBCB Dec 2024, PGCIL stock filings, TNDI India, CTUIL documents. Routes are geographically accurate alignments, not exact survey paths.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.keys(PS_COLORS).map(ps=>{
              const rows=khavdaConnectivity.filter(r=>r.substation===ps);
              const total=Math.round(sumBy(rows,"mw"));
              const v220=Math.round(sumBy(rows.filter(r=>r.voltage==="220kV"),"mw"));
              const v400=Math.round(sumBy(rows.filter(r=>r.voltage==="400kV"),"mw"));
              const tl=TIMELINE.filter(t=>t.station.includes(ps.replace("Khavda ","")));
              return(<div key={ps} className="bg-gray-800 border border-gray-700 rounded-lg p-4" style={{borderTopColor:PS_COLORS[ps],borderTopWidth:3}}>
                <div className="text-sm font-semibold text-white mb-1">{ps}</div>
                <div className="text-xl font-bold text-white">{total.toLocaleString()} <span className="text-sm text-gray-400">MW</span></div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {v220>0&&<span className="text-xs bg-cyan-900 text-cyan-300 px-1.5 py-0.5 rounded">{v220.toLocaleString()} 220kV</span>}
                  {v400>0&&<span className="text-xs bg-orange-900 text-orange-300 px-1.5 py-0.5 rounded">{v400.toLocaleString()} 400kV</span>}
                </div>
                {tl.length>0&&<div className="mt-2 text-xs text-gray-500 leading-tight">{tl[0].date}: <span className={tl[0].status==="commissioned"?"text-green-400":"text-yellow-400"}>{tl[0].event.slice(0,36)}…</span></div>}
              </div>);
            })}
          </div>
        </>)}

        {/* ── MAP (standalone) ── */}
        {tab==="map"&&(<>
          <SectionHeader title="ISTS Transmission Network – Full View" subtitle="Real geographic routing of 765 kV & 400 kV corridors from Khavda to Maharashtra"/>
          <TransmissionMap/>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[{l:"Primary Evacuation",v:"KPS1/2 → Bhuj → Lakadia → Vadodara",s:"765 kV D/C, AESL, commissioned FY24"},{l:"Ahmedabad–Navsari",v:"765 kV D/C, ~590 ckm",s:"PGCIL Khavda II-C, commissioned Jan 31, 2026"},{l:"Maharashtra Corridor",v:"Navsari → Padghe → Mumbai / Pune",s:"765 kV ISTS, ~145 ckm, PGCIL/MSETCL · CERC open access, multi-utility"},{l:"Banaskantha–Ahmedabad",v:"765 kV D/C, ~270 ckm",s:"PGCIL, commissioned Jul 2025"}].map((c,i)=>(
              <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">{c.l}</div>
                <div className="text-white text-sm font-semibold leading-tight">{c.v}</div>
                <div className="text-gray-500 text-xs mt-1">{c.s}</div>
              </div>
            ))}
          </div>
          <p className="text-gray-700 text-xs mt-2">Sources: CERC orders · CEA UC-TBCB Dec 2024 · PGCIL stock filings · TNDI India · MoRTH NH crossing permits · CTUIL Bay Allocation Register Aug 2025</p>
        </>)}

        {/* ── TABLE ── */}
        {tab==="table"&&(<>
          <SectionHeader title="Connectivity Ownership Register" subtitle="Corporate ownership of ISTS connectivity capacity across developers and pooling stations · Source: CTUIL Bay Allocation Register (Aug 2025)"/>
          <div className="flex flex-wrap gap-3 mb-4">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search developer, group, station…" className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 w-60 focus:outline-none focus:border-blue-500"/>
            <select value={filterV} onChange={e=>setFilterV(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
              <option value="All">All Voltages</option><option>220kV</option><option>400kV</option>
            </select>
            <select value={filterPS} onChange={e=>setFilterPS(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
              <option value="All">All Stations</option>
              {Object.keys(PS_COLORS).map(s=><option key={s}>{s}</option>)}
            </select>
            <select value={filterGroup} onChange={e=>setFilterGroup(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
              <option value="All">All Groups</option>
              {[...new Set(khavdaConnectivity.map(r=>r.group))].sort().map(g=><option key={g}>{g}</option>)}
            </select>
            <select value={filterBay} onChange={e=>setFilterBay(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
              <option value="All">All Bay Status</option>
              <option value="allocated">Bay Allocated</option>
              <option value="unallocated">Bay Not Specified</option>
            </select>
            <div className="flex items-center text-sm text-gray-400 ml-auto">{tableData.length} records</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr><th className="px-3 py-2 w-8"></th><SortTh col="group" label="Group / Developer"/><SortTh col="mw" label="MW"/><SortTh col="substation" label="Station"/><SortTh col="voltage" label="Voltage"/><th className="px-3 py-2 text-left text-xs text-gray-400 uppercase">Bay</th><th className="px-3 py-2 text-left text-xs text-gray-400 uppercase">Flags</th></tr>
                </thead>
                <tbody>
                  {grouped.map((g,gi)=>{
                    const exp=expanded[g.group];
                    const gc=PALETTE[gi%PALETTE.length];
                    const gv2=Math.round(sumBy(g.entries.filter(r=>r.voltage==="220kV"),"mw"));
                    const gv4=Math.round(sumBy(g.entries.filter(r=>r.voltage==="400kV"),"mw"));
                    return[
                      <tr key={`g-${g.group}`} className="border-b border-gray-700 hover:bg-gray-700 cursor-pointer" onClick={()=>setExpanded(p=>({...p,[g.group]:!p[g.group]}))}>
                        <td className="px-3 py-2.5 text-gray-400 text-xs">{exp?"▼":"▶"}</td>
                        <td className="px-3 py-2.5"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full shrink-0" style={{background:gc}}/><span className="font-semibold text-white text-sm">{g.group}</span><span className="text-gray-500 text-xs">({g.entries.length})</span></div></td>
                        <td className="px-3 py-2.5 font-bold text-white font-mono">{Math.round(g.totalMW).toLocaleString()}</td>
                        <td className="px-3 py-2.5">{[...new Set(g.entries.map(e=>e.substation))].map(ps=>(<span key={ps} className="text-xs px-1.5 py-0.5 rounded mr-1 inline-block font-medium" style={{background:PS_COLORS[ps]+"33",color:PS_COLORS[ps]}}>{ps.replace("Khavda ","")}</span>))}</td>
                        <td className="px-3 py-2.5"><div className="flex gap-1">{gv2>0&&<span className="text-xs bg-cyan-900 text-cyan-300 px-1.5 py-0.5 rounded">{gv2.toLocaleString()} 220kV</span>}{gv4>0&&<span className="text-xs bg-orange-900 text-orange-300 px-1.5 py-0.5 rounded">{gv4.toLocaleString()} 400kV</span>}</div></td>
                        <td className="px-3 py-2.5" colSpan={2}></td>
                      </tr>,
                      ...(exp?g.entries.map((r,ri)=>(
                        <tr key={`${g.group}-${ri}`} className="border-b border-gray-800 bg-gray-900 hover:bg-gray-800">
                          <td className="px-3 py-2 text-gray-700 text-center">└</td>
                          <td className="px-3 py-2 text-gray-300 text-xs pl-7">{r.developer}</td>
                          <td className="px-3 py-2 font-mono text-white">{r.mw.toLocaleString()}</td>
                          <td className="px-3 py-2"><span className="text-xs px-2 py-0.5 rounded font-medium" style={{background:PS_COLORS[r.substation]+"33",color:PS_COLORS[r.substation]}}>{r.substation}</span></td>
                          <td className="px-3 py-2"><span className={`text-xs px-2 py-0.5 rounded font-medium ${r.voltage==="220kV"?"bg-cyan-900 text-cyan-300":"bg-orange-900 text-orange-300"}`}>{r.voltage}</span></td>
                          <td className="px-3 py-2 text-xs font-mono">{r.bay&&!r.bay.toLowerCase().includes("not specified")?<span className="text-green-400">{r.bay}</span>:<span className="text-gray-600 italic">not specified</span>}</td>
                          <td className="px-3 py-2">{r.bess&&<span className="text-xs bg-purple-900 text-purple-300 px-1.5 py-0.5 rounded">BESS</span>}</td>
                        </tr>
                      )):[])
                    ];
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>)}

        {/* ── CHARTS ── */}
        {tab==="charts"&&(
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                <SectionHeader title="Developer Market Share" subtitle="Top 10 + Others by allocated MW"/>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart><Pie data={devShare} dataKey="mw" nameKey="developer" cx="50%" cy="50%" innerRadius={60} outerRadius={105} paddingAngle={2}>{devShare.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}</Pie><Tooltip formatter={v=>[`${v.toLocaleString()} MW`]} contentStyle={{background:"#1f2937",border:"1px solid #374151",borderRadius:8,color:"#fff",fontSize:12}}/></PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-1 mt-1">{devShare.map((d,i)=>(<div key={i} className="flex items-center gap-1.5 text-xs text-gray-300"><div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{background:PALETTE[i%PALETTE.length]}}/><span className="truncate">{d.developer.split(" ").slice(0,3).join(" ")}</span><span className="ml-auto text-gray-500">{Math.round(d.mw).toLocaleString()}</span></div>))}</div>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                <SectionHeader title="Voltage Distribution" subtitle="Total MW by injection level"/>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={voltData} barSize={70}><XAxis dataKey="voltage" tick={{fill:"#9ca3af",fontSize:12}} axisLine={false} tickLine={false}/><YAxis tick={{fill:"#6b7280",fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}GW`}/><Tooltip formatter={v=>[`${v.toLocaleString()} MW`]} contentStyle={{background:"#1f2937",border:"1px solid #374151",borderRadius:8,color:"#fff",fontSize:12}}/><Bar dataKey="mw" radius={[6,6,0,0]}>{voltData.map((d,i)=><Cell key={i} fill={V_COLORS[d.voltage.replace(" ","")]}/>)}</Bar></BarChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-3 mt-3 text-center">
                  <div className="bg-cyan-900 bg-opacity-30 rounded-lg p-3"><div className="text-cyan-400 text-lg font-bold">{(t220/1000).toFixed(1)} GW</div><div className="text-xs text-gray-400">220 kV</div></div>
                  <div className="bg-orange-900 bg-opacity-30 rounded-lg p-3"><div className="text-orange-400 text-lg font-bold">{(t400/1000).toFixed(1)} GW</div><div className="text-xs text-gray-400">400 kV</div></div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
              <SectionHeader title="Pooling Station Capacity" subtitle="Stacked by voltage level"/>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={psData}><XAxis dataKey="name" tick={{fill:"#9ca3af",fontSize:11}} axisLine={false} tickLine={false}/><YAxis tick={{fill:"#6b7280",fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}GW`}/><Tooltip formatter={v=>[`${v.toLocaleString()} MW`]} contentStyle={{background:"#1f2937",border:"1px solid #374151",borderRadius:8,color:"#fff",fontSize:12}}/><Legend wrapperStyle={{color:"#9ca3af",fontSize:12}}/><Bar dataKey="220kV" stackId="a" fill="#06b6d4" name="220 kV"/><Bar dataKey="400kV" stackId="a" fill="#f97316" radius={[4,4,0,0]} name="400 kV"/></BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
              <SectionHeader title="MW Flow Diagram" subtitle="Developer → Pooling Station → Voltage Level (top 7 developers)"/>
              <SankeyDiagram data={khavdaConnectivity}/>
            </div>
          </div>
        )}

        {/* ── ARCHITECTURE ── */}
        {tab==="architecture"&&(<>
          <SectionHeader title="Khavda Renewable Energy Evacuation Architecture" subtitle="System flow from generation assets through pooling stations into the 765 kV ISTS backbone and Western Region load centres"/>
          <ArchDiagram data={khavdaConnectivity}/>
          <div className="mt-4 bg-gray-800 border border-orange-900 rounded-xl p-5">
            <div className="text-orange-400 text-sm font-semibold mb-3">Maharashtra Offtake Corridor — Transmission Infrastructure</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {l:"Corridor Route",v:"Khavda → Ahmedabad → Navsari → Padghe → Mumbai / Pune",s:"~735 ckm total, inter-state"},
                {l:"Backbone Voltage",v:"765 kV D/C ISTS",s:"PGCIL Khavda Phase-II Part C"},
                {l:"Commissioned",v:"Ahmedabad–Navsari: Jan 2026 · Navsari–Padghe: operational",s:"Enabling large-scale WR→MH power flow"},
                {l:"Injection Point",v:"Padghe 765/400 kV SS (MSETCL)",s:"Primary import node for Mumbai metropolitan region"},
                {l:"Load Centres Served",v:"Mumbai, Pune, Nashik, Aurangabad",s:"Via MSETCL 400 kV onward network"},
                {l:"Corridor Capacity",v:"~6,000–8,000 MW transfer capability",s:"Subject to RLDC scheduling & grid constraints"},
                {l:"Regulatory Framework",v:"ISTS open access, CERC-regulated",s:"Multiple utilities & developers can wheel power"},
                {l:"Significance",v:"First large-scale solar-wind evacuation to MH",s:"Transforms MH's renewable import capacity"},
              ].map((x,i)=>(
                <div key={i} className="bg-gray-900 rounded-lg p-3">
                  <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">{x.l}</div>
                  <div className="text-gray-200 text-xs font-medium">{x.v}</div>
                  {x.s&&<div className="text-gray-600 text-xs mt-0.5">{x.s}</div>}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 bg-gray-800 border border-blue-900 rounded-xl p-5">
            <div className="text-blue-400 font-semibold mb-3 text-sm">Data Sources</div>
            <div className="text-xs text-gray-500 space-y-1">
              <div>CTUIL Bay Allocation Register — August 2025</div>
              <div>Central Electricity Regulatory Commission (CERC) transmission orders</div>
              <div>Central Electricity Authority (CEA) transmission planning reports</div>
              <div>Power Grid Corporation of India (PGCIL) project filings</div>
              <div>Western Regional Power Committee (WRPC) meeting minutes</div>
            </div>
          </div>
        </>)}

        {/* ── TIMELINE ── */}
        {tab==="timeline"&&(<>
          <SectionHeader title="Transmission Infrastructure Commissioning Timeline" subtitle="Key milestones in Khavda transmission development from Phase-I HVAC buildout through HVDC Phase-V expansion"/>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-700"/>
            <div className="space-y-4 pl-14">
              {TIMELINE.map((t,i)=>(
                <div key={i} className="relative">
                  <div className={`absolute -left-11 w-5 h-5 rounded-full border-2 flex items-center justify-center ${t.status==="commissioned"?"bg-green-900 border-green-500":t.status==="planned"?"bg-yellow-900 border-yellow-500":"bg-blue-950 border-blue-700"}`}><div className={`w-2 h-2 rounded-full ${t.status==="commissioned"?"bg-green-400":t.status==="planned"?"bg-yellow-400":"bg-blue-500"}`}/></div>
                  <div className={`bg-gray-800 border rounded-xl p-4 ${t.status==="commissioned"?"border-green-900":t.status==="planned"?"border-yellow-900":"border-gray-700"}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div><div className="flex items-center gap-2 mb-1"><span className={`text-xs font-bold px-2 py-0.5 rounded ${t.status==="commissioned"?"bg-green-900 text-green-300":t.status==="planned"?"bg-yellow-900 text-yellow-300":"bg-blue-950 text-blue-400"}`}>{t.date}</span><span className="text-xs text-gray-500 uppercase tracking-wider">{t.status}</span></div><div className="text-white text-sm font-medium">{t.event}</div><div className="text-gray-500 text-xs mt-1">{t.station}</div></div>
                      <div className="text-gray-600 text-xs shrink-0 text-right max-w-48">Source:<br/><span className="text-gray-500">{t.source}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-5">
            <div className="text-sm font-semibold text-white mb-3">Phased Evacuation Summary</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[{p:"Phase I–III",c:"~15 GW",t:"HVAC 765 kV",d:"2023–2025",s:"commissioned"},{p:"Phase IV",c:"7 GW",t:"HVAC, new KPS3 765kV bus",d:"Jun 2025–Jun 2026",s:"planned"},{p:"Phase V",c:"4 GW",t:"HVDC (KPS-III HVDC TSA)",d:"Dec 2026–Mar 2027",s:"planned"},{p:"Phase VI",c:"4 GW",t:"HVDC upgrade + 765kV",d:"Beyond Mar 2027",s:"future"}].map((p,i)=>(
                <div key={i} className={`bg-gray-900 rounded-xl p-3 border ${p.s==="commissioned"?"border-green-900":p.s==="planned"?"border-yellow-900":"border-gray-700"}`}>
                  <div className={`text-xs font-bold mb-1 ${p.s==="commissioned"?"text-green-400":p.s==="planned"?"text-yellow-400":"text-blue-400"}`}>{p.p}</div>
                  <div className="text-2xl font-bold text-white">{p.c}</div>
                  <div className="text-gray-400 text-xs mt-1">{p.t}</div>
                  <div className="text-gray-500 text-xs">{p.d}</div>
                </div>
              ))}
            </div>
          </div>
        </>)}

        {/* ── SIMULATOR ── */}
        {tab==="simulator"&&(<>
          <SectionHeader
            title="Power Flow Simulator"
            subtitle="Schematic evacuation model — adjust dispatch level and active corridors to visualise MW flow through the Khavda ISTS network"/>
          <PowerFlowSimulator/>
        </>)}
      </div>
    </div>
  );
}
