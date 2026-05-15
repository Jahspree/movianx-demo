"use client";

function getViewOpacity(transitionState) {
  return transitionState === "idle" ? 1 : 0;
}

function getViewTransition(transitionState) {
  return {
    opacity: getViewOpacity(transitionState),
    transition: "opacity 0.42s ease",
    willChange: "opacity",
    pointerEvents: transitionState === "idle" ? "auto" : "none",
  };
}

function getEntryAnimation(transitionState, animation) {
  return transitionState === "idle" ? animation : "none";
}

function openCreatorDashboard() {
  window.location.href = "/dashboard";
}

function openWatchLibrary() {
  window.location.href = "/watch";
}

const LANDING_FEATURE_TAGS = [
  "AI Directed Experiences",
  "Immersive Audio",
  "Creator Upload Platform",
  "Cinematic Enhancement",
  "AI Scene Analysis",
  "Interactive Media",
];

const LANDING_MOVIE_PREVIEWS = [
  ["Night of the Living Dead", "Public Domain Horror", "#b51f2a"],
  ["Nosferatu", "Immersive Ready", "#9ca3af"],
  ["A Trip to the Moon", "Experimental Immersive", "#d6a33a"],
];

const LANDING_SUPPORT_CARDS = [
  [
    "Built for directors",
    "A creator-first AI media platform for directors, filmmakers, storytellers, artists, and creators shaping cinematic work.",
  ],
  [
    "Secure creator pipeline",
    "Upload and manage media through a private review flow designed for premium films, video, and immersive content.",
  ],
  [
    "Intelligent enhancement",
    "Use immersive audio, AI-assisted enhancement, and intelligent media analysis to prepare experiences for the next screen.",
  ],
];

