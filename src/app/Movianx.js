"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM
// ═══════════════════════════════════════════════════════════════════════════
const C = {
  accent: "#fff", dark: "#000", surface: "rgba(255,255,255,0.05)",
  surface2: "rgba(255,255,255,0.08)", border: "rgba(255,255,255,0.1)",
  text: "#fff", text2: "rgba(255,255,255,0.6)", gold: "rgba(255,255,255,0.9)",
  green: "#4ADE80", purple: "#818CF8", red: "#E8364F",
};
const THEMES = {
  cream: { bg: "#F5F1E8", text: "#2C2C2C", name: "Cream" },
  eink: { bg: "#E5E5E5", text: "#1A1A1A", name: "E-Ink" },
  night: { bg: "#121218", text: "#E5E5E5", name: "Night" },
  sepia: { bg: "#F4ECD8", text: "#5C4B37", name: "Sepia" },
};
const FONTS = ["Georgia", "Merriweather", "Open Sans", "system-ui"];
const FF = "'SF Pro Display',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Open+Sans:wght@400;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  html,body,#__next{height:auto;overflow:auto;overflow-x:hidden}
  ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:3px}
  input::placeholder{color:rgba(255,255,255,0.35)}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.05);opacity:0.8}}
  @keyframes breathe{0%,100%{opacity:0.4}50%{opacity:1}}
  @keyframes pageTurn{0%{opacity:1;transform:translateX(0)}100%{opacity:0;transform:translateX(-30px)}}
  @keyframes pageEnter{0%{opacity:0;transform:translateX(30px)}100%{opacity:1;transform:translateX(0)}}
  @keyframes driftFog{0%{transform:translateX(-5%)}50%{transform:translateX(5%)}100%{transform:translateX(-5%)}}
  @keyframes flicker{0%,100%{opacity:0.6}20%{opacity:0.8}40%{opacity:0.5}60%{opacity:0.9}80%{opacity:0.55}}
  @keyframes sway{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
  @keyframes slowTurn{0%{transform:scaleX(1)}50%{transform:scaleX(1.02) translateX(2px)}100%{transform:scaleX(1)}}
  @keyframes rise{0%{transform:translateY(0);opacity:0.3}50%{transform:translateY(-10px);opacity:0.7}100%{transform:translateY(-20px);opacity:0}}
  @keyframes eyeGlow{0%,100%{filter:drop-shadow(0 0 4px rgba(200,180,50,0.3))}50%{filter:drop-shadow(0 0 12px rgba(200,180,50,0.8))}}
  @keyframes iceShift{0%{transform:translateX(0) translateY(0)}33%{transform:translateX(3px) translateY(-2px)}66%{transform:translateX(-2px) translateY(1px)}100%{transform:translateX(0) translateY(0)}}
  @keyframes lightning{0%,95%,100%{opacity:0}96%{opacity:0.8}97%{opacity:0}98%{opacity:0.5}}
`;

// ═══════════════════════════════════════════════════════════════════════════
// SCENE ILLUSTRATIONS — Atmospheric SVG + CSS motion
// ═══════════════════════════════════════════════════════════════════════════
function SceneIllustration({chapterIdx,storyId,theme}){
  if(storyId!==1)return null; // Only Frankenstein has illustrations for now
  const dark=theme==="night"||theme==="sepia";
  const fg=dark?"#c8c8c8":"#1a1a1a";
  const mg=dark?"#888":"#555";
  const bg2=dark?"#333":"#d0d0d0";
  const accent=dark?"#c8b432":"#8B7500";

  const scenes={
    // Chapter 0: Arctic voyage - ship, ice, northern lights
    0:(
      <svg viewBox="0 0 800 350" style={{width:"100%",height:"auto",animation:"fadeIn 1.5s ease both"}}>
        {/* Sky */}
        <defs>
          <linearGradient id="sky0" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={dark?"#0a0a18":"#2a2a40"}/><stop offset="100%" stopColor={dark?"#1a1a2a":"#a0a0b8"}/></linearGradient>
          <filter id="fog0"><feGaussianBlur in="SourceGraphic" stdDeviation="8"/></filter>
        </defs>
        <rect width="800" height="350" fill="url(#sky0)"/>
        {/* Stars */}
        {[...Array(30)].map((_,i)=><circle key={i} cx={Math.random()*800} cy={Math.random()*150} r={Math.random()*1.5+0.5} fill="#fff" opacity={Math.random()*0.6+0.2} style={{animation:`breathe ${3+Math.random()*4}s infinite ${Math.random()*3}s`}}/>)}
        {/* Northern lights */}
        <ellipse cx="400" cy="80" rx="300" ry="60" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.15" style={{animation:"breathe 8s infinite"}}/>
        <ellipse cx="350" cy="60" rx="200" ry="40" fill="none" stroke="#4a8" strokeWidth="1" opacity="0.1" style={{animation:"breathe 6s infinite 1s"}}/>
        {/* Ice field */}
        <path d="M0,250 L100,240 L200,255 L350,235 L500,250 L650,240 L800,248 L800,350 L0,350Z" fill={bg2} opacity="0.5" style={{animation:"iceShift 20s ease-in-out infinite"}}/>
        <path d="M0,260 L150,250 L300,265 L450,248 L600,258 L800,252 L800,350 L0,350Z" fill={bg2} opacity="0.7"/>
        {/* Ship silhouette */}
        <g style={{animation:"sway 8s ease-in-out infinite",transformOrigin:"400px 240px"}}>
          <path d="M360,240 L380,200 L420,200 L440,240Z" fill={fg} opacity="0.8"/>
          <line x1="400" y1="200" x2="400" y2="160" stroke={fg} strokeWidth="2" opacity="0.8"/>
          <path d="M400,165 L400,195 L415,185Z" fill={fg} opacity="0.6"/>
          <path d="M350,242 L450,242 L440,255 L360,255Z" fill={fg} opacity="0.9"/>
        </g>
        {/* Fog layer */}
        <ellipse cx="200" cy="280" rx="250" ry="40" fill={bg2} opacity="0.3" filter="url(#fog0)" style={{animation:"driftFog 15s ease-in-out infinite"}}/>
        <ellipse cx="600" cy="290" rx="200" ry="35" fill={bg2} opacity="0.25" filter="url(#fog0)" style={{animation:"driftFog 12s ease-in-out infinite 3s"}}/>
      </svg>
    ),
    // Chapter 1: Stranger on the ice - mysterious figure, frozen landscape
    1:(
      <svg viewBox="0 0 800 350" style={{width:"100%",height:"auto",animation:"fadeIn 1.5s ease both"}}>
        <defs>
          <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={dark?"#0c0c1a":"#3a3a50"}/><stop offset="100%" stopColor={dark?"#1c1c30":"#bbb8c8"}/></linearGradient>
          <filter id="fog1"><feGaussianBlur in="SourceGraphic" stdDeviation="6"/></filter>
        </defs>
        <rect width="800" height="350" fill="url(#sky1)"/>
        {/* Ice plains */}
        <path d="M0,220 L200,215 L400,225 L600,210 L800,220 L800,350 L0,350Z" fill={bg2} opacity="0.6"/>
        {/* Giant figure silhouette - far away, on sled */}
        <g style={{animation:"slowTurn 12s ease-in-out infinite",transformOrigin:"250px 200px"}}>
          <rect x="230" y="210" width="40" height="20" rx="3" fill={fg} opacity="0.5"/>
          <ellipse cx="250" cy="195" rx="8" ry="15" fill={fg} opacity="0.6"/>
          <circle cx="250" cy="180" r="6" fill={fg} opacity="0.6"/>
          {/* Sled dogs */}
          {[0,1,2].map(i=><ellipse key={i} cx={200-i*15} cy={218} rx="6" ry="4" fill={fg} opacity="0.4"/>)}
        </g>
        {/* Second figure - closer, wretched */}
        <g style={{animation:"sway 10s ease-in-out infinite",transformOrigin:"580px 190px"}}>
          <ellipse cx="580" cy="170" rx="7" ry="10" fill={fg} opacity="0.8"/>
          <circle cx="580" cy="158" r="5" fill={fg} opacity="0.8"/>
          <line x1="580" y1="180" x2="575" y2="195" stroke={fg} strokeWidth="2" opacity="0.7"/>
          <line x1="580" y1="180" x2="585" y2="195" stroke={fg} strokeWidth="2" opacity="0.7"/>
          {/* Reaching arm */}
          <line x1="575" y1="172" x2="560" y2="178" stroke={fg} strokeWidth="1.5" opacity="0.7"/>
        </g>
        {/* Fog */}
        <ellipse cx="400" cy="260" rx="350" ry="50" fill={bg2} opacity="0.3" filter="url(#fog1)" style={{animation:"driftFog 18s ease-in-out infinite"}}/>
        {/* Falling snow */}
        {[...Array(25)].map((_,i)=><circle key={i} cx={Math.random()*800} cy={Math.random()*300} r={Math.random()*2+0.5} fill="#fff" opacity={Math.random()*0.4+0.1} style={{animation:`rise ${4+Math.random()*6}s linear infinite ${Math.random()*5}s`}}/>)}
      </svg>
    ),
    // Chapter 2: Victor's childhood - lake, mountains, warmth
    2:(
      <svg viewBox="0 0 800 350" style={{width:"100%",height:"auto",animation:"fadeIn 1.5s ease both"}}>
        <defs>
          <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={dark?"#1a1825":"#5a6a80"}/><stop offset="100%" stopColor={dark?"#2a2535":"#b8c0d0"}/></linearGradient>
        </defs>
        <rect width="800" height="350" fill="url(#sky2)"/>
        {/* Mountains */}
        <path d="M0,180 L100,120 L200,160 L320,80 L440,150 L520,100 L650,140 L800,110 L800,350 L0,350Z" fill={mg} opacity="0.3"/>
        {/* Lake */}
        <ellipse cx="400" cy="280" rx="350" ry="60" fill={dark?"#1a2030":"#7090b0"} opacity="0.4"/>
        {/* Trees */}
        {[100,200,350,550,680].map((x,i)=>(
          <g key={i} style={{animation:`sway ${6+i*2}s ease-in-out infinite`,transformOrigin:`${x}px 230px`}}>
            <line x1={x} y1={230} x2={x} y2={190-i*5} stroke={fg} strokeWidth="3" opacity="0.6"/>
            <path d={`M${x-15},${200-i*5} L${x},${175-i*5} L${x+15},${200-i*5}Z`} fill={fg} opacity="0.4"/>
          </g>
        ))}
        {/* Two small figures (Victor & Elizabeth) */}
        <g style={{animation:"slowTurn 15s ease-in-out infinite",transformOrigin:"400px 250px"}}>
          <circle cx="390" cy="242" r="3.5" fill={fg} opacity="0.7"/>
          <line x1="390" y1="246" x2="390" y2="260" stroke={fg} strokeWidth="2" opacity="0.7"/>
          <circle cx="410" cy="244" r="3" fill={fg} opacity="0.7"/>
          <line x1="410" y1="248" x2="410" y2="260" stroke={fg} strokeWidth="1.5" opacity="0.7"/>
        </g>
        {/* Warm sun glow */}
        <circle cx="650" cy="100" r="30" fill={accent} opacity="0.15" style={{animation:"breathe 6s infinite"}}/>
      </svg>
    ),
    // Chapter 3: Creation scene - laboratory, lightning, the creature's eye
    3:(
      <svg viewBox="0 0 800 350" style={{width:"100%",height:"auto",animation:"fadeIn 1.5s ease both"}}>
        <defs>
          <linearGradient id="sky3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0a0a0a"/><stop offset="100%" stopColor={dark?"#151520":"#2a2a35"}/></linearGradient>
          <filter id="glow3"><feGaussianBlur in="SourceGraphic" stdDeviation="4"/></filter>
        </defs>
        <rect width="800" height="350" fill="url(#sky3)"/>
        {/* Lightning flash */}
        <rect width="800" height="350" fill="#fff" opacity="0" style={{animation:"lightning 8s infinite"}}/>
        {/* Lab table */}
        <rect x="200" y="220" width="400" height="8" rx="2" fill={fg} opacity="0.6"/>
        <rect x="220" y="228" width="8" height="80" fill={fg} opacity="0.5"/>
        <rect x="572" y="228" width="8" height="80" fill={fg} opacity="0.5"/>
        {/* Body on table */}
        <ellipse cx="400" cy="215" rx="140" ry="12" fill={fg} opacity="0.4"/>
        {/* The creature's EYE - the key moment */}
        <g style={{animation:"eyeGlow 4s ease-in-out infinite"}}>
          <ellipse cx="380" cy="208" rx="6" ry="4" fill={accent} opacity="0.9"/>
          <circle cx="380" cy="208" r="2" fill="#000"/>
        </g>
        {/* Equipment silhouettes */}
        <rect x="150" y="150" width="20" height="70" rx="3" fill={fg} opacity="0.3"/>
        <rect x="630" y="160" width="25" height="60" rx="3" fill={fg} opacity="0.3"/>
        <circle cx="160" cy="145" r="12" fill="none" stroke={fg} strokeWidth="1.5" opacity="0.3"/>
        {/* Wires/tubes */}
        <path d="M170,180 Q250,170 340,210" fill="none" stroke={fg} strokeWidth="1" opacity="0.3"/>
        <path d="M630,180 Q550,170 460,210" fill="none" stroke={fg} strokeWidth="1" opacity="0.3"/>
        {/* Candle with flicker */}
        <rect x="680" y="200" width="4" height="20" fill={fg} opacity="0.6"/>
        <ellipse cx="682" cy="198" rx="4" ry="6" fill={accent} opacity="0.7" style={{animation:"flicker 2s infinite"}}/>
        {/* Victor recoiling - silhouette */}
        <g style={{animation:"slowTurn 6s ease-in-out infinite",transformOrigin:"120px 220px"}}>
          <circle cx="120" cy="190" r="8" fill={fg} opacity="0.7"/>
          <path d="M120,198 L118,230 M112,208 L95,220 M128,208 L140,200" stroke={fg} strokeWidth="2.5" opacity="0.7" strokeLinecap="round"/>
        </g>
        {/* Smoke/steam rising */}
        {[300,350,400,450,500].map((x,i)=><circle key={i} cx={x} cy={200-i*8} r={3+Math.random()*3} fill={mg} opacity="0.15" style={{animation:`rise ${5+i}s linear infinite ${i*0.8}s`}}/>)}
      </svg>
    ),
    // Chapter 4: Creature speaks - confrontation, two figures, anguish
    4:(
      <svg viewBox="0 0 800 350" style={{width:"100%",height:"auto",animation:"fadeIn 1.5s ease both"}}>
        <defs>
          <linearGradient id="sky4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={dark?"#0c0c10":"#1a1a25"}/><stop offset="100%" stopColor={dark?"#1a1a22":"#3a3a48"}/></linearGradient>
          <filter id="fog4"><feGaussianBlur in="SourceGraphic" stdDeviation="5"/></filter>
        </defs>
        <rect width="800" height="350" fill="url(#sky4)"/>
        {/* Mountain backdrop */}
        <path d="M0,200 L200,130 L400,180 L600,120 L800,160 L800,350 L0,350Z" fill={mg} opacity="0.15"/>
        {/* The Creature - large, imposing, facing viewer */}
        <g style={{animation:"slowTurn 10s ease-in-out infinite",transformOrigin:"300px 200px"}}>
          <circle cx="300" cy="140" r="16" fill={fg} opacity="0.8"/>
          {/* Eyes that glow */}
          <g style={{animation:"eyeGlow 5s ease-in-out infinite"}}>
            <ellipse cx="294" cy="138" rx="3" ry="2" fill={accent} opacity="0.9"/>
            <ellipse cx="306" cy="138" rx="3" ry="2" fill={accent} opacity="0.9"/>
          </g>
          <line x1="300" y1="156" x2="300" y2="230" stroke={fg} strokeWidth="6" opacity="0.7" strokeLinecap="round"/>
          <line x1="300" y1="170" x2="270" y2="200" stroke={fg} strokeWidth="4" opacity="0.6" strokeLinecap="round"/>
          <line x1="300" y1="170" x2="330" y2="195" stroke={fg} strokeWidth="4" opacity="0.6" strokeLinecap="round"/>
          <line x1="296" y1="230" x2="280" y2="290" stroke={fg} strokeWidth="4" opacity="0.6" strokeLinecap="round"/>
          <line x1="304" y1="230" x2="320" y2="290" stroke={fg} strokeWidth="4" opacity="0.6" strokeLinecap="round"/>
        </g>
        {/* Victor - smaller, shrinking back */}
        <g style={{animation:"sway 8s ease-in-out infinite",transformOrigin:"550px 220px"}}>
          <circle cx="550" cy="195" r="8" fill={fg} opacity="0.6"/>
          <line x1="550" y1="203" x2="548" y2="250" stroke={fg} strokeWidth="2.5" opacity="0.6" strokeLinecap="round"/>
          <line x1="550" y1="215" x2="565" y2="230" stroke={fg} strokeWidth="2" opacity="0.5" strokeLinecap="round"/>
        </g>
        {/* Mist between them */}
        <ellipse cx="420" cy="270" rx="200" ry="40" fill={mg} opacity="0.15" filter="url(#fog4)" style={{animation:"driftFog 12s ease-in-out infinite"}}/>
      </svg>
    ),
    // Chapter 5: Epilogue - Arctic, emptiness, final reckoning
    5:(
      <svg viewBox="0 0 800 350" style={{width:"100%",height:"auto",animation:"fadeIn 1.5s ease both"}}>
        <defs>
          <linearGradient id="sky5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={dark?"#080810":"#1a1a28"}/><stop offset="100%" stopColor={dark?"#141420":"#4a4a60"}/></linearGradient>
          <filter id="fog5"><feGaussianBlur in="SourceGraphic" stdDeviation="10"/></filter>
        </defs>
        <rect width="800" height="350" fill="url(#sky5)"/>
        {/* Stars */}
        {[...Array(40)].map((_,i)=><circle key={i} cx={Math.random()*800} cy={Math.random()*200} r={Math.random()*1.2+0.3} fill="#fff" opacity={Math.random()*0.5+0.2} style={{animation:`breathe ${3+Math.random()*5}s infinite ${Math.random()*3}s`}}/>)}
        {/* Vast ice */}
        <path d="M0,230 L200,225 L400,235 L600,220 L800,230 L800,350 L0,350Z" fill={bg2} opacity="0.4"/>
        {/* Single figure walking away - disappearing into darkness */}
        <g style={{animation:"slowTurn 20s ease-in-out infinite",transformOrigin:"400px 220px"}}>
          <circle cx="400" cy="210" r="4" fill={fg} opacity="0.5"/>
          <line x1="400" y1="214" x2="400" y2="230" stroke={fg} strokeWidth="2" opacity="0.4"/>
        </g>
        {/* Heavy fog - the creature vanishes */}
        <ellipse cx="400" cy="260" rx="400" ry="60" fill={bg2} opacity="0.3" filter="url(#fog5)" style={{animation:"driftFog 25s ease-in-out infinite"}}/>
        <ellipse cx="200" cy="280" rx="250" ry="40" fill={bg2} opacity="0.2" filter="url(#fog5)" style={{animation:"driftFog 20s ease-in-out infinite 5s"}}/>
      </svg>
    ),
  };

  return scenes[chapterIdx]||null;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════
function useWinWidth(){const[w,setW]=useState(1024);useEffect(()=>{const u=()=>setW(window.innerWidth);u();window.addEventListener("resize",u);return()=>window.removeEventListener("resize",u)},[]);return w}

function AnimCounter({end,duration=1800,prefix="",suffix=""}){
  const[val,setVal]=useState(0);
  useEffect(()=>{let s=0;const step=end/(duration/16);const id=setInterval(()=>{s+=step;if(s>=end){setVal(end);clearInterval(id)}else setVal(Math.floor(s))},16);return()=>clearInterval(id)},[end,duration]);
  return<span>{prefix}{val.toLocaleString()}{suffix}</span>
}

function Sparkline({data,color=C.accent,w=120,h=32}){
  const max=Math.max(...data),min=Math.min(...data);
  const pts=data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-min)/(max-min||1))*(h-4)-2}`).join(" ");
  const gid=`sg${Math.random().toString(36).slice(2,6)}`;
  return(<svg width={w} height={h} style={{display:"block"}}><defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.3"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs><polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" points={pts}/><polygon fill={`url(#${gid})`} points={`0,${h} ${pts} ${w},${h}`}/></svg>)
}


