import Link from "next/link";
import styles from "./watch.module.css";
import {
  CONSUMER_EXPERIENCES,
  CONSUMER_RAILS,
  getConsumerRailItems,
} from "../../data/consumerExperiences";
import { orchestrateEcosystemRails } from "../../lib/ecosystemGovernance";
import AtmosphereBridge from "./AtmosphereBridge";
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

const ZONE_ENVIRONMENT_IMAGES = {
  explore: {
    primary: "/images/generated-live/content/hero-backgrounds/hero.jpg",
    secondary: "/images/generated-live/content/wave-2-atmospheric-mystery/rail.jpg",
  },
  movies: {
    primary: "/images/generated-live/content/world-03-the-salt-line/hero.jpg",
    secondary: "/images/generated-live/content/world-02-the-event-horizon-choir/hero.jpg",
  },
  stories: {
    primary: "/images/generated-live/content/world-01-the-weight-of-silence/hero.jpg",
    secondary: "/images/generated-live/stories/world-04-the-last-summer-we-spoke/story.jpg",
  },
  music: {
    primary: "/images/wraith/gucc1.png",
    secondary: "/images/generated-live/music/music_ambient-dreamlike_the-quiet-frequency_20260526t003500z_e4n7r2/poster.jpg",
  },
};

const EDITORIAL_MODULES = {
  explore: {
    eyebrow: "Featured World",
    title: "The Weight of Silence",
    itemId: "world-01-the-weight-of-silence",
    reason: "Most revisited this week for its quiet domestic dread and restrained visual language.",
    selections: [
      ["Atmosphere Spotlight", "world-03-the-salt-line", "The sea remembers everything."],
      ["Hidden Worlds", "wave-2-atmospheric-mystery", "A room you almost missed."],
      ["Returning Tonight", "world-05-the-record-shop-at-the-end-of-the-world", "The last song still matters."],
    ],
  },
  movies: {
    eyebrow: "Atmosphere Spotlight",
    title: "The Salt Line",
    itemId: "world-03-the-salt-line",
    reason: "Coastal folk horror with cold light, weathered wood, and a world that feels slowly reclaimed.",
    selections: [
      ["Hidden Worlds", "movies_psychological-horror_the-hollowing-signal_20260526t003000z_h1k9p4", "Something answers from inside the noise."],
      ["Most Revisited", "night-of-the-living-dead", "No door holds forever."],
      ["Quietly Emerging", "world-02-the-event-horizon-choir", "A signal sings at the edge."],
    ],
  },
  stories: {
    eyebrow: "Story That Stayed With People",
    title: "10 Seconds",
    itemId: "story-3",
    reason: "A compact pressure chamber: breath, choice, and fear held close.",
    selections: [
      ["Quiet Hour Viewing", "story-1", "A spark asks what it means to live."],
      ["Hidden Worlds", "story-2", "One decision waits in the dark."],
      ["Returning Tonight", "world-01-the-weight-of-silence", "Silence keeps its own archive."],
    ],
  },
  music: {
    eyebrow: "Quiet Hour Listening",
    title: "The Quiet Frequency",
    itemId: "music_ambient-dreamlike_the-quiet-frequency_20260526t003500z_e4n7r2",
    reason: "A late-night sound world built from rain, piano, solitude, and soft spatial presence.",
    selections: [
      ["Returning Tonight", "music-echoes-in-orbit", "Memory drifts through signal."],
      ["Atmosphere Spotlight", "music-velvet-static", "The room hums back."],
      ["Hidden Worlds", "world-05-the-record-shop-at-the-end-of-the-world", "The last song still matters."],
    ],
  },
};

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

function visualFor(experience, preferred = "poster") {
  const generated = experience.generatedImages || {};
  if (preferred === "hero") {
    return generated.hero || experience.heroImage || generated.poster || generated.thumbnail || experience.image;
  }
  if (preferred === "rail") {
    return generated.rail || generated.thumbnail || experience.thumbnailImage || generated.poster || experience.image;
  }
  if (preferred === "creator") {
    return generated.creatorbanner || generated.hero || experience.heroImage || generated.poster || experience.image;
  }
  return generated.poster || experience.image || generated.thumbnail || experience.thumbnailImage || experience.heroImage;
}

function visualStyle(experience, preferred = "poster") {
  return {
    "--poster-accent": experience.accent,
    "--poster-image": visualFor(experience, preferred) ? `url(${visualFor(experience, preferred)})` : "none",
  };
}

