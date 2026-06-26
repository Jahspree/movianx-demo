import Link from "next/link";
import { SOCIAL_LINKS } from "../../lib/socialLinks.js";

// Shared chrome for the public supporting pages (/about, /news, /contact, /privacy, /terms).
// Mirrors the visual system of the static marketing bundles (/, /creators, /explore):
//   bg #FAFAF9 · ink #0E0E0E · muted #5a5a58 · red #D90429 · Inter Tight (display) + Inter (body).
// Server component — pure presentational, inline styles + one scoped <style> for hover/responsive.

const RED = "#D90429";

// Social glyphs, in the same order/shape as the bundle footer (Instagram, TikTok, YouTube, X).
const ICONS = {
  instagram: (
    <svg aria-hidden="true" focusable="false" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  tiktok: (
    <svg aria-hidden="true" focusable="false" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="17.5" r="3" />
      <path d="M10.5 17.5 V5 c2.8 0 4.6 1.4 5.5 3.4" />
    </svg>
  ),
  youtube: (
    <svg aria-hidden="true" focusable="false" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
      <polygon points="10.5 9.2 15.5 12 10.5 14.8" fill="currentColor" stroke="none" />
    </svg>
  ),
  x: (
    <svg aria-hidden="true" focusable="false" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M4 4 L20 20 M20 4 L4 20" />
    </svg>
  ),
};

function Nav() {
  return (
    <nav className="mx-nav">
      <div className="mx-nav-inner">
        <Link href="/" className="mx-wordmark" aria-label="Movianx home">
          <img src="/movianx-logo.png" alt="" height="26" style={{ width: "auto", display: "block" }} />
          <span>MOVIANX</span>
        </Link>
        <div className="mx-nav-links mx-hide-sm">
          <Link href="/about">About</Link>
          <Link href="/news">News</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <Link href="/creators" className="mx-cta">Request access</Link>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="mx-footer">
      <div className="mx-footer-grid">
        <div className="mx-footer-brand">
          <div className="mx-wordmark" style={{ cursor: "default" }}>
            <span>MOVIANX</span>
          </div>
          <p>A premium creative entertainment ecosystem for creators and the audiences who discover them.</p>
        </div>
        <div className="mx-footer-col">
          <div className="mx-eyebrow">Company</div>
          <Link href="/about">About</Link>
          <Link href="/news">News</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="mx-footer-col">
          <div className="mx-eyebrow">Follow</div>
          <div className="mx-social">
            {SOCIAL_LINKS.map((s) => (
              <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                {ICONS[s.key]}
              </a>
            ))}
          </div>
        </div>
        <div className="mx-footer-col">
          <div className="mx-eyebrow">Legal</div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
      <div className="mx-footer-base">
        <div>© 2026 Movianx. All rights reserved.</div>
        <div className="mx-footer-base-links">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}

const STYLE = `
.mx-page{background:#FAFAF9;color:#0E0E0E;min-height:100vh;font-family:Inter,system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;display:flex;flex-direction:column;}
.mx-page *{box-sizing:border-box;}
.mx-nav{position:sticky;top:0;left:0;right:0;z-index:60;backdrop-filter:blur(16px) saturate(180%);
  -webkit-backdrop-filter:blur(16px) saturate(180%);background:rgba(250,250,249,0.6);
  border-bottom:1px solid rgba(0,0,0,0.06);}
.mx-nav-inner{display:flex;align-items:center;justify-content:space-between;max-width:1320px;
  margin:0 auto;padding:15px 40px;}
.mx-wordmark{display:flex;align-items:center;gap:11px;text-decoration:none;color:#0E0E0E;}
.mx-wordmark span{font-family:'Inter Tight',sans-serif;font-weight:700;font-size:16px;letter-spacing:0.14em;}
.mx-nav-links{display:flex;align-items:center;gap:38px;font-size:13.5px;font-weight:500;
  letter-spacing:0.01em;}
.mx-nav-links a{color:#5a5a58;text-decoration:none;transition:color .2s ease;}
.mx-nav-links a:hover{color:#0E0E0E;}
.mx-cta{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:100px;
  background:${RED};color:#fff;font-size:13.5px;font-weight:600;text-decoration:none;
  box-shadow:0 8px 24px rgba(217,4,41,0.26);transition:transform .2s ease,box-shadow .2s ease;}
.mx-cta:hover{transform:translateY(-1px);box-shadow:0 10px 30px rgba(217,4,41,0.32);}

.mx-main{flex:1 0 auto;max-width:880px;width:100%;margin:0 auto;padding:88px 40px 96px;}
.mx-eyebrow{font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${RED};}
.mx-hero{padding:40px 0 8px;border-bottom:1px solid rgba(0,0,0,0.06);margin-bottom:48px;}
.mx-hero h1{font-family:'Inter Tight',sans-serif;font-weight:700;letter-spacing:-0.02em;
  font-size:clamp(40px,7vw,68px);line-height:1.02;margin:18px 0 0;}
.mx-hero .mx-lede{font-size:clamp(17px,2.4vw,21px);line-height:1.5;color:#4a4a48;max-width:640px;
  margin:24px 0 40px;}
.mx-section{margin:0 0 44px;}
.mx-section h2{font-family:'Inter Tight',sans-serif;font-weight:600;font-size:24px;letter-spacing:-0.01em;
  margin:0 0 14px;}
.mx-section h3{font-family:'Inter Tight',sans-serif;font-weight:600;font-size:16px;margin:26px 0 8px;}
.mx-section p,.mx-section li{font-size:16px;line-height:1.66;color:#4a4a48;}
.mx-section p{margin:0 0 14px;}
.mx-section ul{margin:0 0 14px;padding-left:20px;}
.mx-section li{margin:0 0 8px;}
.mx-section a{color:${RED};text-decoration:none;border-bottom:1px solid rgba(217,4,41,0.28);}
.mx-section a:hover{border-bottom-color:${RED};}
.mx-meta{font-size:13px;color:#6a6a67;margin-top:6px;}

.mx-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin:0 0 12px;}
.mx-card{background:#fff;border:1px solid rgba(0,0,0,0.07);border-radius:16px;padding:24px;}
.mx-card h3{margin:0 0 6px;font-family:'Inter Tight',sans-serif;font-weight:600;font-size:17px;}
.mx-card p{margin:0 0 12px;font-size:14.5px;line-height:1.55;color:#6a6a67;}
.mx-card a{display:inline-block;font-size:14px;font-weight:600;color:${RED};text-decoration:none;
  border:none;}
.mx-card a:hover{text-decoration:underline;}

.mx-note{background:#fff;border:1px solid rgba(0,0,0,0.07);border-left:3px solid ${RED};
  border-radius:14px;padding:22px 24px;margin:0 0 44px;}
.mx-note p{margin:0;font-size:16.5px;line-height:1.6;color:#2a2a28;}

.mx-announce{border-top:1px solid rgba(0,0,0,0.06);padding:28px 0;}
.mx-announce:last-child{border-bottom:1px solid rgba(0,0,0,0.06);}
.mx-announce .mx-tag{font-size:12px;font-weight:600;letter-spacing:0.04em;color:${RED};
  text-transform:uppercase;}
.mx-announce h3{font-family:'Inter Tight',sans-serif;font-weight:600;font-size:21px;margin:10px 0 8px;}
.mx-announce p{margin:0;font-size:16px;line-height:1.62;color:#4a4a48;}

.mx-footer{margin-top:auto;background:#FAFAF9;border-top:1px solid rgba(0,0,0,0.06);
  padding:64px 40px 40px;}
.mx-footer-grid{display:flex;flex-wrap:wrap;gap:48px 64px;max-width:1320px;margin:0 auto;}
.mx-footer-brand{flex:1 1 260px;max-width:320px;}
.mx-footer-brand .mx-wordmark span{font-size:15px;}
.mx-footer-brand p{margin:16px 0 0;font-size:13.5px;line-height:1.6;color:#6a6a67;}
.mx-footer-col{display:flex;flex-direction:column;gap:12px;font-size:13.5px;color:#6a6a67;}
.mx-footer-col .mx-eyebrow{color:#0E0E0E;margin-bottom:4px;}
.mx-footer-col a{color:#6a6a67;text-decoration:none;transition:color .2s ease;}
.mx-footer-col a:hover{color:#0E0E0E;}
.mx-social{display:flex;gap:13px;color:#0E0E0E;}
.mx-social a{display:flex;color:#0E0E0E;transition:color .2s ease;}
.mx-social a:hover{color:${RED};}
.mx-footer-base{max-width:1320px;margin:40px auto 0;padding-top:22px;
  border-top:1px solid rgba(0,0,0,0.06);display:flex;align-items:center;justify-content:space-between;
  gap:16px;flex-wrap:wrap;font-size:12px;color:#6a6a67;}
.mx-footer-base-links{display:flex;gap:22px;}
.mx-footer-base-links a{color:#6a6a67;text-decoration:none;}
.mx-footer-base-links a:hover{color:#0E0E0E;}

/* accessibility: visible keyboard focus + skip link (no effect for mouse users) */
.mx-page a:focus-visible,.mx-page button:focus-visible{outline:2px solid ${RED};outline-offset:3px;
  border-radius:4px;}
.mx-skip{position:absolute;left:-9999px;top:10px;z-index:100;background:#0E0E0E;color:#fff;
  padding:10px 16px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;}
.mx-skip:focus{left:16px;}

/* closing call-to-action band */
.mx-cta-band{margin:8px 0 0;padding:34px 0 6px;border-top:1px solid rgba(0,0,0,0.06);display:flex;
  flex-wrap:wrap;align-items:center;gap:20px 24px;justify-content:space-between;}
.mx-cta-band h2{font-family:'Inter Tight',sans-serif;font-weight:600;font-size:22px;margin:0;
  letter-spacing:-0.01em;}
.mx-cta-band p{margin:7px 0 0;color:#5a5a58;font-size:15px;line-height:1.5;max-width:440px;}
.mx-cta-actions{display:flex;gap:12px;flex-wrap:wrap;}
.mx-btn-primary{display:inline-flex;align-items:center;padding:11px 20px;border-radius:100px;
  background:${RED};color:#fff;font-size:13.5px;font-weight:600;text-decoration:none;
  box-shadow:0 8px 24px rgba(217,4,41,0.26);transition:transform .2s ease,box-shadow .2s ease;}
.mx-btn-primary:hover{transform:translateY(-1px);box-shadow:0 10px 30px rgba(217,4,41,0.32);}
.mx-btn-ghost{display:inline-flex;align-items:center;padding:11px 20px;border-radius:100px;
  border:1px solid rgba(0,0,0,0.16);color:#0E0E0E;font-size:13.5px;font-weight:600;
  text-decoration:none;transition:border-color .2s ease,background .2s ease;}
.mx-btn-ghost:hover{border-color:rgba(0,0,0,0.32);background:rgba(0,0,0,0.03);}

@media (max-width:680px){
  .mx-hide-sm{display:none;}
  .mx-nav-inner{padding:13px 20px;}
  .mx-main{padding:56px 20px 72px;}
  .mx-footer{padding:48px 20px 36px;}
  .mx-cta-band{flex-direction:column;align-items:flex-start;}
}
`;

// Restrained closing band — a single clear "what to do next" without marketing noise.
export function CallToAction({ title, body, primary, secondary }) {
  return (
    <section className="mx-cta-band" aria-label="Where to go next">
      <div>
        <h2>{title}</h2>
        {body ? <p>{body}</p> : null}
      </div>
      <div className="mx-cta-actions">
        <Link href={primary.href} className="mx-btn-primary">{primary.label}</Link>
        {secondary ? <Link href={secondary.href} className="mx-btn-ghost">{secondary.label}</Link> : null}
      </div>
    </section>
  );
}

export default function SiteShell({ children }) {
  return (
    <div className="mx-page">
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <a href="#main-content" className="mx-skip">Skip to content</a>
      <Nav />
      <main id="main-content" className="mx-main">{children}</main>
      <Footer />
    </div>
  );
}
