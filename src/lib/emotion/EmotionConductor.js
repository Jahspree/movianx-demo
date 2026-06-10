// ===========================================================================
// EmotionConductor — subscribes to EmotionEngine and drives AudioEngine
//
// This is the conductor's podium. Every time tension changes, it translates
// the 0-100 integer into concrete audio adjustments:
//
//   Heartbeat  → volume bands + playbackRate (BPM)
//   Atmosphere → filter frequency sweep (warm ↔ harsh)
//   Drone gain → labeled ambient layers scale with tension
//   Tension bus→ AudioEngine experienceState.tension stays in sync
//
// Usage:
//   import { emotionConductor } from "./EmotionConductor";
//   emotionConductor.activate(audioEngine);   // call once after AudioContext opens
//   emotionConductor.deactivate();            // call on stopAll / experience exit
// ===========================================================================

import { emotionEngine } from "./EmotionEngine.js";

// Tension → heartbeat playback rate
//   Natural BPM of heartbeat.mp3 ≈ 60 BPM (1.0x)
//   Each band targets a realistic physiological heart rate
const HEARTBEAT_RATE_BANDS = [
  { maxTension: 20,  rate: 0.78 }, // ~47 BPM  — dormant, resting
  { maxTension: 40,  rate: 0.92 }, // ~55 BPM  — slow dread
  { maxTension: 70,  rate: 1.10 }, // ~66 BPM  — elevated
  { maxTension: 90,  rate: 1.38 }, // ~83 BPM  — racing
  { maxTension: 100, rate: 1.72 }, // ~103 BPM — near panic
];

// Tension → heartbeat volume
const HEARTBEAT_VOLUME_BANDS = [
  { maxTension: 20,  volume: 0.001 }, // barely alive — don't play yet
  { maxTension: 40,  volume: 0.06  }, // barely audible
  { maxTension: 70,  volume: 0.18  }, // present but not dominant
  { maxTension: 90,  volume: 0.38  }, // prominent
  { maxTension: 100, volume: 0.62  }, // overwhelming
];

// Tension → atmosphere filter cutoff (Hz)
//   Low tension: warm/muffled. High tension: bright/harsh/exposed.
const ATMOSPHERE_FILTER_BANDS = [
  { maxTension: 20,  hz: 700  },
  { maxTension: 40,  hz: 1100 },
  { maxTension: 70,  hz: 1900 },
  { maxTension: 90,  hz: 2800 },
  { maxTension: 100, hz: 4200 },
];

function pickBand(bands, tension) {
  for (const band of bands) {
    if (tension <= band.maxTension) return band;
  }
  return bands[bands.length - 1];
}

class EmotionConductor {
  #audioEngine  = null;
  #unsub        = null;
  #lastTension  = -1;

  activate(audioEngine) {
    if (this.#unsub) this.deactivate(); // re-activation safe
    this.#audioEngine = audioEngine;
    this.#unsub = emotionEngine.subscribe(state => this.#onStateChange(state));
    // Sync immediately with current engine state
    this.#onStateChange(emotionEngine.getState());
  }

  deactivate() {
    if (this.#unsub) { this.#unsub(); this.#unsub = null; }
    this.#audioEngine = null;
    this.#lastTension = -1;
  }

  // ── Internal ──────────────────────────────────────────────────────────────

  #onStateChange(state) {
    const ae = this.#audioEngine;
    if (!ae?.ctx) return;

    const t = state.tension; // 0-100
    if (t === this.#lastTension) return;
    this.#lastTension = t;

    const t01 = t / 100;

    // 1. Keep AudioEngine experienceState in sync
    ae.updateExperienceState({
      tension:     t01,
      presence:    t01 > 0.7 ? 0.42 + (t01 - 0.7) * 0.6  : 0.22,
      uncertainty: t01 > 0.45 ? 0.18 + (t01 - 0.45) * 0.6 : 0.18,
    });

    // 2. Heartbeat volume
    const hbVolBand = pickBand(HEARTBEAT_VOLUME_BANDS, t);
    const hbGain = ae.physiology?.heartbeat?.gainNode;
    if (hbGain) ae.fadeGain(hbGain, hbVolBand.volume, 0.6);

    // 3. Heartbeat BPM (playbackRate)
    const hbRateBand = pickBand(HEARTBEAT_RATE_BANDS, t);
    ae.setHeartbeatPlaybackRate(hbRateBand.rate);

    // 4. Atmosphere filter sweep
    const filterBand = pickBand(ATMOSPHERE_FILTER_BANDS, t);
    // Ramp time: fast at high tension (snappy), slow at low (gradual)
    const rampTime = t > 70 ? 0.4 : t > 40 ? 0.9 : 1.8;
    ae.setAtmosphereFilterFreq(filterBand.hz, rampTime);

    // 5. Scale labeled drone gains by tension tier
    //    Drone nodes fade up as tension rises — atmosphere intensifies
    this.#scaleDroneGains(ae, t01);
  }

  #scaleDroneGains(ae, t01) {
    // Drone labels follow the pattern "*_drone*" — scale them proportionally
    // Low tension: drones at base volume. High tension: +40% presence boost.
    const scale = 1 + t01 * 0.4;
    Object.entries(ae.labeledGains || {}).forEach(([label, gainNode]) => {
      if (!label.includes("drone")) return;
      const base = gainNode.__conductorBase;
      if (base === undefined) {
        // First time we see this node — snapshot its current value as base
        gainNode.__conductorBase = gainNode.gain.value;
        return;
      }
      const target = Math.min(0.55, base * scale);
      ae.fadeGain(gainNode, target, 1.0);
    });
  }
}

export const emotionConductor = new EmotionConductor();

if (typeof globalThis !== "undefined") {
  globalThis.__emotionConductor = emotionConductor;
}