function zoneEnvironmentStyle(zone) {
  const environment = ZONE_ENVIRONMENT_IMAGES[zone] || ZONE_ENVIRONMENT_IMAGES.explore;
  return {
    "--zone-environment-primary": `url(${environment.primary})`,
    "--zone-environment-secondary": `url(${environment.secondary})`,
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
  if (experience.factoryIngested && (!experience.runtime || experience.runtime === "Preview")) return "World";
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
      <div className={styles.posterArt} style={visualStyle(experience, "rail")}>
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
          <span>{experience.factoryIngested && !["night-of-the-living-dead","nosferatu","cabinet-of-dr-caligari","a-trip-to-the-moon","the-general","house-on-haunted-hill","the-phantom-carriage","the-lost-world"].includes(experience.id) ? "Movianx World" : experience.creator}</span>
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
    "--rail-image": items[0] ? `url(${visualFor(items[0], "hero")})` : "none",
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

function EditorialSection({ zone }) {
  const editorial = EDITORIAL_MODULES[zone] || EDITORIAL_MODULES.explore;
  const feature = CONSUMER_EXPERIENCES.find((experience) => experience.id === editorial.itemId);
  const selections = editorial.selections
    .map(([label, id, hook]) => ({
      label,
      hook,
      item: CONSUMER_EXPERIENCES.find((experience) => experience.id === id),
    }))
    .filter(({ item }) => item);

  if (!feature) return null;

  const featureVisualPreference = zone === "explore" ? "creator" : "hero";

  return (
    <section className={styles.editorial} style={visualStyle(feature, featureVisualPreference)} aria-label={`${editorial.eyebrow} editorial spotlight`}>
      <Link className={styles.editorialFeature} href={feature.href || `/watch/${feature.id}`}>
        <span className={styles.kicker}>{editorial.eyebrow}</span>
        <h2>{editorial.title}</h2>
        <p>{editorial.reason}</p>
        <div className={styles.editorialMeta}>
          {!feature.factoryIngested && <span>{feature.creator}</span>}
          <span>{atmosphericHook(feature)}</span>
        </div>
      </Link>

      <div className={styles.editorialStack}>
        {selections.map(({ label, item, hook }) => (
          <Link
            key={`${zone}-${label}-${item.id}`}
            className={styles.editorialMini}
            href={item.href || `/watch/${item.id}`}
            style={visualStyle(item, "rail")}
          >
            <span>{label}</span>
            <strong>{item.title}</strong>
            <small>{hook || atmosphericHook(item)}</small>
          </Link>
        ))}
      </div>
    </section>
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
    "--poster-image": `url(${visualFor(featured, "hero")})`,
  };

  return (
    <main className={styles.watchShell} data-zone={activeZone} style={zoneEnvironmentStyle(activeZone)}>
      <AtmosphereBridge zone={activeZone} />
      <header className={styles.topbar}>
        <Link className={styles.brand} href="/">
          <img src="/movianx-logo.png" alt="Movianx" />
          <span>Movianx</span>
        </Link>
        <nav className={styles.nav} aria-label="Main navigation">
          <Link href="/watch" className={`${styles.navLink}${activeZone === "explore" ? ` ${styles.navLinkActive}` : ""}`}>Explore</Link>
          <Link href="/watch/movies" className={`${styles.navLink}${activeZone === "movies" ? ` ${styles.navLinkActive}` : ""}`}>Movies</Link>
          <Link href="/watch/stories" className={`${styles.navLink}${activeZone === "stories" ? ` ${styles.navLinkActive}` : ""}`}>Stories</Link>
          <Link href="/watch/music" className={`${styles.navLink}${activeZone === "music" ? ` ${styles.navLinkActive}` : ""}`}>Music</Link>
          <span className={styles.navDivider} aria-hidden="true" />
          <Link href="/dashboard/welcome" className={styles.navLink}>Creator Ecosystem</Link>
          <Link href="/dashboard/welcome" className={styles.navLogin}>Login</Link>
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
          <div className={styles.posterArt} style={visualStyle(featured, "poster")}>
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
        <EditorialSection zone={activeZone} />
        {(activeZone === "explore" || activeZone === "music") && (
          <a href="/watch/music" className={styles.artistStrip} aria-label="Wraith The Don — Featured Artist">
            <div className={styles.artistStripImage} style={{backgroundImage:"url(/images/wraith/gucc1.png)"}} />
            <div className={styles.artistStripBody}>
              <span className={styles.miniBadge} style={{background:"#0f766e",marginBottom:8,display:"inline-block"}}>Featured Artist</span>
              <h2 style={{margin:"0 0 4px",fontSize:"clamp(22px,3vw,32px)",fontWeight:800,color:"#fff",letterSpacing:"-0.03em"}}>Wraith The Don</h2>
              <p style={{margin:"0 0 16px",fontSize:14,color:"rgba(255,255,255,0.55)"}}>Parallel Us — New Album · Sirens cinematic experience · Now on Movianx</p>
              <span style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.7)"}}>Watch Sirens · Full Catalog →</span>
            </div>
          </a>
        )}
        {(() => {
          const seen = new Set();
          const deduped = rails.map(rail => ({
            ...rail,
            ids: rail.ids.filter(id => { if (seen.has(id)) return false; seen.add(id); return true; }),
          })).filter(rail => rail.ids.length > 0);
          return deduped.map((rail) => (
            <RailSection rail={rail} key={`${activeZone}-${rail.title}`} />
          ));
        })()}
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
