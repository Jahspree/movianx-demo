import Link from "next/link";
import DashboardShell from "../DashboardShell";
import { getCreatorVerificationSummary } from "../../../lib/creator/intakeStore.js";

export const metadata = {
  title: "Creator Login | Movianx",
};

export default function CreatorWelcomePage() {
  const verification = getCreatorVerificationSummary();

  return (
    <DashboardShell
      title="Creator ecosystem"
      description="A secure workspace for AI-directed cinema, immersive creator tools, audience enhancement, and monetization readiness."
    >
      <section className="dashboard-grid">
        <div className="panel hero-panel">
          <p className="eyebrow">Creator access</p>
          <h2>Build cinematic experiences after verification.</h2>
          <p className="muted">
            Creator tools live inside this dashboard only. Public viewers see
            immersive entertainment; creators get private review, analysis,
            enhancement, and monetization preparation.
          </p>
          <div className="form-actions">
            <Link className="button-link" href="/dashboard/application">Apply for verification</Link>
            <Link className="secondary-button" href="/dashboard">Enter dashboard</Link>
          </div>
        </div>
        <div className="panel half">
          <h2>Verification state</h2>
          <div className="trust-list">
            {verification.trustBadges.map((badge) => (
              <div className="trust-item" key={badge.label}>
                <span>{badge.label}</span>
                <span className="badge pending">{badge.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel half">
          <h2>Creator capabilities</h2>
          <div className="trust-list">
            <div className="trust-item"><span>AI-directed cinema tooling</span><span className="badge">planned</span></div>
            <div className="trust-item"><span>Immersive audio enhancement</span><span className="badge">ready</span></div>
            <div className="trust-item"><span>Audience enhancement pipeline</span><span className="badge pending">review</span></div>
            <div className="trust-item"><span>Monetization preparation</span><span className="badge pending">modeled</span></div>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
