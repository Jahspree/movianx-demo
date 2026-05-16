import DashboardShell from "../DashboardShell";
import CreatorApplicationForm from "./CreatorApplicationForm";

export const metadata = {
  title: "Creator Verification | Movianx",
};

const states = [
  ["pending_application", "Application received, moderation pending"],
  ["basic_verified", "Basic creator profile approved"],
  ["identity_verified", "Identity checks completed"],
  ["trusted_creator", "Higher upload trust and release velocity"],
  ["enterprise_creator", "Studio and enterprise-level review workflow"],
];

export default function CreatorApplicationPage() {
  return (
    <DashboardShell
      title="Creator verification"
      description="Apply for access to the private creator ecosystem. Full KYC is not active yet; this is the scalable review foundation."
    >
      <section className="dashboard-grid">
        <div className="panel">
          <CreatorApplicationForm />
        </div>
        <div className="panel">
          <h2>Trust ladder</h2>
          <div className="trust-list">
            {states.map(([state, description]) => (
              <div className="trust-item" key={state}>
                <span>{description}</span>
                <span className="badge private">{state}</span>
              </div>
            ))}
          </div>
          <p className="muted" style={{ marginTop: 18 }}>
            Upload permissions are intentionally gated. Public consumer pages do
            not link to upload tooling.
          </p>
        </div>
      </section>
    </DashboardShell>
  );
}
