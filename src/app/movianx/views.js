"use client";

import { useEffect, useState } from "react";
import { getAtmosphereState } from "../../lib/atmosphere";

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

function useAtmosphereDataset(zone) {
  useEffect(() => {
    function applyAtmosphere() {
      document.documentElement.dataset.movianxAtmosphere = getAtmosphereState();
      document.documentElement.dataset.movianxZone = zone;
    }

    applyAtmosphere();
    const timer = window.setInterval(applyAtmosphere, 60000);

    return () => {
      window.clearInterval(timer);
      delete document.documentElement.dataset.movianxZone;
    };
  }, [zone]);
}

const DISCOVER_CARDS = [
  {
    badge: "MOVIES",
    badgeColor: "#b51f2a",
    title: "Cinematic Worlds",
    desc: "Horror, drama, noir and public-domain classics — reimagined with AI.",
    cta: "Explore Movies",
    href: "/watch/movies",
    image: "/images/nosferatu-poster.png",
  },
  {
    badge: "STORIES",
    badgeColor: "#7c3aed",
    title: "Interactive Stories",
    desc: "Timed choices. Branching worlds. Every decision changes the outcome.",
    cta: "Explore Stories",
    href: "/watch/stories",
    image: "/images/stories-library.jpg",
  },
  {
    badge: "MUSIC",
    badgeColor: "#0f766e",
    title: "Wraith The Don",
    desc: "Immersive music experiences. Artists performing live inside the platform.",
    cta: "Explore Music",
    href: "/watch/music",
    image: "/images/wraith/wraith-promo.jpg",
  },
  {
    badge: "CREATORS",
    badgeColor: "#b45309",
    title: "Creator Studio",
    desc: "Build your world on Movianx. AI-enhanced cinema, immersive audio, and direct audience support — creators keep up to 85% of revenue.",
    cta: "Open Creator Studio",
    href: "/dashboard/welcome",
    image: "/images/generated-live/content/world-05-the-record-shop-at-the-end-of-the-world/thumbnail.jpg",
  },
];

const FEATURED_RAIL = [
  {
    badge: "MOVIE",
    badgeColor: "#b51f2a",
    title: "Nosferatu",
    genre: "Classic Horror · Reimagined",
    runtime: "1h 21m",
    image: "/images/nosferatu-poster.png",
    href: "/watch/nosferatu",
  },
  {
    badge: "STORY",
    badgeColor: "#7c3aed",
    title: "10 Seconds",
    genre: "Thriller · Survival Horror",
    runtime: "45 min",
    image: "/images/generated-live/movies/world-01-the-weight-of-silence/poster.jpg",
    href: "/watch/story-3",
  },
  {
    badge: "MUSIC",
    badgeColor: "#0f766e",
    title: "Wraith The Don",
    genre: "Hip-Hop · Live Experience",
    runtime: "Live",
    image: "/images/wraith/portrait.jpg",
    href: "/watch/music",
  },
  {
    badge: "MOVIE",
    badgeColor: "#b51f2a",
    title: "Night of the Living Dead",
    genre: "Classic Horror · 1968",
    runtime: "1h 36m",
    image: "/images/generated-live/movies/movies_psychological-horror_the-hollowing-signal_20260526t003000z_h1k9p4/poster.jpg",
    href: "/watch/night-of-the-living-dead",
  },
  {
    badge: "CREATIVES",
    badgeColor: "#b45309",
    title: "Creator Showcase",
    genre: "Art · Fashion · Books",
    runtime: "Open World",
    image: "/images/generated-live/content/world-05-the-record-shop-at-the-end-of-the-world/thumbnail.jpg",
    href: "/dashboard/welcome",
  },
];

const NAV_LINKS = [
  ["Explore", "/watch"],
  ["Creator Ecosystem", "/dashboard/welcome"],
];

