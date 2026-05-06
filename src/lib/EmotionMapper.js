export function mapEmotionToStyle(emotion) {
  switch (emotion) {
    case "fear":
      return {
        pacing: "slow",
        transform: t => t.toLowerCase().replace(/\./g, "..."),
        prefix: "(breathing) ",
      };

    case "sadness":
      return {
        pacing: "slow",
        transform: t => t.replace(/\./g, "..."),
        prefix: "(softly) ",
      };

    case "anger":
      return {
        pacing: "fast",
        transform: t => t.toUpperCase(),
        prefix: "",
      };

    case "joy":
      return {
        pacing: "normal",
        transform: t => t,
        prefix: "",
      };

    default:
      return {
        pacing: "normal",
        transform: t => t,
        prefix: "",
      };
  }
}

export function mapEmotionToIntensity(emotion) {
  switch (emotion) {
    case "fear":
    case "anger":
      return 3;
    case "sadness":
      return 2;
    case "joy":
      return 1;
    default:
      return 0;
  }
}

export function inferEmotionFromScene(scene = {}) {
  const mood = String(scene.mood || scene.characterEmotion || scene.emotion || "").toLowerCase();
  const danger = Number(scene.dangerLevel ?? scene.tension ?? scene.emotionalIntensity ?? 0);

  if (danger >= 0.62 || mood.includes("fear") || mood.includes("horror") || mood.includes("terror") || mood.includes("dread")) {
    return "fear";
  }
  if (mood.includes("anger") || mood.includes("rage")) return "anger";
  if (mood.includes("sad") || mood.includes("grief") || mood.includes("devastated")) return "sadness";
  if (mood.includes("joy") || mood.includes("warm") || mood.includes("tender")) return "joy";
  return "neutral";
}

