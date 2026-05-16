import Link from "next/link";
import styles from "./watch.module.css";
import {
  CONSUMER_RAILS,
  getConsumerRailItems,
} from "../../data/consumerExperiences";
import {
  getFeaturedMovieExperience,
} from "../../data/movieExperiences";

function posterStyle(experience) {
  return { "--poster-accent": experience.accent };
}

function PosterCard({ experience }) {
  return (
    <Link className={styles.posterCard} href={experience.href || `/watch/${experience.id}`}>
      <div className={styles.posterArt} style={posterStyle(experience)}>
        <div className={styles.badgeRow}>
          {experience.aiEnhanced && <span className={styles.miniBadge}>AI Enhanced</span>}
          {experience.immersiveReady && <span className={styles.miniBadge}>Immersive Ready</span>}
        </div>
        <div className={styles.posterText}>
          <h3>{experience.title}</h3>
          <span className={styles.miniBadge}>{experience.mediaType || experience.year}</span>
        </div>
      </div>
      <div className={styles.cardInfo}>
        <h3>{experience.title}</h3>
        <p>{experience.genre} · {experience.runtime}</p>
      </div>
    </Link>
  );
}

export const metadata = {
  title: "Watch — Movianx Immersive Experiences",
  description:
    "Browse demo-safe films, interactive stories, and AI-enhanced immersive entertainment experiences.",
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
          <Link href="/dashboard/welcome">Creator Login</Link>
          <Link className={styles.creatorButton} href="#early-access">Join Waitlist</Link>
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
            <Link className={styles.secondaryButton} href="#experience-library">Explore Library</Link>
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

      <section id="experience-library" className={styles.rails} aria-label="Immersive experience library">
        {CONSUMER_RAILS.map((rail) => (
          <div className={styles.rail} key={rail.title}>
            <div className={styles.railHeader}>
              <div>
                <h2>{rail.title}</h2>
                <p>{rail.description}</p>
              </div>
            </div>
            <div className={styles.railScroller}>
              {getConsumerRailItems(rail.ids).map((experience) => (
                <PosterCard key={`${rail.title}-${experience.id}`} experience={experience} />
              ))}
            </div>
          </div>
        ))}
        <div id="early-access" className={styles.waitlistPanel}>
          <div>
            <span className={styles.badge}>Early Access</span>
            <h2>Get notified when immersive releases go live.</h2>
            <p>Privacy-first updates for viewers. Private creator paths stay separate from the public experience.</p>
          </div>
          <form className={styles.inlineCapture} action="/api/waitlist" method="post">
            <input type="email" name="email" placeholder="you@example.com" required />
            <input type="hidden" name="source" value="watch" />
            <button type="submit">Join Waitlist</button>
          </form>
        </div>
      </section>
    </main>
  );
}
