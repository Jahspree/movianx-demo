// ===========================================================================
// AUDIO ENGINE SINGLETON
// Persistent AudioContext, true HRTF spatial sound, layered orchestration.
// Only init() from a user gesture (click). Never on mount.
// ===========================================================================

class SpatialSound {
  constructor(engine, url, options = {}) {
    const {
      volume = 0.2,
      position = { x: 0, y: 0, z: 0 },
      loop = false,
      fadeIn = 0,
      label = null,
      role = "event",
      distanceModel = "inverse",
      refDistance = 1,
      maxDistance = 60,
      rolloffFactor = 1.25,
      coneInnerAngle = 360,
      coneOuterAngle = 360,
      coneOuterGain = 0.25,
      randomStart = false,
      volumeVariation = 0,
    } = options;

    this.engine = engine;
    this.ctx = engine.ctx;
    this.url = url;
    const variation = volumeVariation ? 1 + ((Math.random() * 2 - 1) * volumeVariation) : 1;
    this.baseVolume = Math.max(0.001, volume * variation);
    this.role = role;
    this.label = label;
    this.position = { ...position };

    const ctx = this.ctx;
    const audio = new Audio(url);
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    audio.playsInline = true;
    audio.loop = loop;
    if (randomStart) {
      audio.addEventListener("loadedmetadata", () => {
        if (Number.isFinite(audio.duration) && audio.duration > 1.2) {
          audio.currentTime = Math.random() * Math.max(0, audio.duration - 0.6);
        }
      }, { once: true });
    }

    const source = ctx.createMediaElementSource(audio);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(fadeIn > 0 ? 0.001 : this.getDistanceVolume(), ctx.currentTime);
    if (fadeIn > 0) gain.gain.linearRampToValueAtTime(this.getDistanceVolume(), ctx.currentTime + fadeIn);

    const panner = new PannerNode(ctx, {
      panningModel: "HRTF",
      distanceModel,
      positionX: this.position.x,
      positionY: this.position.y,
      positionZ: this.position.z,
      orientationX: 0,
      orientationY: 0,
      orientationZ: -1,
      refDistance,
      maxDistance,
      rolloffFactor,
      coneInnerAngle,
      coneOuterAngle,
      coneOuterGain,
    });

    source.connect(gain);
    gain.connect(panner);
    panner.connect(engine.getLayerDestination(role));

    this.audio = audio;
    this.sourceNode = source;
    this.gainNode = gain;
    this.pannerNode = panner;
    engine.registerAudioElement(audio, role);
    engine.activeNodes.push(source, gain, panner);
    engine.registerLayerGain(gain, role, label);
    engine.spatialSounds.push(this);

    audio.load();
    audio.play().catch(() => {});
  }

  getDistanceVolume() {
    const { x, y, z } = this.position;
    const distance = Math.max(0.001, Math.sqrt(x * x + y * y + z * z));
    return Math.max(0.001, this.baseVolume * (1 / (1 + distance * 0.18)));
  }

  setPosition(x, y, z) {
    if (!this.ctx) return;
    this.position = { x, y, z };
    const t = this.ctx.currentTime;
    this.pannerNode.positionX.setTargetAtTime(x, t, 0.04);
    this.pannerNode.positionY.setTargetAtTime(y, t, 0.04);
    this.pannerNode.positionZ.setTargetAtTime(z, t, 0.04);
    this.setVolume(this.baseVolume);
  }

  setVolume(volume) {
    if (!this.ctx) return;
    this.baseVolume = volume;
    this.gainNode.gain.setTargetAtTime(this.getDistanceVolume(), this.ctx.currentTime, 0.04);
  }

  setLoop(loop) {
    this.audio.loop = Boolean(loop);
  }

