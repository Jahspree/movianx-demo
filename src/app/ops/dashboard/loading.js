import styles from "../ops.module.css";

export default function LoadingExecutiveDashboard() {
  return (
    <main className={styles.opsRoot}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <div className={styles.eyebrow}>Movianx executive operations</div>
            <h1>Executive Dashboard</h1>
            <p>Loading production signals...</p>
          </div>
        </header>
        <section className={styles.grid}>
          {Array.from({ length: 8 }).map((_, index) => (
            <article className={styles.metricCard} key={index}>
              <span>Loading</span>
              <strong>—</strong>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
