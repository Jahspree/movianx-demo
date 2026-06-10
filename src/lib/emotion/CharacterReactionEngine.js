// ===========================================================================
// CharacterReactionEngine — Sarah's physiological emotional state machine
//
// Subscribes to EmotionEngine. Transitions through reaction states based on
// tension level. Triggers spatial audio reactions using existing SFX assets.
//
// States (ascending):
//   SILENT      tension 0-15   — character is still, no audible reaction
//   BREATHING   tension 16-35  — slow controlled breathing present
//   NERVOUS     tension 36-55  — nervous breath patterns, irregular
//   FEARFUL     tension 56-75  — fear breathing, raspy, closer
//   PANIC       tension 76-92  — rapid desperate breaths
//   COLLAPSE    tension 93-100 — emotional break, near-silent sobbing
//
// Usage:
//   characterReactionEngine.activate(audioEngine, assetResolver);
//   characterReactionEngine.deactivate();
//   characterReactionEngine.on("stateChange", (prev, next, tension) => {});
// ===========================================================================

import { emotionEngine } from "./EmotionEngine.js";

export const REACTION_STATES = Object.freeze([
  "SILENT",
  "BREATHING",
  "NERVOUS",
  "FEARFUL",
  "PANIC",
  "COLLAPSE",
]);

// Tension thresholds (lower bound) for each state
const STATE_THRESHOLDS = {
  SILENT:    0,
  BREATHING: 16,
  NERVOUS:   36,
  FEARFUL:   56,
  PANIC:     76,
  COLLAPSE:  93,
};

// Minimum ms between breath events per state
const BREATH_INTERVALS = {
  SILENT:    Infinity,
  BREATHING: 5500,
  NERVOUS:   3200,
  FEARFUL:   2000,
  PANIC:     900,
  COLLAPSE:  4000,
};

// Spatial parameters per state — breathing_raspy.mp3 repositions with state
const BREATH_PARAMS = {
  SILENT:    null,
  BREATHING: { volume: 0.025, position: { x: 0.08, y: 0, z: -0.15 } },
  NERVOUS:   { volume: 0.04,  position: { x: 0.15, y: 0, z: -0.12 } },
  FEARFUL:   { volume: 0.065, position: { x: 0.20, y: 0, z: -0.08 } },
  PANIC:     { volume: 0.09,  position: { x: 0.12, y: 0, z: -0.04 } },
  COLLAPSE:  { volume: 0.038, position: { x: 0.05, y: 0, z: -0.18 } },
};

function tensionToState(tension) {
  if (tension >= STATE_THRESHOLDS.COLLAPSE)  return "COLLAPSE";
  if (tension >= STATE_THRESHOLDS.PANIC)     return "PANIC";
  if (tension >= STATE_THRESHOLDS.FEARFUL)   return "FEARFUL";
  if (tension >= STATE_THRESHOLDS.NERVOUS)   return "NERVOUS";
  if (tension >= STATE_THRESHOLDS.BREATHING) return "BREATHING";
  return "SILENT";
}

class CharacterReactionEngine {
  #audioEngine    = null;
  #assetResolver  = null;
  #unsub          = null;
  #currentState   = "SILENT";
  #lastBreathAt   = 0;
  #breathTimer    = null;
  #listeners      = { stateChange: [] };

  activate(audioEngine, assetResolver) {
    if (this.#unsub) this.deactivate();
    this.#audioEngine   = audioEngine;
    this.#assetResolver = assetResolver;
    this.#unsub = emotionEngine.subscribe(state => this.#onStateChange(state));
    this.#onStateChange(emotionEngine.getState());
  }

  deactivate() {
    if (this.#unsub) { this.#unsub(); this.#unsub = null; }
    if (this.#breathTimer) { clearTimeout(this.#breathTimer); this.#breathTimer = null; }
    this.#audioEngine   = null;
    this.#assetResolver = null;
    this.#currentState  = "SILENT";
    this.#lastBreathAt  = 0;
  }

  /** Register a callback for state transitions.
   *  @param {"stateChange"} event
   *  @param {function(prev: string, next: string, tension: number): void} fn
   */
  on(event, fn) {
    if (this.#listeners[event]) this.#listeners[event].push(fn);
    return this;
  }

  off(event, fn) {
    if (this.#listeners[event]) {
      this.#listeners[event] = this.#listeners[event].filter(h => h !== fn);
    }
    return this;
  }

  getCurrentState() { return this.#currentState; }

  // ── Internal ──────────────────────────────────────────────────────────────

  #onStateChange({ tension }) {
    const nextState = tensionToState(tension);

    if (nextState !== this.#currentState) {
      const prev = this.#currentState;
      this.#currentState = nextState;
      console.log(`[CharacterReaction] ${prev} → ${nextState} (tension ${tension})`);
      this.#listeners.stateChange.forEach(fn => {
        try { fn(prev, nextState, tension); } catch(e) {}
      });
      // Trigger an immediate breath on state escalation
      if (REACTION_STATES.indexOf(nextState) > REACTION_STATES.indexOf(prev)) {
        this.#triggerBreath(nextState);
      }
    }

    // Schedule periodic breaths while in an active state
    this.#scheduleNextBreath(nextState, tension);
  }

  #scheduleNextBreath(state, tension) {
    if (state === "SILENT") return;
    if (this.#breathTimer) return; // already scheduled

    const interval = BREATH_INTERVALS[state];
    if (!Number.isFinite(interval)) return;

    // Jitter: ±20% randomness keeps it organic
    const jitter = interval * (0.8 + Math.random() * 0.4);
    this.#breathTimer = setTimeout(() => {
      this.#breathTimer = null;
      if (this.#currentState !== "SILENT") {
        this.#triggerBreath(this.#currentState);
      }
    }, jitter);
  }

  #triggerBreath(state) {
    const ae  = this.#audioEngine;
    const ar  = this.#assetResolver;
    if (!ae?.ctx || !ar) return;

    const params = BREATH_PARAMS[state];
    if (!params) return;

    const url = ar.getAudio("breathing_raspy");
    if (!url) return;

    ae.playSpatial(url, params.volume, params.position, false, 0, "sarah_breath", "tension");
    this.#lastBreathAt = Date.now();
  }
}

export const characterReactionEngine = new CharacterReactionEngine();

if (typeof globalThis !== "undefined") {
  globalThis.__characterReactionEngine = characterReactionEngine;
}
