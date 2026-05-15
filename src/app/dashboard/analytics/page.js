import DashboardShell from "../DashboardShell";

export const metadata = {
  title: "Analytics | Movianx Creator Dashboard",
};

export default function AnalyticsPage() {
  return (
    <DashboardShell title="Analytics foundation" description="Performance estimates stay placeholder-only until content is approved and published.">
      <section className="dashboard-grid">
        <div className="panel third">
          <p className="muted">Estimated views</p>
          <div className="metric">--</div>
        </div>
        <div className="panel third">
          <p className="muted">Completion rate</p>
          <div className="metric">--</div>
        </div>
        <div className="panel third">
          <p className="muted">Audience fit</p>
          <div className="metric">--</div>
        </div>
        <div className="panel">
          <h2>Coming signals</h2>
          <p className="muted">Future analytics will connect watch behavior, immersive engagement, ad suitability, and creator revenue estimates.</p>
        </div>
      </section>
    </DashboardShell>
  );
}
