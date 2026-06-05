import {
  ASSET_TYPES,
  CONTENT_STATUSES,
  CONTENT_FORMATS,
  CREATOR_VERIFICATION_STATES,
  EMAIL_CAPTURE_INTENTS,
} from "./types.js";

export const MAX_FILE_BYTES = Object.freeze({
  video: 5 * 1024 * 1024 * 1024,
  audio: 500 * 1024 * 1024,
  cover_art: 15 * 1024 * 1024,
  movie: 5 * 1024 * 1024 * 1024,
  trailer: 500 * 1024 * 1024,
  poster: 15 * 1024 * 1024,
});

export const ALLOWED_MIME_TYPES = Object.freeze({
  video: ["video/mp4", "video/quicktime", "video/webm"],
  audio: ["audio/mpeg", "audio/mp4", "audio/wav", "audio/webm", "audio/ogg"],
  cover_art: ["image/jpeg", "image/png", "image/webp"],
  movie: ["video/mp4", "video/quicktime", "video/webm"],
  trailer: ["video/mp4", "video/quicktime", "video/webm"],
  poster: ["image/jpeg", "image/png", "image/webp"],
});

const ALLOWED_EXTENSIONS = Object.freeze({
  video: [".mp4", ".mov", ".webm"],
  audio: [".mp3", ".m4a", ".wav", ".webm", ".ogg"],
  cover_art: [".jpg", ".jpeg", ".png", ".webp"],
  movie: [".mp4", ".mov", ".webm"],
  trailer: [".mp4", ".mov", ".webm"],
  poster: [".jpg", ".jpeg", ".png", ".webp"],
});

const ALL_ALLOWED_MIME_TYPES = new Set(Object.values(ALLOWED_MIME_TYPES).flat());
const DANGEROUS_EXTENSION_SEGMENTS = Object.freeze([
  ".app",
  ".bat",
  ".cmd",
  ".com",
  ".dll",
  ".dmg",
  ".exe",
  ".html",
  ".hta",
  ".jar",
  ".js",
  ".mjs",
  ".php",
  ".ps1",
  ".scr",
  ".sh",
  ".svg",
  ".vbs",
]);

const SAFE_TEXT = /^[\p{L}\p{N}\s.,:;!?'"()\-_/&+@#]+$/u;
const SAFE_URL = /^https:\/\/[a-z0-9.-]+\.[a-z]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?$/i;
const SAFE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_TRANSITIONS = Object.freeze({
  draft: ["uploading", "review_required"],
  uploading: ["uploaded", "draft", "rejected"],
  uploaded: ["processing", "under_review", "review_required", "draft", "rejected"],
  processing: ["ai_analyzed", "under_review", "review_required", "rejected"],
  under_review: ["approved", "rejected", "processing"],
  ai_analyzed: ["review_required", "approved", "rejected"],
  review_required: ["approved", "rejected", "processing"],
  approved: ["published", "rejected"],
  published: [],
  rejected: ["draft"],
});

export class ValidationError extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = "ValidationError";
    this.details = details;
    this.status = 400;
  }
}

export function normalizeAssetType(assetType = "") {
  const value = String(assetType || "").trim().toLowerCase();
  if (value === "movie" || value === "trailer") return "video";
  if (value === "poster") return "cover_art";
  return value;
}

export function sanitizeFilename(filename = "upload") {
  const base = String(filename)
    .normalize("NFKC")
    .split(/[\\/]/)
    .pop()
    .replace(/[^\w.\- ]+/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/\.+/g, ".");

  const safe = base || "upload";
  const limited = safe.slice(0, 96);
  return limited.startsWith(".") ? `upload${limited}` : limited;
}

export function getExtension(filename = "") {
  const safe = sanitizeFilename(filename).toLowerCase();
  const idx = safe.lastIndexOf(".");
  return idx >= 0 ? safe.slice(idx) : "";
}

function getExtensionSegments(filename = "") {
  return sanitizeFilename(filename)
    .toLowerCase()
    .split(".")
    .slice(1)
    .map(segment => `.${segment}`)
    .filter(Boolean);
}

function normalizeContentType(contentType = "") {
  return String(contentType || "").trim().toLowerCase();
}