  moveTo(to, duration = 1, fadeWithDistance = true) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const fromDistance = Math.sqrt(this.position.x ** 2 + this.position.y ** 2 + this.position.z ** 2);
    const toDistance = Math.sqrt(to.x ** 2 + to.y ** 2 + to.z ** 2);
    const behindWeight = this.position.z < 0 || to.z < 0 ? 0.08 : 0;
    const approachingWeight = toDistance < fromDistance ? Math.min(0.18, (fromDistance - toDistance) * 0.035) : 0;
    this.position = { ...to };
    this.pannerNode.positionX.linearRampToValueAtTime(to.x, t + duration);
    this.pannerNode.positionY.linearRampToValueAtTime(to.y, t + duration);
    this.pannerNode.positionZ.linearRampToValueAtTime(to.z, t + duration);
    if (fadeWithDistance) {
      this.gainNode.gain.linearRampToValueAtTime(this.getDistanceVolume(), t + duration);
    }
    if (approachingWeight || behindWeight) {
      this.engine.addExperienceImpulse({
        tension: approachingWeight + behindWeight,
        presence: Math.min(0.25, approachingWeight + 0.06),
        uncertainty: behindWeight,
      });
    }
  }
}

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.activeAudioElements = [];
    this.activeProceduralLayers = [];
    this.activeNodes = [];
    this.activeTimers = [];
    this.spatialSounds = [];
    this.labeledGains = {};   // label -> GainNode for timedSequence fadeGain targets
    this.narrationGains = []; // narration gains affected by silence()
    this.ambientGains = [];   // all ambient gain nodes for fadeAllAmbient
    this.musicGains = [];     // music gain nodes — protected from silence() and fadeAllAmbient()
    this.tensionGains = [];   // priority SFX/heartbeat/tension layers protected from silence()
    this.eventGains = [];
    this.layerGains = null;
    this.masterGain = null;
    this.tensionDistortion = null;
    this.currentTension = 0;
    this.experienceState = {
      tension: 0,
      presence: 0,
      immersion: 0,
      uncertainty: 0,
      control: 0,
    };
    this.experienceTargets = { ...this.experienceState };
    this.experienceLoop = null;
    this.fearAssets = {};
    this.physiology = {
      heartbeat: null,
      breathTimer: null,
      lastBreathAt: 0,
    };
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
      this.setupLayerBuses();
    }
    if (!this.layerGains) this.setupLayerBuses();
    if (this.ctx.state === "suspended") this.ctx.resume();
    this.startExperienceLoop();
    return this.ctx;
  }

  getContext() {
    return this.ctx;
  }

  setupLayerBuses() {
    const ctx = this.ctx;
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(1, ctx.currentTime);
    this.tensionDistortion = ctx.createWaveShaper();
    this.tensionDistortion.curve = this.makeDistortionCurve(0);
    this.tensionDistortion.oversample = "2x";

    this.layerGains = {
      narration: ctx.createGain(),
      ambient: ctx.createGain(),
      tension: ctx.createGain(),
      event: ctx.createGain(),
    };
    this.layerGains.narration.gain.setValueAtTime(1, ctx.currentTime);
    this.layerGains.ambient.gain.setValueAtTime(0.85, ctx.currentTime);
    this.layerGains.tension.gain.setValueAtTime(0.001, ctx.currentTime);
    this.layerGains.event.gain.setValueAtTime(1, ctx.currentTime);

    this.layerGains.narration.connect(this.masterGain);
    this.layerGains.ambient.connect(this.masterGain);
    this.layerGains.tension.connect(this.tensionDistortion);
    this.tensionDistortion.connect(this.masterGain);
    this.layerGains.event.connect(this.masterGain);
    this.masterGain.connect(ctx.destination);
    this.activeNodes.push(this.masterGain, this.tensionDistortion, ...Object.values(this.layerGains));
  }

  makeDistortionCurve(amount = 0) {
    const samples = 256;
    const curve = new Float32Array(samples);
    const k = amount * 70;
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + k) * x * 20 * Math.PI / 180) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  getLayerDestination(role = "event") {
    if (!this.layerGains) this.setupLayerBuses();
    if (role === "music") return this.layerGains.ambient;
    if (role === "jump" || role === "fx") return this.layerGains.event;
    return this.layerGains[role] || this.layerGains.event;
  }

  registerLayerGain(gain, role, label = null) {
    if (role === "narration") this.narrationGains.push(gain);
    else if (role === "music") this.musicGains.push(gain);
    else if (role === "ambient") this.ambientGains.push(gain);
    else if (role === "tension") this.tensionGains.push(gain);
    else this.eventGains.push(gain);
    if (label) this.labeledGains[label] = gain;
  }

  setFearAssets(assets = {}) {
    this.fearAssets = { ...this.fearAssets, ...assets };
  }

  clamp01(value) {
    return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
  }

  updateExperienceState(next = {}) {
    Object.keys(this.experienceTargets).forEach(key => {
      if (next[key] !== undefined) this.experienceTargets[key] = this.clamp01(next[key]);
    });
  }

  getExperienceState() {
    return { ...this.experienceState };
  }

  addExperienceImpulse(delta = {}) {
    const next = {};
    Object.keys(this.experienceTargets).forEach(key => {
      next[key] = this.clamp01(this.experienceTargets[key] + (delta[key] || 0));
    });
    this.updateExperienceState(next);
  }

  startExperienceLoop() {
    if (this.experienceLoop || typeof window === "undefined") return;
    this.experienceLoop = setInterval(() => {
      Object.keys(this.experienceState).forEach(key => {
        const current = this.experienceState[key];
        const target = this.experienceTargets[key];
        this.experienceState[key] = current + (target - current) * 0.18;
      });
      this.updateAudio(this.experienceState);
      this.experienceTargets.tension = this.clamp01(this.experienceTargets.tension - 0.002);
      this.experienceTargets.presence = this.clamp01(this.experienceTargets.presence - 0.0015);
      this.experienceTargets.uncertainty = this.clamp01(this.experienceTargets.uncertainty - 0.001);
    }, 80);
    this.activeTimers.push(this.experienceLoop);
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
    try {
      const source = ctx.createMediaElementSource(audio);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      source.connect(gain);
      gain.connect(this.getLayerDestination("narration"));
      this.activeNodes.push(source, gain);
      this.registerLayerGain(gain, "narration");
    } catch (e) {
      audio.volume = Math.min(volume, 1.0);
    }

    audio.load();
    audio.play().catch(() => {});
    return audio;
  }

  playAmbient(url, volume = 0.2, fadeIn = 0, label = null, role = "ambient", options = {}) {
    const ctx = this.ctx;
    if (!ctx || !url) return null;
    if (role === "ambient" || role === "music" || role === "tension") {
      const spatial = new SpatialSound(this, url, {
        volume,
        position: { x: 0, y: 0, z: role === "ambient" || role === "music" ? 6 : -2 },
        loop: true,
        fadeIn,
        label,
        role,
        refDistance: 2,
        maxDistance: 80,
        rolloffFactor: 0.8,
        randomStart: options.randomStart,
        volumeVariation: options.volumeVariation,
      });
      return { audio: spatial.audio, gainNode: spatial.gainNode, sourceNode: spatial.sourceNode, pannerNode: spatial.pannerNode, spatial };
    }
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
    gain.connect(this.getLayerDestination(role));
    this.activeNodes.push(source, gain);
    this.registerLayerGain(gain, role, label);
    audio.load();
    audio.play().catch(() => {});
    return { audio, gainNode: gain, sourceNode: source };
  }

  playEvolvingAmbient(url, options = {}) {
    const {
      volume = 0.08,
      fadeIn = 2,
      label = "evolving ambience",
      role = "ambient",
      layers = 3,
      positions = [
        { x: -3, y: 0, z: 5 },
        { x: 3, y: 0, z: 6 },
        { x: 0, y: 1, z: -4 },
      ],
    } = options;
    if (!this.ctx || !url) return [];
    const count = Math.max(2, Math.min(3, layers));
    const created = [];
    for (let i = 0; i < count; i++) {
      const spatial = new SpatialSound(this, url, {
        volume: volume * (i === 0 ? 1 : 0.58),
        position: positions[i % positions.length],
        loop: true,
        fadeIn: fadeIn + i * 0.8,
        label: `${label} layer ${i + 1}`,
        role,
        refDistance: 2,
        maxDistance: 90,
        rolloffFactor: 0.75,
        randomStart: true,
        volumeVariation: 0.1,
      });
      created.push({ audio: spatial.audio, gainNode: spatial.gainNode, pannerNode: spatial.pannerNode, spatial });
    }
    this.addInterval(() => {
      created.forEach((entry, idx) => {
        const target = volume * (idx === 0 ? 0.88 : 0.42 + Math.random() * 0.22);
        this.fadeGain(entry.gainNode, target, 4 + Math.random() * 3);
      });
    }, 9000 + Math.random() * 4000);
    return created;
  }

  playSpatial(url, volume = 0.2, position = { x: 0, y: 0, z: 0 }, loop = false, fadeIn = 0, label = null, role = "tension") {
    const ctx = this.ctx;
    if (!ctx || !url) return null;
    const spatial = new SpatialSound(this, url, { volume, position, loop, fadeIn, label, role });
    return { audio: spatial.audio, gainNode: spatial.gainNode, pannerNode: spatial.pannerNode, sourceNode: spatial.sourceNode, spatial };
  }

  playSpatialMoving(url, volume, from, to, duration, loop = false, fadeWithDistance = false, label = null, role = "tension") {
    const ctx = this.ctx;
    if (!ctx || !url) return null;
    const spatial = new SpatialSound(this, url, { volume, position: from, loop, label, role });
    spatial.moveTo(to, duration, fadeWithDistance);
    return { audio: spatial.audio, gainNode: spatial.gainNode, pannerNode: spatial.pannerNode, sourceNode: spatial.sourceNode, spatial };
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
      const panner = new PannerNode(ctx, {
        panningModel: "HRTF",
        distanceModel: "inverse",
        positionX: position.x,
        positionY: position.y,
        positionZ: position.z,
        orientationX: 0,
        orientationY: 0,
        orientationZ: -1,
        refDistance: 1,
        maxDistance: 60,
        rolloffFactor: 1.1,
      });
      masterGain.connect(panner);
      panner.connect(this.getLayerDestination(role));
      this.activeNodes.push(panner);
      endNode = panner;
    } else {
      masterGain.connect(this.getLayerDestination(role));
    }

    this.activeNodes.push(masterGain);
    this.registerLayerGain(masterGain, role, label);
    this.activeProceduralLayers.push({ role, label: label || type, type });

    const nodes = [];

    if (type === "drone" || type === "room_tone" || type === "wind_bed") {
      const freq = frequency || (type === "room_tone" ? 50 : 40);
      const osc = ctx.createOscillator();
      osc.type = waveform;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(freq * 0.92, ctx.currentTime + 11);
      osc.frequency.linearRampToValueAtTime(freq * 1.06, ctx.currentTime + 29);
      osc.frequency.linearRampToValueAtTime(freq * 0.97, ctx.currentTime + 47);
      if (type === "wind_bed") {
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.045, ctx.currentTime);
        lfoGain.gain.setValueAtTime(freq * 0.18, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();
        nodes.push(lfo);
        this.activeNodes.push(lfoGain);
      }
      osc.connect(masterGain);
      osc.start();
      nodes.push(osc);
    }

    if (type === "insects") {
      [3100, 4200, 5300].forEach((base, i) => {
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const ig = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(base + Math.random() * 400, ctx.currentTime);
        lfo.frequency.setValueAtTime(5 + i * 2.7, ctx.currentTime);
        lfoGain.gain.setValueAtTime(0.015 + i * 0.004, ctx.currentTime);
        ig.gain.setValueAtTime(volume * (0.16 + i * 0.08), ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(ig.gain);
        osc.connect(ig);
        ig.connect(masterGain);
        osc.start();
        lfo.start();
        nodes.push(osc, lfo);
        this.activeNodes.push(lfoGain, ig);
      });
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

  updateTension(level = 0) {
    if (!this.ctx || !this.layerGains) return;
    const clamped = Math.max(0, Math.min(1, level));
    this.currentTension = clamped;
    this.updateExperienceState({ tension: clamped });
  }

  updateAudio(state = this.experienceState) {
    if (!this.ctx || !this.layerGains) return;
    const clamped = this.clamp01(state.tension);
    this.currentTension = clamped;
    const t = this.ctx.currentTime;
    const presence = this.clamp01(state.presence);
    const immersion = this.clamp01(state.immersion);
    const uncertainty = this.clamp01(state.uncertainty);
    const control = this.clamp01(state.control);
    const tensionVolume = clamped < 0.2 ? 0.001 : clamped < 0.5 ? 0.08 : clamped < 0.8 ? 0.24 : 0.42;
    const ambientVolume = Math.max(0.42, (clamped < 0.5 ? 0.9 : clamped < 0.8 ? 0.72 : 0.58) + immersion * 0.08 - uncertainty * 0.08);
    const eventVolume = Math.min(1.25, 0.9 + presence * 0.25 + control * 0.1);
    this.layerGains.ambient.gain.setTargetAtTime(ambientVolume, t, 0.8);
    this.layerGains.tension.gain.setTargetAtTime(tensionVolume, t, 0.6);
    this.layerGains.event.gain.setTargetAtTime(eventVolume, t, 0.25);
    this.tensionDistortion.curve = this.makeDistortionCurve(clamped >= 0.95 ? 0.35 : clamped >= 0.8 ? 0.16 : 0);
    this.tensionGains.forEach(g => {
      const target = clamped < 0.2 ? 0.001 : Math.max(0.02, clamped * 0.32);
      this.fadeGain(g, target, 1.2);
    });
    this.updatePhysiology(state);
  }

  updatePhysiology(state) {
    const tension = this.clamp01(state.tension);
    const presence = this.clamp01(state.presence);
    if (tension > 0.7 && this.fearAssets.heartbeat && !this.physiology.heartbeat) {
      this.physiology.heartbeat = this.playSpatial(this.fearAssets.heartbeat, 0.08, { x: 0, y: 0, z: 0 }, true, 1.5, "physiology heartbeat", "tension");
    }
    const hbGain = this.physiology.heartbeat?.gainNode;
    if (hbGain) {
      const target = tension > 0.7 ? Math.min(0.65, 0.08 + (tension - 0.7) * 1.9) : 0.001;
      this.fadeGain(hbGain, target, 0.5);
    }
    if (tension > 0.85 && this.fearAssets.breath && typeof window !== "undefined") {
      const now = performance.now();
      const breathGap = 5000 + Math.random() * 3000;
      if (now - this.physiology.lastBreathAt > breathGap) {
        this.physiology.lastBreathAt = now;
        const side = Math.random() > 0.5 ? 1 : -1;
        this.playSpatial(this.fearAssets.breath, 0.04 + tension * 0.05, { x: side * (0.12 + presence * 0.18), y: 0, z: -0.2 }, false, 0, "single fear breath after pause", "event");
      }
    }
  }

  silence(duration, options = {}) {
    if (!this.ctx || this._silenced) return;
    this._silenced = true;
    // Silence is a dramatic narration beat only. Ambient and tension remain alive.
    this._silenceRestore = this.narrationGains.map(g => ({
      node: g,
      value: g.gain.value,
    }));
    this.narrationGains.forEach(g => {
      g.gain.cancelScheduledValues(this.ctx.currentTime);
      g.gain.setValueAtTime(0.001, this.ctx.currentTime);
    });
    const tid = setTimeout(() => {
      if (!this._silenced) return;
      this._silenceRestore.forEach(({ node, value }) => {
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
    this.activeProceduralLayers = [];

    // Stop oscillators, disconnect nodes
    this.activeNodes.forEach(n => {
      try { if (n.stop) n.stop(); } catch (e) {}
      try { n.disconnect(); } catch (e) {}
    });
    this.activeNodes = [];
    this.spatialSounds = [];

    // Clear labels
    this.labeledGains = {};
    this.narrationGains = [];
    this.ambientGains = [];
    this.musicGains = [];
    this.tensionGains = [];
    this.eventGains = [];
    this.layerGains = null;
    this.masterGain = null;
    this.tensionDistortion = null;
    this.currentTension = 0;
    this.experienceLoop = null;
    this.experienceState = { tension: 0, presence: 0, immersion: 0, uncertainty: 0, control: 0 };
    this.experienceTargets = { ...this.experienceState };
    this.physiology = { heartbeat: null, breathTimer: null, lastBreathAt: 0 };
    this._silenced = false;
    this._silenceRestore = [];

  }

  getActiveLayers() {
    const byRole = {};
    this.activeAudioElements.forEach(({ audio, role }) => {
      if (!byRole[role]) byRole[role] = [];
      byRole[role].push({
        src: audio.currentSrc || audio.src || "procedural",
        paused: audio.paused,
        loop: audio.loop,
      });
    });
    this.activeProceduralLayers.forEach(({ role, label, type }) => {
      if (!byRole[role]) byRole[role] = [];
      byRole[role].push({ src: `procedural:${type}`, label, paused: false, loop: true });
    });
    if (typeof window !== "undefined") {
      window.activeAudioLayers = byRole;
    }
    return byRole;
  }

  cleanup() {
    this.stopAll();
  }
}

// Singleton
const audioEngine = typeof window !== "undefined" ? new AudioEngine() : null;
export default audioEngine;
