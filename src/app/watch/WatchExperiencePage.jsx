import Link from "next/link";
import styles from "./watch.module.css";
import {
  CONSUMER_EXPERIENCES,
  CONSUMER_RAILS,
  getConsumerRailItems,
} from "../../data/consumerExperiences";
import { orchestrateEcosystemRails } from "../../lib/ecosystemGovernance";
import WaitlistInline from "./WaitlistInline";

const ZONES = {
  explore: {
    eyebrow: "Explore immersive entertainment",
    title: "Worlds that feel alive.",
    copy: "Films, stories, music, and creator worlds.",
    pulseLabel: "Tonight",
    cta: "Enter Featured World",
    secondary: "Explore Library",
  },
  movies: {
    eyebrow: "Movies",
    title: "Cinema you can enter.",
    copy: "Original films, public-domain reinterpretations, and cinematic worlds.",
    pulseLabel: "Now Showing",
    cta: "Enter Featured Film",
    secondary: "Browse Movies",
  },
  stories: {
    eyebrow: "Stories",
    title: "Quiet worlds. Lingering choices.",
    copy: "Immersive written experiences for slower, more intimate discovery.",
    pulseLabel: "Story Hour",
    cta: "Enter Featured Story",
    secondary: "Browse Stories",
  },
  music: {
    eyebrow: "Music / Soundscapes",
    title: "Sound you can feel around you.",
    copy: "Spatial listening worlds, ambient releases, and emotional audio environments.",
    pulseLabel: "Listening Room",
    cta: "Enter Featured Sound",
    secondary: "Browse Soundscapes",
  },
};

const ZONE_LINKS = [
  ["Explore", "/watch", "explore"],
  ["Movies", "/watch/movies", "movies"],
  ["Stories", "/watch/stories", "stories"],
  ["Music", "/watch/music", "music"],
];

const ATMOSPHERIC_HOOKS = {
  "The Weight of Silence": "Silence keeps its own archive.",
  "The Last Summer We Spoke": "Some summers never leave.",
  "The Event Horizon Choir": "A signal sings at the edge.",
  "The Record Shop at the End of the World": "The last song still matters.",
  "Night of the Living Dead": "No door holds forever.",
  "Nosferatu": "The shadow arrives first.",
  "The Cabinet of Dr. Caligari": "The walls know the dream.",
  "A Trip to the Moon": "Wonder leaves a crater.",
  "The General": "Motion becomes its own music.",
  "House on Haunted Hill": "The house keeps count.",
  "The Phantom Carriage": "Midnight has a driver.",
  "The Lost World": "Something ancient is still breathing.",
  "10 Seconds": "You do not get another breath.",
  "Frankenstein": "A spark asks what it means to live.",
  "The Choice": "One decision waits in the dark.",
  "Signal Bloom": "Memory drifts through signal.",
  "Basement Frequency": "The room hums back.",
  "The Salt Line": "The sea remembers everything.",
  "The Last Polar Night": "The sun does not return on schedule.",
  "Veil of Static": "The signal almost has a face.",
  "The Hollowing Signal": "Something answers from inside the noise.",
  "The Quiet Frequency": "A piano holds the rain still.",
  "Late Night Corridor": "The hallway keeps listening.",
  "Marisol Vale": "Quiet dread. Precise light.",
  "Juno Trace": "Pressure shaped into sound.",
  "Iris Monroe": "Memory rendered in motion.",
  "Creator Worlds": "Artists building places you can enter.",
};

function posterStyle(experience) {
  return {
    "--poster-accent": experience.accent,
    "--poster-image": experience.image ? `url(${experience.image})` : "none",
  };
}

