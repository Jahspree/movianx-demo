"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import styles from "../watch.module.css";

const sirensCSS = `
  .sx-shell{
    min-height:100svh;width:100%;overflow-x:hidden;
    background:#07070a;color:#fff;
    font-family:"SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  }
  .sx-shell,
  .sx-shell *{ box-sizing:border-box; }

  /* FULL BLEED VIDEO HERO */
  .sx-video-hero{
    position:relative;width:100%;
    background:#000;overflow:hidden;
    min-height:60svh;
  }
  .sx-video{
    width:100%;display:block;
    max-height:80svh;min-height:340px;
    object-fit:cover;object-position:center;
  }
  .sx-video-overlay{
    position:absolute;inset:0;
    background:
      linear-gradient(to bottom,rgba(7,7,10,0.3) 0%,transparent 25%,transparent 55%,rgba(7,7,10,0.8) 100%);
    pointer-events:none;
  }
  .sx-play-btn{
    position:absolute;
    top:50%;left:50%;transform:translate(-50%,-50%);
    width:80px;height:80px;border-radius:50%;
    background:rgba(192,57,43,0.9);
    border:2px solid rgba(255,255,255,0.3);
    color:#fff;font-size:26px;cursor:pointer;
    display:flex;align-items:center;justify-content:center;
    transition:all 220ms ease;
    box-shadow:0 0 60px rgba(192,57,43,0.4);
  }
  .sx-play-btn:hover{ background:#d94030;transform:translate(-50%,-50%) scale(1.08); }
  .sx-play-btn.playing{ background:rgba(0,0,0,0.5);box-shadow:none; }
  .sx-video-meta{
    position:absolute;bottom:32px;left:5%;
    display:flex;flex-direction:column;gap:4px;
  }
  .sx-video-label{
    font-size:10px;font-weight:700;text-transform:uppercase;
    letter-spacing:2px;color:rgba(255,255,255,0.45);
  }
  .sx-video-title{
    font-size:28px;font-weight:800;color:#fff;
    letter-spacing:-0.03em;line-height:1;
  }
  .sx-video-artist{
    font-size:14px;color:rgba(255,255,255,0.55);margin-top:2px;
  }

  /* EXPERIENCE BODY */
  .sx-body{
    max-width:1280px;margin:0 auto;padding:64px 5% 96px;
    display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start;
  }
  .sx-info{ display:flex;flex-direction:column;gap:0; }
  .sx-eyebrow{
    font-size:10.5px;font-weight:700;text-transform:uppercase;
    letter-spacing:2px;color:rgba(255,255,255,0.4);margin-bottom:14px;
  }
  .sx-title{
    font-size:clamp(42px,5vw,72px);font-weight:900;color:#fff;
    letter-spacing:-0.04em;line-height:0.96;
    text-transform:uppercase;margin:0 0 6px;
  }
  .sx-subtitle{
    font-size:14px;color:rgba(255,255,255,0.4);
    letter-spacing:0.12em;text-transform:uppercase;margin:0 0 28px;
  }
  .sx-desc{
    font-size:15px;color:rgba(255,255,255,0.62);
    line-height:1.78;margin:0 0 32px;
  }
  .sx-tags{
    display:flex;gap:8px;flex-wrap:wrap;margin-bottom:32px;
  }
  .sx-tag{
    padding:5px 13px;border-radius:999px;
    border:1px solid rgba(255,255,255,0.13);
    background:rgba(255,255,255,0.05);
    color:rgba(255,255,255,0.65);
    font-size:12px;font-weight:500;
  }

  /* AUDIO PLAYER */
  .sx-audio-player{
    padding:24px;border-radius:14px;
    background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.09);
    margin-bottom:28px;
  }
  .sx-audio-label{
    font-size:10px;font-weight:700;text-transform:uppercase;
    letter-spacing:1.8px;color:rgba(255,255,255,0.35);margin-bottom:12px;
  }
  .sx-audio-el{ width:100%;height:40px;outline:none;border-radius:6px;opacity:0.85; }

  /* ARTIST CARD */
  .sx-artist-card{
    padding:28px;border-radius:14px;
    background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.09);
  }
  .sx-artist-label{
    font-size:10px;font-weight:700;text-transform:uppercase;
    letter-spacing:1.8px;color:rgba(255,255,255,0.35);margin-bottom:16px;
  }
  .sx-artist-row{
    display:flex;gap:16px;align-items:center;margin-bottom:16px;
  }
  .sx-artist-avatar{
    width:64px;height:64px;border-radius:50%;
    background-image:url(/images/wraith/portrait.jpg);
    background-size:cover;background-position:center top;
    border:2px solid rgba(255,255,255,0.1);flex-shrink:0;
  }
  .sx-artist-name{ font-size:20px;font-weight:700;color:#fff;margin:0 0 4px;letter-spacing:-0.02em; }
  .sx-artist-meta{ font-size:12px;color:rgba(255,255,255,0.45); }
  .sx-artist-desc{
    font-size:13px;color:rgba(255,255,255,0.55);
    line-height:1.65;margin:0 0 20px;
  }
  .sx-artist-links{
    display:flex;flex-direction:column;gap:8px;
  }
  .sx-artist-link{
    display:flex;align-items:center;justify-content:space-between;
    padding:10px 14px;border-radius:8px;
    background:rgba(255,255,255,0.05);
    border:1px solid rgba(255,255,255,0.09);
    text-decoration:none;color:rgba(255,255,255,0.78);
    font-size:13px;font-weight:500;
    transition:background 160ms ease,border-color 160ms ease;
  }
  .sx-artist-link:hover{ background:rgba(255,255,255,0.09);border-color:rgba(255,255,255,0.16); }
  .sx-artist-link-icon{ opacity:0.45;font-size:12px; }

  /* BACK LINK */
  .sx-back{
    display:inline-flex;align-items:center;gap:6px;
    padding:10px 0;
    color:rgba(255,255,255,0.45);font-size:13px;
    text-decoration:none;margin-bottom:32px;
    transition:color 160ms ease;
  }
  .sx-back:hover{ color:rgba(255,255,255,0.8); }

  @media (max-width:768px){
    .sx-body{ grid-template-columns:1fr;gap:36px;padding:40px 5% 64px; }
    .sx-title{ font-size:clamp(38px,10vw,56px); }
  }
  @media (prefers-reduced-motion:reduce){
    .sx-play-btn{ transition:none!important; }
  }
`;

