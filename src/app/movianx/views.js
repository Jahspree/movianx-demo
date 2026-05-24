"use client";

import { useState } from "react";

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
  window.location.href = "/dashboard/welcome";
}

function openConsumerLogin() {
  window.location.href = "/watch";
}

function openWatchLibrary() {
  window.location.href = "/watch";
}

const LANDING_FEATURE_TAGS = [
  "AI Enhanced Cinema",
  "Immersive Audio",
  "Interactive Stories",
  "Public Domain Classics",
  "Adaptive Sound",
  "Interactive Media",
];

const LANDING_PORTALS = [
  ["movies", "Movies", "Cinematic worlds", "/watch", "top", "/images/homepage/movies.jpg", "#b51f2a"],
  ["music", "Music", "Spatial listening", "/watch#music-experiences", "left", "/images/homepage/music.jpg", "#0f766e"],
  ["stories", "Stories", "Interactive fiction", "/watch#immersive-stories", "right", "/images/homepage/stories.jpg", "#7c3aed"],
  ["explore", "Explore", "Enter Movianx", "/watch", "center", "/images/homepage/explore.jpg", "#d6a33a"],
];

const LANDING_HERO_ENVIRONMENTS = [
  ["Movies", "/images/homepage/movies.jpg", "8%", "12%", "32deg"],
  ["Music", "/images/homepage/music.jpg", "70%", "18%", "-22deg"],
  ["Stories", "/images/homepage/stories.jpg", "2%", "62%", "-14deg"],
  ["Explore", "/images/homepage/explore.jpg", "72%", "64%", "18deg"],
];

const LANDING_MOVIE_PREVIEWS = [
  ["Night of the Living Dead", "Public Domain Horror", "#b51f2a", "/images/movies/night-of-the-living-dead.jpg"],
  ["10 Seconds", "Timed Interactive Story", "#991b1b", "/images/stories/ten-seconds.jpg"],
  ["Echoes in Orbit", "Music Experience", "#0f766e", "/images/music/echoes-in-orbit.jpg"],
  ["Midnight Signal", "Dark Sci-Fi", "#2563eb", "/images/movies/midnight-signal.jpg"],
  ["Creator Spotlight", "Creator Universe", "#7c3aed", "/images/creators/spotlight-lab.jpg"],
  ["Moon Static", "Experimental Cinema", "#d6a33a", "/images/movies/a-trip-to-the-moon.jpg"],
];

const LANDING_SUPPORT_CARDS = [
  [
    "Cinema that surrounds you",
    "Films and stories are staged with immersive audio, intelligent scene analysis, and atmospheric enhancement.",
    "/images/homepage/movies.jpg",
    "Spatial cinema",
    "#b51f2a",
  ],
  [
    "Stories that move",
    "Interactive experiences bring choice, timing, and cinematic tension into the same premium media library.",
    "/images/homepage/stories.jpg",
    "Interactive worlds",
    "#7c3aed",
  ],
  [
    "A new entertainment layer",
    "Movianx blends curated cinema, public-domain classics, and original interactive experiences into one immersive destination.",
    "/images/homepage/explore.jpg",
    "AI enhanced",
    "#d6a33a",
  ],
];

function PortalIcon({ type }) {
  if (type === "movies") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect x="6" y="8" width="20" height="16" rx="3" />
        <path d="M10 8v16M22 8v16M6 13h20M6 19h20" />
      </svg>
    );
  }
  if (type === "music") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M6 18v-4M11 22V10M16 25V7M21 22V10M26 18v-4" />
      </svg>
    );
  }
  if (type === "stories") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M8 7h11a5 5 0 0 1 5 5v13H13a5 5 0 0 0-5 0V7Z" />
        <path d="M13 12h6M13 17h7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="8" />
      <path d="M16 2v6M16 24v6M2 16h6M24 16h6M6 6l4 4M22 22l4 4M26 6l-4 4M10 22l-4 4" />
    </svg>
  );
}

