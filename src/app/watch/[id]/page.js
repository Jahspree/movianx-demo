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

function ExperienceCard({ experience }) {
  return (
    <Link className={styles.relatedCard} href={experience.href || `/watch/${experience.id}`}>
      <div className={styles.relatedPoster} style={posterStyle(experience)}>
        <span>{experience.mediaType}</span>
        <strong>{experience.title}</strong>
        <small>{experience.creator}</small>
      </div>
      <p>{experience.hook || experience.genre}</p>
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
  ].filter(Boolean).slice(0, 10);
  const moodLine = [
    experience.moodTags?.[0],
    experience.styleTags?.[0],
    experience.discoveryTags?.[0],
  ].filter(Boolean).join(" / ");

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
          <p>{experience.hook || experience.synopsis}</p>
          <div className={styles.creatorLine}>
            <span>By {experience.creator}</span>
            <span>{experience.teamLabel}</span>
            {moodLine && <span>{moodLine}</span>}
          </div>
          <div className={styles.tagCloud} aria-label="Discovery tags">
            {visibleTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className={styles.ctaRow}>
            <Link className={styles.primaryButton} href={experience.launchHref || "#player"}>
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
            <h2 className={styles.panelTitle}>Cinematic processing profile</h2>
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
            <div className={styles.kicker}>Series foundation</div>
            <div className={styles.seriesBox}>
              <h2>{experience.series?.title || "Standalone experience"}</h2>
              <p>
                {experience.series
                  ? `${experience.series.type}. ${experience.series.continueWatching}. ${experience.series.bingeSupport}.`
                  : "This title is modeled as a standalone release, with the same architecture available for seasons, episodes, ordering, thumbnails, continue watching, and future binge support."}
              </p>
              {experience.series?.seasons?.length ? (
                <div className={styles.episodeList}>
                  {experience.series.seasons.map((season) => (
                    <div key={season.number} className={styles.episodeSeason}>
                      <strong>Season {season.number}: {season.title}</strong>
                      <span>{season.episodes?.length || season.episodes} episode foundation</span>
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

          <div className={styles.creatorProfileCard}>
            <span className={styles.kicker}>Creator identity</span>
            <h2>{experience.creator}</h2>
            <p>{experience.teamLabel || "Creator-led immersive media world"}</p>
            <div>
              <span>{experience.contentFormat?.replaceAll("_", " ")}</span>
              <span>{experience.seriesType?.replaceAll("_", " ")}</span>
            </div>
          </div>

          <div className={styles.toggleRow} aria-label="Experience controls">
            <div className={styles.toggle}>
              <span>Immersive Audio</span>
              <span>{experience.immersiveReady ? "Ready" : "Pending"}</span>
            </div>
            <div className={styles.toggle}>
              <span>Subtitles</span>
              <span>Demo</span>
            </div>
            <div className={styles.toggle}>
              <span>AI Enhanced</span>
              <span>{experience.aiEnhanced ? "On" : "Processing"}</span>
            </div>
            <div className={styles.toggle}>
              <span>Continue Watching</span>
              <span>Foundation</span>
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

          <div className={styles.rightsNote}>
            Rights status: {experience.rights}. This investor demo uses metadata and
            placeholder presentation only. No copyrighted film stream or private
            media source is embedded on this page.
          </div>
        </aside>
      </section>

      <div className={styles.detailRails}>
        <CuratedRail
          title="More From The Creator"
          description="Creator worlds and related work are treated as artistic ecosystems, not disposable uploads."
          items={moreFromCreator}
        />
        <CuratedRail
          title="More Like This"
          description="Curated by genre, mood, style, and psychological similarity."
          items={moreLikeThis}
        />
      </div>
    </main>
  );
}
