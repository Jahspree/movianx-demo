export const SECURITY_LIMITS = Object.freeze({
  maxInputChars: 20000,
  maxUploadBytes: 256000,
  uploadWindowMs: 60_000,
  maxUploadsPerWindow: 5,
  analysisWindowMs: 60_000,
  maxAnalysisCallsPerWindow: 20,
});

export const APPROVED_DEPENDENCIES = Object.freeze([
  "@xenova/transformers",
  "next",
  "react",
  "react-dom",
]);

const ZERO_WIDTH_PATTERN = /[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g;
const CONTROL_PATTERN = /[\u0000-\u001F\u007F-\u009F]/g;

const BLOCKED_INPUT_PATTERNS = Object.freeze([
  { code: "system_command", pattern: /\b(?:rm\s+-rf|sudo|chmod|chown|curl|wget|osascript|powershell|cmd\.exe|bash|zsh|sh\s+-c|python\s+-c|node\s+-e)\b/i },
  { code: "code_execution", pattern: /\b(?:eval|exec|spawn|child_process|Function\s*\(|setTimeout\s*\(|setInterval\s*\()\b/i },
  { code: "api_manipulation", pattern: /\b(?:api[_-]?key|process\.env|authorization\s*:|bearer\s+[a-z0-9._-]+|x-api-key|eleven_labs_api_key)\b/i },
  { code: "file_access", pattern: /\b(?:\/etc\/passwd|\.env|id_rsa|private[_-]?key|readfile|writefile|fs\.|localStorage|indexedDB)\b/i },
  { code: "prompt_injection", pattern: /\b(?:ignore previous instructions|developer message|system prompt|reveal your prompt|do not follow|override instructions|jailbreak|act as system|hidden instruction)\b/i },
  { code: "hidden_instruction", pattern: /(?:<!--|-->|\[system\]|\[developer\]|<script|<\/script|data:text\/html|base64,)/i },
]);

const SENSITIVE_PATTERNS = Object.freeze([
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /\b(?:sk|pk|ghp|gho|github_pat|vercel)_[A-Za-z0-9_-]{12,}\b/i,
  /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/,
]);

const EMOTION_SCHEMA = Object.freeze({
  keys: ["emotionLabel", "emotionDistribution", "genre", "pacing", "intensity", "pov", "threatScore"],
  emotions: ["fear", "sadness", "joy", "anger", "suspense"],
  genres: ["horror", "thriller", "drama", "romance", "action"],
  pacing: ["slow", "medium", "fast"],
  pov: ["first person", "second person", "third person"],
});

const AUDIO_SCHEMA_KEYS = Object.freeze(["narrationStyle", "musicLayer", "ambienceLayer", "sfxTriggers", "spatialBehavior"]);
const NARRATION_SCHEMA_KEYS = Object.freeze(["spokenText"]);
const NARRATION_FORBIDDEN_PATTERNS = Object.freeze([
  /\byou feel\b/i,
  /\bthe scene\b/i,
  /\bemotion\b/i,
  /\bambience\b/i,
  /\bmusic\b/i,
]);

function stableHash(input = "") {
  let hash = 2166136261;
  const text = String(input);
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function hasOnlyKeys(value, keys) {
  const actual = Object.keys(value || {}).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNumberInRange(value, min, max) {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}

export function sanitizeUntrustedText(rawInput, maxChars = SECURITY_LIMITS.maxInputChars) {
  return String(rawInput ?? "")
    .normalize("NFKC")
    .replace(ZERO_WIDTH_PATTERN, "")
    .replace(CONTROL_PATTERN, " ")
    .slice(0, maxChars)
    .replace(/\s+/g, " ")
    .trim();
}

export function inspectUntrustedInput(rawInput, options = {}) {
  const maxChars = options.maxChars || SECURITY_LIMITS.maxInputChars;
  const original = String(rawInput ?? "");
  const sanitized = sanitizeUntrustedText(original, maxChars);
  const anomalies = [];

  if (original.length > maxChars) {
    anomalies.push({ code: "input_truncated", severity: "low" });
  }
  if (ZERO_WIDTH_PATTERN.test(original) || CONTROL_PATTERN.test(original)) {
    anomalies.push({ code: "hidden_characters_removed", severity: "medium" });
  }
  BLOCKED_INPUT_PATTERNS.forEach(({ code, pattern }) => {
    if (pattern.test(sanitized)) anomalies.push({ code, severity: "high" });
  });
  SENSITIVE_PATTERNS.forEach(pattern => {
    if (pattern.test(sanitized)) anomalies.push({ code: "sensitive_data_present", severity: "medium" });
  });

  return {
    allowed: !anomalies.some(item => item.severity === "high"),
    sanitized,
    anomalies,
  };
}

export function assertSafeStoryInput(rawInput, options = {}) {
  const inspection = inspectUntrustedInput(rawInput, options);
  if (!inspection.allowed) {
    const error = new Error("Unsafe story input rejected");
    error.code = "UNSAFE_STORY_INPUT";
    error.anomalies = inspection.anomalies.map(item => item.code);
    throw error;
  }
  return inspection.sanitized;
}

export function validateEmotionAnalysisOutput(output) {
  if (!isPlainObject(output) || !hasOnlyKeys(output, EMOTION_SCHEMA.keys)) return false;
  if (!EMOTION_SCHEMA.emotions.includes(output.emotionLabel)) return false;
  if (!EMOTION_SCHEMA.genres.includes(output.genre)) return false;
  if (!EMOTION_SCHEMA.pacing.includes(output.pacing)) return false;
  if (!EMOTION_SCHEMA.pov.includes(output.pov)) return false;
  if (![0, 1, 2, 3].includes(output.intensity)) return false;
  if (!isNumberInRange(output.threatScore, 0, 1)) return false;
  if (!isPlainObject(output.emotionDistribution)) return false;
  if (!hasOnlyKeys(output.emotionDistribution, EMOTION_SCHEMA.emotions)) return false;
  return EMOTION_SCHEMA.emotions.every(label => isNumberInRange(output.emotionDistribution[label], 0, 1));
}

export function validateAudioOrchestrationOutput(output) {
  if (!isPlainObject(output) || !hasOnlyKeys(output, AUDIO_SCHEMA_KEYS)) return false;
  if (!isPlainObject(output.narrationStyle)) return false;
  if (!isPlainObject(output.musicLayer)) return false;
  if (!isPlainObject(output.ambienceLayer)) return false;
  if (!Array.isArray(output.sfxTriggers)) return false;
  if (!isPlainObject(output.spatialBehavior)) return false;
  return output.sfxTriggers.every(trigger => isPlainObject(trigger) && trigger.loop === false);
}

export function validateNarrationOutput(output) {
  if (!isPlainObject(output) || !hasOnlyKeys(output, NARRATION_SCHEMA_KEYS)) return false;
  if (typeof output.spokenText !== "string") return false;
  if (NARRATION_FORBIDDEN_PATTERNS.some(pattern => pattern.test(output.spokenText))) return false;
  return !BLOCKED_INPUT_PATTERNS.some(({ pattern }) => pattern.test(output.spokenText));
}

export function validateApprovedDependency(name) {
  return APPROVED_DEPENDENCIES.includes(String(name || ""));
}

export function createRateLimiter({ windowMs, max }) {
  const buckets = new Map();
  return function consumeRateLimit(identifier, now = Date.now()) {
    const key = stableHash(identifier || "anonymous");
    const current = buckets.get(key);
    if (!current || now >= current.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, remaining: max - 1, resetAt: now + windowMs };
    }
    if (current.count >= max) {
      return { allowed: false, remaining: 0, resetAt: current.resetAt };
    }
    current.count += 1;
    return { allowed: true, remaining: max - current.count, resetAt: current.resetAt };
  };
}

export const uploadRateLimiter = createRateLimiter({
  windowMs: SECURITY_LIMITS.uploadWindowMs,
  max: SECURITY_LIMITS.maxUploadsPerWindow,
});

export const analysisRateLimiter = createRateLimiter({
  windowMs: SECURITY_LIMITS.analysisWindowMs,
  max: SECURITY_LIMITS.maxAnalysisCallsPerWindow,
});

export function getRequestIdentifier(request) {
  const forwarded = request?.headers?.get?.("x-forwarded-for") || "";
  const realIp = request?.headers?.get?.("x-real-ip") || "";
  const userAgent = request?.headers?.get?.("user-agent") || "";
  return `${forwarded.split(",")[0] || realIp || "unknown"}:${userAgent.slice(0, 80)}`;
}

export function logSecurityAnomaly({ code, severity = "medium", route = "", identifier = "" }) {
  console.warn("SECURITY_ANOMALY", {
    code,
    severity,
    route,
    actor: stableHash(identifier || "anonymous"),
    at: new Date().toISOString(),
  });
}
