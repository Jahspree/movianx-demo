"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import audioEngine from "../lib/AudioEngine";
import assetResolver from "../lib/AssetResolver";
import { performNarrationText } from "../lib/AudioSceneAnalyzer";
import { buildAdaptiveAudioPlan, getIntensityLevel } from "../lib/AdaptiveAudioDirector";
import SpatialEventScheduler from "../lib/SpatialEventScheduler";
// === AUDIO MANIFESTS ===
import { FRANKENSTEIN_AUDIO } from "../data/audioManifest";
import { TIMED_HORROR_AUDIO } from "../data/audioManifest-timed";
import { getAudioSceneProfile } from "../data/audioSceneProfiles";
import { STORIES, getChapters } from "../data/stories";
import { C, THEMES, FONTS, FF, CSS, estimateSpeechDurationMs } from "./movianx/config";
import { LandingView, HomeView, LibraryView, DetailView } from "./movianx/views";

const AUDIO_MANIFESTS_BY_STORY = {
  [FRANKENSTEIN_AUDIO.storyId]: FRANKENSTEIN_AUDIO,
  [TIMED_HORROR_AUDIO.storyId]: TIMED_HORROR_AUDIO,
};

// === SCENE ILLUSTRATIONS ===
function SceneIllustration({chapterIdx,storyId,theme}){
  // When cached images exist in the manifest, they'll be rendered by the main component
  // For now, use procedural SVG illustrations
  if(storyId!==1)return null;
  // Deterministic pseudo-random for SSR hydration safety
  const seed=(i,ch=0)=>{const v=(i*2654435761+ch*40503)>>>0;return(v%10000)/10000;};
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
        {[...Array(30)].map((_,i)=><circle key={i} cx={seed(i,0)*800} cy={seed(i+30,0)*150} r={seed(i+60,0)*1.5+0.5} fill="#fff" opacity={seed(i+90,0)*0.6+0.2} style={{animation:`breathe ${3+seed(i+120,0)*4}s infinite ${seed(i+150,0)*3}s`}}/>)}
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
        {[...Array(25)].map((_,i)=><circle key={i} cx={seed(i,1)*800} cy={seed(i+25,1)*300} r={seed(i+50,1)*2+0.5} fill="#fff" opacity={seed(i+75,1)*0.4+0.1} style={{animation:`rise ${4+seed(i+100,1)*6}s linear infinite ${seed(i+125,1)*5}s`}}/>)}
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
        {[300,350,400,450,500].map((x,i)=><circle key={i} cx={x} cy={200-i*8} r={3+seed(i,3)*3} fill={mg} opacity="0.15" style={{animation:`rise ${5+i}s linear infinite ${i*0.8}s`}}/>)}
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
        {[...Array(40)].map((_,i)=><circle key={i} cx={seed(i,5)*800} cy={seed(i+40,5)*200} r={seed(i+80,5)*1.2+0.3} fill="#fff" opacity={seed(i+120,5)*0.5+0.2} style={{animation:`breathe ${3+seed(i+160,5)*5}s infinite ${seed(i+200,5)*3}s`}}/>)}
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

// === UTILITIES ===
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

function analyzeScene(sceneText=""){
  const text=sceneText.toLowerCase();
  const horrorWords=["blood","gun","scream","intruder","monster","horror","dead","kill","panic","terrified","dark","shadow","door handle"];
  const suspenseWords=["silence","footsteps","whisper","creak","listen","waiting","stairs","behind","unknown","glass"];
  const calmWords=["lake","childhood","warm","sun","gentle","memory","peace","delight"];
  const forestWords=["forest","trees","leaves","wolf","wind","ice","arctic"];
  const cityWords=["street","police","sirens","car","city","apartment"];
  const indoorWords=["house","room","door","stairs","hall","window","kitchen","bedroom","laboratory"];
  const score=(words)=>words.reduce((sum,word)=>sum+(text.includes(word)?1:0),0);
  const horrorScore=score(horrorWords);
  const suspenseScore=score(suspenseWords);
  const calmScore=score(calmWords);
  const mood=horrorScore>=2?"fear":suspenseScore>=2?"suspense":calmScore>=2?"calm":"suspense";
  const tension=Math.max(0.15,Math.min(1,(horrorScore*0.18)+(suspenseScore*0.1)+(mood==="fear"?0.28:0)+(mood==="suspense"?0.18:0)));
  const environment=score(indoorWords)>=2?"indoor":score(forestWords)>=1?"outdoor":score(cityWords)>=1?"urban":"void";
  const pacing=tension>0.72?"intense":tension>0.42?"moderate":"slow";
  return { mood, tension, environment, pacing };
}

function getAutoAmbient(sceneAnalysis){
  const env=sceneAnalysis?.environment||"void";
  if(env==="forest"||env==="outdoor")return [{file:"/audio/sfx/wind_loop.mp3",volume:0.14,fadeIn:3,label:"auto outdoor wind"}];
  if(env==="city"||env==="urban")return [{file:"/audio/sfx/electrical_hum.mp3",volume:0.03,fadeIn:2,label:"auto urban hum"}];
  if(env==="indoor")return [{file:"/audio/sfx/electrical_hum.mp3",volume:0.012,fadeIn:2,label:"auto indoor room tone"}];
  return [{type:"procedural",sound:"room_tone",volume:0.006,frequency:34,waveform:"sine",fadeIn:2,label:"auto void tone"}];
}

function getAutoEnvironmentEvents(sceneAnalysis){
  if(!sceneAnalysis)return [];
  const events=[];
  if(sceneAnalysis.tension>=0.45){
    events.push({sound:"/audio/sfx/floor_creak.mp3",position:[1,0,-2],movement:"behind",duration:1600,delay:4200,volume:0.08,label:"scene-aware floor shift"});
  }
  if(sceneAnalysis.tension>=0.72){
    events.push({sound:"/audio/sfx/heartbeat.mp3",position:[0,0,0],movement:"fixed",duration:1800,delay:6500,volume:0.12,loop:false,label:"scene-aware heartbeat burst"});
  }
  return events;
}

function getChoiceDialogue(manifest,chapterIdx,choice){
  const scripted=manifest?.characterDialogue?.[chapterIdx]?.line||manifest?.characterDialogue?.[chapterIdx]?.choicePrompt||manifest?.companionScript?.[chapterIdx]?.choicePrompt;
  if(scripted)return typeof scripted==="string"?scripted:scripted.text||"";
  if(!choice)return "";
  return choice.characterPrompt||choice.internalPrompt||choice.prompt||"";
}

function getChoiceLine(manifest,chapterIdx,choice){
  const scripted=manifest?.characterDialogue?.[chapterIdx]?.line||manifest?.characterDialogue?.[chapterIdx]?.choicePrompt||manifest?.companionScript?.[chapterIdx]?.choicePrompt;
  if(scripted&&typeof scripted==="object")return scripted;
  const text=typeof scripted==="string"?scripted:getChoiceDialogue(manifest,chapterIdx,choice);
  return text?{text,breathLevel:0.4,tremble:0.45,whisper:true,pacing:"hesitant"}:null;
}


// === HELPER COMPONENTS (EmailGate, DashSidebar, etc) ===
function EmailGate({onSubmit}){
  const[email,setEmail]=useState("");const[name,setName]=useState("");const[role,setRole]=useState("");const[step,setStep]=useState(0);const[hover,setHover]=useState(false);
  const ok=email.includes("@")&&email.includes(".")&&name;
  const inp={width:"100%",padding:"14px 16px",background:"rgba(255,255,255,0.8)",border:`1px solid ${C.border}`,borderRadius:12,color:C.text,fontSize:15,outline:"none",boxSizing:"border-box",transition:"border-color 0.2s",fontFamily:FF,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"};
  return(
    <div style={{height:"100vh",display:"flex",alignItems:"flex-start",justifyContent:"center",background:C.bg,fontFamily:FF,padding:"40px 24px",overflowY:"scroll",WebkitOverflowScrolling:"touch"}}>
      <div style={{width:"100%",maxWidth:480,animation:"fadeUp 0.8s ease both",paddingBottom:60}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <img src="/movianx-logo.png" alt="Movianx" style={{height:50,width:"auto",marginBottom:16}}/>
          <p style={{color:C.text2,fontSize:13,marginTop:8,letterSpacing:"2px",textTransform:"uppercase"}}>Creator Studio</p>
        </div>
        <div style={{background:C.glass,borderRadius:24,padding:"40px 36px",border:`1px solid ${C.glassBorder}`,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",boxShadow:C.shadow}}>
          {step===0?(
            <>
              <h2 style={{color:C.text,fontSize:22,fontWeight:700,margin:"0 0 8px"}}>Get Early Access</h2>
              <p style={{color:C.text2,fontSize:14,margin:"0 0 32px",lineHeight:1.6}}>Transform your books into immersive, choice-driven experiences with synchronized audio, AI visuals, and direct-to-reader commerce.</p>
              <label style={{display:"block",marginBottom:20}}>
                <span style={{color:C.text2,fontSize:11,textTransform:"uppercase",letterSpacing:"1.5px",display:"block",marginBottom:8}}>Full Name</span>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={inp} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
              </label>
              <label style={{display:"block",marginBottom:20}}>
                <span style={{color:C.text2,fontSize:11,textTransform:"uppercase",letterSpacing:"1.5px",display:"block",marginBottom:8}}>Email</span>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" style={inp} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
              </label>
              <label style={{display:"block",marginBottom:28}}>
                <span style={{color:C.text2,fontSize:11,textTransform:"uppercase",letterSpacing:"1.5px",display:"block",marginBottom:8}}>I am a...</span>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {["Author","Publisher","Storyteller","Investor","Other"].map(r2=>(
                    <button key={r2} onClick={()=>setRole(r2)} style={{padding:"10px 18px",borderRadius:20,border:`1px solid ${role===r2?C.accent:C.border}`,background:role===r2?C.accent:"transparent",color:role===r2?"#fff":C.text2,fontSize:13,cursor:"pointer",fontWeight:role===r2?600:400,transition:"all 0.2s",fontFamily:FF}}>{r2}</button>
                  ))}
                </div>
              </label>
              <button disabled={!ok} onClick={()=>setStep(1)} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} style={{width:"100%",padding:"16px",borderRadius:12,border:"none",background:ok?C.accent:C.surface2,color:ok?"#fff":C.text2,fontSize:14,fontWeight:600,cursor:ok?"pointer":"not-allowed",transform:hover&&ok?"translateY(-1px)":"translateY(0)",transition:"all 0.2s",fontFamily:FF}}>Continue →</button>
            </>
          ):(
            <>
              <div style={{textAlign:"center",marginBottom:32}}>
                <div style={{width:64,height:64,borderRadius:"50%",background:C.accent,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:32,marginBottom:20,color:"#fff"}}>✓</div>
                <h2 style={{color:C.text,fontSize:22,fontWeight:700,margin:"0 0 8px"}}>Welcome, {name.split(" ")[0]}!</h2>
                <p style={{color:C.text2,fontSize:14,margin:0,lineHeight:1.6}}>We'll notify <span style={{color:C.text,fontWeight:600}}>{email}</span> when we're ready.</p>
              </div>
              <button onClick={()=>onSubmit({name,email,role})} style={{width:"100%",padding:"16px",borderRadius:12,border:"none",background:C.accent,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:FF,boxShadow:"0 4px 16px rgba(139,26,26,0.2)"}} onMouseEnter={e=>{e.target.style.transform="translateY(-1px)";e.target.style.boxShadow="0 8px 24px rgba(139,26,26,0.3)"}} onMouseLeave={e=>{e.target.style.transform="translateY(0)";e.target.style.boxShadow="0 4px 16px rgba(139,26,26,0.2)"}}>Enter Demo Dashboard →</button>
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
    <div style={{width:260,height:"100%",background:C.bg,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column"}}>
      <div style={{padding:"24px 20px",borderBottom:`1px solid ${C.border}`}}><img src="/movianx-logo.png" alt="Movianx" style={{height:32,width:"auto"}}/></div>
      <div style={{flex:1,padding:"16px 12px",overflowY:"auto"}}>
        {nav.map(n=>(
          <button key={n.id} onClick={()=>setActive(n.id)} style={{width:"100%",padding:"12px 14px",marginBottom:6,borderRadius:12,border:"none",textAlign:"left",cursor:"pointer",background:active===n.id?C.accent:"transparent",color:active===n.id?"#fff":C.text2,fontSize:14,fontWeight:active===n.id?600:400,display:"flex",alignItems:"center",gap:12,transition:"all 0.2s",fontFamily:FF,boxShadow:active===n.id?"0 2px 8px rgba(139,26,26,0.15)":"none"}} onMouseEnter={e=>{if(active!==n.id)e.currentTarget.style.background="rgba(0,0,0,0.03)"}} onMouseLeave={e=>{if(active!==n.id)e.currentTarget.style.background="transparent"}}><span style={{fontSize:18}}>{n.icon}</span>{n.label}</button>
        ))}
      </div>
      <div style={{padding:20,borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:40,height:40,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#fff"}}>{user.name[0]}</div>
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
          <div key={i} style={{background:C.glass,borderRadius:16,border:`1px solid ${C.glassBorder}`,padding:20,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",boxShadow:C.shadow}}>
            <div style={{fontSize:12,color:C.text2,marginBottom:8}}>{s.label}</div>
            <div style={{fontSize:28,fontWeight:700,color:C.text,marginBottom:4}}><AnimCounter end={s.val} prefix={s.prefix||""} suffix={s.suffix||""}/></div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontSize:12,fontWeight:600,color:s.color}}>{s.change}</span>{s.spark&&<Sparkline data={s.spark} color={s.color} w={80} h={24}/>}</div>
          </div>
        ))}
      </div>
      <div style={{background:C.glass,borderRadius:16,border:`1px solid ${C.glassBorder}`,padding:24,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",boxShadow:C.shadow}}>
        <div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:16}}>Recent Activity</div>
        {[{act:"New reader completed The Midnight Cipher",time:"2 min ago",icon:"✓",color:C.green},{act:"Merch sale: Signed Hardcover Bundle",time:"18 min ago",icon:"$",color:C.gold},{act:"Choice analytics updated for Chapter 7",time:"1 hour ago",icon:"📊",color:C.purple},{act:"AI narration processed",time:"3 hours ago",icon:"🎙",color:C.accent}].map((a,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:i<3?`1px solid ${C.border}`:"none"}}>
            <div style={{width:32,height:32,borderRadius:8,background:"rgba(0,0,0,0.04)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:a.color,flexShrink:0}}>{a.icon}</div>
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
      <div style={{border:`2px dashed rgba(0,0,0,0.12)`,borderRadius:20,padding:"60px 40px",textAlign:"center",marginBottom:24,cursor:"pointer",background:C.glass,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)"}}>
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
          <div key={i} style={{background:C.glass,borderRadius:16,border:`1px solid ${C.glassBorder}`,padding:20,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",boxShadow:C.shadow}}>
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
      <div style={{background:C.glass,borderRadius:16,border:`1px solid ${C.glassBorder}`,padding:24,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",boxShadow:C.shadow}}>
        {[{img:"📕",name:"Signed Hardcover",price:"$32",sold:124},{img:"🎧",name:"Audiobook Bundle",price:"$18",sold:312},{img:"👕",name:"Limited Tee",price:"$28",sold:47}].map((p,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:16,padding:"14px 0",borderBottom:i<2?`1px solid ${C.border}`:"none"}}>
            <div style={{width:48,height:48,borderRadius:10,background:"rgba(0,0,0,0.04)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>{p.img}</div>
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
          <div key={i} style={{flex:"1 1 calc(50% - 8px)",minWidth:240,background:C.glass,borderRadius:16,border:`1px solid ${C.glassBorder}`,padding:20,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",boxShadow:C.shadow}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:15,fontWeight:600,color:C.text}}>{x.p}</span><span style={{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:6,background:(x.s==="Live"||x.s==="Synced")?"rgba(74,222,128,0.15)":"rgba(212,168,67,0.15)",color:(x.s==="Live"||x.s==="Synced")?C.green:C.gold}}>{x.s}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// === MONETIZATION SIMULATOR ===
function MonetizationSim({storyTitle,onClose}){
  const[readers,setReaders]=useState(10000);const[rate,setRate]=useState(12);const[show,setShow]=useState(false);
  const prem=Math.round(readers*(rate/100)),free=readers-prem;
  const adRev=Math.round(free*0.008*30),subRev=Math.round(prem*9.99*0.7),tipRev=Math.round(readers*0.02*4.5),merchRev=Math.round(readers*0.03*22);
  const total=adRev+subRev+tipRev+merchRev;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20,animation:"fadeIn 0.3s ease"}}>
      <div style={{width:"100%",maxWidth:540,background:C.glass,borderRadius:24,border:`1px solid ${C.glassBorder}`,padding:"36px 32px",maxHeight:"90vh",overflowY:"auto",animation:"fadeUp 0.4s ease both",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",boxShadow:"0 20px 60px rgba(0,0,0,0.12)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
          <div><h2 style={{fontSize:20,fontWeight:700,color:C.text,margin:0}}>Revenue Simulator</h2><p style={{fontSize:13,color:C.text2,marginTop:4}}>{storyTitle||"Your Story"}</p></div>
          <button onClick={onClose} style={{width:36,height:36,borderRadius:"50%",border:`1px solid ${C.border}`,background:"transparent",color:C.text2,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <div style={{marginBottom:24}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:11,color:C.text2,textTransform:"uppercase",letterSpacing:"1px"}}>Monthly Readers</span><span style={{fontSize:14,fontWeight:700,color:C.text}}>{readers.toLocaleString()}</span></div>
          <input type="range" min="1000" max="100000" step="1000" value={readers} onChange={e=>setReaders(+e.target.value)} style={{width:"100%",accentColor:C.accent}}/>
        </div>
        <div style={{marginBottom:28}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:11,color:C.text2,textTransform:"uppercase",letterSpacing:"1px"}}>Premium Conversion</span><span style={{fontSize:14,fontWeight:700,color:C.text}}>{rate}%</span></div>
          <input type="range" min="2" max="30" value={rate} onChange={e=>setRate(+e.target.value)} style={{width:"100%",accentColor:C.accent}}/>
        </div>
        {!show?(
          <button onClick={()=>setShow(true)} style={{width:"100%",padding:16,borderRadius:12,border:"none",background:C.accent,color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:FF,boxShadow:"0 4px 16px rgba(139,26,26,0.2)"}}>Calculate Potential Revenue →</button>
        ):(
          <div style={{animation:"fadeUp 0.5s ease both"}}>
            <div style={{textAlign:"center",padding:"24px 0",marginBottom:20,borderRadius:16,background:"rgba(255,255,255,0.5)",border:`1px solid ${C.glassBorder}`}}>
              <div style={{fontSize:11,color:C.text2,textTransform:"uppercase",letterSpacing:"2px",marginBottom:8}}>Estimated Monthly Revenue</div>
              <div style={{fontSize:44,fontWeight:800,color:C.text,letterSpacing:"-2px"}}>${total.toLocaleString()}</div>
              <div style={{fontSize:14,color:C.green,fontWeight:600,marginTop:4}}>${(total*12).toLocaleString()}/year</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
              {[{l:"Ad Revenue",v:adRev,c:C.purple},{l:"Subscriptions",v:subRev,c:C.green},{l:"Tips",v:tipRev,c:C.gold},{l:"Merch",v:merchRev,c:C.red}].map((r,i)=>(
                <div key={i} style={{padding:14,borderRadius:12,background:"rgba(255,255,255,0.5)",border:`1px solid ${C.glassBorder}`}}><div style={{fontSize:11,color:C.text2,marginBottom:4}}>{r.l}</div><div style={{fontSize:18,fontWeight:700,color:r.c}}>${r.v.toLocaleString()}</div></div>
              ))}
            </div>
            <div style={{padding:16,borderRadius:12,background:"rgba(255,255,255,0.5)",border:`1px solid ${C.glassBorder}`,marginBottom:16}}>
              <div style={{fontSize:12,fontWeight:600,color:C.text,marginBottom:10}}>Your Creator Tier</div>
              {[{t:"Explorer",s:"60%",min:0},{t:"Pro",s:"70%",min:1000},{t:"Elite",s:"80%",min:5000},{t:"Partner",s:"85%",min:20000}].map((t,i,arr)=>{
                const next=arr[i+1];const on=total>=t.min&&(!next||total<next.min);
                return(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 10px",borderRadius:8,background:on?C.surface2:"transparent",border:on?`1px solid ${C.border}`:"1px solid transparent"}}><span style={{fontSize:13,fontWeight:on?700:400,color:on?C.text:C.text2}}>{t.t}{on&&" <-"}</span><span style={{fontSize:14,fontWeight:700,color:on?C.green:C.text2}}>{t.s}</span></div>)
              })}
            </div>
            <button onClick={()=>setShow(false)} style={{width:"100%",padding:14,borderRadius:12,border:`1px solid ${C.border}`,background:"transparent",color:C.text2,fontSize:13,cursor:"pointer",fontFamily:FF}}>Adjust Parameters</button>
          </div>
        )}
      </div>
    </div>
  );
}

// === CREATOR DASHBOARD ===
function CreatorDashboard({onBack}){
  const[user,setUser]=useState(null);const[active,setActive]=useState("overview");const[menuOpen,setMenuOpen]=useState(false);
  const[showSim,setShowSim]=useState(false);
  const ww=useWinWidth();const mob=ww<=768;
  if(!user)return<EmailGate onSubmit={setUser}/>;
  const pages={overview:<DashOverview/>,upload:<DashUpload/>,analytics:<DashAnalytics/>,merch:<DashMerch/>,streaming:<DashStreaming/>};
  return(
    <div style={{display:"flex",minHeight:"100vh",background:C.bg,fontFamily:FF,color:C.text}}>
      {showSim&&<MonetizationSim storyTitle="Your Story" onClose={()=>setShowSim(false)}/>}
      {mob&&<button onClick={()=>setMenuOpen(!menuOpen)} style={{position:"fixed",top:20,left:20,zIndex:250,padding:"12px 14px",borderRadius:8,background:C.glass,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",border:`1px solid ${C.glassBorder}`,color:C.text,fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:C.shadow}}>{menuOpen?"✕":"☰"}</button>}
      <div style={{position:mob?"fixed":"relative",top:0,left:(menuOpen||!mob)?0:-300,height:"100vh",width:260,background:C.bg,zIndex:200,transition:"left 0.3s ease"}}><DashSidebar active={active} setActive={id=>{setActive(id);setMenuOpen(false)}} user={user}/></div>
      {menuOpen&&mob&&<div onClick={()=>setMenuOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",backdropFilter:"blur(4px)",WebkitBackdropFilter:"blur(4px)",zIndex:150}}/>}
      <div style={{flex:1,padding:"32px 20px",overflowY:"auto",maxHeight:"100vh"}}>
        <div style={{display:"flex",gap:12,position:"absolute",top:20,right:20}}>
          <button onClick={()=>setShowSim(true)} style={{padding:"10px 20px",borderRadius:8,border:"1px solid "+C.green,background:C.glass,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",color:C.green,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:FF,boxShadow:C.shadow}}>💰 Revenue Simulator</button>
          <button onClick={onBack} style={{padding:"10px 20px",borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:C.text2,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:FF}} onMouseEnter={e=>{e.target.style.borderColor=C.accent;e.target.style.color=C.accent}} onMouseLeave={e=>{e.target.style.borderColor=C.border;e.target.style.color=C.text2}}>← Back to Reader</button>
        </div>
        {pages[active]}
      </div>
      <style>{CSS}</style>
    </div>
  );
}


// === ASSET MANIFEST SYSTEM ===
// Architecture: Pre-process once per story upload -> cache forever
//
// PIPELINE (runs once when creator uploads a story):
// 1. AI analyzes full text -> identifies key visual moments + emotional beats
// 2. For each scene break, generates:
//    - imagePrompt: text prompt for image generation API
//    - audioMood: tag for ambient audio generation
//    - visualMotion: type of subtle CSS animation to apply
// 3. Calls image API -> stores URL in manifest
// 4. Calls audio API -> stores URL in manifest
// 5. Manifest saved to DB/GCS, loaded by reader at chapter load
//
// During reading: ZERO AI calls. Everything served from cached manifest.
//
// To connect APIs, implement generateStoryAssets() below:
// ===========================================================================

// Pre-analyzed scene data for Frankenstein (what the AI pipeline would produce)
// imageUrl: null means use SVG fallback. When API connected, these get filled with GCS URLs.
const FRANK_ASSETS = [
  {
    sceneDesc: "A sailing ship locked in Arctic ice under the northern lights, ink wash illustration style, dark atmospheric, pen and ink",
    imagePrompt: "dark ink wash illustration, sailing ship trapped in arctic ice, northern lights above, gothic atmosphere, pen and ink style, scary stories to tell in the dark aesthetic, no text",
    imageUrl: null,
    audioMood: "arctic-wind",
    audioUrl: null,
    visualMotion: "sway",
    emotionalBeat: "anticipation",
  },
  {
    sceneDesc: "A giant mysterious figure on a dog sled crossing a frozen wasteland, with a wretched stranger in the foreground",
    imagePrompt: "dark ink wash illustration, mysterious giant figure on dog sled in arctic wasteland, second emaciated figure reaching out, fog, gothic horror style, pen and ink, monochrome",
    imageUrl: null,
    audioMood: "tension-drone",
    audioUrl: null,
    visualMotion: "drift",
    emotionalBeat: "mystery",
  },
  {
    sceneDesc: "Idyllic Lake Como scene with mountains, two children by the water, warm but with a hint of foreboding",
    imagePrompt: "ink wash illustration, lake como italy with mountains, two small children by water, warm golden light, nostalgic but slightly ominous undertone, pen and ink with wash",
    imageUrl: null,
    audioMood: "pastoral-calm",
    audioUrl: null,
    visualMotion: "breathe",
    emotionalBeat: "innocence",
  },
  {
    sceneDesc: "Dark laboratory, a body on a table, a single yellow eye opening, candle flickering, lightning flash, scientist recoiling in horror",
    imagePrompt: "dark gothic ink wash illustration, frankenstein laboratory scene, creature on table with single glowing yellow eye opening, candle light, lightning, terrified scientist recoiling, pen and ink, horror, scary stories to tell in the dark style",
    imageUrl: null,
    audioMood: "horror-creation",
    audioUrl: null,
    visualMotion: "flicker",
    emotionalBeat: "horror",
  },
  {
    sceneDesc: "Large imposing creature facing viewer with glowing eyes, small human figure shrinking back, mountain wilderness, mist",
    imagePrompt: "dark ink wash illustration, frankenstein creature large imposing figure with glowing eyes facing viewer, small human cowering, mountain wilderness, heavy mist, gothic horror, pen and ink monochrome",
    imageUrl: null,
    audioMood: "confrontation",
    audioUrl: null,
    visualMotion: "slowApproach",
    emotionalBeat: "anguish",
  },
  {
    sceneDesc: "Vast empty Arctic landscape, single tiny figure walking away into fog and darkness, profound loneliness",
    imagePrompt: "dark ink wash illustration, vast empty arctic ice field, single tiny figure disappearing into fog and darkness, stars above, profound solitude, pen and ink, haunting atmosphere",
    imageUrl: null,
    audioMood: "desolation",
    audioUrl: null,
    visualMotion: "fade",
    emotionalBeat: "grief",
  },
];

// AUDIO_MOODS and getAssets removed — now handled by AudioEngine + manifests

// === generateStoryAssets() - CONNECT YOUR APIs HERE ===
// This function runs ONCE when a creator uploads a story.
// It analyzes text, generates assets, and caches them.
//
// async function generateStoryAssets(storyText, chapters) {
//   // Step 1: Send full text to LLM to identify visual moments
//   // const analysis = await fetch('VERTEX_AI_ENDPOINT', {
//   //   body: JSON.stringify({
//   //     prompt: `Analyze this story and identify the 6-8 most visually impactful 
//   //     moments. For each, provide: sceneDesc, imagePrompt (ink wash gothic style), 
//   //     audioMood, emotionalBeat, which chapter it belongs to.`,
//   //     text: storyText
//   //   })
//   // });
//   //
//   // Step 2: Generate images
//   // for (const scene of analysis.scenes) {
//   //   // Option A: Replicate (Flux/SDXL)
//   //   const img = await fetch('https://api.replicate.com/v1/predictions', {
//   //     headers: { 'Authorization': `Token ${REPLICATE_API_KEY}` },
//   //     body: JSON.stringify({
//   //       model: 'black-forest-labs/flux-schnell',
//   //       input: { prompt: scene.imagePrompt, aspect_ratio: '16:9' }
//   //     })
//   //   });
//   //   
//   //   // Option B: Google Imagen (uses your GCP credits)
//   //   // const img = await fetch('IMAGEN_ENDPOINT', { ... });
//   //   
//   //   // Option C: OpenAI DALL-E
//   //   // const img = await fetch('https://api.openai.com/v1/images/generations', { ... });
//   //   
//   //   // Store to GCS
//   //   // await uploadToGCS(img.url, `stories/${storyId}/ch${scene.chapter}.webp`);
//   //   // scene.imageUrl = gcsPublicUrl;
//   // }
//   //
//   // Step 3: Generate ambient audio loops (optional)
//   // for (const scene of analysis.scenes) {
//   //   // Replicate MusicGen
//   //   const audio = await fetch('https://api.replicate.com/v1/predictions', {
//   //     body: JSON.stringify({
//   //       model: 'meta/musicgen',
//   //       input: { prompt: `${scene.audioMood}, ambient, atmospheric, 15 seconds loop` }
//   //     })
//   //   });
//   //   // await uploadToGCS(audio.url, `stories/${storyId}/audio_ch${scene.chapter}.mp3`);
//   // }
//   //
//   // Step 4: Save manifest to DB
//   // await saveManifest(storyId, analysis.scenes);
// }



// === MAIN COMPONENT ===
export default function MovianxPlatform(){
  const VIEW_TRANSITION_MS=420;
  const VIEW_ENTER_BUFFER_MS=340;
  // === STATE ===
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
  const[viewTransitionState,setViewTransitionState]=useState("idle");
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
  const[revealedWordCount,setRevealedWordCount]=useState(-1); // word-by-word reveal for Immersive timed
  const[narrationStatus,setNarrationStatus]=useState("ready");

  const recognitionRef=useRef(null);
  const navLockRef=useRef(false); // P0: prevents double navigation
  const telemetryRef=useRef([]); // P3: event logging
  const narrationDurationCacheRef=useRef(new Map());

  const currentTheme=THEMES[colorTheme];
  const chaps=sel?getChapters(sel.id):getChapters(1);
  const ch=chaps[chIdx]||{};

  // === BRANCH MEMORY ENGINE ===
  const branchPath=choices.map(c=>c.consequence).filter(Boolean);
  const getBranchLabel=()=>{
    if(branchPath.length===0)return null;
    const last=branchPath[branchPath.length-1];
    const labels={honest:"Ambitious Path",cautious:"Cautious Path",patient:"Empathetic Path",respectful:"Patient Path",ambitious:"Unbridled Ambition",measured:"Balanced Wisdom",responsibility:"Path of Responsibility",abandonment:"Path of Abandonment",agreement:"Compassion Path",refusal:"Defiance Path",alone:"Solo Path",backup:"Cautious Path",take:"Evidence Path",trust:"Trust Path",confront:"Fighter Path",hide:"Survivor Path",escape:"Flight Path",barricade:"Defender Path"};
    return labels[last]||"Your Path";
  };

  // === AUDIO ENGINE INTEGRATION ===
  const stopAllAudio=useCallback(()=>{
    if(audioEngine)audioEngine.stopAll();
    if(recognitionRef.current){try{recognitionRef.current.stop()}catch(e){} recognitionRef.current=null}
    setVoiceActive(false);setVoiceMode(false);setCurrentWordIdx(-1);
  },[]);

  // Get manifest for current story
  const getManifest=(storyId)=>{
    return AUDIO_MANIFESTS_BY_STORY[storyId]||null;
  };

  const getStoryMeta=(storyId)=>STORIES.find(story=>story.id===storyId)||null;
  const isTimedExperience=(storyId)=>{
    const manifest=getManifest(storyId);
    const storyMeta=getStoryMeta(storyId);
    return Boolean(manifest?.isTimedExperience||storyMeta?.isTimedExperience||storyMeta?.isTimed);
  };
  const getTimeline=(storyId)=>{
    const manifest=getManifest(storyId);
    return manifest?.timeline||{
      revealLeadRatio:0.92,
      minMsPerWord:200,
      choiceRevealBufferMs:1200,
      promptToTimerBufferMs:300,
      cinematicTimedChoiceDelayMs:2000,
      defaultTimeLimit:10,
      silenceFloor:0.025,
    };
  };
  const shouldUseCompanionScript=(storyId,currentMode)=>{
    const manifest=getManifest(storyId);
    return currentMode==="Immersive"&&Boolean(isTimedExperience(storyId)&&manifest?.companionScript);
  };
  const companionChapter=sel&&shouldUseCompanionScript(sel.id,mode)
    ?getManifest(sel.id)?.companionScript?.[chIdx]||null
    :null;
  const activeChapterText=companionChapter?.text||ch.text||"";
  const activeChoicePrompt=sel?getChoiceDialogue(getManifest(sel.id),chIdx,ch.choice):ch.choice?.prompt||"";

  const getNarrationDurationMs=useCallback((storyId,chapterIdx,currentMode,fallbackText,emotion="calm")=>{
    if(typeof window==="undefined")return Promise.resolve(estimateSpeechDurationMs(fallbackText,emotion));
    const manifest=getManifest(storyId);
    const useCompanion=shouldUseCompanionScript(storyId,currentMode);
    const narrationText=useCompanion
      ?manifest?.companionScript?.[chapterIdx]?.text||fallbackText
      :fallbackText;
    const narrationUrl=useCompanion
      ?assetResolver.getCompanionNarrationFromManifest(manifest,chapterIdx)
      :assetResolver.getNarrationFromManifest(manifest,chapterIdx);

    if(!narrationUrl){
      return Promise.resolve(estimateSpeechDurationMs(narrationText,emotion));
    }

    const cached=narrationDurationCacheRef.current.get(narrationUrl);
    if(cached)return Promise.resolve(cached);

    return new Promise(resolve=>{
      const probe=new Audio(narrationUrl);
      probe.preload="metadata";
      const finish=(durationMs)=>{
        if(durationMs)narrationDurationCacheRef.current.set(narrationUrl,durationMs);
        resolve(durationMs||estimateSpeechDurationMs(narrationText,emotion));
      };
      probe.addEventListener("loadedmetadata",()=>{
        const durationMs=Number.isFinite(probe.duration)&&probe.duration>0
          ? Math.round(probe.duration*1000)
          : null;
        finish(durationMs);
      },{once:true});
      probe.addEventListener("error",()=>finish(null),{once:true});
      probe.load();
    });
  },[]);

  const toPosition=(value,fallback={x:0,y:0,z:0})=>{
    if(Array.isArray(value))return {x:value[0]||0,y:value[1]||0,z:value[2]||0};
    return value||fallback;
  };

  const movementToPath=(event)=>{
    const start=toPosition(event.startPosition||event.position,{x:0,y:0,z:-3});
    if(event.endPosition)return {from:start,to:toPosition(event.endPosition,start)};
    if(event.movement==="approaching")return {from:start,to:{x:start.x,y:start.y,z:Math.min(-0.8,start.z+3)}};
    if(event.movement==="retreating")return {from:start,to:{x:start.x,y:start.y,z:start.z-5}};
    if(event.movement==="leftToRight")return {from:{x:-4,y:start.y,z:start.z},to:{x:4,y:start.y,z:start.z}};
    if(event.movement==="rightToLeft")return {from:{x:4,y:start.y,z:start.z},to:{x:-4,y:start.y,z:start.z}};
    if(event.movement==="behind")return {from:{x:start.x,y:start.y,z:-1},to:{x:start.x,y:start.y,z:-5}};
    return {from:start,to:start};
  };

  const eventPressure=(event,from,to)=>{
    const fromDistance=Math.sqrt(from.x**2+from.y**2+from.z**2);
    const toDistance=Math.sqrt(to.x**2+to.y**2+to.z**2);
    const approaching=toDistance<fromDistance;
    const behind=from.z<0||to.z<0;
    return {
      tension: Math.max(0,event.triggerTension||0)+(behind?0.08:0)+(approaching?Math.min(0.18,(fromDistance-toDistance)*0.035):0),
      presence: Math.min(0.35,(approaching?0.18:0.05)+(toDistance<1.2?0.15:0)),
      uncertainty: event.unsourced?0.16:(behind?0.08:0),
    };
  };

  const playEnvironmentEvent=(event)=>{
    if(!audioEngine||!event)return;
    const {from,to}=movementToPath(event);
    audioEngine.addExperienceImpulse(eventPressure(event,from,to));
    if(event.type==="procedural"){
      audioEngine.playProcedural(event.sound,{volume:event.volume||0.05,position:from,label:event.label,role:event.role||"tension"});
      return;
    }
    const url=assetResolver.resolveFile(event.sound||event.file);
    if(!url)return;
    const durationSec=(event.duration||1000)/1000;
    const isPhysiology=String(event.sound||event.file||"").includes("heartbeat")||String(event.sound||event.file||"").includes("breathing_raspy");
    if(event.movement&&event.movement!=="fixed"){
      audioEngine.playSpatialMoving(url,event.volume||0.12,from,to,durationSec,event.loop||false,true,event.label||event.sound||event.file,event.role||"tension");
    }else if(isPhysiology){
      audioEngine.playSpatialBurst(url,event.volume||0.12,from,event.duration||1400,event.label||event.sound||event.file,event.role||"event");
    }else{
      audioEngine.playSpatial(url,event.volume||0.12,from,event.loop||false,event.fadeIn||0,event.label||event.sound||event.file,event.role||"event");
    }
    if(event.voiceReaction){
      const reactionDelay=Math.max(250,Math.min(event.duration||1200,1800));
      audioEngine.addTimeout(()=>console.log("CHARACTER REACTION:",event.voiceReaction,event.voiceEmotion||"whispering"),reactionDelay);
    }
    if(event.silenceAfter||Math.random()<0.18){
      const after=(event.duration||1000)+(350+Math.random()*900);
      const duration=event.silenceAfter?.duration||Math.round(500+Math.random()*1200);
      audioEngine.addTimeout(()=>audioEngine.silence(duration),after);
    }
  };

  // Play full chapter audio from manifest
  const playChapterAudio=(storyId,chapIdx,currentMode)=>{
    if(!audioEngine||!audioEngine.ctx)return;
    const manifest=getManifest(storyId);
    const chData=chaps[chapIdx]||{};
    const storyMeta=getStoryMeta(storyId)||{};
    const chManifest=manifest?.chapters?.[chapIdx]||{};
    const audioSceneProfile=getAudioSceneProfile(storyId,chapIdx,chData,storyMeta);
    const sceneAnalysis=chManifest.sceneAnalysis||{
      mood: audioSceneProfile.mood,
      tension: audioSceneProfile.dangerLevel,
      environment: audioSceneProfile.location,
      pacing: audioSceneProfile.pace,
    };
    const audioPlan=buildAdaptiveAudioPlan(audioSceneProfile,chManifest);
    const intensityLevel=audioPlan.intensityLevel ?? getIntensityLevel(audioSceneProfile);
    const exposedSceneProfile={
      ...audioSceneProfile,
      intensity: intensityLevel,
      emotionLabel: audioSceneProfile.emotionLabel,
    };
    if(typeof window!=="undefined"){
      window.audioSceneProfile=exposedSceneProfile;
    }
    const tensionLevel=typeof chManifest.tension==="number"?chManifest.tension:audioPlan.tension;
    setNarrationStatus("ready");
    console.log("EMOTION:",audioSceneProfile.emotionLabel||audioSceneProfile.characterEmotion||audioSceneProfile.mood);
    console.log("SCENE PROFILE:",audioSceneProfile);
    console.log("INTENSITY LEVEL:",intensityLevel);
    audioEngine.setFearAssets({
      heartbeat: assetResolver.getAudio("heartbeat"),
      breath: assetResolver.getAudio("breathing_raspy"),
    });
    audioEngine.updateExperienceState({
      tension: tensionLevel,
      immersion: currentMode==="Immersive"?0.78:0.48,
      presence: tensionLevel>0.7?0.42:0.22,
      uncertainty: sceneAnalysis.mood==="suspense"||sceneAnalysis.mood==="fear"||sceneAnalysis.mood==="horror"?0.5:0.18,
      control: 0,
    });

    // 1. Start ambient sounds
    const ambientLayers=(audioPlan.ambience&&audioPlan.ambience.length?audioPlan.ambience:getAutoAmbient(sceneAnalysis));
    if(ambientLayers){
      ambientLayers.forEach(amb=>{
        if(amb.type==="procedural"){
          audioEngine.playProcedural(amb.sound,{volume:amb.volume,frequency:amb.frequency,waveform:amb.waveform,label:amb.label,fadeIn:amb.fadeIn||0,role:"ambient"});
        }else if(amb.file){
          audioEngine.playEvolvingAmbient(assetResolver.resolveFile(amb.file),{
            volume:amb.volume,
            fadeIn:amb.fadeIn||0,
            label:amb.label||"scene ambience",
            role:"ambient",
            layers:amb.layers||3,
          });
        }
      });
    }

    // 1b. Start music layer (loops underneath everything)
    if(audioPlan.musicBed){
      const m=audioPlan.musicBed;
      if(m.type==="procedural"){
        audioEngine.playProcedural(m.sound,{volume:m.volume,frequency:m.frequency,waveform:m.waveform,label:m.label,fadeIn:m.fadeIn||0,role:"music"});
      }else if(m.file){
      audioEngine.playEvolvingAmbient(assetResolver.resolveFile(m.file),{
        volume:m.volume||0.1,
        fadeIn:m.fadeIn||3,
        label:m.label||"chapter_music",
        role:"music",
        layers:2,
      });
      }
    }

    if(intensityLevel>=2){
      audioEngine.playSpatialBurst(assetResolver.getAudio("heartbeat"),0.05+(intensityLevel*0.035),{x:0,y:0,z:0},1800,"intensity heartbeat burst","tension");
    }
    if(intensityLevel>=3){
      audioEngine.addTimeout(()=>{
        audioEngine.playSpatialBurst(assetResolver.getAudio("breathing_raspy"),0.08,{x:0.18,y:0,z:-0.18},1200,"single panic breath close right","event");
      },1200);
    }

    const environmentEvents=[...(audioPlan.spatialEvents||[]),...getAutoEnvironmentEvents(sceneAnalysis)];
    const scheduleExperienceEvent=(fn,baseDelay=0,pressure=0)=>{
      const state=audioEngine.getExperienceState?.()||{};
      const uncertainty=state.uncertainty??sceneAnalysis.tension??0;
      const jitter=Math.round((Math.random()*2-1)*(250+uncertainty*900));
      const silenceBefore=pressure>0.16||uncertainty>0.65?Math.random()*500:0;
      audioEngine.addTimeout(()=>{
        if(silenceBefore)audioEngine.silence(Math.round(250+silenceBefore));
        audioEngine.addTimeout(fn,Math.round(silenceBefore));
      },Math.max(0,baseDelay+jitter));
    };

    const scheduler=new SpatialEventScheduler(audioEngine,playEnvironmentEvent,{uncertainty:audioSceneProfile.emotionalIntensity});
    environmentEvents.forEach(event=>{
      const pressure=event.triggerTension||sceneAnalysis.tension*0.12;
      scheduler.schedule(event,event.delay||event.time||0,pressure);
    });

    // 2. Start spatial sounds with triggers
    if(chManifest.spatial){
      chManifest.spatial.forEach(sp=>{
        const playIt=()=>{
          if(sp.type==="procedural"){
            audioEngine.playProcedural(sp.sound,{volume:sp.volume,position:sp.position,label:sp.label,role:"tension"});
            return;
          }
          const url=assetResolver.resolveFile(sp.file);
          if(sp.movement){
            const mv=sp.movement;
            const from=mv.from||{x:mv.axis==="x"?mv.from:0,y:0,z:0};
            const to=mv.to||{x:mv.axis==="x"?mv.to:0,y:0,z:0};
            if(typeof mv.from==="number"){
              // sweep format: axis, from number, to number
              audioEngine.playSpatialMoving(url,sp.volume,{x:mv.from,y:0,z:0},{x:mv.to,y:0,z:0},mv.duration,sp.loop||false,mv.fadeWithDistance||false,sp.label||null,"tension");
            }else{
              audioEngine.playSpatialMoving(url,sp.volume,from,to,mv.duration,sp.loop||false,mv.fadeWithDistance||false,sp.label||null,"tension");
            }
          }else{
            audioEngine.playSpatial(url,sp.volume,sp.position||{x:0,y:0,z:0},sp.loop||false,sp.trigger?.fadeIn||0,sp.label||null,"tension");
          }
        };

        if(!sp.trigger||sp.trigger.type==="immediate"){
          playIt();
        }else if(sp.trigger.type==="timed"){
          scheduleExperienceEvent(playIt,sp.trigger.delay,sceneAnalysis.tension*0.08);
        }else if(sp.trigger.type==="random"){
          const scheduleRandom=()=>{
            const delay=sp.trigger.minDelay+Math.random()*(sp.trigger.maxDelay-sp.trigger.minDelay);
            scheduleExperienceEvent(()=>{
              playIt();
              scheduleRandom();
            },delay,sceneAnalysis.tension*0.06);
          };
          scheduleRandom();
        }
      });
    }

    // 3. Execute timed sequence
    if(chManifest.timedSequence){
      chManifest.timedSequence.forEach(cue=>{
        scheduleExperienceEvent(()=>{
          if(cue.triggerTension)audioEngine.addExperienceImpulse({tension:cue.triggerTension,presence:cue.presence||0.05,uncertainty:cue.uncertainty||0.02});
          if(cue.action==="play"){
            if(cue.type==="procedural"){
              audioEngine.playProcedural(cue.sound,{volume:cue.volume,position:cue.position,label:cue.label,role:cue.role||"tension"});
            }else{
              const url=assetResolver.resolveFile(cue.file);
              if(cue.movement){
                audioEngine.playSpatialMoving(url,cue.volume,cue.movement.from,cue.movement.to,cue.movement.duration,cue.loop||false,false,cue.label||null,cue.role||"tension");
              }else if(cue.position){
                audioEngine.playSpatial(url,cue.volume,cue.position,cue.loop||false,0,cue.label||null,cue.role||"tension");
              }else{
                audioEngine.playAmbient(url,cue.volume,0,cue.label||null,cue.role||"tension");
              }
            }
          }else if(cue.action==="silence"){
            const silenceJitter=Math.round(Math.random()*450);
            audioEngine.silence((cue.duration||600)+silenceJitter,{floor:getTimeline(storyId).silenceFloor});
          }else if(cue.action==="fadeGain"){
            const targetGain=audioEngine.labeledGains[cue.target];
            if(targetGain)audioEngine.fadeGain(targetGain,cue.toVolume,cue.duration);
          }else if(cue.action==="fadeAllAmbient"){
            audioEngine.fadeAllAmbient(cue.toVolume,cue.duration);
          }
        },cue.time,sceneAnalysis.tension*0.08);
      });
    }

    // 4. Start narration
    const useCompanion=shouldUseCompanionScript(storyId,currentMode);
    const narrationUrl=useCompanion
      ?assetResolver.getCompanionNarrationFromManifest(manifest,chapIdx)
      :assetResolver.getNarrationFromManifest(manifest,chapIdx);
    const fallbackText=useCompanion&&manifest?.companionScript?.[chapIdx]?.text
      ||chData.text
      ||"";
    if(typeof window!=="undefined"){
      const spokenText=performNarrationText(fallbackText,exposedSceneProfile);
      window.lastNarrationText=spokenText;
      window.lastNarrationPayload={
        spokenText,
        sceneMetadata:{
          emotion:exposedSceneProfile.emotionLabel||exposedSceneProfile.characterEmotion||exposedSceneProfile.mood,
          environment:exposedSceneProfile.location||sceneAnalysis.environment,
          intensity:exposedSceneProfile.intensity,
        },
      };
    }

    // Try to load audio file; if missing, block generated narration instead of using browser speech.
    if(narrationUrl){
      const testAudio=new Audio(narrationUrl);
      const narrationVolume=isTimedExperience(storyId)?1.4:1.0; // timed companion narration is intentionally close and dominant
      testAudio.addEventListener("canplaythrough",()=>{
        testAudio.pause();
        setNarrationStatus("playing");
        audioEngine.playNarration(narrationUrl,narrationVolume);
      },{once:true});
      testAudio.addEventListener("error",()=>{
        setNarrationStatus("generating");
        console.warn("MISSING NARRATION AUDIO:",narrationUrl,{storyId,chapIdx,currentMode});
      },{once:true});
      testAudio.load();
    }else if(fallbackText&&currentMode!=="Reader"){
      setNarrationStatus("generating");
      console.warn("MISSING NARRATION AUDIO:",{storyId,chapIdx,currentMode});
    }
    audioEngine.addTimeout(()=>console.log("ACTIVE LAYERS:",audioEngine.getActiveLayers?.()||{}),500);
    audioEngine.addTimeout(()=>console.log("ACTIVE LAYERS:",audioEngine.getActiveLayers?.()||{}),2200);
  };

  // Browser speech is intentionally disabled. Immersive audio must come from
  // generated assets or remain in a generation/blocking state.
  const markNarrationMissing=(text,emotion="calm")=>{
    const rawText=typeof text==="object"?text?.text:text;
    if(rawText)console.warn("NARRATION AUDIO REQUIRED:",{text:rawText,emotion});
    setNarrationStatus("generating");
    setCurrentWordIdx(-1);
  };

  const queueMissingChoiceAudio=(choice,dialogueOverride=null)=>{
    if(!choice||!choice.opts)return;
    const prompt=dialogueOverride||getChoiceDialogue(sel?getManifest(sel.id):null,chIdx,choice);
    const promptText=typeof prompt==="object"?prompt.text:prompt;
    console.warn("CHOICE VOICE AUDIO REQUIRED:",{prompt:promptText,chapter:chIdx});
    setNarrationStatus("generating");
  };

  const startVoiceRec=()=>{
    if(typeof window==="undefined")return;
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR)return;
    if(recognitionRef.current)try{recognitionRef.current.stop()}catch(e){}
    const rec=new SR();recognitionRef.current=rec;
    rec.continuous=false;rec.interimResults=false;rec.lang="en-US";
    rec.onstart=()=>setVoiceActive(true);
    rec.onresult=(e)=>{
      const t=e.results[0][0].transcript.toLowerCase().trim();
      const choice=chaps[chIdx].choice;if(!choice)return;
      // Check for "option N" pattern first
      const numMatch=t.match(/option\s*(\d)/);
      if(numMatch){
        const idx=parseInt(numMatch[1])-1;
        if(idx>=0&&idx<choice.opts.length){console.log("VOICE CHOICE ACCEPTED:",idx+1);setTimeout(()=>makeChoice(choice.opts[idx]),800);return}
      }
      // Fallback: fuzzy match against option text
      let best=null,hi=0;
      choice.opts.forEach(opt=>{
        const words=opt.txt.toLowerCase().replace(/[^\w\s]/g,"").split(/\s+/).filter(w=>w.length>2);
        let score=0;words.forEach(w=>{if(t.includes(w))score++;if(w.length>3&&t.includes(w.substring(0,4)))score+=0.5});
        if(score>hi){hi=score;best=opt}
      });
      if(best&&hi>0.5){console.log("VOICE CHOICE ACCEPTED:",best.txt);setTimeout(()=>makeChoice(best),800)}
      else{
        // Re-read options and listen again
        console.log("VOICE CHOICE MISHEARD");
        setTimeout(()=>{queueMissingChoiceAudio(choice);setTimeout(()=>startVoiceRec(),6000)},2000);
      }
    };
    rec.onerror=()=>{
      setVoiceActive(false);
      // Retry after error in immersive mode
      if(voiceMode&&showChoice){
        const choice=chaps[chIdx].choice;
        if(choice){setTimeout(()=>{queueMissingChoiceAudio(choice);setTimeout(()=>startVoiceRec(),6000)},1500)}
      }
    };
    rec.onend=()=>{setVoiceActive(false);if(voiceMode&&showChoice)setTimeout(()=>startVoiceRec(),500)};
    rec.start();
  };

  // === NAVIGATION CONTROLLER ===
  const navigateTo=(newPg)=>{
    if(navLockRef.current)return;
    navLockRef.current=true;
    stopAllAudio();
    logEvent("navigate",{from:pg,to:newPg});
    setViewTransitionState("exiting");
    setTimeout(()=>{
      setPg(newPg);
      setViewTransitionState("entering");
      if(typeof window!=="undefined"){
        window.scrollTo(0,0);
        window.requestAnimationFrame(()=>{
          window.requestAnimationFrame(()=>{
            setTimeout(()=>{
              setViewTransitionState("idle");
              navLockRef.current=false;
            },VIEW_ENTER_BUFFER_MS);
          });
        });
        return;
      }
      setViewTransitionState("idle");
      navLockRef.current=false;
    },VIEW_TRANSITION_MS);
  };

  const goChapter=(idx)=>{
    if(navLockRef.current||idx<0||idx>=chaps.length)return;
    navLockRef.current=true;
    stopAllAudio();
    logEvent("page_view",{chapter:idx,title:chaps[idx]?.title});
    setPageAnim("out");
    setTimeout(()=>{
      setChIdx(idx);setShowChoice(false);setTimerActive(false);setTimeRemaining(null);
      setPageAnim("in");
      if(typeof window!=="undefined")window.scrollTo(0,0);
      setTimeout(()=>{setPageAnim("");navLockRef.current=false},400);
    },300);
  };

  // === SWIPE HANDLER ===
  const onTouchStart=e=>setTouchStartX(e.touches[0].clientX);
  const onTouchMove=e=>setTouchEndX(e.touches[0].clientX);
  const onTouchEnd=()=>{
    const dist=touchStartX-touchEndX;
    setTouchStartX(0);setTouchEndX(0);
    if(Math.abs(dist)<50)return;
    if(dist>0)goChapter(chIdx+1); // swipe left = next
    else goChapter(chIdx-1); // swipe right = prev
  };

  // === CHOICE HANDLER ===
  const makeChoice=(opt)=>{
    logEvent("choice_made",{chapter:chIdx,choice:opt.txt,consequence:opt.consequence});
    setChoices(prev=>[...prev,{ch:chIdx,choice:opt.txt,consequence:opt.consequence}]);
    setShowChoice(false);setTimerActive(false);setTimeRemaining(null);
    audioEngine?.updateExperienceState({control:0.05,presence:0.28});
    if(opt.next<chaps.length)goChapter(opt.next);
  };

  // === TELEMETRY ===
  const logEvent=(type,data={})=>{
    const evt={type,ts:Date.now(),storyId:sel?.id,...data};
    telemetryRef.current.push(evt);
    if(typeof window!=="undefined")console.log("[Movianx]",type,data);
  };

  // === EFFECTS ===
  useEffect(()=>{
    if(pg!=="reading"||!activeChapterText)return;
    setTxt(activeChapterText);
    setRevealedWordCount(-1);
    logEvent("scene_playback_started",{chapter:chIdx,title:ch.title,mode});

    // Cinematic + Immersive: play full manifest audio
    if((mode==="Cinematic"||mode==="Immersive")&&audioEngine&&audioEngine.ctx&&sel){
      playChapterAudio(sel.id,chIdx,mode);
    }
    // Cinematic without generated narration blocks instead of using browser speech.
    if(mode==="Cinematic"&&(!sel||!getManifest(sel.id))){
      markNarrationMissing(activeChapterText,ch.emotion||"calm");
    }

    const wordCount=activeChapterText?activeChapterText.split(/\s+/).length:0;
    const isTimedStory=Boolean(sel&&isTimedExperience(sel.id));
    const isImmersiveTimed=isTimedStory&&mode==="Immersive";
    const timeline=sel?getTimeline(sel.id):getTimeline(0);

    // Word-by-word reveal for Immersive timed stories
    // Synced to actual narration duration so highlight tracks the voice
    let revealInterval=null;
    if(isImmersiveTimed){
      setRevealedWordCount(0);
      const startReveal=(durationMs)=>{
        // Lead slightly so highlight arrives just before the voice.
        const msPerWord=Math.max(timeline.minMsPerWord,Math.floor((durationMs*timeline.revealLeadRatio)/wordCount));
        let wordIdx=0;
        revealInterval=setInterval(()=>{
          wordIdx++;
          if(wordIdx>=wordCount){
            setRevealedWordCount(wordCount);
            clearInterval(revealInterval);
            revealInterval=null;
          }else{
            setRevealedWordCount(wordIdx);
          }
        },msPerWord);
      };
      // Try to get actual MP3 duration, else estimate
      if(sel){
        getNarrationDurationMs(sel.id,chIdx,mode,activeChapterText,ch.emotion||"calm")
          .then(dur=>{if(!cancelled)startReveal(dur)});
      }else{
        startReveal(estimateSpeechDurationMs(activeChapterText,ch.emotion||"calm"));
      }
    }

    // Show choice after actual narration length when possible instead of hardcoded text timing.
    const localTimers=[];
    const addLocalTimer=(fn,delay)=>{
      const id=setTimeout(fn,delay);
      localTimers.push(id);
      return id;
    };
    const fallbackReadDelay=activeChapterText?Math.min(wordCount*timeline.minMsPerWord,isTimedStory?wordCount*180:8000):3000;
    let cancelled=false;

    const scheduleChoiceFlow=async()=>{
      const narrationDuration=(narratorOn&&mode!=="Reader"&&sel)
        ?await getNarrationDurationMs(sel.id,chIdx,mode,activeChapterText,ch.emotion||"calm")
        :fallbackReadDelay;
      if(cancelled)return;

      if(isImmersiveTimed&&ch.choice){
        addLocalTimer(()=>{
          setShowChoice(true);
          audioEngine?.updateExperienceState({control:0.92,presence:0.72,uncertainty:0.68});
          const manifest=sel?getManifest(sel.id):null;
          const characterLine=getChoiceLine(manifest,chIdx,ch.choice);
          const characterPrompt=characterLine?.text||getChoiceDialogue(manifest,chIdx,ch.choice);
          if(characterPrompt){
            const prompt=characterLine||{text:characterPrompt,breathLevel:0.55,tremble:0.65,whisper:true,pacing:"broken"};
            const promptDelay=estimateSpeechDurationMs(prompt.text||prompt,"whispering");
            console.warn("CHOICE VOICE AUDIO REQUIRED:",{prompt:prompt.text||prompt,chapter:chIdx});
            addLocalTimer(()=>{
              const limit=ch.choice.timeLimit||timeline.defaultTimeLimit;
              if(limit){setTimeRemaining(limit);setTimerActive(true)}
              setVoiceMode(true);startVoiceRec();
            },promptDelay+timeline.promptToTimerBufferMs);
          }else{
            const prompt=getChoiceDialogue(manifest,chIdx,ch.choice);
            const promptDelay=estimateSpeechDurationMs(
              `${prompt}. ${ch.choice.opts.map((opt,i)=>`Say option ${i+1} for ${opt.txt}`).join(". ")}`,
              ch.choice.emotion||"calm"
            );
            queueMissingChoiceAudio(ch.choice,prompt);
            addLocalTimer(()=>{
              const limit=ch.choice.timeLimit||timeline.defaultTimeLimit;
              if(limit){setTimeRemaining(limit);setTimerActive(true)}
              setVoiceMode(true);startVoiceRec();
            },promptDelay+timeline.promptToTimerBufferMs);
          }
        },narrationDuration+timeline.choiceRevealBufferMs);
        return;
      }

      addLocalTimer(()=>{
        if(!ch.choice)return;
        setShowChoice(true);
        audioEngine?.updateExperienceState({control:isTimedStory?0.82:0.46,presence:isTimedStory?0.6:0.3,uncertainty:isTimedStory?0.58:0.24});
        if(isTimedStory){
          addLocalTimer(()=>{
            const limit=ch.choice.timeLimit||timeline.defaultTimeLimit;
            if(limit){setTimeRemaining(limit);setTimerActive(true)}
            if(mode==="Cinematic"){
              queueMissingChoiceAudio(ch.choice,getChoiceLine(getManifest(sel?.id),chIdx,ch.choice)||getChoiceDialogue(getManifest(sel?.id),chIdx,ch.choice));
            }
          },timeline.cinematicTimedChoiceDelayMs);
          return;
        }

        const limit=ch.choice.timeLimit||timeline.defaultTimeLimit;
        if(limit){setTimeRemaining(limit);setTimerActive(true)}
        addLocalTimer(()=>{
          if(mode==="Cinematic"){
            queueMissingChoiceAudio(ch.choice,getChoiceLine(getManifest(sel?.id),chIdx,ch.choice)||getChoiceDialogue(getManifest(sel?.id),chIdx,ch.choice));
          }
          if(mode==="Immersive"){
            const manifest=sel?getManifest(sel.id):null;
            const characterLine=getChoiceLine(manifest,chIdx,ch.choice);
            const characterPrompt=characterLine?.text||getChoiceDialogue(manifest,chIdx,ch.choice);
            if(characterPrompt){
              const prompt=characterLine||{text:characterPrompt,breathLevel:0.35,tremble:0.35,whisper:true,pacing:"hesitant"};
              const promptDelay=estimateSpeechDurationMs(prompt.text||prompt,"whispering");
              console.warn("CHOICE VOICE AUDIO REQUIRED:",{prompt:prompt.text||prompt,chapter:chIdx});
              addLocalTimer(()=>{setVoiceMode(true);startVoiceRec()},promptDelay+timeline.promptToTimerBufferMs);
            }else{
              const prompt=getChoiceDialogue(manifest,chIdx,ch.choice);
              const promptDelay=estimateSpeechDurationMs(
                `${prompt}. ${ch.choice.opts.map((opt,i)=>`Say option ${i+1} for ${opt.txt}`).join(". ")}`,
                ch.choice.emotion||"calm"
              );
              queueMissingChoiceAudio(ch.choice,prompt);
              addLocalTimer(()=>{setVoiceMode(true);startVoiceRec()},promptDelay+timeline.promptToTimerBufferMs);
            }
          }
        },timeline.cinematicTimedChoiceDelayMs);
      },Math.max(fallbackReadDelay,narrationDuration));
    };

    scheduleChoiceFlow();
    return()=>{
      cancelled=true;
      localTimers.forEach(clearTimeout);
      if(revealInterval)clearInterval(revealInterval);
      stopAllAudio();
    };
  },[pg,chIdx,mode,narratorOn,soundEffectsOn,activeChapterText]);

  // Countdown timer with manifest-driven heartbeat intensity
  useEffect(()=>{
    if(!timerActive||timeRemaining===null)return;
    if(timeRemaining<=0){
      if(mode==="Immersive"&&sel&&isTimedExperience(sel.id)&&ch.choice?.opts[0]){
        // Companion makes the choice desperately
        console.log("TIMER AUTO-CHOICE:",ch.choice.opts[0].txt);
        setTimeout(()=>makeChoice(ch.choice.opts[0]),1200);
      }else if(ch.choice?.opts[0]){
        console.log("TIMER AUTO-CHOICE:",ch.choice.opts[0].txt);
        setTimeout(()=>makeChoice(ch.choice.opts[0]),500);
      }
      setTimerActive(false);return;
    }
    // Manifest-driven heartbeat intensity
    if(audioEngine&&audioEngine.ctx&&sel&&mode!=="Reader"){
      const limit=ch.choice?.timeLimit||getTimeline(sel.id).defaultTimeLimit;
      const pressure=limit?Math.max(0,Math.min(1,1-(timeRemaining/limit))):0;
      audioEngine.updateExperienceState({control:Math.max(0.35,pressure),tension:Math.max(audioEngine.currentTension||0,0.45+pressure*0.45),presence:0.45+pressure*0.35});
      const manifest=getManifest(sel.id);
      const chManifest=manifest?.chapters?.[chIdx];
      if(chManifest?.timerAudio?.heartbeatIntensity){
        // Start heartbeat when timer first begins (heartbeatStartAt: "timerStart")
        if(chManifest.timerAudio.heartbeatStartAt==="timerStart"&&timeRemaining===limit){
          const url=assetResolver.getAudio("heartbeat");
          const startIntensity=chManifest.timerAudio.heartbeatIntensity[timeRemaining]||0.1;
          audioEngine.playSpatialBurst(url,startIntensity,{x:0,y:0,z:0},1800,"your heartbeat burst","tension");
        }
        const intensity=chManifest.timerAudio.heartbeatIntensity[timeRemaining];
        if(intensity!==undefined){
          audioEngine.updateTension(Math.max(chManifest.tension||0,intensity));
          // Find heartbeat gain node and adjust
          const hbGain=audioEngine.labeledGains["your heartbeat burst"]||audioEngine.labeledGains["your heartbeat"]||audioEngine.labeledGains["heartbeat"];
          if(hbGain)audioEngine.fadeGain(hbGain,intensity,0.8);
        }
      }
    }
    const cd=setTimeout(()=>setTimeRemaining(timeRemaining-1),1000);
    return()=>clearTimeout(cd);
  },[timerActive,timeRemaining]);

  // CRITICAL: cleanup on unmount + page change
  useEffect(()=>{return()=>stopAllAudio()},[]);
  useEffect(()=>{if(pg!=="reading")stopAllAudio()},[pg]);


  // === RENDER ===

  // === CREATOR DASHBOARD (render) ===
  if(pg==="creator")return<CreatorDashboard onBack={()=>navigateTo("home")}/>;

  // === LANDING PAGE ===
  if(pg==="landing"){
    return <LandingView C={C} FF={FF} CSS={CSS} transitionState={viewTransitionState} navigateTo={navigateTo} />;
  }

  // === HOME PAGE ===
  if(pg==="home"){
    return <HomeView C={C} FF={FF} CSS={CSS} transitionState={viewTransitionState} navigateTo={navigateTo} />;
  }

  // === LIBRARY PAGE ===
  if(pg==="library"){
    return (
      <LibraryView
        C={C}
        FF={FF}
        CSS={CSS}
        transitionState={viewTransitionState}
        navigateTo={navigateTo}
        stories={STORIES}
        onSelectStory={(story)=>{setSel(story);navigateTo("detail")}}
      />
    );
  }

  // === DETAIL PAGE ===
  if(pg==="detail"&&sel){
    return (
      <DetailView
        C={C}
        FF={FF}
        CSS={CSS}
        transitionState={viewTransitionState}
        navigateTo={navigateTo}
        story={sel}
        mode={mode}
        setMode={setMode}
        onStartReading={()=>{
          if(audioEngine&&mode!=="Reader")audioEngine.init();
          setChIdx(0);
          setChoices([]);
          setShowChoice(false);
          navigateTo("reading");
        }}
      />
    );
  }


  // === READING VIEW ===
  if(pg==="reading"){
    return(
      <div style={{minHeight:"100vh",background:timerActive&&timeRemaining!==null&&timeRemaining<=3?`color-mix(in srgb, ${currentTheme.bg} 92%, #000)`:currentTheme.bg,fontFamily:FF,position:"relative",overflowY:"auto",WebkitOverflowScrolling:"touch",animation:mode==="Immersive"&&!timerActive?"immersePulse 4s ease-in-out infinite":timerActive&&timeRemaining===1?"timerShake 0.15s ease infinite":"none",transition:"background 1s ease"}}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>

        {/* Top Bar - Clean, no duplicate icons */}
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
              logEvent("narration_toggled",{enabled:next,chapter:chIdx});
              if(next&&activeChapterText&&mode!=="Reader"&&sel)setTimeout(()=>playChapterAudio(sel.id,chIdx,mode),100);
              else setCurrentWordIdx(-1);
            }} style={{padding:"5px 10px",borderRadius:6,background:narratorOn?`${C.red}15`:"transparent",border:`1px solid ${narratorOn?C.red:`${currentTheme.text}15`}`,color:narratorOn?C.red:`${currentTheme.text}90`,fontSize:11,cursor:"pointer"}}>{narratorOn?"🔊":"🔇"}</button>
            {mode==="Immersive"&&<button onClick={()=>{setVoiceMode(!voiceMode);if(!voiceMode)startVoiceRec()}} style={{padding:"5px 10px",borderRadius:6,background:voiceActive?C.red:"transparent",border:`1px solid ${voiceActive?C.red:`${currentTheme.text}15`}`,color:voiceActive?"#fff":`${currentTheme.text}90`,fontSize:11,cursor:"pointer"}}>🎤</button>}
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings&&(
          <div style={{position:"fixed",top:52,right:12,zIndex:110,width:280,background:colorTheme==="night"?"#1C1C24":"rgba(255,255,255,0.9)",borderRadius:16,border:`1px solid ${currentTheme.text}20`,padding:24,boxShadow:"0 20px 60px rgba(0,0,0,0.1)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",animation:"fadeUp 0.2s ease both"}}>
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

        {/* Cinematic chapter fade overlay */}
        {pageAnim==="out"&&<div style={{position:"fixed",inset:0,background:"#000",zIndex:200,animation:"fadeIn 0.3s ease both"}}/>}

        {/* Content */}
        <div style={{
          maxWidth:800,margin:"0 auto",padding:"100px 40px 200px",
          opacity:pageAnim==="out"?0:1,
          transition:pageAnim==="out"?"opacity 0.3s ease":"none",
          animation:pageAnim==="in"?"chapterFadeIn 0.4s ease both":"none",
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
              {narrationStatus==="generating"&&mode!=="Reader"&&(
                <div style={{marginBottom:24,padding:"14px 16px",borderRadius:8,border:`1px solid ${C.red}35`,background:`${C.red}10`,color:currentTheme.text,fontSize:13,lineHeight:1.5}}>
                  Generating narration...
                </div>
              )}
              {/* Scene Illustration */}
              {sel&&<div key={`scene-${chIdx}`} style={{marginBottom:32,borderRadius:16,overflow:"hidden",border:`1px solid ${currentTheme.text}18`}}><SceneIllustration chapterIdx={chIdx} storyId={sel.id} theme={colorTheme}/></div>}
              <div style={{fontSize:fontSize,color:currentTheme.text,lineHeight:1.9,marginBottom:40,fontFamily:fontFamily}}>
                {revealedWordCount>=0?
                  // Word-by-word reveal for Immersive timed stories
                  txt.split(/(\s+)/).map((segment,i)=>{
                    if(/^\s+$/.test(segment))return <span key={i}>{segment}</span>;
                    const wordsBefore=txt.split(/(\s+)/).slice(0,i).filter(s=>!/^\s+$/.test(s)).length;
                    const isRevealed=wordsBefore<revealedWordCount;
                    const isActive=wordsBefore===revealedWordCount-1;
                    return <span key={i} style={{
                      opacity:isRevealed?1:0,
                      background:isActive?`${C.red}15`:"transparent",
                      borderRadius:isActive?3:0,
                      padding:isActive?"1px 2px":0,
                      transition:"opacity 0.3s ease, background 0.2s ease"
                    }}>{segment}</span>;
                  })
                :currentWordIdx>=0?
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

          {/* === CHOICE UI === */}
          {!listenOnly&&showChoice&&ch.choice&&mode!=="Immersive"&&(
            <div style={{background:colorTheme==="night"?"#141419":"rgba(0,0,0,0.04)",borderRadius:16,border:`1px solid ${timerActive&&timeRemaining<=3?C.red:`${currentTheme.text}20`}`,padding:32,marginTop:40,animation:"fadeUp 0.4s ease both"}}>
              {timerActive&&timeRemaining!==null&&(
                <div style={{textAlign:"center",marginBottom:20,animation:timeRemaining<=3?"pulse 0.5s infinite":"none"}}>
                  <div style={{fontSize:48+(10-Math.min(timeRemaining,10))*2,fontWeight:700,color:timeRemaining<=3?C.red:timeRemaining<=5?`color-mix(in srgb, ${C.red} ${(5-timeRemaining)*25}%, ${currentTheme.text})`:currentTheme.text,fontFamily:"monospace",transition:"font-size 0.4s ease, color 0.4s ease"}}>{timeRemaining}</div>
                  <div style={{fontSize:12,color:timeRemaining<=3?C.red:`${currentTheme.text}60`,textTransform:"uppercase",letterSpacing:2,transition:"color 0.4s ease"}}>{timeRemaining<=3?"DECIDE NOW!":"SECONDS REMAINING"}</div>
                </div>
              )}
              <p style={{fontSize:18,fontWeight:600,color:currentTheme.text,marginBottom:20}}>{activeChoicePrompt}</p>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {ch.choice.opts.map((opt,i)=>(
                  <button key={i} onClick={()=>makeChoice(opt)} style={{padding:"16px 20px",borderRadius:12,background:colorTheme==="night"?"#1C1C24":"rgba(255,255,255,0.8)",border:`1px solid ${currentTheme.text}20`,color:currentTheme.text,fontSize:15,textAlign:"left",cursor:"pointer",transition:"all 0.2s",fontFamily:FF,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}} onMouseEnter={e=>{e.target.style.background=`${C.red}15`;e.target.style.borderColor=C.red;e.target.style.boxShadow="0 4px 16px rgba(139,26,26,0.1)"}} onMouseLeave={e=>{e.target.style.background=colorTheme==="night"?"#1C1C24":"rgba(255,255,255,0.8)";e.target.style.borderColor=`${currentTheme.text}20`;e.target.style.boxShadow="0 2px 8px rgba(0,0,0,0.04)"}}>
                    {opt.txt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Immersive Choice - voice only, no clickable buttons */}
          {showChoice&&ch.choice&&mode==="Immersive"&&(
            <div style={{textAlign:"center",padding:"48px 20px",marginTop:40,animation:"fadeUp 0.4s ease both"}}>
              {activeChoicePrompt&&(
                <p style={{maxWidth:560,margin:"0 auto 24px",fontSize:18,fontWeight:600,lineHeight:1.6,color:currentTheme.text}}>
                  {activeChoicePrompt}
                </p>
              )}
              {timerActive&&timeRemaining!==null&&(
                <div style={{marginBottom:24,animation:timeRemaining<=3?"pulse 0.5s infinite":"none"}}>
                  <div style={{fontSize:48+(10-Math.min(timeRemaining,10))*2,fontWeight:700,color:timeRemaining<=3?C.red:timeRemaining<=5?`color-mix(in srgb, ${C.red} ${(5-timeRemaining)*25}%, ${currentTheme.text})`:currentTheme.text,fontFamily:"monospace",transition:"font-size 0.4s ease, color 0.4s ease"}}>{timeRemaining}</div>
                  <div style={{fontSize:12,color:timeRemaining<=3?C.red:`${currentTheme.text}60`,textTransform:"uppercase",letterSpacing:2,transition:"color 0.4s ease"}}>{timeRemaining<=3?"DECIDE NOW!":"SECONDS REMAINING"}</div>
                </div>
              )}
              <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:64,height:64,borderRadius:"50%",background:voiceActive?`${C.red}15`:`${currentTheme.text}08`,border:`2px solid ${voiceActive?C.red:`${currentTheme.text}20`}`,animation:voiceActive?"pulse 1.5s ease-in-out infinite":"breathe 3s ease-in-out infinite",transition:"all 0.3s"}}>
                <span style={{fontSize:28,opacity:voiceActive?1:0.5}}>🎤</span>
              </div>
              <div style={{fontSize:12,color:`${currentTheme.text}40`,marginTop:16,letterSpacing:"1px"}}>{voiceActive?"LISTENING...":"WAITING..."}</div>
            </div>
          )}

          {/* Chapter Navigation */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:60,paddingTop:20,borderTop:`1px solid ${currentTheme.text}15`}}>
            <button disabled={chIdx===0} onClick={()=>goChapter(chIdx-1)} style={{padding:"12px 24px",borderRadius:10,border:`1px solid ${currentTheme.text}20`,background:"transparent",color:chIdx===0?`${currentTheme.text}30`:currentTheme.text,fontSize:13,cursor:chIdx===0?"not-allowed":"pointer",fontFamily:FF,transition:"all 0.2s"}} onMouseEnter={e=>{if(chIdx>0){e.target.style.borderColor=C.accent;e.target.style.color=C.accent}}} onMouseLeave={e=>{e.target.style.borderColor=`${currentTheme.text}20`;e.target.style.color=chIdx===0?`${currentTheme.text}30`:currentTheme.text}}>← Previous</button>
            <span style={{fontSize:12,color:`${currentTheme.text}50`}}>{chIdx+1} / {chaps.length}</span>
            <button disabled={chIdx>=chaps.length-1} onClick={()=>goChapter(chIdx+1)} style={{padding:"12px 24px",borderRadius:10,border:`1px solid ${currentTheme.text}20`,background:"transparent",color:chIdx>=chaps.length-1?`${currentTheme.text}30`:currentTheme.text,fontSize:13,cursor:chIdx>=chaps.length-1?"not-allowed":"pointer",fontFamily:FF,transition:"all 0.2s"}} onMouseEnter={e=>{if(chIdx<chaps.length-1){e.target.style.borderColor=C.accent;e.target.style.color=C.accent}}} onMouseLeave={e=>{e.target.style.borderColor=`${currentTheme.text}20`;e.target.style.color=chIdx>=chaps.length-1?`${currentTheme.text}30`:currentTheme.text}}>Next →</button>
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