// ═══════════════════════════════════════════════════════════════════════════
// CREATOR DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
function EmailGate({onSubmit}){
  const[email,setEmail]=useState("");const[name,setName]=useState("");const[role,setRole]=useState("");const[step,setStep]=useState(0);const[hover,setHover]=useState(false);
  const ok=email.includes("@")&&email.includes(".")&&name;
  const inp={width:"100%",padding:"14px 16px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:12,color:C.text,fontSize:15,outline:"none",boxSizing:"border-box",transition:"border-color 0.2s",fontFamily:FF};
  return(
    <div style={{height:"100vh",display:"flex",alignItems:"flex-start",justifyContent:"center",background:"#000",fontFamily:FF,padding:"40px 24px",overflowY:"scroll",WebkitOverflowScrolling:"touch"}}>
      <div style={{width:"100%",maxWidth:480,animation:"fadeUp 0.8s ease both",paddingBottom:60}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <img src="/movianx-logo.png" alt="Movianx" style={{height:50,width:"auto",marginBottom:16}}/>
          <p style={{color:C.text2,fontSize:13,marginTop:8,letterSpacing:"2px",textTransform:"uppercase"}}>Creator Studio</p>
        </div>
        <div style={{background:C.surface,borderRadius:24,padding:"40px 36px",border:`1px solid ${C.border}`}}>
          {step===0?(
            <>
              <h2 style={{color:C.text,fontSize:22,fontWeight:700,margin:"0 0 8px"}}>Get Early Access</h2>
              <p style={{color:C.text2,fontSize:14,margin:"0 0 32px",lineHeight:1.6}}>Transform your books into immersive, choice-driven experiences with synchronized audio, AI visuals, and direct-to-reader commerce.</p>
              <label style={{display:"block",marginBottom:20}}>
                <span style={{color:C.text2,fontSize:11,textTransform:"uppercase",letterSpacing:"1.5px",display:"block",marginBottom:8}}>Full Name</span>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={inp} onFocus={e=>e.target.style.borderColor="#fff"} onBlur={e=>e.target.style.borderColor=C.border}/>
              </label>
              <label style={{display:"block",marginBottom:20}}>
                <span style={{color:C.text2,fontSize:11,textTransform:"uppercase",letterSpacing:"1.5px",display:"block",marginBottom:8}}>Email</span>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" style={inp} onFocus={e=>e.target.style.borderColor="#fff"} onBlur={e=>e.target.style.borderColor=C.border}/>
              </label>
              <label style={{display:"block",marginBottom:28}}>
                <span style={{color:C.text2,fontSize:11,textTransform:"uppercase",letterSpacing:"1.5px",display:"block",marginBottom:8}}>I am a...</span>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {["Author","Publisher","Storyteller","Investor","Other"].map(r2=>(
                    <button key={r2} onClick={()=>setRole(r2)} style={{padding:"10px 18px",borderRadius:20,border:`1px solid ${role===r2?"#fff":C.border}`,background:role===r2?"#fff":"transparent",color:role===r2?"#000":C.text2,fontSize:13,cursor:"pointer",fontWeight:role===r2?600:400,transition:"all 0.2s",fontFamily:FF}}>{r2}</button>
                  ))}
                </div>
              </label>
              <button disabled={!ok} onClick={()=>setStep(1)} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} style={{width:"100%",padding:"16px",borderRadius:12,border:"none",background:ok?"#fff":C.surface2,color:ok?"#000":C.text2,fontSize:14,fontWeight:600,cursor:ok?"pointer":"not-allowed",transform:hover&&ok?"translateY(-1px)":"translateY(0)",transition:"all 0.2s",fontFamily:FF}}>Continue →</button>
            </>
          ):(
            <>
              <div style={{textAlign:"center",marginBottom:32}}>
                <div style={{width:64,height:64,borderRadius:"50%",background:"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:32,marginBottom:20,color:"#000"}}>✓</div>
                <h2 style={{color:C.text,fontSize:22,fontWeight:700,margin:"0 0 8px"}}>Welcome, {name.split(" ")[0]}!</h2>
                <p style={{color:C.text2,fontSize:14,margin:0,lineHeight:1.6}}>We'll notify <span style={{color:"#fff",fontWeight:600}}>{email}</span> when we're ready.</p>
              </div>
              <button onClick={()=>onSubmit({name,email,role})} style={{width:"100%",padding:"16px",borderRadius:12,border:"none",background:"#fff",color:"#000",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:FF}} onMouseEnter={e=>e.target.style.transform="translateY(-1px)"} onMouseLeave={e=>e.target.style.transform="translateY(0)"}>Enter Demo Dashboard →</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DashSidebar({active,setActive,user}){
  const nav=[{id:"overview",icon:"📊",label:"Overview"},{id:"upload",icon:"⬆",label:"Upload"},{id:"analytics",icon:"📈",label:"Analytics"},{id:"merch",icon:"🛍",label:"Merch"},{id:"streaming",icon:"📡",label:"Streaming"}];
  return(
    <div style={{width:260,height:"100%",background:"#000",borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column"}}>
      <div style={{padding:"24px 20px",borderBottom:`1px solid ${C.border}`}}><img src="/movianx-logo.png" alt="Movianx" style={{height:32,width:"auto"}}/></div>
      <div style={{flex:1,padding:"16px 12px",overflowY:"auto"}}>
        {nav.map(n=>(
          <button key={n.id} onClick={()=>setActive(n.id)} style={{width:"100%",padding:"12px 14px",marginBottom:6,borderRadius:12,border:"none",textAlign:"left",cursor:"pointer",background:active===n.id?"#fff":"transparent",color:active===n.id?"#000":C.text2,fontSize:14,fontWeight:active===n.id?600:400,display:"flex",alignItems:"center",gap:12,transition:"all 0.2s",fontFamily:FF}} onMouseEnter={e=>{if(active!==n.id)e.currentTarget.style.background=C.surface2}} onMouseLeave={e=>{if(active!==n.id)e.currentTarget.style.background="transparent"}}><span style={{fontSize:18}}>{n.icon}</span>{n.label}</button>
        ))}
      </div>
      <div style={{padding:20,borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:40,height:40,borderRadius:"50%",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#000"}}>{user.name[0]}</div>
        <div><div style={{fontSize:13,fontWeight:600,color:C.text}}>{user.name}</div><div style={{fontSize:11,color:C.text2}}>Creator</div></div>
      </div>
    </div>
  );
}

function DashOverview(){
  const rev=[2400,3100,2800,3900,4200,5100,5800],rdr=[120,145,138,162,178,195,210];
  return(
    <div style={{animation:"fadeUp 0.5s ease both"}}>
      <h1 style={{fontSize:26,fontWeight:700,color:C.text,margin:"0 0 4px"}}>Creator Dashboard</h1>
      <p style={{color:C.text2,fontSize:14,margin:"0 0 32px"}}>Your interactive storytelling empire at a glance</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16,marginBottom:24}}>
        {[{label:"Total Revenue",val:27800,prefix:"$",change:"+18%",color:C.green,spark:rev},{label:"Active Readers",val:1248,change:"+12%",color:C.accent,spark:rdr},{label:"Stories Published",val:7,change:"+2",color:C.gold},{label:"Avg. Completion",val:68,suffix:"%",change:"+5%",color:C.purple}].map((s,i)=>(
          <div key={i} style={{background:C.surface,borderRadius:16,border:`1px solid ${C.border}`,padding:20}}>
            <div style={{fontSize:12,color:C.text2,marginBottom:8}}>{s.label}</div>
            <div style={{fontSize:28,fontWeight:700,color:C.text,marginBottom:4}}><AnimCounter end={s.val} prefix={s.prefix||""} suffix={s.suffix||""}/></div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontSize:12,fontWeight:600,color:s.color}}>{s.change}</span>{s.spark&&<Sparkline data={s.spark} color={s.color} w={80} h={24}/>}</div>
          </div>
        ))}
      </div>
      <div style={{background:C.surface,borderRadius:16,border:`1px solid ${C.border}`,padding:24}}>
        <div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:16}}>Recent Activity</div>
        {[{act:"New reader completed The Midnight Cipher",time:"2 min ago",icon:"✓",color:C.green},{act:"Merch sale: Signed Hardcover Bundle",time:"18 min ago",icon:"$",color:C.gold},{act:"Choice analytics updated for Chapter 7",time:"1 hour ago",icon:"📊",color:C.purple},{act:"AI narration processed",time:"3 hours ago",icon:"🎙",color:C.accent}].map((a,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:i<3?`1px solid ${C.border}`:"none"}}>
            <div style={{width:32,height:32,borderRadius:8,background:C.surface2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:a.color,flexShrink:0}}>{a.icon}</div>
            <div><div style={{fontSize:13,color:C.text}}>{a.act}</div><div style={{fontSize:11,color:C.text2,marginTop:2}}>{a.time}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashUpload(){
  return(
    <div style={{animation:"fadeUp 0.5s ease both"}}>
      <h1 style={{fontSize:26,fontWeight:700,color:C.text,margin:"0 0 4px"}}>Upload Story</h1>
      <p style={{color:C.text2,fontSize:14,margin:"0 0 32px"}}>Transform your manuscript into an interactive experience</p>
      <div style={{border:`2px dashed ${C.border}`,borderRadius:20,padding:"60px 40px",textAlign:"center",marginBottom:24,cursor:"pointer"}}>
        <div style={{fontSize:48,marginBottom:16}}>📄</div>
        <p style={{fontSize:16,fontWeight:600,color:C.text,marginBottom:8}}>Drop your manuscript here</p>
        <p style={{fontSize:13,color:C.text2}}>Supports .epub, .docx, .txt, .pdf</p>
      </div>
    </div>
  );
}

function DashAnalytics(){
  return(
    <div style={{animation:"fadeUp 0.5s ease both"}}>
      <h1 style={{fontSize:26,fontWeight:700,color:C.text,margin:"0 0 4px"}}>Analytics</h1>
      <p style={{color:C.text2,fontSize:14,margin:"0 0 32px"}}>Reader behavior & story performance</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
        {[{story:"The Midnight Cipher",readers:847,completion:72},{story:"Echoes of Tomorrow",readers:312,completion:58},{story:"Silent Horizons",readers:89,completion:81}].map((s,i)=>(
          <div key={i} style={{background:C.surface,borderRadius:16,border:`1px solid ${C.border}`,padding:20}}>
            <div style={{fontSize:15,fontWeight:600,color:C.text,marginBottom:12}}>{s.story}</div>
            <div style={{display:"flex",gap:16,marginBottom:12}}>
              <div><div style={{fontSize:11,color:C.text2}}>Readers</div><div style={{fontSize:22,fontWeight:700,color:C.accent}}>{s.readers}</div></div>
              <div><div style={{fontSize:11,color:C.text2}}>Completion</div><div style={{fontSize:22,fontWeight:700,color:C.green}}>{s.completion}%</div></div>
            </div>
            <div style={{height:4,borderRadius:2,background:C.surface2,overflow:"hidden"}}><div style={{height:"100%",width:`${s.completion}%`,background:`linear-gradient(90deg,${C.accent},${C.gold})`}}/></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashMerch(){
  return(
    <div style={{animation:"fadeUp 0.5s ease both"}}>
      <h1 style={{fontSize:26,fontWeight:700,color:C.text,margin:"0 0 4px"}}>Merch & Products</h1>
      <p style={{color:C.text2,fontSize:14,margin:"0 0 32px"}}>Sell directly to your readers</p>
      <div style={{background:C.surface,borderRadius:16,border:`1px solid ${C.border}`,padding:24}}>
        {[{img:"📕",name:"Signed Hardcover",price:"$32",sold:124},{img:"🎧",name:"Audiobook Bundle",price:"$18",sold:312},{img:"👕",name:"Limited Tee",price:"$28",sold:47}].map((p,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:16,padding:"14px 0",borderBottom:i<2?`1px solid ${C.border}`:"none"}}>
            <div style={{width:48,height:48,borderRadius:10,background:C.surface2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>{p.img}</div>
            <div><div style={{fontSize:14,fontWeight:600,color:C.text}}>{p.name}</div><div style={{fontSize:18,fontWeight:700,color:C.accent,marginTop:4}}>{p.price}</div><div style={{fontSize:11,color:C.text2,marginTop:2}}>{p.sold} sold</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashStreaming(){
  return(
    <div style={{animation:"fadeUp 0.5s ease both"}}>
      <h1 style={{fontSize:26,fontWeight:700,color:C.text,margin:"0 0 4px"}}>Streaming & Live</h1>
      <p style={{color:C.text2,fontSize:14,margin:"0 0 32px"}}>Your content, distributed everywhere</p>
      <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
        {[{p:"Movianx App",s:"Live",c:C.accent},{p:"Spotify",s:"Synced",c:"#1DB954"},{p:"Apple Books",s:"Pending",c:"#FC3C44"},{p:"Audible",s:"In Queue",c:"#FF9900"}].map((x,i)=>(
          <div key={i} style={{flex:"1 1 calc(50% - 8px)",minWidth:240,background:C.surface,borderRadius:16,border:`1px solid ${C.border}`,padding:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:15,fontWeight:600,color:C.text}}>{x.p}</span><span style={{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:6,background:(x.s==="Live"||x.s==="Synced")?"rgba(74,222,128,0.15)":"rgba(212,168,67,0.15)",color:(x.s==="Live"||x.s==="Synced")?C.green:C.gold}}>{x.s}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Monetization Simulator (NEW) ───
function MonetizationSim({storyTitle,onClose}){
  const[readers,setReaders]=useState(10000);const[rate,setRate]=useState(12);const[show,setShow]=useState(false);
  const prem=Math.round(readers*(rate/100)),free=readers-prem;
  const adRev=Math.round(free*0.008*30),subRev=Math.round(prem*9.99*0.7),tipRev=Math.round(readers*0.02*4.5),merchRev=Math.round(readers*0.03*22);
  const total=adRev+subRev+tipRev+merchRev;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20,animation:"fadeIn 0.3s ease"}}>
      <div style={{width:"100%",maxWidth:540,background:"#0A0A0F",borderRadius:24,border:`1px solid ${C.border}`,padding:"36px 32px",maxHeight:"90vh",overflowY:"auto",animation:"fadeUp 0.4s ease both"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
          <div><h2 style={{fontSize:20,fontWeight:700,color:C.text,margin:0}}>Revenue Simulator</h2><p style={{fontSize:13,color:C.text2,marginTop:4}}>{storyTitle||"Your Story"}</p></div>
          <button onClick={onClose} style={{width:36,height:36,borderRadius:"50%",border:`1px solid ${C.border}`,background:"transparent",color:C.text2,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <div style={{marginBottom:24}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:11,color:C.text2,textTransform:"uppercase",letterSpacing:"1px"}}>Monthly Readers</span><span style={{fontSize:14,fontWeight:700,color:C.text}}>{readers.toLocaleString()}</span></div>
          <input type="range" min="1000" max="100000" step="1000" value={readers} onChange={e=>setReaders(+e.target.value)} style={{width:"100%",accentColor:"#fff"}}/>
        </div>
        <div style={{marginBottom:28}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:11,color:C.text2,textTransform:"uppercase",letterSpacing:"1px"}}>Premium Conversion</span><span style={{fontSize:14,fontWeight:700,color:C.text}}>{rate}%</span></div>
          <input type="range" min="2" max="30" value={rate} onChange={e=>setRate(+e.target.value)} style={{width:"100%",accentColor:"#fff"}}/>
        </div>
        {!show?(
          <button onClick={()=>setShow(true)} style={{width:"100%",padding:16,borderRadius:12,border:"none",background:"#fff",color:"#000",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:FF}}>Calculate Potential Revenue →</button>
        ):(
          <div style={{animation:"fadeUp 0.5s ease both"}}>
            <div style={{textAlign:"center",padding:"24px 0",marginBottom:20,borderRadius:16,background:C.surface,border:`1px solid ${C.border}`}}>
              <div style={{fontSize:11,color:C.text2,textTransform:"uppercase",letterSpacing:"2px",marginBottom:8}}>Estimated Monthly Revenue</div>
              <div style={{fontSize:44,fontWeight:800,color:"#fff",letterSpacing:"-2px"}}>${total.toLocaleString()}</div>
              <div style={{fontSize:14,color:C.green,fontWeight:600,marginTop:4}}>${(total*12).toLocaleString()}/year</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
              {[{l:"Ad Revenue",v:adRev,c:C.purple},{l:"Subscriptions",v:subRev,c:C.green},{l:"Tips",v:tipRev,c:C.gold},{l:"Merch",v:merchRev,c:C.red}].map((r,i)=>(
                <div key={i} style={{padding:14,borderRadius:12,background:C.surface,border:`1px solid ${C.border}`}}><div style={{fontSize:11,color:C.text2,marginBottom:4}}>{r.l}</div><div style={{fontSize:18,fontWeight:700,color:r.c}}>${r.v.toLocaleString()}</div></div>
              ))}
            </div>
            <div style={{padding:16,borderRadius:12,background:C.surface,border:`1px solid ${C.border}`,marginBottom:16}}>
              <div style={{fontSize:12,fontWeight:600,color:C.text,marginBottom:10}}>Your Creator Tier</div>
              {[{t:"Explorer",s:"60%",min:0},{t:"Pro",s:"70%",min:1000},{t:"Elite",s:"80%",min:5000},{t:"Partner",s:"85%",min:20000}].map((t,i,arr)=>{
                const next=arr[i+1];const on=total>=t.min&&(!next||total<next.min);
                return(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 10px",borderRadius:8,background:on?"rgba(255,255,255,0.08)":"transparent",border:on?"1px solid rgba(255,255,255,0.2)":"1px solid transparent"}}><span style={{fontSize:13,fontWeight:on?700:400,color:on?"#fff":C.text2}}>{t.t}{on&&" ←"}</span><span style={{fontSize:14,fontWeight:700,color:on?C.green:C.text2}}>{t.s}</span></div>)
              })}
            </div>
            <button onClick={()=>setShow(false)} style={{width:"100%",padding:14,borderRadius:12,border:`1px solid ${C.border}`,background:"transparent",color:C.text2,fontSize:13,cursor:"pointer",fontFamily:FF}}>Adjust Parameters</button>
          </div>
        )}
      </div>
    </div>
  );
}

function CreatorDashboard({onBack}){
  const[user,setUser]=useState(null);const[active,setActive]=useState("overview");const[menuOpen,setMenuOpen]=useState(false);
  const[showSim,setShowSim]=useState(false);
  const ww=useWinWidth();const mob=ww<=768;
  if(!user)return<EmailGate onSubmit={setUser}/>;
  const pages={overview:<DashOverview/>,upload:<DashUpload/>,analytics:<DashAnalytics/>,merch:<DashMerch/>,streaming:<DashStreaming/>};
  return(
    <div style={{display:"flex",minHeight:"100vh",background:C.dark,fontFamily:FF,color:C.text}}>
      {showSim&&<MonetizationSim storyTitle="Your Story" onClose={()=>setShowSim(false)}/>}
      {mob&&<button onClick={()=>setMenuOpen(!menuOpen)} style={{position:"fixed",top:20,left:20,zIndex:250,padding:"12px 14px",borderRadius:8,background:"#000",border:"1px solid #fff",color:"#fff",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{menuOpen?"✕":"☰"}</button>}
      <div style={{position:mob?"fixed":"relative",top:0,left:(menuOpen||!mob)?0:-300,height:"100vh",width:260,background:"#000",zIndex:200,transition:"left 0.3s ease"}}><DashSidebar active={active} setActive={id=>{setActive(id);setMenuOpen(false)}} user={user}/></div>
      {menuOpen&&mob&&<div onClick={()=>setMenuOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:150}}/>}
      <div style={{flex:1,padding:"32px 20px",overflowY:"auto",maxHeight:"100vh"}}>
        <div style={{display:"flex",gap:12,position:"absolute",top:20,right:20}}>
          <button onClick={()=>setShowSim(true)} style={{padding:"10px 20px",borderRadius:8,border:"1px solid "+C.green,background:"transparent",color:C.green,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:FF}}>💰 Revenue Simulator</button>
          <button onClick={onBack} style={{padding:"10px 20px",borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:C.text2,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:FF}} onMouseEnter={e=>{e.target.style.borderColor=C.accent;e.target.style.color=C.accent}} onMouseLeave={e=>{e.target.style.borderColor=C.border;e.target.style.color=C.text2}}>← Back to Reader</button>
        </div>
        {pages[active]}
      </div>
      <style>{CSS}</style>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// STORY DATA
// ═══════════════════════════════════════════════════════════════════════════
const STORIES=[
  {id:1,title:"Frankenstein",author:"Mary Shelley",genre:"Gothic / Classic",cover:"https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop",desc:"The timeless tale of ambition and creation. Your choices shape the tragic destinies of creator and creature.",immersions:["Reader","Cinematic","Immersive"],rating:4.9,reads:"159K",chapters:10,isClassic:true},
  {id:2,title:"The Choice [Sample]",author:"Movianx Demo",genre:"Thriller / Interactive",cover:"https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=400&h=600&fit=crop",desc:"A quick 3-minute demo showing how choices branch the story.",immersions:["Reader","Cinematic","Immersive"],rating:4.7,reads:"Sample",chapters:4,isSample:true},
  {id:3,title:"10 Seconds",author:"Movianx Original",genre:"Thriller / Survival Horror",cover:"https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&h=600&fit=crop",desc:"You have 10 seconds to decide. Every choice. Every time. ⏱️ TIMED CHOICES.",immersions:["Reader","Cinematic","Immersive"],rating:4.9,reads:"New",chapters:4,isTimed:true},
];

const FRANK=[
  {title:"Letter I - To Mrs. Saville, England",text:"St. Petersburgh, Dec. 11th, 17—.\n\nYou will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.\n\nI am already far north of London, and as I walk in the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight. Do you understand this feeling? This breeze, which has travelled from the regions towards which I am advancing, gives me a foretaste of those icy climes.\n\nInspired by this wind of promise, my daydreams become more fervent and vivid. I try in vain to be persuaded that the pole is the seat of frost and desolation; it ever presents itself to my imagination as the region of beauty and delight.\n\nWhat may not be expected in a country of eternal light? I may there discover the wondrous power which attracts the needle and may regulate a thousand celestial observations.\n\nI shall satiate my ardent curiosity with the sight of a part of the world never before visited, and may tread a land never before imprinted by the foot of man. These are my enticements, and they are sufficient to conquer all fear of danger or death.",choice:{prompt:"As Captain Walton, should I share my deepest ambitions, or keep some doubts to myself?",emotion:"ambitious",opts:[{txt:"Share everything - my burning desire for glory",next:1,consequence:"honest"},{txt:"Express some caution about the dangers ahead",next:1,consequence:"cautious"}]},narrator:"Captain Robert Walton writes to his sister, filled with ambition for his Arctic expedition.",emotion:"calm"},
  {title:"Letter IV - The Stranger",text:"August 5th, 17—.\n\nSo strange an accident has happened to us that I cannot forbear recording it.\n\nLast Monday we were nearly surrounded by ice, which closed in the ship on all sides. Our situation was somewhat dangerous, especially as we were compassed round by a very thick fog.\n\nAt about two o'clock the mist cleared away, and we beheld vast and irregular plains of ice. A strange sight suddenly attracted our attention.\n\nWe perceived a low carriage, fixed on a sledge and drawn by dogs, pass on towards the north; a being which had the shape of a man, but apparently of gigantic stature, sat in the sledge.\n\nThe next morning a traveller's sledge appeared. A European man addressed me: \"Before I come on board your vessel, will you have the kindness to inform me whither you are bound?\"\n\nHis limbs were nearly frozen, and his body dreadfully emaciated by fatigue and suffering. I never saw a man in so wretched a condition.",choice:{prompt:"This stranger carries a terrible burden. Should I press him for his story, or give him time?",emotion:"curious",opts:[{txt:"Ask him gently about his journey",next:2,consequence:"patient"},{txt:"Wait until he's ready to share",next:2,consequence:"respectful"}]},narrator:"Walton's crew encounters a mysterious figure on the ice.",emotion:"tense",sound:"ambient"},
  {title:"Chapter I - Victor's Childhood",text:"I am by birth a Genevese, and my family is one of the most distinguished of that republic. My ancestors had been for many years counsellors and syndics.\n\nMy mother's tender caresses and my father's smile of benevolent pleasure while regarding me are my first recollections. I was their plaything and their idol, and something better—their child.\n\nWhen I was about five years old, they passed a week on the shores of the Lake of Como. On the evening of their return, my mother, accompanied by a young girl, entered our home. That young girl was Elizabeth Lavenza.\n\nShe became more than a sister to me. She was the living spirit of love to soften and attract.\n\nMy temper was sometimes violent, and my passions vehement; but by some law in my temperature they were turned not towards childish pursuits but to an eager desire to learn.",choice:{prompt:"Young Victor shows intense curiosity. Should I encourage unbounded knowledge, or counsel moderation?",emotion:"reflective",opts:[{txt:"Pursue knowledge with unbridled passion",next:3,consequence:"ambitious"},{txt:"Balance ambition with wisdom and caution",next:3,consequence:"measured"}]},narrator:"Victor recounts his idyllic childhood and his bond with Elizabeth.",emotion:"calm"},
  {title:"Chapter IV - The Secret of Life",text:"It was on a dreary night of November that I beheld the accomplishment of my toils. With an anxiety that almost amounted to agony, I collected the instruments of life around me, that I might infuse a spark of being into the lifeless thing that lay at my feet.\n\nIt was already one in the morning; the rain pattered dismally against the panes, and my candle was nearly burnt out, when, by the glimmer of the half-extinguished light, I saw the dull yellow eye of the creature open; it breathed hard, and a convulsive motion agitated its limbs.\n\nHow can I describe my emotions at this catastrophe, or how delineate the wretch whom with such infinite pains and care I had endeavoured to form?\n\nHis yellow skin scarcely covered the work of muscles and arteries beneath; his hair was of a lustrous black, and flowing; his teeth of a pearly whiteness; but these luxuriances only formed a more horrid contrast with his watery eyes.\n\nI had worked hard for nearly two years, for the sole purpose of infusing life into an inanimate body. But now that I had finished, the beauty of the dream vanished, and breathless horror and disgust filled my heart.\n\nUnable to endure the aspect of the being I had created, I rushed out of the room.",choice:{prompt:"I have created life, but it fills me with horror. Should I face my creation, or flee?",emotion:"terrified",opts:[{txt:"Return to the laboratory and face what I've created",next:4,consequence:"responsibility"},{txt:"Abandon the creature and try to forget",next:4,consequence:"abandonment"}]},narrator:"Victor brings his creation to life, but is struck with horror.",emotion:"terrified",sound:"heartbeat",jumpScare:true},
  {title:"The Creature Speaks",text:"\"All men hate the wretched; how, then, must I be hated, who am miserable beyond all living things! Yet you, my creator, detest and spurn me, thy creature.\n\n\"You purpose to kill me. How dare you sport thus with life? Do your duty towards me, and I will do mine towards you and the rest of mankind.\"\n\n\"Be calm! I entreat you to hear me. Have I not suffered enough?\n\n\"Remember, thou hast made me more powerful than thyself. But I will not be tempted to set myself in opposition to thee. I am thy creature, and I will be even mild and docile to my natural lord.\n\n\"Oh, Frankenstein, remember that I am thy creature; I ought to be thy Adam, but I am rather the fallen angel. I was benevolent and good; misery made me a fiend. Make me happy, and I shall again be virtuous.\"",choice:{prompt:"The creature demands a companion. Should I grant this request, or refuse?",emotion:"anguished",opts:[{txt:"Agree to create a companion - perhaps it will bring peace",next:5,consequence:"agreement"},{txt:"Refuse - I cannot risk creating another monster",next:5,consequence:"refusal"}]},narrator:"The creature confronts Victor and makes a terrible demand.",emotion:"tense"},
  {title:"Epilogue - The Cost of Ambition",text:"[Your choices have shaped Victor's fate]\n\n\"Farewell, Walton! Seek happiness in tranquillity and avoid ambition, even if it be only the apparently innocent one of distinguishing yourself in science and discoveries.\"\n\nHis voice became fainter as he spoke. The monster has disappeared, vanished into the darkness of the Arctic night.\n\nWhat lessons will you carry forward? That ambition unchecked leads to ruin? That we bear responsibility for what we create? That even monsters deserve compassion?\n\nThe icy wastes hold many secrets still. But some stories end not with triumph, but with the haunting question:\n\nWhat have we become in our pursuit to become gods?\n\n[END]\n\nYou have finished Frankenstein."},
];

const SAMPLE=[
  {title:"The Message",text:"Your phone buzzes at 2 AM. Unknown number.\n\n\"Meet me at the old lighthouse. Come alone. You have one hour.\"\n\nYou've been investigating the disappearance of three journalists who were all working on the same story - something about the mayor's connection to offshore accounts. This could be the break you need.\n\nBut it could also be a trap.\n\nYour editor told you to drop it. Your partner told you to be careful. The threatening letter you got last week told you to stop digging.\n\nOne hour. The lighthouse.",choice:{prompt:"You have one hour to decide. Do you go alone, or call for backup?",emotion:"tense",opts:[{txt:"Go alone - this source won't talk if I bring anyone",next:1,consequence:"alone"},{txt:"Call my partner for backup first",next:2,consequence:"backup"}]},narrator:"You receive a mysterious message in the middle of the night.",emotion:"calm"},
  {title:"The Lighthouse - Alone",text:"The lighthouse looms against the night sky. No lights. No cars.\n\nYou park a quarter mile away and approach on foot. The door is unlocked.\n\nInside, your flashlight catches files scattered everywhere. Financial records. Wire transfers. Photos.\n\nThen you hear footsteps on the spiral stairs above. Coming down.\n\n\"You came alone. Good. That means you're serious about the truth.\"\n\nYou recognize them - the mayor's chief of staff. They're holding a USB drive.\n\n\"Everything's on here. But if you take it, they'll know it was me. Or... you walk away, and I'll leak it anonymously. You get your story, I keep my life.\"",choice:{prompt:"Take the evidence yourself, or trust them to leak it anonymously?",emotion:"tense",opts:[{txt:"Take the USB drive - I need to verify this myself",next:3,consequence:"take"},{txt:"Let them leak it anonymously - protect the source",next:3,consequence:"trust"}]},narrator:"You arrive at the lighthouse and make a fateful choice.",emotion:"nervous",sound:"footsteps"},
  {title:"The Lighthouse - With Backup",text:"Your partner arrives in an unmarked car. You approach the lighthouse together.\n\nFiles are scattered everywhere. But no one is here.\n\n\"This is too easy,\" your partner whispers. \"Something's wrong.\"\n\nThat's when you hear the click. A camera shutter. Then footsteps - multiple people, moving fast.\n\nLights flood the lighthouse. Cameras. Reporters.\n\n\"There they are! The journalists who fabricated evidence against the mayor!\"\n\nThe files on the floor - they're YOUR stories. But altered. Forged signatures. Fake timestamps.\n\nSomeone set you up.\n\nThe story breaks before sunrise: \"Journalists caught planting false evidence.\" Your source never existed. The real story is buried forever.",choice:{prompt:"You've been framed. Do you fight the narrative publicly, or go underground?",emotion:"panicked",opts:[{txt:"Fight publicly - hold a press conference immediately",next:3,consequence:"fight"},{txt:"Go underground - investigate who set us up",next:3,consequence:"underground"}]},narrator:"It was a trap. You've been framed.",emotion:"terrified"},
  {title:"The Aftermath",text:"[Your choices determined everything]\n\nEvery path led somewhere different. Every decision mattered.\n\nThe journalist who went alone got the truth - but at what cost?\nThe one who brought backup was destroyed by lies.\nThe one who took the drive became a target.\nThe one who trusted the source... sometimes trust is all we have.\n\nThis is what Movianx does. Every story. Every choice. Every consequence.\n\nWelcome to the future of storytelling.\n\n[END]"},
];

const TIMED=[
  {title:"3:47 AM",text:"You wake up to glass breaking downstairs.\n\nYour wife Sarah is asleep beside you. Your two kids are down the hall. You reach for your phone: 3:47 AM.\n\nAnother crash. This time louder. Closer.\n\nFootsteps. More than one person.\n\nYou have a baseball bat in the closet. Your phone is at 4% battery. The home alarm panel is downstairs by the front door - where the sounds are coming from.\n\nSarah stirs. \"What was that?\"\n\nYou have 10 seconds to decide.",choice:{prompt:"Intruders are in your house. Your family is asleep. What do you do?",emotion:"terrified",timeLimit:10,opts:[{txt:"Grab the bat and go downstairs",next:1,consequence:"confront"},{txt:"Lock the bedroom door and call 911",next:1,consequence:"hide"},{txt:"Wake the kids and escape through the window",next:1,consequence:"escape"},{txt:"Grab Sarah and barricade in the bathroom",next:1,consequence:"barricade"}]},narrator:"You wake to the sound of intruders in your home.",emotion:"terrified",sound:"heartbeat",jumpScare:true},
  {title:"The Hallway",text:"[Based on your previous choice]\n\nYou can hear them ransacking the living room. Drawers being pulled out. Furniture overturned.\n\nThen a voice: \"Check upstairs.\"\n\nFootsteps on the stairs. Heavy. Deliberate.\n\nSarah grabs your arm. \"They're coming.\"\n\nYour daughter's room is three doors down. Your son's is across the hall. The stairs are between you and them.\n\nThe footsteps stop. They're on the landing now.\n\n\"I know someone's up here. Come out, and nobody gets hurt. We just want valuables.\"\n\nYou have 10 seconds.",choice:{prompt:"They're on the stairs. Your kids are down the hall. What now?",emotion:"panicked",timeLimit:10,opts:[{txt:"Rush them on the stairs - use surprise",next:2,consequence:"rush"},{txt:"Yell that police are on the way",next:2,consequence:"bluff"},{txt:"Stay silent and let them take what they want",next:2,consequence:"silent"},{txt:"Send Sarah to the kids while you distract them",next:2,consequence:"split"}]},narrator:"The intruders are coming upstairs.",emotion:"terrified",sound:"heartbeat"},
  {title:"The Choice",text:"[Every previous decision has led to this moment]\n\nOne of them has a gun. You can see it in the dim light from the street.\n\nYour daughter is crying. She can hear everything.\n\n\"Last chance. Come out now.\"\n\nSarah whispers: \"Whatever you do, protect the kids.\"\n\nThe door handle turns.\n\nYou have 10 seconds. This is the choice that determines everything.",choice:{prompt:"The door is opening. Armed intruder. Your family behind you. Choose NOW.",emotion:"terrified",timeLimit:10,opts:[{txt:"Swing the bat as the door opens",next:3,consequence:"fight"},{txt:"Surrender - \"Take everything, just don't hurt my family\"",next:3,consequence:"surrender"},{txt:"Push your family into the bathroom, lock it, face them alone",next:3,consequence:"sacrifice"}]},narrator:"This is the moment that changes everything.",emotion:"terrified",sound:"heartbeat",jumpScare:true},
  {title:"Consequences",text:"[Your choices determined everything]\n\nThere was no good choice. Just the one you made in 10 seconds. And the one you'll live with forever.\n\nEvery path had a cost. Every decision left a scar.\n\nThis is what pressure feels like. This is what stakes mean.\n\nEvery choice in 10 seconds. Every consequence permanent.\n\nWelcome to Movianx.\n\n[END]"},
];

function getChapters(storyId){
  if(storyId===1)return FRANK;
  if(storyId===2)return SAMPLE;
  if(storyId===3)return TIMED;
  return FRANK;
}


// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function MovianxPlatform(){
  // ─── State (FIXED: no duplicate declarations) ───
  const[pg,setPg]=useState("landing");
  const[sel,setSel]=useState(null);
  const[mode,setMode]=useState("Reader");
  const[txt,setTxt]=useState("");
  const[chIdx,setChIdx]=useState(0);
  const[choices,setChoices]=useState([]); // Branch memory engine
  const[showChoice,setShowChoice]=useState(false);
  const[timeRemaining,setTimeRemaining]=useState(null);
  const[timerActive,setTimerActive]=useState(false);
  const[voiceMode,setVoiceMode]=useState(false);
  const[voiceActive,setVoiceActive]=useState(false);
  const[narratorOn,setNarratorOn]=useState(true);
  const[soundEffectsOn,setSoundEffectsOn]=useState(true);
  const[fadeOut,setFadeOut]=useState(false);
  const[pageAnim,setPageAnim]=useState(""); // page turn animation
  const[fontSize,setFontSize]=useState(17);
  const[fontFamily,setFontFamily]=useState("Georgia");
  const[colorTheme,setColorTheme]=useState("cream");
  const[showSettings,setShowSettings]=useState(false);
  const[listenOnly,setListenOnly]=useState(false);
  const[highlights,setHighlights]=useState([]);
  const[notes,setNotes]=useState([]);
  const[showNotes,setShowNotes]=useState(false);
  const[selectedText,setSelectedText]=useState("");
  const[touchStartX,setTouchStartX]=useState(0);
  const[touchEndX,setTouchEndX]=useState(0);
  const[showMonetize,setShowMonetize]=useState(false);
  const[showBranchInfo,setShowBranchInfo]=useState(false);
  const[currentWordIdx,setCurrentWordIdx]=useState(-1); // word-by-word highlight

  const oscRef=useRef(null);
  const audioCtxRef=useRef(null);
  const recognitionRef=useRef(null);

  const currentTheme=THEMES[colorTheme];
  const chaps=sel?getChapters(sel.id):FRANK;
  const ch=chaps[chIdx]||{};

  // ─── Branch Memory Engine (NEW) ───
  const branchPath=choices.map(c=>c.consequence).filter(Boolean);
  const getBranchLabel=()=>{
    if(branchPath.length===0)return null;
    const last=branchPath[branchPath.length-1];
    const labels={honest:"Ambitious Path",cautious:"Cautious Path",patient:"Empathetic Path",respectful:"Patient Path",ambitious:"Unbridled Ambition",measured:"Balanced Wisdom",responsibility:"Path of Responsibility",abandonment:"Path of Abandonment",agreement:"Compassion Path",refusal:"Defiance Path",alone:"Solo Path",backup:"Cautious Path",take:"Evidence Path",trust:"Trust Path",confront:"Fighter Path",hide:"Survivor Path",escape:"Flight Path",barricade:"Defender Path"};
    return labels[last]||"Your Path";
  };

  // ─── Audio Engine (FIXED: proper cleanup) ───
  const stopAllAudio=useCallback(()=>{
    if(typeof window!=="undefined"&&window.speechSynthesis)window.speechSynthesis.cancel();
    if(oscRef.current){try{if(Array.isArray(oscRef.current))oscRef.current.forEach(n=>n.stop());else{if(oscRef.current.bass)oscRef.current.bass.stop();if(oscRef.current.mid)oscRef.current.mid.stop()}}catch(e){} oscRef.current=null}
    if(recognitionRef.current){try{recognitionRef.current.stop()}catch(e){} recognitionRef.current=null}
    setVoiceActive(false);setVoiceMode(false);setCurrentWordIdx(-1);
  },[]);

  const startAmbient=(emotion="calm")=>{
    if(typeof window==="undefined")return;
    try{
      const ctx=getAudioCtx();if(!ctx)return;
      // Stop existing ambient
      if(oscRef.current){try{oscRef.current.forEach(n=>n.stop())}catch(e){} oscRef.current=null}
      const nodes=[];
      const moods={
        calm:{bass:40,mid:0,vol:0.06,type:"sine"},
        tense:{bass:55,mid:185,vol:0.08,type:"triangle"},
        terrified:{bass:65,mid:220,vol:0.1,type:"sawtooth"},
        panicked:{bass:70,mid:260,vol:0.12,type:"sawtooth"},
        nervous:{bass:50,mid:160,vol:0.07,type:"triangle"},
        anguished:{bass:48,mid:200,vol:0.09,type:"triangle"},
        reflective:{bass:35,mid:0,vol:0.04,type:"sine"},
      };
      const m=moods[emotion]||moods.calm;
      const master=ctx.createGain();master.gain.setValueAtTime(m.vol,ctx.currentTime);master.connect(ctx.destination);
      // Bass drone
      const bass=ctx.createOscillator();const bg=ctx.createGain();
      bass.type="sine";bass.frequency.setValueAtTime(m.bass,ctx.currentTime);
      // Slow LFO on bass for organic feel
      bass.frequency.setValueAtTime(m.bass,ctx.currentTime);
      bass.frequency.linearRampToValueAtTime(m.bass*0.9,ctx.currentTime+4);
      bass.frequency.linearRampToValueAtTime(m.bass,ctx.currentTime+8);
      bg.gain.setValueAtTime(0.5,ctx.currentTime);
      bass.connect(bg);bg.connect(master);bass.start();nodes.push(bass);
      // Mid tone only for tense/terrified
      if(m.mid>0){
        const mid=ctx.createOscillator();const mg=ctx.createGain();
        mid.type=m.type;mid.frequency.setValueAtTime(m.mid,ctx.currentTime);
        mid.frequency.linearRampToValueAtTime(m.mid*1.05,ctx.currentTime+3);
        mid.frequency.linearRampToValueAtTime(m.mid,ctx.currentTime+6);
        mg.gain.setValueAtTime(0.2,ctx.currentTime);
        mid.connect(mg);mg.connect(master);mid.start();nodes.push(mid);
      }
      oscRef.current=nodes;
    }catch(e){}
  };

  const stopAmbient=()=>{
    if(oscRef.current){try{oscRef.current.forEach(n=>n.stop())}catch(e){} oscRef.current=null}
  };

  const getAudioCtx=()=>{
    if(!audioCtxRef.current&&typeof window!=="undefined")audioCtxRef.current=new(window.AudioContext||window.webkitAudioContext)();
    if(audioCtxRef.current&&audioCtxRef.current.state==="suspended")audioCtxRef.current.resume();
    return audioCtxRef.current;
  };

  const playSFX=(type)=>{
    if(!soundEffectsOn||typeof window==="undefined")return;
    try{
      const ctx=getAudioCtx();if(!ctx)return;
      if(type==="heartbeat"){
        for(let i=0;i<2;i++){const b=ctx.createOscillator(),bg=ctx.createGain();b.type="sine";b.frequency.setValueAtTime(60,ctx.currentTime+i*0.2);bg.gain.setValueAtTime(0.4,ctx.currentTime+i*0.2);bg.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+i*0.2+0.15);b.connect(bg);bg.connect(ctx.destination);b.start(ctx.currentTime+i*0.2);b.stop(ctx.currentTime+i*0.2+0.15)}
        return;
      }
      if(type==="jumpscare"){
        const osc=ctx.createOscillator(),g=ctx.createGain();osc.type="square";osc.frequency.setValueAtTime(440,ctx.currentTime);g.gain.setValueAtTime(0.5,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.3);osc.connect(g);g.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+0.3);
        return;
      }
      if(type==="footsteps"){
        const osc=ctx.createOscillator(),g=ctx.createGain();osc.type="square";osc.frequency.setValueAtTime(80,ctx.currentTime);g.gain.setValueAtTime(0.3,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.1);osc.connect(g);g.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+0.1);
        return;
      }
      if(type==="ambient"){
        const osc=ctx.createOscillator(),g=ctx.createGain();osc.type="sine";osc.frequency.setValueAtTime(120,ctx.currentTime);osc.frequency.linearRampToValueAtTime(80,ctx.currentTime+2);g.gain.setValueAtTime(0.15,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+2);osc.connect(g);g.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+2);
        return;
      }
      if(type==="creak"){
        const osc=ctx.createOscillator(),g=ctx.createGain();osc.type="sawtooth";osc.frequency.setValueAtTime(200,ctx.currentTime);osc.frequency.linearRampToValueAtTime(150,ctx.currentTime+0.8);g.gain.setValueAtTime(0.2,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.8);osc.connect(g);g.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+0.8);
        return;
      }
    }catch(e){console.log("SFX error:",e)}
  };

  const speak=(text,emotion="calm")=>{
    if(typeof window==="undefined"||!window.speechSynthesis||!narratorOn)return;
    window.speechSynthesis.cancel();
    setCurrentWordIdx(-1);
    const doSpeak=()=>{
      const u=new SpeechSynthesisUtterance(text);
      const emotions={
        terrified:{rate:1.3,pitch:1.15,volume:0.95},panicked:{rate:1.3,pitch:1.15,volume:0.95},
        tense:{rate:1.0,pitch:1.05,volume:0.9},nervous:{rate:1.05,pitch:1.0,volume:0.9},
        calm:{rate:0.9,pitch:0.95,volume:0.9},reflective:{rate:0.85,pitch:0.92,volume:0.85},
        ambitious:{rate:0.95,pitch:1.0,volume:0.9},curious:{rate:0.95,pitch:1.0,volume:0.9},
        anguished:{rate:0.9,pitch:1.1,volume:0.95},whispering:{rate:0.85,pitch:0.9,volume:0.5},
        devastated:{rate:0.8,pitch:0.85,volume:0.8}
      };
      const em=emotions[emotion]||emotions.calm;
      u.rate=em.rate;u.pitch=em.pitch;u.volume=em.volume;
      const voices=window.speechSynthesis.getVoices();
      const english=voices.filter(v=>v.lang.startsWith("en"));
      if(english.length>0)u.voice=english[0];
      // Word-by-word highlight tracking
      const words=text.split(/\s+/);
      u.onboundary=(e)=>{
        if(e.name==="word"){
          // Estimate word index from char offset
          const spoken=text.substring(0,e.charIndex);
          const idx=spoken.split(/\s+/).length-1;
          setCurrentWordIdx(Math.max(0,idx));
        }
      };
      u.onend=()=>setCurrentWordIdx(-1);
      window.speechSynthesis.speak(u);
    };
    if(window.speechSynthesis.getVoices().length>0){setTimeout(doSpeak,50)}
    else{window.speechSynthesis.onvoiceschanged=()=>{setTimeout(doSpeak,50)}}
  };

  const startVoiceRec=()=>{
    if(typeof window==="undefined")return;
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){alert("Voice recognition not supported");return}
    if(recognitionRef.current)try{recognitionRef.current.stop()}catch(e){}
    const rec=new SR();recognitionRef.current=rec;
    rec.continuous=false;rec.interimResults=false;rec.lang="en-US";
    rec.onstart=()=>setVoiceActive(true);
    rec.onresult=(e)=>{
      const t=e.results[0][0].transcript.toLowerCase().trim();
      const choice=chaps[chIdx].choice;if(!choice)return;
      let best=null,hi=0;
      choice.opts.forEach(opt=>{
        const words=opt.txt.toLowerCase().replace(/[^\w\s]/g,"").split(/\s+/).filter(w=>w.length>2);
        let score=0;words.forEach(w=>{if(t.includes(w))score++;if(w.length>3&&t.includes(w.substring(0,4)))score+=0.5});
        if(score>hi){hi=score;best=opt}
      });
      if(best&&hi>0.5){speak("Got it.");setTimeout(()=>makeChoice(best),800)}
      else{speak("Try saying one of the options more clearly.");setTimeout(()=>setVoiceActive(false),2000)}
    };
    rec.onerror=()=>setVoiceActive(false);
    rec.onend=()=>{setVoiceActive(false);if(voiceMode&&showChoice)setTimeout(()=>startVoiceRec(),500)};
    rec.start();
  };

  // ─── Navigation (FIXED: instant scroll, proper cleanup) ───
  const navigateTo=(newPg)=>{
    stopAllAudio();
    setFadeOut(true);
    setTimeout(()=>{setPg(newPg);setFadeOut(false);if(typeof window!=="undefined")window.scrollTo(0,0)},250);
  };

  const goChapter=(idx)=>{
    stopAllAudio();
    setPageAnim("out");
    setTimeout(()=>{
      setChIdx(idx);setShowChoice(false);setTimerActive(false);setTimeRemaining(null);
      setPageAnim("in");
      if(typeof window!=="undefined")window.scrollTo(0,0); // FIXED: instant, not smooth
      setTimeout(()=>setPageAnim(""),350);
    },250);
  };

  // ─── Swipe Handler (FIXED: works on full viewport) ───
  const onTouchStart=e=>setTouchStartX(e.touches[0].clientX);
  const onTouchMove=e=>setTouchEndX(e.touches[0].clientX);
  const onTouchEnd=()=>{
    const dist=touchStartX-touchEndX;
    if(Math.abs(dist)<50)return;
    if(dist>0&&chIdx<chaps.length-1)goChapter(chIdx+1); // swipe left = next
    else if(dist<0&&chIdx>0)goChapter(chIdx-1); // swipe right = prev
    setTouchStartX(0);setTouchEndX(0);
  };

  // ─── Choice Handler (FIXED: branch memory + instant scroll) ───
  const makeChoice=(opt)=>{
    setChoices(prev=>[...prev,{ch:chIdx,choice:opt.txt,consequence:opt.consequence}]);
    setShowChoice(false);setTimerActive(false);setTimeRemaining(null);
    if(opt.next<chaps.length)goChapter(opt.next);
  };

  // ─── Effects ───
  // Chapter load: narration + choice timing
  useEffect(()=>{
    if(pg!=="reading"||!ch.text)return;
    setTxt(ch.text);
    if(ch.sound&&soundEffectsOn)setTimeout(()=>playSFX(ch.sound),500);
    if(ch.jumpScare&&soundEffectsOn)setTimeout(()=>playSFX("jumpscare"),3000);
    // Mood-based ambient in Cinematic + Immersive
    if(mode==="Cinematic"||mode==="Immersive"){
      startAmbient(ch.emotion||"calm");
      speak(ch.text,ch.emotion||"calm");
    }
    // Show choice after short read delay (fast for demo)
    const readDelay=ch.text?Math.min(ch.text.split(" ").length*200,8000):3000;
    const timer=setTimeout(()=>{
      if(ch.choice){
        setShowChoice(true);
        if(ch.choice.timeLimit){setTimeRemaining(ch.choice.timeLimit);setTimerActive(true)}
        setTimeout(()=>{
          if(ch.choice.prompt&&(mode==="Cinematic"||mode==="Immersive")){
            speak(ch.choice.prompt,ch.choice.emotion||"calm");
            if(mode==="Immersive")setTimeout(()=>{setVoiceMode(true);startVoiceRec()},3000);
          }
        },3000);
      }
    },readDelay);
    return()=>clearTimeout(timer);
  },[pg,chIdx,mode,narratorOn,soundEffectsOn]);

  // Countdown timer
  useEffect(()=>{
    if(!timerActive||timeRemaining===null)return;
    if(timeRemaining<=0){
      if(ch.choice?.opts[0]){speak("Time's up.","panicked");setTimeout(()=>makeChoice(ch.choice.opts[0]),500)}
      setTimerActive(false);return;
    }
    if(timeRemaining<=3&&soundEffectsOn)playSFX("heartbeat");
    const cd=setTimeout(()=>setTimeRemaining(timeRemaining-1),1000);
    return()=>clearTimeout(cd);
  },[timerActive,timeRemaining]);

  // CRITICAL: cleanup on unmount + page change
  useEffect(()=>{return()=>stopAllAudio()},[]);
  useEffect(()=>{if(pg!=="reading")stopAllAudio()},[pg]);


  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── CREATOR DASHBOARD ───
  if(pg==="creator")return<CreatorDashboard onBack={()=>navigateTo("home")}/>;

  // ─── LANDING PAGE ───
  if(pg==="landing"){
    return(
      <div style={{minHeight:"100vh",background:"#000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,fontFamily:FF,position:"relative",opacity:fadeOut?0:1,transition:"opacity 0.25s"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"24px 5%",zIndex:10,animation:"fadeDown 0.6s ease both"}}>
          <img src="/movianx-logo.png" alt="Movianx" style={{height:40,width:"auto"}}/>
          <div style={{display:"flex",gap:32,alignItems:"center"}}>
            <button onClick={()=>navigateTo("creator")} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.6)",fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:FF}} onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.6)"}>Sign In</button>
            <button onClick={()=>navigateTo("creator")} style={{padding:"10px 20px",borderRadius:20,background:"#fff",border:"none",color:"#000",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:FF}}>For Creators</button>
          </div>
        </div>
        <div style={{textAlign:"center",maxWidth:900,zIndex:1,marginTop:60}}>
          <h1 style={{fontSize:"clamp(42px,8vw,72px)",fontWeight:700,color:"#fff",marginBottom:20,letterSpacing:"-2px",lineHeight:1.1,animation:"fadeUp 0.8s ease both 0.2s",opacity:0}}>What do you want to experience?</h1>
          <p style={{fontSize:18,color:"rgba(255,255,255,0.6)",marginBottom:50,lineHeight:1.6,animation:"fadeUp 0.8s ease both 0.3s",opacity:0}}>Books that adapt to you. Stories that listen. Worlds you shape with every choice.</p>
          <div style={{display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap",marginBottom:60,animation:"fadeUp 0.8s ease both 0.4s",opacity:0}}>
            <button onClick={()=>navigateTo("home")} style={{padding:"18px 36px",borderRadius:20,background:"#fff",border:"none",color:"#000",fontSize:16,fontWeight:600,cursor:"pointer",fontFamily:FF}} onMouseEnter={e=>{e.target.style.transform="translateY(-2px)"}} onMouseLeave={e=>{e.target.style.transform="translateY(0)"}}>Get Started</button>
          </div>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",animation:"fadeUp 0.8s ease both 0.5s",opacity:0}}>
            {["Choice-Driven Narratives","AI Narration","Adaptive Soundscapes","Immersive Visuals"].map(f=>(
              <div key={f} style={{padding:"8px 16px",borderRadius:20,background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",color:"rgba(255,255,255,0.8)",fontSize:13,fontWeight:500}}>{f}</div>
            ))}
          </div>
        </div>
        <style>{CSS}</style>
      </div>
    );
  }

  // ─── HOME PAGE ───
  if(pg==="home"){
    return(
      <div style={{minHeight:"100vh",background:"#000",fontFamily:FF,display:"flex",flexDirection:"column",position:"relative",opacity:fadeOut?0:1,transition:"opacity 0.25s"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 5%",borderBottom:"1px solid rgba(255,255,255,0.1)",animation:"fadeDown 0.6s ease both"}}>
          <div onClick={()=>navigateTo("landing")} style={{cursor:"pointer"}}><img src="/movianx-logo.png" alt="Movianx" style={{height:36,width:"auto"}}/></div>
          <div style={{display:"flex",gap:24,alignItems:"center"}}>
            <button onClick={()=>navigateTo("creator")} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.6)",fontSize:14,cursor:"pointer",fontFamily:FF}} onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.6)"}>Creator Studio</button>
            <button onClick={()=>navigateTo("creator")} style={{padding:"10px 20px",borderRadius:20,background:"#fff",border:"none",color:"#000",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:FF}}>For Creators</button>
          </div>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",padding:"32px 5% 60px"}}>
          <h1 style={{fontSize:"clamp(24px,4vw,40px)",fontWeight:700,color:"#fff",marginBottom:8,textAlign:"center",letterSpacing:"-1px",animation:"fadeUp 0.8s ease both 0.1s",opacity:0}}>Choose Your Experience</h1>
          <p style={{fontSize:"clamp(13px,2vw,16px)",color:"rgba(255,255,255,0.6)",marginBottom:32,textAlign:"center",maxWidth:500,animation:"fadeUp 0.8s ease both 0.2s",opacity:0}}>Explore interactive stories, cinematic adaptations, and connect with creators.</p>
          <div style={{display:"flex",gap:16,width:"100%",maxWidth:900,justifyContent:"center",flexWrap:"wrap",paddingBottom:40}}>
            {/* Stories Tile - Active */}
            <button onClick={()=>navigateTo("library")} style={{width:160,height:160,background:"#fff",border:"none",borderRadius:20,padding:20,cursor:"pointer",textAlign:"left",position:"relative",display:"flex",flexDirection:"column",animation:"fadeUp 0.8s ease both 0.3s",opacity:0,transition:"all 0.3s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-8px) scale(1.02)";e.currentTarget.style.boxShadow="0 20px 60px rgba(255,255,255,0.3)"}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0) scale(1)";e.currentTarget.style.boxShadow="none"}}>
              <div style={{fontSize:36,marginBottom:8}}>📚</div>
              <h3 style={{fontSize:20,fontWeight:700,color:"#000",marginBottom:6}}>Stories</h3>
              <p style={{fontSize:14,color:"rgba(0,0,0,0.6)",margin:0}}>Interactive fiction</p>
              <div style={{position:"absolute",bottom:20,right:20,width:32,height:32,borderRadius:"50%",background:"#000",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:16}}>→</div>
            </button>
            {/* Cinema - Coming Soon */}
            <div style={{width:160,height:160,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:20,cursor:"not-allowed",textAlign:"left",display:"flex",flexDirection:"column",animation:"fadeUp 0.8s ease both 0.4s",opacity:0}}>
              <div style={{fontSize:36,marginBottom:8,opacity:0.4}}>🎬</div>
              <h3 style={{fontSize:24,fontWeight:700,color:"rgba(255,255,255,0.4)",marginBottom:6}}>Cinema</h3>
              <div style={{display:"inline-block",padding:"4px 10px",borderRadius:12,background:"rgba(255,255,255,0.1)",fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"1px"}}>Coming Soon</div>
            </div>
            {/* Artists - Coming Soon */}
            <div style={{width:160,height:160,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:20,cursor:"not-allowed",textAlign:"left",display:"flex",flexDirection:"column",animation:"fadeUp 0.8s ease both 0.5s",opacity:0}}>
              <div style={{fontSize:36,marginBottom:8,opacity:0.4}}>🎨</div>
              <h3 style={{fontSize:24,fontWeight:700,color:"rgba(255,255,255,0.4)",marginBottom:6}}>Artists</h3>
              <div style={{display:"inline-block",padding:"4px 10px",borderRadius:12,background:"rgba(255,255,255,0.1)",fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"1px"}}>Coming Soon</div>
            </div>
          </div>
        </div>
        <style>{CSS}</style>
      </div>
    );
  }

  // ─── LIBRARY PAGE ───
  if(pg==="library"){
    return(
      <div style={{minHeight:"100vh",background:"#000",fontFamily:FF,padding:"80px 5% 120px",opacity:fadeOut?0:1,transition:"opacity 0.25s"}}>
        <button onClick={()=>navigateTo("home")} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.2)",color:"#fff",padding:"12px 24px",borderRadius:8,fontSize:14,cursor:"pointer",marginBottom:40,fontFamily:FF}}>← Back</button>
        <h1 style={{fontSize:48,fontWeight:700,color:"#fff",marginBottom:16}}>Story Library</h1>
        <p style={{fontSize:18,color:"rgba(255,255,255,0.6)",marginBottom:60}}>Choose your experience</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:24,maxWidth:1200}}>
          {STORIES.map(story=>(
            <div key={story.id} onClick={()=>{setSel(story);navigateTo("detail")}} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:16,overflow:"hidden",cursor:"pointer",transition:"all 0.3s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-8px)";e.currentTarget.style.borderColor="#fff"}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"}}>
              <div style={{height:200,background:`url(${story.cover})`,backgroundSize:"cover",backgroundPosition:"center"}}/>
              <div style={{padding:20}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <h3 style={{fontSize:20,fontWeight:700,color:"#fff",margin:0}}>{story.title}</h3>
                  {story.isTimed&&<span style={{fontSize:20}}>⏱️</span>}
                </div>
                <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",marginBottom:12}}>{story.author} • {story.genre}</p>
                <p style={{fontSize:14,color:"rgba(255,255,255,0.7)",lineHeight:1.6,marginBottom:16}}>{story.desc}</p>
                <div style={{display:"flex",gap:16,fontSize:12,color:"rgba(255,255,255,0.5)"}}>
                  <span>⭐ {story.rating}</span><span>📖 {story.chapters} chapters</span><span>👁️ {story.reads}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <style>{CSS}</style>
      </div>
    );
  }

  // ─── DETAIL PAGE ───
  if(pg==="detail"&&sel){
    return(
      <div style={{minHeight:"100vh",background:"#000",fontFamily:FF,opacity:fadeOut?0:1,transition:"opacity 0.25s"}}>
        <div style={{position:"relative",height:360,background:`url(${sel.cover})`,backgroundSize:"cover",backgroundPosition:"center"}}>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 30%,#000 100%)"}}/>
          <button onClick={()=>navigateTo("library")} style={{position:"absolute",top:24,left:24,background:"rgba(0,0,0,0.5)",border:"1px solid rgba(255,255,255,0.3)",color:"#fff",padding:"10px 20px",borderRadius:8,fontSize:14,cursor:"pointer",zIndex:2,fontFamily:FF,backdropFilter:"blur(10px)"}}>← Back</button>
        </div>
        <div style={{maxWidth:800,margin:"-80px auto 0",padding:"0 24px 60px",position:"relative",zIndex:2}}>
          <h1 style={{fontSize:40,fontWeight:700,color:"#fff",marginBottom:8,letterSpacing:"-1px"}}>{sel.title}</h1>
          <p style={{fontSize:16,color:"rgba(255,255,255,0.5)",marginBottom:20}}>{sel.author} • {sel.genre}</p>
          <p style={{fontSize:16,color:"rgba(255,255,255,0.7)",lineHeight:1.8,marginBottom:32}}>{sel.desc}</p>
          <div style={{display:"flex",gap:12,marginBottom:32,flexWrap:"wrap"}}>
            <span style={{padding:"6px 14px",borderRadius:20,background:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.7)",fontSize:13}}>⭐ {sel.rating}</span>
            <span style={{padding:"6px 14px",borderRadius:20,background:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.7)",fontSize:13}}>📖 {sel.chapters} chapters</span>
            <span style={{padding:"6px 14px",borderRadius:20,background:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.7)",fontSize:13}}>👁️ {sel.reads}</span>
            {sel.isTimed&&<span style={{padding:"6px 14px",borderRadius:20,background:"rgba(232,54,79,0.2)",color:C.red,fontSize:13,fontWeight:600}}>⏱️ Timed Choices</span>}
          </div>
          {/* Mode Selection */}
          <div style={{marginBottom:32}}>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:12}}>Experience Mode</p>
            <div style={{display:"flex",gap:10}}>
              {sel.immersions.map(m=>(
                <button key={m} onClick={()=>setMode(m)} style={{padding:"12px 24px",borderRadius:12,border:`1px solid ${mode===m?"#fff":"rgba(255,255,255,0.2)"}`,background:mode===m?"#fff":"transparent",color:mode===m?"#000":"rgba(255,255,255,0.7)",fontSize:14,fontWeight:mode===m?600:400,cursor:"pointer",transition:"all 0.2s",fontFamily:FF}}>{m==="Reader"?"📖":""}  {m==="Cinematic"?"🎬":""} {m==="Immersive"?"🌐":""} {m}</button>
              ))}
            </div>
          </div>
          {/* Start Button */}
          <button onClick={()=>{setChIdx(0);setChoices([]);setShowChoice(false);navigateTo("reading")}} style={{width:"100%",maxWidth:400,padding:"18px",borderRadius:14,border:"none",background:"#fff",color:"#000",fontSize:16,fontWeight:700,cursor:"pointer",transition:"all 0.2s",fontFamily:FF}} onMouseEnter={e=>e.target.style.transform="translateY(-2px)"} onMouseLeave={e=>e.target.style.transform="translateY(0)"}>
            Begin Reading →
          </button>
        </div>
        <style>{CSS}</style>
      </div>
    );
  }


  // ═══════════════════════════════════════════════════════════════════════════
  // READING EXPERIENCE
  // ═══════════════════════════════════════════════════════════════════════════
  if(pg==="reading"){
    return(
      <div style={{minHeight:"100vh",background:currentTheme.bg,fontFamily:FF,position:"relative",overflowY:"auto",WebkitOverflowScrolling:"touch"}}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>

        {/* Top Bar — Clean, no duplicate icons */}
        <div style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:`${currentTheme.bg}F0`,backdropFilter:"blur(12px)",borderBottom:`1px solid ${currentTheme.text}15`,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>navigateTo("detail")} style={{background:"transparent",border:"none",color:currentTheme.text,fontSize:13,cursor:"pointer",fontFamily:FF,opacity:0.7}}>← Back</button>
            <span style={{fontSize:12,color:`${currentTheme.text}40`}}>|</span>
            <span style={{fontSize:12,color:`${currentTheme.text}60`}}>{chIdx+1}/{chaps.length}</span>
            {getBranchLabel()&&<span style={{fontSize:10,padding:"2px 8px",borderRadius:8,background:`${C.red}15`,color:C.red,fontWeight:600}}>{getBranchLabel()}</span>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <button onClick={()=>setShowSettings(!showSettings)} style={{padding:"5px 10px",borderRadius:6,background:showSettings?`${currentTheme.text}15`:"transparent",border:`1px solid ${currentTheme.text}15`,color:currentTheme.text,fontSize:11,cursor:"pointer",opacity:0.7}}>⚙</button>
            <button onClick={()=>setListenOnly(!listenOnly)} style={{padding:"5px 10px",borderRadius:6,background:listenOnly?`${C.red}15`:"transparent",border:`1px solid ${listenOnly?C.red:`${currentTheme.text}15`}`,color:listenOnly?C.red:`${currentTheme.text}90`,fontSize:11,cursor:"pointer"}}>🎧</button>
            <button onClick={()=>{
              const next=!narratorOn;setNarratorOn(next);
              if(next&&ch.text)setTimeout(()=>speak(ch.text,ch.emotion||"calm"),100);
              else if(typeof window!=="undefined"&&window.speechSynthesis){window.speechSynthesis.cancel();setCurrentWordIdx(-1)}
            }} style={{padding:"5px 10px",borderRadius:6,background:narratorOn?`${C.red}15`:"transparent",border:`1px solid ${narratorOn?C.red:`${currentTheme.text}15`}`,color:narratorOn?C.red:`${currentTheme.text}90`,fontSize:11,cursor:"pointer"}}>{narratorOn?"🔊":"🔇"}</button>
            {mode==="Immersive"&&<button onClick={()=>{setVoiceMode(!voiceMode);if(!voiceMode)startVoiceRec()}} style={{padding:"5px 10px",borderRadius:6,background:voiceActive?C.red:"transparent",border:`1px solid ${voiceActive?C.red:`${currentTheme.text}15`}`,color:voiceActive?"#fff":`${currentTheme.text}90`,fontSize:11,cursor:"pointer"}}>🎤</button>}
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings&&(
          <div style={{position:"fixed",top:52,right:12,zIndex:110,width:280,background:colorTheme==="night"?"#1C1C24":"#fff",borderRadius:16,border:`1px solid ${currentTheme.text}20`,padding:24,boxShadow:"0 20px 60px rgba(0,0,0,0.3)",animation:"fadeUp 0.2s ease both"}}>
            <div style={{fontSize:13,fontWeight:700,color:currentTheme.text,marginBottom:16}}>Reading Settings</div>
            {/* Font Size */}
            <div style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:11,color:`${currentTheme.text}80`}}>Font Size</span><span style={{fontSize:11,color:currentTheme.text,fontWeight:600}}>{fontSize}px</span></div>
              <input type="range" min="14" max="24" value={fontSize} onChange={e=>setFontSize(+e.target.value)} style={{width:"100%",accentColor:currentTheme.text}}/>
            </div>
            {/* Font Family */}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:`${currentTheme.text}80`,marginBottom:8}}>Font</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {FONTS.map(f=>(
                  <button key={f} onClick={()=>setFontFamily(f)} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${fontFamily===f?currentTheme.text:`${currentTheme.text}20`}`,background:fontFamily===f?`${currentTheme.text}15`:"transparent",color:currentTheme.text,fontSize:12,cursor:"pointer",fontFamily:f}}>{f.split(" ")[0]}</button>
                ))}
              </div>
            </div>
            {/* Theme */}
            <div>
              <div style={{fontSize:11,color:`${currentTheme.text}80`,marginBottom:8}}>Theme</div>
              <div style={{display:"flex",gap:6}}>
                {Object.entries(THEMES).map(([key,t])=>(
                  <button key={key} onClick={()=>setColorTheme(key)} style={{flex:1,padding:"10px 0",borderRadius:8,border:`2px solid ${colorTheme===key?currentTheme.text:`${currentTheme.text}20`}`,background:t.bg,color:t.text,fontSize:11,cursor:"pointer",fontWeight:600,fontFamily:FF}}>{t.name}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chapter Progress Bar */}
        <div style={{position:"fixed",top:52,left:0,right:0,height:3,background:`${currentTheme.text}10`,zIndex:99}}>
          <div style={{height:"100%",width:`${((chIdx+1)/chaps.length)*100}%`,background:C.red,transition:"width 0.5s ease",borderRadius:"0 2px 2px 0"}}/>
        </div>

        {/* Content */}
        <div style={{
          maxWidth:800,margin:"0 auto",padding:"100px 40px 200px",
          opacity:pageAnim==="out"?0:1,
          transform:pageAnim==="out"?"translateX(-30px)":pageAnim==="in"?"translateX(0)":"translateX(0)",
          transition:"opacity 0.25s ease, transform 0.25s ease",
        }}>
          {listenOnly?(
            <div style={{textAlign:"center",paddingTop:60}}>
              <h2 style={{fontSize:32,fontWeight:700,color:currentTheme.text,marginBottom:16}}>{ch.title}</h2>
              <div style={{fontSize:14,color:`${currentTheme.text}80`,marginBottom:40}}>🎧 Listen-only mode active</div>
              <div style={{fontSize:48,marginTop:40}}>📖</div>
            </div>
          ):(
            <>
              <h2 style={{fontSize:28,fontWeight:700,color:currentTheme.text,marginBottom:30,letterSpacing:"-0.5px"}}>{ch.title}</h2>
              {/* Scene Illustration */}
              {sel&&<div style={{marginBottom:32,borderRadius:16,overflow:"hidden",border:`1px solid ${currentTheme.text}10`}}><SceneIllustration chapterIdx={chIdx} storyId={sel.id} theme={colorTheme}/></div>}
              <div style={{fontSize:fontSize,color:currentTheme.text,lineHeight:1.9,marginBottom:40,fontFamily:fontFamily}}>
                {currentWordIdx>=0?
                  txt.split(/(\s+)/).map((segment,i)=>{
                    // Split preserves whitespace as separate entries
                    if(/^\s+$/.test(segment))return <span key={i}>{segment}</span>;
                    // Count actual word index (non-whitespace segments)
                    const wordsBefore=txt.split(/(\s+)/).slice(0,i).filter(s=>!/^\s+$/.test(s)).length;
                    const isActive=wordsBefore===currentWordIdx;
                    return <span key={i} style={{
                      background:isActive?`${C.red}25`:"transparent",
                      borderRadius:isActive?3:0,
                      padding:isActive?"1px 2px":0,
                      transition:"background 0.1s ease"
                    }}>{segment}</span>;
                  })
                  :<span style={{whiteSpace:"pre-wrap"}}>{txt}</span>
                }
              </div>
            </>
          )}

          {/* Choices */}
          {!listenOnly&&showChoice&&ch.choice&&mode!=="Immersive"&&(
            <div style={{background:colorTheme==="night"?"#141419":"rgba(0,0,0,0.04)",borderRadius:16,border:`1px solid ${timerActive&&timeRemaining<=3?C.red:`${currentTheme.text}20`}`,padding:32,marginTop:40,animation:"fadeUp 0.4s ease both"}}>
              {timerActive&&timeRemaining!==null&&(
                <div style={{textAlign:"center",marginBottom:20,animation:timeRemaining<=3?"pulse 0.5s infinite":"none"}}>
                  <div style={{fontSize:48,fontWeight:700,color:timeRemaining<=3?C.red:currentTheme.text,fontFamily:"monospace"}}>{timeRemaining}</div>
                  <div style={{fontSize:12,color:`${currentTheme.text}60`,textTransform:"uppercase",letterSpacing:2}}>{timeRemaining<=3?"DECIDE NOW!":"SECONDS REMAINING"}</div>
                </div>
              )}
              <p style={{fontSize:18,fontWeight:600,color:currentTheme.text,marginBottom:20}}>{ch.choice.prompt}</p>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {ch.choice.opts.map((opt,i)=>(
                  <button key={i} onClick={()=>makeChoice(opt)} style={{padding:"16px 20px",borderRadius:12,background:colorTheme==="night"?"#1C1C24":"#fff",border:`1px solid ${currentTheme.text}20`,color:currentTheme.text,fontSize:15,textAlign:"left",cursor:"pointer",transition:"all 0.2s",fontFamily:FF}} onMouseEnter={e=>{e.target.style.background=`${C.red}15`;e.target.style.borderColor=C.red}} onMouseLeave={e=>{e.target.style.background=colorTheme==="night"?"#1C1C24":"#fff";e.target.style.borderColor=`${currentTheme.text}20`}}>
                    {opt.txt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Immersive Choice — voice + tap options */}
          {showChoice&&ch.choice&&mode==="Immersive"&&(
            <div style={{background:`${C.red}08`,borderRadius:16,border:`1px solid ${C.red}30`,padding:32,marginTop:40,animation:"fadeUp 0.4s ease both"}}>
              {timerActive&&timeRemaining!==null&&(
                <div style={{textAlign:"center",marginBottom:20,animation:timeRemaining<=3?"pulse 0.5s infinite":"none"}}>
                  <div style={{fontSize:48,fontWeight:700,color:timeRemaining<=3?C.red:currentTheme.text,fontFamily:"monospace"}}>{timeRemaining}</div>
                  <div style={{fontSize:12,color:`${currentTheme.text}60`,textTransform:"uppercase",letterSpacing:2}}>{timeRemaining<=3?"DECIDE NOW!":"SECONDS"}</div>
                </div>
              )}
              <p style={{fontSize:18,fontWeight:600,color:currentTheme.text,marginBottom:8}}>{ch.choice.prompt}</p>
              {voiceActive&&<p style={{fontSize:12,color:C.red,marginBottom:16,animation:"breathe 1.5s infinite"}}>🎤 Listening — speak your choice or tap below...</p>}
              <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:16}}>
                {ch.choice.opts.map((opt,i)=>(
                  <button key={i} onClick={()=>makeChoice(opt)} style={{padding:"16px 20px",borderRadius:12,background:`${currentTheme.text}08`,border:`1px solid ${currentTheme.text}15`,color:currentTheme.text,fontSize:15,textAlign:"left",cursor:"pointer",transition:"all 0.2s",fontFamily:FF}} onMouseEnter={e=>{e.target.style.background=`${C.red}15`;e.target.style.borderColor=C.red}} onMouseLeave={e=>{e.target.style.background=`${currentTheme.text}08`;e.target.style.borderColor=`${currentTheme.text}15`}}>
                    {opt.txt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chapter Navigation */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:60,paddingTop:20,borderTop:`1px solid ${currentTheme.text}15`}}>
            <button disabled={chIdx===0} onClick={()=>goChapter(chIdx-1)} style={{padding:"12px 24px",borderRadius:10,border:`1px solid ${currentTheme.text}20`,background:"transparent",color:chIdx===0?`${currentTheme.text}30`:currentTheme.text,fontSize:13,cursor:chIdx===0?"not-allowed":"pointer",fontFamily:FF}}>← Previous</button>
            <span style={{fontSize:12,color:`${currentTheme.text}50`}}>{chIdx+1} / {chaps.length}</span>
            <button disabled={chIdx>=chaps.length-1} onClick={()=>goChapter(chIdx+1)} style={{padding:"12px 24px",borderRadius:10,border:`1px solid ${currentTheme.text}20`,background:"transparent",color:chIdx>=chaps.length-1?`${currentTheme.text}30`:currentTheme.text,fontSize:13,cursor:chIdx>=chaps.length-1?"not-allowed":"pointer",fontFamily:FF}}>Next →</button>
          </div>

          {/* Branch Memory Display */}
          {choices.length>0&&(
            <div style={{marginTop:32,padding:20,borderRadius:12,background:`${currentTheme.text}08`,border:`1px solid ${currentTheme.text}10`}}>
              <div style={{fontSize:11,color:`${currentTheme.text}50`,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:10}}>Your Path</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {choices.map((c,i)=>(
                  <span key={i} style={{fontSize:11,padding:"4px 10px",borderRadius:8,background:`${C.red}15`,color:C.red,fontWeight:500}}>{c.choice.length>30?c.choice.substring(0,30)+"...":c.choice}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        <style>{CSS}</style>
      </div>
    );
  }

  return null;
}
