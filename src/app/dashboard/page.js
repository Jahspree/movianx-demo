import Link from "next/link";
import DashboardShell, { TrustSignals } from "./DashboardShell";

export const metadata = {
  title: "Movianx Creator Dashboard",
};

export default function DashboardPage() {
  return (
    <DashboardShell
      title="Creator command center"
      description="Upload films, keep assets private, and prepare work for AI-assisted review without exposing files publicly."
    >
      <section className="dashboard-grid">
        <div className="panel third">
          <p className="muted">Private titles</p>
          <div className="metric">0</div>
          <p className="muted">Content appears here after secure upload creation.</p>
        </div>
        <div className="panel third">
          <p className="muted">Review queue</p>
          <div className="metric">0</div>
          <p className="muted">No public release before approval.</p>
        </div>
        <div className="panel third">
          <p className="muted">Estimated revenue</p>
          <div className="metric">$--</div>
          <p className="muted">Monetization is modeled, not connected.</p>
        </div>
        <div className="panel half">
          <h2>Verification-gated upload</h2>
          <p className="muted">Apply for creator verification before private upload targets are enabled.</p>
          <br />
          <Link className="button-link" href="/dashboard/application">Start verification</Link>
        </div>
        <div className="panel half">
          <h2>Security state</h2>
          <TrustSignals />
        </div>
      </section>
    </DashboardShell>
  );
}