const landingCinematicCSS = `
  .movianx-landing-shell{
    height:100vh;
    overflow-y:auto;
    background:
      radial-gradient(circle at 50% 18%, rgba(255,255,255,0.14), transparent 18%),
      radial-gradient(circle at 18% 28%, rgba(139,26,26,0.28), transparent 26%),
      radial-gradient(circle at 82% 30%, rgba(184,134,11,0.14), transparent 24%),
      linear-gradient(135deg,#050507 0%,#111116 42%,#170808 100%);
    background-size:180% 180%,140% 140%,130% 130%,100% 100%;
    animation:cinematicAtmosphere 18s ease-in-out infinite;
    display:flex;
    flex-direction:column;
    align-items:center;
    padding:20px;
    position:relative;
    isolation:isolate;
  }
  .movianx-landing-shell:before{
    content:"";
    position:absolute;
    inset:0;
    pointer-events:none;
    background:
      linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.06) 48%,transparent 54%),
      radial-gradient(ellipse at center,transparent 38%,rgba(0,0,0,0.58) 100%);
    opacity:0.7;
    mix-blend-mode:screen;
    animation:lightSweep 16s ease-in-out infinite;
    z-index:0;
  }
  .movianx-landing-shell:after{
    content:"";
    position:absolute;
    inset:0;
    pointer-events:none;
    background-image:
      linear-gradient(rgba(255,255,255,0.035) 1px,transparent 1px),
      linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);
    background-size:90px 90px;
    mask-image:linear-gradient(to bottom,rgba(0,0,0,0.22),transparent 72%);
    z-index:0;
  }
  .movianx-topbar{
    position:absolute;
    top:0;
    left:0;
    right:0;
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:24px 5%;
    z-index:10;
    animation:fadeDown 0.7s ease both;
  }
  .movianx-topbar img{
    height:40px;
    width:auto;
    filter:brightness(0) invert(1) drop-shadow(0 8px 22px rgba(0,0,0,0.35));
    opacity:0.94;
  }
  .movianx-nav-actions{
    display:flex;
    gap:18px;
    align-items:center;
  }
  .movianx-landing-hero{
    text-align:center;
    width:100%;
    max-width:1060px;
    z-index:2;
    margin-top:132px;
    padding-bottom:64px;
  }
  .movianx-hero-kicker{
    display:inline-flex;
    align-items:center;
    gap:10px;
    color:rgba(255,255,255,0.74);
    border:1px solid rgba(255,255,255,0.12);
    background:rgba(255,255,255,0.055);
    backdrop-filter:blur(16px);
    -webkit-backdrop-filter:blur(16px);
    border-radius:999px;
    padding:9px 14px;
    margin-bottom:22px;
    font-size:12px;
    font-weight:650;
    text-transform:uppercase;
    letter-spacing:0;
    animation:cinematicReveal 0.85s cubic-bezier(.2,.8,.2,1) both 0.12s;
  }
  .movianx-hero-kicker:before{
    content:"";
    width:7px;
    height:7px;
    border-radius:999px;
    background:#b82b2b;
    box-shadow:0 0 18px rgba(184,43,43,0.95);
  }
  .movianx-landing-title{
    font-size:clamp(46px,8vw,86px);
    font-weight:790;
    color:#fff;
    margin-bottom:20px;
    letter-spacing:0;
    line-height:1.02;
    text-wrap:balance;
    text-shadow:0 20px 70px rgba(0,0,0,0.5);
    animation:cinematicReveal 0.95s cubic-bezier(.2,.8,.2,1) both 0.22s;
  }
  .movianx-landing-copy{
    font-size:clamp(16px,2.4vw,20px);
    color:rgba(255,255,255,0.72);
    margin:0 auto 36px;
    line-height:1.68;
    max-width:820px;
    animation:cinematicReveal 0.95s cubic-bezier(.2,.8,.2,1) both 0.34s;
  }
  .movianx-cta-row{
    display:flex;
    gap:14px;
    justify-content:center;
    flex-wrap:wrap;
    margin-bottom:24px;
    animation:cinematicReveal 0.95s cubic-bezier(.2,.8,.2,1) both 0.46s;
  }
  .movianx-button{
    min-height:52px;
    padding:15px 28px;
    border-radius:999px;
    font-size:15px;
    font-weight:760;
    cursor:pointer;
    font-family:inherit;
    transition:transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease, background 220ms ease;
    will-change:transform;
  }
  .movianx-button-primary{
    background:linear-gradient(135deg,#a52121 0%,#741414 100%);
    border:1px solid rgba(255,255,255,0.14);
    color:#fff;
    box-shadow:0 18px 58px rgba(139,26,26,0.34), inset 0 1px 0 rgba(255,255,255,0.18);
  }
  .movianx-button-secondary{
    background:rgba(255,255,255,0.075);
    border:1px solid rgba(255,255,255,0.16);
    color:#fff;
    box-shadow:0 14px 44px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.08);
    backdrop-filter:blur(18px);
    -webkit-backdrop-filter:blur(18px);
  }
  .movianx-button:hover{
    transform:translateY(-3px);
  }
  .movianx-button-primary:hover{
    box-shadow:0 22px 70px rgba(139,26,26,0.48), 0 0 42px rgba(139,26,26,0.28), inset 0 1px 0 rgba(255,255,255,0.22);
  }
  .movianx-button-secondary:hover{
    border-color:rgba(255,255,255,0.28);
    background:rgba(255,255,255,0.11);
    box-shadow:0 18px 52px rgba(0,0,0,0.3), 0 0 34px rgba(255,255,255,0.08);
  }
  .movianx-feature-tags{
    display:flex;
    gap:12px;
    justify-content:center;
    flex-wrap:wrap;
    margin:0 auto 34px;
    max-width:880px;
  }
  .movianx-feature-tag{
    padding:9px 15px;
    border-radius:999px;
    background:rgba(255,255,255,0.07);
    backdrop-filter:blur(14px);
    -webkit-backdrop-filter:blur(14px);
    border:1px solid rgba(255,255,255,0.12);
    color:rgba(255,255,255,0.82);
    font-size:13px;
    font-weight:620;
    box-shadow:0 10px 34px rgba(0,0,0,0.16);
    animation:tagRise 0.7s cubic-bezier(.2,.8,.2,1) both;
    transition:transform 220ms ease, background 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
  }
  .movianx-feature-tag:hover{
    transform:translateY(-3px);
    background:rgba(255,255,255,0.11);
    border-color:rgba(255,255,255,0.22);
    box-shadow:0 16px 46px rgba(0,0,0,0.24), 0 0 28px rgba(139,26,26,0.16);
  }
  .movianx-support-grid{
    display:grid;
    grid-template-columns:repeat(3,minmax(0,1fr));
    gap:14px;
    text-align:left;
    animation:cinematicReveal 0.95s cubic-bezier(.2,.8,.2,1) both 0.72s;
  }
  .movianx-preview-rail{
    display:grid;
    grid-template-columns:repeat(3,minmax(0,1fr));
    gap:14px;
    margin:0 auto 30px;
    max-width:820px;
    animation:cinematicReveal 0.95s cubic-bezier(.2,.8,.2,1) both 0.66s;
  }
  .movianx-preview-card{
    position:relative;
    aspect-ratio:16/10;
    width:100%;
    padding:0;
    overflow:hidden;
    border-radius:8px;
    border:1px solid rgba(255,255,255,0.13);
    background:
      radial-gradient(circle at 64% 32%, var(--preview-accent), transparent 34%),
      linear-gradient(145deg,#09090c,#1a1014 64%,#050507);
    box-shadow:0 22px 72px rgba(0,0,0,0.28);
    transition:transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease;
  }
  .movianx-preview-card:before{
    content:"";
    position:absolute;
    inset:0;
    background:
      linear-gradient(180deg,transparent 20%,rgba(0,0,0,0.76) 100%),
      repeating-linear-gradient(90deg,rgba(255,255,255,0.03) 0,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 34px);
  }
  .movianx-preview-card:hover{
    transform:translateY(-5px);
    border-color:rgba(255,255,255,0.24);
    box-shadow:0 26px 88px rgba(0,0,0,0.38),0 0 34px rgba(139,26,26,0.16);
  }
  .movianx-preview-card div{
    position:absolute;
    left:15px;
    right:15px;
    bottom:14px;
  }
  .movianx-preview-card strong{
    display:block;
    color:#fff;
    font-size:15px;
    line-height:1.1;
    margin-bottom:6px;
  }
  .movianx-preview-card span{
    color:rgba(255,255,255,0.62);
    font-size:12px;
    font-weight:650;
  }
  .movianx-support-card{
    position:relative;
    overflow:hidden;
    background:linear-gradient(180deg,rgba(255,255,255,0.115),rgba(255,255,255,0.055));
    backdrop-filter:blur(20px);
    -webkit-backdrop-filter:blur(20px);
    border:1px solid rgba(255,255,255,0.13);
    border-radius:8px;
    padding:20px;
    min-height:150px;
    box-shadow:0 22px 70px rgba(0,0,0,0.26);
    transition:transform 240ms ease, border-color 240ms ease, box-shadow 240ms ease, background 240ms ease;
  }
  .movianx-support-card:before{
    content:"";
    position:absolute;
    inset:0;
    background:linear-gradient(120deg,transparent,rgba(255,255,255,0.1),transparent);
    transform:translateX(-120%);
    transition:transform 700ms ease;
  }
  .movianx-support-card:hover{
    transform:translateY(-5px);
    border-color:rgba(255,255,255,0.23);
    background:linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.07));
    box-shadow:0 26px 86px rgba(0,0,0,0.34), 0 0 38px rgba(139,26,26,0.12);
  }
  .movianx-support-card:hover:before{
    transform:translateX(120%);
  }
  .movianx-support-card h3{
    position:relative;
    font-size:16px;
    color:#fff;
    margin-bottom:9px;
    font-weight:760;
    letter-spacing:0;
  }
  .movianx-support-card p{
    position:relative;
    font-size:14px;
    color:rgba(255,255,255,0.65);
    line-height:1.58;
  }
  .movianx-orb{
    position:absolute;
    pointer-events:none;
    border-radius:999px;
    filter:blur(1px);
    background:rgba(255,255,255,0.38);
    box-shadow:0 0 28px rgba(255,255,255,0.18);
    opacity:0.28;
    animation:particleFloat 12s ease-in-out infinite;
    z-index:1;
  }
  .movianx-streak{
    position:absolute;
    pointer-events:none;
    width:180px;
    height:1px;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.32),transparent);
    opacity:0.18;
    transform:rotate(-18deg);
    animation:streakDrift 14s ease-in-out infinite;
    z-index:1;
  }
  @keyframes cinematicAtmosphere{
    0%,100%{background-position:0% 42%,8% 18%,92% 18%,0 0}
    50%{background-position:100% 56%,18% 32%,78% 24%,0 0}
  }
  @keyframes lightSweep{
    0%,100%{transform:translateX(-20%);opacity:0.42}
    50%{transform:translateX(18%);opacity:0.72}
  }
  @keyframes cinematicReveal{
    from{opacity:0;transform:translateY(26px) scale(0.985);filter:blur(8px)}
    to{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}
  }
  @keyframes tagRise{
    from{opacity:0;transform:translateY(16px)}
    to{opacity:1;transform:translateY(0)}
  }
  @keyframes particleFloat{
    0%,100%{transform:translate3d(0,0,0);opacity:0.12}
    50%{transform:translate3d(18px,-24px,0);opacity:0.34}
  }
  @keyframes streakDrift{
    0%,100%{transform:translate3d(-18px,0,0) rotate(-18deg);opacity:0.08}
    50%{transform:translate3d(34px,-18px,0) rotate(-18deg);opacity:0.24}
  }
  @media (max-width:760px){
    .movianx-landing-shell{padding:16px}
    .movianx-topbar{padding:18px 18px}
    .movianx-topbar img{height:34px}
    .movianx-nav-actions{gap:10px}
    .movianx-nav-actions .movianx-button{min-height:40px;padding:10px 14px;font-size:13px}
    .movianx-landing-hero{margin-top:104px;padding-bottom:42px}
    .movianx-landing-title{font-size:clamp(42px,14vw,64px)}
    .movianx-landing-copy{font-size:16px;line-height:1.58;margin-bottom:28px}
    .movianx-cta-row{gap:10px}
    .movianx-cta-row .movianx-button{width:100%;max-width:310px}
    .movianx-preview-rail{grid-template-columns:1fr;margin-bottom:28px}
    .movianx-support-grid{grid-template-columns:1fr}
    .movianx-support-card{min-height:auto}
  }
  @media (prefers-reduced-motion:reduce){
    .movianx-landing-shell,
    .movianx-landing-shell:before,
    .movianx-topbar,
    .movianx-hero-kicker,
    .movianx-landing-title,
    .movianx-landing-copy,
    .movianx-cta-row,
    .movianx-feature-tag,
    .movianx-preview-rail,
    .movianx-support-grid,
    .movianx-orb,
    .movianx-streak{
      animation:none!important;
    }
    .movianx-button,
    .movianx-feature-tag,
    .movianx-support-card{
      transition:none!important;
    }
  }
`;

