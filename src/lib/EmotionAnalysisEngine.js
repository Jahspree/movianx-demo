const MAX_INPUT_CHARS = 20000;

const EMOTIONS = ["fear", "sadness", "joy", "anger", "suspense"];
const GENRES = ["horror", "thriller", "drama", "romance", "action"];

const EMOTION_KEYWORDS = {
  fear: ["afraid", "blood", "dark", "dead", "death", "gun", "hide", "intruder", "kill", "panic", "scream", "shadow", "terrified", "terror", "threat"],
  sadness: ["alone", "cry", "crying", "empty", "farewell", "grief", "loss", "lost", "mourning", "pain", "regret", "scar", "sorrow", "tears"],
  joy: ["alive", "delight", "glad", "happy", "hope", "laugh", "love", "relief", "smile", "warm", "wonder"],
  anger: ["betray", "betrayed", "fury", "hate", "rage", "revenge", "shout", "strike", "violent", "wrath"],
  suspense: ["behind", "choice", "creak", "door", "footsteps", "listen", "locked", "quiet", "silence", "stairs", "unknown", "waiting", "whisper"],
};

const GENRE_KEYWORDS = {
  horror: ["blood", "creature", "dark", "dead", "ghost", "intruder", "monster", "scream", "shadow", "terror"],
  thriller: ["conspiracy", "evidence", "gun", "lighthouse", "mayor", "police", "secret", "source", "trap", "truth"],
  drama: ["alone", "choice", "family", "grief", "home", "loss", "mother", "promise", "regret", "scar"],
  romance: ["beloved", "heart", "kiss", "love", "soft", "tender", "together", "warm"],
  action: ["attack", "chase", "escape", "fight", "hit", "move", "run", "rush", "strike", "weapon"],
};

const THREAT_WORDS = [
  "attack", "blood", "break", "danger", "dead", "death", "gun", "hurt", "intruder", "kill", "knife", "scream", "shadow", "threat", "trap", "weapon",
];

const ACTION_VERBS = [
  "attack", "break", "chase", "crash", "drag", "escape", "fight", "grab", "hit", "move", "open", "run", "rush", "slam", "strike", "throw",
];

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function round(value) {
  return Number(value.toFixed(4));
}

