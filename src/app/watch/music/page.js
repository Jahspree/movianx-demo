"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import styles from "../watch.module.css";
import AtmosphereBridge from "../AtmosphereBridge";

// ─── UNIQUE ARTWORK ASSIGNMENT TABLE ──────────────────────────────────────────
// Wraith The Don — Featured Artist        → /images/wraith/portrait.jpg
// Parallel Us — Album Cover               → /images/wraith/parallel-us.png
// Sirens — Experience Poster              → /images/wraith/performance-red.png
// Artist Portrait                         → /images/wraith/portrait.jpg
// Studio Sessions card                    → /images/wraith/studio-red.png
// Lifestyle card                          → /images/wraith/yacht.png
// Crew / Behind The Scenes card           → /images/wraith/crew.png
// Echoes in Orbit (existing)              → existing generated-live poster
// Velvet Static (existing)                → existing music image
// The Quiet Frequency (existing)          → existing generated-live poster
// ──────────────────────────────────────────────────────────────────────────────

const STREAMING_LINKS = [
  {
    label: "Listen on Spotify",
    icon: "spotify",
    href: "https://open.spotify.com/artist/wraiththedonsearch",
    color: "#1DB954",
  },
  {
    label: "Listen on Apple Music",
    icon: "apple",
    href: "https://music.apple.com/us/album/parallel-us-single/1852075302",
    color: "#fc3c44",
  },
  {
    label: "Watch on YouTube",
    icon: "youtube",
    href: "https://www.youtube.com/results?search_query=wraith+the+don",
    color: "#FF0000",
  },
  {
    label: "Artist Profile",
    icon: "profile",
    href: "/watch/music",
    color: "#fff",
  },
];

const WRAITH_COLLECTION = [
  {
    id: "sirens",
    title: "Sirens",
    type: "MUSIC EXPERIENCE",
    typeColor: "#0f766e",
    desc: "A cinematic audio-visual experience. Autoplay video with spatial audio.",
    image: "/images/sirens/sirensposter.png",
    href: "/watch/sirens",
    isNew: true,
  },
  {
    id: "parallel-us",
    title: "Parallel Us",
    type: "ALBUM",
    typeColor: "#7c3aed",
    desc: "The debut album. 12 tracks exploring love, loss, and parallel lives.",
    image: "/images/wraith/parallel-us.png",
    href: "#parallel-us",
  },
  {
    id: "studio",
    title: "Studio Sessions",
    type: "BEHIND THE SCENES",
    typeColor: "#b45309",
    desc: "Inside the creative process. Exclusive creator content for supporters.",
    image: "/images/wraith/studio-red.png",
    href: "#studio",
  },
];

const SIMILAR_SOUNDS = [
  {
    id: "echoes-in-orbit",
    title: "Echoes in Orbit",
    type: "MUSIC",
    typeColor: "#0f766e",
    desc: "Spatial audio release. Memory drifts through signal.",
    image: "/images/generated-live/music/music_ambient-dreamlike_the-quiet-frequency_20260526t003500z_e4n7r2/poster.jpg",
    href: "/watch/music-echoes-in-orbit",
  },
  {
    id: "velvet-static",
    title: "Velvet Static",
    type: "MUSIC",
    typeColor: "#334155",
    desc: "The room hums back. A late-night electronic world.",
    image: "/images/music/velvet-static.jpg",
    href: "/watch/music-velvet-static",
  },
  {
    id: "quiet-frequency",
    title: "The Quiet Frequency",
    type: "MUSIC",
    typeColor: "#1e40af",
    desc: "A piano holds the rain still. Ambient world for slow evenings.",
    image: "/images/music/blackout-frequency.jpg",
    href: "/watch/music_ambient-dreamlike_the-quiet-frequency_20260526t003500z_e4n7r2",
  },
];

