import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { authenticateOpsRequest, isPublicDemoHost } from "../../../lib/ops/auth.js";
import { getExecutiveDashboardData, normalizeDashboardRange } from "../../../lib/ops/executiveDashboard.js";
import styles from "../ops.module.css";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Executive Dashboard | Movianx Operations",
  robots: { index: false, follow: false },
};

export default async function ExecutiveDashboardPage({ searchParams }) {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") || "";
  if (isPublicDemoHost(host)) notFound();

  const auth = authenticateOpsRequest(requestHeaders);
  if (!auth.ok || auth.role !== "admin") notFound();

  const selectedRange = normalizeDashboardRange((await searchParams)?.range);
  const data = await getExecutiveDashboardData({ range: selectedRange, auth });

  return (
    <main className={styles.opsRoot}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <div className={styles.eyebrow}>Movianx executive operations</div>
            <h1>Executive Dashboard</h1>
            <p>
              Audience, content, creator, moderation, and system health signals for the Movianx operating layer.
            </p>
          </div>
          <aside className={styles.statusCard}>
            <div className={styles.statusLabel}>Date Range</div>
            <DateFilters selected={selectedRange} />
            <div className={styles.exportActions}>
              <Link href={`/api/ops/dashboard/export?range=${selectedRange}&format=csv`}>CSV</Link>
              <Link href={`/api/ops/dashboard/export?range=${selectedRange}&format=json`}>JSON</Link>
            </div>
            <p className={styles.muted}>Updated {new Date(data.generatedAt).toLocaleString("en-US")} · <Link href="/ops/system">System</Link></p>
          </aside>
        </header>

        {data.errors.length ? (
          <section className={`${styles.panel} ${styles.wide}`}>
            <div className={styles.panelHeader}>
              <div>
                <h2>Data Source Notices</h2>
                <p>Dashboard remains available, but unavailable sources return empty states instead of fabricated data.</p>
              </div>
            </div>
            <div className={styles.instrumentation}>
              {data.errors.map(error => <span className={`${styles.pill} ${styles.missing}`} key={error}>{error}</span>)}
            </div>
          </section>
        ) : null}

        <Section title="Content" description="Starts, completions, plays, and top-performing experiences.">
          <Metric label="Movies Started Today" value={num(data.content.moviesStartedToday)} />
          <Metric label="Movies Completed Today" value={num(data.content.moviesCompletedToday)} />
          <Metric label="Stories Started Today" value={num(data.content.storiesStartedToday)} />
          <Metric label="Stories Completed Today" value={num(data.content.storiesCompletedToday)} />
          <Metric label="Music Plays Today" value={num(data.content.musicPlaysToday)} />
          <Ranked title="Top Content Last 7 Days" items={data.content.topContent7Days} />
          <Ranked title="Top Content Last 30 Days" items={data.content.topContent30Days} />
        </Section>

        <Section title="Users" description="Audience health across active, new, and returning cohorts.">
          <Metric label="Active Users" value={num(data.users.activeUsers)} />
          <Metric label="New Users" value={num(data.users.newUsers)} />
          <Metric label="Returning Users" value={num(data.users.returningUsers)} />
          <Metric label="Daily Active Users" value={num(data.users.dailyActiveUsers)} />
          <Metric label="Weekly Active Users" value={num(data.users.weeklyActiveUsers)} />
          <Metric label="Monthly Active Users" value={num(data.users.monthlyActiveUsers)} />
          <Chart title="User Growth" points={data.charts.userGrowth} />
        </Section>

        <Section title="Engagement" description="Completion, mode preference, watch time, and popularity.">
          <Metric label="Average Watch Time" value={time(data.engagement.averageWatchTimeSeconds)} />
          <Metric label="Completion Rate" value={pct(data.engagement.completionRate)} />
          <Metric label="Original Selections" value={num(data.engagement.originalSelections)} />
          <Metric label="Reimagined Selections" value={num(data.engagement.reimaginedSelections)} />
          <Metric label="Alternate Ending Selections" value={num(data.engagement.alternateEndingSelections)} />
          <Metric label="Most Popular Content" value={data.engagement.mostPopularContent || "—"} />
          <Metric label="Most Popular Creator" value={data.engagement.mostPopularCreator || "—"} />
          <Chart title="Watch Time" points={data.charts.watchTime} valueFormatter={value => time(value)} />
          <Chart title="Content Performance" points={data.charts.contentPerformance} />
        </Section>

        <Section title="Creators" description="Creator inventory and publishing pipeline.">
          <Metric label="Total Creators" value={num(data.creators.totalCreators)} />
          <Metric label="Upload Count" value={num(data.creators.uploadCount)} />
          <Metric label="Published Count" value={num(data.creators.publishedCount)} />
          <Metric label="Pending Review Count" value={num(data.creators.pendingReviewCount)} />
          <Metric label="Rejected Count" value={num(data.creators.rejectedCount)} />
          <Chart title="Creator Growth" points={data.charts.creatorGrowth} />
        </Section>

        <Section title="Moderation" description="Review load, outcomes, flags, and action velocity.">
          <Metric label="Pending Reviews" value={num(data.moderation.pendingReviews)} />
          <Metric label="Approved Content" value={num(data.moderation.approvedContent)} />
          <Metric label="Rejected Content" value={num(data.moderation.rejectedContent)} />
          <Metric label="Flagged Content" value={num(data.moderation.flaggedContent)} />
          <Metric label="Moderation Actions Last 24 Hours" value={num(data.moderation.moderationActionsLast24Hours)} />
          <Chart title="Moderation Activity" points={data.charts.moderationActivity} />
        </Section>

        <Section title="System" description="Operational readiness across PostHog and Supabase.">
          <StatusMetric label="Supabase Status" status={data.status.supabase} />
          <StatusMetric label="Storage Status" status={data.status.storage} />
          <StatusMetric label="PostHog Status" status={data.status.posthog} />
          <StatusMetric label="Database Status" status={data.status.database} />
          <StatusMetric label="Environment Status" status={data.status.environment} />
        </Section>
      </div>
    </main>
  );
}

