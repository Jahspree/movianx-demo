// ===========================================================================
// CharacterPresenceEngine — Sarah as a living character
//
// Orchestrates all Phase 3 systems. The single activation point for
// character presence in the experience.
//
// presenceState — semantic narrative state (separate from tension):
//   calm      tension 0-15   She believes she is safe.
//   alert     tension 16-30  Something felt wrong. She is listening.
//   worried   tension 31-50  This is real. She is calculating.
//   fearful   tension 51-70  She knows. Her body reacts before her mind.
//   panicked  tension 71-88  All calculation is gone.
//   breaking  tension 89-96  The edge of who she is.
//   shutdown  tension 97-100 Past the edge.
//
// Emotional Memory:
//   State cannot drop more than one level per beat.
//   Recent high tension leaves a floor — recovery takes time.
//   Momentum: rapid escalation accelerates further escalation.
//
// Usage:
//   characterPresenceEngine.activate(audioEngine, assetResolver);
//   characterPresenceEngine.getPresenceState();   // "fearful"
//   characterPresenceEngine.getEmotionalMomentum(); // 0-1 float
//   characterPresenceEngine.deactivate();
// ===========================================================================

import { emotionEngine }    from "./EmotionEngine.js";
import { beatScheduler }    from "./BeatScheduler.js";
import { spatialReactionBus } from "./SpatialReactionBus.js";
import { breathingSystem }  from "./BreathingSystem.js";
import { proximitySystem }  from "./ProximitySystem.js";
import { silenceEngine }    from "./SilenceEngine.js";
import { reactionTriggers } from "./ReactionTriggers.js";

export const PRESENCE_STATES = Object.freeze([
  "calm", "alert", "worried", "fearful", "panicked", "breaking", "shutdown",
]);

// Tension band → raw presence state (before emotional memory is applied)
function tensionToRawState(tension) {
  if (tension >= 97) return "shutdown";
  if (tension >= 89) return "breaking";
  if (tension >= 71) return "panicked";
  if (tension >= 51) return "fearful";
  if (tension >= 31) return "worried";
  if (tension >= 16) return "alert";
  return "calm";
}

const STATE_IDX = Object.fromEntries(PRESENCE_STATES.map((s, i) => [s, i]));

class CharacterPresenceEngine {
  // ── Emotional memory ───────────────────────────────────────────────────
  #tensionHistory    = [];       // last 8 { tension, timestamp }
  #presenceState     = "calm";
  #minimumStateIdx   = 0;        // floor from memory — prevents instant recovery
  #lastBeatTension   = 0;
  // ── Internal refs ──────────────────────────────────────────────────────
  #unsubEmotion      = null;
  #unsubProximity    = null;
  #unsubBeatEvent    = null;
  #active            = false;

  // ── Public API ────────────────────────────────────────────────────────

