import Link from "next/link";
import styles from "./watch.module.css";
import {
  MOVIE_RAILS,
  getFeaturedMovieExperience,
  getMovieRailItems,
} from "../../data/movieExperiences";

function posterStyle(movie) {
  return { "--poster-accent": movie.accent };
}

function PosterCard({ movie }) {
  return (
    <Link className={styles.posterCard} href={`/watch/${movie.id}`}>
      <div className={styles.posterArt} style={posterStyle(movie)}>
        <div className={styles.badgeRow}>
          {movie.aiEnhanced && <span className={styles.miniBadge}>AI Enhanced</span>}
          {movie.immersiveReady && <span className={styles.miniBadge}>Immersive Ready</span>}
        </div>
        <div className={styles.posterText}>
          <h3>{movie.title}</h3>
          <span className={styles.miniBadge}>{movie.year}</span>
        </div>
      </div>
      <div className={styles.cardInfo}>
        <h3>{movie.title}</h3>
        <p>{movie.genre} · {movie.runtime}</p>
      </div>
    </Link>
  );
}

export const metadata = {
  title: "Watch — Movianx AI Enhanced Cinema",
  description:
    "Browse demo-safe public-domain and creator-owned cinematic experiences enhanced for immersive AI media.",
};

export default function WatchPage() {
  const featured = getFeaturedMovieExperience();

  return (
    <main className={styles.watchShell}>
      <header className={styles.topbar}>
        <Link className={styles.brand} href="/">
          <img src="/movianx-logo.png" alt="Movianx" />
          <span>Movianx</span>
        </Link>
        <nav className={styles.nav} aria-label="Watch navigation">
          <Link href="/">Home</Link>
          <Link href="/dashboard">Creators</Link>
          <Link className={styles.creatorButton} href="/dashboard/upload">Upload</Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.kicker}>AI-enhanced public-domain cinema</div>
          <h1>{featured.title}</h1>
          <p>{featured.synopsis}</p>
          <div className={styles.metaLine}>
            <span>{featured.year}</span>
            <span>{featured.genre}</span>
            <span>{featured.runtime}</span>
            <span>{featured.rights}</span>
          </div>
          <div className={styles.ctaRow}>
            <Link className={styles.primaryButton} href={`/watch/${featured.id}`}>Watch Experience</Link>
            <Link className={styles.secondaryButton} href="/dashboard/upload">Creator Upload Pipeline</Link>
          </div>
        </div>
        <div className={styles.heroPoster}>
          <div className={styles.posterArt} style={posterStyle(featured)}>
            <div className={styles.badgeRow}>
              <span className={styles.miniBadge}>AI Enhanced</span>
              <span className={styles.miniBadge}>Immersive Ready</span>
            </div>
            <div className={styles.posterText}>
              <h2>{featured.title}</h2>
              <span className={styles.badge}>{featured.year} · {featured.runtime}</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.rails} aria-label="Movie experience library">
        {MOVIE_RAILS.map((rail) => (
          <div className={styles.rail} key={rail.title}>
            <div className={styles.railHeader}>
              <div>
                <h2>{rail.title}</h2>
                <p>Demo-safe entries only: public-domain titles and creator-owned placeholders.</p>
              </div>
            </div>
            <div className={styles.railScroller}>
              {getMovieRailItems(rail.ids).map((movie) => (
                <PosterCard key={`${rail.title}-${movie.id}`} movie={movie} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