export function LandingView({ C, FF, CSS, transitionState, navigateTo }) {
  return (
    <div className="movianx-landing-shell" style={{fontFamily:FF,...getViewTransition(transitionState)}}>
      <div className="movianx-orb" style={{width:4,height:4,top:"25%",left:"12%",animationDelay:"0.4s"}}/>
      <div className="movianx-orb" style={{width:3,height:3,top:"38%",right:"16%",animationDelay:"2.4s"}}/>
      <div className="movianx-orb" style={{width:5,height:5,bottom:"24%",left:"22%",animationDelay:"4.1s"}}/>
      <div className="movianx-streak" style={{top:"31%",left:"8%",animationDelay:"1.2s"}}/>
      <div className="movianx-streak" style={{right:"7%",bottom:"30%",animationDelay:"5.4s"}}/>

      <div className="movianx-topbar">
        <img src="/movianx-logo.png" alt="Movianx"/>
        <div className="movianx-nav-actions">
          <button onClick={openCreatorDashboard} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.68)",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:FF}}>Sign In</button>
          <button onClick={openCreatorDashboard} className="movianx-button movianx-button-primary" style={{minHeight:40,padding:"10px 18px",fontSize:14}}>For Creators</button>
        </div>
      </div>

      <div className="movianx-landing-hero">
        <div className="movianx-hero-kicker">Creator-first cinematic intelligence</div>
        <h1 className="movianx-landing-title">Immersive media powered by AI.</h1>
        <p className="movianx-landing-copy">Upload films, stories, and cinematic experiences into a platform designed for next generation creators. Movianx enhances media with immersive audio, AI analysis, and intelligent cinematic tooling.</p>
        <div className="movianx-cta-row">
          <button onClick={openCreatorDashboard} className="movianx-button movianx-button-primary">For Creators</button>
          <button onClick={openWatchLibrary} className="movianx-button movianx-button-secondary">Explore Experiences</button>
        </div>
        <div className="movianx-preview-rail" aria-label="Cinematic experience previews">
          {LANDING_MOVIE_PREVIEWS.map(([title, label, accent])=>(
            <button key={title} onClick={openWatchLibrary} className="movianx-preview-card" style={{"--preview-accent":accent,cursor:"pointer",fontFamily:FF,textAlign:"left"}}>
              <div>
                <strong>{title}</strong>
                <span>{label} · AI Enhanced</span>
              </div>
            </button>
          ))}
        </div>
        <div className="movianx-feature-tags">
          {LANDING_FEATURE_TAGS.map((feature, idx)=>(
            <div key={feature} className="movianx-feature-tag" style={{animationDelay:`${0.56 + idx * 0.055}s`}}>{feature}</div>
          ))}
        </div>
        <div className="movianx-support-grid">
          {LANDING_SUPPORT_CARDS.map(([title, body])=>(
            <div key={title} className="movianx-support-card">
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{CSS}</style>
      <style>{landingCinematicCSS}</style>
    </div>
  );
}

export function HomeView({ C, FF, CSS, transitionState, navigateTo }) {
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg, #eef0ff 0%, #e8e8f2 50%, #f0ebe6 100%)",fontFamily:FF,display:"flex",flexDirection:"column",position:"relative",...getViewTransition(transitionState)}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 5%",borderBottom:`1px solid ${C.border}`,animation:getEntryAnimation(transitionState,"fadeDown 0.6s ease both")}}>
        <div onClick={()=>navigateTo("landing")} style={{cursor:"pointer"}}><img src="/movianx-logo.png" alt="Movianx" style={{height:36,width:"auto"}}/></div>
        <div style={{display:"flex",gap:24,alignItems:"center"}}>
          <button onClick={openCreatorDashboard} style={{background:"transparent",border:"none",color:C.text2,fontSize:14,cursor:"pointer",fontFamily:FF}} onMouseEnter={e=>e.target.style.color=C.text} onMouseLeave={e=>e.target.style.color=C.text2}>Creator Studio</button>
          <button onClick={openCreatorDashboard} style={{padding:"10px 20px",borderRadius:20,background:C.accent,border:"none",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:FF}}>For Creators</button>
        </div>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",padding:"32px 5% 60px"}}>
        <h1 style={{fontSize:"clamp(24px,4vw,40px)",fontWeight:700,color:C.text,marginBottom:8,textAlign:"center",letterSpacing:"-1px",animation:getEntryAnimation(transitionState,"fadeUp 0.8s ease both 0.1s"),opacity:1}}>Explore Movianx Experiences</h1>
        <p style={{fontSize:"clamp(13px,2vw,16px)",color:C.text2,marginBottom:32,textAlign:"center",maxWidth:560,animation:getEntryAnimation(transitionState,"fadeUp 0.8s ease both 0.2s"),opacity:1}}>Preview immersive media and creator-ready cinematic tooling built for AI-directed experiences.</p>
        <div style={{display:"flex",gap:16,width:"100%",maxWidth:900,justifyContent:"center",flexWrap:"wrap",paddingBottom:40}}>
          <button onClick={openWatchLibrary} style={{width:160,minHeight:160,background:C.glass,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",border:`1px solid ${C.glassBorder}`,borderRadius:24,padding:20,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",alignItems:"flex-start",animation:getEntryAnimation(transitionState,"fadeUp 0.8s ease both 0.3s"),opacity:1,transition:"all 0.3s",boxShadow:C.shadow}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-8px) scale(1.02)";e.currentTarget.style.boxShadow=C.shadowHover}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0) scale(1)";e.currentTarget.style.boxShadow=C.shadow}}>
            <div style={{fontSize:36,marginBottom:8}}>🎬</div>
            <h3 style={{fontSize:20,fontWeight:700,color:C.text,marginBottom:6}}>Cinema</h3>
            <p style={{fontSize:14,color:C.text2,margin:0}}>AI-enhanced films</p>
            <div style={{marginTop:"auto",alignSelf:"flex-end",width:32,height:32,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:16,flexShrink:0}}>→</div>
          </button>
          <button onClick={()=>navigateTo("library")} style={{width:160,minHeight:160,background:C.glass,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",border:`1px solid ${C.glassBorder}`,borderRadius:24,padding:20,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",alignItems:"flex-start",animation:getEntryAnimation(transitionState,"fadeUp 0.8s ease both 0.4s"),opacity:1,transition:"all 0.3s",boxShadow:C.shadow}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-8px) scale(1.02)";e.currentTarget.style.boxShadow=C.shadowHover}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0) scale(1)";e.currentTarget.style.boxShadow=C.shadow}}>
            <div style={{fontSize:36,marginBottom:8}}>📚</div>
            <h3 style={{fontSize:20,fontWeight:700,color:C.text,marginBottom:6}}>Stories</h3>
            <p style={{fontSize:14,color:C.text2,margin:0}}>Interactive fiction</p>
            <div style={{marginTop:"auto",alignSelf:"flex-end",width:32,height:32,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:16,flexShrink:0}}>→</div>
          </button>
          <div style={{width:160,height:160,background:C.glass,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",border:`1px solid ${C.glassBorder}`,borderRadius:24,padding:20,cursor:"not-allowed",textAlign:"left",display:"flex",flexDirection:"column",animation:getEntryAnimation(transitionState,"fadeUp 0.8s ease both 0.5s"),opacity:1,boxShadow:C.shadow}}>
            <div style={{fontSize:36,marginBottom:8,opacity:0.4}}>🎨</div>
            <h3 style={{fontSize:24,fontWeight:700,color:`${C.text}50`,marginBottom:6}}>Artists</h3>
            <div style={{display:"inline-block",padding:"4px 10px",borderRadius:12,background:C.pillBg,fontSize:10,fontWeight:600,color:C.text2,textTransform:"uppercase",letterSpacing:"1px"}}>Coming Soon</div>
          </div>
        </div>
      </div>
      <style>{CSS}</style>
    </div>
  );
}

