"use client";
import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// COLOR SYSTEM - Black/White Minimalist (Tesla/Apple)
// ═══════════════════════════════════════════════════════════════════════════
const ACCENT = "#fff";
const DARK = "#000";
const SURFACE = "rgba(255,255,255,0.05)";
const SURFACE2 = "rgba(255,255,255,0.08)";
const BORDER = "rgba(255,255,255,0.1)";
const TEXT = "#fff";
const TEXT2 = "rgba(255,255,255,0.6)";
const GOLD = "rgba(255,255,255,0.9)";

// ═══════════════════════════════════════════════════════════════════════════
// CREATOR DASHBOARD UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

// ─── Animated Counter ───
function AnimCounter({ end, duration = 1800, prefix = "", suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [end, duration]);
  return <span>{prefix}{val.toLocaleString()}{suffix}</span>;
}

// ─── Sparkline SVG ───
function Sparkline({ data, color = ACCENT, w = 120, h = 32 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} />
      <polygon fill={`url(#sg-${color.replace("#","")})`} points={`0,${h} ${pts} ${w},${h}`} />
    </svg>
  );
}

// ─── Progress Ring ───
function ProgressRing({ pct, size = 64, stroke = 5, color = ACCENT }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={BORDER} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.5s ease" }} />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CREATOR DASHBOARD COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

// ─── Email Gate ───
function EmailGate({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [step, setStep] = useState(0);
  const [hover, setHover] = useState(false);

  const isValid = email.includes("@") && email.includes(".");

  return (
    <div style={{
      height: "100vh", display: "flex", alignItems: "flex-start", justifyContent: "center",
      background: "#000",
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: "40px 24px",
      overflowY: "scroll",
      WebkitOverflowScrolling: "touch",
    }}>
      <div style={{
        width: "100%", maxWidth: 480,
        animation: "fadeUp 0.8s ease both",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <img 
            src="/movianx-logo.png" 
            alt="Movianx"
            style={{
              height: 50,
              width: "auto",
              marginBottom: 16,
            }}
          />
          <p style={{ color: TEXT2, fontSize: 13, marginTop: 8, letterSpacing: "2px", textTransform: "uppercase" }}>
            Creator Studio
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: SURFACE, borderRadius: 24, padding: "40px 36px",
          border: `1px solid ${BORDER}`,
        }}>
          {step === 0 ? (
            <>
              <h2 style={{ color: TEXT, fontSize: 22, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.3px" }}>
                Get Early Access
              </h2>
              <p style={{ color: TEXT2, fontSize: 14, margin: "0 0 32px", lineHeight: 1.6 }}>
                Transform your books into immersive, choice-driven experiences with synchronized audio, AI visuals, and direct-to-reader commerce.
              </p>

              <label style={{ display: "block", marginBottom: 20 }}>
                <span style={{ color: TEXT2, fontSize: 11, textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: 8 }}>Full Name</span>
                <input
                  value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  style={{
                    width: "100%", padding: "14px 16px", background: SURFACE2, border: `1px solid ${BORDER}`,
                    borderRadius: 12, color: TEXT, fontSize: 15, outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.target.style.borderColor = "#fff"}
                  onBlur={e => e.target.style.borderColor = BORDER}
                />
              </label>

              <label style={{ display: "block", marginBottom: 20 }}>
                <span style={{ color: TEXT2, fontSize: 11, textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: 8 }}>Email</span>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    width: "100%", padding: "14px 16px", background: SURFACE2, border: `1px solid ${BORDER}`,
                    borderRadius: 12, color: TEXT, fontSize: 15, outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.target.style.borderColor = "#fff"}
                  onBlur={e => e.target.style.borderColor = BORDER}
                />
              </label>

              <label style={{ display: "block", marginBottom: 28 }}>
                <span style={{ color: TEXT2, fontSize: 11, textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: 8 }}>I am a...</span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Author", "Publisher", "Storyteller", "Investor", "Other"].map(r2 => (
                    <button key={r2} onClick={() => setRole(r2)}
                      style={{
                        padding: "10px 18px", borderRadius: 20, border: `1px solid ${role === r2 ? "#fff" : BORDER}`,
                        background: role === r2 ? "#fff" : "transparent",
                        color: role === r2 ? "#000" : TEXT2, fontSize: 13, cursor: "pointer",
                        fontWeight: role === r2 ? 600 : 400, transition: "all 0.2s",
                      }}>{r2}</button>
                  ))}
                </div>
              </label>

              <button
                disabled={!isValid || !name}
                onClick={() => setStep(1)}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{
                  width: "100%", padding: "16px", borderRadius: 12, border: "none",
                  background: (!isValid || !name) ? SURFACE2 : "#fff",
                  color: (!isValid || !name) ? TEXT2 : "#000",
                  fontSize: 14, fontWeight: 600, letterSpacing: "0.5px",
                  cursor: (!isValid || !name) ? "not-allowed" : "pointer",
                  transform: hover && isValid && name ? "translateY(-1px)" : "translateY(0)",
                  transition: "all 0.2s",
                }}>
                Continue →
              </button>
            </>
          ) : (
            <>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "#fff",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 32, marginBottom: 20, color: "#000",
                }}>✓</div>
                <h2 style={{ color: TEXT, fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>
                  Welcome, {name.split(" ")[0]}!
                </h2>
                <p style={{ color: TEXT2, fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                  We'll send you an invite to <span style={{ color: "#fff", fontWeight: 600 }}>{email}</span> once we're ready for early creators.
                </p>
              </div>

              <button
                onClick={() => onSubmit({ name, email, role })}
                style={{
                  width: "100%", padding: "16px", borderRadius: 12, border: "none",
                  background: "#fff",
                  color: "#000", fontSize: 14, fontWeight: 600, cursor: "pointer",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={e => {
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={e => {
                  e.target.style.transform = "translateY(0)";
                }}>
                Enter Demo Dashboard →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ───
function Sidebar({ active, setActive, user }) {
  const nav = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "upload", icon: "⬆", label: "Upload" },
    { id: "library", icon: "📚", label: "Library" },
    { id: "analytics", icon: "📈", label: "Analytics" },
    { id: "merch", icon: "🛍", label: "Merch & Products" },
    { id: "streaming", icon: "📡", label: "Streaming" },
    { id: "settings", icon: "⚙", label: "Settings" },
  ];
  return (
    <div style={{
      width: 260, background: SURFACE, borderRight: `1px solid ${BORDER}`,
      display: "flex", flexDirection: "column", flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px", borderBottom: `1px solid ${BORDER}` }}>
        <img 
          src="/movianx-logo.png" 
          alt="Movianx"
          style={{
            height: 32,
            width: "auto",
          }}
        />
      </div>

      {/* Nav */}
      <div style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        {nav.map(n => (
          <button key={n.id} onClick={() => setActive(n.id)}
            style={{
              width: "100%", padding: "12px 14px", marginBottom: 6, borderRadius: 12,
              border: "none", textAlign: "left", cursor: "pointer",
              background: active === n.id ? "#fff" : "transparent",
              color: active === n.id ? "#000" : TEXT2,
              fontSize: 14, fontWeight: active === n.id ? 600 : 400,
              display: "flex", alignItems: "center", gap: 12,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { if (active !== n.id) e.target.style.background = SURFACE2; }}
            onMouseLeave={e => { if (active !== n.id) e.target.style.background = "transparent"; }}>
            <span style={{ fontSize: 18 }}>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </div>

      {/* User */}
      <div style={{
        padding: "20px", borderTop: `1px solid ${BORDER}`,
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 700, color: "#000",
        }}>{user.name[0]}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
          <div style={{ fontSize: 11, color: TEXT2 }}>Creator</div>
        </div>
      </div>
    </div>
  );
}

// ─── Overview Page ───
function OverviewPage() {
  const revenue = [2400, 3100, 2800, 3900, 4200, 5100, 5800];
  const readers = [120, 145, 138, 162, 178, 195, 210];
  return (
    <div style={{ animation: "fadeUp 0.5s ease both" }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: TEXT, margin: "0 0 4px", letterSpacing: "-0.5px" }}>Creator Dashboard</h1>
      <p style={{ color: TEXT2, fontSize: 14, margin: "0 0 32px" }}>Your interactive storytelling empire at a glance</p>

      {/* Top Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Revenue", val: 27800, prefix: "$", change: "+18%", color: "#4ADE80", spark: revenue },
          { label: "Active Readers", val: 1248, change: "+12%", color: ACCENT, spark: readers },
          { label: "Stories Published", val: 7, change: "+2", color: GOLD },
          { label: "Avg. Completion", val: 68, suffix: "%", change: "+5%", color: "#818CF8" },
        ].map((s, i) => (
          <div key={i} style={{
            background: SURFACE, borderRadius: 16, border: `1px solid ${BORDER}`,
            padding: 20, position: "relative", overflow: "hidden",
          }}>
            <div style={{ fontSize: 12, color: TEXT2, marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: TEXT, marginBottom: 4 }}>
              <AnimCounter end={s.val} prefix={s.prefix || ""} suffix={s.suffix || ""} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: s.color }}>{s.change}</span>
              {s.spark && <Sparkline data={s.spark} color={s.color} w={80} h={24} />}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{ background: SURFACE, borderRadius: 16, border: `1px solid ${BORDER}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 16 }}>Recent Activity</div>
        {[
          { act: "New reader completed The Midnight Cipher", time: "2 min ago", icon: "✓", color: "#4ADE80" },
          { act: "Merch sale: Signed Hardcover Bundle", time: "18 min ago", icon: "$", color: GOLD },
          { act: "Choice analytics updated for Chapter 7", time: "1 hour ago", icon: "📊", color: "#818CF8" },
          { act: "AI narration processed for new chapter", time: "3 hours ago", icon: "🎙", color: ACCENT },
        ].map((a, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 14, padding: "12px 0",
            borderBottom: i < 3 ? `1px solid ${BORDER}` : "none",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: SURFACE2,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, color: a.color,
            }}>{a.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: TEXT }}>{a.act}</div>
              <div style={{ fontSize: 11, color: TEXT2, marginTop: 2 }}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {[
          { label: "Upload New Story", icon: "⬆", color: ACCENT },
          { label: "View Analytics", icon: "📈", color: "#818CF8" },
          { label: "Manage Merch", icon: "🛍", color: GOLD },
        ].map((btn, i) => (
          <button key={i} style={{
            padding: "18px", borderRadius: 12, border: `1px solid ${BORDER}`,
            background: SURFACE2, color: TEXT, fontSize: 13, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
            transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            e.target.style.borderColor = btn.color;
            e.target.style.background = `rgba(${btn.color === ACCENT ? "232,54,79" : btn.color === GOLD ? "212,168,67" : "129,140,248"},0.1)`;
          }}
          onMouseLeave={e => {
            e.target.style.borderColor = BORDER;
            e.target.style.background = SURFACE2;
          }}>
            <span style={{ fontSize: 20 }}>{btn.icon}</span>
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Upload Page ───
function UploadPage() {
  const [dragging, setDragging] = useState(false);
  return (
    <div style={{ animation: "fadeUp 0.5s ease both" }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: TEXT, margin: "0 0 4px", letterSpacing: "-0.5px" }}>Upload Story</h1>
      <p style={{ color: TEXT2, fontSize: 14, margin: "0 0 32px" }}>Transform your book into an interactive experience</p>

      {/* Upload Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); }}
        style={{
          background: dragging ? `rgba(232,54,79,0.05)` : SURFACE,
          border: `2px dashed ${dragging ? ACCENT : BORDER}`,
          borderRadius: 20, padding: "60px 40px", textAlign: "center",
          transition: "all 0.3s", marginBottom: 32, cursor: "pointer",
        }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: TEXT, marginBottom: 8 }}>
          Drag & drop your manuscript
        </div>
        <div style={{ fontSize: 13, color: TEXT2, marginBottom: 20 }}>
          Supports .epub, .docx, .pdf, or paste your text
        </div>
        <button style={{
          padding: "12px 28px", borderRadius: 10, border: `1px solid ${ACCENT}`,
          background: "transparent", color: ACCENT, fontSize: 13, fontWeight: 600,
          cursor: "pointer",
        }}>
          Browse Files
        </button>
      </div>

      {/* AI Options */}
      <div style={{ background: SURFACE, borderRadius: 16, border: `1px solid ${BORDER}`, padding: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 16 }}>AI Enhancement Options</div>
        {[
          { label: "Auto-detect branching points", desc: "AI finds 8-12 key decision moments", check: true },
          { label: "Generate alternate endings", desc: "Create 3-5 unique story conclusions", check: true },
          { label: "Professional AI narration", desc: "Choose voice & emotion profile", check: true },
          { label: "Scene visualization", desc: "AI-generated imagery for immersive mode", check: false },
        ].map((opt, i) => (
          <label key={i} style={{
            display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 0",
            borderBottom: i < 3 ? `1px solid ${BORDER}` : "none", cursor: "pointer",
          }}>
            <input type="checkbox" defaultChecked={opt.check} style={{
              width: 18, height: 18, marginTop: 2, accentColor: ACCENT, cursor: "pointer",
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{opt.label}</div>
              <div style={{ fontSize: 12, color: TEXT2, marginTop: 2 }}>{opt.desc}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

// ─── Analytics Page ───
function AnalyticsPage() {
  return (
    <div style={{ animation: "fadeUp 0.5s ease both" }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: TEXT, margin: "0 0 4px", letterSpacing: "-0.5px" }}>Analytics</h1>
      <p style={{ color: TEXT2, fontSize: 14, margin: "0 0 32px" }}>Deep insights into reader behavior & story performance</p>

      {/* Story Performance */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { story: "The Midnight Cipher", readers: 847, completion: 72, choices: "Path A: 64%" },
          { story: "Echoes of Tomorrow", readers: 312, completion: 58, choices: "Path B: 41%" },
          { story: "Silent Horizons", readers: 89, completion: 81, choices: "Path A: 78%" },
        ].map((s, i) => (
          <div key={i} style={{
            background: SURFACE, borderRadius: 16, border: `1px solid ${BORDER}`, padding: 20,
          }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: TEXT, marginBottom: 12 }}>{s.story}</div>
            <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: TEXT2, marginBottom: 4 }}>Total Readers</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: ACCENT }}>{s.readers}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: TEXT2, marginBottom: 4 }}>Completion</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#4ADE80" }}>{s.completion}%</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: TEXT2, marginBottom: 6 }}>Popular Choice</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: GOLD }}>{s.choices}</div>
            <div style={{
              height: 4, borderRadius: 2, background: SURFACE2, marginTop: 12, overflow: "hidden"
            }}>
              <div style={{
                height: "100%", borderRadius: 2, width: `${s.completion}%`,
                background: `linear-gradient(90deg, ${ACCENT}, ${GOLD})`,
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Choice Heatmap */}
      <div style={{ background: SURFACE, borderRadius: 16, border: `1px solid ${BORDER}`, padding: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 16 }}>Reader Decisions — The Midnight Cipher</div>
        {[
          { ch: "Chapter 3: The Heist", optA: "Trust the partner (64%)", optB: "Go solo (36%)", pctA: 64 },
          { ch: "Chapter 5: The Betrayal", optA: "Forgive (41%)", optB: "Revenge (59%)", pctA: 41 },
          { ch: "Chapter 7: The Vault", optA: "Take the money (78%)", optB: "Destroy evidence (22%)", pctA: 78 },
        ].map((c, i) => (
          <div key={i} style={{
            padding: "16px 0", borderBottom: i < 2 ? `1px solid ${BORDER}` : "none",
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 10 }}>{c.ch}</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: TEXT2, marginBottom: 6 }}>{c.optA}</div>
                <div style={{ height: 6, borderRadius: 3, background: SURFACE2, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 3, width: `${c.pctA}%`, background: ACCENT,
                  }} />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: TEXT2, marginBottom: 6 }}>{c.optB}</div>
                <div style={{ height: 6, borderRadius: 3, background: SURFACE2, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 3, width: `${100 - c.pctA}%`, background: GOLD,
                  }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Merch Page ───
function MerchPage() {
  return (
    <div style={{ animation: "fadeUp 0.5s ease both" }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: TEXT, margin: "0 0 4px", letterSpacing: "-0.5px" }}>Merch & Products</h1>
      <p style={{ color: TEXT2, fontSize: 14, margin: "0 0 32px" }}>Sell directly to your readers — books, merch, bundles</p>

      {/* Products */}
      <div style={{ background: SURFACE, borderRadius: 16, border: `1px solid ${BORDER}`, padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 16 }}>Your Products</div>
        {[
          { img: "📕", name: "Signed Hardcover — The Midnight Cipher", price: "$32", sold: 124, stock: 76 },
          { img: "🎧", name: "Premium Audiobook Bundle", price: "$18", sold: 312, stock: "Digital" },
          { img: "👕", name: "Limited Edition T-Shirt", price: "$28", sold: 47, stock: 23 },
          { img: "🖼", name: "Art Print — The Vault Scene", price: "$15", sold: 89, stock: 61 },
        ].map((p, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 16, padding: "14px 0",
            borderBottom: i < 3 ? `1px solid ${BORDER}` : "none",
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 10, background: SURFACE2,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, flexShrink: 0,
            }}>{p.img}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{p.name}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: ACCENT, marginTop: 4 }}>{p.price}</div>
              <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                <span style={{ fontSize: 11, color: TEXT2 }}>{p.sold} sold</span>
                <span style={{ fontSize: 11, color: typeof p.stock === "number" && p.stock < 50 ? GOLD : TEXT2 }}>
                  {typeof p.stock === "number" ? `${p.stock} in stock` : "Digital"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shipping & Fulfillment */}
      <div style={{ background: SURFACE, borderRadius: 16, border: `1px solid ${BORDER}`, padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 16 }}>Fulfillment Overview</div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[
            { label: "Pending Orders", val: "12", color: GOLD, icon: "⏳" },
            { label: "Shipped Today", val: "8", color: "#4ADE80", icon: "🚚" },
            { label: "Avg. Ship Time", val: "2.1 days", color: "#818CF8", icon: "⚡" },
            { label: "Return Rate", val: "0.3%", color: "#4ADE80", icon: "↩" },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, minWidth: 140, padding: "16px", borderRadius: 12,
              background: SURFACE2, border: `1px solid ${BORDER}`, textAlign: "center",
            }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 11, color: TEXT2, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Launch Promo Banner */}
      <div style={{
        borderRadius: 16, padding: "28px 32px",
        background: `linear-gradient(135deg, rgba(232,54,79,0.15), rgba(212,168,67,0.1))`,
        border: `1px solid rgba(232,54,79,0.3)`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16,
      }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>🚀 Book Launch Mode</div>
          <div style={{ fontSize: 13, color: TEXT2, marginTop: 4 }}>
            Bundle your interactive book + signed copies + exclusive merch into a launch event with countdown & limited editions.
          </div>
        </div>
        <button style={{
          padding: "12px 24px", borderRadius: 10, border: `1px solid ${ACCENT}`,
          background: "transparent", color: ACCENT, fontSize: 13, fontWeight: 600,
          cursor: "pointer", whiteSpace: "nowrap",
        }}>Create Launch →</button>
      </div>
    </div>
  );
}

// ─── Streaming Page ───
function StreamingPage() {
  return (
    <div style={{ animation: "fadeUp 0.5s ease both" }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: TEXT, margin: "0 0 4px", letterSpacing: "-0.5px" }}>Streaming & Live</h1>
      <p style={{ color: TEXT2, fontSize: 14, margin: "0 0 32px" }}>Your interactive content, distributed everywhere</p>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        {[
          { platform: "Movianx App", status: "Live", listeners: "3.2K active", color: ACCENT },
          { platform: "Spotify (Audiobook)", status: "Synced", listeners: "1.8K monthly", color: "#1DB954" },
          { platform: "Apple Books", status: "Pending Review", listeners: "—", color: "#FC3C44" },
          { platform: "Audible", status: "In Queue", listeners: "—", color: "#FF9900" },
        ].map((p, i) => (
          <div key={i} style={{
            flex: "1 1 calc(50% - 8px)", minWidth: 240, background: SURFACE, borderRadius: 16,
            border: `1px solid ${BORDER}`, padding: 20,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>{p.platform}</span>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6,
                background: p.status === "Live" || p.status === "Synced" ? `rgba(74,222,128,0.15)` : `rgba(212,168,67,0.15)`,
                color: p.status === "Live" || p.status === "Synced" ? "#4ADE80" : GOLD,
              }}>{p.status}</span>
            </div>
            <div style={{ fontSize: 13, color: TEXT2 }}>{p.listeners}</div>
            <div style={{
              height: 3, borderRadius: 2, background: SURFACE2, marginTop: 12, overflow: "hidden"
            }}>
              <div style={{
                height: "100%", borderRadius: 2, width: p.status === "Live" ? "100%" : p.status === "Synced" ? "100%" : "40%",
                background: p.color,
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Now Playing */}
      <div style={{
        background: SURFACE, borderRadius: 16, border: `1px solid ${BORDER}`, padding: 24,
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 16 }}>Currently Streaming</div>
        <div style={{
          display: "flex", alignItems: "center", gap: 20, padding: 16,
          background: SURFACE2, borderRadius: 12,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 10,
            background: `linear-gradient(135deg, ${ACCENT}, ${GOLD})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24,
          }}>▶</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>The Midnight Cipher</div>
            <div style={{ fontSize: 12, color: TEXT2, marginTop: 2 }}>Chapter 7: The Vault · Cinematic Mode</div>
            <div style={{ height: 3, borderRadius: 2, background: BORDER, marginTop: 10, maxWidth: 300 }}>
              <div style={{ height: "100%", borderRadius: 2, width: "43%", background: ACCENT }} />
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: TEXT }}>847</div>
            <div style={{ fontSize: 11, color: TEXT2 }}>live listeners</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CREATOR DASHBOARD MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
function CreatorDashboard({ onBackToReader }) {
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("overview");

  if (!user) return <EmailGate onSubmit={setUser} />;

  const pages = {
    overview: <OverviewPage />,
    upload: <UploadPage />,
    library: <OverviewPage />,
    analytics: <AnalyticsPage />,
    merch: <MerchPage />,
    streaming: <StreamingPage />,
    settings: <OverviewPage />,
  };

  return (
    <div style={{
      display: "flex", minHeight: "100vh", background: DARK,
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: TEXT,
    }}>
      <Sidebar active={active} setActive={setActive} user={user} />
      <div style={{ flex: 1, padding: "32px 40px", overflowY: "auto", maxHeight: "100vh" }}>
        {/* Back to Reader Button */}
        <button
          onClick={onBackToReader}
          style={{
            position: "absolute", top: 20, right: 20, padding: "10px 20px",
            borderRadius: 8, border: `1px solid ${BORDER}`, background: SURFACE,
            color: TEXT2, fontSize: 13, fontWeight: 600, cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            e.target.style.borderColor = ACCENT;
            e.target.style.color = ACCENT;
          }}
          onMouseLeave={e => {
            e.target.style.borderColor = BORDER;
            e.target.style.color = TEXT2;
          }}>
          ← Back to Reader
        </button>
        {pages[active]}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; margin: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${DARK}; }
        ::-webkit-scrollbar-thumb { background: ${BORDER}; border-radius: 3px; }
        input::placeholder { color: ${TEXT2}; opacity: 0.5; }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// READER EXPERIENCE (ORIGINAL MOVIANX.JS CONTENT)
// ═══════════════════════════════════════════════════════════════════════════

const stories = [
  {
    id: 1,
    title: "The Midnight Cipher",
    author: "Sarah Chen",
    genre: "Thriller / Mystery",
    cover: "https://picsum.photos/seed/cipher/400/600",
    desc: "A cryptographer uncovers a century-old code that rewrites history. Your choices determine which secrets stay buried.",
    immersions: ["Reader", "Cinematic", "Immersive"],
    rating: 4.8,
    reads: "2.3M",
    chapters: 12,
  },
  {
    id: 2,
    title: "Echoes of Tomorrow",
    author: "Marcus Webb",
    genre: "Sci-Fi / Romance",
    cover: "https://picsum.photos/seed/echoes/400/600",
    desc: "In a world where memories can be shared, two strangers must decide if love is worth losing themselves.",
    immersions: ["Reader", "Cinematic"],
    rating: 4.6,
    reads: "1.8M",
    chapters: 9,
  },
  {
    id: 3,
    title: "The Last Garden",
    author: "Elena Rodriguez",
    genre: "Fantasy / Adventure",
    cover: "https://picsum.photos/seed/garden/400/600",
    desc: "When nature strikes back, a botanist must choose between saving humanity or the Earth itself.",
    immersions: ["Reader", "Cinematic", "Immersive"],
    rating: 4.9,
    reads: "3.1M",
    chapters: 15,
  },
];

export default function MovianxPlatform() {
  // ═══════════════════════════════════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  const [pg, setPg] = useState("landing"); // "landing" | "home" | "detail" | "reading" | "creator"
  const [sel, setSel] = useState(null);
  const [mode, setMode] = useState("Reader");
  const [txt, setTxt] = useState("");
  const [chIdx, setChIdx] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showChoice, setShowChoice] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);

  const ambientRef = useRef(null);
  const oscRef = useRef(null);
  const audioCtxRef = useRef(null);

  const chaps = [
    {
      title: "Chapter 1: The Encrypted Letter",
      text: `The envelope arrived on a Tuesday, ordinary in every way except the seal—a cipher I'd only seen once before, in a footnote of a banned manuscript.

I set my coffee down, pulse quickening. The wax bore a symbol: three interlocking circles, each containing a different phase of the moon. My grandmother had warned me about this mark. "If you ever see it," she'd whispered on her deathbed, "you'll have to choose between truth and safety."

The letter inside contained just seven words:
"The garden remembers what history forgot."

Outside my window, Washington D.C. hummed with its usual bureaucratic rhythm. Nobody knew that beneath the National Archives, in a vault labeled "Classified: Indefinite," sat documents that could rewrite everything we thought we knew about the founding of this country.

I had 48 hours to decide: decode the message and risk everything, or burn it and return to my comfortable life of academic obscurity.`,
      choice: {
        prompt: "What do you do with the letter?",
        opts: [
          { txt: "Begin decoding immediately", next: 1 },
          { txt: "Take it to your mentor, Dr. Ashford", next: 1 },
          { txt: "Burn it and forget you ever saw it", next: 1 },
        ],
      },
    },
    {
      title: "Chapter 2: The Hidden Archive",
      text: `The decision haunted me through three sleepless nights. When dawn broke on the third day, I found myself standing before Dr. Ashford's townhouse in Georgetown, the letter clutched in my hand like a loaded gun.

She opened the door still in her nightgown, took one look at the seal, and went pale.

"Come inside. Quickly."

In her study, surrounded by maps of old Washington that didn't match any official records, she explained: "Your grandmother was part of something called the Midnight Society. Cryptographers, historians, archivists—people who believed that democracy dies when secrets outlive their keepers."

She pulled a hidden panel in her bookshelf, revealing a spiral staircase I'd walked past a hundred times without seeing.

"The real Archives are down there. Everything they didn't want us to know. Everything they still don't want us to know. And if you decoded that letter, they already know you have it."

A car pulled up outside. Then another.

"There's a tunnel," Dr. Ashford said, pressing an ancient key into my palm. "It leads to the Library of Congress. You have about ninety seconds to decide if you're ready to learn what they've been hiding."`,
      choice: {
        prompt: "Do you follow Dr. Ashford into the hidden archives?",
        opts: [
          { txt: "Follow her down the staircase", next: 2 },
          { txt: "Ask to see identification from the visitors first", next: 2 },
          { txt: "Escape through the tunnel alone", next: 2 },
        ],
      },
    },
    {
      title: "Chapter 3: The Revelation",
      text: `The tunnel smelled of old paper and forgotten promises. Emergency lights cast everything in amber. Behind us, footsteps echoed—they'd found the entrance faster than Dr. Ashford had expected.

"They've been monitoring you for weeks," she panted as we ran. "Ever since you published that paper on Revolutionary War ciphers. You got too close to something they've been protecting for 200 years."

We emerged in a sub-basement I'd never known existed, surrounded by filing cabinets that stretched into darkness. Dr. Ashford pulled out a folder marked "Project Garden."

Inside were letters—from Franklin, from Jefferson, from Adams. But the signatures were all wrong. The handwriting didn't match. The dates contradicted official histories.

"The Declaration of Independence," Dr. Ashford said quietly, "was written by seventeen people, not just Jefferson. Six of them were women. Two were former slaves. Three were Native American leaders. They made a deal: they'd allow the official history to erase them if future generations would eventually learn the truth."

She handed me a photograph. It showed the original Declaration, before the edits. Before the erasures. Before history was rewritten.

"This is what they're protecting. Not national security. Not diplomatic relations. Just... ego. Legacy. The myth of the Founding Fathers."

The footsteps were getting closer.

"If we publish this," I said, "we destroy American mythology."

"Yes," Dr. Ashford agreed. "But we restore American truth."`,
      choice: {
        prompt: "What do you choose?",
        opts: [
          { txt: "Publish everything immediately", next: 3 },
          { txt: "Negotiate with those in power", next: 3 },
          { txt: "Destroy the evidence to protect the myth", next: 3 },
        ],
      },
    },
    {
      title: "Epilogue: Your Path",
      text: `[This ending changes based on your choices throughout the story]

The choices you made led to consequences rippling through history. Some truths were meant to be told. Others were meant to be protected. And some secrets... some secrets choose their own time to emerge.

Three months later, you sit in a café in Prague, reading a newspaper article about "newly discovered documents" from the Revolutionary War. The journalist who broke the story looks familiar. You realize it's the face from the photograph Dr. Ashford showed you that night.

Your phone buzzes. Unknown number:
"The garden still has secrets. Are you ready for the next one?"

You have a choice to make. You always will.`,
    },
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIO FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  const startAmbient = () => {
    if (typeof window === "undefined" || mode !== "Immersive") return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtxRef.current;
      if (oscRef.current) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      oscRef.current = osc;
    } catch (err) {
      console.error("Audio error:", err);
    }
  };

  const stopAmbient = () => {
    if (oscRef.current) {
      oscRef.current.stop();
      oscRef.current = null;
    }
  };

  const speak = (text) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.pitch = 1.0;
    u.volume = 0.8;
    window.speechSynthesis.speak(u);
  };

  const startVoiceRecognition = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser");
      return;
    }
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.onstart = () => setVoiceActive(true);
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript.toLowerCase();
      const choice = chaps[chIdx].choice;
      if (!choice) return;
      const idx = choice.opts.findIndex((o) => transcript.includes(o.txt.toLowerCase().substring(0, 10)));
      if (idx !== -1) makeChoice(choice.opts[idx]);
      else speak("I didn't understand that choice. Please try again.");
    };
    rec.onerror = () => setVoiceActive(false);
    rec.onend = () => setVoiceActive(false);
    rec.start();
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CHOICE HANDLING
  // ═══════════════════════════════════════════════════════════════════════════
  const makeChoice = (opt) => {
    setChoices([...choices, { ch: chIdx, choice: opt.txt }]);
    setShowChoice(false);
    if (opt.next < chaps.length) setChIdx(opt.next);
    if (opt.next === chaps.length - 1) stopAmbient();
  };

  useEffect(() => {
    if (pg === "reading" && chIdx < chaps.length) {
      const ch = chaps[chIdx];
      setTxt(ch.text);
      if (mode === "Cinematic" || mode === "Immersive") speak(ch.text);
      if (mode === "Immersive") startAmbient();
      const timer = setTimeout(() => {
        if (ch.choice) setShowChoice(true);
      }, mode === "Reader" ? 2000 : 8000);
      return () => clearTimeout(timer);
    }
  }, [pg, chIdx, mode]);

  useEffect(() => {
    return () => {
      stopAmbient();
      if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER LOGIC
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── CREATOR DASHBOARD ───
  if (pg === "creator") {
    return <CreatorDashboard onBackToReader={() => setPg("home")} />;
  }

  // ─── LANDING PAGE ───
  if (pg === "landing") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
          position: "relative",
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Top Nav */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px 5%",
            zIndex: 10,
            animation: "fadeDown 0.6s ease both",
          }}
        >
          <img 
            src="/movianx-logo.png" 
            alt="Movianx"
            style={{
              height: 40,
              width: "auto",
            }}
          />
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <button
              onClick={() => setPg("creator")}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.6)",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#fff")}
              onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.6)")}
            >
              Sign In
            </button>
            <button
              onClick={() => setPg("creator")}
              style={{
                padding: "10px 20px",
                borderRadius: 20,
                background: "#fff",
                border: "none",
                color: "#000",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255,255,255,0.9)";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#fff";
                e.target.style.transform = "translateY(0)";
              }}
            >
              For Creators
            </button>
          </div>
        </div>

        {/* Hero */}
        <div style={{ textAlign: "center", maxWidth: 900, zIndex: 1, marginTop: "60px" }}>
          <h1
            style={{
              fontSize: "clamp(42px, 8vw, 72px)",
              fontWeight: 700,
              color: "#fff",
              marginBottom: 20,
              letterSpacing: "-2px",
              lineHeight: 1.1,
              animation: "fadeUp 0.8s ease both 0.2s",
              opacity: 0,
            }}
          >
            What do you want to experience?
          </h1>
          <p style={{ 
            fontSize: 18, 
            color: "rgba(255,255,255,0.6)", 
            marginBottom: 50, 
            lineHeight: 1.6,
            animation: "fadeUp 0.8s ease both 0.3s",
            opacity: 0,
          }}>
            Books that adapt to you. Stories that listen. Worlds you shape with every choice.
          </p>

          <div
            style={{
              display: "flex",
              gap: 20,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 60,
              animation: "fadeUp 0.8s ease both 0.4s",
              opacity: 0,
            }}
          >
            <button
              onClick={() => setPg("home")}
              style={{
                padding: "18px 36px",
                borderRadius: 20,
                background: "#fff",
                border: "none",
                color: "#000",
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255,255,255,0.9)";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#fff";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Get Started
            </button>
          </div>

          {/* Feature Pills */}
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
              animation: "fadeUp 0.8s ease both 0.5s",
              opacity: 0,
            }}
          >
            {["Choice-Driven Narratives", "AI Narration", "Adaptive Soundscapes", "Immersive Visuals"].map((f) => (
              <div
                key={f}
                style={{
                  padding: "8px 16px",
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 13,
                  fontWeight: 500,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.15)";
                  e.target.style.borderColor = "rgba(255,255,255,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.1)";
                  e.target.style.borderColor = "rgba(255,255,255,0.2)";
                }}
              >
                {f}
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // ─── HOME PAGE ───
  if (pg === "home") {
    return (
      <div
        style={{
          height: "100vh",
          background: "#000",
          fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflowY: "scroll",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 5%",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            animation: "fadeDown 0.6s ease both",
          }}
        >
          <div
            onClick={() => setPg("landing")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
            }}
          >
            <img 
              src="/movianx-logo.png" 
              alt="Movianx"
              style={{
                height: 36,
                width: "auto",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <button
              onClick={() => setPg("creator")}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.6)",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#fff")}
              onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.6)")}
            >
              Sign In
            </button>
            <button
              onClick={() => setPg("creator")}
              style={{
                padding: "10px 20px",
                borderRadius: 20,
                background: "#fff",
                border: "none",
                color: "#000",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255,255,255,0.9)";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#fff";
                e.target.style.transform = "translateY(0)";
              }}
            >
              For Creators
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "32px 5% 60px",
            overflowY: "auto",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(24px, 4vw, 40px)",
              fontWeight: 700,
              color: "#fff",
              marginBottom: 8,
              textAlign: "center",
              letterSpacing: "-1px",
              animation: "fadeUp 0.8s ease both 0.1s",
              opacity: 0,
            }}
          >
            Choose Your Experience
          </h1>
          <p
            style={{
              fontSize: "clamp(13px, 2vw, 16px)",
              color: "rgba(255,255,255,0.6)",
              marginBottom: 32,
              textAlign: "center",
              maxWidth: 500,
              animation: "fadeUp 0.8s ease both 0.2s",
              opacity: 0,
            }}
          >
            Explore interactive stories, cinematic adaptations, and connect with creators.
          </p>

          {/* App Tiles */}
          <div
            style={{
              display: "flex",
              gap: 16,
              width: "100%",
              maxWidth: 900,
              justifyContent: "center",
              flexWrap: "wrap",
              paddingBottom: 40,
            }}
          >
            {/* Stories Tile - ACTIVE */}
            <button
              onClick={() => {
                setSel(stories[0]);
                setPg("detail");
              }}
              style={{
                width: 160,
                height: 160,
                background: "#fff",
                border: "none",
                borderRadius: 20,
                padding: "20px",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                textAlign: "left",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                animation: "fadeUp 0.8s ease both 0.3s",
                opacity: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 20px 60px rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 8 }}>📚</div>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#000",
                  marginBottom: 6,
                  letterSpacing: "-0.3px",
                }}
              >
                Stories
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(0,0,0,0.6)",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Interactive fiction
              </p>
              <div
                style={{
                  position: "absolute",
                  bottom: 16,
                  right: 16,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
                onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
              >
                →
              </div>
            </button>

            {/* Cinema Tile - COMING SOON */}
            <div
              style={{
                width: 160,
                height: 160,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 20,
                padding: "20px",
                cursor: "not-allowed",
                textAlign: "left",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                animation: "fadeUp 0.8s ease both 0.4s",
                opacity: 0,
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 8, opacity: 0.4 }}>🎬</div>
              <h3
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: 6,
                  letterSpacing: "-0.5px",
                }}
              >
                Cinema
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.3)",
                  lineHeight: 1.5,
                  marginBottom: 12,
                }}
              >
                Coming soon
              </p>
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 10px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.1)",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.5)",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Coming Soon
              </div>
            </div>

            {/* Artists Tile - COMING SOON */}
            <div
              style={{
                width: 160,
                height: 160,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 20,
                padding: "20px",
                cursor: "not-allowed",
                textAlign: "left",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                animation: "fadeUp 0.8s ease both 0.5s",
                opacity: 0,
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 8, opacity: 0.4 }}>🎨</div>
              <h3
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: 6,
                  letterSpacing: "-0.5px",
                }}
              >
                Artists
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.3)",
                  lineHeight: 1.5,
                  marginBottom: 12,
                }}
              >
                Coming soon
              </p>
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 10px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.1)",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.5)",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Coming Soon
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // ─── DETAIL PAGE ───
  if (pg === "detail" && sel) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0A0A0F",
          fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {/* Hero Section */}
        <div
          style={{
            position: "relative",
            height: "60vh",
            background: `linear-gradient(to bottom, rgba(10,10,15,0.3), rgba(10,10,15,0.95)), url(${sel.cover})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "flex-end",
            padding: "40px",
          }}
        >
          <button
            onClick={() => setPg("home")}
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              background: "rgba(20,20,25,0.8)",
              border: "1px solid #2A2A35",
              borderRadius: 8,
              padding: "10px 16px",
              color: "#F0F0F5",
              fontSize: 14,
              cursor: "pointer",
              backdropFilter: "blur(10px)",
            }}
          >
            ← Back
          </button>
          <div style={{ maxWidth: 1400, width: "100%" }}>
            <div style={{ fontSize: 13, color: "#9090A0", marginBottom: 8, textTransform: "uppercase" }}>
              {sel.genre}
            </div>
            <h1 style={{ fontSize: 52, fontWeight: 800, color: "#F0F0F5", marginBottom: 12, letterSpacing: "-1px" }}>
              {sel.title}
            </h1>
            <p style={{ fontSize: 16, color: "#9090A0", marginBottom: 4 }}>by {sel.author}</p>
            <div style={{ display: "flex", gap: 20, fontSize: 14, color: "#9090A0", marginBottom: 24 }}>
              <span>★ {sel.rating}</span>
              <span>📖 {sel.chapters} chapters</span>
              <span>👁 {sel.reads}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "40px" }}>
          <p style={{ fontSize: 18, color: "#F0F0F5", marginBottom: 40, lineHeight: 1.7 }}>{sel.desc}</p>

          {/* Immersion Levels */}
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "#F0F0F5", marginBottom: 20 }}>Choose Your Experience</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20, marginBottom: 40 }}>
            {sel.immersions.map((im) => (
              <button
                key={im}
                onClick={() => {
                  setMode(im);
                  setPg("reading");
                }}
                style={{
                  padding: 24,
                  borderRadius: 16,
                  background: "#141419",
                  border: mode === im ? "2px solid #E8364F" : "2px solid #2A2A35",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(232,54,79,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 700, color: "#F0F0F5", marginBottom: 8 }}>{im}</div>
                <p style={{ fontSize: 13, color: "#9090A0", lineHeight: 1.5 }}>
                  {im === "Reader"
                    ? "Classic reading experience with choice-driven branching."
                    : im === "Cinematic"
                    ? "Professional AI narration with ambient soundscapes."
                    : "Full immersion: voice control, real-time visuals, adaptive audio."}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── READING PAGE ───
  if (pg === "reading" && chIdx < chaps.length) {
    const ch = chaps[chIdx];
    return (
      <div
        style={{
          minHeight: "100vh",
          background: mode === "Immersive" ? "#000" : "#0A0A0F",
          fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            background: "rgba(10,10,15,0.95)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid #2A2A35",
            padding: "16px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 100,
          }}
        >
          <button
            onClick={() => {
              stopAmbient();
              if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
              setPg("detail");
            }}
            style={{
              background: "transparent",
              border: "none",
              color: "#9090A0",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            ← Exit
          </button>
          <div style={{ fontSize: 13, color: "#9090A0" }}>
            {ch.title} • {mode} Mode
          </div>
          {mode === "Immersive" && (
            <button
              onClick={() => {
                setVoiceMode(!voiceMode);
                if (!voiceMode) startVoiceRecognition();
              }}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                background: voiceActive ? "#E8364F" : "transparent",
                border: `1px solid ${voiceActive ? "#E8364F" : "#2A2A35"}`,
                color: voiceActive ? "#fff" : "#9090A0",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {voiceActive ? "🎤 Listening..." : "🎤 Voice Control"}
            </button>
          )}
        </div>

        {/* Content */}
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "100px 40px 60px" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#F0F0F5", marginBottom: 30, letterSpacing: "-0.5px" }}>
            {ch.title}
          </h2>
          <div style={{ fontSize: 17, color: "#F0F0F5", lineHeight: 1.9, marginBottom: 40, whiteSpace: "pre-wrap" }}>
            {txt}
          </div>

          {/* Choices */}
          {showChoice && ch.choice && (
            <div
              style={{
                background: "#141419",
                borderRadius: 16,
                border: "1px solid #2A2A35",
                padding: 32,
                marginTop: 40,
              }}
            >
              <p style={{ fontSize: 18, fontWeight: 600, color: "#F0F0F5", marginBottom: 20 }}>{ch.choice.prompt}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {ch.choice.opts.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => makeChoice(opt)}
                    style={{
                      padding: "16px 20px",
                      borderRadius: 12,
                      background: "#1C1C24",
                      border: "1px solid #2A2A35",
                      color: "#F0F0F5",
                      fontSize: 15,
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(232,54,79,0.1)";
                      e.target.style.borderColor = "#E8364F";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#1C1C24";
                      e.target.style.borderColor = "#2A2A35";
                    }}
                  >
                    {opt.txt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
