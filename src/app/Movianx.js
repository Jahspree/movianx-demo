'use client';
import { useState, useEffect, useRef } from "react";

// ── Cover Art ────────────────────────────────────────────────────────────────
const AshfordArt = ({h=200}) => (
  <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" style={{width:"100%",height:h,display:"block"}}>
    <defs>
      <radialGradient id="mG"><stop offset="0%" stopColor="#FFF5E0"/><stop offset="50%" stopColor="#FFE8B0"/><stop offset="100%" stopColor="transparent"/></radialGradient>
      <linearGradient id="sG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0a0e1a"/><stop offset="50%" stopColor="#151025"/><stop offset="100%" stopColor="#1a0f15"/></linearGradient>
    </defs>
    <rect width="600" height="400" fill="url(#sG)"/>
    {[[50,30],[120,55],[200,20],[280,45],[350,15],[420,60],[480,25],[530,50],[90,80],[160,70],[320,35],[440,75],[560,40]].map(([x,y],i)=>
      <circle key={i} cx={x} cy={y} r={0.8+i%3*0.5} fill={`rgba(255,240,220,${0.25+i%4*0.1})`}/>)}
    <circle cx="480" cy="70" r="35" fill="#0f0f1a"/><circle cx="485" cy="65" r="30" fill="url(#mG)" opacity="0.9"/>
    <path d="M180,380 L180,180 L200,170 L250,155 L300,145 L350,155 L400,170 L420,180 L420,380Z" fill="#0c0815"/>
    <path d="M120,380 L120,210 L140,200 L180,190 L180,380Z" fill="#0a0612"/>
    <path d="M420,380 L420,190 L460,200 L480,210 L480,380Z" fill="#0a0612"/>
    <path d="M180,180 L200,140 L220,180" fill="#08050f"/><path d="M250,155 L300,110 L350,155" fill="#08050f"/><path d="M380,170 L400,135 L420,170" fill="#08050f"/>
    <rect x="195" y="125" width="10" height="25" fill="#0a0612"/><rect x="395" y="120" width="10" height="25" fill="#0a0612"/>
    {[[195,200],[230,195],[270,185],[330,185],[370,195],[405,200],[145,230],[195,240],[230,235],[270,225],[330,225],[370,235],[405,240],[455,230]].map(([x,y],i)=>
      <rect key={i} x={x} y={y} width="16" height="22" rx="1" fill="rgba(15,10,25,0.7)" stroke="rgba(100,80,120,0.08)" strokeWidth="0.5"/>)}
    <rect x="292" y="175" width="18" height="25" rx="1.5" fill="rgba(255,200,100,0.15)" stroke="rgba(255,200,100,0.3)" strokeWidth="1"/>
    <ellipse cx="301" cy="187" rx="25" ry="20" fill="rgba(255,200,100,0.04)"/>
    <path d="M288,380 L288,300 Q300,288 312,300 L312,380" fill="rgba(8,5,12,0.8)"/>
    <g stroke="rgba(140,120,160,0.15)" strokeWidth="1.2" fill="none">
      {[55,65,75,85,95].map(x=><line key={x} x1={x} y1="380" x2={x} y2="260"/>)}
      <path d="M50,260 Q75,240 100,260"/><circle cx="75" cy="248" r="4"/>
      {[505,515,525,535,545].map(x=><line key={x} x1={x} y1="380" x2={x} y2="260"/>)}
      <path d="M500,260 Q525,240 550,260"/><circle cx="525" cy="248" r="4"/>
    </g>
    <ellipse cx="300" cy="390" rx="300" ry="30" fill="rgba(25,18,30,0.5)"/>
  </svg>
);
const SignalArt = ({h=200}) => (
  <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" style={{width:"100%",height:h,display:"block"}}>
    <defs><linearGradient id="spG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#040810"/><stop offset="50%" stopColor="#080c1a"/><stop offset="100%" stopColor="#0a0818"/></linearGradient></defs>
    <rect width="600" height="400" fill="url(#spG)"/>
    {[...Array(60)].map((_,i)=><circle key={i} cx={i*10+Math.sin(i)*20} cy={i*6+Math.cos(i)*30} r={0.5+i%3*0.5} fill={`rgba(180,200,255,${0.1+i%5*0.08})`}/>)}
    <circle cx="440" cy="200" r="80" fill="#060a18"/><ellipse cx="440" cy="200" rx="110" ry="14" fill="none" stroke="rgba(80,130,255,0.08)" strokeWidth="2" transform="rotate(-8 440 200)"/>
    <circle cx="440" cy="200" r="82" fill="none" stroke="rgba(60,100,200,0.06)" strokeWidth="3"/>
    <g transform="translate(120,220) rotate(-3)"><path d="M0,18 L20,8 L70,2 L180,12 L200,18 L180,24 L70,34 L20,28Z" fill="#0c1025" stroke="rgba(80,130,255,0.12)" strokeWidth="0.8"/><rect x="40" y="10" width="10" height="6" rx="1.5" fill="rgba(80,160,255,0.2)"/><rect x="100" y="11" width="50" height="14" rx="3" fill="rgba(60,100,200,0.08)"/><ellipse cx="-5" cy="18" rx="12" ry="8" fill="rgba(80,140,255,0.2)"/></g>
    {[50,75,100,130].map((r,i)=><circle key={i} cx="440" cy="200" r={r} fill="none" stroke={`rgba(80,140,255,${0.07-i*0.015})`} strokeWidth="0.8" strokeDasharray="5,10"/>)}
  </svg>
);
const ThornwoodArt = ({h=200}) => (
  <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" style={{width:"100%",height:h,display:"block"}}>
    <defs><linearGradient id="twS" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#12081a"/><stop offset="100%" stopColor="#1a0e22"/></linearGradient></defs>
    <rect width="600" height="400" fill="url(#twS)"/>
    {[...Array(20)].map((_,i)=><circle key={i} cx={i*30+10} cy={i*8+10} r={0.5+i%3*0.3} fill={`rgba(220,200,240,${0.1+i%4*0.05})`}/>)}
    <circle cx="500" cy="60" r="28" fill="rgba(200,180,220,0.06)" stroke="rgba(168,85,247,0.08)" strokeWidth="1"/>
    <path d="M180,380 L180,190 L210,175 L300,150 L390,175 L420,190 L420,380Z" fill="#0e0818"/>
    <path d="M210,175 L300,140 L390,175" fill="#0a0614"/>
    {[[220,210],[260,200],[340,200],[380,210],[260,250],[340,250]].map(([x,y],i)=>
      <rect key={i} x={x} y={y} width="18" height="24" rx="1" fill="rgba(255,200,120,0.05)" stroke="rgba(255,200,120,0.1)" strokeWidth="0.5"/>)}
    <path d="M290,380 L290,310 Q300,298 310,310 L310,380" fill="rgba(8,4,14,0.7)"/>
    <g stroke="rgba(168,85,247,0.12)" strokeWidth="1" fill="none">
      <path d="M60,400 Q80,350 100,330 Q130,300 160,290 Q180,270 180,250"/>
      <path d="M540,400 Q520,340 500,320 Q470,290 440,280 Q420,260 420,240"/>
    </g>
    {[[90,335],[160,275],[440,270],[510,325]].map(([x,y],i)=>
      <g key={i}><circle cx={x} cy={y} r="5" fill="rgba(200,50,80,0.3)"/><circle cx={x} cy={y} r="2.5" fill="rgba(200,50,80,0.15)"/></g>)}
  </svg>
);
const FireflyArt = ({h=200}) => (
  <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" style={{width:"100%",height:h,display:"block"}}>
    <defs>
      <linearGradient id="ffS" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2a3a1a"/><stop offset="40%" stopColor="#1a2a10"/><stop offset="100%" stopColor="#0f1a08"/></linearGradient>
      <radialGradient id="ffG"><stop offset="0%" stopColor="rgba(255,220,80,0.8)"/><stop offset="50%" stopColor="rgba(255,200,60,0.2)"/><stop offset="100%" stopColor="transparent"/></radialGradient>
    </defs>
    <rect width="600" height="400" fill="url(#ffS)"/>
    <g fill="#0a1505" opacity="0.9"><path d="M-20,400 L-20,100 Q20,50 60,100 L60,400Z"/><path d="M40,400 L40,120 Q80,60 120,120 L120,400Z"/><path d="M480,400 L480,100 Q520,40 560,100 L560,400Z"/><path d="M540,400 L540,130 Q580,70 620,130 L620,400Z"/><path d="M200,400 L200,160 Q230,100 260,160 L260,400Z" opacity="0.5"/><path d="M340,400 L340,150 Q370,85 400,150 L400,400Z" opacity="0.5"/></g>
    {[[150,120,10],[250,80,12],[350,100,8],[450,130,11],[180,200,7],[300,160,9],[420,190,8],[200,280,6],[380,250,10],[130,300,7],[480,280,8],[300,300,11]].map(([x,y,r],i)=>
      <g key={i}><circle cx={x} cy={y} r={r} fill="url(#ffG)" opacity={0.3+i%4*0.1}/><circle cx={x} cy={y} r={2} fill="rgba(255,230,100,0.9)"/><circle cx={x} cy={y} r={1} fill="#fff"/></g>)}
    <ellipse cx="300" cy="400" rx="320" ry="30" fill="rgba(15,25,8,0.8)"/>
  </svg>
);
const CV={ashford:AshfordArt,signal:SignalArt,thornwood:ThornwoodArt,firefly:FireflyArt};

