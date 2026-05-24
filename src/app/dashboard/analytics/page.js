import DashboardShell from "../DashboardShell";

export const metadata = {
  title: "Analytics | Movianx Creator Dashboard",
};

export default function AnalyticsPage() {
  return (
    <DashboardShell title="Audience intelligence" description="A private signal room for understanding how audiences connect with your cinematic world.">
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
          <h2>Audience signals</h2>
          <p className="muted">Analytics will connect watch behavior, immersive engagement, audience fit, and creator revenue estimates as releases move toward publication.</p>
        </div>
      </section>
    </DashboardShell>
  );
}
