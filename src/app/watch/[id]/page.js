import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../watch.module.css";
import {
  CONSUMER_EXPERIENCES,
  getConsumerExperience,
  getFallbackRecommendations,
  getMoreFromCreator,
} from "../../../data/consumerExperiences";

export function generateStaticParams() {
  return CONSUMER_EXPERIENCES.map((experience) => ({ id: experience.id }));
}

export function generateMetadata({ params }) {
  const experience = getConsumerExperience(params.id);

  if (!experience) {
    return {
      title: "Experience Not Found — Movianx",
    };
  }

  return {
    title: `${experience.title} — Movianx`,
    description: experience.synopsis,
  };
}

function posterStyle(experience) {
  return {
    "--poster-accent": experience.accent,
    "--poster-image": experience.image ? `url(${experience.image})` : "none",
  };
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
};

function atmosphericHook(experience) {
  if (ATMOSPHERIC_HOOKS[experience.title]) {
    return ATMOSPHERIC_HOOKS[experience.title];
  }

  const source = experience.hook || experience.synopsis || experience.genre || "Enter quietly.";
  return source.split(/[.!?]/).find(Boolean)?.trim() || source;
}

function readableTag(tag) {
  return tag
    .replace(/[-_]+/g, " ")
    .replace(/\brails\b/g, "")
    .replace(/\bfactory generated\b/g, "factory world")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function ExperienceCard({ experience }) {
  return (
    <Link className={styles.relatedCard} href={experience.href || `/watch/${experience.id}`}>
      <div className={styles.relatedPoster} style={posterStyle(experience)}>
        <strong>{experience.title}</strong>
        <small>{experience.creator}</small>
      </div>
      <p>{atmosphericHook(experience)}</p>
    </Link>
  );
}

function CuratedRail({ title, description, items }) {
  if (!items.length) return null;

  return (
    <section className={styles.curatedSection}>
      <div className={styles.curatedHeader}>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      <div className={styles.curatedGrid}>
        {items.map((item) => (
          <ExperienceCard key={`${title}-${item.id}`} experience={item} />
        ))}
      </div>
    </section>
  );
}

function creatorLanes(experience) {
  if (experience.contentFormat === "creator_spotlight") {
    return ["Films", "Worlds", "Soundscapes", "Collections"];
  }

  if (experience.mediaType === "Music Experience") {
    return ["Soundscapes", "Visuals", "Albums", "Collections"];
  }

  if (experience.contentFormat === "interactive_story") {
    return ["Stories", "Chapters", "Worlds", "Collections"];
  }

  return ["Films", "Series", "Worlds", "Collections"];
}

function previewMood(experience) {
  if (experience.contentFormat === "interactive_story") {
    return "Interactive launch";
  }

  if (experience.mediaType === "Music Experience") {
    return "Spatial listening preview";
  }

  if (experience.contentFormat === "creator_spotlight") {
    return "Creator world preview";
  }

  return "Cinematic preview";
}

export default function WatchDetailPage({ params }) {
  const experience = getConsumerExperience(params.id);

  if (!experience) {
    notFound();
  }

  const moreFromCreator = getMoreFromCreator(experience);
  const moreLikeThis = getFallbackRecommendations(experience);
  const visibleTags = [
    experience.genre,
    ...(experience.discoveryTags || []),
    ...(experience.moodTags || []),
    ...(experience.styleTags || []),
  ].filter(Boolean).map(readableTag).slice(0, 4);
  const moodLine = readableTag(experience.moodTags?.[0] || experience.genre || "");

  return (
    <main className={styles.watchShell} style={posterStyle(experience)}>
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

      <section className={styles.detailHero}>
        <div className={styles.detailBackdrop} />
        <div className={styles.detailAtmosphere} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className={styles.detailHeroContent}>
          <span className={styles.badge}>{experience.mediaType}</span>
          <h1>{experience.title}</h1>
          <p>{atmosphericHook(experience)}</p>
          <div className={styles.creatorLine}>
            <span>By {experience.creator}</span>
            {moodLine && <span>{moodLine}</span>}
          </div>
          <div className={styles.tagCloud} aria-label="Discovery tags">
            {visibleTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className={styles.ctaRow}>
            <Link className={styles.primaryButton} href={experience.launchHref || "#player"} scroll>
              {experience.contentFormat === "interactive_story" ? "Launch Story" : "Watch Preview"}
            </Link>
            <Link className={styles.secondaryButton} href="/watch">Back to Library</Link>
          </div>
        </div>
        <div className={styles.detailHeroPoster}>
          <div className={styles.posterArt} style={posterStyle(experience)}>
            <div className={styles.badgeRow}>
              {experience.aiEnhanced && <span className={styles.miniBadge}>AI Enhanced</span>}
              {experience.immersiveReady && <span className={styles.miniBadge}>Immersive Ready</span>}
            </div>
            <div className={styles.posterText}>
              <h2>{experience.title}</h2>
              <span className={styles.badge}>{experience.runtime}</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.watchLayout}>
        <div>
          <div id="player" className={styles.videoFrame}>
            <div className={styles.previewAtmosphere} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className={styles.playGlyph} aria-hidden="true">
              <span>▶</span>
            </div>
            <div className={styles.previewMeta}>
              <span>{previewMood(experience)}</span>
              <strong>{experience.title}</strong>
            </div>
            <div className={styles.playerStatus}>
              <span>Preview ready</span>
            </div>
            <div className={styles.previewTimeline} aria-hidden="true">
              <span />
            </div>
          </div>
          <div className={styles.enhancementPanel} style={{ marginTop: 22 }}>
            <div className={styles.kicker}>AI enhancement layer</div>
            <h2 className={styles.panelTitle}>Cinematic enhancement profile</h2>
            <div className={styles.featureGrid}>
              {(experience.enhancements || [
                "Immersive audio enhancement",
                "AI scene analysis",
                "Adaptive sound staging",
                "Cinematic interaction mapping",
              ]).map((enhancement) => (
                <div className={styles.featureTile} key={enhancement}>
                  {enhancement}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.enhancementPanel} style={{ marginTop: 22 }}>
            <div className={styles.kicker}>Series Experience</div>
            <div className={styles.seriesBox}>
              <h2>{experience.series?.title || "Standalone experience"}</h2>
              <p>{experience.series ? experience.series.type : "A complete standalone release."}</p>
              {experience.series?.seasons?.length ? (
                <div className={styles.episodeList}>
                  {experience.series.seasons.map((season) => (
                    <div key={season.number} className={styles.episodeSeason}>
                      <strong>Season {season.number}: {season.title}</strong>
                      <span>{season.episodes?.length || season.episodes} episode experience</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <aside className={styles.detailPanel}>
          <span className={styles.badge}>{experience.sourceType}</span>
          <h1>{experience.title}</h1>
          <div className={styles.metaLine} style={{ marginTop: 0 }}>
            <span>{experience.year}</span>
            <span>{experience.genre}</span>
            <span>{experience.runtime}</span>
            <span>{experience.language}</span>
          </div>
          <p>{experience.synopsis}</p>
          {experience.ecosystemHook && (
            <p className={styles.ecosystemHook}>{experience.ecosystemHook}</p>
          )}

          <div className={styles.creatorProfileCard}>
            <div className={styles.creatorIdentityHeader}>
              <span className={styles.creatorAvatar} aria-hidden="true">
                {experience.creator?.slice(0, 1) || "M"}
              </span>
              <span className={styles.kicker}>Creator world</span>
            </div>
            <h2>{experience.creator}</h2>
            <p>{experience.atmosphereProfile || experience.teamLabel || "Creator-led immersive media world."}</p>
            <div className={styles.creatorLanes}>
              {creatorLanes(experience).map((lane) => (
                <span key={lane}>{lane}</span>
              ))}
            </div>
          </div>

          <div className={styles.toggleRow} aria-label="Experience controls">
            <div className={styles.toggle}>
              <span>Immersive Audio</span>
              <span>{experience.immersiveReady ? "Ready" : "Preview"}</span>
            </div>
            <div className={styles.toggle}>
              <span>Subtitles</span>
              <span>Preview</span>
            </div>
            <div className={styles.toggle}>
              <span>AI Enhanced</span>
              <span>{experience.aiEnhanced ? "On" : "Curated"}</span>
            </div>
            <div className={styles.toggle}>
              <span>Continue Watching</span>
              <span>Ready</span>
            </div>
          </div>

          <div className={styles.merchPanel}>
            <span className={styles.kicker}>Fan support</span>
            {(experience.merchCollections || []).slice(0, 1).map((collection) => (
              <div key={collection.title}>
                <h2>{collection.title}</h2>
                <p>{collection.description}</p>
                <span>{collection.label}</span>
              </div>
            ))}
          </div>

          <details className={styles.rightsNote}>
            <summary>Rights and availability</summary>
            <p>
              {experience.rights}. Playback access is cleared before public
              release, and private creator media stays protected.
            </p>
          </details>
        </aside>
      </section>

      <div className={styles.detailRails}>
        <CuratedRail
          title="More From The Creator"
          description="More work from this world."
          items={moreFromCreator}
        />
        <CuratedRail
          title="More Like This"
          description="Similar mood. Different door."
          items={moreLikeThis}
        />
      </div>
    </main>
  );
}
