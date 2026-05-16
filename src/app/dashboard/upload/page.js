import DashboardShell, { TrustSignals } from "../DashboardShell";
import UploadForm from "./UploadForm";
import { getCreatorVerificationSummary } from "../../../lib/creator/intakeStore.js";
import Link from "next/link";

export const metadata = {
  title: "Upload | Movianx Creator Dashboard",
};

export default function UploadPage() {
  const verification = getCreatorVerificationSummary();
  const uploadLocked = verification.uploadPermission === "application_required";

  return (
    <DashboardShell
      title="Secure creator upload"
      description="Create private upload targets for feature films, trailers, and poster assets."
    >
      <section className="dashboard-grid">
        <div className="panel">
          {uploadLocked ? (
            <div className="locked-panel">
              <p className="eyebrow">Upload access gated</p>
              <h2>Verification required before upload access.</h2>
              <p className="muted">
                Movianx keeps creator upload tools inside the dashboard and
                gates upload access behind the verification workflow.
              </p>
              <br />
              <Link className="button-link" href="/dashboard/application">Apply for creator verification</Link>
            </div>
          ) : (
            <UploadForm />
          )}
        </div>
        <div className="panel">
          <h2>Trust indicators</h2>
          <TrustSignals />
        </div>
      </section>
    </DashboardShell>
  );
}
