import { analyzeEmotion } from "./EmotionAnalyzer";
import { mapEmotionToStyle } from "./EmotionMapper";

function cleanNarrationText(text = "") {
  return String(text)
    .replace(/\[(?:breathing|whispering|hesitant|pause|short pause|long pause|softly)[^\]]*\]\s*/gi, "")
    .replace(/\((?:breathing|whispering|hesitant|pause|softly)[^)]*\)\s*/gi, "")
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

function sentencePause(sentence = "", emotion = "neutral") {
  const trimmed = sentence.trim();
  if (trimmed.endsWith("?")) return "600ms";
  if (emotion === "fear") return "500ms";
  if (emotion === "sadness") return "650ms";
  return "350ms";
}

export function buildNarrationSsml(text, emotion = "neutral") {
  const clean = cleanNarrationText(text);
  if (!clean) return "<speak></speak>";

  const sentences = clean.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [clean];
  const body = sentences
    .map(sentence => sentence.trim())
    .filter(Boolean)
    .map(sentence => `${escapeSsml(sentence)}\n<break time="${sentencePause(sentence, emotion)}"/>`)
    .join("\n");

  return `<speak>\n${body}\n</speak>`;
}

export async function buildNarration(text) {
  const emotionResult = await analyzeEmotion(text);
  const style = mapEmotionToStyle(emotionResult.label);

  const processed = style.transform(text);
  const ssml = buildNarrationSsml(processed, emotionResult.label);
  if (typeof window !== "undefined") {
    window.lastNarrationText = processed;
    window.lastNarrationSsml = ssml;
  }

  console.log("EMOTION:", emotionResult.label);
  console.log("FINAL NARRATION:", processed);
  console.log("FINAL NARRATION SSML:", ssml);

  return ssml;
}
