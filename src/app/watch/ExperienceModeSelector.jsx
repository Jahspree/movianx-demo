"use client";

import { useState } from "react";
import styles from "./watch.module.css";

const MODES = [
  { id: "original",   label: "Original",        engineMode: "Cinematic"  },
  { id: "reimagined", label: "Reimagined",       engineMode: "Immersive"  },
  { id: "alternate",  label: "Alternate Ending", engineMode: "Immersive", startChapter: 3 },
];

export default function ExperienceModeSelector({ experienceId, primaryLabel }) {
  const [selected, setSelected] = useState("original");

  function handlePlay() {
    const m = MODES.find(x => x.id === selected) || MODES[0];
    // Extract numeric story ID from "story-3" → 3
    const numericId = String(experienceId).replace(/\D/g, "");
    if (!numericId) return;
    const params = new URLSearchParams({
      launch: "reading",
      story: numericId,
      mode: m.engineMode,
    });
    if (m.startChapter) params.set("chapter", m.startChapter);
    window.location.href = `/?${params.toString()}`;
  }

  return (
    <div className={styles.modeSelector}>
      <span className={styles.modeSelectorLabel}>Choose Your Experience</span>
      <div className={styles.modeSelectorBtns}>
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            className={selected === m.id ? styles.modeBtnActive : styles.modeBtn}
            onClick={() => setSelected(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className={styles.playerPlayBtn}
        style={{ marginTop: 4, border: "none", cursor: "pointer" }}
        onClick={handlePlay}
      >
        <span className={styles.playerPlayIcon} aria-hidden="true">▶</span>
        {primaryLabel}
      </button>
    </div>
  );
}
