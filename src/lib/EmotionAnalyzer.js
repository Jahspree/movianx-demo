import { pipeline } from "@xenova/transformers";

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

