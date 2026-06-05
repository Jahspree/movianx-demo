import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { authenticateOpsRequest, isPublicDemoHost } from "../../../lib/ops/auth.js";
import { getUploadPersistenceMode, listCreatorUploadRecords } from "../../../lib/creator/supabaseUploadStore.js";
import ReviewActions from "./ReviewActions";
import styles from "../ops.module.css";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Creator Intake Review | Movianx Operations",
  robots: { index: false, follow: false },
};

export default async function CreatorUploadReviewPage() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") || "";
  if (isPublicDemoHost(host)) notFound();

  const auth = authenticateOpsRequest(requestHeaders);
  if (!auth.ok) notFound();

  const uploads = await listCreatorUploadRecords();
  const persistence = getUploadPersistenceMode();

  return (
    <main className={styles.opsRoot}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <div className={styles.eyebrow}>Movianx internal operations</div>
            <h1>Creator Intake Review</h1>
            <p>
              Review private creator uploads, verify processing state, and move titles through approval
              without exposing unfinished content publicly.
            </p>
          </div>
          <aside className={styles.statusCard}>
            <div className={styles.statusLabel}>Persistence</div>
            <div className={styles.statusValue}>
              <span>{persistence === "supabase" ? "Supabase records active" : "Supabase not configured"}</span>
              <span className={persistence === "supabase" ? styles.healthy : styles.warning}>{persistence}</span>
            </div>
            <p className={styles.muted}>Role: {auth.role} · <Link href="/ops">Operations metrics</Link></p>
          </aside>
        </header>

        <section className={styles.grid}>
          <section className={`${styles.panel} ${styles.wide}`}>
            <div className={styles.panelHeader}>
              <div>
                <h2>Upload queue</h2>
                <p>Allowed flow: Uploaded → Processing → Under Review → Approved → Published or Rejected.</p>
              </div>
            </div>
            {!uploads.length ? (
              <div className={styles.empty}>No creator upload records found yet.</div>
            ) : (
              <div className={styles.table}>
                {uploads.map(upload => (
                  <article className={styles.row} key={upload.id}>
                    <div className={styles.rowTitle}>
                      <strong>{upload.title}</strong>
                      <span>{upload.creatorId} · {upload.genre || "genre pending"} · {upload.assets.length} assets</span>
                      <span>{upload.description || "Description pending."}</span>
                      <span>{upload.assets.map(asset => asset.assetType).join(" · ")}</span>
                    </div>
                    <ReviewActions id={upload.id} currentStatus={upload.status} />
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
