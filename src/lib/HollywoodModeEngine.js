import { buildNarration } from "./NarrationBuilder.js";

const MIN_MAJOR_EVENT_SPACING_MS = 3000;
const REACTION_DELAY_MIN_MS = 200;
const REACTION_DELAY_MAX_MS = 600;

const SILENCE_RANGES = {
  1: [1000, 2000],
  2: [2000, 4000],
  3: [3000, 6000],
};

const DEFAULT_ASSETS = {
  distant: "floor_creak",
  movement: "footsteps_stone",
  event: "door_creak",
};

const PROFILE_ASSETS = {
  indoor: { distant: "floor_creak", movement: "footsteps_stone", event: "door_creak" },
  room: { distant: "floor_creak", movement: "footsteps_stone", event: "door_creak" },
  hallway: { distant: "floor_creak", movement: "footsteps_stone", event: "door_creak" },
  farm: { distant: "wind_loop", movement: "footsteps_dirt", event: "floor_creak" },
  rural: { distant: "wind_loop", movement: "footsteps_dirt", event: "floor_creak" },
  forest: { distant: "leaves_rustle", movement: "footsteps_dirt", event: "wolf_howl" },
  outdoor: { distant: "wind_loop", movement: "footsteps_dirt", event: "thunder" },
  arctic: { distant: "wind_loop", movement: "footsteps_stone", event: "ice_crack" },
  ice: { distant: "wind_loop", movement: "footsteps_stone", event: "ice_crack" },
  lab: { distant: "electrical_hum", movement: "floor_creak", event: "glass_break" },
  laboratory: { distant: "electrical_hum", movement: "floor_creak", event: "glass_break" },
  urban: { distant: "electrical_hum", movement: "footsteps_stone", event: "glass_break" },
};