// Legacy combined export kept for any remaining single-list render paths
const MUSIC_CATALOG = [...WRAITH_COLLECTION, ...SIMILAR_SOUNDS];

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.516 17.31c-.213.343-.667.453-1.01.24-2.766-1.69-6.25-2.072-10.35-1.135-.395.09-.79-.156-.88-.55-.09-.396.155-.79.55-.88 4.487-1.025 8.336-.584 11.44 1.316.344.213.453.667.25 1.01zm1.472-3.272c-.27.43-.84.57-1.27.3-3.165-1.945-7.99-2.508-11.73-1.373-.484.146-.995-.13-1.14-.612-.145-.484.13-.994.613-1.14 4.278-1.3 9.59-.67 13.23 1.566.43.27.57.84.3 1.27v-.01zm.126-3.41C15.56 8.65 9.77 8.47 6.29 9.53c-.58.175-1.19-.155-1.365-.732-.175-.578.155-1.19.732-1.365 4.015-1.22 10.69-.985 14.9 1.54.518.308.688.975.38 1.493-.308.518-.975.688-1.493.38l-.33-.016z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function StreamingIcon({ icon }) {
  if (icon === "spotify") return <SpotifyIcon />;
  if (icon === "apple") return <AppleIcon />;
  if (icon === "youtube") return <YouTubeIcon />;
  return <UserIcon />;
}

function SirensPlayer() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  function handleToggle() {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
      setPlaying(false);
    } else {
      v.muted = false;
      setMuted(false);
      v.play().then(() => setPlaying(true)).catch(() => {
        v.muted = true;
        setMuted(true);
        v.play().then(() => setPlaying(true));
      });
    }
  }

  return (
    <div style={{position:"relative",borderRadius:14,overflow:"hidden",background:"#0a0a0c",border:"1px solid rgba(255,255,255,0.1)",boxShadow:"0 16px 60px rgba(0,0,0,0.7)"}}>
      <video
        ref={videoRef}
        src="/images/sirens/sirens.mp4"
        poster="/images/sirens/sirensposter.png"
        loop
        playsInline
        muted={muted}
        style={{width:"100%",display:"block",aspectRatio:"16/9",objectFit:"cover"}}
        aria-label="Sirens — Wraith The Don music video"
      />
      {/* Overlay */}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.6) 0%,transparent 50%)",pointerEvents:"none"}} />
      {/* Controls */}
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <button
          onClick={handleToggle}
          aria-label={playing ? "Pause Sirens" : "Play Sirens"}
          style={{
            width:64,height:64,borderRadius:"50%",
            background:playing ? "rgba(0,0,0,0.4)" : "rgba(192,57,43,0.9)",
            border:"2px solid rgba(255,255,255,0.3)",
            color:"#fff",fontSize:22,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",
            transition:"all 200ms ease",
            boxShadow: playing ? "none" : "0 0 40px rgba(192,57,43,0.5)",
          }}
        >
          {playing ? "⏸" : "▶"}
        </button>
      </div>
      {/* Bottom label */}
      <div style={{position:"absolute",bottom:16,left:20,right:20,display:"flex",justifyContent:"space-between",alignItems:"flex-end",pointerEvents:"none"}}>
        <div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"1.4px",marginBottom:4}}>Now Playing</div>
          <div style={{fontSize:16,fontWeight:700,color:"#fff"}}>Sirens</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.55)"}}>Wraith The Don</div>
        </div>
        {muted && playing && (
          <div style={{fontSize:11,color:"rgba(255,255,255,0.45)",padding:"4px 8px",borderRadius:4,background:"rgba(0,0,0,0.5)"}}>Tap to unmute</div>
        )}
      </div>
    </div>
  );
}

