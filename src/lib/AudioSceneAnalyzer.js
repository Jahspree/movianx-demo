const WORD_BANKS = {
  horror: ["blood", "gun", "scream", "intruder", "monster", "dead", "kill", "panic", "terrified", "shadow", "dark", "break", "stairs", "gun"],
  suspense: ["silence", "footsteps", "whisper", "creak", "waiting", "unknown", "trap", "alone", "lighthouse", "door", "handle", "choice"],
  grief: ["farewell", "scar", "crying", "cost", "vanished", "empty", "alone", "suffered", "wretched", "destroyed"],
  warmth: ["childhood", "mother", "father", "smile", "love", "lake", "gentle", "home", "soften"],
  action: ["rush", "moving fast", "flood", "fight", "escape", "running", "press conference", "underground"],
};

const LOCATION_BANKS = [
  { location: "farm", words: ["farm", "horse", "barn", "field", "grass", "rural", "pasture"] },
  { location: "arctic exterior", words: ["arctic", "ice", "frost", "snow", "sledge", "fog", "north", "frozen"] },
  { location: "lake shore", words: ["lake", "shore", "como", "water", "mountains"] },
  { location: "laboratory interior", words: ["laboratory", "instrument", "candle", "pane", "rain", "creature", "lifeless"] },
  { location: "home interior", words: ["house", "bedroom", "stairs", "hallway", "kitchen", "bathroom", "kids"] },
  { location: "lighthouse", words: ["lighthouse", "spiral stairs", "files", "usb", "shore"] },
  { location: "city interior", words: ["phone", "editor", "mayor", "journalist", "partner", "police"] },
];

const SOUND_OBJECTS = [
  ["footsteps", ["footstep", "step", "stairs", "walking", "approach"]],
  ["door", ["door", "handle", "unlocked", "open"]],
  ["glass", ["glass", "window", "shatter", "breaking"]],
  ["wind", ["wind", "breeze", "storm", "arctic", "ice"]],
  ["rain", ["rain", "pattered", "window", "panes"]],
  ["water", ["water", "lake", "shore"]],
  ["voices", ["voice", "whisper", "said", "laughed"]],
  ["heartbeat", ["heart", "panic", "fear", "terror", "choice"]],
  ["wood", ["wood", "floor", "creak", "barn", "stairs"]],
  ["insects", ["night", "field", "grass", "rural", "lake"]],
];

const scoreWords = (text, words) => words.reduce((sum, word) => sum + (text.includes(word) ? 1 : 0), 0);

export function analyzeAudioScene({ storyId, chapterId, pageId = chapterId, title = "", text = "", emotion = "", genre = "" }) {
  const source = `${title} ${text} ${emotion} ${genre}`.toLowerCase();
  const horror = scoreWords(source, WORD_BANKS.horror);
  const suspense = scoreWords(source, WORD_BANKS.suspense);
  const grief = scoreWords(source, WORD_BANKS.grief);
  const warmth = scoreWords(source, WORD_BANKS.warmth);
  const action = scoreWords(source, WORD_BANKS.action);
  const locationMatch = LOCATION_BANKS
    .map(entry => ({ ...entry, score: scoreWords(source, entry.words) }))
    .sort((a, b) => b.score - a.score)[0];
  const soundObjects = SOUND_OBJECTS
    .filter(([, words]) => scoreWords(source, words) > 0)
    .map(([object]) => object);

  const dangerLevel = Math.max(
    0.08,
    Math.min(1, horror * 0.14 + suspense * 0.08 + action * 0.08 + (emotion.includes("terrified") ? 0.32 : 0) + (emotion.includes("panicked") ? 0.28 : 0))
  );
  const emotionalIntensity = Math.max(0.12, Math.min(1, dangerLevel + grief * 0.08 + warmth * 0.04));
  const mood = dangerLevel > 0.78 ? "terror" : dangerLevel > 0.5 ? "suspense" : grief > warmth ? "grief" : warmth > 1 ? "tender" : "dread";
  const emotionLabel = dangerLevel > 0.5 ? "fear" : grief > warmth ? "sadness" : warmth > 1 ? "joy" : "neutral";
  const pace = action > 1 || dangerLevel > 0.75 ? "fast" : dangerLevel > 0.42 ? "measured" : "slow";
  const weather = source.includes("rain") ? "rain" : source.includes("ice") || source.includes("frozen") ? "cold wind" : source.includes("night") ? "night air" : "still air";
  const timeOfDay = source.includes("3:47") || source.includes("2 am") || source.includes("night") || source.includes("morning") ? "night" : "day";
  const location = locationMatch?.score > 0 ? locationMatch.location : genre.toLowerCase().includes("thriller") ? "urban interior" : "interior";

  return {
    storyId,
    chapterId,
    pageId,
    genre: genre || (storyId === 1 ? "Gothic" : storyId === 3 ? "Survival Horror" : "Thriller"),
    location,
    timeOfDay,
    weather,
    mood,
    emotionLabel,
    characterEmotion: emotion || mood,
    emotionalIntensity,
    dangerLevel,
    pace,
    soundObjects,
    movementCues: soundObjects.filter(object => ["footsteps", "wind", "voices", "door"].includes(object)),
    requiredAmbience: location.includes("arctic") ? "arctic_exterior" : location.includes("lake") ? "rural_lake" : location.includes("laboratory") ? "laboratory" : location.includes("home") ? "home_horror" : location.includes("lighthouse") ? "coastal_lighthouse" : "urban_thriller",
    requiredMusicIntensity: dangerLevel > 0.75 ? "high" : dangerLevel > 0.45 ? "medium" : "low",
    requiredVoiceDirection: getVoiceDirection({ mood, dangerLevel, emotion, grief, warmth, pace }),
    spatialAudioOpportunities: soundObjects,
    narrationStyle: getVoiceDirection({ mood, dangerLevel, emotion, grief, warmth, pace }),
    transitionStyle: dangerLevel > 0.65 ? "hard tension crossfade" : "slow cinematic crossfade",
  };
}

