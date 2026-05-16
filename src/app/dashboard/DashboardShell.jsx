import Link from "next/link";
import "./dashboard.css";

const navItems = [
  ["/dashboard/welcome", "Welcome"],
  ["/dashboard", "Overview"],
  ["/dashboard/application", "Verification"],
  ["/dashboard/upload", "Upload"],
  ["/dashboard/content", "Content"],
  ["/dashboard/review-status", "Review"],
  ["/dashboard/analytics", "Analytics"],
  ["/dashboard/monetization", "Monetization"],
];

export default function DashboardShell({ title = "Creator Dashboard", description, children }) {
  return (
    <main className="creator-dashboard">
      <div className="dashboard-shell">
        <header className="dashboard-header">
          <div className="dashboard-brand">
            <Link href="/" className="button-link">Movianx</Link>
            <h1>{title}</h1>
            {description ? <p>{description}</p> : null}
          </div>
          <nav className="dashboard-nav" aria-label="Creator dashboard">
            {navItems.map(([href, label]) => (
              <Link href={href} key={href}>{label}</Link>
            ))}
          </nav>
        </header>
        {children}
      </div>
    </main>
  );
}

export function TrustSignals() {
  return (
    <div className="trust-list">
      <div className="trust-item"><span>Upload encrypted in transit</span><span className="badge">active</span></div>
      <div className="trust-item"><span>Private review state</span><span className="badge private">private</span></div>
      <div className="trust-item"><span>Security scan</span><span className="badge pending">pending</span></div>
      <div className="trust-item"><span>AI analysis</span><span className="badge pending">pending</span></div>
      <div className="trust-item"><span>Public release</span><span className="badge private">approval gated</span></div>
    </div>
  );
}