function Section({ title, description, children }) {
  return (
    <section className={`${styles.panel} ${styles.wide} ${styles.executiveSection}`}>
      <div className={styles.panelHeader}>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      <div className={styles.executiveGrid}>{children}</div>
    </section>
  );
}

function DateFilters({ selected }) {
  const options = [
    ["today", "Today"],
    ["7d", "7 Days"],
    ["30d", "30 Days"],
    ["90d", "90 Days"],
  ];
  return (
    <div className={styles.dateFilters}>
      {options.map(([key, label]) => (
        <Link className={selected === key ? styles.activeFilter : ""} href={`/ops/dashboard?range=${key}`} key={key}>
          {label}
        </Link>
      ))}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <article className={styles.executiveMetric}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function StatusMetric({ label, status }) {
  const normalized = status === "healthy" || status === "connected" ? "healthy" : status === "degraded" || status === "not_connected" ? "warning" : "error";
  return (
    <article className={styles.executiveMetric}>
      <span>{label}</span>
      <strong className={styles[normalized]}>{status}</strong>
    </article>
  );
}

function Ranked({ title, items }) {
  return (
    <article className={styles.executiveList}>
      <h3>{title}</h3>
      {!items.length ? <div className={styles.empty}>No data for this range.</div> : (
        <div className={styles.table}>
          {items.slice(0, 5).map(item => (
            <div className={styles.row} key={item.title}>
              <div className={styles.rowTitle}>
                <strong>{item.title}</strong>
                <span>{item.starts} starts · {item.completions} completed</span>
              </div>
              <div className={styles.rowMetric}>{item.engagement}</div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

function Chart({ title, points, valueFormatter = value => num(value) }) {
  const max = Math.max(...points.map(point => Number(point.value) || 0), 1);
  return (
    <article className={styles.chartCard}>
      <h3>{title}</h3>
      {!points.length ? <div className={styles.empty}>No chart data available.</div> : (
        <div className={styles.barChart}>
          {points.map((point, index) => (
            <div className={styles.chartBar} key={`${point.label}-${index}`}>
              <span style={{ height: `${Math.max(((Number(point.value) || 0) / max) * 100, point.value ? 8 : 2)}%` }} />
              <small title={`${point.label}: ${valueFormatter(point.value)}`}>{point.label.slice(5) || point.label}</small>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

function num(value) {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-US").format(value);
}

function pct(value) {
  if (value === null || value === undefined) return "—";
  return `${value}%`;
}

function time(seconds) {
  if (seconds === null || seconds === undefined) return "—";
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);
  return minutes ? `${minutes}m ${rest}s` : `${rest}s`;
}