export function LibraryView({ C, FF, CSS, transitionState, navigateTo, stories, onSelectStory }) {
  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:FF,padding:"80px 5% 120px",...getViewTransition(transitionState)}}>
      <button onClick={()=>navigateTo("home")} style={{background:C.glass,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",border:`1px solid ${C.glassBorder}`,color:C.text,padding:"12px 24px",borderRadius:8,fontSize:14,cursor:"pointer",marginBottom:40,fontFamily:FF,boxShadow:C.shadow,animation:getEntryAnimation(transitionState,"fadeUp 0.6s ease both")}}>← Back</button>
      <h1 style={{fontSize:48,fontWeight:700,color:C.text,marginBottom:16,animation:getEntryAnimation(transitionState,"fadeUp 0.6s ease both 0.1s")}}>Story Library</h1>
      <p style={{fontSize:18,color:C.text2,marginBottom:60,animation:getEntryAnimation(transitionState,"fadeUp 0.6s ease both 0.15s")}}>Choose your experience</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:24,maxWidth:1200}}>
        {stories.map((story,idx)=>(
          <div key={story.id} onClick={()=>onSelectStory(story)} style={{background:C.glass,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",border:`1px solid ${C.glassBorder}`,borderRadius:16,overflow:"hidden",cursor:"pointer",transition:"all 0.3s",boxShadow:C.shadow,transformStyle:"preserve-3d",animation:getEntryAnimation(transitionState,`fadeUp 0.6s ease both ${0.2+idx*0.08}s`)}} onMouseMove={e=>{const r=e.currentTarget.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-0.5;const y=(e.clientY-r.top)/r.height-0.5;e.currentTarget.style.transform=`perspective(600px) rotateY(${x*6}deg) rotateX(${-y*6}deg) translateY(-4px)`}} onMouseEnter={e=>{e.currentTarget.style.boxShadow=C.shadowHover}} onMouseLeave={e=>{e.currentTarget.style.transform="perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0)";e.currentTarget.style.boxShadow=C.shadow}}>
            <div style={{height:200,background:`url(${story.cover})`,backgroundSize:"cover",backgroundPosition:"center"}}/>
            <div style={{padding:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <h3 style={{fontSize:20,fontWeight:700,color:C.text,margin:0}}>{story.title}</h3>
                {story.isTimed&&<span style={{fontSize:20}}>⏱️</span>}
              </div>
              <p style={{fontSize:13,color:C.text2,marginBottom:12}}>{story.author} * {story.genre}</p>
              <p style={{fontSize:14,color:C.text2,lineHeight:1.6,marginBottom:16}}>{story.desc}</p>
              <div style={{display:"flex",gap:16,fontSize:12,color:C.text2}}>
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

export function DetailView({ C, FF, CSS, transitionState, navigateTo, story, mode, setMode, onStartReading }) {
  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:FF,...getViewTransition(transitionState)}}>
      <div style={{position:"relative",height:360,background:`url(${story.cover})`,backgroundSize:"cover",backgroundPosition:"center"}}>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 30%, rgba(248,249,250,0.8) 70%, #f8f9fa 100%)"}}/>
        <button onClick={()=>navigateTo("library")} style={{position:"absolute",top:24,left:24,background:C.glass,border:`1px solid ${C.glassBorder}`,color:C.text,padding:"10px 20px",borderRadius:8,fontSize:14,cursor:"pointer",zIndex:2,fontFamily:FF,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",boxShadow:C.shadow}}>← Back</button>
      </div>
      <div style={{maxWidth:800,margin:"-80px auto 0",padding:"0 24px 60px",position:"relative",zIndex:2}}>
        <h1 style={{fontSize:40,fontWeight:700,color:C.text,marginBottom:8,letterSpacing:"-1px",animation:getEntryAnimation(transitionState,"fadeUp 0.6s ease both 0.1s")}}>{story.title}</h1>
        <p style={{fontSize:16,color:C.text2,marginBottom:20,animation:getEntryAnimation(transitionState,"fadeUp 0.6s ease both 0.15s")}}>{story.author} * {story.genre}</p>
        <p style={{fontSize:16,color:C.text2,lineHeight:1.8,marginBottom:32,animation:getEntryAnimation(transitionState,"fadeUp 0.6s ease both 0.2s")}}>{story.desc}</p>
        <div style={{display:"flex",gap:12,marginBottom:32,flexWrap:"wrap",animation:getEntryAnimation(transitionState,"fadeUp 0.6s ease both 0.25s")}}>
          <span style={{padding:"6px 14px",borderRadius:20,background:C.pillBg,color:C.text2,fontSize:13}}>⭐ {story.rating}</span>
          <span style={{padding:"6px 14px",borderRadius:20,background:C.pillBg,color:C.text2,fontSize:13}}>📖 {story.chapters} chapters</span>
          <span style={{padding:"6px 14px",borderRadius:20,background:C.pillBg,color:C.text2,fontSize:13}}>👁️ {story.reads}</span>
          {story.isTimed&&<span style={{padding:"6px 14px",borderRadius:20,background:"rgba(232,54,79,0.2)",color:C.red,fontSize:13,fontWeight:600}}>⏱️ Timed Choices</span>}
        </div>
        <div style={{marginBottom:32,animation:getEntryAnimation(transitionState,"fadeUp 0.6s ease both 0.3s")}}>
          <p style={{fontSize:12,color:C.text2,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:12}}>Experience Mode</p>
          <div style={{display:"flex",gap:10}}>
            {story.immersions.map(option=>(
              <button key={option} onClick={()=>setMode(option)} style={{padding:"12px 24px",borderRadius:12,border:`1px solid ${mode===option?C.accent:C.border}`,background:mode===option?C.accent:"transparent",color:mode===option?"#fff":C.text2,fontSize:14,fontWeight:mode===option?600:400,cursor:"pointer",transition:"all 0.2s",fontFamily:FF}}>{option==="Reader"?"📖":""}  {option==="Cinematic"?"🎬":""} {option==="Immersive"?"🌐":""} {option}</button>
            ))}
          </div>
        </div>
        <button onClick={onStartReading} style={{width:"100%",maxWidth:400,padding:"18px",borderRadius:14,border:"none",background:C.accent,color:"#fff",fontSize:16,fontWeight:700,cursor:"pointer",transition:"all 0.2s",fontFamily:FF,boxShadow:"0 8px 32px rgba(139,26,26,0.25)",animation:getEntryAnimation(transitionState,"fadeUp 0.6s ease both 0.35s")}} onMouseEnter={e=>{e.target.style.transform="translateY(-2px)";e.target.style.boxShadow="0 12px 40px rgba(139,26,26,0.35)"}} onMouseLeave={e=>{e.target.style.transform="translateY(0)";e.target.style.boxShadow="0 8px 32px rgba(139,26,26,0.25)"}}>
          Begin Reading →
        </button>
      </div>
      <style>{CSS}</style>
    </div>
  );
}