  activate(audioEngine, assetResolver) {
    if (this.#active) this.deactivate();

    // Activate subsystems
    breathingSystem.activate(audioEngine, assetResolver);
    silenceEngine.activate(audioEngine);
    proximitySystem.reset();
    reactionTriggers.activate(breathingSystem, silenceEngine);

    // Subscribe to state changes
    this.#unsubEmotion  = emotionEngine.subscribe(s => this.#onEmotionChange(s));
    this.#unsubProximity = spatialReactionBus.on("position", d => this.#onProximityChange(d));

    // Register afterBeat hook for silence requests
    beatScheduler.on("afterBeat", (beat, ctx) => {
      proximitySystem.fromBeat(beat);
    });

    this.#active = true;
    this.#onEmotionChange(emotionEngine.getState());
    console.log("[CharacterPresence] activated — Sarah is present");
  }

  deactivate() {
    if (this.#unsubEmotion)  { this.#unsubEmotion();  this.#unsubEmotion  = null; }
    if (this.#unsubProximity){ this.#unsubProximity(); this.#unsubProximity = null; }
    if (this.#unsubBeatEvent){ this.#unsubBeatEvent(); this.#unsubBeatEvent = null; }

    breathingSystem.deactivate();
    silenceEngine.deactivate();
    reactionTriggers.deactivate();
    proximitySystem.reset();

    this.#tensionHistory  = [];
    this.#presenceState   = "calm";
    this.#minimumStateIdx = 0;
    this.#active          = false;
    console.log("[CharacterPresence] deactivated");
  }

  getPresenceState()      { return this.#presenceState; }
  getEmotionalMomentum()  { return this.#computeMomentum(); }
  isActive()              { return this.#active; }

  // ── Emotional memory ─────────────────────────────────────────────────

  #recordTension(tension) {
    this.#tensionHistory.push({ tension, ts: Date.now() });
    if (this.#tensionHistory.length > 8) this.#tensionHistory.shift();
  }

  #computeMomentum() {
    const h = this.#tensionHistory;
    if (h.length < 2) return 0;
    const pairs = Math.min(4, h.length - 1);
    let sum = 0;
    for (let i = h.length - 1; i >= h.length - pairs; i--) {
      sum += (h[i].tension - h[i - 1].tension);
    }
    // Normalize to 0-1 (positive = escalating, clamp negatives to 0)
    return Math.max(0, Math.min(1, sum / (pairs * 25)));
  }

  #updateMinimumState(tension) {
    // If we just peaked high, set a floor so recovery is gradual
    const rawIdx = STATE_IDX[tensionToRawState(tension)];
    if (rawIdx > this.#minimumStateIdx) {
      this.#minimumStateIdx = rawIdx;
    } else {
      // Minimum state decays by 1 level every ~3 beats
      // We use beat count tracked via tension history
      const h = this.#tensionHistory;
      if (h.length >= 3) {
        const recent = h.slice(-3).map(e => STATE_IDX[tensionToRawState(e.tension)]);
        const recentMax = Math.max(...recent);
        // Floor = 1 below the recent max (never drops to zero instantly)
        this.#minimumStateIdx = Math.max(0, recentMax - 1);
      }
    }
  }

  #computePresenceState(tension) {
    const rawState    = tensionToRawState(tension);
    const rawIdx      = STATE_IDX[rawState];
    const momentum    = this.#computeMomentum();
    const prevIdx     = STATE_IDX[this.#presenceState];

    // Apply emotional momentum — high momentum can push state one level higher
    let targetIdx = rawIdx;
    if (momentum > 0.6 && rawIdx < PRESENCE_STATES.length - 1) {
      targetIdx = Math.min(PRESENCE_STATES.length - 1, rawIdx + 1);
    }

    // Apply memory floor — can't instantly recover
    targetIdx = Math.max(targetIdx, this.#minimumStateIdx);

    // Recovery constraint — state can drop at most 1 level at a time
    if (targetIdx < prevIdx) {
      targetIdx = prevIdx - 1;
    }

    return PRESENCE_STATES[Math.max(0, Math.min(PRESENCE_STATES.length - 1, targetIdx))];
  }

  // ── Handlers ─────────────────────────────────────────────────────────

  #onEmotionChange({ tension, beatIndex }) {
    if (!this.#active) return;

    this.#recordTension(tension);
    this.#updateMinimumState(tension);

    const nextState = this.#computePresenceState(tension);
    if (nextState !== this.#presenceState) {
      const prev = this.#presenceState;
      this.#presenceState = nextState;
      console.log(
        `[CharacterPresence] ${prev} → ${nextState}`,
        `| tension ${tension} | momentum ${this.getEmotionalMomentum().toFixed(2)}`
      );
    }

    // Keep breathing system in sync with tension
    breathingSystem.syncToTension(tension);
  }

  #onProximityChange({ label }) {
    // Sarah moved — log for now; future: adjust spatial audio processing
    console.log(`[CharacterPresence] position → ${label}`);
  }
}

export const characterPresenceEngine = new CharacterPresenceEngine();

if (typeof globalThis !== "undefined") {
  globalThis.__characterPresenceEngine = characterPresenceEngine;
}
