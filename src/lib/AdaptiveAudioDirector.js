const BED_LIBRARY = {
  arctic_exterior: {
    ambienceBed: [
      { type: "procedural", sound: "wind_bed", volume: 0.035, frequency: 58, waveform: "sine", fadeIn: 4, label: "arctic evolving low wind" },
      { file: "/audio/sfx/wind_loop.mp3", volume: 0.08, fadeIn: 5, label: "wide arctic air" },
    ],
    details: [
      { sound: "/audio/sfx/ice_crack.mp3", startPosition: [-2, -1, -7], endPosition: [3, -1, -9], movement: "leftToRight", duration: 6000, delay: 1200, volume: 0.055, triggerTension: 0.04, label: "distant ice stress" },
      { sound: "/audio/sfx/footsteps_dirt.mp3", startPosition: [0, 0, -8], endPosition: [0, 0, -4], movement: "approaching", duration: 9000, delay: 4800, volume: 0.075, triggerTension: 0.08, label: "far sled movement" },
    ],
  },
  rural_lake: {
    ambienceBed: [
      { file: "/audio/sfx/water_lapping.mp3", volume: 0.08, fadeIn: 4, label: "long lake wash" },
      { type: "procedural", sound: "insects", volume: 0.018, fadeIn: 4, label: "field insects bed" },
      { file: "/audio/sfx/leaves_rustle.mp3", volume: 0.045, fadeIn: 4, label: "grass and leaves" },
    ],
    details: [
      { type: "procedural", sound: "birdsong", startPosition: [3, 2, -6], movement: "fixed", duration: 800, delay: 1800, volume: 0.025, label: "bird high left" },
      { sound: "/audio/sfx/footsteps_dirt.mp3", startPosition: [-2, 0, -3], endPosition: [2, 0, -4], movement: "leftToRight", duration: 7000, delay: 6000, volume: 0.035, label: "soft path footsteps" },
    ],
  },
  laboratory: {
    ambienceBed: [
      { type: "procedural", sound: "drone", volume: 0.045, frequency: 42, waveform: "square", fadeIn: 4, label: "laboratory dread bed" },
      { file: "/audio/sfx/rain_loop.mp3", volume: 0.09, fadeIn: 3, label: "rain on high glass" },
      { file: "/audio/sfx/electrical_hum.mp3", volume: 0.035, fadeIn: 2, label: "equipment heat" },
    ],
    details: [
      { sound: "/audio/sfx/ice_crack.mp3", startPosition: [-1, 1, -2], movement: "fixed", duration: 900, delay: 1100, volume: 0.12, triggerTension: 0.08, label: "electrical snap early" },
      { sound: "/audio/sfx/breathing_raspy.mp3", startPosition: [0.35, 0, -0.8], movement: "fixed", duration: 4200, delay: 5200, volume: 0.16, triggerTension: 0.2, silenceAfter: { duration: 1000 }, label: "breath before recognition" },
    ],
  },
  home_horror: {
    ambienceBed: [
      { type: "procedural", sound: "room_tone", volume: 0.012, frequency: 42, waveform: "sine", fadeIn: 0.6, label: "home night pressure" },
      { file: "/audio/sfx/electrical_hum.mp3", volume: 0.012, fadeIn: 1, label: "refrigerator downstairs" },
    ],
    details: [
      { sound: "/audio/sfx/floor_creak.mp3", startPosition: [0, -1, -2.5], movement: "fixed", duration: 1000, delay: 350, volume: 0.1, triggerTension: 0.08, unsourced: true, label: "first house creak immediate" },
      { sound: "/audio/sfx/glass_break.mp3", startPosition: [0, -1, -5], movement: "fixed", duration: 1000, delay: 2100, volume: 0.32, triggerTension: 0.25, silenceAfter: { duration: 900 }, label: "glass downstairs early" },
      { sound: "/audio/sfx/footsteps_stone.mp3", startPosition: [-1, -1, -6], endPosition: [1, -1, -3], movement: "approaching", duration: 5200, delay: 3600, volume: 0.18, triggerTension: 0.2, unsourced: true, label: "intruder movement before page settles" },
    ],
  },
  coastal_lighthouse: {
    ambienceBed: [
      { type: "procedural", sound: "wind_bed", volume: 0.025, frequency: 64, waveform: "sine", fadeIn: 3, label: "coastal wind bed" },
      { file: "/audio/sfx/water_lapping.mp3", volume: 0.055, fadeIn: 3, label: "distant surf" },
    ],
    details: [
      { sound: "/audio/sfx/footsteps_stone.mp3", startPosition: [0, 1, -6], endPosition: [0, 0, -2], movement: "approaching", duration: 5000, delay: 1200, volume: 0.12, triggerTension: 0.14, label: "spiral stair footsteps" },
      { sound: "/audio/sfx/door_creak.mp3", startPosition: [-2, 0, -2], movement: "fixed", duration: 1100, delay: 4600, volume: 0.12, triggerTension: 0.08, label: "lighthouse door flex" },
    ],
  },
  urban_thriller: {
    ambienceBed: [
      { type: "procedural", sound: "room_tone", volume: 0.01, frequency: 48, waveform: "sine", fadeIn: 2, label: "urban room pressure" },
      { file: "/audio/sfx/electrical_hum.mp3", volume: 0.018, fadeIn: 2, label: "device hum" },
    ],
    details: [
      { sound: "/audio/sfx/drawer_opening.mp3", startPosition: [1, 0, -2], movement: "fixed", duration: 1000, delay: 2200, volume: 0.13, triggerTension: 0.08, label: "files disturbed" },
      { sound: "/audio/sfx/footsteps_stone.mp3", startPosition: [2, 0, -6], endPosition: [-1, 0, -2], movement: "rightToLeft", duration: 4400, delay: 4200, volume: 0.1, triggerTension: 0.12, label: "unseen approach" },
    ],
  },
};

