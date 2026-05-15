import { ASSET_TYPES, CONTENT_STATUSES } from "./types.js";

export const MAX_FILE_BYTES = Object.freeze({
  movie: 5 * 1024 * 1024 * 1024,
  trailer: 500 * 1024 * 1024,
  poster: 15 * 1024 * 1024,
});

export const ALLOWED_MIME_TYPES = Object.freeze({
  movie: ["video/mp4", "video/quicktime", "video/webm"],
  trailer: ["video/mp4", "video/quicktime", "video/webm"],
  poster: ["image/jpeg", "image/png", "image/webp"],
});

const ALLOWED_EXTENSIONS = Object.freeze({
  movie: [".mp4", ".mov", ".webm"],
  trailer: [".mp4", ".mov", ".webm"],
  poster: [".jpg", ".jpeg", ".png", ".webp"],
});

const SAFE_TEXT = /^[\p{L}\p{N}\s.,:;!?'"()\-_/&+@#]+$/u;
const VALID_TRANSITIONS = Object.freeze({
  draft: ["uploading", "review_required"],
  uploading: ["uploaded", "draft", "rejected"],
  uploaded: ["processing", "review_required", "draft", "rejected"],
  processing: ["ai_analyzed", "review_required", "rejected"],
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

export function validateAssetMetadata(asset) {
  const errors = [];
  const assetType = String(asset?.assetType || "");
  const filename = sanitizeFilename(asset?.filename || asset?.originalFilename || "");
  const contentType = String(asset?.contentType || "").toLowerCase();
  const size = Number(asset?.size || 0);
  const extension = getExtension(filename);

  if (!ASSET_TYPES.includes(assetType)) errors.push("assetType is invalid");
  if (!filename) errors.push("filename is required");
  if (!Number.isSafeInteger(size) || size <= 0) errors.push("size must be a positive integer");

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

export function validateCreatePayload(payload = {}) {
  const title = sanitizeText(payload.title, { max: 120, field: "title", required: true });
  const description = sanitizeText(payload.description, { max: 2000, field: "description" });
  const genre = sanitizeText(payload.genre, { max: 60, field: "genre", required: true });
  const language = sanitizeText(payload.language, { max: 32, field: "language", required: true });
  const maturityRating = sanitizeText(payload.maturityRating, { max: 24, field: "maturityRating", required: true });
  const tags = sanitizeTags(payload.tags);
  const submitMode = payload.submitMode === "review" ? "review" : "draft";
  const assets = Array.isArray(payload.assets) ? payload.assets.map(validateAssetMetadata) : [];

  if (!assets.some(asset => asset.assetType === "movie")) {
    throw new ValidationError("Movie upload is required", ["movie asset is required"]);
  }

  return { title, description, genre, language, maturityRating, tags, submitMode, assets };
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
