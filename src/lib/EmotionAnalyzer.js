const EMOTION_RULES = Object.freeze({
  fear: [
    "afraid",
    "blood",
    "break",
    "danger",
    "dark",
    "door",
    "footsteps",
    "gun",
    "hide",
    "intruder",
    "panic",
    "scream",
    "shadow",
    "terror",
    "threat",
    "whisper",
  ],
  sadness: ["alone", "cry", "grief", "loss", "lost", "mourn", "sorry", "tears"],
  anger: ["anger", "fight", "furious", "rage", "revenge", "shout"],
  joy: ["delight", "happy", "hope", "laugh", "relief", "warm"],
});

export async function analyzeEmotion(text) {
  const input = String(text || "").normalize("NFKC").toLowerCase();
  const words = input.match(/[\p{L}\p{N}']+/gu) || [];
  const total = Math.max(1, words.length);
  const scores = Object.entries(EMOTION_RULES).map(([label, terms]) => {
    const hits = terms.reduce((count, term) => count + (input.includes(term) ? 1 : 0), 0);
    return { label, score: Math.min(0.99, Math.max(0.01, hits / total + hits * 0.12)) };
  });
  scores.sort((a, b) => b.score - a.score);

  return scores[0]?.score > 0.02 ? scores[0] : { label: "neutral", score: 0.55 };
}