function stableHash(value = "") {
  const input = String(value);
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function deterministicNumber(seed, min, max) {
  const span = Math.max(0, max - min);
  if (span === 0) return min;
  return min + (stableHash(seed) % (span + 1));
}

function clampIntensity(value) {
  const parsed = Math.round(Number(value || 1));
  return Math.max(1, Math.min(3, parsed));
}

function normalizeEnvironment(sceneProfile = {}) {
  return String(
    sceneProfile.environment ||
    sceneProfile.location ||
    sceneProfile.sceneLocation ||
    ""
  ).toLowerCase();
}

function getAssetSet(sceneProfile = {}) {
  const environment = normalizeEnvironment(sceneProfile);
  const source = `${environment} ${sceneProfile.genre || ""} ${sceneProfile.mood || ""}`.toLowerCase();
  const match = Object.keys(PROFILE_ASSETS).find(key => source.includes(key));
  return match ? PROFILE_ASSETS[match] : DEFAULT_ASSETS;
}

export function getHollywoodSilenceDuration(intensity = 1, seed = "silence") {
  const [min, max] = SILENCE_RANGES[clampIntensity(intensity)] || SILENCE_RANGES[1];
  return deterministicNumber(`${seed}:silence`, min, max);
}

export function getReactionDelay(seed = "reaction") {
  return deterministicNumber(`${seed}:reaction`, REACTION_DELAY_MIN_MS, REACTION_DELAY_MAX_MS);
}

export function getProximityProfile(distance = "mid") {
  if (distance === "far") {
    return {
      distance,
      volume: 0.035,
      reverbAmount: 0.8,
      position: { x: -4.2, y: 0.4, z: -7.5 },
      clarity: "soft",
    };
  }
  if (distance === "close") {
    return {
      distance,
      volume: 0.18,
      reverbAmount: 0.12,
      position: { x: 0.55, y: 0.05, z: -0.85 },
      clarity: "sharp",
    };
  }
  return {
    distance: "mid",
    volume: 0.09,
    reverbAmount: 0.38,
    position: { x: 2.2, y: 0.2, z: -3.6 },
    clarity: "directional",
  };
}

function sideForSeed(seed) {
  return stableHash(`${seed}:side`) % 2 === 0 ? -1 : 1;
}

function buildMovement(seed, intensity) {
  const side = sideForSeed(seed);
  const far = getProximityProfile("far");
  const mid = getProximityProfile("mid");
  const close = getProximityProfile("close");
  return {
    startPosition: {
      x: far.position.x * side,
      y: far.position.y,
      z: far.position.z,
    },
    shiftPosition: {
      x: mid.position.x * -side,
      y: mid.position.y,
      z: mid.position.z,
    },
    eventPosition: {
      x: close.position.x * side,
      y: close.position.y,
      z: intensity >= 3 ? -0.65 : -1.2,
    },
  };
}

function reactionSeedText(sceneText, sceneProfile) {
  const text = String(sceneText || "");
  if (text.trim()) return text;
  const mood = sceneProfile.emotionLabel || sceneProfile.mood || "suspense";
  const environment = sceneProfile.location || sceneProfile.environment || "space around us";
  return `A ${mood} presence shifts in the ${environment}. Silence follows.`;
}

export function createHollywoodModeSequence(sceneProfile = {}, sceneText = "", options = {}) {
  const intensity = clampIntensity(sceneProfile.intensity || sceneProfile.intensityLevel || sceneProfile.dangerLevel);
  const identity = [
    options.storyId,
    options.chapterId,
    sceneProfile.storyId,
    sceneProfile.chapterId,
    sceneProfile.pageId,
    sceneProfile.emotionLabel,
    sceneProfile.location,
    sceneText,
  ].filter(value => value !== undefined && value !== null).join(":");
  const seed = identity || "hollywood";
  const silenceMs = getHollywoodSilenceDuration(intensity, seed);
  const reactionDelayMs = getReactionDelay(seed);
  const movement = buildMovement(seed, intensity);
  const assets = getAssetSet(sceneProfile);
  const reaction = buildNarration(reactionSeedText(sceneText, sceneProfile), {
    ...sceneProfile,
    intensity,
    emotionLabel: sceneProfile.emotionLabel || sceneProfile.mood || "suspense",
  });

  let clock = 250;
  const faintDurationMs = intensity >= 3 ? 1350 : 1700;
  const movementDurationMs = intensity >= 3 ? 1800 : 2300;
  const majorEventAt = Math.max(
    clock + faintDurationMs + 650 + movementDurationMs + silenceMs,
    MIN_MAJOR_EVENT_SPACING_MS
  );

  const phases = [
    {
      phase: "presence",
      action: "spatialCue",
      sound: assets.distant,
      delayMs: clock,
      durationMs: faintDurationMs,
      startPosition: movement.startPosition,
      endPosition: {
        x: movement.startPosition.x * 0.82,
        y: movement.startPosition.y,
        z: movement.startPosition.z + 0.8,
      },
      volume: getProximityProfile("far").volume,
      reverbAmount: getProximityProfile("far").reverbAmount,
      loop: false,
      description: "faint distant cue before anything is explained",
    },
    {
      phase: "tension",
      action: "movement",
      sound: assets.movement,
      delayMs: clock + faintDurationMs + 650,
      durationMs: movementDurationMs,
      startPosition: movement.startPosition,
      endPosition: movement.shiftPosition,
      volume: getProximityProfile("mid").volume,
      reverbAmount: getProximityProfile("mid").reverbAmount,
      loop: false,
      description: "space shifts before the event",
    },
    {
      phase: "silence",
      action: "silence",
      delayMs: majorEventAt - silenceMs,
      durationMs: silenceMs,
      loop: false,
      description: "intentional gap before the major event",
    },
    {
      phase: "event",
      action: "eventTrigger",
      sound: assets.event,
      delayMs: majorEventAt,
      durationMs: intensity >= 3 ? 1150 : 900,
      position: movement.eventPosition,
      volume: getProximityProfile("close").volume + intensity * 0.02,
      reverbAmount: getProximityProfile("close").reverbAmount,
      loop: false,
      major: true,
      triggerTension: intensity === 3 ? 0.22 : 0.14,
      description: "major cue after buildup and silence",
    },
    {
      phase: "reaction",
      action: "reaction",
      delayMs: majorEventAt + reactionDelayMs,
      reactionDelayMs,
      spokenText: reaction.spokenText,
      loop: false,
      description: "human reaction after the sound, never before it",
    },
  ];

  return {
    mode: "hollywood",
    intensity,
    noConstantAudio: true,
    minMajorEventSpacingMs: MIN_MAJOR_EVENT_SPACING_MS,
    silenceMs,
    reactionDelayMs,
    proximity: {
      far: getProximityProfile("far"),
      mid: getProximityProfile("mid"),
      close: getProximityProfile("close"),
    },
    phases,
  };
}

function resolveSound(resolveFile, sound) {
  if (!sound) return null;
  return typeof resolveFile === "function" ? resolveFile(sound) : sound;
}

function stopPlaybackLater(audioEngine, playback, durationMs) {
  if (!playback?.audio || !audioEngine?.addTimeout) return;
  audioEngine.addTimeout(() => {
    try {
      playback.audio.pause();
      playback.audio.currentTime = 0;
    } catch (e) {}
  }, Math.max(300, durationMs + 180));
}

export function runHollywoodMode({ audioEngine, sequence, resolveFile, onReaction } = {}) {
  if (!audioEngine || !sequence?.phases?.length) return [];
  return sequence.phases.map(phase => audioEngine.addTimeout(() => {
    if (phase.action === "silence") {
      audioEngine.silence?.(phase.durationMs);
      return;
    }

    if (phase.action === "reaction") {
      if (typeof window !== "undefined") {
        window.lastHollywoodReactionText = phase.spokenText;
      }
      if (typeof onReaction === "function") onReaction({ spokenText: phase.spokenText, phase, sequence });
      return;
    }

    const url = resolveSound(resolveFile, phase.sound);
    if (!url) return;

    if (phase.action === "spatialCue" || phase.action === "movement") {
      const playback = audioEngine.playSpatialMoving?.(
        url,
        phase.volume,
        phase.startPosition,
        phase.endPosition,
        Math.max(0.3, phase.durationMs / 1000),
        false,
        true,
        `hollywood ${phase.phase}`,
        "event"
      );
      stopPlaybackLater(audioEngine, playback, phase.durationMs);
      return;
    }

    if (phase.action === "eventTrigger") {
      audioEngine.addExperienceImpulse?.({
        tension: phase.triggerTension || 0.12,
        presence: 0.18,
        uncertainty: 0.1,
      });
      audioEngine.playSpatialBurst?.(
        url,
        phase.volume,
        phase.position,
        phase.durationMs,
        `hollywood ${phase.phase}`,
        "event"
      );
    }
  }, phase.delayMs));
}

export default {
  createHollywoodModeSequence,
  getHollywoodSilenceDuration,
  getProximityProfile,
  getReactionDelay,
  runHollywoodMode,
};
