// ===========================================================================
// SilenceEngine — typed emotional silence
//
// Not all silence is equal. Four types, each with a distinct feel:
//
//   normal       — default pause, neutral space between beats
//   anticipation — longer, pressure builds, no sound dares break it
//   fear         — shorter, abrupt, the world stops holding its breath
//   grief        — long, slow fade, the room settles into weight
//
// BeatScheduler hooks call SilenceEngine.fromBeat(beat) for beats
// with a silenceType field. ReactionTriggers call request() directly.
//
// Usage:
//   silenceEngine.activate(audioEngine);
//   silenceEngine.request("anticipation", 2200);   // duration override in ms
//   silenceEngine.fromBeat(beat);                  // reads beat.silenceType + silenceAfter
// ===========================================================================

const SILENCE_PROFILES = {
  normal: {
    durationMultiplier: 1.0,
    rampOut: 0.15,       // seconds to restore after silence ends
    ambientDuck: null,   // no ambient change
  },
  anticipation: {
    durationMultiplier: 1.4,  // longer than authored silenceAfter
    rampOut: 0.35,
    ambientDuck: 0.6,         // duck ambient slightly — pressure of silence
  },
  fear: {
    durationMultiplier: 0.8,  // snappier — the break is violent, not lingering
    rampOut: 0.08,
    ambientDuck: null,
  },
  grief: {
    durationMultiplier: 1.8,
    rampOut: 1.20,
    ambientDuck: 0.4,         // ambient fades low — room carries the weight
  },
};

class SilenceEngine {
  #ae      = null;
  #active  = false;

  activate(audioEngine) {
    this.#ae     = audioEngine;
    this.#active = true;
  }

  deactivate() {
    this.#active = false;
    this.#ae     = null;
  }

  /**
   * Request a named silence type.
   * @param {"normal"|"anticipation"|"fear"|"grief"} type
   * @param {number} baseDuration  — base ms (multiplied by profile)
   */
  request(type, baseDuration = 600) {
    const ae = this.#ae;
    if (!ae?.ctx || !this.#active) return;

    const profile = SILENCE_PROFILES[type] || SILENCE_PROFILES.normal;
    const duration = Math.round(baseDuration * profile.durationMultiplier);

    ae.silence(duration);

    if (profile.ambientDuck !== null) {
      ae.fadeAllAmbient(profile.ambientDuck, 0.25);
      // Restore after silence + ramp time
      ae.addTimeout(() => {
        ae.fadeAllAmbient(1.0, profile.rampOut * 3);
      }, duration + Math.round(profile.rampOut * 1000));
    }
  }

  /** Read silenceType + silenceAfter from a beat and request silence. */
  fromBeat(beat) {
    if (!beat?.silenceType || !beat?.silenceAfter) return;
    this.request(beat.silenceType, beat.silenceAfter);
  }
}

export const silenceEngine = new SilenceEngine();

if (typeof globalThis !== "undefined") {
  globalThis.__silenceEngine = silenceEngine;
}
