export class SpatialEventScheduler {
  constructor(audioEngine, playEvent, options = {}) {
    this.audioEngine = audioEngine;
    this.playEvent = playEvent;
    this.uncertainty = options.uncertainty || 0;
    this.protectNarration = Boolean(options.protectNarration);
  }

  schedule(event, baseDelay = 0, pressure = 0) {
    if (!this.audioEngine || !event) return null;
    // In beat-narration mode (protectNarration), high-pressure events get
    // tight timing (±80ms) so approach sounds stay close to their authored beat
    // positions. Low-pressure events keep full jitter for naturalism.
    const jitterRange = (this.protectNarration && pressure > 0.2)
      ? 80
      : Math.round(180 + this.uncertainty * 650);
    const jitter = Math.round((Math.random() * 2 - 1) * jitterRange);
    const delay = Math.max(0, baseDelay + jitter);
    return this.audioEngine.addTimeout(() => {
      if (!this.protectNarration && pressure > 0.16 && Math.random() > 0.35) {
        this.audioEngine.silence(Math.round(220 + Math.random() * 520));
      }
      this.playEvent(this.protectNarration ? { ...event, protectNarration: true } : event);
    }, delay);
  }

  scheduleCluster(events = []) {
    events.forEach(event => this.schedule(event, event.delay || event.time || 0, event.triggerTension || 0));
  }
}

export default SpatialEventScheduler;
