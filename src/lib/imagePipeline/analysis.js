const MAX_TEXT_LENGTH = 8000;

const GENRE_RULES = Object.freeze({
  horror: ["horror", "dead", "blood", "ghost", "night", "terror", "intruder", "haunted", "vampire"],
  thriller: ["thriller", "chase", "danger", "signal", "secret", "survival", "choice", "pressure"],
  drama: ["grief", "family", "memory", "loss", "silence", "intimate", "relationship"],
  romance: ["romance", "love", "heart", "tender", "soft", "longing"],
  action: ["battle", "escape", "fight", "rush", "impact", "explosion"],
  sci_fi: ["sci-fi", "signal", "orbit", "space", "future", "system", "cyber"],
  music: ["music", "sound", "audio", "ambient", "frequency", "pulse", "choir"],
});

const TONE_RULES = Object.freeze({
  dread: ["fear", "terror", "dark", "intruder", "silence", "haunted", "dead"],
  wonder: ["moon", "orbit", "stars", "dream", "light", "future"],
  intimate: ["family", "memory", "whisper", "soft", "close"],
  kinetic: ["rush", "run", "fight", "impact", "chase"],
  surreal: ["experimental", "void", "signal", "static", "dream"],
});

function countMatches(text, terms) {
  return terms.reduce((score, term) => score + (text.includes(term) ? 1 : 0), 0);
}

function bestLabel(text, rules, fallback) {
  return Object.entries(rules)
    .map(([label, terms]) => ({ label, score: countMatches(text, terms) }))
    .sort((a, b) => b.score - a.score)[0]?.score > 0
    ? Object.entries(rules).map(([label, terms]) => ({ label, score: countMatches(text, terms) })).sort((a, b) => b.score - a.score)[0].label
    : fallback;
}

export function sanitizeContentInput(input = {}) {
  const title = String(input.title || "").normalize("NFKC").replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, 160);
  const description = String(input.description || input.synopsis || input.hook || "").normalize("NFKC").replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, MAX_TEXT_LENGTH);
  const genre = String(input.genre || "").normalize("NFKC").replace(/[^\p{L}\p{N}\s/_-]/gu, "").trim().slice(0, 80);
  const tags = Array.isArray(input.tags) ? input.tags : [];
  return {
    id: String(input.id || title || "content").normalize("NFKC").replace(/[^\w-]+/g, "-").replace(/-+/g, "-").toLowerCase().slice(0, 96),
    title,
    description,
    genre,
    tags: tags.map(tag => String(tag).normalize("NFKC").replace(/[^\p{L}\p{N}\s_-]/gu, "").trim().toLowerCase()).filter(Boolean).slice(0, 16),
    mediaType: String(input.mediaType || input.contentFormat || "cinematic").slice(0, 80),
  };
}

export function analyzeVisualMetadata(input = {}) {
  const safe = sanitizeContentInput(input);
  const text = `${safe.title} ${safe.genre} ${safe.description} ${safe.tags.join(" ")} ${safe.mediaType}`.toLowerCase();
  const explicitGenre = safe.genre.toLowerCase();
  const detectedGenre = explicitGenre.includes("horror")
    ? "horror"
    : bestLabel(text, GENRE_RULES, safe.genre?.toLowerCase().replace(/\s+/g, "_") || "cinematic");
  const tone = bestLabel(text, TONE_RULES, detectedGenre === "horror" ? "dread" : "cinematic");
  const emotion = tone === "dread" ? "fear" : tone === "intimate" ? "longing" : tone === "kinetic" ? "urgency" : "curiosity";
  const audience = safe.tags.includes("anime") ? "anime fans" : safe.mediaType.toLowerCase().includes("music") ? "immersive music listeners" : "premium streaming audience";
  const style = safe.tags.includes("experimental") || tone === "surreal" ? "experimental cinematic" : "dark premium entertainment";
  const intensity = Math.min(3, Math.max(1, countMatches(text, ["fear", "terror", "danger", "dead", "intruder", "rush", "impact"]) + (tone === "dread" ? 1 : 0)));

  return {
    contentId: safe.id,
    title: safe.title,
    genre: detectedGenre,
    tone,
    emotion,
    themes: Array.from(new Set([safe.genre, ...safe.tags, tone].filter(Boolean))).slice(0, 8),
    audience,
    style,
    intensity,
    safetyProfile: "entertainment-safe",
  };
}