const musicPageCSS = `
  .mx-music-shell{
    min-height:100svh;width:100%;overflow-x:hidden;
    background:#07070a;color:#fff;
    font-family:"SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  }
  .mx-music-shell,
  .mx-music-shell *{ box-sizing:border-box; }

  /* ── ARTIST HERO ─────────────────────────────────── */
  .mx-music-hero{
    position:relative;min-height:100svh;
    display:grid;grid-template-columns:1fr 1fr;
    overflow:hidden;
  }
  .mx-music-hero-left{
    display:flex;flex-direction:column;justify-content:flex-end;
    padding:80px 5% 72px 8%;
    background:linear-gradient(105deg,#07070a 58%,rgba(15,10,10,0.94) 100%);
    position:relative;z-index:2;
  }
  .mx-music-eyebrow{
    display:inline-flex;align-items:center;gap:8px;
    color:rgba(255,255,255,0.5);font-size:10.5px;font-weight:700;
    text-transform:uppercase;letter-spacing:2px;margin-bottom:12px;
  }
  .mx-music-eyebrow-dot{
    width:5px;height:5px;border-radius:50%;
    background:#0f766e;box-shadow:0 0 8px rgba(15,118,110,1);flex-shrink:0;
  }
  .mx-music-artist-name{
    font-size:clamp(52px,6vw,90px);font-weight:900;color:#fff;
    line-height:0.94;letter-spacing:-0.04em;margin:0 0 6px;
    text-transform:uppercase;
  }
  .mx-music-release-name{
    font-size:16px;font-weight:500;color:rgba(255,255,255,0.48);
    letter-spacing:0.14em;text-transform:uppercase;margin:0 0 24px;
  }
  .mx-music-artist-bio{
    font-size:15px;color:rgba(255,255,255,0.62);
    line-height:1.72;max-width:420px;margin:0 0 36px;
  }
  .mx-music-hero-ctas{
    display:flex;gap:10px;flex-wrap:wrap;margin-bottom:40px;
  }
  .mx-music-cta-primary{
    display:inline-flex;align-items:center;gap:8px;
    padding:12px 24px;background:#c0392b;color:#fff;
    font-size:14px;font-weight:600;border-radius:8px;border:none;
    cursor:pointer;text-decoration:none;
    box-shadow:0 4px 20px rgba(192,57,43,0.4);
    transition:background 160ms ease,transform 160ms ease;
  }
  .mx-music-cta-primary:hover{ background:#d94030;transform:translateY(-1px); }
  .mx-music-cta-secondary{
    display:inline-flex;align-items:center;gap:8px;
    padding:12px 24px;background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.82);
    font-size:14px;font-weight:500;border-radius:8px;border:1px solid rgba(255,255,255,0.13);
    cursor:pointer;text-decoration:none;
    transition:background 160ms ease,border-color 160ms ease;
  }
  .mx-music-cta-secondary:hover{ background:rgba(255,255,255,0.11);border-color:rgba(255,255,255,0.22); }

  /* STREAMING LINKS */
  .mx-music-streaming{
    display:flex;flex-direction:column;gap:8px;
  }
  .mx-music-streaming-label{
    font-size:10px;font-weight:700;text-transform:uppercase;
    letter-spacing:2px;color:rgba(255,255,255,0.35);margin-bottom:2px;
  }
  .mx-music-streaming-row{
    display:flex;flex-wrap:wrap;gap:8px;
  }
  .mx-stream-btn{
    display:inline-flex;align-items:center;gap:7px;
    padding:9px 16px;border-radius:8px;
    background:rgba(255,255,255,0.06);
    border:1px solid rgba(255,255,255,0.1);
    color:rgba(255,255,255,0.82);
    font-size:13px;font-weight:500;
    text-decoration:none;cursor:pointer;
    transition:background 160ms ease,border-color 160ms ease,transform 160ms ease;
    white-space:nowrap;
  }
  .mx-stream-btn:hover{ background:rgba(255,255,255,0.11);border-color:rgba(255,255,255,0.22);transform:translateY(-1px); }
  .mx-stream-btn-icon{ flex-shrink:0; }

  /* HERO RIGHT — POSTER */
  .mx-music-hero-right{
    position:relative;overflow:hidden;background:#07070a;
  }
  .mx-music-hero-img{
    position:absolute;inset:0;
    background-image:url(/images/wraith/portrait.jpg);
    background-size:cover;background-position:center top;
    transition:transform 600ms ease;
  }
  .mx-music-hero-right:hover .mx-music-hero-img{ transform:scale(1.03); }
  .mx-music-hero-vignette{
    position:absolute;inset:0;
    background:
      linear-gradient(to right,rgba(7,7,10,0.7) 0%,rgba(7,7,10,0.1) 40%,transparent 70%),
      linear-gradient(to top,rgba(7,7,10,0.5) 0%,transparent 50%);
    pointer-events:none;
  }
  .mx-music-hero-credit{
    position:absolute;bottom:28px;right:28px;
    font-size:10px;font-weight:600;letter-spacing:1.4px;
    text-transform:uppercase;color:rgba(255,255,255,0.28);
  }

  /* ── SIRENS SECTION ──────────────────────────────── */
  .mx-sirens-section{
    max-width:1280px;margin:0 auto;padding:80px 5%;
  }
  .mx-sirens-grid{
    display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;
  }
  .mx-sirens-info{
    display:flex;flex-direction:column;gap:0;
  }
  .mx-sirens-eyebrow{
    font-size:10.5px;font-weight:700;text-transform:uppercase;
    letter-spacing:2px;color:rgba(255,255,255,0.42);margin-bottom:14px;
  }
  .mx-sirens-title{
    font-size:clamp(36px,4vw,56px);font-weight:800;color:#fff;
    letter-spacing:-0.03em;line-height:1;margin:0 0 6px;
    text-transform:uppercase;
  }
  .mx-sirens-subtitle{
    font-size:14px;color:rgba(255,255,255,0.4);
    letter-spacing:0.1em;text-transform:uppercase;margin:0 0 22px;
  }
  .mx-sirens-desc{
    font-size:15px;color:rgba(255,255,255,0.6);
    line-height:1.72;max-width:400px;margin:0 0 28px;
  }
  .mx-sirens-tags{
    display:flex;gap:8px;flex-wrap:wrap;margin-bottom:28px;
  }
  .mx-sirens-tag{
    padding:5px 12px;border-radius:999px;
    border:1px solid rgba(255,255,255,0.12);
    background:rgba(255,255,255,0.05);
    color:rgba(255,255,255,0.65);
    font-size:12px;font-weight:500;
  }
  .mx-sirens-cta{
    display:inline-flex;align-items:center;gap:8px;
    padding:12px 24px;background:rgba(15,118,110,0.8);color:#fff;
    font-size:14px;font-weight:600;border-radius:8px;border:none;
    cursor:pointer;text-decoration:none;
    transition:background 160ms ease,transform 160ms ease;
    align-self:flex-start;
  }
  .mx-sirens-cta:hover{ background:#0f766e;transform:translateY(-1px); }

  /* ── MUSIC CATALOG ───────────────────────────────── */
  .mx-catalog-section{
    max-width:1280px;margin:0 auto;padding:0 5% 96px;
  }
  .mx-catalog-header{
    display:flex;justify-content:space-between;align-items:baseline;
    margin-bottom:28px;
  }
  .mx-catalog-title{ font-size:22px;font-weight:700;color:#fff;margin:0;letter-spacing:-0.03em; }
  .mx-catalog-sub{ font-size:13px;color:rgba(255,255,255,0.38);margin:4px 0 0; }
  .mx-catalog-grid{
    display:grid;grid-template-columns:repeat(3,1fr);gap:16px;
  }
  .mx-catalog-card{
    position:relative;display:flex;flex-direction:column;justify-content:flex-end;
    border-radius:12px;overflow:hidden;
    height:320px;
    border:1px solid rgba(255,255,255,0.07);
    cursor:pointer;text-decoration:none;
    background:#0e0e11;
    box-shadow:0 8px 36px rgba(0,0,0,0.6);
    transition:transform 300ms ease,border-color 300ms ease,box-shadow 300ms ease;
  }
  .mx-catalog-card:hover{
    transform:translateY(-5px);
    border-color:rgba(255,255,255,0.15);
    box-shadow:0 22px 60px rgba(0,0,0,0.7);
  }
  .mx-catalog-img{
    position:absolute;inset:0;
    background-size:cover;background-position:center;
    transition:transform 500ms ease;
  }
  .mx-catalog-card:hover .mx-catalog-img{ transform:scale(1.04); }
  .mx-catalog-overlay{
    position:absolute;inset:0;
    background:linear-gradient(to bottom,rgba(0,0,0,0.04) 0%,rgba(0,0,0,0.18) 35%,rgba(0,0,0,0.88) 100%);
  }
  .mx-catalog-body{
    position:relative;padding:20px;
    display:flex;flex-direction:column;gap:7px;
  }
  .mx-catalog-new{
    display:inline-flex;align-self:flex-start;
    padding:2px 8px;border-radius:3px;
    background:#c0392b;color:#fff;
    font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1.4px;
    margin-bottom:2px;
  }
  .mx-catalog-type{
    display:inline-flex;align-self:flex-start;
    padding:3px 9px;border-radius:4px;
    font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:#fff;
  }
  .mx-catalog-name{ font-size:18px;font-weight:700;color:#fff;line-height:1.1;margin:0;letter-spacing:-0.02em; }
  .mx-catalog-desc{ font-size:12px;color:rgba(255,255,255,0.5);line-height:1.5;margin:0; }

  /* ── DIVIDER ─────────────────────────────────────── */
  .mx-music-divider{
    height:1px;
    background:linear-gradient(to right,transparent,rgba(255,255,255,0.08) 30%,rgba(255,255,255,0.08) 70%,transparent);
    margin:0 5%;
  }

  /* ── KEYFRAMES ───────────────────────────────────── */
  @keyframes mxMusicFadeUp{ from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  /* ── RESPONSIVE ──────────────────────────────────── */
  @media (max-width:1024px){
    .mx-music-hero{ grid-template-columns:1fr;min-height:auto; }
    .mx-music-hero-right{ height:55vw;min-height:320px;order:-1; }
    .mx-music-hero-vignette{ background:linear-gradient(to top,rgba(7,7,10,0.7) 0%,transparent 55%); }
    .mx-music-hero-left{ padding:48px 5%; }
    .mx-music-artist-name{ font-size:clamp(44px,8vw,66px); }
    .mx-sirens-grid{ grid-template-columns:1fr;gap:32px; }
    .mx-catalog-grid{ grid-template-columns:repeat(2,1fr); }
  }
  @media (max-width:1024px){
    /* On mobile the hero-right collapses to a landscape band (55vw height).
       portrait.jpg is a square studio portrait; Wraith's face is in the upper 30-40%.
       background-position: center 15% keeps the face visible and centered
       in the collapsed mobile hero band without clipping. */
    .mx-music-hero-img{ background-position:center 15%; }
  }
  @media (max-width:600px){
    .mx-music-hero-left{ padding:36px 5%; }
    .mx-music-artist-name{ font-size:clamp(38px,11vw,54px); }
    .mx-catalog-grid{ grid-template-columns:1fr 1fr;gap:10px; }
    .mx-catalog-card{ height:240px; }
    .mx-music-streaming-row{ gap:6px; }
    .mx-stream-btn{ font-size:12px;padding:8px 12px; }
  }
  @media (prefers-reduced-motion:reduce){
    .mx-music-hero-img,.mx-catalog-img,.mx-catalog-card{ transition:none!important; }
  }
`;

