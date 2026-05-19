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

export default function QA() {
  const [results, setResults] = useState({});

  const targets = useMemo(() => QA_TARGETS.map(([label, href]) => ({
    label,
    href,
    route: href.split("#")[0],
  })), []);

  useEffect(() => {
    let mounted = true;
    targets.forEach(async target => {
      try {
        const response = await fetch(target.route, { method: "GET", cache: "no-store" });
        if (!mounted) return;
        setResults(prev => ({
          ...prev,
          [target.label]: response.ok ? "pass" : `fail ${response.status}`,
        }));
      } catch {
        if (!mounted) return;
        setResults(prev => ({ ...prev, [target.label]: "fail" }));
      }
    });
    return () => { mounted = false; };
  }, [targets]);

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
        <h1 style={{ fontSize: "clamp(34px,6vw,72px)", lineHeight: 0.95, margin: "12px 0 18px" }}>Movianx route checks</h1>
        <p style={{ color: "rgba(255,255,255,.7)", fontSize: 18, maxWidth: 680, lineHeight: 1.6 }}>
          Use this page to verify critical demo routes, button targets, and load status without exposing creator upload tools on the public homepage.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14, marginTop: 34 }}>
          {targets.map(target => {
            const status = results[target.label] || "checking";
            const pass = status === "pass";
            return (
              <Link
                key={target.label}
                href={target.href}
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
                <span style={{ fontSize: 20, fontWeight: 800 }}>{target.label}</span>
                <span style={{ color: "rgba(255,255,255,.68)", overflowWrap: "anywhere" }}>{target.href}</span>
                <span style={{
                  alignSelf: "flex-start",
                  borderRadius: 999,
                  padding: "7px 10px",
                  fontSize: 12,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  background: pass ? "rgba(34,197,94,.16)" : status === "checking" ? "rgba(214,163,58,.16)" : "rgba(239,68,68,.18)",
                  color: pass ? "#86efac" : status === "checking" ? "#fde68a" : "#fca5a5",
                }}>{status}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
