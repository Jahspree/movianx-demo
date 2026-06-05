"use client";

import styles from "./watch.module.css";
import {
  MOVIANX_EVENTS,
  captureMovianxEvent,
  creatorMetadata,
  movieMetadata,
  musicMetadata,
} from "../../lib/movianx-analytics";

function previewMood(experience) {
  if (experience.contentFormat === "interactive_story") return "Interactive launch";
  if (experience.mediaType === "Music Experience") return "Spatial listening preview";
  if (experience.contentFormat === "creator_spotlight") return "Creator world preview";
  return "Cinematic preview";
}

export default function PlayerAnalyticsPanel({ experience }) {
  if (experience.videoEmbedUrl) {
    return (
      <div id="player" className={`${styles.videoFrame} ${styles.embedFrame}`}>
        <iframe
          className={styles.videoEmbed}
          src={experience.videoEmbedUrl}
          title={`${experience.title} playback`}
          allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          onLoad={() => {
            captureMovianxEvent(MOVIANX_EVENTS.TRAILER_PLAYED, movieMetadata(experience), {
              dedupeKey: `trailer:${experience.id}`,
            });
            captureMovianxEvent(MOVIANX_EVENTS.MOVIE_STARTED, movieMetadata(experience), {
              dedupeKey: `movie-start:${experience.id}`,
            });
          }}
        />
      </div>
    );
  }

  if (experience.mediaType === "Music Experience") {
    return (
      <button
        id="player"
        type="button"
        className={styles.videoFrame}
        onClick={() => {
          captureMovianxEvent(MOVIANX_EVENTS.MUSIC_STARTED, musicMetadata(experience), {
            dedupeKey: `music-start:${experience.id}`,
          });
        }}
      >
        <div className={styles.musicProductionState}>
          <div>
            <span>{previewMood(experience)}</span>
            <strong>Audio Experience In Production</strong>
            <p>{experience.hook || "A spatial listening world is being prepared for release."}</p>
          </div>
        </div>
      </button>
    );
  }

  if (experience.contentFormat === "creator_spotlight") {
    return (
      <button
        id="player"
        type="button"
        className={styles.videoFrame}
        onClick={() => {
          captureMovianxEvent(MOVIANX_EVENTS.CREATOR_PROFILE_VIEWED, creatorMetadata(experience), {
            dedupeKey: `creator:${experience.id}`,
          });
        }}
      >
        <div className={styles.previewAtmosphere} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className={styles.previewMeta}>
          <span>{previewMood(experience)}</span>
          <strong>{experience.title}</strong>
        </div>
      </button>
    );
  }

  return (
    <button
      id="player"
      type="button"
      className={styles.videoFrame}
      onClick={() => {
        captureMovianxEvent(MOVIANX_EVENTS.TRAILER_PLAYED, movieMetadata(experience), {
          dedupeKey: `trailer:${experience.id}`,
        });
        captureMovianxEvent(MOVIANX_EVENTS.MOVIE_STARTED, movieMetadata(experience), {
          dedupeKey: `movie-start:${experience.id}`,
        });
      }}
    >
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
    </button>
  );
}
