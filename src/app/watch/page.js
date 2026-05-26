import Link from "next/link";
import styles from "./watch.module.css";
import {
  CONSUMER_EXPERIENCES,
  CONSUMER_RAILS,
  getConsumerRailItems,
} from "../../data/consumerExperiences";
import { orchestrateEcosystemRails } from "../../lib/ecosystemGovernance";
import WaitlistInline from "./WaitlistInline";

export const revalidate = 3600;

function posterStyle(experience) {
  return {
    "--poster-accent": experience.accent,
    "--poster-image": experience.image ? `url(${experience.image})` : "none",
  };
}

function railId(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const ATMOSPHERIC_HOOKS = {
  "The Weight of Silence": "Silence keeps its own archive.",
  "The Last Summer We Spoke": "Some summers never leave.",
  "The Event Horizon Choir": "A signal sings at the edge.",
  "The Record Shop at the End of the World": "The last song still matters.",
  "Night of the Living Dead": "No door holds forever.",
  "10 Seconds": "You do not get another breath.",
  "Signal Bloom": "Memory drifts through signal.",
  "Basement Frequency": "The room hums back.",
  "Marisol Vale": "Quiet dread. Precise light.",
  "Juno Trace": "Pressure shaped into sound.",
  "Iris Monroe": "Memory rendered in motion.",
  "Creator Worlds": "Artists building places you can enter.",
};

function atmosphericHook(experience) {
  if (ATMOSPHERIC_HOOKS[experience.title]) {
    return ATMOSPHERIC_HOOKS[experience.title];
  }

  const source = experience.hook || experience.synopsis || experience.genre || "Enter quietly.";
  return source.split(/[.!?]/).find(Boolean)?.trim() || source;
}

function primaryBadge(experience) {
  if (experience.factoryIngested) return "Factory World";
  if (experience.immersiveReady) return "Immersive";
  if (experience.aiEnhanced) return "AI Enhanced";
  return experience.mediaType || experience.year;
}

function posterMeta(experience) {
  if (experience.contentFormat === "interactive_story") return "Story";
  if (experience.mediaType === "Music Experience") return "Sound";
  if (experience.contentFormat === "creator_spotlight") return "Creator";
  return experience.runtime || experience.year;
}

function PosterCard({ experience }) {
  return (
    <Link className={styles.posterCard} href={experience.href || `/watch/${experience.id}`}>
      <div className={styles.posterArt} style={posterStyle(experience)}>
        <div className={styles.badgeRow}>
          <span className={styles.miniBadge}>{primaryBadge(experience)}</span>
        </div>
        <div className={styles.posterText}>
          <h3>{experience.title}</h3>
          <span className={styles.miniBadge}>{posterMeta(experience)}</span>
        </div>
      </div>
      <div className={styles.cardInfo}>
        <div className={styles.creatorLine}>
          <span>{experience.creator}</span>
        </div>
        <p className={styles.cardHook}>{atmosphericHook(experience)}</p>
      </div>
    </Link>
  );
}

function RailSection({ rail }) {
  const items = getConsumerRailItems(rail.ids);
  const railStyle = {
    "--rail-accent": rail.accent || "#b51f2a",
    "--rail-image": items[0]?.image ? `url(${items[0].image})` : "none",
  };

  return (
    <div id={rail.slug || railId(rail.title)} className={styles.rail} style={railStyle}>
      <div className={styles.railHeader}>
        <div>
          {rail.mood && <span className={styles.railMood}>{rail.mood}</span>}
          <h2>{rail.title}</h2>
          <p>{rail.description}</p>
        </div>
        <span className={styles.railCount}>{items.length} worlds</span>
      </div>
      {rail.governanceSignal && <div className={styles.governanceSignal}>{rail.governanceSignal}</div>}
      <div className={styles.railScroller}>
        {items.map((experience) => (
          <PosterCard key={`${rail.title}-${experience.id}`} experience={experience} />
        ))}
      </div>
    </div>
  );
}

export const metadata = {
  title: "Watch — Movianx Immersive Experiences",
  description:
    "Browse curated films, interactive stories, music worlds, and AI-enhanced immersive entertainment experiences.",
};

export default function WatchPage() {
  const featured = CONSUMER_EXPERIENCES.find((experience) => experience.featured && experience.contentFormat === "film") || CONSUMER_EXPERIENCES[0];
  const governance = orchestrateEcosystemRails(CONSUMER_RAILS, CONSUMER_EXPERIENCES);
  const featuredStyle = {
    "--poster-accent": featured.accent,
    "--poster-image": `url(${featured.heroImage || featured.image})`,
  };

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

      <section className={styles.hero} style={featuredStyle}>
        <div className={styles.heroContent}>
          <div className={styles.kicker}>Explore immersive entertainment</div>
          <h1>Worlds that feel alive.</h1>
          <p>Films, stories, music, and creator worlds.</p>
          <div className={styles.metaLine}>
            <span>{featured.year}</span>
            <span>{featured.genre}</span>
            <span>{featured.runtime}</span>
          </div>
          <div className={styles.ecosystemPulse}>
            <span>Tonight</span>
            <strong>{governance.health.summary}</strong>
          </div>
          <div className={styles.ctaRow}>
            <Link className={styles.primaryButton} href={`/watch/${featured.id}`}>Enter Featured World</Link>
            <Link className={styles.secondaryButton} href="#experience-library">Explore Library</Link>
          </div>
        </div>
        <div className={styles.heroPoster}>
          <div className={styles.posterArt} style={featuredStyle}>
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
        {governance.rails.map((rail) => (
          <RailSection rail={rail} key={rail.title} />
        ))}
        <div id="early-access" className={styles.waitlistPanel}>
          <div>
            <span className={styles.badge}>Early Access</span>
            <h2>Get notified when immersive releases go live.</h2>
            <p>Privacy-first updates for viewers. Private creator paths stay separate from the public experience.</p>
          </div>
          <WaitlistInline />
        </div>
      </section>
    </main>
  );
}
