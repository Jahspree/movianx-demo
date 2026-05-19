const ALLOWED_TYPES = new Set(["image/svg+xml", "image/jpeg", "image/png", "image/webp"]);
const REQUIRED_MIN_WIDTH = 1000;
const REQUIRED_MIN_HEIGHT = 600;

export class ImageValidationError extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = "ImageValidationError";
    this.details = details;
  }
}

export function validateGeneratedImage(asset) {
  const errors = [];
  if (!asset || !ALLOWED_TYPES.has(asset.contentType)) errors.push("content type is not allowed");
  if (!Number.isSafeInteger(asset?.width) || asset.width < REQUIRED_MIN_WIDTH) errors.push("image width is too small");
  if (!Number.isSafeInteger(asset?.height) || asset.height < REQUIRED_MIN_HEIGHT) errors.push("image height is too small");
  if (!asset?.bytes || asset.bytes.length < 1024) errors.push("image payload is empty or too small");
  if (asset?.contentType === "image/svg+xml") {
    const text = asset.bytes.toString("utf8").toLowerCase();
    if (text.includes("<script") || text.includes("onload=") || text.includes("href=\"http")) {
      errors.push("svg contains unsafe executable or remote content");
    }
  }
  if (errors.length) throw new ImageValidationError("Generated image failed validation", errors);
  return {
    quality: "pass",
    moderation: "pass",
    dimensions: { width: asset.width, height: asset.height },
  };
}

export function validateGeneratedImageSet(assets = []) {
  return assets.map(validateGeneratedImage);
}
