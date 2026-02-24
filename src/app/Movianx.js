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
        paddingBottom: 60,
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
      width: 260, 
      height: "100%",
      background: "#000", // Solid black, not transparent
      borderRight: `1px solid ${BORDER}`,
      display: "flex", 
      flexDirection: "column", 
      flexShrink: 0,
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
  const [menuOpen, setMenuOpen] = useState(false);

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
      position: "relative",
    }}>
      {/* Mobile Menu Button - Always Visible */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 250,
          padding: "12px 14px",
          borderRadius: 8,
          background: "#000",
          border: "1px solid #fff",
          color: "#fff",
          fontSize: 20,
          cursor: "pointer",
          display: typeof window !== "undefined" && window.innerWidth > 768 ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        }}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar - Solid Background */}
      <div
        style={{
          position: typeof window !== "undefined" && window.innerWidth <= 768 ? "fixed" : "relative",
          top: 0,
          left: menuOpen || (typeof window !== "undefined" && window.innerWidth > 768) ? 0 : -300,
          height: "100vh",
          width: 260,
          background: "#000", // Solid black background
          zIndex: 200,
          transition: "left 0.3s ease",
          boxShadow: typeof window !== "undefined" && window.innerWidth <= 768 ? "4px 0 12px rgba(0,0,0,0.5)" : "none",
        }}
      >
        <Sidebar active={active} setActive={(id) => { setActive(id); setMenuOpen(false); }} user={user} />
      </div>

      {/* Overlay - Darker */}
      {menuOpen && typeof window !== "undefined" && window.innerWidth <= 768 && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 150,
          }}
        />
      )}

      <div style={{ flex: 1, padding: "32px 20px", overflowY: "auto", maxHeight: "100vh" }}>
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
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
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
    title: "Frankenstein",
    author: "Mary Shelley",
    genre: "Gothic / Classic",
    cover: "https://picsum.photos/seed/frankenstein/400/600",
    desc: "The timeless tale of ambition and creation. Victor Frankenstein's pursuit of forbidden knowledge leads to consequences that will haunt him forever. Your choices shape the tragic destinies of creator and creature.",
    immersions: ["Reader", "Cinematic", "Immersive"],
    rating: 4.9,
    reads: "159K",
    chapters: 6,
    isClassic: true,
  },
  {
    id: 2,
    title: "The Choice [Sample]",
    author: "Movianx Demo",
    genre: "Thriller / Interactive",
    cover: "https://picsum.photos/seed/choice/400/600",
    desc: "A quick 3-minute demo showing how choices branch the story. Perfect for creators to see the platform in action.",
    immersions: ["Reader", "Cinematic", "Immersive"],
    rating: 4.7,
    reads: "Sample",
    chapters: 3,
    isSample: true,
  },
  {
    id: 3,
    title: "10 Seconds",
    author: "Movianx Original",
    genre: "Thriller / Survival Horror",
    cover: "https://picsum.photos/seed/seconds/400/600",
    desc: "You have 10 seconds to decide. Every choice. Every time. One wrong move and someone dies. Can you survive when every decision is life or death? ⏱️ TIMED CHOICES - Feel the pressure.",
    immersions: ["Reader", "Cinematic", "Immersive"],
    rating: 4.9,
    reads: "New",
    chapters: 4,
    isTimed: true,
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
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [narratorOn, setNarratorOn] = useState(true);
  const [soundEffectsOn, setSoundEffectsOn] = useState(true);
  const [fadeOut, setFadeOut] = useState(false); // For smooth page transitions

  const ambientRef = useRef(null);
  const oscRef = useRef(null);
  const audioCtxRef = useRef(null);
  const soundEffectRef = useRef(null);
  const recognitionRef = useRef(null); // Store recognition instance for cleanup

  // ═══════════════════════════════════════════════════════════════════════════
  // STORY CHAPTERS - Multiple Stories
  // ═══════════════════════════════════════════════════════════════════════════
  
  const frankensteinChapters = [
    {
      title: "Letter I - To Mrs. Saville, England",
      text: `St. Petersburgh, Dec. 11th, 17—.

You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.

I am already far north of London, and as I walk in the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight. Do you understand this feeling? This breeze, which has travelled from the regions towards which I am advancing, gives me a foretaste of those icy climes.

Inspired by this wind of promise, my daydreams become more fervent and vivid. I try in vain to be persuaded that the pole is the seat of frost and desolation; it ever presents itself to my imagination as the region of beauty and delight.

There—for with your leave, my sister, I will put some trust in preceding navigators—there snow and frost are banished; and, sailing over a calm sea, we may be wafted to a land surpassing in wonders and in beauty every region hitherto discovered on the habitable globe.

What may not be expected in a country of eternal light? I may there discover the wondrous power which attracts the needle and may regulate a thousand celestial observations that require only this voyage to render their seeming eccentricities consistent forever.

I shall satiate my ardent curiosity with the sight of a part of the world never before visited, and may tread a land never before imprinted by the foot of man. These are my enticements, and they are sufficient to conquer all fear of danger or death.`,
      choice: {
        prompt: "As Captain Walton, should I share my deepest ambitions with my sister, or keep some doubts to myself?",
        emotion: "ambitious",
        opts: [
          { txt: "Share everything - my burning desire for glory", next: 1, consequence: "honest" },
          { txt: "Express some caution about the dangers ahead", next: 1, consequence: "cautious" },
        ],
      },
      narrator: "Captain Robert Walton writes to his sister from St. Petersburgh, filled with ambition for his Arctic expedition.",
      emotion: "calm",
    },
    {
      title: "Letter IV - The Stranger",
      text: `August 5th, 17—.

So strange an accident has happened to us that I cannot forbear recording it, although it is very probable that you will see me before these papers can come into your possession.

Last Monday we were nearly surrounded by ice, which closed in the ship on all sides, scarcely leaving her the sea-room in which she floated. Our situation was somewhat dangerous, especially as we were compassed round by a very thick fog.

At about two o'clock the mist cleared away, and we beheld, stretched out in every direction, vast and irregular plains of ice, which seemed to have no end. Some of my comrades groaned, and my own mind began to grow watchful with anxious thoughts, when a strange sight suddenly attracted our attention and diverted our solicitude from our own situation.

We perceived a low carriage, fixed on a sledge and drawn by dogs, pass on towards the north, at the distance of half a mile; a being which had the shape of a man, but apparently of gigantic stature, sat in the sledge and guided the dogs. We watched the rapid progress of the traveller with our telescopes until he was lost among the distant inequalities of the ice.

The next morning—this sight appeared to have troubled my crew—we were again surrounded by ice. A traveller's sledge appeared, and we perceived that it was a man of ordinary stature. He was not, as the other traveller seemed to be, a savage inhabitant of some undiscovered island, but a European.

When I appeared on deck, the stranger addressed me in English, although with a foreign accent. "Before I come on board your vessel," said he, "will you have the kindness to inform me whither you are bound?"

I replied that we were on a voyage of discovery towards the northern pole. Upon hearing this he consented to come on board.

His limbs were nearly frozen, and his body dreadfully emaciated by fatigue and suffering. I never saw a man in so wretched a condition. We attempted to carry him into the cabin, but as soon as he had quitted the fresh air he fainted.

When he recovered, I nursed him with the greatest care. Two days passed before he was able to speak, and I often feared that his sufferings had deprived him of understanding. When he had in some measure recovered, I removed him to my own cabin and attended on him as much as my duty would permit.`,
      choice: {
        prompt: "This stranger seems to carry a terrible burden. Should I press him for his story now, or give him more time to recover?",
        emotion: "curious",
        opts: [
          { txt: "Ask him gently about his journey", next: 2, consequence: "patient" },
          { txt: "Wait until he's ready to share", next: 2, consequence: "respectful" },
        ],
      },
      narrator: "Walton's crew encounters a mysterious figure on the ice, followed by a desperate stranger seeking refuge.",
      emotion: "tense",
      sound: "ambient-winds.mp3",
    },
    {
      title: "Chapter I - Victor's Childhood",
      text: `I am by birth a Genevese, and my family is one of the most distinguished of that republic. My ancestors had been for many years counsellors and syndics, and my father had filled several public situations with honour and reputation.

My father had a sister whom he tenderly loved. After her marriage, he saw her husband become through a series of unfortunate circumstances, reduced to great poverty. My father relieved him in a very generous manner, and after my cousin's death, he took upon himself the care of my aunt's only daughter.

My mother's tender caresses and my father's smile of benevolent pleasure while regarding me are my first recollections. I was their plaything and their idol, and something better—their child, the innocent and helpless creature bestowed on them by heaven, whom to bring up to good, and whose future lot it was in their hands to direct to happiness or misery.

For a long time I was their only care. When I was about five years old, while making an excursion beyond the frontiers of Italy, they passed a week on the shores of the Lake of Como. On the evening of their return, my mother, accompanied by a young girl, entered our home. That young girl was Elizabeth Lavenza, the daughter of a Milanese nobleman.

She became more than a sister to me. She was the living spirit of love to soften and attract; I might have become sullen in my study, rough through the ardour of my nature, but that she was there to subdue me to a semblance of her own gentleness.

On the birth of a second son, my junior by seven years, my parents gave up entirely their wandering life and fixed themselves in their native country. We possessed a house in Geneva, and a campagne on Belrive, the eastern shore of the lake, at the distance of rather more than a league from the city.

My temper was sometimes violent, and my passions vehement; but by some law in my temperature they were turned not towards childish pursuits but to an eager desire to learn.`,
      choice: {
        prompt: "Young Victor shows early signs of intense curiosity. Should I encourage this thirst for knowledge without bounds, or should I counsel moderation?",
        emotion: "reflective",
        opts: [
          { txt: "Pursue knowledge with unbridled passion", next: 3, consequence: "ambitious" },
          { txt: "Balance ambition with wisdom and caution", next: 3, consequence: "measured" },
        ],
      },
      narrator: "Victor Frankenstein recounts his idyllic childhood in Geneva and his deep bond with Elizabeth.",
      emotion: "calm",
    },
    {
      title: "Chapter IV - The Secret of Life",
      text: `It was on a dreary night of November that I beheld the accomplishment of my toils. With an anxiety that almost amounted to agony, I collected the instruments of life around me, that I might infuse a spark of being into the lifeless thing that lay at my feet.

It was already one in the morning; the rain pattered dismally against the panes, and my candle was nearly burnt out, when, by the glimmer of the half-extinguished light, I saw the dull yellow eye of the creature open; it breathed hard, and a convulsive motion agitated its limbs.

How can I describe my emotions at this catastrophe, or how delineate the wretch whom with such infinite pains and care I had endeavoured to form? His limbs were in proportion, and I had selected his features as beautiful. Beautiful! Great God!

His yellow skin scarcely covered the work of muscles and arteries beneath; his hair was of a lustrous black, and flowing; his teeth of a pearly whiteness; but these luxuriances only formed a more horrid contrast with his watery eyes, that seemed almost of the same colour as the dun-white sockets in which they were set, his shrivelled complexion and straight black lips.

I had worked hard for nearly two years, for the sole purpose of infusing life into an inanimate body. For this I had deprived myself of rest and health. I had desired it with an ardour that far exceeded moderation; but now that I had finished, the beauty of the dream vanished, and breathless horror and disgust filled my heart.

Unable to endure the aspect of the being I had created, I rushed out of the room and continued a long time traversing my bed-chamber, unable to compose my mind to sleep.

Oh! No mortal could support the horror of that countenance. A mummy again endued with animation could not be so hideous as that wretch. I had gazed on him while unfinished; he was ugly then, but when those muscles and joints were rendered capable of motion, it became a thing such as even Dante could not have conceived.`,
      choice: {
        prompt: "I have created life, but it fills me with horror. Should I face my creation and take responsibility, or flee from this nightmare?",
        emotion: "terrified",
        opts: [
          { txt: "Return to the laboratory and face what I've created", next: 4, consequence: "responsibility" },
          { txt: "Abandon the creature and try to forget this horror", next: 4, consequence: "abandonment" },
        ],
      },
      narrator: "Victor brings his creation to life, but is immediately struck with horror at what he has made.",
      emotion: "terrified",
      sound: "heartbeat.mp3",
      jumpScare: true,
    },
    {
      title: "The Creature Speaks",
      text: `"All men hate the wretched; how, then, must I be hated, who am miserable beyond all living things! Yet you, my creator, detest and spurn me, thy creature, to whom thou art bound by ties only dissoluble by the annihilation of one of us.

"You purpose to kill me. How dare you sport thus with life? Do your duty towards me, and I will do mine towards you and the rest of mankind. If you will comply with my conditions, I will leave them and you at peace; but if you refuse, I will glut the maw of death, until it be satiated with the blood of your remaining friends."

"Abhorred monster! Fiend that thou art! The tortures of hell are too mild a vengeance for thy crimes. Wretched devil! You reproach me with your creation, come on, then, that I may extinguish the spark which I so negligently bestowed."

"Be calm! I entreat you to hear me before you give vent to your hatred on my devoted head. Have I not suffered enough, that you seek to increase my misery? Life, although it may only be an accumulation of anguish, is dear to me, and I will defend it.

"Remember, thou hast made me more powerful than thyself; my height is superior to thine, my joints more supple. But I will not be tempted to set myself in opposition to thee. I am thy creature, and I will be even mild and docile to my natural lord and king if thou wilt also perform thy part, the which thou owest me.

"Oh, Frankenstein, be not equitable to every other and trample upon me alone, to whom thy justice, and even thy clemency and affection, is most due. Remember that I am thy creature; I ought to be thy Adam, but I am rather the fallen angel, whom thou drivest from joy for no misdeed. Everywhere I see bliss, from which I alone am irrevocably excluded. I was benevolent and good; misery made me a fiend. Make me happy, and I shall again be virtuous."

"Begone! I will not hear you. There can be no community between you and me; we are enemies. Begone, or let us try our strength in a fight, in which one must fall."

"How can I move thee? Will no entreaties cause thee to turn a favourable eye upon thy creature, who implores thy goodness and compassion? Believe me, Frankenstein, I was benevolent; my soul glowed with love and humanity; but am I not alone, miserably alone? You, my creator, abhor me; what hope can I gather from your fellow creatures, who owe me nothing? They spurn and hate me."`,
      choice: {
        prompt: "The creature demands that I create a companion for him. Should I grant this request and risk unleashing two monsters, or refuse and face his vengeance?",
        emotion: "anguished",
        opts: [
          { txt: "Agree to create a companion - perhaps it will bring peace", next: 5, consequence: "agreement" },
          { txt: "Refuse - I cannot risk creating another monster", next: 5, consequence: "refusal" },
        ],
      },
      narrator: "The creature confronts Victor and makes a terrible demand.",
      emotion: "tense",
    },
    {
      title: "Epilogue - The Cost of Ambition",
      text: `[Your choices have shaped Victor's fate]

"Farewell, Walton! Seek happiness in tranquillity and avoid ambition, even if it be only the apparently innocent one of distinguishing yourself in science and discoveries. Yet why do I say this? I have myself been blasted in these hopes, yet another may succeed."

His voice became fainter as he spoke, and at length, exhausted by his effort, he sank into silence. The monster has disappeared, vanished into the darkness of the Arctic night.

I am returning to England. I have learned that some secrets are not meant to be discovered, and some knowledge comes at too terrible a price. The modern Prometheus has paid for his theft of nature's fire.

What lessons will you carry forward? That ambition unchecked leads to ruin? That we bear responsibility for what we create? That even monsters deserve compassion?

Frankenstein's tale is a warning that echoes through the ages: "Learn from me, if not by my precepts, at least by my example, how dangerous is the acquirement of knowledge and how much happier that man is who believes his native town to be the world, than he who aspires to become greater than his nature will allow."

The icy wastes hold many secrets still. But some stories end not with triumph, but with the haunting question:

What have we become in our pursuit to become gods?`,
    },
  ];
  
  // Sample story - quick 3-chapter demo for creators
  const sampleChapters = [
    {
      title: "The Message",
      text: `Your phone buzzes at 2 AM. Unknown number.

"Meet me at the old lighthouse. Come alone. You have one hour."

You've been investigating the disappearance of three journalists who were all working on the same story - something about the mayor's connection to offshore accounts. This could be the break you need.

But it could also be a trap.

Your editor told you to drop it. Your partner told you to be careful. The threatening letter you got last week told you to stop digging.

One hour. The lighthouse.`,
      choice: {
        prompt: "You have one hour to decide. Do you go to the lighthouse alone, or call for backup?",
        emotion: "tense",
        opts: [
          { txt: "Go alone - this source won't talk if I bring anyone", next: 1, consequence: "alone" },
          { txt: "Call my partner for backup first", next: 2, consequence: "backup" },
        ],
      },
      narrator: "You receive a mysterious message in the middle of the night.",
      emotion: "calm",
    },
    {
      title: "The Lighthouse - Alone",
      text: `The lighthouse looms against the night sky. No lights. No cars in the lot.

You park a quarter mile away and approach on foot, phone flashlight off. The door is unlocked.

Inside, the beam of your flashlight catches something on the floor. Files. Dozens of them, scattered everywhere. Financial records. Wire transfers. Photos.

Then you hear it - footsteps on the spiral stairs above. Coming down.

A voice from the darkness: "You came alone. Good. That means you're serious about the truth."

A figure emerges. You recognize them immediately - it's the mayor's chief of staff. They're holding a USB drive.

"Everything's on here. But if you take it, they'll know it was me. We both go down. Or..." They pause. "Or you walk away, and I'll make sure the right people see this anonymously. You get your story, I keep my life."`,
      choice: {
        prompt: "Take the evidence yourself and risk exposing your source, or trust them to leak it anonymously?",
        emotion: "tense",
        opts: [
          { txt: "Take the USB drive - I need to verify this myself", next: 3, consequence: "take" },
          { txt: "Let them leak it anonymously - protect the source", next: 3, consequence: "trust" },
        ],
      },
      narrator: "You arrive at the lighthouse and make a fateful choice.",
      emotion: "nervous",
      sound: "footsteps.mp3",
    },
    {
      title: "The Lighthouse - With Backup",
      text: `Your partner arrives in an unmarked car. You approach the lighthouse together.

The door is unlocked. Inside, files are scattered everywhere - financial records, wire transfers, photos. But no one is here.

"This is too easy," your partner whispers. "Something's wrong."

That's when you hear the click. A camera shutter. Then another. Then footsteps - multiple people, moving fast.

Lights flood the lighthouse. Cameras. Reporters.

A voice shouts: "There they are! The journalists who fabricated evidence against the mayor!"

Your partner grabs your arm. The files on the floor - you recognize them now. They're the stories YOU'VE been working on. But the documents have been altered. Forged signatures. Fake timestamps.

Someone set you up.

The story breaks before sunrise: "Journalists caught planting false evidence in staged meeting." Your source never existed. The real story - whatever it was - is buried forever.`,
      choice: {
        prompt: "Your reputation is destroyed, but you know the truth is still out there. Give up and accept defeat, or keep digging despite everything?",
        emotion: "defeated",
        opts: [
          { txt: "This is over - I can't fight this", next: 4, consequence: "give-up" },
          { txt: "Someone went to a lot of trouble to stop me - I'm getting closer", next: 4, consequence: "persist" },
        ],
      },
      narrator: "The setup was perfect. You walked right into it.",
      emotion: "shocked",
      sound: "camera-shutters.mp3",
    },
    {
      title: "Consequences",
      text: `[Your choices have led you here]

Three days later, the truth comes out - but not the way you expected.

The mayor announces their resignation amid a federal investigation. The offshore accounts were real. The missing journalists - they're alive, in witness protection, cooperating with the FBI.

Your choice to go alone meant the source trusted you. The evidence was real. Your story breaks the case wide open, and you win the Pulitzer.

OR

Your choice to bring backup triggered the trap. The real whistleblower saw the setup and disappeared. The mayor is still in office. The investigation is closed. You're working at a small-town paper, trying to rebuild your career.

In journalism, sometimes the story chooses you. And sometimes, your choices determine whether you become part of the story - or its victim.

THE END

[This was a sample. Imagine this at novel length, with dozens of branching paths, multiple perspectives, and consequences that echo through 20+ chapters.]`,
    },
  ];
  
  // Timed thriller - 10 SECONDS to decide, high stakes, survival horror
  const timedThrillerChapters = [
    {
      title: "Home Invasion - 3:47 AM",
      text: `CRASH.

Glass shattering downstairs. Your eyes snap open.

Your wife Sarah is beside you, stirring. Your daughter's room is down the hall. Your son sleeps across from her.

Another sound. Footsteps. Multiple people. Whispering.

"Did you hear that?" Sarah grabs your arm, terrified.

Your phone is on the nightstand. The panic button for the alarm is across the room. The gun safe is in the closet - code 4-7-2-9 - but it'll take 15 seconds to open.

More footsteps. Coming up the stairs.

You have 10 seconds.`,
      choice: {
        prompt: "DECIDE NOW.",
        emotion: "panicked",
        timeLimit: 10, // seconds
        opts: [
          { txt: "Get the gun from the safe", next: 1, consequence: "armed" },
          { txt: "Hit the panic button", next: 2, consequence: "alarm" },
          { txt: "Grab the kids and hide", next: 3, consequence: "hide" },
        ],
      },
      narrator: "Glass breaks. Intruders are in your house. Your family is in danger.",
      emotion: "terrified",
      sound: "heartbeat.mp3",
      urgentSound: "ticking.mp3",
    },
    {
      title: "The Standoff",
      text: `You sprint to the closet. 4-7-2-9. Your hands are shaking.

The safe opens. Glock 19. Loaded mag. You chamber a round.

Sarah is at the bedroom door, holding it shut. "They're right outside!"

The doorknob turns.

"Don't come in!" you shout. "I'm armed!"

A voice from the other side: "We know. That's why we brought three guns."

Silence.

Then: "Here's the deal. We're taking your daughter. You can either let us walk out, or we can shoot through this door and take her anyway. You might get one of us. We'll definitely get you, your wife, and both kids."

Sarah is crying. "What do we do?"

Through the crack in the door, you see shadows. Three of them. They're not lying.

10 seconds.`,
      choice: {
        prompt: "WHAT DO YOU DO?",
        emotion: "desperate",
        timeLimit: 10,
        opts: [
          { txt: "Open fire through the door", next: 4, consequence: "violence" },
          { txt: "Negotiate - offer them money instead", next: 4, consequence: "negotiate" },
          { txt: "Stall - police might be coming", next: 4, consequence: "stall" },
        ],
      },
      narrator: "Three armed intruders. They want your daughter. You have one gun.",
      emotion: "out-of-breath",
      sound: "heartbeat.mp3",
      urgentSound: "ticking.mp3",
    },
    {
      title: "The Alarm",
      text: `You lunge across the room and slam the panic button.

BEEEEEP BEEEEEP BEEEEEP

Sirens. Lights. The alarm company will call in 30 seconds. Police response time: 7 minutes.

Footsteps pound up the stairs - faster now.

Your bedroom door SLAMS open. Three masked figures. Guns drawn.

"Shut it off! NOW!"

One of them grabs Sarah. Gun to her head. "Shut off the alarm or I blow her brains out!"

The control panel is on the wall. Code: 1-9-8-3.

But if you shut it off, the alarm company won't call. No police.

Sarah is screaming. Your kids are crying down the hall.

The lead intruder cocks the hammer. "I'm counting to five. ONE."

10 seconds to decide.`,
      choice: {
        prompt: "FIVE SECONDS.",
        emotion: "panicked",
        timeLimit: 10,
        opts: [
          { txt: "Shut off the alarm - save Sarah now", next: 4, consequence: "comply" },
          { txt: "Refuse - 7 minutes until police arrive", next: 4, consequence: "resist" },
          { txt: "Give them what they want - no one dies", next: 4, consequence: "surrender" },
        ],
      },
      narrator: "Gun to your wife's head. Alarm is blaring. They're giving you five seconds.",
      emotion: "terrified",
      sound: "alarm.mp3",
      urgentSound: "ticking.mp3",
      jumpScare: true,
    },
    {
      title: "Consequences",
      text: `[Time's up]

BANG.

The choice you made - or didn't make - determined everything.

Armed resistance: You fired. They fired back. Sarah took three rounds protecting the kids. She bled out in 4 minutes. The police arrived in 7.

Negotiation: They took the money, the jewelry, everything. Then they took your daughter anyway. "You're a witness now," one said. She was found two states over, three weeks later. Alive, but changed forever.

Stalling: They didn't believe you. Shot your son to prove they were serious. You gave them everything. They left. Your son died in your arms waiting for the ambulance.

Alarm refusal: Sarah died instantly. But the alarm brought police in 6 minutes. The intruders fled. Your kids survived. You'll never forget the sound of that gunshot. Never.

Surrender: They took your daughter. You never saw her again. The guilt of choosing your wife over your child consumes you. Sarah can't look at you anymore.

The truth?

There was no good choice.

Just the one you made in 10 seconds.

And the one you'll live with forever.

[END]

This is what pressure feels like. This is what stakes mean. Every choice in 10 seconds. Every consequence permanent.

Welcome to Movianx.`,
    },
  ];
  
  // Route to correct chapters based on selected story
  const chaps = sel?.id === 1 ? frankensteinChapters : 
                sel?.id === 2 ? sampleChapters :
                sel?.id === 3 ? timedThrillerChapters :
                frankensteinChapters; // default to Frankenstein

  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIO FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  const startAmbient = () => {
    if (typeof window === "undefined" || mode !== "Immersive") return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtxRef.current;
      if (oscRef.current) return;
      
      // Create a more complex thriller soundscape
      const bass = ctx.createOscillator();
      const mid = ctx.createOscillator();
      const bassGain = ctx.createGain();
      const midGain = ctx.createGain();
      const masterGain = ctx.createGain();
      
      // Deep bass drone
      bass.type = "sine";
      bass.frequency.setValueAtTime(55, ctx.currentTime);
      bassGain.gain.setValueAtTime(0.05, ctx.currentTime);
      
      // Mid-range tension
      mid.type = "triangle";
      mid.frequency.setValueAtTime(220, ctx.currentTime);
      midGain.gain.setValueAtTime(0.02, ctx.currentTime);
      
      // Connect everything
      bass.connect(bassGain);
      mid.connect(midGain);
      bassGain.connect(masterGain);
      midGain.connect(masterGain);
      masterGain.connect(ctx.destination);
      masterGain.gain.setValueAtTime(0.3, ctx.currentTime);
      
      bass.start();
      mid.start();
      
      oscRef.current = { bass, mid };
    } catch (err) {
      console.error("Audio error:", err);
    }
  };

  const stopAmbient = () => {
    if (oscRef.current) {
      if (oscRef.current.bass) oscRef.current.bass.stop();
      if (oscRef.current.mid) oscRef.current.mid.stop();
      oscRef.current = null;
    }
  };

  const playSoundEffect = (type) => {
    if (!soundEffectsOn || typeof window === "undefined") return;
    
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtxRef.current;
      
      // Generate procedural sound effects
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      switch(type) {
        case "footsteps":
          // Quick percussive sounds
          osc.type = "square";
          osc.frequency.setValueAtTime(80, ctx.currentTime);
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.1);
          break;
          
        case "creak":
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(200, ctx.currentTime);
          osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.8);
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.8);
          break;
          
        case "jumpscare":
          // Sharp, loud burst
          osc.type = "square";
          osc.frequency.setValueAtTime(440, ctx.currentTime);
          gain.gain.setValueAtTime(0.5, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
          break;
          
        case "heartbeat":
          // Double thump
          for (let i = 0; i < 2; i++) {
            const beat = ctx.createOscillator();
            const beatGain = ctx.createGain();
            beat.type = "sine";
            beat.frequency.setValueAtTime(60, ctx.currentTime + i * 0.2);
            beatGain.gain.setValueAtTime(0.4, ctx.currentTime + i * 0.2);
            beatGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.2 + 0.15);
            beat.connect(beatGain);
            beatGain.connect(ctx.destination);
            beat.start(ctx.currentTime + i * 0.2);
            beat.stop(ctx.currentTime + i * 0.2 + 0.15);
          }
          break;
      }
    } catch (err) {
      console.error("Sound effect error:", err);
    }
  };

  const speak = (text, emotion = "calm") => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (!narratorOn) return; // Respect narrator toggle
    
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    
    // Apply emotion-based voice parameters
    switch(emotion) {
      case "terrified":
      case "panicked":
        u.rate = 1.3; // Faster when scared
        u.pitch = 1.15; // Higher pitch
        u.volume = 0.95;
        break;
      case "out-of-breath":
      case "breathing-hard":
        u.rate = 1.2; // Quick, breathless
        u.pitch = 1.1;
        u.volume = 0.85; // Quieter
        break;
      case "scared":
      case "tense":
        u.rate = 1.0;
        u.pitch = 1.05;
        u.volume = 0.9;
        break;
      case "uneasy":
        u.rate = 0.95;
        u.pitch = 0.98;
        u.volume = 0.85;
        break;
      case "whispering":
        u.rate = 0.85;
        u.pitch = 0.9;
        u.volume = 0.5; // Very quiet
        break;
      default: // calm
        u.rate = 0.9;
        u.pitch = 0.95;
        u.volume = 0.9;
    }
    
    window.speechSynthesis.speak(u);
  };

  const startVoiceRecognition = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser");
      return;
    }
    
    // Stop any existing recognition first
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log("Recognition already stopped");
      }
    }
    
    const rec = new SpeechRecognition();
    recognitionRef.current = rec; // Store for cleanup
    
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.onstart = () => setVoiceActive(true);
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript.toLowerCase().trim();
      const choice = chaps[chIdx].choice;
      if (!choice) return;
      
      console.log("User said:", transcript);
      
      // Map natural speech to choices - MUCH more flexible
      let bestMatch = null;
      let highestScore = 0;
      
      choice.opts.forEach(opt => {
        const optionText = opt.txt.toLowerCase();
        
        // Extract ALL meaningful words from the option (not just hardcoded ones)
        const stopWords = ['the', 'a', 'an', 'to', 'and', 'or', 'it', 'in', 'on', 'at', 'for', 'with', 'as', 'your', 'my'];
        const optionWords = optionText
          .replace(/[^\w\s]/g, '') // Remove punctuation
          .split(/\s+/)
          .filter(word => word.length > 2 && !stopWords.includes(word));
        
        // Count how many words from the option appear in what the user said
        let matchScore = 0;
        optionWords.forEach(word => {
          if (transcript.includes(word)) {
            matchScore++;
          }
        });
        
        // Also check for partial matches (e.g., "upstairs" matches "upstair")
        optionWords.forEach(word => {
          const partial = word.substring(0, Math.max(4, word.length - 2));
          if (partial.length > 3 && transcript.includes(partial)) {
            matchScore += 0.5;
          }
        });
        
        // Boost score if user said something very similar
        if (transcript.includes(optionText.substring(0, 15))) {
          matchScore += 3;
        }
        
        console.log(`Option "${opt.txt}" scored ${matchScore}`);
        
        if (matchScore > highestScore) {
          highestScore = matchScore;
          bestMatch = opt;
        }
      });
      
      // Accept if we got ANY match (even weak ones)
      if (bestMatch && highestScore > 0.5) {
        console.log(`Matched: "${bestMatch.txt}" with score ${highestScore}`);
        speak(`Got it.`);
        setTimeout(() => makeChoice(bestMatch), 800);
      } else {
        // Didn't match - ask them to rephrase
        console.log("No match found");
        speak(`I didn't catch that. Try saying one of the options more clearly.`);
        setTimeout(() => {
          setVoiceActive(false);
        }, 2000);
      }
    };
    rec.onerror = () => setVoiceActive(false);
    rec.onend = () => {
      setVoiceActive(false);
      // Auto-restart if in voice mode
      if (voiceMode && showChoice) {
        setTimeout(() => startVoiceRecognition(), 500);
      }
    };
    rec.start();
  };
  
  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      } catch (e) {
        console.log("Recognition cleanup:", e);
      }
    }
    setVoiceActive(false);
    setVoiceMode(false);
  };
  
  // Smooth page navigation
  const navigateTo = (newPage) => {
    setFadeOut(true);
    setTimeout(() => {
      setPg(newPage);
      setFadeOut(false);
    }, 200);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CHOICE HANDLING
  // ═══════════════════════════════════════════════════════════════════════════
  const makeChoice = (opt) => {
    setChoices([...choices, { ch: chIdx, choice: opt.txt }]);
    setShowChoice(false);
    setTimerActive(false); // Stop timer when choice is made
    setTimeRemaining(null);
    if (opt.next < chaps.length) setChIdx(opt.next);
    if (opt.next === chaps.length - 1) stopAmbient();
  };

  useEffect(() => {
    if (pg === "reading" && chIdx < chaps.length) {
      const ch = chaps[chIdx];
      setTxt(ch.text);
      
      // Play sound effects if chapter has them
      if (ch.sound && soundEffectsOn) {
        const soundType = ch.sound.includes("creak") ? "creak" :
                         ch.sound.includes("footsteps") ? "footsteps" :
                         ch.sound.includes("heartbeat") ? "heartbeat" : null;
        if (soundType) {
          setTimeout(() => playSoundEffect(soundType), 500);
        }
      }
      
      // Jump scare effect
      if (ch.jumpScare && soundEffectsOn) {
        setTimeout(() => playSoundEffect("jumpscare"), 3000);
      }
      
      // Narrator reads text or just the narrator summary with emotion
      if (mode === "Cinematic" || mode === "Immersive") {
        const narratorText = ch.narrator || ch.text;
        const emotion = ch.emotion || "calm";
        speak(narratorText, emotion);
      }
      
      if (mode === "Immersive") startAmbient();
      
      const timer = setTimeout(() => {
        if (ch.choice) {
          setShowChoice(true);
          
          // Start countdown timer if this choice has a time limit
          if (ch.choice.timeLimit) {
            setTimeRemaining(ch.choice.timeLimit);
            setTimerActive(true);
          }
          
          // Narrator asks the choice question with emotion
          if (ch.choice.prompt && (mode === "Cinematic" || mode === "Immersive")) {
            const choiceEmotion = ch.choice.emotion || "calm";
            speak(ch.choice.prompt, choiceEmotion);
            
            // Auto-start voice recognition in Immersive mode after asking question
            if (mode === "Immersive") {
              setTimeout(() => {
                setVoiceMode(true);
                startVoiceRecognition();
              }, 3000); // Wait 3 seconds for question to finish
            }
          }
        }
      }, mode === "Reader" ? 2000 : 8000);
      return () => clearTimeout(timer);
    }
  }, [pg, chIdx, mode, narratorOn, soundEffectsOn]);

  // Countdown timer for timed choices
  useEffect(() => {
    if (!timerActive || timeRemaining === null) return;
    
    if (timeRemaining <= 0) {
      // Time's up! Auto-select first choice
      const ch = chaps[chIdx];
      if (ch.choice && ch.choice.opts[0]) {
        speak("Time's up.", "panicked");
        setTimeout(() => makeChoice(ch.choice.opts[0]), 500);
      }
      setTimerActive(false);
      return;
    }
    
    // Play urgent tick sound at 3, 2, 1
    if (timeRemaining <= 3 && soundEffectsOn) {
      playSoundEffect("heartbeat");
    }
    
    const countdown = setTimeout(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);
    
    return () => clearTimeout(countdown);
  }, [timerActive, timeRemaining]);

  // CRITICAL: Cleanup audio and microphone when navigating away or unmounting
  useEffect(() => {
    return () => {
      stopAmbient();
      stopVoiceRecognition(); // Stop microphone
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  // Stop microphone when leaving reading page or changing chapters
  useEffect(() => {
    if (pg !== "reading") {
      stopVoiceRecognition();
      stopAmbient();
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  }, [pg, chIdx]);

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
          opacity: fadeOut ? 0 : 1,
          transition: "opacity 0.2s ease-in-out",
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
              onClick={() => {
                setFadeOut(true);
                setTimeout(() => {
                  setPg("home");
                  setFadeOut(false);
                }, 200);
              }}
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
  // ─── STORY LIBRARY ───
  if (pg === "library") {
    return (
      <div
        style={{
          height: "100vh",
          background: "#000",
          fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
          overflowY: "scroll",
          WebkitOverflowScrolling: "touch",
          padding: "80px 5%",
          opacity: fadeOut ? 0 : 1,
          transition: "opacity 0.2s ease-in-out",
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigateTo("home")}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: 8,
            fontSize: 14,
            cursor: "pointer",
            marginBottom: 40,
          }}
        >
          ← Back
        </button>

        <h1 style={{ fontSize: 48, fontWeight: 700, color: "#fff", marginBottom: 16 }}>
          Story Library
        </h1>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", marginBottom: 60 }}>
          Choose your experience
        </p>

        {/* Story Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 24,
            maxWidth: 1200,
          }}
        >
          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => {
                setSel(story);
                navigateTo("detail");
              }}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16,
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.borderColor = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              <div
                style={{
                  height: 200,
                  background: `url(${story.cover})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div style={{ padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>
                    {story.title}
                  </h3>
                  {story.isTimed && <span style={{ fontSize: 20 }}>⏱️</span>}
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
                  {story.author} • {story.genre}
                </p>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 16 }}>
                  {story.desc}
                </p>
                <div style={{ display: "flex", gap: 16, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                  <span>⭐ {story.rating}</span>
                  <span>📖 {story.chapters} chapters</span>
                  <span>👁️ {story.reads}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
          opacity: fadeOut ? 0 : 1,
          transition: "opacity 0.2s ease-in-out",
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
                setFadeOut(true);
                setTimeout(() => {
                  setPg("library"); // Go to story library, not directly to a story
                  setFadeOut(false);
                }, 200);
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
                  paddingRight: 40, // Add padding so text doesn't overlap arrow
                }}
              >
                Interactive fiction
              </p>
              <div
                style={{
                  position: "absolute",
                  bottom: 20,
                  right: 20,
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
          height: "100vh",
          background: "#0A0A0F",
          fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
          overflowY: "scroll",
          WebkitOverflowScrolling: "touch",
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
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "40px 40px 80px" }}>
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
          height: "100vh",
          background: mode === "Immersive" ? "#000" : "#0A0A0F",
          fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
          position: "relative",
          overflowY: "scroll",
          WebkitOverflowScrolling: "touch",
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
            padding: "12px 20px",
            zIndex: 100,
          }}
        >
          {/* Row 1: Exit + Title */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
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
            <div style={{ fontSize: 12, color: "#9090A0" }}>
              {ch.title} • {mode} Mode
            </div>
          </div>
          
          {/* Row 2: Controls */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {(mode === "Cinematic" || mode === "Immersive") && (
                <>
                  <button
                    onClick={() => setNarratorOn(!narratorOn)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      background: narratorOn ? "rgba(232,54,79,0.2)" : "transparent",
                      border: `1px solid ${narratorOn ? "#E8364F" : "#2A2A35"}`,
                      color: narratorOn ? "#E8364F" : "#9090A0",
                      fontSize: 11,
                      cursor: "pointer",
                    }}
                    title="Toggle narrator voice"
                  >
                    {narratorOn ? "🔊" : "🔇"}
                  </button>
                  
                  <button
                    onClick={() => setSoundEffectsOn(!soundEffectsOn)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      background: soundEffectsOn ? "rgba(232,54,79,0.2)" : "transparent",
                      border: `1px solid ${soundEffectsOn ? "#E8364F" : "#2A2A35"}`,
                      color: soundEffectsOn ? "#E8364F" : "#9090A0",
                      fontSize: 11,
                      cursor: "pointer",
                    }}
                    title="Toggle sound effects"
                  >
                    {soundEffectsOn ? "🎵" : "🔇"}
                  </button>
                </>
              )}
            </div>
            
            {mode === "Immersive" && (
              <button
                onClick={() => {
                  setVoiceMode(!voiceMode);
                  if (!voiceMode) startVoiceRecognition();
                }}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  background: voiceActive ? "#E8364F" : "transparent",
                  border: `1px solid ${voiceActive ? "#E8364F" : "#2A2A35"}`,
                  color: voiceActive ? "#fff" : "#9090A0",
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                {voiceActive ? "🎤 Listening..." : "🎤 Voice"}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "100px 40px 120px" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#F0F0F5", marginBottom: 30, letterSpacing: "-0.5px" }}>
            {ch.title}
          </h2>
          <div style={{ fontSize: 17, color: "#F0F0F5", lineHeight: 1.9, marginBottom: 40, whiteSpace: "pre-wrap" }}>
            {txt}
          </div>

          {/* Choices */}
          {showChoice && ch.choice && mode !== "Immersive" && (
            <div
              style={{
                background: "#141419",
                borderRadius: 16,
                border: `1px solid ${timerActive && timeRemaining <= 3 ? "#E8364F" : "#2A2A35"}`,
                padding: 32,
                marginTop: 40,
              }}
            >
              {/* Timer Display */}
              {timerActive && timeRemaining !== null && (
                <div style={{ 
                  textAlign: "center", 
                  marginBottom: 20,
                  animation: timeRemaining <= 3 ? "pulse 0.5s infinite" : "none",
                }}>
                  <div style={{ 
                    fontSize: 48, 
                    fontWeight: 700, 
                    color: timeRemaining <= 3 ? "#E8364F" : "#F0F0F5",
                    fontFamily: "monospace",
                  }}>
                    {timeRemaining}
                  </div>
                  <div style={{ fontSize: 12, color: "#9090A0", textTransform: "uppercase", letterSpacing: 2 }}>
                    {timeRemaining <= 3 ? "DECIDE NOW!" : "SECONDS REMAINING"}
                  </div>
                </div>
              )}
              
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
          
          {/* Immersive Mode: Voice-only instruction */}
          {showChoice && ch.choice && mode === "Immersive" && (
            <div
              style={{
                background: "rgba(232,54,79,0.1)",
                borderRadius: 16,
                border: "1px solid rgba(232,54,79,0.3)",
                padding: 32,
                marginTop: 40,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>🎤</div>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#E8364F", marginBottom: 8 }}>
                {voiceActive ? "Listening..." : "Tap the mic to respond"}
              </p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                {ch.choice.prompt}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
