import DashboardShell from "../DashboardShell";

export const metadata = {
  title: "Review Status | Movianx Creator Dashboard",
};

export default function ReviewStatusPage() {
  return (
    <DashboardShell title="Review status" description="Private review gates before anything goes public.">
      <section className="dashboard-grid">
        <div className="panel half">
          <h2>Review pipeline</h2>
          <div className="status-list">
            <div className="status-row"><span>Upload security scan</span><span className="badge pending">pending</span></div>
            <div className="status-row"><span>AI analysis package</span><span className="badge pending">pending</span></div>
            <div className="status-row"><span>Human review</span><span className="badge private">not submitted</span></div>
            <div className="status-row"><span>Public availability</span><span className="badge private">locked</span></div>
          </div>
        </div>
        <div className="panel half">
          <h2>Review rules</h2>
          <p className="muted">Uploaded work remains private until security checks, AI preparation, and approval are complete.</p>
        </div>
      </section>
    </DashboardShell>
  );
}