const HERO_PILLS = ["Reimagined Scenes", "Alternate Endings", "Interactive Experiences"];

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
    background:#07070a;
    display:flex;
    flex-direction:column;
    position:relative;
    isolation:isolate;
  }
  .movianx-landing-shell,
  .movianx-landing-shell *{ box-sizing:border-box; }

  /* ── NAV ─────────────────────────────────────────── */
  .mx-nav{
    position:sticky;top:0;left:0;right:0;z-index:50;
    display:flex;align-items:center;justify-content:space-between;
    padding:0 5%;height:64px;
    background:rgba(7,7,10,0.86);
    backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);
    border-bottom:1px solid rgba(255,255,255,0.06);
    animation:mxFadeDown 0.5s ease both;
  }
  .mx-nav-logo{ height:30px;width:auto;filter:brightness(0) invert(1);opacity:0.9;flex-shrink:0; }
  .mx-nav-links{ display:flex;align-items:center;gap:4px;list-style:none;margin:0;padding:0; }
  .mx-nav-links a{
    display:block;padding:7px 13px;
    color:rgba(255,255,255,0.62);font-size:14px;font-weight:500;
    text-decoration:none;border-radius:7px;
    transition:color 160ms ease,background 160ms ease;white-space:nowrap;
  }
  .mx-nav-links a:hover{ color:#fff;background:rgba(255,255,255,0.07); }
  .mx-nav-right{ display:flex;align-items:center;gap:8px;flex-shrink:0; }
  .mx-btn-ghost{
    background:transparent;border:none;color:rgba(255,255,255,0.68);
    font-size:14px;font-weight:500;cursor:pointer;padding:7px 13px;
    border-radius:7px;font-family:inherit;
    transition:color 160ms ease,background 160ms ease;
  }
  .mx-btn-ghost:hover{ color:#fff;background:rgba(255,255,255,0.07); }
  .mx-btn-waitlist{
    background:#c0392b;border:none;color:#fff;
    font-size:14px;font-weight:600;cursor:pointer;
    padding:9px 20px;border-radius:8px;font-family:inherit;
    box-shadow:0 4px 18px rgba(192,57,43,0.38);white-space:nowrap;
    transition:background 160ms ease,box-shadow 160ms ease;
  }
  .mx-btn-waitlist:hover{ background:#d94030;box-shadow:0 6px 24px rgba(192,57,43,0.55); }

  /* ── SECTION 1: HERO ─────────────────────────────── */
  .mx-hero{
    display:grid;grid-template-columns:1fr 1fr;
    gap:0;align-items:stretch;
    min-height:min(72svh,660px);
    max-width:100%;
    overflow:hidden;
    animation:mxFadeUp 0.7s ease both 0.08s;
  }
  .mx-hero-left{
    display:flex;flex-direction:column;justify-content:center;
    padding:72px 6% 72px 8%;
    background:linear-gradient(105deg,#07070a 60%,rgba(20,10,10,0.95) 100%);
    position:relative;z-index:2;
  }
  .mx-featured-eyebrow{
    display:inline-flex;align-items:center;gap:8px;
    color:rgba(255,255,255,0.5);font-size:10.5px;font-weight:700;
    text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;
  }
  .mx-featured-eyebrow-dot{
    width:5px;height:5px;border-radius:50%;
    background:#c0392b;box-shadow:0 0 8px rgba(192,57,43,1);flex-shrink:0;
  }
  .mx-hero-film-title{
    font-size:clamp(52px,6vw,88px);font-weight:900;
    color:#fff;line-height:0.95;
    letter-spacing:-0.04em;margin:0 0 6px;
    text-transform:uppercase;
  }
  .mx-hero-film-sub{
    font-size:15px;font-weight:400;color:rgba(255,255,255,0.45);
    letter-spacing:0.12em;text-transform:uppercase;margin:0 0 28px;
  }
  .mx-hero-copy{
    font-size:15px;color:rgba(255,255,255,0.6);
    line-height:1.72;margin:0 0 28px;max-width:420px;
  }
  .mx-hero-pills{
    display:flex;flex-wrap:wrap;gap:8px;margin-bottom:32px;
  }
  .mx-hero-pill{
    padding:6px 13px;border-radius:999px;
    border:1px solid rgba(255,255,255,0.14);
    background:rgba(255,255,255,0.055);
    color:rgba(255,255,255,0.72);
    font-size:12px;font-weight:500;white-space:nowrap;
  }
  .mx-cta-row{ display:flex;gap:10px;flex-wrap:wrap; }
  .mx-cta-primary{
    display:inline-flex;align-items:center;gap:8px;
    padding:13px 26px;background:#c0392b;color:#fff;
    font-size:15px;font-weight:600;border-radius:8px;border:none;
    cursor:pointer;font-family:inherit;
    box-shadow:0 4px 22px rgba(192,57,43,0.42);
    transition:background 160ms ease,box-shadow 160ms ease,transform 160ms ease;
  }
  .mx-cta-primary:hover{ background:#d94030;box-shadow:0 8px 30px rgba(192,57,43,0.58);transform:translateY(-1px); }
  .mx-cta-secondary{
    display:inline-flex;align-items:center;gap:8px;
    padding:13px 26px;background:rgba(255,255,255,0.07);
    color:rgba(255,255,255,0.82);font-size:15px;font-weight:500;
    border-radius:8px;border:1px solid rgba(255,255,255,0.13);
    cursor:pointer;font-family:inherit;
    transition:background 160ms ease,border-color 160ms ease,transform 160ms ease;
  }
  .mx-cta-secondary:hover{ background:rgba(255,255,255,0.11);border-color:rgba(255,255,255,0.22);transform:translateY(-1px); }

  /* HERO RIGHT — NOSFERATU POSTER */
  .mx-hero-right{
    position:relative;overflow:hidden;
    background:#07070a;
  }
  .mx-nos-poster{
    position:absolute;inset:0;
    background-image:url(/images/nosferatu-poster.png);
    background-size:cover;background-position:center top;
    transition:transform 600ms ease;
  }
  .mx-hero-right:hover .mx-nos-poster{ transform:scale(1.03); }
  .mx-nos-vignette{
    position:absolute;inset:0;
    background:
      linear-gradient(to right,rgba(7,7,10,0.72) 0%,rgba(7,7,10,0.1) 40%,transparent 70%),
      linear-gradient(to top,rgba(7,7,10,0.5) 0%,transparent 50%);
    pointer-events:none;
  }
  .mx-nos-credit{
    position:absolute;bottom:28px;right:28px;
    font-size:10px;font-weight:600;letter-spacing:1.6px;text-transform:uppercase;
    color:rgba(255,255,255,0.32);
  }

  /* ── SECTION 2: VIDEO TEASER ─────────────────────── */
  .mx-teaser{
    position:relative;width:100%;
    background:#000;overflow:hidden;
    max-height:540px;
    animation:mxFadeUp 0.7s ease both 0.2s;
  }
  .mx-teaser-video{
    width:100%;display:block;
    max-height:540px;object-fit:cover;object-position:center;
  }
  .mx-teaser-overlay{
    position:absolute;inset:0;
    background:
      linear-gradient(to bottom,rgba(7,7,10,0.28) 0%,transparent 30%,transparent 60%,rgba(7,7,10,0.55) 100%),
      linear-gradient(to right,rgba(7,7,10,0.18),transparent 50%,rgba(7,7,10,0.18));
    pointer-events:none;
  }
  .mx-teaser-label{
    position:absolute;bottom:28px;left:5%;
    display:flex;align-items:center;gap:10px;
  }
  .mx-teaser-badge{
    padding:4px 10px;border-radius:4px;
    background:#c0392b;color:#fff;
    font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;
  }
  .mx-teaser-title{
    color:rgba(255,255,255,0.82);font-size:14px;font-weight:600;letter-spacing:0.02em;
  }
  .mx-teaser-poster-fallback{
    display:none;
    width:100%;max-height:420px;object-fit:cover;
  }

  /* ── SECTION DIVIDER ─────────────────────────────── */
  .mx-divider{
    height:1px;
    background:linear-gradient(to right,transparent,rgba(255,255,255,0.08) 30%,rgba(255,255,255,0.08) 70%,transparent);
    margin:0 5%;
  }

  /* ── SECTION 3: DISCOVER ─────────────────────────── */
  .mx-discover{
    max-width:1280px;margin:0 auto;
    padding:72px 5% 56px;
    animation:mxFadeUp 0.7s ease both 0.3s;
  }
  .mx-section-header{
    display:flex;justify-content:space-between;align-items:baseline;
    margin-bottom:28px;
  }
  .mx-section-title{
    font-size:22px;font-weight:700;color:#fff;margin:0;
    letter-spacing:-0.03em;
  }
  .mx-section-sub{
    font-size:13px;color:rgba(255,255,255,0.38);margin:4px 0 0;
    letter-spacing:0.01em;
  }
  .mx-view-all{
    font-size:12.5px;font-weight:500;color:rgba(255,255,255,0.38);
    text-decoration:none;transition:color 160ms ease;white-space:nowrap;
    padding:6px 12px;border-radius:6px;border:1px solid rgba(255,255,255,0.1);
  }
  .mx-view-all:hover{ color:rgba(255,255,255,0.8);border-color:rgba(255,255,255,0.2); }
  .mx-discover-grid{
    display:grid;grid-template-columns:repeat(4,1fr);gap:16px;
  }
  .mx-disc-card{
    position:relative;display:flex;flex-direction:column;justify-content:flex-end;
    border-radius:14px;overflow:hidden;height:400px;
    border:1px solid rgba(255,255,255,0.07);cursor:pointer;text-decoration:none;
    background:#0e0e11;
    box-shadow:0 8px 40px rgba(0,0,0,0.6);
    transition:transform 300ms cubic-bezier(.2,.8,.2,1),border-color 300ms ease,box-shadow 300ms ease;
  }
  .mx-disc-card:hover{
    transform:translateY(-6px) scale(1.01);
    border-color:rgba(255,255,255,0.15);
    box-shadow:0 28px 70px rgba(0,0,0,0.7);
  }
  .mx-disc-img{
    position:absolute;inset:0;
    background-size:cover;background-position:center top;
    transition:transform 500ms cubic-bezier(.2,.8,.2,1);
  }
  .mx-disc-card:hover .mx-disc-img{ transform:scale(1.06); }
  .mx-disc-overlay{
    position:absolute;inset:0;
    background:
      linear-gradient(to bottom,rgba(0,0,0,0.0) 0%,rgba(0,0,0,0.15) 30%,rgba(0,0,0,0.72) 65%,rgba(0,0,0,0.95) 100%);
  }
  .mx-disc-body{
    position:relative;padding:22px 20px 20px;
    display:flex;flex-direction:column;gap:8px;
  }
  .mx-disc-badge{
    display:inline-flex;align-self:flex-start;
    padding:3px 9px;border-radius:4px;
    font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:1.4px;color:#fff;
    margin-bottom:2px;
  }
  .mx-disc-title{
    font-size:20px;font-weight:700;color:#fff;line-height:1.1;margin:0;
    letter-spacing:-0.02em;
  }
  .mx-disc-desc{
    font-size:12px;color:rgba(255,255,255,0.52);line-height:1.52;margin:0;
    display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
  }
  .mx-disc-cta{
    display:inline-flex;align-items:center;gap:5px;margin-top:6px;
    font-size:12px;font-weight:600;color:rgba(255,255,255,0.65);
    transition:color 160ms ease,gap 160ms ease;
  }
  .mx-disc-card:hover .mx-disc-cta{ color:#fff;gap:8px; }

  /* ── HOW MOVIANX WORKS ──────────────────────────── */
  .mx-how{
    max-width:1280px;margin:0 auto;
    padding:72px 5% 56px;
    animation:mxFadeUp 0.7s ease both 0.35s;
  }
  .mx-how-steps{
    display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:8px;
  }
  .mx-how-step{
    background:rgba(255,255,255,0.035);
    border:1px solid rgba(255,255,255,0.07);
    border-radius:14px;padding:28px 24px;
  }
  .mx-how-num{
    font-size:11px;font-weight:800;letter-spacing:3px;
    color:rgba(192,57,43,0.8);text-transform:uppercase;
    display:block;margin-bottom:12px;
  }
  .mx-how-step h3{
    font-size:17px;font-weight:700;color:#fff;
    margin:0 0 10px;letter-spacing:-0.02em;
  }
  .mx-how-step p{
    font-size:13px;color:rgba(255,255,255,0.5);
    line-height:1.65;margin:0;
  }
  @media(max-width:768px){
    .mx-how-steps{ grid-template-columns:1fr; }
    .mx-how{ padding:48px 5% 36px; }
  }

  /* ── FEATURED RAIL ───────────────────────────────── */
  .mx-featured{
    max-width:1280px;margin:0 auto;
    padding:0 5% 96px;
    animation:mxFadeUp 0.7s ease both 0.4s;
  }
  .mx-rail{ display:grid;grid-template-columns:repeat(5,1fr);gap:14px; }
  .mx-exp-card{
    position:relative;display:flex;flex-direction:column;
    border-radius:10px;overflow:hidden;cursor:pointer;text-decoration:none;
    border:1px solid rgba(255,255,255,0.07);background:#0e0e11;
    transition:transform 260ms ease,border-color 260ms ease,box-shadow 260ms ease;
    box-shadow:0 4px 20px rgba(0,0,0,0.48);
  }
  .mx-exp-card:hover{ transform:translateY(-4px);border-color:rgba(255,255,255,0.14);box-shadow:0 14px 40px rgba(0,0,0,0.65); }
  .mx-exp-thumb{
    position:relative;aspect-ratio:16/10;
    background-size:cover;background-position:center;overflow:hidden;
  }
  .mx-exp-thumb img{ width:100%;height:100%;object-fit:cover;display:block; }
  .mx-exp-thumb-overlay{ position:absolute;inset:0;background:linear-gradient(to bottom,transparent 45%,rgba(0,0,0,0.6) 100%); }
  .mx-exp-badge{
    position:absolute;top:10px;left:10px;
    padding:3px 7px;border-radius:4px;
    font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#fff;
  }
  .mx-exp-info{ padding:12px 13px 14px;display:flex;flex-direction:column;gap:4px;background:#0e0e11; }
  .mx-exp-title{ font-size:13px;font-weight:700;color:#fff;margin:0;line-height:1.25;letter-spacing:-0.01em; }
  .mx-exp-meta{
    font-size:11px;color:rgba(255,255,255,0.38);margin:0;
    display:flex;gap:6px;align-items:center;
  }
  .mx-exp-meta-sep{ width:2px;height:2px;border-radius:50%;background:rgba(255,255,255,0.24);flex-shrink:0; }

  /* ── KEYFRAMES ───────────────────────────────────── */
  @keyframes mxFadeDown{ from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes mxFadeUp{ from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }

  /* ── RESPONSIVE ──────────────────────────────────── */
  @media (max-width:1024px){
    .mx-hero{ grid-template-columns:1fr;min-height:auto; }
    .mx-hero-right{ height:55vw;min-height:320px; }
    .mx-nos-vignette{ background:linear-gradient(to top,rgba(7,7,10,0.7) 0%,transparent 55%); }
    .mx-hero-left{ padding:56px 5%; }
    .mx-hero-film-title{ font-size:clamp(48px,8vw,72px); }
    .mx-discover-grid{ grid-template-columns:repeat(2,1fr);gap:12px; }
    .mx-disc-card{ height:320px; }
    .mx-rail{ grid-template-columns:repeat(3,1fr); }
    .mx-nav-links{ display:none; }
  }
  @media (max-width:600px){
    .mx-hero-left{ padding:40px 5%; }
    .mx-hero-film-title{ font-size:clamp(40px,11vw,60px); }
    .mx-discover-grid{ grid-template-columns:1fr 1fr;gap:10px; }
    .mx-disc-card{ height:260px; }
    .mx-disc-title{ font-size:16px; }
    .mx-rail{ display:flex;overflow-x:auto;gap:12px;padding-bottom:8px;scroll-snap-type:x proximity; }
    .mx-exp-card{ min-width:190px;scroll-snap-align:start; }
    .mx-btn-ghost{ display:none; }
    .mx-teaser{ display:block;max-height:320px; }
    .mx-teaser-video{ position:relative;z-index:1;max-height:320px;object-position:center 20%; }
    .mx-teaser-poster-fallback{ display:block;position:absolute;inset:0;width:100%;height:100%;max-height:none;object-fit:cover;z-index:0; }
    .mx-discover{ padding:48px 5% 36px; }
    .mx-featured{ padding:0 5% 64px; }
  }
  @media (prefers-reduced-motion:reduce){
    .mx-nav,.mx-hero,.mx-teaser,.mx-discover,.mx-featured{ animation:none!important; }
    .mx-disc-card,.mx-exp-card,.mx-disc-img,.mx-nos-poster{ transition:none!important; }
  }

  /* ── REVENUE BADGE ─────────────────────────── */
  .mx-revenue-badge{
    display:inline-flex;align-items:center;gap:8px;
    margin-top:14px;padding:8px 14px;
    background:rgba(192,57,43,0.12);
    border:1px solid rgba(192,57,43,0.28);
    border-radius:8px;
  }
  .mx-revenue-num{
    font-size:22px;font-weight:900;color:#c0392b;letter-spacing:-0.03em;
  }
  .mx-revenue-label{
    font-size:12px;color:rgba(255,255,255,0.55);font-weight:500;line-height:1.3;
  }

  /* ── WAITLIST SECTION ──────────────────────── */
  .mx-waitlist-section{
    max-width:1280px;margin:0 auto;
    padding:48px 5% 96px;
    animation:mxFadeUp 0.7s ease both 0.5s;
  }
  .mx-waitlist-inner{
    background:rgba(255,255,255,0.03);
    border:1px solid rgba(255,255,255,0.07);
    border-radius:16px;
    padding:40px 48px;
    display:flex;align-items:center;justify-content:space-between;gap:40px;
    flex-wrap:wrap;
  }
  .mx-waitlist-copy h2{
    font-size:22px;font-weight:700;color:#fff;margin:0 0 6px;letter-spacing:-0.02em;
  }
  .mx-waitlist-copy p{
    font-size:13px;color:rgba(255,255,255,0.45);margin:0;
  }
  @media(max-width:640px){
    .mx-waitlist-inner{ padding:28px 24px;flex-direction:column;align-items:flex-start;gap:24px; }
  }
`;

export function LandingView({ C, FF, CSS, transitionState, navigateTo }) {
  useAtmosphereDataset("home");

  return (
    <div className="movianx-landing-shell" style={{fontFamily:FF,...getViewTransition(transitionState)}}>

      {/* ── SECTION 1: NAV ─────────────────────────────────────── */}
      <nav className="mx-nav" aria-label="Main navigation">
        <img src="/movianx-logo.png" alt="Movianx" className="mx-nav-logo" />
        <ul className="mx-nav-links">
          {NAV_LINKS.map(([label, href]) => (
            <li key={label}><a href={href}>{label}</a></li>
          ))}
        </ul>
        <div className="mx-nav-right">
          <button className="mx-btn-ghost" style={{fontFamily:FF}} onClick={openConsumerLogin}>Watch Free</button>
          <button className="mx-btn-waitlist" style={{fontFamily:FF}} onClick={()=>{ const el=document.getElementById("waitlist-section"); if(el) el.scrollIntoView({behavior:"smooth"}); else window.location.href="/watch#early-access"; }}>Join Waitlist</button>
        </div>
      </nav>

      {/* ── SECTION 1: HERO — NOSFERATU ────────────────────────── */}
      <section className="mx-hero" aria-label="Featured experience: Nosferatu">
        {/* LEFT: copy + CTAs */}
        <div className="mx-hero-left">
          <div className="mx-featured-eyebrow">
            <span className="mx-featured-eyebrow-dot" aria-hidden="true" />
            Interactive Entertainment
          </div>
          <h1 className="mx-hero-film-title">Movianx</h1>
          <p className="mx-hero-film-sub">Now featuring: Nosferatu</p>
          <p className="mx-hero-copy">
            Movianx transforms films, stories, music, and creative works into interactive experiences through alternate paths, reimagined scenes, alternate endings, and entirely new possibilities.
          </p>
          <div className="mx-hero-pills">
            {HERO_PILLS.map(pill => (
              <span key={pill} className="mx-hero-pill">{pill}</span>
            ))}
          </div>
          <div className="mx-cta-row">
            <button className="mx-cta-primary" style={{fontFamily:FF}} onClick={()=>{ window.location.href="/watch"; }}>
              Explore Platform
            </button>
            <button className="mx-cta-secondary" style={{fontFamily:FF}} onClick={()=>{ window.location.href="/watch/nosferatu"; }}>
              Watch Nosferatu
            </button>
          </div>
        </div>

        {/* RIGHT: Nosferatu poster art */}
        <div className="mx-hero-right" aria-hidden="true">
          <div className="mx-nos-poster" />
          <div className="mx-nos-vignette" />
          <span className="mx-nos-credit">1922 · F.W. Murnau · Reimagined</span>
        </div>
      </section>

      {/* ── SECTION 2: NOSFERATU TEASER VIDEO ──────────────────── */}
      <section className="mx-teaser" aria-label="Nosferatu teaser">
        <video
          className="mx-teaser-video"
          src="/images/nosferatu-teaser.mov"
          poster="/images/nosferatu-poster.png"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <img
          className="mx-teaser-poster-fallback"
          src="/images/nosferatu-poster.png"
          alt="Nosferatu"
        />
        <div className="mx-teaser-overlay" />
        <div className="mx-teaser-label">
          <span className="mx-teaser-badge">Movie</span>
          <span className="mx-teaser-title">Nosferatu — Now Available</span>
        </div>
      </section>

      {/* ── SECTION 3: DISCOVER EXPERIENCES ────────────────────── */}
      <div className="mx-divider" aria-hidden="true" />
      <section className="mx-discover">
        <div className="mx-section-header">
          <div>
            <h2 className="mx-section-title">Discover Experiences</h2>
            <p className="mx-section-sub">Four worlds. One platform.</p>
          </div>
          <a href="/watch" className="mx-view-all">View All</a>
        </div>
        <div className="mx-discover-grid">
          {DISCOVER_CARDS.map(card => (
            <a key={card.badge} href={card.href} className="mx-disc-card" aria-label={card.title}>
              <div className="mx-disc-img" style={{backgroundImage:`url(${card.image})`}} />
              <div className="mx-disc-overlay" />
              <div className="mx-disc-body">
                <span className="mx-disc-badge" style={{background:card.badgeColor}}>{card.badge}</span>
                <p className="mx-disc-title">{card.title}</p>
                <p className="mx-disc-desc">{card.desc}</p>
                <span className="mx-disc-cta">{card.cta} →</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── HOW MOVIANX WORKS ───────────────────────────────────── */}
      <div className="mx-divider" aria-hidden="true" />
      <section className="mx-how" aria-label="How Movianx works">
        <div className="mx-section-header">
          <div>
            <h2 className="mx-section-title">How Movianx Works</h2>
            <p className="mx-section-sub">One platform. Films, stories, music, and creators — all interactive.</p>
          </div>
        </div>
        <div className="mx-how-steps">
          <div className="mx-how-step">
            <span className="mx-how-num">01</span>
            <h3>Choose Your Experience</h3>
            <p>Browse films, interactive stories, music experiences, and creator worlds — all in one place.</p>
          </div>
          <div className="mx-how-step">
            <span className="mx-how-num">02</span>
            <h3>Enter a Living World</h3>
            <p>AI-enhanced audio, branching choices, timed decisions, and reimagined scenes transform passive watching into active experience.</p>
          </div>
          <div className="mx-how-step mx-how-step-revenue">
            <span className="mx-how-num">03</span>
            <h3>Support Creators Directly</h3>
            <p>Tip, buy merch, or subscribe — all without leaving the experience.</p>
            <div className="mx-revenue-badge">
              <span className="mx-revenue-num">85%</span>
              <span className="mx-revenue-label">of revenue goes to creators</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED RAIL ───────────────────────────────────────── */}
      <div className="mx-divider" aria-hidden="true" />
      <section className="mx-featured">
        <div className="mx-section-header" style={{paddingTop:48}}>
          <div>
            <h2 className="mx-section-title">Featured Experiences</h2>
            <p className="mx-section-sub">Handpicked for tonight.</p>
          </div>
          <a href="/watch" className="mx-view-all">View All</a>
        </div>
        <div className="mx-rail">
          {FEATURED_RAIL.map(exp => (
            <a key={exp.title} href={exp.href} className="mx-exp-card" aria-label={exp.title}>
              <div className="mx-exp-thumb" style={{backgroundImage:`url(${exp.image})`}}>
                <div className="mx-exp-thumb-overlay" />
                <span className="mx-exp-badge" style={{background:exp.badgeColor}}>{exp.badge}</span>
              </div>
              <div className="mx-exp-info">
                <p className="mx-exp-title">{exp.title}</p>
                <p className="mx-exp-meta">
                  <span>{exp.genre}</span>
                  <span className="mx-exp-meta-sep" />
                  <span>{exp.runtime}</span>
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── WAITLIST SECTION ────────────────────────────────────── */}
      <div className="mx-divider" aria-hidden="true" />
      <section id="waitlist-section" className="mx-waitlist-section" aria-label="Join the early access waitlist">
        <div className="mx-waitlist-inner">
          <div className="mx-waitlist-copy">
            <h2>Get early access.</h2>
            <p>Privacy-first updates. No spam. Creator paths stay separate from the viewer experience.</p>
          </div>
          <WaitlistCapture FF={FF} />
        </div>
      </section>

      <style>{CSS}</style>
      <style>{landingCinematicCSS}</style>
    </div>
  );
}

export function HomeView({ C, FF, CSS, transitionState, navigateTo }) {
  return <LandingView C={C} FF={FF} CSS={CSS} transitionState={transitionState} navigateTo={navigateTo} />;
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
