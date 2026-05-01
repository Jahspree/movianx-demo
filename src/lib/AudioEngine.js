// ===========================================================================
// AUDIO ENGINE SINGLETON
// Persistent AudioContext, tracks all nodes, first-class cleanup.
// Only init() from a user gesture (click). Never on mount.
// ===========================================================================

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.activeAudioElements = [];
    this.activeNodes = [];
    this.activeTimers = [];
    this.labeledGains = {};   // label -> GainNode for timedSequence fadeGain targets
    this.ambientGains = [];   // all ambient gain nodes for fadeAllAmbient
    this.musicGains = [];     // music gain nodes — protected from silence() and fadeAllAmbient()
    this.tensionGains = [];   // priority SFX/heartbeat/tension layers protected from silence()
    this._silenced = false;
    this._silenceRestore = [];
  }

  registerAudioElement(audio, role = "fx") {
    const entry = { audio, role };
    this.activeAudioElements.push(entry);
    return entry;
  }

  // --- Lifecycle -----------------------------------------------------------

  init() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  getContext() {
    return this.ctx;
  }

  // --- File-based playback -------------------------------------------------

  playNarration(url, volume = 1.0) {
    const ctx = this.ctx;
    if (!ctx || !url) return null;
    const audio = new Audio(url);
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    audio.playsInline = true;
    this.registerAudioElement(audio, "narration");

    // Route through gain node for volume control above 1.0
    if (volume !== 1.0) {
      try {
        const source = ctx.createMediaElementSource(audio);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        source.connect(gain);
        gain.connect(ctx.destination);
        this.activeNodes.push(source, gain);
      } catch (e) {
        audio.volume = Math.min(volume, 1.0);
      }
    }

    audio.load();
    audio.play().catch(() => {});
    return audio;
  }

  playAmbient(url, volume = 0.2, fadeIn = 0, label = null, role = "ambient") {
    const ctx = this.ctx;
    if (!ctx || !url) return null;
    const audio = new Audio(url);
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    audio.playsInline = true;
    audio.loop = true;
    this.registerAudioElement(audio, role);

    let source;
    try {
      source = ctx.createMediaElementSource(audio);
    } catch (e) {
      // Already connected — just play
      audio.volume = volume;
      audio.play().catch(() => {});
      return { audio, gainNode: null };
    }
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(fadeIn > 0 ? 0.001 : volume, ctx.currentTime);
    if (fadeIn > 0) {
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + fadeIn);
    }
    source.connect(gain);
    gain.connect(ctx.destination);
    this.activeNodes.push(source, gain);
    if (role === "music") {
      this.musicGains.push(gain);
    } else if (role === "tension") {
      this.tensionGains.push(gain);
    } else {
      this.ambientGains.push(gain);
    }
    if (label) this.labeledGains[label] = gain;
    audio.load();
    audio.play().catch(() => {});
    return { audio, gainNode: gain, sourceNode: source };
  }

  playSpatial(url, volume = 0.2, position = { x: 0, y: 0, z: 0 }, loop = false, fadeIn = 0, label = null, role = "tension") {
    const ctx = this.ctx;
    if (!ctx || !url) return null;
    const audio = new Audio(url);
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    audio.playsInline = true;
    audio.loop = loop;
    this.registerAudioElement(audio, role);

    let source;
    try {
      source = ctx.createMediaElementSource(audio);
    } catch (e) {
      audio.volume = volume;
      audio.play().catch(() => {});
      return { audio, gainNode: null };
    }
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(fadeIn > 0 ? 0.001 : volume, ctx.currentTime);
    if (fadeIn > 0) gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + fadeIn);

    const panner = ctx.createPanner();
    panner.panningModel = "HRTF";
    panner.distanceModel = "inverse";
    panner.refDistance = 1;
    panner.maxDistance = 50;
    panner.rolloffFactor = 1;
    panner.positionX.setValueAtTime(position.x, ctx.currentTime);
    panner.positionY.setValueAtTime(position.y, ctx.currentTime);
    panner.positionZ.setValueAtTime(position.z, ctx.currentTime);

    source.connect(gain);
    gain.connect(panner);
    panner.connect(ctx.destination);
    this.activeNodes.push(source, gain, panner);
    if (label) this.labeledGains[label] = gain;
    if (role === "tension") this.tensionGains.push(gain);
    audio.load();
    audio.play().catch(() => {});
    return { audio, gainNode: gain, pannerNode: panner, sourceNode: source };
  }

  playSpatialMoving(url, volume, from, to, duration, loop = false, fadeWithDistance = false, label = null, role = "tension") {
    const ctx = this.ctx;
    if (!ctx || !url) return null;
    const audio = new Audio(url);
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    audio.playsInline = true;
    audio.loop = loop;
    this.registerAudioElement(audio, role);

    let source;
    try {
      source = ctx.createMediaElementSource(audio);
    } catch (e) {
      audio.volume = volume;
      audio.play().catch(() => {});
      return { audio };
    }
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);

    const panner = ctx.createPanner();
    panner.panningModel = "HRTF";
    panner.distanceModel = "inverse";
    panner.refDistance = 1;
    panner.maxDistance = 50;
    panner.rolloffFactor = 1;

    panner.positionX.setValueAtTime(from.x, ctx.currentTime);
    panner.positionY.setValueAtTime(from.y, ctx.currentTime);
    panner.positionZ.setValueAtTime(from.z, ctx.currentTime);
    panner.positionX.linearRampToValueAtTime(to.x, ctx.currentTime + duration);
    panner.positionY.linearRampToValueAtTime(to.y, ctx.currentTime + duration);
    panner.positionZ.linearRampToValueAtTime(to.z, ctx.currentTime + duration);

    if (fadeWithDistance) {
      const dist = Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2 + (to.z - from.z) ** 2);
      const endVol = Math.max(0.001, volume * (1 / (1 + dist * 0.15)));
      gain.gain.linearRampToValueAtTime(endVol, ctx.currentTime + duration);
    }

    source.connect(gain);
    gain.connect(panner);
    panner.connect(ctx.destination);
    this.activeNodes.push(source, gain, panner);
    if (label) this.labeledGains[label] = gain;
    if (role === "tension") this.tensionGains.push(gain);
    audio.load();
    audio.play().catch(() => {});
    return { audio, gainNode: gain, pannerNode: panner, sourceNode: source };
  }

  // --- Procedural sounds ---------------------------------------------------

  playProcedural(type, params = {}) {
    const ctx = this.ctx;
    if (!ctx) return null;
    const { volume = 0.05, frequency, waveform = "sine", position, label, fadeIn = 0, role = "ambient" } = params;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(fadeIn > 0 ? 0.001 : volume, ctx.currentTime);
    if (fadeIn > 0) masterGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + fadeIn);

    let endNode = masterGain;

    // Optional spatial positioning
    if (position) {
      const panner = ctx.createPanner();
      panner.panningModel = "HRTF";
      panner.distanceModel = "inverse";
      panner.refDistance = 1;
      panner.maxDistance = 50;
      panner.positionX.setValueAtTime(position.x, ctx.currentTime);
      panner.positionY.setValueAtTime(position.y, ctx.currentTime);
      panner.positionZ.setValueAtTime(position.z, ctx.currentTime);
      masterGain.connect(panner);
      panner.connect(ctx.destination);
      this.activeNodes.push(panner);
      endNode = panner;
    } else {
      masterGain.connect(ctx.destination);
    }

    this.activeNodes.push(masterGain);
    if (label) this.labeledGains[label] = masterGain;
    if (role === "tension") this.tensionGains.push(masterGain);
    else if (role === "music") this.musicGains.push(masterGain);
    else this.ambientGains.push(masterGain);

    const nodes = [];

    if (type === "drone" || type === "room_tone") {
      const freq = frequency || (type === "room_tone" ? 50 : 40);
      const osc = ctx.createOscillator();
      osc.type = waveform;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(freq * 0.95, ctx.currentTime + 5);
      osc.frequency.linearRampToValueAtTime(freq * 1.02, ctx.currentTime + 10);
      osc.frequency.linearRampToValueAtTime(freq, ctx.currentTime + 15);
      osc.connect(masterGain);
      osc.start();
      nodes.push(osc);
    }

    if (type === "tinnitus") {
      const freq = frequency || 4000;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      const tg = ctx.createGain();
      tg.gain.setValueAtTime(0.5, ctx.currentTime);
      osc.connect(tg);
      tg.connect(masterGain);
      osc.start();
      nodes.push(osc);
      this.activeNodes.push(tg);
    }

    if (type === "birdsong") {
      // Quick chirp burst
      const osc = ctx.createOscillator();
      osc.type = "sine";
      const chirpFreq = 2000 + Math.random() * 2000;
      osc.frequency.setValueAtTime(chirpFreq, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(chirpFreq * 1.3, ctx.currentTime + 0.05);
      osc.frequency.linearRampToValueAtTime(chirpFreq * 0.8, ctx.currentTime + 0.1);
      const eg = ctx.createGain();
      eg.gain.setValueAtTime(volume, ctx.currentTime);
      eg.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(eg);
      eg.connect(endNode === masterGain ? ctx.destination : endNode);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
      nodes.push(osc);
      this.activeNodes.push(eg);
      return { nodes, gainNode: masterGain };
    }

    if (type === "bells") {
      [523, 659, 784].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.3);
        const bg = ctx.createGain();
        bg.gain.setValueAtTime(volume * 0.6, ctx.currentTime + i * 0.3);
        bg.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.3 + 2);
        osc.connect(bg);
        bg.connect(endNode === masterGain ? ctx.destination : endNode);
        osc.start(ctx.currentTime + i * 0.3);
        osc.stop(ctx.currentTime + i * 0.3 + 2);
        nodes.push(osc);
        this.activeNodes.push(bg);
      });
      return { nodes, gainNode: masterGain };
    }

    if (type === "crying") {
      // Wavering high-pitched tone to simulate distant crying
      const osc = ctx.createOscillator();
      osc.type = "sine";
      const base = 600 + Math.random() * 200;
      osc.frequency.setValueAtTime(base, ctx.currentTime);
      // Wavering
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(5, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(80, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();
      osc.connect(masterGain);
      osc.start();
      nodes.push(osc, lfo);
      this.activeNodes.push(lfoGain);
    }

    if (type === "rush") {
      // Filtered noise via oscillators for blood rushing
      const osc1 = ctx.createOscillator();
      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(80, ctx.currentTime);
      const osc2 = ctx.createOscillator();
      osc2.type = "sawtooth";
      osc2.frequency.setValueAtTime(83, ctx.currentTime);
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(200, ctx.currentTime);
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);
      osc1.start();
      osc2.start();
      nodes.push(osc1, osc2);
      this.activeNodes.push(filter);
    }

    nodes.forEach(n => this.activeNodes.push(n));
    return { nodes, gainNode: masterGain };
  }

  // --- Gain control --------------------------------------------------------

  fadeGain(gainNode, toValue, duration) {
    if (!gainNode || !this.ctx) return;
    const t = this.ctx.currentTime;
    gainNode.gain.cancelScheduledValues(t);
    gainNode.gain.setValueAtTime(gainNode.gain.value, t);
    gainNode.gain.linearRampToValueAtTime(Math.max(0.001, toValue), t + duration);
  }

  fadeAllAmbient(toValue, duration) {
    this.ambientGains.forEach(g => this.fadeGain(g, toValue, duration));
  }

  silence(duration, options = {}) {
    if (!this.ctx || this._silenced) return;
    this._silenced = true;
    const floor = Math.max(0.001, options.floor ?? 0.025);
    const includeTension = Boolean(options.includeTension);
    // Store current ambient gains, duck to a low bed instead of killing the room.
    this._silenceRestore = this.ambientGains.map(g => ({
      node: g,
      value: g.gain.value,
    }));
    this.ambientGains.forEach(g => {
      g.gain.cancelScheduledValues(this.ctx.currentTime);
      g.gain.setValueAtTime(floor, this.ctx.currentTime);
    });
    // Keep narration, score, and tension layers alive; only mute unclassified support layers.
    this.activeAudioElements.forEach(({ audio, role }) => {
      if (role === "narration" || role === "music" || (!includeTension && role === "tension")) return;
      if (!audio.paused) {
        this._silenceRestore.push({ audio, volume: audio.volume });
        audio.volume = 0;
      }
    });
    const tid = setTimeout(() => {
      if (!this._silenced) return;
      this._silenceRestore.forEach(({ node, value, audio, volume }) => {
        if (audio) {
          try { audio.volume = volume; } catch (e) {}
          return;
        }
        try {
          node.gain.setValueAtTime(value, this.ctx.currentTime);
        } catch (e) {}
      });
      this._silenced = false;
      this._silenceRestore = [];
    }, duration);
    this.activeTimers.push(tid);
  }

  // --- Timer management ----------------------------------------------------

  addTimeout(fn, ms) {
    const id = setTimeout(fn, ms);
    this.activeTimers.push(id);
    return id;
  }

  addInterval(fn, ms) {
    const id = setInterval(fn, ms);
    this.activeTimers.push(id);
    return id;
  }

  // --- Cleanup -------------------------------------------------------------

  stopAll() {
    // Clear timers
    this.activeTimers.forEach(id => { clearTimeout(id); clearInterval(id); });
    this.activeTimers = [];

    // Stop and disconnect audio elements
    this.activeAudioElements.forEach(({ audio }) => {
      try { audio.pause(); audio.currentTime = 0; audio.src = ""; } catch (e) {}
    });
    this.activeAudioElements = [];

    // Stop oscillators, disconnect nodes
    this.activeNodes.forEach(n => {
      try { if (n.stop) n.stop(); } catch (e) {}
      try { n.disconnect(); } catch (e) {}
    });
    this.activeNodes = [];

    // Clear labels
    this.labeledGains = {};
    this.ambientGains = [];
    this.musicGains = [];
    this.tensionGains = [];
    this._silenced = false;
    this._silenceRestore = [];

    // Cancel speech synthesis
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  cleanup() {
    this.stopAll();
  }
}

// Singleton
const audioEngine = typeof window !== "undefined" ? new AudioEngine() : null;
export default audioEngine;
