"use client";

import { useState } from "react";
import styles from "./watch.module.css";
import {
  MOVIANX_EVENTS,
  captureMovianxEvent,
  storyMetadata,
} from "../../lib/movianx-analytics";

const MODES = [
  { id: "original", label: "Original", engineMode: "Cinematic", event: MOVIANX_EVENTS.ORIGINAL_VERSION_SELECTED },
  { id: "reimagined", label: "Reimagined", engineMode: "Immersive", event: MOVIANX_EVENTS.REIMAGINED_VERSION_SELECTED },
  { id: "alternate_ending", label: "Alternate Ending", engineMode: "Immersive", startChapter: 3, event: MOVIANX_EVENTS.ALTERNATE_ENDING_SELECTED },
];

function storyIdFromExperience(experienceId) {
  return String(experienceId || "").replace(/\D/g, "");
}

export default function ExperienceModeSelector({ experienceId, primaryLabel = "Play Story" }) {
  const [selected, setSelected] = useState("original");
  const storyId = storyIdFromExperience(experienceId);

  function handlePlay() {
    const mode = MODES.find((item) => item.id === selected) || MODES[0];
    if (!storyId) return;

    const properties = storyMetadata({ id: storyId, title: experienceId }, {
      current_page: mode.startChapter || 1,
      completion_percentage: 0,
      mode: mode.id,
    });

    captureMovianxEvent(mode.event, properties, { dedupeKey: `story-mode:${storyId}:${mode.id}` });
    captureMovianxEvent(MOVIANX_EVENTS.STORY_STARTED, properties, { dedupeKey: `story-start:${storyId}:${mode.id}` });
    captureMovianxEvent("story_mode_launched", {
      experience_id: experienceId,
      story_id: storyId,
      mode: mode.id,
      engine_mode: mode.engineMode,
    });

    const params = new URLSearchParams({
      launch: "reading",
      story: storyId,
      mode: mode.engineMode,
    });

    if (mode.startChapter) params.set("chapter", String(mode.startChapter));
    window.location.href = `/?${params.toString()}`;
  }

  return (
    <div id="player" className={styles.modeSelector} aria-label="Story experience modes">
      <span className={styles.modeSelectorLabel}>Choose Your Experience</span>
      <div className={styles.modeSelectorBtns}>
        {MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            className={selected === mode.id ? styles.modeBtnActive : styles.modeBtn}
            onClick={() => setSelected(mode.id)}
          >
            {mode.label}
          </button>
        ))}
      </div>
      <button type="button" className={styles.playerPlayBtn} onClick={handlePlay}>
        <span className={styles.playerPlayIcon} aria-hidden="true">▶</span>
        {primaryLabel}
      </button>
    </div>
  );
}
