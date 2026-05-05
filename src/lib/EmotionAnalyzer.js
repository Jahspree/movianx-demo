import { pipeline } from "@xenova/transformers";
import { analyzeStoryEmotion, sanitizeStoryInput, toStrictEmotionJson } from "./EmotionAnalysisEngine";

let classifier;

export async function analyzeEmotion(text) {
  if (!classifier) {
    classifier = await pipeline(
      "text-classification",
      "j-hartmann/emotion-english-distilroberta-base"
    );
  }

  const result = await classifier(text);
  return result[0];
}

export function analyzeEmotionRules(text, options = {}) {
  return analyzeStoryEmotion(text, options);
}

export function analyzeEmotionRulesJson(text, options = {}) {
  return toStrictEmotionJson(text, options);
}

export async function analyzeEmotionWithClassifier(text, options = {}) {
  const sanitized = sanitizeStoryInput(text, options.maxInputChars);
  const classifierResult = sanitized ? await analyzeEmotion(sanitized) : null;
  return analyzeStoryEmotion(sanitized, {
    ...options,
    classifierResult,
  });
}

export async function analyzeEmotionWithClassifierJson(text, options = {}) {
  const result = await analyzeEmotionWithClassifier(text, options);
  return JSON.stringify(result);
}