function getVoiceDirection({ mood, dangerLevel, emotion, grief, warmth, pace }) {
  if (emotion?.includes("terrified") || dangerLevel > 0.82) return "terrified whisper, shaking breath, broken pacing";
  if (emotion?.includes("panicked") || pace === "fast") return "panicked urgency, clipped breath, rushed delivery";
  if (grief > 1 || mood === "grief") return "grief filled delivery, low energy, near tears";
  if (warmth > 1) return "romantic softness, reflective warmth, gentle timing";
  if (dangerLevel > 0.45) return "low suspenseful dread, hesitant pauses";
  return "cinematic narrator, intimate and emotionally present";
}

export function toNarrationLine(text, profile) {
  const danger = profile?.dangerLevel || 0;
  const intensity = profile?.emotionalIntensity || danger;
  return {
    text: performNarrationText(text, profile),
    breathLevel: Math.min(1, danger * 0.85),
    tremble: Math.min(1, danger * 0.9),
    whisper: danger > 0.5 || profile?.narrationStyle?.includes("whisper"),
    pacing: danger > 0.82 ? "broken" : danger > 0.62 ? "rushed" : intensity > 0.42 ? "hesitant" : "stable",
  };
}

export function performNarrationText(text = "", profile = {}) {
  const danger = profile?.dangerLevel || 0;
  const style = `${profile?.requiredVoiceDirection || ""} ${profile?.narrationStyle || ""}`.toLowerCase();
  const normalized = String(text).replace(/\s+/g, " ").trim();
  if (!normalized) return "";

  if (danger > 0.78 || style.includes("terrified")) {
    return `(whispering) ${normalized
      .replace(/([.!?])\s+/g, "$1... ")
      .replace(/\bNo\b/g, "No—no—")
      .replace(/\blisten\b/gi, "listen...")
      .replace(/\bwhat\b/gi, "...what")}`;
  }
  if (danger > 0.58 || style.includes("panic")) {
    return normalized
      .replace(/([.!?])\s+/g, "$1... ")
      .replace(/\bnow\b/gi, "now—")
      .replace(/\bPlease\b/g, "Please...");
  }
  if (style.includes("grief")) {
    return normalized.replace(/([.!?])\s+/g, "$1... ").replace(/\bFarewell\b/g, "Farewell...");
  }
  if (style.includes("softness") || style.includes("warmth")) {
    return normalized.replace(/([.!?])\s+/g, "$1... ");
  }
  return normalized.replace(/([.!?])\s+/g, "$1... ");
}