function WaitlistCapture({ FF }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source: "homepage", intent: "early_access" }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.error?.message || "Could not join waitlist");
      setEmail("");
      setStatus("You're on the early access list.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="movianx-waitlist" onSubmit={submit}>
      <input
        type="email"
        value={email}
        onChange={event => setEmail(event.target.value)}
        placeholder="Email for early access"
        aria-label="Email for early access"
        required
        style={{fontFamily:FF}}
      />
      <button type="submit" disabled={busy} style={{fontFamily:FF}}>{busy ? "Joining..." : "Join Waitlist"}</button>
      <span>{status || "Privacy-first updates for early access."}</span>
    </form>
  );
}

const landingCinematicCSS = `
  .movianx-landing-shell{
    min-height:100svh;
    width:100%;
    overflow-x:hidden;
    overflow-y:visible;
    background:
      linear-gradient(90deg,rgba(5,5,7,0.9),rgba(5,5,7,0.34),rgba(5,5,7,0.9)),
      linear-gradient(180deg,rgba(5,5,7,0.2),rgba(5,5,7,0.76)),
      url('/images/homepage/explore.jpg'),
      url('/images/homepage/movies.jpg'),
      radial-gradient(circle at 50% 18%, rgba(255,255,255,0.14), transparent 18%),
      radial-gradient(circle at 18% 28%, rgba(139,26,26,0.28), transparent 26%),
      radial-gradient(circle at 82% 30%, rgba(184,134,11,0.14), transparent 24%),
      linear-gradient(135deg,#050507 0%,#111116 42%,#170808 100%);
    background-size:cover,cover,cover,cover,180% 180%,140% 140%,130% 130%,100% 100%;
    background-position:center,center,center 44%,center 18%,50% 18%,18% 28%,82% 30%,center;
    animation:cinematicAtmosphere 18s ease-in-out infinite;
    display:flex;
    flex-direction:column;
    align-items:center;
    padding:20px;
    position:relative;
    isolation:isolate;
  }
  .movianx-landing-shell,
  .movianx-landing-shell *{
    box-sizing:border-box;
  }
  .movianx-landing-shell:before{
    content:"";
    position:absolute;
    inset:0;
    pointer-events:none;
    background:
      linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.06) 48%,transparent 54%),
      radial-gradient(ellipse at center,transparent 38%,rgba(0,0,0,0.58) 100%);
    opacity:0.48;
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
  .movianx-homepage-environments{
    position:absolute;
    inset:92px 3.5% auto;
    height:min(620px,62svh);
    pointer-events:none;
    z-index:1;
    opacity:0.86;
    filter:saturate(1.05);
  }
  .movianx-environment-panel{
    position:absolute;
    left:var(--env-left);
    top:var(--env-top);
    width:clamp(180px,22vw,330px);
    aspect-ratio:16/10;
    border-radius:22px;
    overflow:hidden;
    border:1px solid rgba(255,255,255,0.12);
    background:
      linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.68)),
      var(--env-image);
    background-size:cover;
    background-position:center;
    box-shadow:0 32px 110px rgba(0,0,0,0.44), inset 0 1px 0 rgba(255,255,255,0.12);
    transform:rotate(var(--env-rotate));
    animation:environmentDrift 14s ease-in-out infinite;
  }
  .movianx-environment-panel:before{
    content:"";
    position:absolute;
    inset:0;
    background:
      radial-gradient(circle at 72% 22%,rgba(255,255,255,0.16),transparent 28%),
      linear-gradient(90deg,rgba(0,0,0,0.66),transparent 62%);
    opacity:0.9;
  }
  .movianx-environment-panel:after{
    content:attr(data-label);
    position:absolute;
    left:16px;
    bottom:14px;
    color:rgba(255,255,255,0.78);
    font-size:11px;
    font-weight:800;
    text-transform:uppercase;
    letter-spacing:1.6px;
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
    max-width:1120px;
    z-index:2;
    margin-top:96px;
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
  .movianx-logo-reveal{
    width:58px;
    height:58px;
    margin:0 auto 18px;
    border-radius:18px;
    display:grid;
    place-items:center;
    background:linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04));
    border:1px solid rgba(255,255,255,0.14);
    box-shadow:0 24px 80px rgba(139,26,26,0.24), inset 0 1px 0 rgba(255,255,255,0.16);
    animation:logoArrival 1s cubic-bezier(.2,.8,.2,1) both 0.04s;
  }
  .movianx-logo-reveal img{
    width:31px;
    height:auto;
    filter:brightness(0) invert(1);
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
    font-size:clamp(42px,7.2vw,76px);
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
    margin:0 auto 26px;
    line-height:1.68;
    max-width:820px;
    animation:cinematicReveal 0.95s cubic-bezier(.2,.8,.2,1) both 0.34s;
  }
  .movianx-portal-field{
    position:relative;
    width:min(980px,100%);
    height:370px;
    margin:18px auto 26px;
    animation:cinematicReveal 1s cubic-bezier(.2,.8,.2,1) both 0.42s;
  }
  .movianx-portal-field:before{
    content:"";
    position:absolute;
    inset:32px 18%;
    border-radius:999px;
    background:
      radial-gradient(circle at center,rgba(255,255,255,0.16),transparent 28%),
      radial-gradient(circle at center,rgba(181,31,42,0.34),transparent 54%);
    filter:blur(16px);
    opacity:0.88;
    animation:portalPulse 4.8s ease-in-out infinite;
  }
  .movianx-portal-line{
    position:absolute;
    left:50%;
    top:50%;
    width:min(390px,46vw);
    height:1px;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);
    transform-origin:left center;
    opacity:0.62;
  }
  .movianx-portal-line-top{transform:rotate(-90deg)}
  .movianx-portal-line-left{transform:rotate(180deg)}
  .movianx-portal-line-right{transform:rotate(0deg)}
  .movianx-portal-button{
    position:absolute;
    display:flex;
    align-items:center;
    gap:16px;
    min-width:238px;
    min-height:104px;
    padding:20px;
    border:1px solid rgba(255,255,255,0.18);
    border-radius:18px;
    background:
      linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.66)),
      var(--portal-image),
      linear-gradient(135deg,rgba(255,255,255,0.13),rgba(255,255,255,0.045));
    background-size:cover,cover,cover;
    background-position:center;
    color:#fff;
    cursor:pointer;
    font-family:inherit;
    text-align:left;
    overflow:hidden;
    box-shadow:0 30px 96px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.16);
    transform:translate(-50%,-50%);
    transition:transform 260ms ease, border-color 260ms ease, box-shadow 260ms ease, filter 260ms ease;
    animation:portalFloat 5.8s ease-in-out infinite;
  }
  .movianx-portal-button:before{
    content:"";
    position:absolute;
    inset:-12%;
    background:var(--portal-image);
    background-size:cover;
    background-position:center;
    opacity:0.48;
    transform:scale(1.04);
    transition:transform 700ms ease, opacity 260ms ease;
    z-index:-2;
  }
  .movianx-portal-button:after{
    content:"";
    position:absolute;
    inset:0;
    background:
      linear-gradient(90deg,rgba(0,0,0,0.72),rgba(0,0,0,0.18)),
      radial-gradient(circle at 78% 22%,var(--portal-accent),transparent 34%),
      linear-gradient(180deg,transparent,rgba(0,0,0,0.64));
    opacity:0.86;
    z-index:-1;
  }
  .movianx-portal-button svg{
    width:34px;
    height:34px;
    flex:0 0 auto;
    fill:none;
    stroke:currentColor;
    stroke-width:1.8;
    stroke-linecap:round;
    stroke-linejoin:round;
    color:rgba(255,255,255,0.86);
    filter:drop-shadow(0 10px 22px rgba(0,0,0,0.42));
  }
  .movianx-portal-button strong{
    display:block;
    font-size:20px;
    line-height:1;
    margin-bottom:5px;
    text-shadow:0 10px 30px rgba(0,0,0,0.6);
  }
  .movianx-portal-button span{
    display:block;
    color:rgba(255,255,255,0.72);
    font-size:12px;
    font-weight:650;
  }
  .movianx-portal-button:hover{
    transform:translate(-50%,-50%) translateY(-5px) scale(1.035);
    border-color:rgba(255,255,255,0.34);
    filter:saturate(1.1) brightness(1.08);
    box-shadow:0 36px 110px rgba(0,0,0,0.55),0 0 54px rgba(181,31,42,0.28);
  }
  .movianx-portal-button:hover:before{
    transform:scale(1.12);
    opacity:0.62;
  }
  .movianx-portal-top{left:50%;top:12%;animation-delay:0.1s}
  .movianx-portal-left{left:20%;top:56%;animation-delay:0.9s}
  .movianx-portal-right{left:80%;top:56%;animation-delay:1.4s}
  .movianx-portal-center{
    left:50%;
    top:56%;
    min-width:270px;
    min-height:122px;
    box-shadow:0 30px 96px rgba(139,26,26,0.42),0 0 70px rgba(181,31,42,0.22);
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
    position:relative;
    display:flex;
    gap:12px;
    justify-content:center;
    flex-wrap:wrap;
    margin:4px auto 34px;
    max-width:880px;
    padding:18px 18px 4px;
  }
  .movianx-feature-tags:before{
    content:"";
    position:absolute;
    inset:0;
    border-radius:28px;
    background:
      linear-gradient(90deg,rgba(255,255,255,0.045),rgba(255,255,255,0.015)),
      radial-gradient(circle at 18% 0%,rgba(181,31,42,0.16),transparent 38%),
      radial-gradient(circle at 82% 0%,rgba(214,163,58,0.11),transparent 34%);
    border:1px solid rgba(255,255,255,0.08);
    box-shadow:0 28px 90px rgba(0,0,0,0.24);
    pointer-events:none;
  }
  .movianx-feature-tag{
    position:relative;
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
    position:relative;
    display:grid;
    grid-template-columns:repeat(3,minmax(0,1fr));
    gap:16px;
    text-align:left;
    max-width:1040px;
    margin:0 auto;
    padding:18px;
    border-radius:28px;
    background:
      linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015)),
      radial-gradient(circle at 15% 15%,rgba(181,31,42,0.18),transparent 34%),
      radial-gradient(circle at 86% 18%,rgba(15,118,110,0.12),transparent 30%);
    border:1px solid rgba(255,255,255,0.08);
    box-shadow:0 34px 110px rgba(0,0,0,0.28);
    animation:cinematicReveal 0.95s cubic-bezier(.2,.8,.2,1) both 0.72s;
  }
  .movianx-support-grid:before{
    content:"";
    position:absolute;
    left:8%;
    right:8%;
    top:-1px;
    height:1px;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent);
    opacity:0.8;
  }
  .movianx-preview-rail{
    display:grid;
    grid-template-columns:repeat(6,minmax(0,1fr));
    gap:14px;
    margin:0 auto 24px;
    max-width:1040px;
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
      linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.56)),
      var(--preview-image),
      radial-gradient(circle at 64% 32%, var(--preview-accent), transparent 34%),
      linear-gradient(145deg,#09090c,#1a1014 64%,#050507);
    background-size:cover,cover,cover,cover;
    background-position:center;
    box-shadow:0 22px 72px rgba(0,0,0,0.28);
    transition:transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease, filter 240ms ease;
  }
  .movianx-preview-card:before{
    content:"";
    position:absolute;
    inset:0;
    background:
      linear-gradient(180deg,transparent 34%,rgba(0,0,0,0.62) 100%),
      repeating-linear-gradient(90deg,rgba(255,255,255,0.03) 0,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 34px);
  }
  .movianx-preview-card:hover{
    transform:translateY(-5px);
    border-color:rgba(255,255,255,0.24);
    filter:saturate(1.08) brightness(1.04);
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
    background:
      linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.7)),
      var(--support-image),
      linear-gradient(180deg,rgba(255,255,255,0.115),rgba(255,255,255,0.055));
    background-size:cover,cover,cover;
    background-position:center;
    backdrop-filter:blur(20px);
    -webkit-backdrop-filter:blur(20px);
    border:1px solid rgba(255,255,255,0.13);
    border-radius:14px;
    padding:20px;
    min-height:220px;
    display:flex;
    flex-direction:column;
    justify-content:flex-end;
    box-shadow:0 22px 70px rgba(0,0,0,0.26);
    transition:transform 240ms ease, border-color 240ms ease, box-shadow 240ms ease, filter 240ms ease;
  }
  .movianx-support-card:before{
    content:"";
    position:absolute;
    inset:0;
    background:
      linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.76)),
      radial-gradient(circle at 78% 18%,var(--support-accent),transparent 34%),
      linear-gradient(120deg,transparent,rgba(255,255,255,0.1),transparent);
    opacity:0.9;
    transition:opacity 260ms ease;
  }
  .movianx-support-card:after{
    content:"";
    position:absolute;
    inset:-20%;
    background:linear-gradient(120deg,transparent,rgba(255,255,255,0.16),transparent);
    transform:translateX(-120%);
    transition:transform 760ms ease;
  }
  .movianx-support-card:hover{
    transform:translateY(-5px);
    border-color:rgba(255,255,255,0.23);
    filter:saturate(1.08) brightness(1.04);
    box-shadow:0 26px 86px rgba(0,0,0,0.34), 0 0 38px rgba(139,26,26,0.12);
  }
  .movianx-support-card:hover:before{
    opacity:0.76;
  }
  .movianx-support-card:hover:after{
    transform:translateX(120%);
  }
  .movianx-support-card-label{
    position:relative;
    display:inline-flex;
    align-self:flex-start;
    margin-bottom:12px;
    padding:7px 10px;
    border-radius:999px;
    background:rgba(255,255,255,0.1);
    border:1px solid rgba(255,255,255,0.13);
    color:rgba(255,255,255,0.78);
    font-size:11px;
    font-weight:800;
    text-transform:uppercase;
    letter-spacing:1px;
    backdrop-filter:blur(12px);
    -webkit-backdrop-filter:blur(12px);
  }
  .movianx-support-card h3{
    position:relative;
    font-size:18px;
    color:#fff;
    margin-bottom:9px;
    font-weight:760;
    letter-spacing:0;
  }
  .movianx-support-card p{
    position:relative;
    font-size:14px;
    color:rgba(255,255,255,0.72);
    line-height:1.58;
  }
  .movianx-waitlist{
    display:grid;
    grid-template-columns:minmax(220px,1fr) auto;
    gap:10px;
    max-width:620px;
    margin:0 auto 34px;
    animation:cinematicReveal 0.95s cubic-bezier(.2,.8,.2,1) both 0.58s;
  }
  .movianx-waitlist input{
    min-height:52px;
    border-radius:999px;
    border:1px solid rgba(255,255,255,0.14);
    background:rgba(0,0,0,0.22);
    color:#fff;
    padding:0 18px;
    font-size:15px;
    outline:none;
    box-shadow:inset 0 1px 0 rgba(255,255,255,0.07);
  }
  .movianx-waitlist button{
    min-height:52px;
    border-radius:999px;
    border:1px solid rgba(255,255,255,0.14);
    background:linear-gradient(135deg,#a52121 0%,#741414 100%);
    color:#fff;
    padding:0 22px;
    font-size:15px;
    font-weight:760;
    cursor:pointer;
    box-shadow:0 16px 46px rgba(139,26,26,0.28);
  }
  .movianx-waitlist span{
    grid-column:1/-1;
    color:rgba(255,255,255,0.56);
    font-size:12px;
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
    0%,100%{background-position:center,center,48% 44%,50% 18%,0% 42%,8% 18%,92% 18%,0 0}
    50%{background-position:center,center,54% 52%,46% 24%,100% 56%,18% 32%,78% 24%,0 0}
  }
  @keyframes lightSweep{
    0%,100%{transform:translateX(-20%);opacity:0.42}
    50%{transform:translateX(18%);opacity:0.72}
  }
  @keyframes cinematicReveal{
    from{opacity:0;transform:translateY(26px) scale(0.985);filter:blur(8px)}
    to{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}
  }
  @keyframes logoArrival{
    from{opacity:0;transform:translateY(-14px) scale(0.9);filter:blur(10px)}
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
  @keyframes portalPulse{
    0%,100%{transform:scale(0.96);opacity:0.68}
    50%{transform:scale(1.04);opacity:0.94}
  }
  @keyframes portalFloat{
    0%,100%{margin-top:0}
    50%{margin-top:-9px}
  }
  @keyframes environmentDrift{
    0%,100%{margin-top:0;filter:brightness(0.86) saturate(1.06)}
    50%{margin-top:-14px;filter:brightness(1) saturate(1.16)}
  }
  @media (max-width:760px){
    .movianx-landing-shell{padding:16px;align-items:center}
    .movianx-homepage-environments{inset:116px 0 auto;height:560px;opacity:0.5;overflow:hidden}
    .movianx-environment-panel{width:190px;border-radius:18px}
    .movianx-environment-panel:nth-child(1){left:-28px;top:36px}
    .movianx-environment-panel:nth-child(2){left:220px;top:54px}
    .movianx-environment-panel:nth-child(3){left:-42px;top:344px}
    .movianx-environment-panel:nth-child(4){left:224px;top:358px}
    .movianx-topbar{left:16px;right:auto;width:calc(100% - 32px);max-width:360px;padding:18px 0;gap:12px}
    .movianx-topbar img{height:34px}
    .movianx-nav-actions{gap:8px;min-width:0;flex-shrink:0}
    .movianx-nav-actions button:first-child{font-size:13px!important}
    .movianx-nav-actions .movianx-button{min-height:38px!important;padding:9px 12px!important;font-size:12px!important;white-space:nowrap}
    .movianx-landing-hero{margin-top:96px;padding-bottom:56px;width:100%;max-width:360px;overflow:visible}
    .movianx-landing-title{font-size:clamp(27px,8vw,32px);max-width:300px;margin-left:auto;margin-right:auto;overflow-wrap:normal;line-height:1.08;text-wrap:balance}
    .movianx-landing-copy{font-size:14px;line-height:1.56;margin-left:auto;margin-right:auto;margin-bottom:24px;max-width:294px;text-wrap:pretty}
    .movianx-hero-kicker{font-size:11px;padding:8px 11px}
    .movianx-portal-field{height:500px;margin:8px auto 34px}
    .movianx-portal-field:before{inset:72px 12% 88px}
    .movianx-portal-line{display:none}
    .movianx-portal-button{min-width:150px;min-height:112px;padding:14px;gap:10px;border-radius:16px}
    .movianx-portal-button svg{width:25px;height:25px}
    .movianx-portal-button strong{font-size:16px}
    .movianx-portal-button span{font-size:11px}
    .movianx-portal-top{left:50%;top:13%;min-width:230px}
    .movianx-portal-center{left:50%;top:42%;min-width:250px;min-height:124px}
    .movianx-portal-left{left:25%;top:75%}
    .movianx-portal-right{left:75%;top:75%}
    .movianx-cta-row{gap:10px}
    .movianx-cta-row .movianx-button{width:100%;max-width:310px}
    .movianx-preview-rail{display:flex;overflow-x:auto;gap:12px;margin-bottom:28px;max-width:100%;padding-bottom:8px;scroll-snap-type:x proximity}
    .movianx-preview-card{min-width:220px;scroll-snap-align:start}
    .movianx-waitlist{grid-template-columns:1fr;width:100%;max-width:100%}
    .movianx-waitlist input,
    .movianx-waitlist button{width:100%;min-width:0}
    .movianx-support-grid{grid-template-columns:1fr;padding:12px;border-radius:22px}
    .movianx-support-card{min-height:190px}
  }
  @media (prefers-reduced-motion:reduce){
    .movianx-landing-shell,
    .movianx-landing-shell:before,
    .movianx-topbar,
    .movianx-hero-kicker,
    .movianx-logo-reveal,
    .movianx-landing-title,
    .movianx-landing-copy,
    .movianx-cta-row,
    .movianx-feature-tag,
    .movianx-preview-rail,
    .movianx-waitlist,
    .movianx-support-grid,
    .movianx-orb,
    .movianx-streak,
    .movianx-environment-panel{
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
      <div className="movianx-homepage-environments" aria-hidden="true">
        {LANDING_HERO_ENVIRONMENTS.map(([label, image, left, top, rotate], idx)=>(
          <div
            key={label}
            className="movianx-environment-panel"
            data-label={label}
            style={{
              "--env-image": `url(${image})`,
              "--env-left": left,
              "--env-top": top,
              "--env-rotate": rotate,
              animationDelay: `${idx * 0.7}s`,
            }}
          />
        ))}
      </div>

      <div className="movianx-topbar">
        <img src="/movianx-logo.png" alt="Movianx"/>
        <div className="movianx-nav-actions">
          <button onClick={openConsumerLogin} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.68)",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:FF}}>Login</button>
          <button onClick={openCreatorDashboard} className="movianx-button movianx-button-primary" style={{minHeight:40,padding:"10px 18px",fontSize:14}}>Creator Login</button>
        </div>
      </div>

      <div className="movianx-landing-hero">
        <div className="movianx-logo-reveal"><img src="/movianx-logo.png" alt="" /></div>
        <div className="movianx-hero-kicker">Immersive AI entertainment</div>
        <h1 className="movianx-landing-title">Immersive media powered by AI.</h1>
        <p className="movianx-landing-copy">Experience AI-enhanced entertainment across films, interactive stories, and cinematic worlds designed to feel alive around you.</p>
        <div className="movianx-portal-field" aria-label="Explore Movianx">
          <div className="movianx-portal-line movianx-portal-line-top" />
          <div className="movianx-portal-line movianx-portal-line-left" />
          <div className="movianx-portal-line movianx-portal-line-right" />
          {LANDING_PORTALS.map(([type, title, subtitle, href, position, image, accent])=>(
            <button
              key={type}
              onClick={()=>{ window.location.href = href; }}
              className={`movianx-portal-button movianx-portal-${position}`}
              style={{fontFamily:FF,"--portal-image":`url(${image})`,"--portal-accent":accent}}
            >
              <PortalIcon type={type} />
              <span>
                <strong>{title}</strong>
                <span>{subtitle}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="movianx-preview-rail" aria-label="Cinematic experience previews">
          {LANDING_MOVIE_PREVIEWS.map(([title, label, accent, image])=>(
            <button key={title} onClick={openWatchLibrary} className="movianx-preview-card" style={{"--preview-accent":accent,"--preview-image":`url(${image})`,cursor:"pointer",fontFamily:FF,textAlign:"left"}}>
              <div>
                <strong>{title}</strong>
                <span>{label} · AI Enhanced</span>
              </div>
            </button>
          ))}
        </div>
        <WaitlistCapture FF={FF} />
        <div className="movianx-feature-tags">
          {LANDING_FEATURE_TAGS.map((feature, idx)=>(
            <div key={feature} className="movianx-feature-tag" style={{animationDelay:`${0.56 + idx * 0.055}s`}}>{feature}</div>
          ))}
        </div>
        <div className="movianx-support-grid">
          {LANDING_SUPPORT_CARDS.map(([title, body, image, label, accent])=>(
            <div key={title} className="movianx-support-card" style={{"--support-image":`url(${image})`,"--support-accent":accent}}>
              <span className="movianx-support-card-label">{label}</span>
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
          <button onClick={openWatchLibrary} style={{background:"transparent",border:"none",color:C.text2,fontSize:14,cursor:"pointer",fontFamily:FF}} onMouseEnter={e=>e.target.style.color=C.text} onMouseLeave={e=>e.target.style.color=C.text2}>Watch</button>
          <button onClick={openCreatorDashboard} style={{padding:"10px 20px",borderRadius:20,background:C.accent,border:"none",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:FF}}>Creator Login</button>
        </div>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",padding:"32px 5% 60px"}}>
        <h1 style={{fontSize:"clamp(24px,4vw,40px)",fontWeight:700,color:C.text,marginBottom:8,textAlign:"center",letterSpacing:"-1px",animation:getEntryAnimation(transitionState,"fadeUp 0.8s ease both 0.1s"),opacity:1}}>Explore Movianx Experiences</h1>
        <p style={{fontSize:"clamp(13px,2vw,16px)",color:C.text2,marginBottom:32,textAlign:"center",maxWidth:560,animation:getEntryAnimation(transitionState,"fadeUp 0.8s ease both 0.2s"),opacity:1}}>Preview films, stories, and interactive worlds built for immersive AI-enhanced entertainment.</p>
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