export function buildAdaptiveAudioPlan(profile, manifestChapter = null) {
  const bedKey = profile?.requiredAmbience || "urban_thriller";
  const library = BED_LIBRARY[bedKey] || BED_LIBRARY.urban_thriller;
  const danger = profile?.dangerLevel || manifestChapter?.tension || 0.2;
  const intensityLevel = getIntensityLevel(profile || manifestChapter || {});
  const ambience = [
    ...(library.ambienceBed || []),
    ...((manifestChapter?.ambient || []).filter(layer => !layer.file || !library.ambienceBed?.some(existing => existing.file === layer.file))),
  ];
  const spatialEvents = ensureImmediateSpatialEvents([
    ...(library.details || []),
    ...(manifestChapter?.environmentEvents || []),
  ], profile, intensityLevel);
  const musicBed = manifestChapter?.music && danger > 0.62
    ? { ...manifestChapter.music, volume: scaleMusicVolume(manifestChapter.music.volume || 0.1, intensityLevel) }
    : createAdaptiveMusicBed(profile);

  return {
    profile,
    ambience,
    musicBed,
    spatialEvents,
    tension: Math.max(danger, manifestChapter?.tension || 0),
    physiological: danger > 0.68,
    intensityLevel,
  };
}

export function getIntensityLevel(scene = {}) {
  const danger = Number(scene.dangerLevel ?? scene.tension ?? scene.emotionalIntensity ?? 0);
  const mood = String(scene.mood || scene.characterEmotion || "").toLowerCase();
  if (danger >= 0.82 || mood.includes("panic") || mood.includes("terror")) return 3;
  if (danger >= 0.62 || mood.includes("fear") || mood.includes("horror")) return 2;
  if (danger >= 0.34 || mood.includes("suspense") || mood.includes("dread")) return 1;
  return 0;
}

function scaleMusicVolume(baseVolume, intensityLevel) {
  const scale = [0.55, 0.85, 1.1, 1.35][intensityLevel] || 0.85;
  return Math.max(0.008, Math.min(0.32, baseVolume * scale));
}

function ensureImmediateSpatialEvents(events, profile, intensityLevel) {
  const hasImmediate = events.some(event => Number(event.delay ?? event.time ?? 9999) <= 3000);
  if (hasImmediate) return events;
  const horror = intensityLevel >= 2 || (profile?.requiredAmbience || "").includes("horror");
  const sound = horror ? "/audio/sfx/floor_creak.mp3" : "/audio/sfx/wind_loop.mp3";
  return [
    {
      sound,
      startPosition: horror ? [0.7, 0, -2.4] : [-3, 1, -4],
      endPosition: horror ? [0.3, 0, -1.3] : [2, 1, -2],
      movement: horror ? "approaching" : "leftToRight",
      duration: horror ? 1800 : 3200,
      delay: 650,
      volume: horror ? 0.11 : 0.045,
      triggerTension: horror ? 0.1 : 0.03,
      unsourced: true,
      label: "first-frame spatial presence",
    },
    ...events,
  ];
}

function createAdaptiveMusicBed(profile) {
  const intensity = profile?.requiredMusicIntensity || "low";
  if (intensity === "high") return { type: "procedural", sound: "drone", volume: 0.05, frequency: 34, waveform: "sawtooth", fadeIn: 2, label: "adaptive high tension bed" };
  if (intensity === "medium") return { type: "procedural", sound: "drone", volume: 0.028, frequency: 45, waveform: "triangle", fadeIn: 3, label: "adaptive suspense bed" };
  return { type: "procedural", sound: "room_tone", volume: 0.012, frequency: 52, waveform: "sine", fadeIn: 4, label: "adaptive emotional bed" };
}
