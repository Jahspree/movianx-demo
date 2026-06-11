// ===========================================================================
// BreathingSystem — first-class breathing component for character presence
//
// Breathing is continuous, self-scheduling, and mode-driven.
// Tension drives mode selection. Reactions can override with hold/release.
//
// Modes:
//   slow    — barely present, infrequent (tension 0-30)
//   uneven  — irregular rhythm, building dread (tension 31-55)
//   shallow — fast and quiet, controlled panic (tension 56-75)
//   panic   — rapid and desperate, close (tension 76-100)
//   held    — no breath sounds; gasp fires on release
//
// Usage:
//   breathingSystem.activate(audioEngine, assetResolver);
//   breathingSystem.setMode("panic");
//   breathingSystem.holdBreath(2000);      // suppress for 2s, then gasp
//   breathingSystem.releaseHold(true);     // release + optional gasp
//   breathingSystem.deactivate();
// ===========================================================================

// interval: ms between breath events (jitter ±25% applied)
// volume:   spatial gain
// rate:     playbackRate on Audio element (0.8 = slower/deeper, 1.4 = rapid)
// pos:      3D spatial position relative to listener
const MODES = {
  slow:   { interval: 5200, volume: 0.020, rate: 0.82, pos: { x: -0.06, y: 0, z: -0.22 } },
  uneven: { interval: 2800, volume: 0.035, rate: 0.91, pos: { x: -0.14, y: 0, z: -0.14 } },
  shallow:{ interval: 1600, volume: 0.052, rate: 1.08, pos: { x: -0.18, y: 0, z: -0.08 } },
  panic:  { interval:  640, volume: 0.082, rate: 1.42, pos: { x: -0.10, y: 0, z: -0.04 } },
};

// Tension → breathing mode
function tensionToMode(tension) {
  if (tension >= 76) return "panic";
  if (tension >= 56) return "shallow";
  if (tension >= 31) return "uneven";
  return "slow";
}

class BreathingSystem {
  #ae          = null;
  #ar          = null;
  #mode        = "slow";
  #held        = false;
  #holdTimer   = null;
  #breathTimer = null;
  #active      = false;

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  activate(audioEngine, assetResolver) {
    this.#ae     = audioEngine;
    this.#ar     = assetResolver;
    this.#active = true;
    this.#held   = false;
    this.#scheduleNext();
  }

  deactivate() {
    this.#active = false;
    this.#clearTimers();
    this.#ae = null;
    this.#ar = null;
  }

  isActive() { return this.#active; }

  // ── Mode control ──────────────────────────────────────────────────────────

  /** Set breathing mode. Ignored if breath is currently held. */
  setMode(mode) {
    if (!MODES[mode]) return;
    this.#mode = mode;
  }

  /** Sync mode from current tension value. */
  syncToTension(tension) {
    if (!this.#held) this.setMode(tensionToMode(tension));
  }

  /** Interrupt breathing for `duration` ms. Optionally gasp on release. */
  holdBreath(duration, gaspOnRelease = true) {
    this.#held = true;
    this.#clearBreathTimer();
    if (this.#holdTimer) { clearTimeout(this.#holdTimer); this.#holdTimer = null; }

    if (Number.isFinite(duration) && duration > 0) {
      this.#holdTimer = setTimeout(() => {
        this.#holdTimer = null;
        this.releaseHold(gaspOnRelease);
      }, duration);
    }
  }

  /** Release hold. gasp=true fires a single prominent breath immediately. */
  releaseHold(gasp = true) {
    if (this.#holdTimer) { clearTimeout(this.#holdTimer); this.#holdTimer = null; }
    this.#held = false;
    if (gasp) this.#playBreath(this.#mode, 1.7); // volume boost for gasp
    this.#scheduleNext();
  }

  /** Fire one breath immediately regardless of current schedule. */
  breathOnce(volumeScale = 1.0) {
    if (!this.#held) this.#playBreath(this.#mode, volumeScale);
  }

  isHeld() { return this.#held; }
  getMode() { return this.#mode; }

  // ── Internal ──────────────────────────────────────────────────────────────

  #scheduleNext() {
    if (!this.#active || this.#held) return;
    this.#clearBreathTimer();

    const params = MODES[this.#mode];
    if (!params) return;

    const interval = params.interval * (0.75 + Math.random() * 0.5);
    this.#breathTimer = setTimeout(() => {
      this.#breathTimer = null;
      if (!this.#active || this.#held) return;
      this.#playBreath(this.#mode, 1.0);
      this.#scheduleNext();
    }, interval);
  }

  #playBreath(mode, volumeScale = 1.0) {
    const ae = this.#ae;
    const ar = this.#ar;
    if (!ae?.ctx || !ar) return;

    const params = MODES[mode] || MODES.slow;
    const url = ar.getAudio("breathing_raspy");
    if (!url) return;

    const result = ae.playSpatial(
      url,
      params.volume * volumeScale,
      params.pos,
      false, 0,
      "sarah_breath",
      "tension"
    );
    // Adjust playback speed — changes apparent breath rhythm & depth
    if (result?.audio) result.audio.playbackRate = params.rate;
  }

  #clearBreathTimer() {
    if (this.#breathTimer) { clearTimeout(this.#breathTimer); this.#breathTimer = null; }
  }

  #clearTimers() {
    this.#clearBreathTimer();
    if (this.#holdTimer) { clearTimeout(this.#holdTimer); this.#holdTimer = null; }
  }
}

export const breathingSystem = new BreathingSystem();
export { tensionToMode as breathingTensionToMode };

if (typeof globalThis !== "undefined") {
  globalThis.__breathingSystem = breathingSystem;
}
