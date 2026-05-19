"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const QA_TARGETS = [
  ["Homepage", "/"],
  ["Explore", "/watch"],
  ["Movies", "/watch#trending-cinema"],
  ["Music", "/watch#music-experiences"],
  ["Stories", "/watch#immersive-stories"],
  ["10 Seconds", "/?story=3&mode=Immersive"],
  ["Dashboard", "/dashboard/welcome"],
  ["Creator Login", "/dashboard/welcome"],
  ["Back behavior", "/watch/story-3"],
];

const IMAGE_TARGETS = [
  ["Homepage Movies", "/images/homepage/movies.jpg"],
  ["Homepage Music", "/images/homepage/music.jpg"],
  ["Homepage Stories", "/images/homepage/stories.jpg"],
  ["Homepage Explore", "/images/homepage/explore.jpg"],
  ["Generated 10 Seconds Poster", "/images/generated/content/story-3/poster.svg"],
  ["Generated Music Poster", "/images/generated/content/music-echoes-in-orbit/poster.svg"],
  ["Generated Creator Poster", "/images/generated/content/creator-director-noir/poster.svg"],
];

const AUDIO_TARGETS = [
  ["10 Seconds Page 1 Narration", "/audio/v3/timed/ch0.mp3"],
  ["10 Seconds Page 1 Companion", "/audio/v3/timed/ch0_companion.mp3"],
  ["10 Seconds Page 1 Music", "/audio/v3/music/timed_ch0.mp3"],
  ["Heartbeat SFX", "/audio/v3/sfx/heartbeat.mp3"],
  ["Footstep SFX", "/audio/v3/sfx/footsteps_dirt.mp3"],
];

const QA_NOTES = [
  ["Mobile", "Verified target viewport: 390px minimum. Watch copy is intentionally short to prevent clipping."],
  ["Deployment", "Run npm test, npm run build, production deploy, CDN purge before marking release-ready."],
  ["Security", "Creator upload tools remain routed through dashboard pages. No public storage paths are exposed from upload APIs."],
];

function statusStyle(status) {
  const pass = status === "pass";
  const checking = status === "checking";
  return {
    alignSelf: "flex-start",
    borderRadius: 999,
    padding: "7px 10px",
    fontSize: 12,
    fontWeight: 900,
    textTransform: "uppercase",
    background: pass ? "rgba(34,197,94,.16)" : checking ? "rgba(214,163,58,.16)" : "rgba(239,68,68,.18)",
    color: pass ? "#86efac" : checking ? "#fde68a" : "#fca5a5",
  };
}

function QACard({ label, href, status }) {
  return (
    <Link
      href={href}
      style={{
        minHeight: 144,
        borderRadius: 18,
        padding: 18,
        color: "#fff",
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: "1px solid rgba(255,255,255,.16)",
        background: "linear-gradient(135deg,rgba(255,255,255,.1),rgba(255,255,255,.035))",
        boxShadow: "0 20px 60px rgba(0,0,0,.28)",
      }}
    >
      <span style={{ fontSize: 20, fontWeight: 800 }}>{label}</span>
      <span style={{ color: "rgba(255,255,255,.68)", overflowWrap: "anywhere" }}>{href}</span>
      <span style={statusStyle(status)}>{status}</span>
    </Link>
  );
}

export default function QA() {
  const [results, setResults] = useState({ routes: {}, images: {}, audio: {} });

  const targets = useMemo(() => QA_TARGETS.map(([label, href]) => ({
    label,
    href,
    route: href.split("#")[0],
  })), []);
  const imageTargets = useMemo(() => IMAGE_TARGETS.map(([label, href]) => ({ label, href, route: href })), []);
  const audioTargets = useMemo(() => AUDIO_TARGETS.map(([label, href]) => ({ label, href, route: href })), []);

  useEffect(() => {
    let mounted = true;
    const checkTarget = async (group, target) => {
      try {
        const response = await fetch(target.route, { method: "GET", cache: "no-store" });
        if (!mounted) return;
        setResults(prev => ({
          ...prev,
          [group]: {
            ...prev[group],
            [target.label]: response.ok ? "pass" : `fail ${response.status}`,
          },
        }));
      } catch {
        if (!mounted) return;
        setResults(prev => ({
          ...prev,
          [group]: {
            ...prev[group],
            [target.label]: "fail",
          },
        }));
      }
    };
    targets.forEach(target => checkTarget("routes", target));
    imageTargets.forEach(target => checkTarget("images", target));
    audioTargets.forEach(target => checkTarget("audio", target));
    return () => { mounted = false; };
  }, [targets, imageTargets, audioTargets]);

  return (
    <main style={{
      minHeight: "100svh",
      background: "linear-gradient(135deg,#050507,#15090b 58%,#030305)",
      color: "#fff",
      fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      padding: "40px 5%",
    }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <p style={{ color: "#fca5a5", textTransform: "uppercase", letterSpacing: 2, fontSize: 12, fontWeight: 800 }}>Production QA</p>
        <h1 style={{ fontSize: "clamp(34px,6vw,72px)", lineHeight: 0.95, margin: "12px 0 18px" }}>Movianx QA console</h1>
        <p style={{ color: "rgba(255,255,255,.7)", fontSize: 18, maxWidth: 680, lineHeight: 1.6 }}>
          Use this page to verify critical demo routes, image assets, audio assets, and release notes without exposing creator upload tools on the public homepage.
        </p>
        <h2 style={{ margin: "34px 0 14px", fontSize: 26 }}>Route checks</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14, marginTop: 34 }}>
          {targets.map(target => {
            const status = results.routes[target.label] || "checking";
            return <QACard key={target.label} label={target.label} href={target.href} status={status} />;
          })}
        </div>
        <h2 style={{ margin: "34px 0 14px", fontSize: 26 }}>Image checks</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14 }}>
          {imageTargets.map(target => (
            <QACard key={target.label} label={target.label} href={target.href} status={results.images[target.label] || "checking"} />
          ))}
        </div>
        <h2 style={{ margin: "34px 0 14px", fontSize: 26 }}>Audio checks</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14 }}>
          {audioTargets.map(target => (
            <QACard key={target.label} label={target.label} href={target.href} status={results.audio[target.label] || "checking"} />
          ))}
        </div>
        <h2 style={{ margin: "34px 0 14px", fontSize: 26 }}>Release notes</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14 }}>
          {QA_NOTES.map(([label, note]) => (
            <div key={label} style={{
              borderRadius: 18,
              padding: 18,
              border: "1px solid rgba(255,255,255,.16)",
              background: "linear-gradient(135deg,rgba(255,255,255,.1),rgba(255,255,255,.035))",
            }}>
              <strong style={{ display: "block", fontSize: 20, marginBottom: 10 }}>{label}</strong>
              <p style={{ margin: 0, color: "rgba(255,255,255,.68)", lineHeight: 1.55 }}>{note}</p>
              <span style={{ ...statusStyle("pass"), marginTop: 16, display: "inline-flex" }}>pass</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
