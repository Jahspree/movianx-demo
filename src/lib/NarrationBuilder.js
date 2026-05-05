import { analyzeEmotion } from "./EmotionAnalyzer";
import { mapEmotionToStyle } from "./EmotionMapper";

const FORBIDDEN_SPOKEN_PATTERNS = [
  /\byou feel\b/gi,
  /\bfear\b/gi,
  /\bemotion\b/gi,
  /\bscene\b/gi,
  /\bmusic\b/gi,
  /\bambience\b/gi,
  /\bthe room is dark\b/gi,
];

function normalizeSceneMetadata(metadata = {}, emotionResult = null) {
  return {
    emotion: emotionResult?.label || metadata.emotion || metadata.emotionLabel || "neutral",
    emotionScore: emotionResult?.score ?? metadata.emotionScore ?? null,
    environment: metadata.environment || metadata.location || null,
    intensity: metadata.intensity ?? metadata.dangerLevel ?? metadata.emotionalIntensity ?? 0,
    pacing: metadata.pacing || null,
  };
}

function stripMetadataLanguage(text = "") {
  return FORBIDDEN_SPOKEN_PATTERNS.reduce(
    (spoken, pattern) => spoken.replace(pattern, ""),
    String(text)
  );
}

function cleanSpokenText(text = "") {
  return stripMetadataLanguage(text)
    .replace(/\[(?:breathing|whispering|hesitant|pause|short pause|long pause|softly)[^\]]*\]\s*/gi, "")
    .replace(/\((?:breathing|whispering|hesitant|pause|softly)[^)]*\)\s*/gi, "")
    .replace(/\.{2,}/g, ".")
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

function sentencePause(sentence = "", sceneMetadata = {}) {
  const trimmed = sentence.trim();
  const intensity = Number(sceneMetadata.intensity || 0);
  const emotion = sceneMetadata.emotion || "neutral";
  if (intensity >= 0.78) return trimmed.endsWith("?") ? "360ms" : "240ms";
  if (trimmed.endsWith("?")) return "520ms";
  if (emotion === "fear") return "360ms";
  if (emotion === "sadness") return "650ms";
  return "350ms";
}

export function buildNarrationPayload(input, sceneMetadata = {}) {
  const rawText = typeof input === "string" ? input : input?.spokenText || input?.text || "";
  const clean = cleanSpokenText(rawText);
  return {
    spokenText: clean,
    sceneMetadata: {
      ...sceneMetadata,
      ...(typeof input === "object" && input?.sceneMetadata ? input.sceneMetadata : {}),
    },
  };
}

export function buildNarrationSsml(text, sceneMetadata = {}) {
  const clean = cleanSpokenText(text);
  if (!clean) return "<speak></speak>";

  const sentences = clean.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [clean];
  const body = sentences
    .map(sentence => sentence.trim())
    .filter(Boolean)
    .map(sentence => `${escapeSsml(sentence)}\n<break time="${sentencePause(sentence, sceneMetadata)}"/>`)
    .join("\n");

  return `<speak>\n${body}\n</speak>`;
}

export async function buildNarration(input, metadata = {}) {
  const initialPayload = buildNarrationPayload(input, metadata);
  const emotionResult = await analyzeEmotion(initialPayload.spokenText);
  const sceneMetadata = normalizeSceneMetadata(initialPayload.sceneMetadata, emotionResult);
  const style = mapEmotionToStyle(emotionResult.label);

  const processed = cleanSpokenText(style.transform(initialPayload.spokenText));
  const ssml = buildNarrationSsml(processed, sceneMetadata);
  if (typeof window !== "undefined") {
    window.lastNarrationText = processed;
    window.lastNarrationSsml = ssml;
    window.lastNarrationPayload = {
      spokenText: processed,
      sceneMetadata,
    };
  }

  console.log("EMOTION:", emotionResult.label);
  console.log("NARRATION PAYLOAD:", { spokenText: processed, sceneMetadata });
  console.log("FINAL NARRATION:", processed);
  console.log("FINAL NARRATION SSML:", ssml);

  return ssml;
}
