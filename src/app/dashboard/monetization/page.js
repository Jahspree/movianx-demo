import DashboardShell from "../DashboardShell";

export const metadata = {
  title: "Monetization | Movianx Creator Dashboard",
};

export default function MonetizationPage() {
  return (
    <DashboardShell title="Creator support" description="A quieter path for fan support, release collections, and revenue readiness without turning art into noise.">
      <section className="dashboard-grid">
        <div className="panel half">
          <h2>Support readiness</h2>
          <div className="status-list">
            <div className="status-row"><span>Ad-supported eligible</span><span className="badge gold">curated</span></div>
            <div className="status-row"><span>Audience suitability</span><span className="badge private">protected</span></div>
            <div className="status-row"><span>Monetization status</span><span className="badge gold">invite gated</span></div>
            <div className="status-row"><span>Revenue share tier</span><span className="badge private">standard</span></div>
          </div>
        </div>
        <div className="panel half">
          <h2>Revenue estimate</h2>
          <div className="metric">$--</div>
          <p className="muted">Estimates activate after approval, publishing, and partner-ready monetization signals.</p>
        </div>
      </section>
    </DashboardShell>
  );
}
