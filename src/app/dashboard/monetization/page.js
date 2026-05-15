import DashboardShell from "../DashboardShell";

export const metadata = {
  title: "Monetization | Movianx Creator Dashboard",
};

export default function MonetizationPage() {
  return (
    <DashboardShell title="Monetization foundation" description="Ad eligibility and revenue share fields are modeled but not connected to an ad network.">
      <section className="dashboard-grid">
        <div className="panel half">
          <h2>Ad readiness</h2>
          <div className="status-list">
            <div className="status-row"><span>Ad-supported eligible</span><span className="badge pending">pending</span></div>
            <div className="status-row"><span>Ad suitability score</span><span className="badge pending">not scored</span></div>
            <div className="status-row"><span>Monetization status</span><span className="badge pending">pending review</span></div>
            <div className="status-row"><span>Revenue share tier</span><span className="badge private">standard</span></div>
          </div>
        </div>
        <div className="panel half">
          <h2>Revenue estimate</h2>
          <div className="metric">$--</div>
          <p className="muted">Estimates activate after approval, publishing, and future ad pipeline integration.</p>
        </div>
      </section>
    </DashboardShell>
  );
}
