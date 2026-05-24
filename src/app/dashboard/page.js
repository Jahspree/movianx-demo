import Link from "next/link";
import DashboardShell, { TrustSignals } from "./DashboardShell";

export const metadata = {
  title: "Movianx Creator Dashboard",
};

export default function DashboardPage() {
  return (
    <DashboardShell
      title="Creator command center"
      description="Shape films, episodes, stories, and sound worlds inside a private studio space before audience release."
    >
      <section className="dashboard-grid">
        <div className="panel third">
          <p className="muted">Private titles</p>
          <div className="metric">0</div>
          <p className="muted">Titles appear here after secure studio intake.</p>
        </div>
        <div className="panel third">
          <p className="muted">Release path</p>
          <div className="metric">0</div>
          <p className="muted">No public release before approval.</p>
        </div>
        <div className="panel third">
          <p className="muted">Estimated revenue</p>
          <div className="metric">$--</div>
          <p className="muted">Support signals unlock as titles move toward release.</p>
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
