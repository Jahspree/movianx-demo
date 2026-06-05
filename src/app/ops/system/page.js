import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { authenticateOpsRequest, isPublicDemoHost } from "../../../lib/ops/auth.js";
import { getSystemHealth } from "../../../lib/ops/systemHealth.js";
import styles from "../ops.module.css";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "System Diagnostics | Movianx Operations",
  robots: { index: false, follow: false },
};

export default async function OpsSystemPage() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") || "";
  if (isPublicDemoHost(host)) notFound();

  const auth = authenticateOpsRequest(requestHeaders);
  if (!auth.ok || auth.role !== "admin") notFound();

  const health = await getSystemHealth({ auth });

  return (
    <main className={styles.opsRoot}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <div className={styles.eyebrow}>Movianx internal operations</div>
            <h1>System Diagnostics</h1>
            <p>
              Production readiness checks for Supabase, private storage, administrator authentication,
              and required environment configuration.
            </p>
          </div>
          <aside className={styles.statusCard}>
            <div className={styles.statusLabel}>Overall Supabase Status</div>
            <div className={styles.statusValue}>
              <span>{health.supabase.label}</span>
              <StatusBadge status={health.supabase.status} />
            </div>
            <p className={styles.muted}>Updated {new Date(health.generatedAt).toLocaleString("en-US")} · <Link href="/ops/uploads">Moderation</Link></p>
          </aside>
        </header>

        <section className={styles.grid}>
          <HealthPanel title="Supabase Status" item={health.supabase} />
          <HealthPanel title="Database Status" item={health.database} />
          <HealthPanel title="Storage Status" item={health.storage} />
          <HealthPanel title="Authentication Status" item={health.authentication} />

          <section className={`${styles.panel} ${styles.wide}`}>
            <div className={styles.panelHeader}>
              <div>
                <h2>Environment Variable Status</h2>
                <p>Secret values are never displayed. Only configured/missing state is shown.</p>
              </div>
            </div>
            <div className={styles.table}>
              {health.environment.entries.map(entry => (
                <div className={styles.row} key={entry.name}>
                  <div className={styles.rowTitle}>
                    <strong>{entry.name}</strong>
                    <span>{entry.required ? "Required" : "Optional"}</span>
                  </div>
                  <StatusBadge status={entry.configured ? "healthy" : "failed"} label={entry.configured ? "Configured" : "Missing"} />
                </div>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function HealthPanel({ title, item }) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <h2>{title}</h2>
          <p>{item.label}</p>
        </div>
        <StatusBadge status={item.status} />
      </div>
      {item.checks ? (
        <div className={styles.instrumentation}>
          {Object.entries(item.checks).map(([name, value]) => (
            <span className={`${styles.pill} ${value ? "" : styles.missing}`} key={name}>
              {name}: {value ? "ok" : "failed"}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function StatusBadge({ status, label }) {
  const normalized = status === "healthy" ? "healthy" : status === "degraded" ? "warning" : "error";
  return (
    <span className={`${styles.healthBadge} ${styles[normalized]}`}>
      <span className={styles.healthDot} />
      {label || status}
    </span>
  );
}
