// ===========================================================================
// ReactionTriggers — maps beat event tags to Sarah's physical reactions
//
// Listens to SpatialReactionBus "beatEvent". When a known tag fires, it
// executes a sequenced reaction via BreathingSystem and SilenceEngine.
//
// Sequence format:
//   { delay: ms, action: string, ...params }
//
// Actions:
//   hold_breath       — interrupt breathing for params.duration ms
//   release_hold      — release, optional gasp
//   breath_once       — one immediate breath at params.volumeScale
//   set_mode          — change breathing mode to params.mode
//   request_silence   — typed silence via SilenceEngine
//   log               — dev console marker (validation helper)
//
// Supported tags:
//   sfx:glass_break      gasp, hold, fear breath
//   sfx:footsteps        hold breath while threat approaches
//   sfx:door_handle      absolute hold — last moment
//   atmosphere:hold_breath  hold breath (room event)
//   choice:present       suspended moment before decision
//   heartbeat:stop       wind down to slow breathing
//   timer:start          escalate to panic
//   engine:reset_pending  release all holds, recover
//
// Usage:
//   reactionTriggers.activate(breathingSystem, silenceEngine, assetResolver, audioEngine);
//   reactionTriggers.deactivate();
// ===========================================================================

import { spatialReactionBus } from "./SpatialReactionBus.js";

const SEQUENCES = {

  "sfx:glass_break": [
    // Immediate hold — freeze
    { delay: 0,    action: "hold_breath",     duration: 900 },
    // Single sharp gasp — involuntary
    { delay: 950,  action: "breath_once",     volumeScale: 2.2 },
    // Fear silence follows
    { delay: 1050, action: "request_silence", type: "fear", duration: 700 },
    // Settle into shallow fear breathing
    { delay: 1800, action: "set_mode",        mode: "shallow" },
    { delay: 1800, action: "log",             label: "[Reaction] glass_break sequence complete" },
  ],

  "sfx:footsteps": [
    // Hold — tracking every sound
    { delay: 0,    action: "hold_breath",     duration: 2400 },
    // Release into shallow after danger passes immediate freeze
    { delay: 2500, action: "set_mode",        mode: "shallow" },
  ],

  "sfx:door_handle": [
    // Absolute hold — the last moment
    { delay: 0,    action: "hold_breath",     duration: 4500 },
    { delay: 0,    action: "request_silence", type: "anticipation", duration: 400 },
  ],

  "sfx:door_open": [
    // Door opens — release from hold, ragged breath
    { delay: 0,    action: "release_hold",    gasp: true },
    { delay: 400,  action: "set_mode",        mode: "panic" },
  ],

  "atmosphere:hold_breath": [
    // Generic hold moment
    { delay: 0,    action: "hold_breath",     duration: 3000 },
  ],

  "choice:present": [
    // Decision suspended — held breath, anticipation silence
    { delay: 0,    action: "hold_breath",     duration: 6000 },
    { delay: 0,    action: "request_silence", type: "anticipation", duration: 600 },
  ],

  "heartbeat:stop": [
    // Aftermath — release everything, slow fade
    { delay: 0,    action: "release_hold",    gasp: false },
    { delay: 200,  action: "set_mode",        mode: "slow" },
  ],

  "heartbeat:slow_fade": [
    { delay: 0,    action: "set_mode",        mode: "slow" },
  ],

  "timer:start": [
    // Countdown begins — panic
    { delay: 0,    action: "set_mode",        mode: "panic" },
  ],

  "engine:reset_pending": [
    // Story ending — wind down
    { delay: 0,    action: "release_hold",    gasp: false },
    { delay: 500,  action: "set_mode",        mode: "slow" },
    { delay: 500,  action: "request_silence", type: "grief", duration: 800 },
  ],

};

class ReactionTriggers {
  #breathing    = null;
  #silenceEng   = null;
  #timers       = [];
  #unsubBus     = null;
  #active       = false;

  activate(breathingSystem, silenceEngine) {
    if (this.#unsubBus) this.deactivate();
    this.#breathing  = breathingSystem;
    this.#silenceEng = silenceEngine;
    this.#active     = true;
    this.#unsubBus   = spatialReactionBus.on("beatEvent", e => this.#onBeatEvent(e));
  }

  deactivate() {
    if (this.#unsubBus) { this.#unsubBus(); this.#unsubBus = null; }
    this.#timers.forEach(id => clearTimeout(id));
    this.#timers    = [];
    this.#breathing = null;
    this.#active    = false;
  }

  // ── Internal ──────────────────────────────────────────────────────────────

  #onBeatEvent({ tag }) {
    const seq = SEQUENCES[tag];
    if (!seq) return;

    seq.forEach(step => {
      const tid = setTimeout(() => this.#executeStep(step), step.delay);
      this.#timers.push(tid);
    });
  }

  #executeStep(step) {
    if (!this.#active) return;
    const b = this.#breathing;
    const s = this.#silenceEng;

    switch (step.action) {
      case "hold_breath":
        b?.holdBreath(step.duration, true);
        break;
      case "release_hold":
        b?.releaseHold(step.gasp !== false);
        break;
      case "breath_once":
        b?.breathOnce(step.volumeScale ?? 1.0);
        break;
      case "set_mode":
        b?.setMode(step.mode);
        break;
      case "request_silence":
        s?.request(step.type, step.duration);
        break;
      case "log":
        console.log(step.label || "[ReactionTrigger] step");
        break;
    }
  }
}

export const reactionTriggers = new ReactionTriggers();

if (typeof globalThis !== "undefined") {
  globalThis.__reactionTriggers = reactionTriggers;
}
