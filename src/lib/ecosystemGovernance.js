const INTENSITY_WORDS = new Map([
  ["panic", 3],
  ["fear", 3],
  ["dread", 3],
  ["survival", 3],
  ["pressure", 3],
  ["suspense", 2],
  ["mystery", 2],
  ["haunting", 2],
  ["sadness", 2],
  ["spiritual", 2],
  ["memory", 2],
  ["wonder", 1],
  ["calm", 1],
  ["joy", 1],
  ["playful", 1],
]);

const RARE_STYLE_WORDS = new Set([
  "auteur",
  "arthouse",
  "creator-led cinema",
  "experimental",
  "silent cinema",
  "spiritual",
]);

function normalize(value) {
  return String(value || "").toLowerCase();
}

function seededValue(seed, key) {
  const input = `${seed}:${key}`;
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 1000) / 1000;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function governanceSeed(date = new Date()) {
  const day = Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86400000);
  return day;
}

export function scoreContentEmotion(experience) {
  const text = [
    experience.genre,
    experience.atmosphereProfile,
    experience.hook,
    ...(experience.moodTags || []),
    ...(experience.styleTags || []),
    ...(experience.discoveryTags || []),
  ].map(normalize).join(" ");

  const matchedIntensities = [...INTENSITY_WORDS.entries()]
    .filter(([word]) => text.includes(word))
    .map(([, score]) => score);

  const intensity = matchedIntensities.length ? Math.max(...matchedIntensities) : 1;
  const emotionalWeight = clamp(
    intensity + (experience.factoryIngested ? 0.35 : 0) + (experience.contentFormat === "interactive_story" ? 0.25 : 0),
    0,
    3.8
  );
  const pacingCategory = intensity >= 3 ? "high tension" : intensity === 2 ? "slow burn" : "open air";
  const discoveryMood = experience.moodTags?.[0] || normalize(experience.genre) || "cinematic";
  const rarityMatches = [...RARE_STYLE_WORDS].filter(word => text.includes(word)).length;
  const rarityScore = clamp(
    0.28 + rarityMatches * 0.16 + (experience.contentFormat === "creator_spotlight" ? 0.18 : 0) + (experience.factoryIngested ? 0.08 : 0),
    0,
    0.9
  );

  return {
    intensity,
    emotionalWeight: Number(emotionalWeight.toFixed(2)),
    atmosphereProfile: experience.atmosphereProfile || "cinematic atmosphere",
    pacingCategory,
    discoveryMood,
    rarityScore: Number(rarityScore.toFixed(2)),
  };
}

function railAffinity(rail, experience, score) {
  const haystack = [
    rail.title,
    rail.description,
    rail.mood,
    experience.genre,
    experience.creatorWorld,
    ...(experience.discoveryTags || []),
    ...(experience.moodTags || []),
    ...(experience.styleTags || []),
  ].map(normalize);
  const railText = [rail.title, rail.description, rail.mood].map(normalize).join(" ");
  const tagScore = haystack.reduce((sum, value) => sum + (railText.includes(value) && value.length > 3 ? 0.4 : 0), 0);
  const tensionFit = railText.includes("midnight") || railText.includes("horror") || railText.includes("descent")
    ? score.intensity * 0.18
    : 0;
  const calmFit = railText.includes("soundscape") || railText.includes("atmospheric")
    ? (4 - score.intensity) * 0.1
    : 0;
  return tagScore + tensionFit + calmFit;
}

function balanceRailItems(rail, experiencesById, seed) {
  const creatorCounts = new Map();
  const scored = rail.ids
    .map(id => experiencesById.get(id))
    .filter(Boolean)
    .map((experience, index) => {
      const emotion = scoreContentEmotion(experience);
      return {
        experience,
        index,
        emotion,
        score:
          railAffinity(rail, experience, emotion) +
          seededValue(seed, `${rail.slug || rail.title}:${experience.id}`) * 0.32 -
          emotion.rarityScore * 0.22,
      };
    })
    .sort((a, b) => b.score - a.score);

  const balanced = [];
  for (const item of scored) {
    const creatorKey = item.experience.creator || "unknown";
    const creatorCount = creatorCounts.get(creatorKey) || 0;
    if (creatorCount >= 2 && scored.length > 3) continue;
    creatorCounts.set(creatorKey, creatorCount + 1);
    balanced.push(item);
  }

  const recovered = scored.filter(item => !balanced.includes(item));
  const finalItems = [...balanced, ...recovered].slice(0, rail.ids.length);
  return finalItems.map(item => item.experience.id);
}

export function monitorEcosystemHealth(rails, experiencesById) {
  const exposure = new Map();
  const creatorExposure = new Map();
  const emotionalTotals = [];
  let overcrowdedRails = 0;

  for (const rail of rails) {
    if (rail.ids.length > 6) overcrowdedRails += 1;
    for (const id of rail.ids) {
      const experience = experiencesById.get(id);
      if (!experience) continue;
      exposure.set(id, (exposure.get(id) || 0) + 1);
      creatorExposure.set(experience.creator, (creatorExposure.get(experience.creator) || 0) + 1);
      emotionalTotals.push(scoreContentEmotion(experience).intensity);
    }
  }

  const averageIntensity = emotionalTotals.length
    ? emotionalTotals.reduce((sum, value) => sum + value, 0) / emotionalTotals.length
    : 0;
  const repeatedWorlds = [...exposure.values()].filter(count => count > 4).length;
  const creatorOverexposure = [...creatorExposure.values()].filter(count => count > 8).length;
  const status = repeatedWorlds || creatorOverexposure || overcrowdedRails || averageIntensity > 2.7
    ? "watching balance"
    : "balanced";

  return {
    status,
    averageIntensity: Number(averageIntensity.toFixed(2)),
    repeatedWorlds,
    creatorOverexposure,
    overcrowdedRails,
    summary: status === "balanced"
      ? "Balanced intensity · creator variety preserved"
      : "Curated carefully · rare worlds paced slowly",
  };
}

export function orchestrateEcosystemRails(rails, experiences, options = {}) {
  const seed = options.seed ?? governanceSeed(options.date);
  const experiencesById = new Map(experiences.map(experience => [experience.id, experience]));
  const rotatedRails = rails.map((rail) => ({
    ...rail,
    ids: balanceRailItems(rail, experiencesById, seed),
  }));

  const spotlightCount = Math.min(4, rotatedRails.length);
  const spotlightIndex = spotlightCount ? seed % spotlightCount : 0;
  const orderedRails = [
    ...rotatedRails.slice(spotlightIndex, spotlightIndex + 1),
    ...rotatedRails.slice(0, spotlightIndex),
    ...rotatedRails.slice(spotlightIndex + 1),
  ].map((rail) => {
    const first = experiencesById.get(rail.ids[0]);
    const emotion = first ? scoreContentEmotion(first) : null;
    return {
      ...rail,
      governanceMood: emotion?.pacingCategory || "curated",
      governanceSignal: emotion ? `${emotion.discoveryMood} · rarity ${Math.round(emotion.rarityScore * 100)}` : "curated",
    };
  });

  return {
    rails: orderedRails,
    health: monitorEcosystemHealth(orderedRails, experiencesById),
    seed,
  };
}
