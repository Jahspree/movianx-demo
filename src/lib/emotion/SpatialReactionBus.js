// ===========================================================================
// SpatialReactionBus — named event bus for spatial audio reactions
//
// Thin pub/sub layer decoupling spatial event emitters from handlers.
// BeatScheduler publishes beat proximity + events[] here.
// Future spatial audio systems subscribe without touching BeatScheduler.
//
// Named events:
//   "proximity"    { beatId, level: "far"|"room"|"close"|"ear", beat }
//   "beatEvent"    { beatId, tag: string, beat }  — from beat.events[] array
//   "movement"     { from, to, duration }
//   "position"     { x, y, z, label }
//
// Usage:
//   spatialReactionBus.on("proximity", ({ level, beat }) => { ... });
//   spatialReactionBus.emit("proximity", { beatId: "ch0_glass_breaks", level: "close" });
//   spatialReactionBus.off("proximity", handler);
// ===========================================================================

const KNOWN_EVENTS = Object.freeze(["proximity", "beatEvent", "movement", "position"]);

class SpatialReactionBus {
  #handlers = {};

  /**
   * Subscribe to a named event.
   * @param {string} event
   * @param {function(data: object): void} fn
   * @returns {function} unsubscribe
   */
  on(event, fn) {
    if (!this.#handlers[event]) this.#handlers[event] = [];
    this.#handlers[event].push(fn);
    return () => this.off(event, fn);
  }

  off(event, fn) {
    if (!this.#handlers[event]) return;
    this.#handlers[event] = this.#handlers[event].filter(h => h !== fn);
  }

  /**
   * Emit an event to all registered handlers.
   * @param {string} event
   * @param {object} data
   */
  emit(event, data) {
    const handlers = this.#handlers[event];
    if (!handlers?.length) return;
    handlers.forEach(fn => {
      try { fn(data); } catch(e) { console.error(`[SpatialReactionBus] handler threw for "${event}":`, e); }
    });
  }

  /**
   * Publish a beat's full spatial context — called by BeatScheduler hook.
   * Emits "proximity" once, then emits "beatEvent" for every tag in beat.events[].
   * @param {object} beat  — beat manifest entry
   * @param {object} ctx   — BeatScheduler context object
   */
  publishBeat(beat, ctx) {
    if (beat.proximity) {
      this.emit("proximity", { beatId: beat.id, level: beat.proximity, beat, ctx });
    }
    if (Array.isArray(beat.events)) {
      beat.events.forEach(tag => {
        this.emit("beatEvent", { beatId: beat.id, tag, beat, ctx });
      });
    }
  }

  clearAll() {
    this.#handlers = {};
  }
}

export const spatialReactionBus = new SpatialReactionBus();

if (typeof globalThis !== "undefined") {
  globalThis.__spatialReactionBus = spatialReactionBus;
}