export function validateAssetMetadata(asset) {
  const errors = [];
  const assetType = normalizeAssetType(asset?.assetType);
  const filename = sanitizeFilename(asset?.filename || asset?.originalFilename || "");
  const contentType = normalizeContentType(asset?.contentType);
  const size = Number(asset?.size || 0);
  const extension = getExtension(filename);
  const extensionSegments = getExtensionSegments(filename);

  if (!ASSET_TYPES.includes(assetType)) errors.push("assetType is invalid");
  if (!filename) errors.push("filename is required");
  if (!Number.isSafeInteger(size) || size <= 0) errors.push("size must be a positive integer");
  if (contentType.includes(";")) errors.push("contentType parameters are not allowed");
  if (extensionSegments.some(segment => DANGEROUS_EXTENSION_SEGMENTS.includes(segment))) {
    errors.push("filename contains an unsafe extension segment");
  }

  if (ASSET_TYPES.includes(assetType)) {
    if (!ALLOWED_MIME_TYPES[assetType].includes(contentType)) {
      errors.push(`${assetType} contentType is not allowed`);
    }
    if (!ALLOWED_EXTENSIONS[assetType].includes(extension)) {
      errors.push(`${assetType} file extension is not allowed`);
    }
    if (size > MAX_FILE_BYTES[assetType]) {
      errors.push(`${assetType} exceeds max file size`);
    }
  }

  if (errors.length) {
    throw new ValidationError("Invalid upload asset", errors);
  }

  return {
    assetType,
    originalFilename: String(asset?.filename || asset?.originalFilename || ""),
    sanitizedFilename: filename,
    contentType,
    size,
    extension,
  };
}

export function validateUploadRequestHeaders(headers = new Headers()) {
  const contentType = normalizeContentType(headers.get("content-type"));
  const contentLength = Number(headers.get("content-length") || 0);
  const privateUpload = headers.get("x-movianx-private-upload") === "true";
  const errors = [];

  if (!privateUpload) errors.push("private upload header is required");
  if (!ALL_ALLOWED_MIME_TYPES.has(contentType)) errors.push("contentType is not allowed");
  if (!Number.isSafeInteger(contentLength) || contentLength <= 0) {
    errors.push("content-length must be a positive integer");
  }
  if (contentLength > MAX_FILE_BYTES.movie) {
    errors.push("content-length exceeds maximum upload size");
  }

  if (errors.length) {
    throw new ValidationError("Invalid upload request", errors);
  }

  return { contentType, contentLength, privateUpload };
}

export function sanitizeText(value, { max = 500, field = "text", required = false } = {}) {
  const text = String(value || "").normalize("NFKC").replace(/[\u0000-\u001F\u007F]/g, "").trim();
  if (required && !text) throw new ValidationError(`${field} is required`);
  if (text.length > max) throw new ValidationError(`${field} is too long`);
  if (text && !SAFE_TEXT.test(text)) throw new ValidationError(`${field} contains unsupported characters`);
  return text;
}

export function sanitizeTags(tags) {
  const input = Array.isArray(tags) ? tags : String(tags || "").split(",");
  return input
    .map(tag => sanitizeText(tag, { max: 32, field: "tag" }).toLowerCase())
    .filter(Boolean)
    .slice(0, 12);
}

export function sanitizeEmail(value, { field = "email" } = {}) {
  const email = String(value || "").normalize("NFKC").trim().toLowerCase();
  if (!SAFE_EMAIL.test(email) || email.length > 254) {
    throw new ValidationError(`${field} is invalid`);
  }
  return email;
}

export function sanitizeOptionalUrl(value, { field = "url" } = {}) {
  const url = String(value || "").normalize("NFKC").trim();
  if (!url) return "";
  if (url.length > 300 || !SAFE_URL.test(url)) {
    throw new ValidationError(`${field} must be a valid https URL`);
  }
  return url;
}

export function validateEmailCapturePayload(payload = {}) {
  const email = sanitizeEmail(payload.email);
  const source = sanitizeText(payload.source || "homepage", { max: 40, field: "source" });
  const intentInput = sanitizeText(payload.intent || "early_access", { max: 40, field: "intent" });
  const intent = EMAIL_CAPTURE_INTENTS.includes(intentInput) ? intentInput : "early_access";
  const website = String(payload.website || "").trim();

  if (website) {
    throw new ValidationError("Submission rejected");
  }

  return { email, source, intent };
}

