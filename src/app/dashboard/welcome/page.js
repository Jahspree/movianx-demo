import Link from "next/link";
import DashboardShell from "../DashboardShell";
import { getCreatorVerificationSummary } from "../../../lib/creator/intakeStore.js";

export const metadata = {
  title: "Creator Login | Movianx",
};

export default function CreatorWelcomePage() {
  const verification = getCreatorVerificationSummary();
  const trustBadges = [
    ["Application", "Received"],
    ["Creative identity", "Curated"],
    ["Release access", "Invite gated"],
    ["Audience fit", "Protected"],
  ];

  return (
    <DashboardShell
      title="Creator ecosystem"
      description="A private studio environment for creators building AI-directed cinema, immersive worlds, and audience-ready release collections."
    >
      <section className="dashboard-grid">
        <div className="panel hero-panel creator-world-panel">
          <p className="eyebrow">Creator access</p>
          <h2>Enter a studio built around your artistic world.</h2>
          <p className="muted">
            Creator tools live inside this private workspace. Your films,
            stories, music, and creator universes stay protected while Movianx
            prepares cinematic enhancement, audience fit, and release support.
          </p>
          <div className="form-actions">
            <Link className="button-link" href="/dashboard/application">Apply for verification</Link>
            <Link className="secondary-button" href="/dashboard">Enter dashboard</Link>
          </div>
        </div>
        <div className="panel half">
          <h2>Trust progression</h2>
          <div className="trust-ladder">
            {trustBadges.map(([label, status], index) => (
              <div className="trust-step" key={label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{label}</strong>
                  <small>{status}</small>
                </div>
              </div>
            ))}
          </div>
          <p className="muted" style={{ marginTop: 18 }}>
            Current profile: {verification.verificationState.replaceAll("_", " ")}.
          </p>
        </div>
        <div className="panel half">
          <h2>Creator capabilities</h2>
          <div className="trust-list">
            <div className="trust-item"><span>AI-directed cinema tooling</span><span className="badge">studio</span></div>
            <div className="trust-item"><span>Immersive audio enhancement</span><span className="badge">ready</span></div>
            <div className="trust-item"><span>Audience alignment</span><span className="badge gold">curated</span></div>
            <div className="trust-item"><span>Release collection support</span><span className="badge private">gated</span></div>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
