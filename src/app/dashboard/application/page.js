import DashboardShell from "../DashboardShell";
import CreatorApplicationForm from "./CreatorApplicationForm";

export const metadata = {
  title: "Creator Verification | Movianx",
};

const states = [
  ["Application", "Creator world introduced"],
  ["Profile", "Creative identity shaped"],
  ["Identity", "Studio confidence established"],
  ["Trusted", "Expanded release velocity"],
  ["Enterprise", "Studio-level partnership"],
];

export default function CreatorApplicationPage() {
  return (
    <DashboardShell
      title="Creator verification"
      description="Apply for access to the private creator ecosystem. Verification protects the audience, the platform, and the creative work behind every release."
    >
      <section className="dashboard-grid">
        <div className="panel">
          <CreatorApplicationForm />
        </div>
        <div className="panel">
          <h2>Trust ladder</h2>
          <div className="trust-ladder">
            {states.map(([state, description], index) => (
              <div className="trust-step" key={state}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{state}</strong>
                  <small>{description}</small>
                </div>
              </div>
            ))}
          </div>
          <p className="muted" style={{ marginTop: 18 }}>
            Upload permissions are intentionally gated so creator work stays
            private until it is ready for audience presentation.
          </p>
        </div>
      </section>
    </DashboardShell>
  );
}