export default function SirensPage() {
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
      v.play()
        .then(() => setPlaying(true))
        .catch(() => {
          v.muted = true;
          setMuted(true);
          v.play().then(() => setPlaying(true));
        });
    }
  }

  return (
    <div className="sx-shell">
      <style>{sirensCSS}</style>

      {/* NAV */}
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

      {/* FULL BLEED VIDEO */}
      <section className="sx-video-hero" aria-label="Sirens — music video">
        <video
          ref={videoRef}
          className="sx-video"
          src="/images/sirens/sirens.mov"
          poster="/images/wraith/performance-red.png"
          loop
          playsInline
          muted={muted}
          aria-label="Sirens music video by Wraith The Don"
        />
        <div className="sx-video-overlay" />
        <button
          className={`sx-play-btn${playing ? " playing" : ""}`}
          onClick={handleToggle}
          aria-label={playing ? "Pause" : "Play Sirens"}
        >
          {playing ? "⏸" : "▶"}
        </button>
        <div className="sx-video-meta">
          <span className="sx-video-label">Music Experience</span>
          <div className="sx-video-title">Sirens</div>
          <div className="sx-video-artist">Wraith The Don</div>
        </div>
      </section>

      {/* BODY */}
      <div className="sx-body">
        {/* LEFT: track info */}
        <div className="sx-info">
          <Link href="/watch/music" className="sx-back">← Back to Music</Link>
          <div className="sx-eyebrow">Music Experience · Original</div>
          <h1 className="sx-title">Sirens</h1>
          <p className="sx-subtitle">Wraith The Don · Movianx Original</p>
          <p className="sx-desc">
            Sirens is a full cinematic music experience built natively on Movianx.
            The track plays alongside a visual narrative — sound and story converging
            into one seamless experience. This is the future of how artists connect with fans.
          </p>
          <div className="sx-tags">
            {["Hip-Hop", "Cinematic", "Audio-Visual", "Original", "Immersive"].map(tag => (
              <span key={tag} className="sx-tag">{tag}</span>
            ))}
          </div>

          {/* AUDIO PLAYER */}
          <div className="sx-audio-player">
            <div className="sx-audio-label">Audio Track</div>
            <audio
              className="sx-audio-el"
              controls
              src="/images/sirens/sirens.mp3"
              aria-label="Sirens audio track by Wraith The Don"
            />
          </div>
        </div>

        {/* RIGHT: artist card */}
        <div className="sx-artist-card">
          <div className="sx-artist-label">Artist</div>
          <div className="sx-artist-row">
            <div className="sx-artist-avatar" aria-hidden="true" />
            <div>
              <div className="sx-artist-name">Wraith The Don</div>
              <div className="sx-artist-meta">Independent Artist · Movianx</div>
            </div>
          </div>
          <p className="sx-artist-desc">
            Wraith The Don is building his creative world on Movianx — the first platform
            that combines streaming, interactive experiences, and direct creator support
            in one place. Support the artist. Own the experience.
          </p>
          <div className="sx-artist-links">
            <a
              href="https://open.spotify.com/search/wraith%20the%20don"
              target="_blank"
              rel="noopener noreferrer"
              className="sx-artist-link"
            >
              <span>Listen on Spotify</span>
              <span className="sx-artist-link-icon">→</span>
            </a>
            <a
              href="https://music.apple.com/us/album/parallel-us-single/1852075302"
              target="_blank"
              rel="noopener noreferrer"
              className="sx-artist-link"
            >
              <span>Listen on Apple Music</span>
              <span className="sx-artist-link-icon">→</span>
            </a>
            <a
              href="https://www.youtube.com/results?search_query=wraith+the+don"
              target="_blank"
              rel="noopener noreferrer"
              className="sx-artist-link"
            >
              <span>Watch on YouTube</span>
              <span className="sx-artist-link-icon">→</span>
            </a>
            <Link href="/watch/music" className="sx-artist-link">
              <span>Artist Profile on Movianx</span>
              <span className="sx-artist-link-icon">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
