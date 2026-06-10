// ===========================================================================
// EmotionEngine — single source of truth for runtime emotional state
//
// Tension scale: 0–100
//   0–20   calm / safe
//   21–45  unease / dread building
//   46–70  fear / danger present
//   71–90  panic / immediate threat
//   91–100 climax / absolute crisis
//
// Usage:
//   import { emotionEngine } from "./EmotionEngine";
//
//   // Read
//   const { tension } = emotionEngine.getState();
//
//   // Write
//   emotionEngine.setState({ tension: 72, phase: "countdown" });
//
//   // Subscribe
//   const unsubscribe = emotionEngine.subscribe(state => {
//     console.log("tension →", state.tension);
//   });
//   unsubscribe(); // cleanup
// ===========================================================================

const PHASES = Object.freeze(["idle", "loading", "narrating", "choice", "countdown", "transition"]);

const DEFAULT_STATE = Object.freeze({
  tension:    0,        // 0–100
  chapter:   -1,        // active chapter index (-1 = none)
  storyId:   null,      // active story id
  beatIndex: -1,        // active beat index within chapter (-1 = none)
  phase:     "idle",    // see PHASES
});

class EmotionEngine {
  #state     = { ...DEFAULT_STATE };
  #listeners = new Set();

  // ── Read ──────────────────────────────────────────────────────────────────

  getState() {
    return { ...this.#state };
  }

  getTension() {
    return this.#state.tension;
  }

  getPhase() {
    return this.#state.phase;
  }

  // ── Write ─────────────────────────────────────────────────────────────────

  /**
   * Merge partial state. Only fires listeners if something actually changed.
   * Tension is clamped to [0, 100]. Phase must be a valid PHASES value.
   */
  setState(partial) {
    const next = { ...this.#state };

    if (partial.tension !== undefined) {
      next.tension = Math.max(0, Math.min(100, Math.round(partial.tension)));
    }
    if (partial.chapter !== undefined)   next.chapter   = partial.chapter;
    if (partial.storyId !== undefined)   next.storyId   = partial.storyId;
    if (partial.beatIndex !== undefined) next.beatIndex  = partial.beatIndex;
    if (partial.phase !== undefined) {
      if (PHASES.includes(partial.phase)) next.phase = partial.phase;
    }

    if (!this.#changed(this.#state, next)) return;
    this.#state = next;
    this.#notify();
  }

  /** Full reset — e.g. when leaving an experience */
  reset() {
    this.#state = { ...DEFAULT_STATE };
    this.#notify();
  }

  // ── Subscribe ─────────────────────────────────────────────────────────────

  /**
   * Register a listener. Returns an unsubscribe function.
   * @param {function(state: object): void} fn
   * @returns {function(): void} unsubscribe
   */
  subscribe(fn) {
    this.#listeners.add(fn);
    return () => this.#listeners.delete(fn);
  }

  // ── Internal ──────────────────────────────────────────────────────────────

  #changed(a, b) {
    return (
      a.tension   !== b.tension   ||
      a.chapter   !== b.chapter   ||
      a.storyId   !== b.storyId   ||
      a.beatIndex !== b.beatIndex ||
      a.phase     !== b.phase
    );
  }

  #notify() {
    const snap = this.getState();
    this.#listeners.forEach(fn => {
      try { fn(snap); } catch (e) { console.error("[EmotionEngine] listener threw:", e); }
    });
  }
}

// Singleton — shared across AudioEngine, BeatScheduler, React components
export const emotionEngine = new EmotionEngine();

// DevTools access
if (typeof globalThis !== "undefined") {
  globalThis.__emotionEngine = emotionEngine;
}
