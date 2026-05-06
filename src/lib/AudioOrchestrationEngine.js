const EMOTIONS = ["fear", "sadness", "joy", "anger", "suspense", "neutral"];
const GENRES = ["horror", "thriller", "drama", "romance", "action"];

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function clampIntensity(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 1;
  return Math.max(1, Math.min(3, Math.round(numeric)));
}

function normalize(value = "") {
  return String(value || "").toLowerCase().trim();
}

function stableHash(input = "") {
  let hash = 2166136261;
  const text = String(input);
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pickDeterministic(items, seed, count) {
  return [...items]
    .map((item, index) => ({ item, score: stableHash(`${seed}:${index}:${item.id || item.sound || item.label}`) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, count)
    .map(entry => entry.item);
}

function getEmotion(sceneProfile = {}) {
  const emotion = normalize(sceneProfile.emotionLabel || sceneProfile.emotion || sceneProfile.mood);
  return EMOTIONS.includes(emotion) ? emotion : "neutral";
}

function getGenre(sceneProfile = {}) {
  const genre = normalize(sceneProfile.genre);
  return GENRES.includes(genre) ? genre : "drama";
}

function getLocation(sceneProfile = {}) {
  const source = normalize(sceneProfile.environment || sceneProfile.location || sceneProfile.requiredAmbience);
  if (source.includes("home") || source.includes("indoor") || source.includes("room") || source.includes("laboratory")) return "interior";
  if (source.includes("outdoor") || source.includes("exterior") || source.includes("forest") || source.includes("rural") || source.includes("lake") || source.includes("farm")) return "outdoor";
  if (source.includes("city") || source.includes("urban")) return "urban";
  if (source.includes("arctic") || source.includes("ice")) return "cold exterior";
  if (source.includes("void")) return "void";
  return "interior";
}

function buildNarrationStyle({ emotion, intensity, pacing }) {
  if (emotion === "fear" || emotion === "suspense") {
    return {
      delivery: intensity >= 3 ? "urgent human reaction" : "quiet wary reaction",
      sentenceShape: intensity >= 3 ? "short fragmented thoughts" : "short natural sentences",
      pauseStrategy: intensity >= 3 ? "few pauses, forward pressure" : "sentence-boundary pauses only",
    };
  }
  if (emotion === "sadness") {
    return {
      delivery: "restrained grief",
      sentenceShape: "longer flowing sentences",
      pauseStrategy: "soft sentence-boundary pauses",
    };
  }
  if (emotion === "joy") {
    return {
      delivery: "warm and present",
      sentenceShape: "open natural sentences",
      pauseStrategy: "light pauses",
    };
  }
  if (emotion === "anger") {
    return {
      delivery: "controlled pressure",
      sentenceShape: pacing === "fast" ? "short direct sentences" : "measured direct sentences",
      pauseStrategy: "minimal pauses",
    };
  }
  return {
    delivery: "cinematic natural narration",
    sentenceShape: "clean natural sentences",
    pauseStrategy: "sentence-boundary pauses only",
  };
}

function buildMusicLayer({ emotion, intensity }) {
  const baseVolume = [0, 0.035, 0.055, 0.075][intensity];
  if (emotion === "fear" || emotion === "suspense") {
    return {
      type: "procedural",
      sound: "low_drone",
      mood: "minimal melody",
      volume: baseVolume,
      frequency: intensity >= 3 ? 34 : 42,
      waveform: intensity >= 3 ? "triangle" : "sine",
      loop: true,
      fadeIn: 3,
    };
  }
  if (emotion === "sadness") {
    return {
      type: "procedural",
      sound: "soft_ambient_pad",
      mood: "soft ambient pad",
      volume: Math.min(baseVolume, 0.045),
      frequency: 56,
      waveform: "sine",
      loop: true,
      fadeIn: 4,
    };
  }
  if (emotion === "joy") {
    return {
      type: "procedural",
      sound: "light_tonal_bed",
      mood: "light tonal bed",
      volume: Math.min(baseVolume, 0.04),
      frequency: 72,
      waveform: "triangle",
      loop: true,
      fadeIn: 3,
    };
  }
  return {
    type: "procedural",
    sound: "room_tone",
    mood: "neutral bed",
    volume: 0.018,
    frequency: 48,
    waveform: "sine",
    loop: true,
    fadeIn: 3,
  };
}

function buildAmbienceLayer({ location, intensity }) {
  const baseVolume = intensity === 1 ? 0.018 : intensity === 2 ? 0.028 : 0.035;
  const byLocation = {
    interior: { type: "procedural", sound: "room_tone", texture: "static environment base", frequency: 44 },
    outdoor: { type: "procedural", sound: "wide_air", texture: "static outdoor air", frequency: 58 },
    urban: { type: "procedural", sound: "distant_hum", texture: "static city pressure", frequency: 50 },
    "cold exterior": { type: "procedural", sound: "cold_wind_bed", texture: "static cold air", frequency: 62 },
    void: { type: "procedural", sound: "near_silence", texture: "thin pressure", frequency: 32 },
  };
  return {
    ...(byLocation[location] || byLocation.interior),
    volume: baseVolume,
    loop: true,
    fadeIn: 3,
    repetitionPolicy: "no patterned one-shots",
  };
}

function buildSfxTriggers({ emotion, intensity, location, seed }) {
  const maxTriggers = intensity === 1 ? 1 : intensity === 2 ? 2 : 3;
  const baseCooldown = intensity === 1 ? 9000 : intensity === 2 ? 7000 : 5500;
  const candidates = [
    { id: "floor_creak", sound: "/audio/sfx/floor_creak.mp3", cue: "intermittent floor shift", position: [0.9, 0, -2.4], cooldownMs: baseCooldown + 1200 },
    { id: "distant_step", sound: "/audio/sfx/footsteps_stone.mp3", cue: "brief distant movement", position: [-1.4, 0, -4], cooldownMs: baseCooldown + 1800 },
    { id: "door_creak", sound: "/audio/sfx/door_creak.mp3", cue: "single door stress", position: [1.8, 0, -2], cooldownMs: baseCooldown + 900 },
    { id: "wind_shift", sound: "/audio/sfx/wind_loop.mp3", cue: "short wind shift", position: [-3, 1, -3], cooldownMs: baseCooldown + 1500 },
    { id: "water_lap", sound: "/audio/sfx/water_lapping.mp3", cue: "brief water detail", position: [3, 0, -5], cooldownMs: baseCooldown + 2400 },
  ];
  const environmentFiltered = candidates.filter(trigger => {
    if (location === "outdoor" || location === "cold exterior") return trigger.id !== "floor_creak";
    if (location === "urban") return trigger.id !== "water_lap";
    return trigger.id !== "water_lap" && trigger.id !== "wind_shift";
  });
  const emotionFiltered = emotion === "joy" || emotion === "sadness"
    ? environmentFiltered.filter(trigger => !["distant_step", "door_creak"].includes(trigger.id))
    : environmentFiltered;

  return pickDeterministic(emotionFiltered.length ? emotionFiltered : candidates, seed, maxTriggers)
    .map((trigger, index) => ({
      ...trigger,
      delayMs: 1800 + index * (baseCooldown + 700),
      volume: Number((0.035 + intensity * 0.025).toFixed(3)),
      loop: false,
      triggerMode: "intermittent",
    }));
}

function buildPhysiologicalBursts({ emotion, intensity }) {
  if (intensity < 3 || !["fear", "suspense", "anger"].includes(emotion)) return [];
  return [
    {
      id: "heartbeat_burst",
      sound: "/audio/sfx/heartbeat.mp3",
      cue: "short heartbeat burst",
      position: [0, 0, 0],
      delayMs: 4200,
      durationMs: 1800,
      cooldownMs: 12000,
      volume: 0.12,
      loop: false,
      triggerMode: "intensity spike",
    },
    {
      id: "breath_one_shot",
      sound: "/audio/sfx/breathing_raspy.mp3",
      cue: "single breath only",
      position: [0.4, 0, -0.35],
      delayMs: 7600,
      durationMs: 1200,
      cooldownMs: 14000,
      volume: 0.07,
      loop: false,
      triggerMode: "intensity spike",
    },
  ];
}

function buildSpatialBehavior({ emotion, intensity }) {
  if (emotion === "fear" || emotion === "suspense") {
    return {
      mode: "rear-side cues",
      defaultPositions: intensity >= 3
        ? [[-1.2, 0, -3], [1.4, 0, -2.4], [0, 0, -4.2]]
        : [[-1.8, 0, -3.5], [1.8, 0, -3.5]],
      movement: intensity >= 3 ? "brief approach then silence" : "subtle side drift",
      stereoWidth: "controlled narrow",
    };
  }
  return {
    mode: "wide stereo",
    defaultPositions: [[-3, 0, -4], [3, 0, -4]],
    movement: "slow wide drift",
    stereoWidth: "wide",
  };
}

export function buildAudioOrchestration(sceneProfile = {}) {
  const emotion = getEmotion(sceneProfile);
  const genre = getGenre(sceneProfile);
  const intensity = clampIntensity(sceneProfile.intensity ?? sceneProfile.intensityLevel ?? sceneProfile.dangerLevel ?? 1);
  const pacing = normalize(sceneProfile.pacing || sceneProfile.pace) || "medium";
  const location = getLocation(sceneProfile);
  const seed = JSON.stringify({
    emotion,
    genre,
    intensity,
    pacing,
    location,
    id: sceneProfile.pageId ?? sceneProfile.chapterId ?? sceneProfile.storyId ?? "",
  });
  const sfxTriggers = [
    ...buildSfxTriggers({ emotion, intensity, location, seed }),
    ...buildPhysiologicalBursts({ emotion, intensity }),
  ].slice(0, intensity === 1 ? 2 : intensity === 2 ? 3 : 4);

  return {
    narrationStyle: buildNarrationStyle({ emotion, intensity, pacing }),
    musicLayer: buildMusicLayer({ emotion, intensity }),
    ambienceLayer: buildAmbienceLayer({ location, intensity }),
    sfxTriggers,
    spatialBehavior: buildSpatialBehavior({ emotion, intensity }),
  };
}

export function toStrictAudioOrchestrationJson(sceneProfile = {}) {
  return JSON.stringify(buildAudioOrchestration(sceneProfile));
}
