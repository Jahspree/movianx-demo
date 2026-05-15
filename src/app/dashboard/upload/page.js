import DashboardShell, { TrustSignals } from "../DashboardShell";
import UploadForm from "./UploadForm";

export const metadata = {
  title: "Upload | Movianx Creator Dashboard",
};

export default function UploadPage() {
  return (
    <DashboardShell
      title="Secure creator upload"
      description="Create private upload targets for feature films, trailers, and poster assets."
    >
      <section className="dashboard-grid">
        <div className="panel">
          <UploadForm />
        </div>
        <div className="panel">
          <h2>Trust indicators</h2>
          <TrustSignals />
        </div>
      </section>
    </DashboardShell>
  );
}