export default function MusicPage() {
  return (
    <div className="mx-music-shell">
      <AtmosphereBridge zone="music" />
      <style>{musicPageCSS}</style>

      {/* ── UNIVERSAL NAV (reuse watch shell styles) ── */}
      <header className={styles.topbar}>
        <Link className={styles.brand} href="/">
          <img src="/movianx-logo.png" alt="Movianx" />
          <span>Movianx</span>
        </Link>
        <nav className={styles.nav} aria-label="Main navigation">
          <Link href="/watch" className={styles.navLink}>Explore</Link>
          <Link href="/watch/movies" className={styles.navLink}>Movies</Link>
          <Link href="/watch/stories" className={styles.navLink}>Stories</Link>
          <Link href="/watch/music" className={`${styles.navLink} ${styles.navLinkActive}`}>Music</Link>
          <span className={styles.navDivider} aria-hidden="true" />
          <Link href="/dashboard/welcome" className={styles.navLink}>Creator Ecosystem</Link>
          <Link href="/dashboard/welcome" className={styles.navLogin}>Login</Link>
          <Link className={styles.creatorButton} href="/watch#early-access">Join Waitlist</Link>
        </nav>
      </header>

      {/* ── SECTION 1: FEATURED ARTIST HERO ───────────────────────── */}
      <section className="mx-music-hero" aria-label="Featured Artist: Wraith The Don">
        {/* LEFT: artist info + streaming */}
        <div className="mx-music-hero-left">
          <div className="mx-music-eyebrow">
            <span className="mx-music-eyebrow-dot" aria-hidden="true" />
            Featured Artist
          </div>
          <h1 className="mx-music-artist-name">Wraith<br/>The Don</h1>
          <p className="mx-music-release-name">Parallel Us — New Album</p>
          <p className="mx-music-artist-bio">
            Wraith The Don is an independent artist building his world on Movianx.
            Stream his debut album, experience Sirens in cinematic audio-visual format,
            and support the creator directly on the platform that puts artists first.
          </p>
          <div className="mx-music-hero-ctas">
            <a href="#sirens-section" className="mx-music-cta-primary">
              ▶ Watch Sirens
            </a>
            <a href="#catalog" className="mx-music-cta-secondary">
              Full Catalog
            </a>
          </div>
          <div className="mx-music-streaming">
            <div className="mx-music-streaming-label">Stream Everywhere</div>
            <div className="mx-music-streaming-row">
              {STREAMING_LINKS.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="mx-stream-btn"
                  aria-label={link.label}
                >
                  <span className="mx-stream-btn-icon" style={{color: link.color}}>
                    <StreamingIcon icon={link.icon} />
                  </span>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: hero image */}
        <div className="mx-music-hero-right" aria-hidden="true">
          <div className="mx-music-hero-img" />
          <div className="mx-music-hero-vignette" />
          <span className="mx-music-hero-credit">Wraith The Don · Movianx</span>
        </div>
      </section>

      {/* ── SECTION 2: SIRENS EXPERIENCE ──────────────────────────── */}
      <div className="mx-music-divider" aria-hidden="true" />
      <section className="mx-sirens-section" id="sirens-section" aria-label="Sirens — Wraith The Don">
        <div className="mx-sirens-grid">
          <div className="mx-sirens-info">
            <div className="mx-sirens-eyebrow">Music Experience</div>
            <h2 className="mx-sirens-title">Sirens</h2>
            <p className="mx-sirens-subtitle">Wraith The Don · Original</p>
            <p className="mx-sirens-desc">
              Sirens is a cinematic music experience — a full audio-visual presentation
              built natively on Movianx. Watch the visual story unfold as the track plays.
              This is how artists showcase music on the platform.
            </p>
            <div className="mx-sirens-tags">
              {["Hip-Hop", "Cinematic", "Audio-Visual", "Original"].map(tag => (
                <span key={tag} className="mx-sirens-tag">{tag}</span>
              ))}
            </div>
            <a href="/watch/sirens" className="mx-sirens-cta">
              Enter Full Experience →
            </a>
          </div>
          <SirensPlayer />
        </div>
      </section>

      {/* ── SECTION 3: MUSIC CATALOG ──────────────────────────────── */}
      <div className="mx-music-divider" aria-hidden="true" />
      {/* ── WRAITH COLLECTION ───────────────────────── */}
      <section className="mx-catalog-section" id="catalog" aria-label="Wraith The Don — Collection">
        <div className="mx-catalog-header">
          <div>
            <h2 className="mx-catalog-title">Wraith Collection</h2>
            <p className="mx-catalog-sub">Experiences, albums, and exclusive content from Wraith The Don.</p>
          </div>
        </div>
        <div className="mx-catalog-grid">
          {WRAITH_COLLECTION.map(item => (
            <a key={item.id} href={item.href} className="mx-catalog-card" aria-label={item.title}>
              <div className="mx-catalog-img" style={{backgroundImage:`url(${item.image})`}} />
              <div className="mx-catalog-overlay" />
              <div className="mx-catalog-body">
                {item.isNew && <span className="mx-catalog-new">New</span>}
                <span className="mx-catalog-type" style={{background: item.typeColor}}>{item.type}</span>
                <p className="mx-catalog-name">{item.title}</p>
                <p className="mx-catalog-desc">{item.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── SIMILAR SOUNDS ──────────────────────────── */}
      <section className="mx-catalog-section" id="similar-sounds" aria-label="Similar Sounds">
        <div className="mx-catalog-header">
          <div>
            <h2 className="mx-catalog-title">Similar Sounds</h2>
            <p className="mx-catalog-sub">More immersive music worlds on Movianx.</p>
          </div>
          <Link href="/watch" className={styles.navLink} style={{fontSize:12.5,padding:"6px 12px",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6}}>
            Explore All
          </Link>
        </div>
        <div className="mx-catalog-grid">
          {SIMILAR_SOUNDS.map(item => (
            <a key={item.id} href={item.href} className="mx-catalog-card" aria-label={item.title}>
              <div className="mx-catalog-img" style={{backgroundImage:`url(${item.image})`}} />
              <div className="mx-catalog-overlay" />
              <div className="mx-catalog-body">
                <span className="mx-catalog-type" style={{background: item.typeColor}}>{item.type}</span>
                <p className="mx-catalog-name">{item.title}</p>
                <p className="mx-catalog-desc">{item.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
