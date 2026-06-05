import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { authenticateOpsRequest, isPublicDemoHost } from "../../lib/ops/auth.js";
import { getOpsMetrics } from "../../lib/ops/posthogMetrics.js";
import styles from "./ops.module.css";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Movianx Operations",
  robots: { index: false, follow: false },
};

function numberValue(value) {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-US").format(value);
}

function timeValue(seconds) {
  if (!seconds) return "—";
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);
  return minutes ? `${minutes}m ${rest}s` : `${rest}s`;
}

function statusClass(status) {
  if (status === "connected") return styles.healthy;
  if (status === "error") return styles.error;
  return styles.warning;
}

function MetricCard({ label, value, detail }) {
  return (
    <article className={styles.metricCard}>
      <span>{label}</span>
      <strong>{value}</strong>
      {detail ? <small>{detail}</small> : null}
    </article>
  );
}

function RankedList({ items, emptyLabel, valueLabel = "engagement" }) {
  if (!items.length) return <div className={styles.empty}>{emptyLabel}</div>;

  return (
    <div className={styles.table}>
      {items.map(item => (
        <div className={styles.row} key={`${item.title || item.name}-${item.type || ""}`}>
          <div className={styles.rowTitle}>
            <strong>{item.title || item.name}</strong>
            <span>{item.type || `${item.starts} starts · ${item.completions} completed`}</span>
          </div>
          <div className={styles.rowMetric}>{numberValue(item.engagement)} {valueLabel}</div>
        </div>
      ))}
    </div>
  );
}

function ModeSplit({ summary }) {
  const modes = [
    ["Original", summary.originalSelections],
    ["Reimagined", summary.reimaginedSelections],
    ["Alternate", summary.alternateSelections],
  ];
  const total = modes.reduce((sum, [, value]) => sum + (value || 0), 0);

  return (
    <div className={styles.modeSplit}>
      {modes.map(([name, value]) => {
        const percent = total ? Math.round((value / total) * 100) : 0;
        return (
          <div className={styles.modeBar} key={name}>
            <div className={styles.modeBarHeader}>
              <span>{name}</span>
              <span>{numberValue(value)} · {percent}%</span>
            </div>
            <div className={styles.track}>
              <div className={styles.fill} style={{ width: `${Math.max(percent, value ? 4 : 0)}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ActivityList({ items }) {
  if (!items.length) return <div className={styles.empty}>No recent Movianx activity events found yet.</div>;

  return (
    <div className={styles.activity}>
      {items.map((item, index) => (
        <div className={styles.activityItem} key={`${item.timestamp}-${item.event}-${index}`}>
          <span className={styles.eventDot} />
          <div>
            <strong>{item.event}</strong>
            <div className={styles.activityMeta}>{item.contentTitle} · {item.contentType} · {item.mode}</div>
          </div>
          <span className={styles.activityMeta}>{new Date(item.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</span>
        </div>
      ))}
    </div>
  );
}

export default async function OpsPage() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") || "";
  if (isPublicDemoHost(host)) notFound();

  const auth = authenticateOpsRequest(requestHeaders);
  if (!auth.ok) notFound();

  const metrics = await getOpsMetrics();
  const role = requestHeaders.get("x-movianx-ops-role") || auth.role;
  const summary = metrics.summary;
  const missing = metrics.instrumentation?.missing || [];

  return (
    <main className={styles.opsRoot}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <div className={styles.eyebrow}>Movianx internal operations</div>
            <h1>Operations Command</h1>
            <p>
              Production analytics, content performance, creator traction, and recent audience activity.
              This surface is isolated from the public demo navigation and protected by role-based access.
            </p>
          </div>
          <aside className={styles.statusCard}>
            <div className={styles.statusLabel}>PostHog connection</div>
            <div className={styles.statusValue}>
              <span>{metrics.message}</span>
              <span className={statusClass(metrics.status)}>{metrics.status}</span>
            </div>
            <p className={styles.muted}>Role: {role} · Updated {new Date(metrics.generatedAt).toLocaleString("en-US")}</p>
          </aside>
        </header>

        <section className={styles.grid}>
          <MetricCard label="Active Users" value={numberValue(summary.activeUsers)} detail="Last 5 minutes" />
          <MetricCard label="Daily Visitors" value={numberValue(summary.dailyVisitors)} detail="Unique pageview visitors today" />
          <MetricCard label="Movies Started" value={numberValue(summary.moviesStarted)} detail="Last 24 hours" />
          <MetricCard label="Movies Completed" value={numberValue(summary.moviesCompleted)} detail="Last 24 hours" />
          <MetricCard label="Stories Started" value={numberValue(summary.storiesStarted)} detail="Last 24 hours" />
          <MetricCard label="Stories Completed" value={numberValue(summary.storiesCompleted)} detail="Last 24 hours" />
          <MetricCard label="Average Watch Time" value={timeValue(summary.averageWatchTimeSeconds)} detail="Movies, stories, and music events" />
          <MetricCard label="Instrumentation Gaps" value={numberValue(missing.length)} detail="Missing required Movianx events" />

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <h2>Reimagined vs Original</h2>
                <p>Selections made across 10 Seconds and future reinterpretation experiences.</p>
              </div>
            </div>
            <ModeSplit summary={summary} />
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <h2>Top Performing Content</h2>
                <p>Ranked by starts, completions, and interaction events.</p>
              </div>
            </div>
            <RankedList items={metrics.topContent} emptyLabel="No content performance events found yet." />
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <h2>Top Creators</h2>
                <p>Creator traction from profile views and content engagement.</p>
              </div>
            </div>
            <RankedList items={metrics.topCreators} emptyLabel="No creator performance events found yet." valueLabel="signals" />
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <h2>Instrumentation Status</h2>
                <p>Required analytics events needed for investor-grade operations reporting.</p>
              </div>
            </div>
            <div className={styles.instrumentation}>
              {(metrics.instrumentation?.requiredEvents || []).map(event => (
                <span className={`${styles.pill} ${missing.includes(event) ? styles.missing : ""}`} key={event}>
                  {event}
                </span>
              ))}
            </div>
          </section>

          <section className={`${styles.panel} ${styles.wide}`}>
            <div className={styles.panelHeader}>
              <div>
                <h2>Recent User Activity</h2>
                <p>Latest audience events and pageviews across production.</p>
              </div>
            </div>
            <ActivityList items={metrics.recentActivity} />
          </section>
        </section>
      </div>
    </main>
  );
}
