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

export function LandingView({ C, FF, CSS, transitionState, navigateTo }) {
  return (
    <div style={{height:"100vh",overflowY:"auto",background:"linear-gradient(135deg, #f8f9fa 0%, #f0f0f5 25%, #f5f3f0 50%, #f0eff5 75%, #f8f9fa 100%)",backgroundSize:"300% 300%",animation:"gradientShift 15s ease infinite",display:"flex",flexDirection:"column",alignItems:"center",padding:20,fontFamily:FF,position:"relative",...getViewTransition(transitionState)}}>
      <div style={{position:"absolute",top:0,left:0,right:0,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"24px 5%",zIndex:10,animation:"fadeDown 0.6s ease both"}}>
        
        <img src="/movianx-logo.png" alt="Movianx" style={{height:40,width:"auto"}}/>
        <div style={{display:"flex",gap:32,alignItems:"center"}}>
          <button onClick={openCreatorDashboard} style={{background:"transparent",border:"none",color:C.text2,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:FF}} onMouseEnter={e=>e.target.style.color=C.text} onMouseLeave={e=>e.target.style.color=C.text2}>Sign In</button>
          <button onClick={openCreatorDashboard} style={{padding:"10px 20px",borderRadius:20,background:C.accent,border:"none",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:FF}}>For Creators</button>
        </div>
      </div>
      <div style={{textAlign:"center",maxWidth:980,zIndex:1,marginTop:128,paddingBottom:52}}>
        <h1 style={{fontSize:"clamp(42px,8vw,76px)",fontWeight:760,color:C.text,marginBottom:20,letterSpacing:"-2px",lineHeight:1.05,animation:getEntryAnimation(transitionState,"fadeUp 0.8s ease both 0.2s"),opacity:1}}>Immersive media powered by AI.</h1>
        <p style={{fontSize:"clamp(16px,2.4vw,20px)",color:C.text2,margin:"0 auto 36px",lineHeight:1.65,maxWidth:820,animation:getEntryAnimation(transitionState,"fadeUp 0.8s ease both 0.3s"),opacity:1}}>Upload films, stories, and cinematic experiences into a platform designed for next generation creators. Movianx enhances media with immersive audio, AI analysis, and intelligent cinematic tooling.</p>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:38,animation:getEntryAnimation(transitionState,"fadeUp 0.8s ease both 0.4s"),opacity:1}}>
          <button onClick={openCreatorDashboard} style={{padding:"16px 30px",borderRadius:20,background:C.accent,border:"none",color:"#fff",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:FF,boxShadow:"0 8px 32px rgba(139,26,26,0.25)"}} onMouseEnter={e=>{e.target.style.transform="translateY(-2px)";e.target.style.boxShadow="0 12px 40px rgba(139,26,26,0.35)"}} onMouseLeave={e=>{e.target.style.transform="translateY(0)";e.target.style.boxShadow="0 8px 32px rgba(139,26,26,0.25)"}}>For Creators</button>
          <button onClick={()=>navigateTo("home")} style={{padding:"16px 30px",borderRadius:20,background:C.glass,border:`1px solid ${C.glassBorder}`,color:C.text,fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:FF,boxShadow:C.shadow}}>Explore Experiences</button>
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:44,animation:getEntryAnimation(transitionState,"fadeUp 0.8s ease both 0.5s"),opacity:1}}>
          {["AI Directed Experiences","Immersive Audio","Creator Upload Platform","Cinematic Enhancement","AI Scene Analysis","Interactive Media"].map(f=>(
            <div key={f} style={{padding:"8px 16px",borderRadius:20,background:C.pillBg,backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:`1px solid ${C.glassBorder}`,color:C.text,fontSize:13,fontWeight:500}}>{f}</div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14,textAlign:"left",animation:getEntryAnimation(transitionState,"fadeUp 0.8s ease both 0.6s"),opacity:1}}>
          {[
            ["Built for directors", "A creator-first AI media platform for directors, filmmakers, storytellers, artists, and creators shaping cinematic work."],
            ["Secure creator pipeline", "Upload and manage media through a private review flow designed for premium films, video, and immersive content."],
            ["Intelligent enhancement", "Use immersive audio, AI-assisted enhancement, and intelligent media analysis to prepare experiences for the next screen."],
          ].map(([title,body])=>(
            <div key={title} style={{background:C.glass,backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)",border:`1px solid ${C.glassBorder}`,borderRadius:16,padding:20,boxShadow:C.shadow}}>
              <h3 style={{fontSize:16,color:C.text,marginBottom:8,fontWeight:700}}>{title}</h3>
              <p style={{fontSize:14,color:C.text2,lineHeight:1.55}}>{body}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{CSS}</style>
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
          <button onClick={()=>navigateTo("library")} style={{width:160,minHeight:160,background:C.glass,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",border:`1px solid ${C.glassBorder}`,borderRadius:24,padding:20,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",alignItems:"flex-start",animation:getEntryAnimation(transitionState,"fadeUp 0.8s ease both 0.3s"),opacity:1,transition:"all 0.3s",boxShadow:C.shadow}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-8px) scale(1.02)";e.currentTarget.style.boxShadow=C.shadowHover}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0) scale(1)";e.currentTarget.style.boxShadow=C.shadow}}>
            <div style={{fontSize:36,marginBottom:8}}>📚</div>
            <h3 style={{fontSize:20,fontWeight:700,color:C.text,marginBottom:6}}>Stories</h3>
            <p style={{fontSize:14,color:C.text2,margin:0}}>Interactive fiction</p>
            <div style={{marginTop:"auto",alignSelf:"flex-end",width:32,height:32,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:16,flexShrink:0}}>→</div>
          </button>
          <div style={{width:160,height:160,background:C.glass,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",border:`1px solid ${C.glassBorder}`,borderRadius:24,padding:20,cursor:"not-allowed",textAlign:"left",display:"flex",flexDirection:"column",animation:getEntryAnimation(transitionState,"fadeUp 0.8s ease both 0.4s"),opacity:1,boxShadow:C.shadow}}>
            <div style={{fontSize:36,marginBottom:8,opacity:0.4}}>🎬</div>
            <h3 style={{fontSize:24,fontWeight:700,color:`${C.text}50`,marginBottom:6}}>Cinema</h3>
            <div style={{display:"inline-block",padding:"4px 10px",borderRadius:12,background:C.pillBg,fontSize:10,fontWeight:600,color:C.text2,textTransform:"uppercase",letterSpacing:"1px"}}>Coming Soon</div>
          </div>
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
