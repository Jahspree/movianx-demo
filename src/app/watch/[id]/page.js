import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../watch.module.css";
import {
  MOVIE_EXPERIENCES,
  getMovieExperience,
} from "../../../data/movieExperiences";

export function generateStaticParams() {
  return MOVIE_EXPERIENCES.map((movie) => ({ id: movie.id }));
}

export function generateMetadata({ params }) {
  const movie = getMovieExperience(params.id);

  if (!movie) {
    return {
      title: "Experience Not Found — Movianx",
    };
  }

  return {
    title: `${movie.title} — Movianx AI Enhanced Cinema`,
    description: movie.synopsis,
  };
}

function posterStyle(movie) {
  return { "--poster-accent": movie.accent };
}

export default function WatchDetailPage({ params }) {
  const movie = getMovieExperience(params.id);

  if (!movie) {
    notFound();
  }

  return (
    <main className={styles.watchShell} style={posterStyle(movie)}>
      <div className={styles.watchBackground} />
      <header className={styles.topbar}>
        <Link className={styles.brand} href="/">
          <img src="/movianx-logo.png" alt="Movianx" />
          <span>Movianx</span>
        </Link>
        <nav className={styles.nav} aria-label="Watch navigation">
          <Link href="/watch">Browse</Link>
          <Link href="/dashboard/welcome">Creator Login</Link>
          <Link className={styles.creatorButton} href="/watch">Explore</Link>
        </nav>
      </header>

      <section className={styles.watchLayout}>
        <div>
          <div className={styles.videoFrame}>
            <div className={styles.playGlyph} aria-hidden="true">
              <span>▶</span>
            </div>
            <div className={styles.playerStatus}>
              <span>Demo-safe cinematic player placeholder</span>
              <span>No copyrighted stream or private asset exposed</span>
            </div>
          </div>

          <div className={styles.enhancementPanel} style={{ marginTop: 22 }}>
            <div className={styles.kicker}>AI enhancement layer</div>
            <div className={styles.featureGrid}>
              {movie.enhancements.map((enhancement) => (
                <div className={styles.featureTile} key={enhancement}>
                  {enhancement}
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className={styles.detailPanel}>
          <span className={styles.badge}>{movie.sourceType}</span>
          <h1>{movie.title}</h1>
          <div className={styles.metaLine} style={{ marginTop: 0 }}>
            <span>{movie.year}</span>
            <span>{movie.genre}</span>
            <span>{movie.runtime}</span>
            <span>{movie.language}</span>
          </div>
          <p>{movie.synopsis}</p>

          <div className={styles.toggleRow} aria-label="Experience controls">
            <div className={styles.toggle}>
              <span>Immersive Audio</span>
              <span>{movie.immersiveReady ? "Ready" : "Pending"}</span>
            </div>
            <div className={styles.toggle}>
              <span>Subtitles</span>
              <span>Demo</span>
            </div>
            <div className={styles.toggle}>
              <span>AI Enhanced</span>
              <span>{movie.aiEnhanced ? "On" : "Processing"}</span>
            </div>
          </div>

          <div className={styles.rightsNote}>
            Rights status: {movie.rights}. This investor demo uses metadata and
            placeholder presentation only. No copyrighted film stream or private
            media source is embedded on this page.
          </div>

          <div className={styles.ctaRow} style={{ marginTop: 22 }}>
            <Link className={styles.secondaryButton} href="/watch">Back to Library</Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
