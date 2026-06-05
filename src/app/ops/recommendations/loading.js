import styles from "../ops.module.css";

export default function RecommendationsLoading() {
  return (
    <main className={styles.opsRoot}>
      <div className={styles.shell}>
        <section className={`${styles.panel} ${styles.wide}`}>
          <div className={styles.empty}>Loading recommendation infrastructure...</div>
        </section>
      </div>
    </main>
  );
}
