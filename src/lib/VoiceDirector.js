const DEFAULT_MODEL_ID = "eleven_turbo_v2";

const EMOTION_ALIASES = [
  ["fear", ["fear", "terrified", "terror", "panic", "horror", "dread", "scared"]],
  ["sadness", ["sad", "grief", "grieving", "farewell", "hollow", "crying", "tears", "loss"]],
  ["anger", ["anger", "rage", "furious", "defiant"]],
  ["joy", ["joy", "warm", "relief", "romantic", "softness", "delight"]],
  ["suspense", ["suspense", "suspenseful", "uncertain", "uneasy", "careful"]],
];

const BASE_SETTINGS = {
  preview: {
    stability: 0.45,
    similarity_boost: 0.75,
    style: 0.2,
    speed: 0.98,
    use_speaker_boost: true,
  },
  final: {
    stability: 0.4,
    similarity_boost: 0.85,
    style: 0.35,
    speed: 0.95,
    use_speaker_boost: true,
  },
};

function stableHash(value = "") {
  let hash = 2166136261;
  const input = String(value);
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clampIntensity(value = 1) {
  return clamp(Math.round(Number(value || 1)), 1, 3);
}

function normalizeText(text = "") {
  return String(text || "")
    .normalize("NFKC")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, " ")
    .replace(/\[(?:breathing|whispering|hesitant|pause|short pause|long pause|softly)[^\]]*\s*/gi, "")
    .replace(/\((?:breathing|whispering|hesitant|pause|softly)[^)]*\)\s*/gi, "")
    .replace(/\byou feel\b/gi, "")
    .replace(/\bemotion\b/gi, "")
    .replace(/\bscene\b/gi, "")
    .replace(/\bmusic\b/gi, "")
    .replace(/\bambience\b/gi, "")
    .replace(/\s+([,.!?])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeSsml(text = "") {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function splitSentences(text = "") {
  return normalizeText(text).match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(sentence => sentence.trim()).filter(Boolean) || [];
}

function detectEmotion(sceneProfile = {}, direction = "", text = "") {
  const source = [
    sceneProfile.emotionLabel,
    sceneProfile.emotion,
    sceneProfile.mood,
    sceneProfile.genre,
    direction,
    text,
  ].filter(Boolean).join(" ").toLowerCase();

  const match = EMOTION_ALIASES.find(([, aliases]) => aliases.some(alias => source.includes(alias)));
  return match ? match[0] : "neutral";
}

function sentenceWordCount(sentence = "") {
  return sentence.split(/\s+/).filter(Boolean).length;
}

function splitLongSentence(sentence, maxWords) {
  const words = sentence.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return [sentence];
  const lines = [];
  for (let i = 0; i < words.length; i += maxWords) {
    const chunk = words.slice(i, i + maxWords).join(" ");
    const hasPunctuation = /[.!?]$/.test(chunk);
    lines.push(hasPunctuation ? chunk : `${chunk}${i + maxWords >= words.length ? "." : ","}`);
  }
  return lines;
}

function getMaxWordsPerLine(emotion, intensity) {
  if (emotion === "fear" || emotion === "suspense") return intensity >= 3 ? 7 : 10;
  if (emotion === "anger") return intensity >= 3 ? 8 : 11;
  if (emotion === "sadness") return intensity >= 2 ? 18 : 22;
  if (emotion === "joy") return 18;
  return intensity >= 3 ? 12 : 20;
}

function lineDelivery(text, emotion, intensity) {
  const maxWords = getMaxWordsPerLine(emotion, intensity);
  return splitSentences(text).flatMap(sentence => splitLongSentence(sentence, maxWords));
}

function pauseForLine(line, emotion, intensity, index, seed) {
  const questionWeight = line.trim().endsWith("?") ? 120 : 0;
  const commaWeight = line.includes(",") ? 80 : 0;
  const variation = stableHash(`${seed}:${index}:${line}`) % (emotion === "fear" ? 260 : 180);

  if (emotion === "fear") {
    const base = intensity >= 3 ? 180 : 260;
    return clamp(base + questionWeight + variation, 160, 620);
  }
  if (emotion === "sadness") {
    return clamp(520 + questionWeight + commaWeight + variation, 520, 1050);
  }
  if (emotion === "anger") {
    return clamp(120 + variation * 0.45, 120, 320);
  }
  if (emotion === "joy") {
    return clamp(240 + variation * 0.5, 220, 430);
  }
  if (emotion === "suspense") {
    return clamp(300 + questionWeight + variation, 280, 720);
  }
  return clamp(300 + variation * 0.7, 260, 520);
}

function buildImperfectionCues(lines, emotion, intensity, seed) {
  if (emotion !== "fear" && emotion !== "sadness" && emotion !== "suspense") return [];
  const cooldownLines = intensity >= 3 ? 3 : 4;
  const cues = [];
  let lastCueIndex = -cooldownLines;
  lines.forEach((line, index) => {
    if (index - lastCueIndex < cooldownLines) return;
    const roll = stableHash(`${seed}:cue:${index}:${line}`) % 100;
    const threshold = emotion === "fear" && intensity >= 3 ? 38 : emotion === "sadness" ? 24 : 18;
    if (roll < threshold) {
      cues.push({
        type: emotion === "sadness" ? "held_breath" : "short_breath",
        afterLine: index,
        durationMs: emotion === "sadness" ? 420 : 260,
        loop: false,
      });
      lastCueIndex = index;
    }
  });
  return cues;
}

function voiceSettingsFor(emotion, intensity, quality = "final", overrides = {}) {
  const base = { ...(BASE_SETTINGS[quality] || BASE_SETTINGS.final), ...overrides };
  const energy = intensity / 3;
  const fearOrSuspense = emotion === "fear" || emotion === "suspense";
  const grief = emotion === "sadness";
  const anger = emotion === "anger";

  return {
    stability: clamp(base.stability + (grief ? 0.08 : 0) - (fearOrSuspense ? 0.04 * energy : 0), 0.32, 0.58),
    similarity_boost: clamp(base.similarity_boost, 0.7, 0.9),
    style: clamp(base.style + (fearOrSuspense ? 0.12 * energy : 0) + (anger ? 0.1 : 0) - (grief ? 0.05 : 0), 0.18, 0.62),
    speed: clamp(base.speed + (anger ? 0.03 : 0) - (grief ? 0.05 : 0) - (fearOrSuspense && intensity >= 3 ? 0.02 : 0), 0.88, 1.02),
    use_speaker_boost: base.use_speaker_boost !== false,
  };
}

export function buildVoiceDelivery(sceneText, sceneProfile = {}, direction = "", options = {}) {
  const spokenText = normalizeText(sceneText);
  const emotion = detectEmotion(sceneProfile, direction, spokenText);
  const intensity = clampIntensity(sceneProfile.intensity || sceneProfile.intensityLevel || sceneProfile.dangerLevel || options.intensity || 1);
  const seed = [
    options.seed,
    sceneProfile.storyId,
    sceneProfile.chapterId,
    sceneProfile.pageId,
    emotion,
    intensity,
    spokenText,
  ].filter(Boolean).join(":") || "voice-director";
  const lines = lineDelivery(spokenText, emotion, intensity);
  const pauses = lines.map((line, index) => pauseForLine(line, emotion, intensity, index, seed));

  return {
    emotion,
    intensity,
    energy: Number((intensity / 3).toFixed(2)),
    cadence: emotion === "fear" || emotion === "suspense" ? "irregular" : emotion === "sadness" ? "slow-held" : "varied",
    maxWordsPerLine: getMaxWordsPerLine(emotion, intensity),
    lines,
    pauses,
    imperfectionCues: buildImperfectionCues(lines, emotion, intensity, seed),
    voiceSettings: voiceSettingsFor(emotion, intensity, options.quality, options.voiceSettings),
  };
}

export function buildDirectedSsml(sceneText, delivery) {
  const lines = delivery?.lines?.length ? delivery.lines : lineDelivery(sceneText, "neutral", 1);
  if (!lines.length) return "<speak></speak>";
  const body = lines.map((line, index) => {
    const pause = delivery.pauses?.[index] ?? 320;
    return `${escapeSsml(line)}\n<break time="${pause}ms"/>`;
  }).join("\n");
  return `<speak>\n${body}\n</speak>`;
}

export function buildElevenLabsRequest({
  text,
  sceneProfile = {},
  direction = "",
  modelId = DEFAULT_MODEL_ID,
  quality = "final",
  voiceSettings,
  previousText,
  nextText,
} = {}) {
  const delivery = buildVoiceDelivery(text, sceneProfile, direction, { quality, voiceSettings });
  const request = {
    text: buildDirectedSsml(text, delivery),
    model_id: modelId,
    voice_settings: delivery.voiceSettings,
  };
  if (previousText) request.previous_text = normalizeText(previousText);
  if (nextText) request.next_text = normalizeText(nextText);
  return {
    request,
    delivery,
    spokenText: normalizeText(text),
  };
}

export default {
  buildDirectedSsml,
  buildElevenLabsRequest,
  buildVoiceDelivery,
};
