import DashboardShell from "../DashboardShell";

export const metadata = {
  title: "Review Status | Movianx Creator Dashboard",
};

export default function ReviewStatusPage() {
  return (
    <DashboardShell title="Release readiness" description="Private clearance protects creator work before it reaches an audience.">
      <section className="dashboard-grid">
        <div className="panel half">
          <h2>Release path</h2>
          <div className="status-list">
            <div className="status-row"><span>Upload security scan</span><span className="badge gold">queued</span></div>
            <div className="status-row"><span>AI analysis package</span><span className="badge gold">curated</span></div>
            <div className="status-row"><span>Studio clearance</span><span className="badge private">not submitted</span></div>
            <div className="status-row"><span>Public availability</span><span className="badge private">locked</span></div>
          </div>
        </div>
        <div className="panel half">
          <h2>Release principles</h2>
          <p className="muted">Uploaded work remains private until security checks, AI preparation, and approval are complete.</p>
        </div>
      </section>
    </DashboardShell>
  );
}
