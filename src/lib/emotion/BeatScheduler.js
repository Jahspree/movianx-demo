// ===========================================================================
// BeatScheduler — executes emotional beats and dispatches lifecycle hooks
//
// Hooks fire in order for every beat:
//   beforeBeat   → before state changes (read current state, prepare)
//   onBeatStart  → tension applied to EmotionEngine, first subscriber tick
//   onBeatEnd    → after beat actions complete
//   afterBeat    → cleanup, schedule next beat
//
// Usage:
//   import { beatScheduler } from "./BeatScheduler";
//   import { BEAT_MANIFEST } from "../../data/beatManifest-10seconds";
//
//   // Register hooks
//   beatScheduler.on("onBeatStart", (beat, ctx) => {
//     audioEngine.updateTension(beat.tension / 100);
//   });
//
//   // Load chapter and advance
//   beatScheduler.loadChapter(0, 3);   // ch0 of story 3
//   beatScheduler.advance();           // execute beat 0
//   beatScheduler.advance();           // execute beat 1
// ===========================================================================

import { emotionEngine } from "./EmotionEngine.js";

const HOOK_NAMES = Object.freeze(["beforeBeat", "onBeatStart", "onBeatEnd", "afterBeat"]);

class BeatScheduler {
  #hooks       = { beforeBeat: [], onBeatStart: [], onBeatEnd: [], afterBeat: [] };
  #beats       = [];   // active chapter's beat array
  #cursor      = -1;   // index of the last-executed beat
  #chapterId   = -1;
  #storyId     = null;
  #manifest    = null; // full BEAT_MANIFEST reference, set via loadManifest()

  // ── Setup ─────────────────────────────────────────────────────────────────

  /** Provide the full manifest once at startup. */
  loadManifest(manifest) {
    this.#manifest = manifest;
  }

  /**
   * Load beats for a specific chapter + story. Resets cursor to -1.
   * Safe to call on every chapter change.
   */
  loadChapter(chapterId, storyId) {
    if (!this.#manifest) return;
    const entry = this.#manifest[storyId]?.[chapterId];
    if (!entry?.beats?.length) return;

    this.#beats     = entry.beats;
    this.#cursor    = -1;
    this.#chapterId = chapterId;
    this.#storyId   = storyId;
  }

  // ── Hooks ─────────────────────────────────────────────────────────────────

  /**
   * Register a hook handler. Returns `this` for chaining.
   * @param {"beforeBeat"|"onBeatStart"|"onBeatEnd"|"afterBeat"} event
   * @param {function(beat: object, ctx: object): void} fn
   */
  on(event, fn) {
    if (!HOOK_NAMES.includes(event)) {
      console.warn(`[BeatScheduler] unknown event "${event}". Valid: ${HOOK_NAMES.join(", ")}`);
      return this;
    }
    this.#hooks[event].push(fn);
    return this;
  }

  /** Remove a specific handler. */
  off(event, fn) {
    if (!HOOK_NAMES.includes(event)) return this;
    this.#hooks[event] = this.#hooks[event].filter(h => h !== fn);
    return this;
  }

  /** Remove all handlers for all events. */
  clearHooks() {
    HOOK_NAMES.forEach(e => { this.#hooks[e] = []; });
    return this;
  }

  // ── Execution ─────────────────────────────────────────────────────────────

  /** Execute the next beat in sequence. No-op at end of chapter. */
  advance() {
    const next = this.#cursor + 1;
    if (next >= this.#beats.length) return false;
    return this.executeBeat(next);
  }

  /**
   * Jump to a specific beat index and execute it.
   * @param {number} index
   */
  seekTo(index) {
    if (index < 0 || index >= this.#beats.length) return false;
    return this.executeBeat(index);
  }

  /**
   * Execute the beat at `index`. Updates EmotionEngine and fires all hooks.
   * @returns {boolean} true if executed, false if index out of range
   */
  executeBeat(index) {
    const beat = this.#beats[index];
    if (!beat) return false;

    this.#cursor = index;

    const ctx = {
      chapterId:  this.#chapterId,
      storyId:    this.#storyId,
      beatIndex:  index,
      total:      this.#beats.length,
      isFirst:    index === 0,
      isLast:     index === this.#beats.length - 1,
      prev:       index > 0 ? this.#beats[index - 1] : null,
      next:       index < this.#beats.length - 1 ? this.#beats[index + 1] : null,
    };

    this.#fire("beforeBeat", beat, ctx);

    // Apply tension to the single source of truth
    emotionEngine.setState({
      tension:   beat.tension,
      chapter:   this.#chapterId,
      storyId:   this.#storyId,
      beatIndex: index,
    });

    this.#fire("onBeatStart", beat, ctx);
    this.#fire("onBeatEnd",   beat, ctx);
    this.#fire("afterBeat",   beat, ctx);

    return true;
  }

  // ── Query ─────────────────────────────────────────────────────────────────

  currentBeat() {
    return this.#cursor >= 0 ? (this.#beats[this.#cursor] ?? null) : null;
  }

  nextBeat() {
    const next = this.#cursor + 1;
    return next < this.#beats.length ? this.#beats[next] : null;
  }

  beatsRemaining() {
    return Math.max(0, this.#beats.length - this.#cursor - 1);
  }

  reset() {
    this.#cursor  = -1;
    this.#beats   = [];
    this.#chapterId = -1;
    this.#storyId   = null;
  }

  // ── Internal ──────────────────────────────────────────────────────────────

  #fire(event, beat, ctx) {
    this.#hooks[event].forEach(fn => {
      try { fn(beat, ctx); }
      catch (e) { console.error(`[BeatScheduler] ${event} handler threw:`, e); }
    });
  }
}

export const beatScheduler = new BeatScheduler();

// DevTools access
if (typeof globalThis !== "undefined") {
  globalThis.__beatScheduler = beatScheduler;
}
