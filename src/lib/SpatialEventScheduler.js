export class SpatialEventScheduler {
  constructor(audioEngine, playEvent, options = {}) {
    this.audioEngine = audioEngine;
    this.playEvent = playEvent;
    this.uncertainty = options.uncertainty || 0;
  }

  schedule(event, baseDelay = 0, pressure = 0) {
    if (!this.audioEngine || !event) return null;
    const jitter = Math.round((Math.random() * 2 - 1) * (180 + this.uncertainty * 650));
    const delay = Math.max(0, baseDelay + jitter);
    return this.audioEngine.addTimeout(() => {
      if (pressure > 0.16 && Math.random() > 0.35) {
        this.audioEngine.silence(Math.round(220 + Math.random() * 520));
      }
      this.playEvent(event);
    }, delay);
  }

  scheduleCluster(events = []) {
    events.forEach(event => this.schedule(event, event.delay || event.time || 0, event.triggerTension || 0));
  }
}

export default SpatialEventScheduler;