export function validateCreatorApplicationPayload(payload = {}) {
  const email = sanitizeEmail(payload.email);
  const name = sanitizeText(payload.name, { max: 120, field: "name", required: true });
  const company = sanitizeText(payload.company, { max: 120, field: "company" });
  const creatorType = sanitizeText(payload.creatorType, { max: 60, field: "creatorType", required: true });
  const portfolioUrl = sanitizeOptionalUrl(payload.portfolioUrl, { field: "portfolioUrl" });
  const goals = sanitizeText(payload.goals, { max: 1200, field: "goals", required: true });
  const requestedState = sanitizeText(payload.requestedState || "pending_application", { max: 40, field: "requestedState" });
  const verificationState = CREATOR_VERIFICATION_STATES.includes(requestedState)
    ? requestedState
    : "pending_application";

  return {
    email,
    name,
    company,
    creatorType,
    portfolioUrl,
    goals,
    verificationState: verificationState === "pending_application" ? verificationState : "pending_application",
  };
}

export function validateCreatePayload(payload = {}) {
  const title = sanitizeText(payload.title, { max: 120, field: "title", required: true });
  const description = sanitizeText(payload.description, { max: 2000, field: "description" });
  const genre = sanitizeText(payload.genre, { max: 60, field: "genre", required: true });
  const language = sanitizeText(payload.language, { max: 32, field: "language", required: true });
  const maturityRating = sanitizeText(payload.maturityRating, { max: 24, field: "maturityRating", required: true });
  const tags = sanitizeTags(payload.tags);
  const discoveryTags = sanitizeTags(payload.discoveryTags);
  const formatInput = sanitizeText(payload.contentFormat || "standalone_film", { max: 40, field: "contentFormat" });
  const contentFormat = CONTENT_FORMATS.includes(formatInput) ? formatInput : "standalone_film";
  const seriesTitle = sanitizeText(payload.seriesTitle, { max: 120, field: "seriesTitle" });
  const seasonNumber = payload.seasonNumber ? Number(payload.seasonNumber) : null;
  const episodeNumber = payload.episodeNumber ? Number(payload.episodeNumber) : null;
  const submitMode = payload.submitMode === "review" ? "review" : "draft";
  const assets = Array.isArray(payload.assets) ? payload.assets.map(validateAssetMetadata) : [];

  if (contentFormat !== "standalone_film" && !seriesTitle) {
    throw new ValidationError("Series title is required for episodic or franchise content");
  }
  if (seasonNumber !== null && (!Number.isSafeInteger(seasonNumber) || seasonNumber < 1 || seasonNumber > 99)) {
    throw new ValidationError("seasonNumber must be between 1 and 99");
  }
  if (episodeNumber !== null && (!Number.isSafeInteger(episodeNumber) || episodeNumber < 1 || episodeNumber > 999)) {
    throw new ValidationError("episodeNumber must be between 1 and 999");
  }

  if (!assets.some(asset => asset.assetType === "video")) {
    throw new ValidationError("Video upload is required", ["video asset is required"]);
  }

  return {
    title,
    description,
    genre,
    language,
    maturityRating,
    tags,
    discoveryTags,
    contentFormat,
    seriesTitle,
    seasonNumber,
    episodeNumber,
    submitMode,
    assets,
  };
}

export function validatePatchPayload(payload = {}) {
  const allowed = {};
  if ("title" in payload) allowed.title = sanitizeText(payload.title, { max: 120, field: "title", required: true });
  if ("description" in payload) allowed.description = sanitizeText(payload.description, { max: 2000, field: "description" });
  if ("genre" in payload) allowed.genre = sanitizeText(payload.genre, { max: 60, field: "genre", required: true });
  if ("language" in payload) allowed.language = sanitizeText(payload.language, { max: 32, field: "language", required: true });
  if ("maturityRating" in payload) allowed.maturityRating = sanitizeText(payload.maturityRating, { max: 24, field: "maturityRating", required: true });
  if ("tags" in payload) allowed.tags = sanitizeTags(payload.tags);
  return allowed;
}

export function validateStatusTransition(from, to) {
  if (!CONTENT_STATUSES.includes(from) || !CONTENT_STATUSES.includes(to)) {
    throw new ValidationError("Invalid content status");
  }
  if (!VALID_TRANSITIONS[from]?.includes(to)) {
    throw new ValidationError(`Invalid status transition: ${from} -> ${to}`);
  }
  return true;
}
