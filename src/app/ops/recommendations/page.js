import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { authenticateOpsRequest, isPublicDemoHost } from "../../../lib/ops/auth.js";
import { getOpsRecommendationSnapshot, getRecommendationPersistenceMode } from "../../../lib/recommendations/recommendationService.js";
import styles from "../ops.module.css";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Recommendations | Movianx Operations",
  robots: { index: false, follow: false },
};

export default async function OpsRecommendationsPage() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") || "";
  if (isPublicDemoHost(host)) notFound();

  const auth = authenticateOpsRequest(requestHeaders);
  if (!auth.ok || auth.role !== "admin") notFound();

  const snapshot = await getOpsRecommendationSnapshot({ limit: 30 });
  const persistence = getRecommendationPersistenceMode();

  return (
    <main className={styles.opsRoot}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <div className={styles.eyebrow}>Movianx internal operations</div>
            <h1>Recommendation Infrastructure</h1>
            <p>
              Server-side recommendation records, affinity relationships, viewer similarity, and generation status.
            </p>
          </div>
          <aside className={styles.statusCard}>
            <div className={styles.statusLabel}>Data Layer</div>
            <div className={styles.statusValue}>
              <span>{snapshot.status === "connected" ? "Supabase connected" : "Supabase degraded"}</span>
              <span className={snapshot.status === "connected" ? styles.healthy : styles.warning}>{persistence}</span>
            </div>
            <p className={styles.muted}>
              Administrator only · <Link href="/ops/dashboard">Executive dashboard</Link> · <Link href="/ops/system">System diagnostics</Link>
            </p>
          </aside>
        </header>

        {snapshot.message ? (
          <section className={`${styles.panel} ${styles.wide}`}>
            <div className={styles.panelHeader}>
              <div>
                <h2>Generation status</h2>
                <p>{snapshot.message}</p>
              </div>
            </div>
            <div className={styles.executiveGrid}>
              <Metric label="Content Affinity Records" value={snapshot.generationStatus.contentAffinityRecords} />
              <Metric label="Viewer Similarity Records" value={snapshot.generationStatus.viewerSimilarityRecords} />
              <Metric label="Recommendation Events" value={snapshot.generationStatus.recommendationEvents} />
              <Metric label="Last Event" value={formatDate(snapshot.generationStatus.lastRecommendationEventAt)} />
            </div>
          </section>
        ) : null}

        <section className={styles.grid}>
          <Panel title="Affinity relationships" description="Because-you-watched and similar-content relationships.">
            {!snapshot.contentAffinity.length ? <Empty /> : (
              <div className={styles.table}>
                {snapshot.contentAffinity.map(row => (
                  <article className={styles.row} key={`${row.sourceContentId}-${row.targetContentId}-${row.relationshipType}`}>
                    <div className={styles.rowTitle}>
                      <strong>{`${row.sourceContentId} -> ${row.targetContentId}`}</strong>
                      <span>{row.relationshipType} · score {score(row.affinityScore)}</span>
                      <span>{row.reason || "Signal reason pending."}</span>
                    </div>
                    <div className={styles.rowMetric}>{row.title}</div>
                  </article>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Viewer similarity" description="Users with similar viewing, genre, and creator patterns.">
            {!snapshot.viewerSimilarity.length ? <Empty /> : (
              <div className={styles.table}>
                {snapshot.viewerSimilarity.map(row => (
                  <article className={styles.row} key={`${row.userId}-${row.similarUserId}`}>
                    <div className={styles.rowTitle}>
                      <strong>{`${row.userId} -> ${row.similarUserId}`}</strong>
                      <span>score {score(row.similarityScore)}</span>
                      <span>Genres: {row.sharedGenres.join(", ") || "pending"}</span>
                      <span>Creators: {row.sharedCreators.join(", ") || "pending"}</span>
                    </div>
                    <div className={styles.rowMetric}>{row.sharedContent.length} shared</div>
                  </article>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Trending content" description="Starts, completions, likes, and weighted trend score.">
            {!snapshot.trendingContent.length ? <Empty /> : (
              <div className={styles.table}>
                {snapshot.trendingContent.map(row => (
                  <article className={styles.row} key={row.contentId}>
                    <div className={styles.rowTitle}>
                      <strong>{row.title}</strong>
                      <span>{row.contentType} · {row.contentId}</span>
                      <span>{row.creator || "Creator pending"}</span>
                    </div>
                    <div className={styles.rowMetric}>{score(row.score)}</div>
                  </article>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Recommendation events" description="Shown, clicked, started, completed, and dismissed recommendation outcomes.">
            {!snapshot.recommendationEvents.length ? <Empty /> : (
              <div className={styles.table}>
                {snapshot.recommendationEvents.map(row => (
                  <article className={styles.row} key={row.id}>
                    <div className={styles.rowTitle}>
                      <strong>{row.recommendationType}</strong>
                      <span>{`${row.sourceContentId || "source pending"} -> ${row.recommendedContentId || row.creatorId || "target pending"}`}</span>
                      <span>{row.outcome} · {formatDate(row.createdAt)}</span>
                    </div>
                    <div className={styles.rowMetric}>{score(row.score)}</div>
                  </article>
                ))}
              </div>
            )}
          </Panel>
        </section>
      </div>
    </main>
  );
}

function Panel({ title, description, children }) {
  return (
    <section className={`${styles.panel} ${styles.wide}`}>
      <div className={styles.panelHeader}>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <article className={styles.executiveMetric}>
      <span>{label}</span>
      <strong>{value ?? "—"}</strong>
    </article>
  );
}

function Empty() {
  return <div className={styles.empty}>No records yet.</div>;
}

function score(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  return number.toFixed(2);
}

function formatDate(value) {
  if (!value) return "Pending";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