export function sanitizeStoryInput(rawText, maxChars = MAX_INPUT_CHARS) {
  return String(rawText ?? "")
    .normalize("NFKC")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, " ")
    .slice(0, maxChars)
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text) {
  return text.toLowerCase().match(/[a-z0-9']+/g) || [];
}

function splitSentences(text) {
  return text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(sentence => sentence.trim()).filter(Boolean) || [];
}

function countMatches(tokens, keywords) {
  const counts = new Map();
  tokens.forEach(token => counts.set(token, (counts.get(token) || 0) + 1));
  return keywords.reduce((sum, keyword) => sum + (counts.get(keyword) || 0), 0);
}

function scoreKeywordBank(tokens, bank, labels) {
  const raw = labels.reduce((acc, label) => {
    acc[label] = countMatches(tokens, bank[label]);
    return acc;
  }, {});
  const total = labels.reduce((sum, label) => sum + raw[label], 0);
  const fallback = 1 / labels.length;

  return labels.reduce((acc, label) => {
    acc[label] = total > 0 ? round(raw[label] / total) : round(fallback);
    return acc;
  }, {});
}

function normalizeClassifierLabel(label = "") {
  const normalized = String(label).toLowerCase();
  if (normalized.includes("fear")) return "fear";
  if (normalized.includes("sad")) return "sadness";
  if (normalized.includes("joy") || normalized.includes("happy")) return "joy";
  if (normalized.includes("anger") || normalized.includes("angry")) return "anger";
  if (normalized.includes("surprise")) return "suspense";
  return null;
}

function blendClassifierDistribution(ruleDistribution, classifierResult) {
  const classifierLabel = normalizeClassifierLabel(classifierResult?.label);
  const classifierScore = clamp(Number(classifierResult?.score || 0), 0, 1);
  if (!classifierLabel || !classifierScore) return ruleDistribution;

  const weight = 0.35;
  const blended = EMOTIONS.reduce((acc, label) => {
    const classifierValue = label === classifierLabel ? classifierScore : (1 - classifierScore) / (EMOTIONS.length - 1);
    acc[label] = ruleDistribution[label] * (1 - weight) + classifierValue * weight;
    return acc;
  }, {});
  const total = EMOTIONS.reduce((sum, label) => sum + blended[label], 0) || 1;

  return EMOTIONS.reduce((acc, label) => {
    acc[label] = round(blended[label] / total);
    return acc;
  }, {});
}

function detectPacing({ tokens, sentences, punctuationDensity, actionDensity }) {
  const avgSentenceLength = sentences.length ? tokens.length / sentences.length : tokens.length;
  if (avgSentenceLength <= 9 || punctuationDensity >= 0.09 || actionDensity >= 0.055) return "fast";
  if (avgSentenceLength >= 22 && punctuationDensity < 0.055 && actionDensity < 0.03) return "slow";
  return "medium";
}

function detectPov(tokens) {
  const first = countMatches(tokens, ["i", "me", "my", "mine", "we", "us", "our"]);
  const second = countMatches(tokens, ["you", "your", "yours"]);
  const third = countMatches(tokens, ["he", "she", "they", "them", "his", "her", "their"]);
  const scores = [
    ["first person", first],
    ["second person", second],
    ["third person", third],
  ].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return scores[0][1] > 0 ? scores[0][0] : "third person";
}

function detectDominantLabel(distribution) {
  return EMOTIONS
    .map(label => [label, distribution[label]])
    .sort((a, b) => b[1] - a[1] || EMOTIONS.indexOf(a[0]) - EMOTIONS.indexOf(b[0]))[0][0];
}

function detectGenre(tokens) {
  const scores = scoreKeywordBank(tokens, GENRE_KEYWORDS, GENRES);
  return GENRES
    .map(label => [label, scores[label]])
    .sort((a, b) => b[1] - a[1] || GENRES.indexOf(a[0]) - GENRES.indexOf(b[0]))[0][0];
}

function calculateThreatScore(tokens, punctuationDensity) {
  const threatMatches = countMatches(tokens, THREAT_WORDS);
  const threatDensity = tokens.length ? threatMatches / tokens.length : 0;
  return round(clamp(threatDensity * 12 + punctuationDensity * 1.6));
}

function calculateIntensity({ emotionLabel, threatScore, pacing }) {
  let intensity = 0;
  if (emotionLabel === "fear" && threatScore >= 0.42) intensity = 3;
  else if (emotionLabel === "sadness") intensity = 2;
  else if (emotionLabel === "joy") intensity = 1;
  else if (emotionLabel === "anger" && threatScore >= 0.35) intensity = 3;
  else if (emotionLabel === "suspense" || threatScore >= 0.3) intensity = 2;
  else intensity = 1;

  if (pacing === "fast") intensity += 1;
  if (threatScore >= 0.72) intensity = 3;
  return Math.max(0, Math.min(3, intensity));
}

export function analyzeStoryEmotion(rawText, options = {}) {
  const sanitized = sanitizeStoryInput(rawText, options.maxInputChars);
  const tokens = tokenize(sanitized);
  const sentences = splitSentences(sanitized);
  const punctuationCount = (sanitized.match(/[.!?;:,-]/g) || []).length;
  const punctuationDensity = tokens.length ? punctuationCount / tokens.length : 0;
  const actionDensity = tokens.length ? countMatches(tokens, ACTION_VERBS) / tokens.length : 0;
  const ruleDistribution = scoreKeywordBank(tokens, EMOTION_KEYWORDS, EMOTIONS);
  const emotionDistribution = blendClassifierDistribution(ruleDistribution, options.classifierResult);
  const emotionLabel = detectDominantLabel(emotionDistribution);
  const genre = detectGenre(tokens);
  const pacing = detectPacing({ tokens, sentences, punctuationDensity, actionDensity });
  const pov = detectPov(tokens);
  const threatScore = calculateThreatScore(tokens, punctuationDensity);
  const intensity = calculateIntensity({ emotionLabel, threatScore, pacing });

  return {
    emotionLabel,
    emotionDistribution,
    genre,
    pacing,
    intensity,
    pov,
    threatScore,
  };
}

export function toStrictEmotionJson(rawText, options = {}) {
  return JSON.stringify(analyzeStoryEmotion(rawText, options));
}
