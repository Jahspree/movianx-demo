import { analyzeEmotion } from "./EmotionAnalyzer";
import { mapEmotionToStyle } from "./EmotionMapper";

export async function buildNarration(text) {
  const emotionResult = await analyzeEmotion(text);
  const style = mapEmotionToStyle(emotionResult.label);

  let processed = style.transform(String(text || "").replace(/\s+/g, " ").trim());
  processed = style.prefix + processed;

  console.log("EMOTION:", emotionResult.label);
  console.log("FINAL NARRATION:", processed);

  return processed;
}