// ── Data ─────────────────────────────────────────────────────────────────────
const CAT=[
  {id:"ashford",cv:"ashford",title:"The Vanishing at Ashford Manor",genre:"Mystery / Thriller",dur:"~8 min",br:3,en:2,rate:4.8,rd:"2.4K",st:"live",col:"#B91C1C",ac:"rgba(185,28,28,",cat:"adult",syn:"A locked room. A missing woman. A locket that shouldn't exist. Tonight at Ashford Manor, the truth is hunting for you.",tags:["Interactive","Choice-Driven","3 Immersion Levels"]},
  {id:"exodus",cv:"signal",title:"The Last Signal",genre:"Sci-Fi",dur:"~12 min",br:5,en:3,rate:null,rd:null,st:"coming",col:"#2563EB",ac:"rgba(37,99,235,",cat:"adult",syn:"Aboard the Meridian, you intercept a signal that hasn't been broadcast in 200 years.",tags:["Sci-Fi","Space","AI Narration"]},
  {id:"garden",cv:"thornwood",title:"The Thornwood Letters",genre:"Gothic Romance",dur:"~10 min",br:4,en:3,rate:null,rd:null,st:"coming",col:"#7C3AED",ac:"rgba(124,58,237,",cat:"adult",syn:"You inherit a crumbling estate and discover letters hidden in the walls.",tags:["Romance","Gothic","Historical"]},
  {id:"firefly",cv:"firefly",title:"Lumi and the Firefly Forest",genre:"Children's Adventure",dur:"~5 min",br:3,en:2,rate:4.9,rd:"5.1K",st:"coming",col:"#D97706",ac:"rgba(217,119,6,",cat:"kids",syn:"Help Lumi the fox find the lost fireflies before the forest goes dark!",tags:["Kids","Ages 4-8","Read Aloud"]},
];

const N={
  op:{t:"l",text:"The iron gates of Ashford Manor groaned as you pushed them open, rust flaking beneath your fingers like dried blood. The estate had been abandoned for eleven years — ever since the night Eleanor Ashford vanished from a locked room on the third floor.\n\nYou'd been hired by her daughter, Claire. \"They said she ran away,\" Claire told you. \"My mother would never leave without her locket. And that locket was found inside the locked room.\"\n\nThe gravel path crunched under your boots. Ahead, the manor loomed — three stories of Georgian stone, its windows dark as dead eyes. A single light flickered on the second floor.\n\nYou checked your watch. 9:47 PM. Fresh muddy footprints led around the side of the house.",nx:"c1"},
  c1:{t:"b",text:"The footprints are fresh — someone else is here tonight.",pr:"What do you do?",ch:[{id:"a",text:"Follow the muddy footprints around the house",to:"pf",pc:43},{id:"b",text:"Enter through the front door as planned",to:"pd",pc:57}]},
  pf:{t:"l",text:"You followed the footprints. The back door was ajar — light spilling across the threshold.\n\nThe air smelled chemical. Then a rhythmic scraping from the second floor study.",nx:"c2f"},
  pd:{t:"l",text:"On the marble floor, a note weighted by Eleanor's silver locket.\n\n\"You're looking in the wrong place. She didn't vanish. She was moved. — A Friend\"\n\nUpstairs, a door slammed.",nx:"c2d"},
  c2f:{t:"b",text:"Whoever made those footprints is in the study.",pr:"How do you proceed?",ch:[{id:"c",text:"Quietly climb the servants' staircase",to:"ps",pc:61},{id:"d",text:"Call out and announce yourself",to:"pa",pc:39}]},
  c2d:{t:"b",text:"Someone is upstairs, and they knew you were coming.",pr:"Your move?",ch:[{id:"e",text:"Go upstairs toward the sound",to:"pu",pc:68},{id:"f",text:"Search the ground floor first",to:"pg",pc:32}]},
  ps:{t:"l",text:"Behind the door: \"...the trust documents... before she finds out...\"\n\nThomas Ashford. Eleanor's husband. Missing eleven years.\n\n\"You're not supposed to be here yet,\" he said.",nx:"c3"},
  pa:{t:"l",text:"Thomas Ashford slammed into you on the landing.\n\n\"You fool,\" he hissed. \"Claire doesn't know what her mother really was.\"",nx:"c3"},
  pu:{t:"l",text:"Eleanor Ashford sat at her own desk. Alive. Here all along.\n\n\"I'll tell you everything — but promise me one thing first.\"",nx:"c3"},
  pg:{t:"l",text:"A hidden archive. A warm laptop. On screen: \"Project Ashford — Phase 3: The Vanishing.\"\n\nEleanor was extracted. Someone inside was running the operation.",nx:"c3"},
  c3:{t:"b",text:"The truth goes deeper than anyone suspects.",pr:"The final choice.",ch:[{id:"g",text:"Pursue the truth, no matter the cost",to:"et",pc:72},{id:"h",text:"Protect Claire from what you've discovered",to:"ep",pc:28}]},
  et:{t:"e",lb:"THE TRUTH",text:"Project Ashford — a Cold War extraction.\n\nClaire: \"She chose to let me believe she was gone.\"\n\nThree months later, Eleanor's locket arrived.\n\n\"Thank you for bringing her back. Even if part of me wishes you hadn't.\""},
  ep:{t:"e",lb:"THE PROTECTOR",text:"You gave Claire closure without cruelty.\n\nBut late at night, you studied the photo — Eleanor in Prague, alive.\n\nShe was still out there. Still watching."},
};

// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [pg, setPg] = useState("landing");
  const [sel, setSel] = useState(null);
  const [dF, setDF] = useState(false);
  const [tab, setTab] = useState("all");
  const [lvl, setLvl] = useState(1);

  // Reader state
  const [node, setNode] = useState("op");
  const [txt, setTxt] = useState("");
  const [rvl, setRvl] = useState(false);
  const [shC, setShC] = useState(false);
  const [cF, setCF] = useState(false);
  const [picks, setPicks] = useState([]);
  const [hist, setHist] = useState(["op"]);
  const [aud, setAud] = useState(false);
  const [stats, setStats] = useState(false);
  const [tm, setTm] = useState(0);
  const [end, setEnd] = useState(null);
  const [turning, setTurning] = useState(null);
  const [listening, setListening] = useState(false);
  const [voiceHint, setVoiceHint] = useState("");

  const tRef = useRef(null);
  const rRef = useRef(null);
  const tmRef = useRef(null);
  const lvlRef = useRef(lvl);
  const audioCtx = useRef(null);
  const ambientSrc = useRef(null);
  const ambientGain = useRef(null);
  const recRef = useRef(null);
  lvlRef.current = lvl;

  useEffect(() => {
    if (pg === "reading") tmRef.current = setInterval(() => setTm(t => t + 1), 1000);
    return () => clearInterval(tmRef.current);
  }, [pg]);

  // ── Ambient Audio Engine (Web Audio API — procedural, no loop seam) ──
  function initAudioCtx() {
    if (!audioCtx.current && typeof window !== "undefined") {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx.current;
  }

  function startAmbient(mood) {
    const ctx = initAudioCtx();
    if (!ctx) return;
    stopAmbient();
    // Create layered ambient drone — no loop, procedurally generated
    const dur = 120; // 2 minute buffer
    const sr = ctx.sampleRate;
    const buf = ctx.createBuffer(2, sr * dur, sr);
    const moods = {
      mystery: { base: 65, lfo: 0.08, depth: 15, noise: 0.012, filter: 280 },
      scifi: { base: 55, lfo: 0.05, depth: 20, noise: 0.015, filter: 350 },
      romance: { base: 80, lfo: 0.1, depth: 10, noise: 0.008, filter: 320 },
      kids: { base: 120, lfo: 0.15, depth: 8, noise: 0.005, filter: 450 },
    };
    const m = moods[mood] || moods.mystery;
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < d.length; i++) {
        const t = i / sr;
        const lfo = Math.sin(2 * Math.PI * m.lfo * t) * m.depth;
        const freq = m.base + lfo + (ch === 1 ? 1.5 : 0);
        const osc = Math.sin(2 * Math.PI * freq * t) * 0.12;
        const osc2 = Math.sin(2 * Math.PI * (freq * 1.5) * t) * 0.04;
        const osc3 = Math.sin(2 * Math.PI * (freq * 0.5) * t) * 0.06;
        const noise = (Math.random() * 2 - 1) * m.noise;
        // Slow volume swell to avoid seam if looped
        const env = Math.min(t / 4, 1) * Math.min((dur - t) / 8, 1);
        d[i] = (osc + osc2 + osc3 + noise) * env;
      }
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    // Crossfade loop: the 8-second fade-out at end meets the 4-second fade-in at start
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 3);
    // Low-pass filter for warmth
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = m.filter;
    filter.Q.value = 0.7;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();
    ambientSrc.current = src;
    ambientGain.current = gain;
  }

  function stopAmbient() {
    if (ambientGain.current && audioCtx.current) {
      try {
        ambientGain.current.gain.linearRampToValueAtTime(0, audioCtx.current.currentTime + 2);
        const s = ambientSrc.current;
        setTimeout(() => { try { s.stop(); } catch(e) {} }, 2500);
      } catch(e) {}
    }
    ambientSrc.current = null;
    ambientGain.current = null;
  }

  function getMood(storyId) {
    const m = { ashford: "mystery", exodus: "scifi", garden: "romance", firefly: "kids" };
    return m[storyId] || "mystery";
  }

  // ── TTS Narration (Web Speech — will be replaced with ElevenLabs) ──
  const voicesRef = useRef([]);
  const autoNarrate = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    function loadVoices() { voicesRef.current = window.speechSynthesis.getVoices(); }
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  function getVoice() {
    const v = voicesRef.current;
    return v.find(x => x.name.includes("Samantha"))
      || v.find(x => x.name.includes("Daniel"))
      || v.find(x => x.name.includes("Google UK English"))
      || v.find(x => x.lang && x.lang.startsWith("en"))
      || null;
  }

  function stopNarration() {
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    autoNarrate.current = false;
    setAud(false);
  }

  function speakText(text) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/\n+/g, ". ").replace(/[""]/g, '"').replace(/[—–]/g, ", ");
    const utt = new SpeechSynthesisUtterance(clean);
    utt.rate = 0.85; utt.pitch = 1.0; utt.volume = 1;
    const voice = getVoice();
    if (voice) utt.voice = voice;
    utt.onend = () => setAud(false);
    utt.onerror = () => setAud(false);
    window.speechSynthesis.speak(utt);
    setAud(true);
  }

  function toggleNarration() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (aud) { window.speechSynthesis.cancel(); autoNarrate.current = false; setAud(false); }
    else { autoNarrate.current = true; speakText(txt); }
  }

  // ── Voice Input (Web Speech Recognition for Immersive mode) ──
  function startVoiceInput(choices) {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setVoiceHint("Voice not supported in this browser"); return; }
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";
    recRef.current = rec;
    setListening(true);
    setVoiceHint("Listening...");
    rec.onresult = (e) => {
      const said = e.results[0][0].transcript.toLowerCase();
      setListening(false);
      setVoiceHint(`"${said}"`);
      // Match to closest choice
      let best = null, bestScore = 0;
      choices.forEach(c => {
        const words = c.text.toLowerCase().split(/\s+/);
        let score = 0;
        words.forEach(w => { if (said.includes(w)) score++; });
        // Also match by letter: "a", "b", "option a", "choice b", "first", "second"
        const idx = choices.indexOf(c);
        const letter = String.fromCharCode(97 + idx);
        if (said.includes(letter) || said.includes(`option ${letter}`)) score += 3;
        if (idx === 0 && (said.includes("first") || said.includes("follow"))) score += 2;
        if (idx === 1 && (said.includes("second") || said.includes("enter") || said.includes("front"))) score += 2;
        if (score > bestScore) { bestScore = score; best = c; }
      });
      if (best && bestScore > 0) {
        setTimeout(() => { setPicks(p => [...p, best.id]); goToNode(best.to); setVoiceHint(""); }, 800);
      } else {
        setVoiceHint("Didn't catch that — try again or tap a choice");
        setTimeout(() => setVoiceHint(""), 3000);
      }
    };
    rec.onerror = () => { setListening(false); setVoiceHint("Couldn't hear — tap a choice instead"); setTimeout(() => setVoiceHint(""), 3000); };
    rec.onend = () => setListening(false);
    rec.start();
  }

  function stopVoiceInput() {
    if (recRef.current) { try { recRef.current.stop(); } catch(e) {} }
    setListening(false);
  }

  // ── Core reveal ──
  function revealText(text, nodeId) {
    stopNarration();
    const currentLvl = lvlRef.current;
    if (currentLvl === 0) {
      setTxt(text); setRvl(false);
      setTimeout(() => { setShC(true); setTimeout(() => setCF(true), 60); }, 300);
      return;
    }
    setTxt(""); setRvl(true); setShC(false); setCF(false);
    let i = 0;
    const sp = currentLvl === 2 ? 25 : 20;
    const go = () => {
      if (i < text.length) {
        i++; setTxt(text.slice(0, i));
        const c = text[i - 1]; let d = sp;
        if (".!?".includes(c)) d = sp * 7;
        else if (",;".includes(c)) d = sp * 3;
        else if (c === "\n") d = sp * 9;
        rRef.current = setTimeout(go, d);
      } else {
        setRvl(false);
        if (autoNarrate.current) setTimeout(() => speakText(text), 300);
        const nd = N[nodeId];
        if (nd && (nd.t === "b" || nd.nx)) {
          setTimeout(() => {
            setShC(true); setTimeout(() => setCF(true), 60);
            // Auto-start voice input in immersive mode for branch nodes
            if (currentLvl === 2 && nd.t === "b") {
              setTimeout(() => startVoiceInput(nd.ch), 500);
            }
          }, 700);
        }
        if (nd && nd.t === "e") setEnd(nd.lb);
      }
    };
    setTimeout(go, 200);
  }

  function skip() {
    clearTimeout(rRef.current); stopNarration();
    const nd = N[node];
    const full = nd.t === "b" ? nd.text + "\n\n" + nd.pr : nd.text;
    setTxt(full); setRvl(false);
    if (nd.t === "b" || nd.nx) setTimeout(() => { setShC(true); setTimeout(() => setCF(true), 60); }, 150);
    if (nd.t === "e") setEnd(nd.lb);
  }

  function goToNode(id) {
    clearTimeout(rRef.current); stopNarration(); stopVoiceInput();
    setTurning("forward");
    setTimeout(() => {
      setNode(id); setHist(p => [...p, id]); setShC(false); setCF(false); setEnd(null);
      if (tRef.current) tRef.current.scrollTop = 0;
      setTurning(null);
      const nd = N[id];
      const full = nd.t === "b" ? nd.text + "\n\n" + nd.pr : nd.text;
      setTimeout(() => revealText(full, id), 100);
    }, 500);
  }

  function goBack() {
    if (hist.length <= 1) return;
    clearTimeout(rRef.current); stopNarration(); stopVoiceInput();
    setTurning("back");
    setTimeout(() => {
      const nh = hist.slice(0, -1); const pid = nh[nh.length - 1];
      setHist(nh); setNode(pid); setShC(false); setCF(false); setEnd(null); setRvl(false);
      if (tRef.current) tRef.current.scrollTop = 0;
      setTurning(null);
      const nd = N[pid];
      const full = nd.t === "b" ? nd.text + "\n\n" + nd.pr : nd.text;
      if (lvlRef.current === 0) { setTxt(full); setTimeout(() => { setShC(true); setTimeout(() => setCF(true), 60); }, 200); }
      else setTimeout(() => revealText(full, pid), 100);
    }, 500);
  }

  function openStory(s) { setSel(s); setPg("detail"); setTimeout(() => setDF(true), 50); }

  function startReading() {
    setDF(false);
    setNode("op"); setTxt(""); setRvl(false); setShC(false); setCF(false);
    setPicks([]); setHist(["op"]); setTm(0); setEnd(null);
    const sId = sel ? sel.id : "ashford";
    setTimeout(() => {
      setPg("reading");
      startAmbient(getMood(sId));
      setTimeout(() => revealText(N["op"].text, "op"), 50);
    }, 400);
  }

  function goHome() {
    clearTimeout(rRef.current); stopNarration(); stopAmbient(); stopVoiceInput();
    setNode("op"); setTxt(""); setRvl(false); setShC(false); setCF(false);
    setPicks([]); setHist(["op"]); setTm(0); setEnd(null);
    setPg("landing"); setDF(false); setSel(null);
  }

  const fmt = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const LN = ["READER", "CINEMATIC", "IMMERSIVE"];
  const LI = ["📖", "🎬", "🌙"];
  const nd = N[node];
  const filtered = tab === "all" ? CAT : CAT.filter(s => s.cat === tab);


  // ═══════════ LANDING ═══════════
  if (pg === "landing") {
    return (
      <div style={{ width: "100%", minHeight: "100vh", background: "#000", fontFamily: "'Inter',system-ui,-apple-system,sans-serif", overflow: "hidden", position: "relative" }}>
        <style>{CSS}</style>
        <div className="mx-bg" style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <div className="mx-bg1" style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 50%, rgba(120,40,200,0.15), transparent 60%)" }} />
          <div className="mx-bg2" style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 30%, rgba(200,60,80,0.1), transparent 50%)" }} />
          <div className="mx-bg3" style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 80%, rgba(40,100,200,0.12), transparent 55%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
        </div>
        <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px" }}>
            <h1 style={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.18em", color: "#fff", margin: 0 }}>MOVIANX</h1>
            <button style={{ padding: "6px 16px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 500, cursor: "pointer", backdropFilter: "blur(8px)" }}>Sign In</button>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 24px" }}>
            <div className="mx-u1" style={{ textAlign: "center", marginBottom: 48 }}>
              <h2 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.03em" }}>What do you want<br/>to experience?</h2>
            </div>
            {/* 3 large squares side by side */}
            <div style={{ display: "flex", gap: 16, width: "100%", maxWidth: 720, justifyContent: "center" }}>
              {[
                { icon: "📖", label: "Stories", sub: "Interactive fiction", live: true },
                { icon: "🎬", label: "Cinema", sub: "Coming soon", live: false },
                { icon: "✦", label: "Artists", sub: "Coming soon", live: false },
              ].map((c, i) => (
                <button key={i} onClick={c.live ? () => setPg("home") : undefined} className="mx-exp" style={{
                  flex: 1, maxWidth: 220, aspectRatio: "1", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 10,
                  background: "rgba(255,255,255,0.95)", border: "none", borderRadius: 20,
                  cursor: c.live ? "pointer" : "default", opacity: c.live ? 1 : 0.4,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
                }}>
                  <span style={{ fontSize: 36 }}>{c.icon}</span>
                  <span style={{ fontSize: 17, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.01em" }}>{c.label}</span>
                  <span style={{ fontSize: 11, color: c.live ? "#888" : "#bbb", fontWeight: 500 }}>{c.sub}</span>
                </button>
              ))}
            </div>
          </div>
          <div style={{ padding: "28px 24px 36px", textAlign: "center" }}>
            <div style={{ width: 24, height: 1, background: "rgba(255,255,255,0.08)", margin: "0 auto 14px" }} />
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 10 }}>Have a story the world needs to experience?</p>
            <button className="mx-btn" style={{ padding: "8px 22px", background: "transparent", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 20, color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Sign Up as a Creator →</button>
          </div>
        </div>
      </div>
    );
  }


  // ═══════════ HOME ═══════════
  if (pg === "home") {
    const HC = CV["ashford"];
    return (
      <div style={{ width: "100%", minHeight: "100vh", background: "#FAFAF8", fontFamily: "'Inter',system-ui,sans-serif" }}>
        <style>{CSS}</style>
        <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(250,250,248,0.88)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => setPg("landing")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 11L5 7l4-4" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "0.14em", color: "#1a1a1a" }}>MOVIANX</span>
            </button>
            <button style={{ padding: "7px 16px", background: "#1a1a1a", border: "none", borderRadius: 10, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Sign In</button>
          </div>
        </nav>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px 12px" }}>
          <div className="mx-card" onClick={() => openStory(CAT[0])} style={{ position: "relative", borderRadius: 16, overflow: "hidden", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
            <HC h={280} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 50%,transparent 100%)" }} />
            <div style={{ position: "absolute", inset: 0, padding: "24px 20px", display: "flex", flexDirection: "column", justifyContent: "flex-end", zIndex: 2 }} className="mx-u1">
              <div style={{ display: "inline-flex", padding: "3px 10px", background: "rgba(185,28,28,0.2)", borderRadius: 5, fontSize: 10, color: "#f87171", fontWeight: 600, marginBottom: 8, alignSelf: "flex-start" }}>✨ FEATURED</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 6, maxWidth: 300 }}>The Vanishing at Ashford Manor</h2>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.5, marginBottom: 10, maxWidth: 280 }}>A locked room mystery. Your choices shape the ending.</p>
              <div style={{ display: "flex", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 12 }}><span style={{ color: "#f87171", fontWeight: 700 }}>★ 4.8</span><span>·</span><span>2.4K readers</span></div>
              <button onClick={e => { e.stopPropagation(); openStory(CAT[0]); }} className="mx-btn" style={{ alignSelf: "flex-start", padding: "8px 20px", background: "#fff", border: "none", borderRadius: 10, color: "#1a1a1a", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>▶ Start Reading</button>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 16px 0" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>{[{ id: "all", l: "All" }, { id: "adult", l: "Adult" }, { id: "kids", l: "Children's" }].map(t =>
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "6px 14px", background: tab === t.id ? "#1a1a1a" : "transparent", border: tab === t.id ? "none" : "1px solid rgba(0,0,0,0.08)", borderRadius: 10, color: tab === t.id ? "#fff" : "#777", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{t.l}</button>
          )}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 12 }}>
            {filtered.map(s => { const C = CV[s.cv]; return (
              <button key={s.id} onClick={() => openStory(s)} className="mx-card" style={{ position: "relative", overflow: "hidden", cursor: "pointer", textAlign: "left", padding: 0, border: "none", borderRadius: 14, display: "flex", flexDirection: "column", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div style={{ position: "relative", overflow: "hidden", borderRadius: "14px 14px 0 0" }}><C h={170} />
                  {s.st === "coming" && <div style={{ position: "absolute", top: 8, right: 8, padding: "2px 7px", background: "rgba(0,0,0,0.55)", borderRadius: 5, fontSize: 9, color: "#fff", fontWeight: 600 }}>COMING SOON</div>}
                  {s.cat === "kids" && <div style={{ position: "absolute", top: 8, left: 8, padding: "2px 7px", background: "rgba(217,119,6,0.9)", borderRadius: 5, fontSize: 9, color: "#fff", fontWeight: 600 }}>KIDS</div>}
                </div>
                <div style={{ padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: s.col, fontWeight: 600, marginBottom: 2 }}>{s.genre}</div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3, marginBottom: 4 }}>{s.title}</h4>
                  <div style={{ display: "flex", gap: 6, fontSize: 10, color: "#999" }}>{s.rate && <span style={{ color: s.col, fontWeight: 600 }}>★ {s.rate}</span>}<span>{s.dur}</span></div>
                </div>
              </button>
            ); })}
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 16px 20px", textAlign: "center" }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1a1a1a", marginBottom: 18 }}>A New Way to Experience Stories</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
            {[{ i: "📚", t: "Upload & Transform", d: "Authors upload. AI creates branches." }, { i: "🎧", t: "3 Immersion Levels", d: "Reader, cinematic, full immersion." }, { i: "📕", t: "Collector's Editions", d: "Beautiful hardcovers delivered." }, { i: "🔴", t: "Live Events", d: "Live read-alongs and events." }].map(h =>
              <div key={h.t} style={{ padding: "16px 12px", background: "#fff", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{h.i}</div><div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 3 }}>{h.t}</div><div style={{ fontSize: 11, color: "#888", lineHeight: 1.4 }}>{h.d}</div>
              </div>)}
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 16px 36px" }}>
          <div style={{ background: "#1a1a1a", borderRadius: 16, padding: "28px 20px", textAlign: "center" }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Are You a Storyteller?</h3>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>Upload your book. AI transforms it. Earn from digital reads and book sales.</p>
            <button className="mx-btn" style={{ padding: "9px 24px", background: "#fff", border: "none", borderRadius: 10, color: "#1a1a1a", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Join as a Creator →</button>
          </div>
        </div>
      </div>
    );
  }


  // ═══════════ DETAIL ═══════════
  if (pg === "detail" && sel) {
    const s = sel; const C = CV[s.cv]; const live = s.st === "live";
    const isLiveEvent = false; // Set to true when author is actively streaming
    return (
      <div style={{ width: "100%", minHeight: "100vh", background: "#FAFAF8", fontFamily: "'Inter',system-ui,sans-serif" }}><style>{CSS}</style>
        <div style={{ opacity: dF ? 1 : 0, transition: "opacity 0.4s" }}>
          <button onClick={() => { setPg("home"); setDF(false); setSel(null); }} style={{ background: "none", border: "none", color: "#888", fontSize: 13, cursor: "pointer", padding: "12px 20px", fontWeight: 500 }}>← Back</button>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px 40px" }}>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <div style={{ width: 300, flexShrink: 0, borderRadius: 14, overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}><C h={400} /></div>
              <div style={{ flex: 1, minWidth: 260, paddingTop: 4 }}>
                <div style={{ fontSize: 11, color: s.col, fontWeight: 700, marginBottom: 4 }}>{s.genre.toUpperCase()}</div>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", lineHeight: 1.2, marginBottom: 8 }}>{s.title}</h2>
                <div style={{ display: "flex", gap: 8, fontSize: 12, color: "#888", marginBottom: 14, flexWrap: "wrap" }}>{s.rate && <span style={{ color: s.col, fontWeight: 700 }}>★ {s.rate}</span>}{s.rd && <span>{s.rd} readers</span>}<span>{s.dur}</span><span>{s.br} branches</span><span>{s.en} endings</span></div>
                <p style={{ fontSize: 14, color: "#555", lineHeight: 1.65, marginBottom: 14 }}>{s.syn}</p>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 20 }}>{s.tags.map(t => <span key={t} style={{ padding: "3px 10px", background: "rgba(0,0,0,0.04)", borderRadius: 6, fontSize: 11, color: "#666", fontWeight: 500 }}>{t}</span>)}</div>
                {live ? <>
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", marginBottom: 8, letterSpacing: "0.05em" }}>IMMERSION LEVEL</div>
                    <div style={{ display: "flex", gap: 6 }}>{[
                      { l: 0, n: "Reader", d: "Text only, tap to advance" },
                      { l: 1, n: "Cinematic", d: "Typewriter reveal, click choices" },
                      { l: 2, n: "Immersive", d: "Audio narration, speak your choices" },
                    ].map(o => <button key={o.l} onClick={() => setLvl(o.l)} className="mx-btn" style={{ flex: 1, padding: "10px 6px", background: lvl === o.l ? "#1a1a1a" : "#fff", border: `1px solid ${lvl === o.l ? "#1a1a1a" : "rgba(0,0,0,0.08)"}`, borderRadius: 10, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: lvl === o.l ? "#fff" : "#666" }}><span style={{ fontSize: 18 }}>{LI[o.l]}</span><span style={{ fontSize: 9, fontWeight: 700 }}>{o.n}</span><span style={{ fontSize: 8, color: lvl === o.l ? "rgba(255,255,255,0.5)" : "#aaa", lineHeight: 1.3 }}>{o.d}</span></button>)}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={startReading} className="mx-btn" style={{ display: "flex", alignItems: "center", gap: 5, padding: "10px 22px", background: "#1a1a1a", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>▶ Begin Story</button>
                    <button className="mx-btn" style={{ padding: "10px 16px", background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 10, color: "#555", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>📕 Get the Book</button>
                    <button disabled={!isLiveEvent} className="mx-btn" style={{ padding: "10px 16px", background: isLiveEvent ? "#fff" : "#f5f5f5", border: `1px solid ${isLiveEvent ? "rgba(239,68,68,0.3)" : "rgba(0,0,0,0.06)"}`, borderRadius: 10, color: isLiveEvent ? "#ef4444" : "#ccc", fontSize: 12, fontWeight: 600, cursor: isLiveEvent ? "pointer" : "default" }}>{isLiveEvent ? "🔴 Join Live" : "○ Live Event"}</button>
                  </div>
                </> : <div style={{ padding: "18px", background: "#fff", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>🔔</div><div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Coming Soon</div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}><button className="mx-btn" style={{ padding: "7px 16px", background: "#1a1a1a", border: "none", borderRadius: 8, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Notify Me</button><button className="mx-btn" style={{ padding: "7px 16px", background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8, color: "#555", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>📕 Pre-order Book</button></div>
                </div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // ═══════════ READING ═══════════
  const s = sel || CAT[0];
  const isKids = s.cat === "kids";
  const paper = isKids ? "#FFF8EC" : "#F5F0E8";
  const ink = isKids ? "#3D2B1F" : "#2C2420";
  const inkSoft = isKids ? "rgba(61,43,31," : "rgba(44,36,32,";
  const paragraphs = txt.split("\n");
  const isFirst = node === "op";
  const pageNum = hist.length;

  return (
    <div style={{ width: "100%", height: "100vh", background: "#E8E0D4", fontFamily: "'Inter',sans-serif", overflow: "hidden", display: "flex", flexDirection: "column" }}><style>{CSS}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 16px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={goHome} style={{ background: "rgba(0,0,0,0.04)", border: "none", borderRadius: 6, color: "#8B7E74", cursor: "pointer", padding: "5px 7px", display: "flex" }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 7l5-5 5 5M3 6.5V12h3V9h2v3h3V6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button onClick={goBack} disabled={hist.length <= 1} style={{ background: "rgba(0,0,0,0.04)", border: "none", borderRadius: 6, color: "#8B7E74", cursor: hist.length > 1 ? "pointer" : "default", padding: "5px 7px", display: "flex", opacity: hist.length > 1 ? 1 : 0.3 }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: "#B5A99A" }}>MOVIANX</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "monospace", fontSize: 9, color: "#B5A99A" }}>{fmt(tm)}</span>
          <div style={{ padding: "2px 7px", background: `${s.ac}0.06)`, borderRadius: 4, fontSize: 9, color: s.col, fontWeight: 600 }}>{LI[lvl]}</div>
        </div>
      </div>

      {/* Audio controls for immersive/cinematic */}
      {lvl >= 1 && <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 16px 6px", flexShrink: 0 }}>
        <button onClick={toggleNarration} style={{ width: 24, height: 24, borderRadius: "50%", background: `${s.ac}0.08)`, border: `1px solid ${s.ac}0.15)`, color: s.col, fontSize: 9, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{aud ? "⏸" : "▶"}</button>
        <div style={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1, height: 20, overflow: "hidden" }}>{[...Array(50)].map((_, i) => <div key={i} className={aud ? "mx-wa" : ""} style={{ width: 1.5, background: `${s.ac}0.15)`, borderRadius: 1, flexShrink: 0, height: `${3 + (i % 8) * 2}px`, animationDelay: `${i * 0.035}s` }} />)}</div>
        <span style={{ fontSize: 8, color: "#B5A99A", fontFamily: "monospace" }}>{aud ? "Reading aloud..." : "Tap ▶ to listen"}</span>
      </div>}

      {/* THE BOOK */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "stretch", padding: "4px 12px 12px", overflow: "hidden", perspective: 2000 }}>
        <div className={turning === "forward" ? "mx-page-fwd" : turning === "back" ? "mx-page-back" : ""} style={{
          width: "100%", maxWidth: 680, position: "relative", display: "flex", flexDirection: "column",
          background: paper, borderRadius: "3px 8px 8px 3px", transformOrigin: "left center",
          boxShadow: "inset 2px 0 8px rgba(0,0,0,0.06), 4px 4px 16px rgba(0,0,0,0.12), 8px 8px 32px rgba(0,0,0,0.08)",
        }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: "linear-gradient(90deg, rgba(0,0,0,0.08), transparent)", borderRadius: "3px 0 0 3px", pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 8, bottom: 8, width: 3, background: "repeating-linear-gradient(180deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 3px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "3px 8px 8px 3px", opacity: 0.3, background: "repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(0,0,0,0.01) 28px, rgba(0,0,0,0.01) 29px)", pointerEvents: "none" }} />

          <div style={{ height: 2, margin: "0 20px", flexShrink: 0 }}><div style={{ height: "100%", background: s.col, transition: "width 0.8s", width: `${Math.min((hist.length / 7) * 100, 100)}%`, opacity: 0.3, borderRadius: 1 }} /></div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 28px 0", flexShrink: 0 }}>
            <span style={{ fontSize: 8, letterSpacing: "0.15em", color: `${inkSoft}0.2)`, fontFamily: "'Literata',Georgia,serif", fontStyle: "italic" }}>{s.title}</span>
            <span style={{ fontSize: 8, color: `${inkSoft}0.18)`, fontFamily: "'Literata',Georgia,serif" }}>{pageNum}</span>
          </div>

          <div ref={tRef} onClick={rvl ? skip : undefined} style={{ flex: 1, overflow: "auto", padding: "8px 26px 36px 30px", cursor: rvl ? "pointer" : "default" }}>
            {isFirst && <div style={{ textAlign: "center", marginBottom: 14, paddingTop: 4 }}>
              <div style={{ fontSize: 8, letterSpacing: "0.3em", color: `${inkSoft}0.3)`, fontWeight: 600, marginBottom: 5 }}>CHAPTER I</div>
              <div style={{ width: 24, height: 1, background: `${inkSoft}0.1)`, margin: "0 auto" }} />
            </div>}

            {paragraphs.map((p, i) => {
              if (i === 0 && isFirst && p.length > 1 && lvl !== 2) {
                return <p key={i} style={{ fontFamily: "'Literata',Georgia,serif", fontSize: 14, lineHeight: 1.7, color: ink, marginBottom: 6, textAlign: "justify" }}>
                  <span style={{ float: "left", fontSize: 40, lineHeight: "32px", fontWeight: 500, color: s.col, marginRight: 4, marginTop: 2, opacity: 0.7 }}>{p[0]}</span>{p.slice(1)}
                </p>;
              }
              return <p key={i} style={{ fontFamily: "'Literata',Georgia,serif", fontSize: 14, lineHeight: 1.7, color: ink, marginBottom: 6, textAlign: "justify", textIndent: i > 0 && p.length > 0 ? 20 : 0 }}>{p}</p>;
            })}
            {rvl && lvl >= 1 && <span className="mx-cur" style={{ display: "inline-block", width: 2, height: 16, background: s.col }} />}
            {rvl && lvl > 0 && <div style={{ textAlign: "center", marginTop: 10, fontSize: 8, color: `${inkSoft}0.18)`, fontStyle: "italic" }}>tap to skip</div>}

            {/* Branch choices */}
            {shC && nd.t === "b" && <div style={{ marginTop: 18, opacity: cF ? 1 : 0, transition: "opacity 0.5s" }}>
              <div style={{ textAlign: "center", marginBottom: 10 }}>
                <div style={{ width: 20, height: 1, background: `${inkSoft}0.1)`, margin: "0 auto 5px" }} />
                <span style={{ fontSize: 9, fontStyle: "italic", color: `${inkSoft}0.3)`, fontFamily: "'Literata',Georgia,serif" }}>
                  {lvl === 2 ? "Speak your choice or tap below" : "What will you do?"}
                </span>
              </div>

              {/* Voice input indicator for immersive mode */}
              {lvl === 2 && <div style={{ textAlign: "center", marginBottom: 10 }}>
                {listening ? (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: `${s.ac}0.08)`, borderRadius: 20 }}>
                    <div className="mx-mic" style={{ width: 8, height: 8, borderRadius: "50%", background: s.col }} />
                    <span style={{ fontSize: 10, color: s.col, fontWeight: 600 }}>Listening...</span>
                  </div>
                ) : (
                  <button onClick={() => startVoiceInput(nd.ch)} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 14px", background: `${s.ac}0.06)`, border: `1px solid ${s.ac}0.12)`, borderRadius: 20, cursor: "pointer", color: s.col, fontSize: 10, fontWeight: 600 }}>
                    🎤 Tap to speak
                  </button>
                )}
                {voiceHint && <div style={{ fontSize: 9, color: `${inkSoft}0.35)`, marginTop: 4, fontStyle: "italic" }}>{voiceHint}</div>}
              </div>}

              {nd.ch.map((c, i) => <button key={c.id} onClick={(e) => { e.stopPropagation(); setPicks(p => [...p, c.id]); goToNode(c.to); }} className="mx-ch" style={{
                display: "block", width: "100%", padding: "10px 12px", marginBottom: 5,
                background: "rgba(255,255,255,0.4)", border: `1px solid ${inkSoft}0.07)`, borderRadius: 6,
                color: ink, textAlign: "left", cursor: "pointer",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: 5, fontSize: 9, fontWeight: 700, background: `${s.ac}0.08)`, color: s.col, flexShrink: 0 }}>{String.fromCharCode(65 + i)}</span>
                  <span style={{ fontSize: 13, lineHeight: 1.45, fontWeight: 500, fontFamily: "'Literata',Georgia,serif" }}>{c.text}</span>
                </div>
              </button>)}
              {lvl >= 1 && <button onClick={() => setStats(!stats)} style={{ background: "none", border: "none", color: `${inkSoft}0.2)`, fontSize: 8, cursor: "pointer", padding: "4px 0", fontStyle: "italic", width: "100%", textAlign: "center" }}>{stats ? "hide" : "show"} what others chose</button>}
            </div>}

            {shC && nd.t === "l" && nd.nx && <div style={{ textAlign: "center", marginTop: 16 }}>
              <button onClick={(e) => { e.stopPropagation(); const nx = N[node].nx; if (nx) goToNode(nx); }} className="mx-btn" style={{
                padding: "8px 24px", background: "rgba(255,255,255,0.5)", border: `1px solid ${inkSoft}0.1)`,
                borderRadius: 6, color: ink, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'Literata',Georgia,serif", fontStyle: "italic",
              }}>turn the page →</button>
            </div>}

            {end && !rvl && <div className="mx-end" style={{ marginTop: 32, textAlign: "center", paddingTop: 20 }}>
              <div style={{ width: 30, height: 1, background: `${inkSoft}0.1)`, margin: "0 auto 12px" }} />
              <div style={{ fontSize: 8, letterSpacing: "0.25em", color: `${inkSoft}0.25)`, fontWeight: 600, marginBottom: 6 }}>ENDING</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.col, marginBottom: 18, fontFamily: "'Literata',Georgia,serif", fontStyle: "italic" }}>{end}</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 16 }}>
                {[[picks.length, "choices"], [hist.length, "pages"], [fmt(tm), "time"]].map(([v, l]) => <div key={l}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: ink }}>{v}</div>
                  <div style={{ fontSize: 8, color: `${inkSoft}0.3)`, marginTop: 1 }}>{l}</div>
                </div>)}
              </div>
              <div style={{ fontSize: 11, color: `${inkSoft}0.3)`, marginBottom: 16, fontStyle: "italic" }}>You discovered 1 of 2 endings</div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={goHome} className="mx-btn" style={{ padding: "8px 20px", background: "#1a1a1a", border: "none", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>↺ More Stories</button>
                <button className="mx-btn" style={{ padding: "8px 20px", background: "rgba(255,255,255,0.5)", border: `1px solid ${inkSoft}0.1)`, borderRadius: 8, color: ink, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>📕 Get the Book</button>
              </div>
            </div>}
          </div>
          <div style={{ display: "flex", justifyContent: "center", padding: "0 28px 8px", flexShrink: 0 }}><div style={{ width: 16, height: 1, background: `${inkSoft}0.06)` }} /></div>
        </div>
      </div>
    </div>
  );
}


const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,500;1,7..72,400;1,7..72,500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
.mx-u1{animation:mx-su .6s ease-out .1s both}
@keyframes mx-su{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.mx-btn{transition:all .2s ease!important}.mx-btn:hover{transform:translateY(-1px)!important;box-shadow:0 4px 12px rgba(0,0,0,.1)!important}
.mx-card{transition:all .3s ease!important}.mx-card:hover{transform:translateY(-4px)!important;box-shadow:0 8px 30px rgba(0,0,0,.12)!important}
.mx-ch{transition:all .2s ease!important}.mx-ch:hover{transform:translateX(3px)!important;box-shadow:0 1px 6px rgba(0,0,0,.05)!important}
.mx-cur{animation:mx-bk .7s step-end infinite}
@keyframes mx-bk{0%,50%{opacity:1}51%,100%{opacity:0}}
.mx-wa{animation:mx-wv .5s ease-in-out infinite alternate}
@keyframes mx-wv{from{transform:scaleY(.3)}to{transform:scaleY(1)}}
.mx-end{animation:mx-er .8s ease-out}
@keyframes mx-er{0%{opacity:0;transform:scale(.97)}100%{opacity:1;transform:scale(1)}}
.mx-bg1{animation:mx-drift1 8s ease-in-out infinite alternate}
.mx-bg2{animation:mx-drift2 10s ease-in-out infinite alternate}
.mx-bg3{animation:mx-drift3 12s ease-in-out infinite alternate}
@keyframes mx-drift1{0%{transform:translate(0,0) scale(1)}100%{transform:translate(30px,-20px) scale(1.1)}}
@keyframes mx-drift2{0%{transform:translate(0,0) scale(1)}100%{transform:translate(-20px,30px) scale(1.05)}}
@keyframes mx-drift3{0%{transform:translate(0,0) scale(1)}100%{transform:translate(15px,15px) scale(1.15)}}
.mx-exp{transition:all .25s ease!important}.mx-exp:hover{transform:translateY(-4px)!important;box-shadow:0 8px 32px rgba(0,0,0,.25)!important}
.mx-page-fwd{animation:mx-pf .6s cubic-bezier(0.4,0,0.2,1)}
@keyframes mx-pf{
  0%{transform:perspective(1200px) rotateY(0deg) scale(1);opacity:1;filter:brightness(1)}
  15%{transform:perspective(1200px) rotateY(-3deg) scale(1.01);filter:brightness(0.98)}
  35%{transform:perspective(1200px) rotateY(-15deg) translateX(-8px) scale(0.98);opacity:0.6;filter:brightness(0.92)}
  50%{transform:perspective(1200px) rotateY(-22deg) translateX(-14px) scale(0.96);opacity:0;filter:brightness(0.88)}
  51%{transform:perspective(1200px) rotateY(10deg) translateX(6px) scale(0.98);opacity:0;filter:brightness(0.95)}
  70%{transform:perspective(1200px) rotateY(4deg) translateX(3px) scale(0.99);opacity:0.7;filter:brightness(0.98)}
  85%{transform:perspective(1200px) rotateY(1deg) scale(1);opacity:0.9;filter:brightness(1)}
  100%{transform:perspective(1200px) rotateY(0deg) scale(1);opacity:1;filter:brightness(1)}
}
.mx-page-back{animation:mx-pb .6s cubic-bezier(0.4,0,0.2,1)}
@keyframes mx-pb{
  0%{transform:perspective(1200px) rotateY(0deg) scale(1);opacity:1}
  35%{transform:perspective(1200px) rotateY(15deg) translateX(8px) scale(0.98);opacity:0.6}
  50%{transform:perspective(1200px) rotateY(22deg) translateX(14px) scale(0.96);opacity:0}
  51%{transform:perspective(1200px) rotateY(-10deg) translateX(-6px) scale(0.98);opacity:0}
  70%{transform:perspective(1200px) rotateY(-4deg) scale(0.99);opacity:0.7}
  100%{transform:perspective(1200px) rotateY(0deg) scale(1);opacity:1}
}
.mx-mic{animation:mx-pulse 1s ease-in-out infinite}
@keyframes mx-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.3)}}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(0,0,0,.06);border-radius:3px}
`;
