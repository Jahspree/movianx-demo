import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../watch.module.css";
import {
  CONSUMER_EXPERIENCES,
  getConsumerExperience,
  getFallbackRecommendations,
  getMoreFromCreator,
} from "../../../data/consumerExperiences";
import ExperienceModeSelector from "../ExperienceModeSelector";

export function generateStaticParams() {
  return CONSUMER_EXPERIENCES.map((experience) => ({ id: experience.id }));
}

export function generateMetadata({ params }) {
  const experience = getConsumerExperience(params.id);

  if (!experience) {
    return { title: "Experience Not Found — Movianx" };
  }

  return {
    title: `${experience.title} — Movianx`,
    description: experience.synopsis,
  };
}

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

function posterStyle(experience, preferred = "poster") {
  return {
    "--poster-accent": experience.accent,
    "--poster-image": visualFor(experience, preferred) ? `url(${visualFor(experience, preferred)})` : "none",
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

/** Primary play action label by content type */
function primaryAction(experience) {
  if (experience.contentFormat === "interactive_story") return "Play Story";
  if (experience.mediaType === "Music Experience") return "Play Experience";
  return "Watch Movie";
}

function previewMood(experience) {
  if (experience.contentFormat === "interactive_story") return "Interactive launch";
  if (experience.mediaType === "Music Experience") return "Spatial listening preview";
  if (experience.contentFormat === "creator_spotlight") return "Creator world preview";
  return "Cinematic preview";
}

function creatorLanes(experience) {
  // Only return lanes that have real destinations
  if (experience.contentFormat === "creator_spotlight") {
    return ["Films", "Soundscapes"];
  }
  if (experience.mediaType === "Music Experience") {
    return ["Soundscapes", "Albums"];
  }
  if (experience.contentFormat === "interactive_story") {
    return ["Chapters"];
  }
  return ["More Like This"];
}

function ExperienceCard({ experience }) {
  return (
    <Link className={styles.relatedCard} href={experience.href || `/watch/${experience.id}`}>
      <div className={styles.relatedPoster} style={posterStyle(experience, "rail")}>
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

export default function WatchDetailPage({ params }) {
  const experience = getConsumerExperience(params.id);

  if (!experience) {
    notFound();
  }

  const moreFromCreator = getMoreFromCreator(experience);
  const moreLikeThis = getFallbackRecommendations(experience);

  // Deduplicated tags — merge all tag arrays, dedupe, transform, cap at 5
  const rawTags = [
    experience.genre,
    ...(experience.discoveryTags || []),
    ...(experience.moodTags || []),
    ...(experience.styleTags || []),
  ].filter(Boolean).map(readableTag);
  const visibleTags = [...new Set(rawTags)].slice(0, 5);

  const moodLine = readableTag(experience.moodTags?.[0] || experience.genre || "");
  const lanes = creatorLanes(experience);

  return (
    <main className={styles.watchShell} style={posterStyle(experience, "hero")}>
      <div className={styles.watchBackground} />

      {/* ── UNIVERSAL HEADER ─────────────────────────────────── */}
      <header className={styles.topbar}>
        <Link className={styles.brand} href="/">
          <img src="/movianx-logo.png" alt="Movianx" />
          <span>Movianx</span>
        </Link>
        <nav className={styles.nav} aria-label="Main navigation">
          <Link href="/watch" className={styles.navLink}>Explore</Link>
          <Link href="/watch/movies" className={styles.navLink}>Movies</Link>
          <Link href="/watch/stories" className={styles.navLink}>Stories</Link>
          <Link href="/watch/music" className={styles.navLink}>Music</Link>
          <span className={styles.navDivider} aria-hidden="true" />
          <Link href="/dashboard/welcome" className={styles.navLink}>Creator Ecosystem</Link>
          <Link href="/dashboard/welcome" className={styles.navLogin}>Login</Link>
          <Link className={styles.creatorButton} href="/watch#early-access">Join Waitlist</Link>
        </nav>
      </header>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className={styles.detailHero}>
        <div className={styles.detailBackdrop} />
        <div className={styles.detailAtmosphere} aria-hidden="true">
          <span /><span /><span />
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
            {experience.contentFormat === "interactive_story" ? (
              // Hard navigation forces full page reload so Movianx.jsx re-initialises
              // with the correct launch params — soft Link nav skips the IIFE re-run.
              <a
                className={styles.primaryButton}
                href={`/?launch=reading&story=${experience.id.replace(/\D/g, "")}&mode=Cinematic`}
              >
                {primaryAction(experience)}
              </a>
            ) : (
              <Link
                className={styles.primaryButton}
                href={experience.launchHref || "#player"}
                scroll
              >
                {primaryAction(experience)}
              </Link>
            )}
            <Link
              className={styles.secondaryButton}
              href={experience.contentFormat === "interactive_story" ? "/watch/stories" : "/watch"}
            >
              Back to Library
            </Link>
          </div>
        </div>
        <div className={styles.detailHeroPoster}>
          <div className={styles.posterArt} style={posterStyle(experience, "poster")}>
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

      {/* ── WATCH LAYOUT ─────────────────────────────────────── */}
      <section className={styles.watchLayout}>

        {/* LEFT COLUMN — player + panels */}
        <div>
          {/* ── PLAYER FRAME ─────────────────────────────────── */}
          {experience.videoEmbedUrl ? (
            /* Real video embed for public-domain films */
            <div id="player" className={styles.videoFrame} style={{ padding: 0, background: "#000" }}>
              <iframe
                src={experience.videoEmbedUrl}
                title={experience.title}
                allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", borderRadius: "inherit", zIndex: 2 }}
                allow="autoplay; fullscreen; picture-in-picture"
              />
            </div>
          ) : experience.contentFormat === "music_experience" ? (
            /* Music experience — honest coming-soon state */
            <div id="player" className={styles.videoFrame}>
              <div className={styles.previewAtmosphere} aria-hidden="true">
                <span /><span /><span />
              </div>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, zIndex: 2, padding: 32, textAlign: "center" }}>
                <div style={{ fontSize: 36, opacity: 0.4 }}>♫</div>
                <p style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: 0 }}>Audio Experience In Production</p>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, margin: 0, maxWidth: 280, lineHeight: 1.6 }}>
                  {experience.title} is being mastered for spatial audio. Check back soon.
                </p>
              </div>
            </div>
          ) : (
            /* Decorative preview shell for other content */
            <div id="player" className={styles.videoFrame}>
              <div className={styles.previewAtmosphere} aria-hidden="true">
                <span /><span /><span />
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
          )}

          {/* ── PLAYER CONTROLS ─────────────────────────────── */}
          {experience.contentFormat === "interactive_story" ? (
            <ExperienceModeSelector
              experienceId={experience.id}
              primaryLabel={primaryAction(experience)}
            />
          ) : experience.contentFormat === "music_experience" ? (
            /* No fake controls for music — coming soon */
            <div className={styles.playerControls} style={{ opacity: 0.45, pointerEvents: "none", userSelect: "none" }}>
              <div className={styles.playerPrimary}>
                <span className={styles.playerPlayBtn} style={{ display: "inline-flex", alignItems: "center", gap: 10, cursor: "default" }}>
                  <span className={styles.playerPlayIcon} aria-hidden="true">♫</span>
                  Audio Coming Soon
                </span>
              </div>
            </div>
          ) : (
            <div className={styles.playerControls}>
              <div className={styles.playerPrimary}>
                <Link
                  href={experience.launchHref || "#player"}
                  className={styles.playerPlayBtn}
                  scroll
                >
                  <span className={styles.playerPlayIcon} aria-hidden="true">▶</span>
                  {primaryAction(experience)}
                </Link>
                <button type="button" className={styles.playerContinueBtn}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* AI Enhancement Panel */}
          <div className={styles.enhancementPanel} style={{ marginTop: 28 }}>
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

          {/* Series / Standalone Panel */}
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

        {/* RIGHT COLUMN — detail sidebar */}
        <aside className={styles.detailPanel}>
          <span className={styles.badge}>{experience.sourceType}</span>

          {/* Title — use h2 here since h1 is in the hero above */}
          <h2 style={{ margin: "12px 0 10px", color: "#fff", fontSize: "clamp(20px,2.8vw,28px)", lineHeight: 1.1, letterSpacing: 0 }}>
            {experience.title}
          </h2>

          <div className={styles.metaLine} style={{ marginTop: 0 }}>
            <span>{experience.year}</span>
            <span>{experience.genre}</span>
            <span>{experience.runtime}</span>
            <span>{experience.language}</span>
          </div>

          <p style={{ marginBottom: 16, color: "rgba(255,255,255,0.68)", fontSize: 14, lineHeight: 1.62 }}>
            {experience.synopsis}
          </p>

          {experience.ecosystemHook && (
            <p className={styles.ecosystemHook}>{experience.ecosystemHook}</p>
          )}

          {/* Creator Profile Card */}
          <div className={styles.creatorProfileCard}>
            <div className={styles.creatorIdentityHeader}>
              <span className={styles.creatorAvatar} aria-hidden="true">
                {experience.creator?.slice(0, 1) || "M"}
              </span>
              <span className={styles.kicker}>Creator world</span>
            </div>
            <h3 style={{ margin: "0 0 6px", color: "#fff", fontSize: 18, fontWeight: 760 }}>
              {experience.creator}
            </h3>
            <p style={{ margin: "0 0 14px", color: "rgba(255,255,255,0.56)", fontSize: 13, lineHeight: 1.45 }}>
              {experience.atmosphereProfile || experience.teamLabel || "Creator-led immersive media world."}
            </p>
            <div className={styles.creatorLanes}>
              {creatorLanes(experience).map((lane) => (
                <span key={lane}>{lane}</span>
              ))}
            </div>
          </div>

          {/* Experience toggles */}
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

          {/* ── SUPPORT PANEL — premium Apple-style CTAs ─────── */}
          <div className={styles.supportPanel}>
            <span className={styles.kicker}>Fan Support</span>
            {(experience.merchCollections || []).slice(0, 1).map((collection) => (
              <div key={collection.title} className={styles.supportCard}>
                <h3 className={styles.supportTitle}>{collection.title}</h3>
                <p className={styles.supportDesc}>{collection.description}</p>
                <div className={styles.supportActions}>
                  <button type="button" className={styles.supportCta}>
                    {collection.label || "Support Creator"}
                  </button>
                </div>
              </div>
            ))}
            {(!experience.merchCollections || !experience.merchCollections.length) && (
              <div className={styles.supportCard}>
                <h3 className={styles.supportTitle}>Support this creator</h3>
                <p className={styles.supportDesc}>
                  Help fund more immersive experiences from this world.
                </p>
                <div className={styles.supportActions}>
                  <button type="button" className={styles.supportCta}>
                    Support Creator
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Rights */}
          <details className={styles.rightsNote}>
            <summary>Rights and availability</summary>
            <p>
              {experience.rights}. Playback access is cleared before public
              release, and private creator media stays protected.
            </p>
          </details>
        </aside>
      </section>

      {/* ── CURATED RAILS ────────────────────────────────────── */}
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