function railId(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

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

function byFormat(format) {
  return CONSUMER_EXPERIENCES.filter((experience) => experience.contentFormat === format);
}

function byIds(ids) {
  return ids.map((id) => CONSUMER_EXPERIENCES.find((experience) => experience.id === id)).filter(Boolean);
}

function makeRail(title, description, mood, accent, items) {
  return {
    title,
    description,
    mood,
    accent,
    ids: items.map((item) => item.id),
  };
}

function zoneRails(zone) {
  if (zone === "movies") {
    const movies = byFormat("film");
    const publicDomain = movies.filter((item) => String(item.sourceType).toLowerCase().includes("public-domain"));
    const factory = movies.filter((item) => item.factoryIngested);
    const theatrical = movies.filter((item) => !item.factoryIngested && !String(item.sourceType).toLowerCase().includes("public-domain"));

    return [
      makeRail("Now Showing", "Large-screen worlds with atmosphere and scale.", "Cinematic", "#b51f2a", movies.slice(0, 6)),
      makeRail("Public-Domain Reimagined", "Classics staged for immersive viewing.", "Classic cinema", "#991b1b", publicDomain.slice(0, 6)),
      makeRail("Factory Cinema", "Approved cinematic worlds from the factory.", "New worlds", "#d6a33a", factory.slice(0, 6)),
      makeRail("Theatrical Worlds", "Original and creator-led film spaces.", "Premiere room", "#334155", theatrical.slice(0, 6)),
    ].filter((rail) => rail.ids.length);
  }

  if (zone === "stories") {
    const stories = byFormat("interactive_story");
    const timed = stories.filter((item) => item.storyId === 3 || String(item.mediaType).toLowerCase().includes("timed"));
    const literary = stories.filter((item) => item.storyId !== 3);

    return [
      makeRail("Begin Quietly", "Story-first worlds with room to breathe.", "Intimate", "#7c3aed", stories),
      makeRail("Pressure Stories", "Choice, timing, and emotional tension.", "Close tension", "#991b1b", timed),
      makeRail("Literary Atmospheres", "Classic and written worlds with slower gravity.", "Slow burn", "#334155", literary),
    ].filter((rail) => rail.ids.length);
  }

  if (zone === "music") {
    const music = byFormat("music_experience");
    return [
      makeRail("Listening Room", "Spatial releases for quiet focus.", "Ambient", "#0f766e", music),
      makeRail("Emotional Soundscapes", "Sound-first worlds built around memory and texture.", "Sensory", "#2563eb", music.slice().reverse()),
    ].filter((rail) => rail.ids.length);
  }

  return orchestrateEcosystemRails(CONSUMER_RAILS, CONSUMER_EXPERIENCES).rails;
}

function featuredForZone(zone) {
  if (zone === "movies") {
    return byFormat("film").find((experience) => experience.featured) || byFormat("film")[0];
  }
  if (zone === "stories") {
    return byFormat("interactive_story").find((experience) => experience.storyId === 3) || byFormat("interactive_story")[0];
  }
  if (zone === "music") {
    return byFormat("music_experience")[0];
  }
  return CONSUMER_EXPERIENCES.find((experience) => experience.featured && experience.contentFormat === "film") || CONSUMER_EXPERIENCES[0];
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

  if (!items.length) return null;

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

export default function WatchExperiencePage({ zone = "explore" }) {
  const activeZone = ZONES[zone] ? zone : "explore";
  const config = ZONES[activeZone];
  const featured = featuredForZone(activeZone);
  const rails = zoneRails(activeZone);
  const governance = orchestrateEcosystemRails(CONSUMER_RAILS, CONSUMER_EXPERIENCES);
  const featuredStyle = {
    "--poster-accent": featured.accent,
    "--poster-image": `url(${featured.heroImage || featured.image})`,
  };

  return (
    <main className={styles.watchShell} data-zone={activeZone}>
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
          <div className={styles.kicker}>{config.eyebrow}</div>
          <h1>{config.title}</h1>
          <p>{config.copy}</p>
          <div className={styles.zoneNav} aria-label="Experience zones">
            {ZONE_LINKS.map(([label, href, key]) => (
              <Link
                key={key}
                className={key === activeZone ? styles.zoneNavActive : undefined}
                href={href}
              >
                {label}
              </Link>
            ))}
          </div>
          <div className={styles.metaLine}>
            <span>{featured.year}</span>
            <span>{featured.genre}</span>
            <span>{featured.runtime}</span>
          </div>
          <div className={styles.ecosystemPulse}>
            <span>{config.pulseLabel}</span>
            <strong>{activeZone === "explore" ? governance.health.summary : atmosphericHook(featured)}</strong>
          </div>
          <div className={styles.ctaRow}>
            <Link className={styles.primaryButton} href={`/watch/${featured.id}`}>{config.cta}</Link>
            <Link className={styles.secondaryButton} href="#experience-library">{config.secondary}</Link>
          </div>
        </div>
        <div className={styles.heroPoster}>
          <div className={styles.posterArt} style={featuredStyle}>
            <div className={styles.badgeRow}>
              <span className={styles.miniBadge}>{primaryBadge(featured)}</span>
              <span className={styles.miniBadge}>{posterMeta(featured)}</span>
            </div>
            <div className={styles.posterText}>
              <h2>{featured.title}</h2>
              <span className={styles.badge}>{featured.year} · {featured.runtime}</span>
            </div>
          </div>
        </div>
      </section>

      <section id="experience-library" className={styles.rails} aria-label={`${config.eyebrow} library`}>
        {rails.map((rail) => (
          <RailSection rail={rail} key={`${activeZone}-${rail.title}`} />
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
