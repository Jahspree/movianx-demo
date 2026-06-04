"use client";

import { useState } from "react";
import styles from "./watch.module.css";

const MODES = [
  { id: "original", label: "Original", engineMode: "Cinematic" },
  { id: "reimagined", label: "Reimagined", engineMode: "Immersive" },
  { id: "alternate", label: "Alternate Ending", engineMode: "Immersive", startChapter: 3 },
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
