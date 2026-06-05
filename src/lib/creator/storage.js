import { sanitizeFilename } from "./validation.js";
import { createSupabaseSignedUploadTarget, hasSupabaseConfig } from "./supabaseUploadStore.js";

const DEFAULT_SIGNED_URL_TTL_SECONDS = 15 * 60;

export function hasGoogleCloudStorageConfig() {
  return Boolean(
    process.env.GOOGLE_CLOUD_PROJECT &&
    process.env.GCS_UPLOAD_BUCKET &&
    (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_CLOUD_CLIENT_EMAIL)
  );
}

export function buildPrivateStoragePath({ creatorId, contentId, assetType, extension }) {
  const objectId = crypto.randomUUID();
  const safeCreator = sanitizePathSegment(creatorId);
  const safeAssetType = sanitizePathSegment(assetType);
  return `creators/${safeCreator}/content/${contentId}/${safeAssetType}/${objectId}${extension}`;
}

export async function createSignedUploadTarget({ asset, creatorId, contentId }) {
  const storagePath = buildPrivateStoragePath({
    creatorId,
    contentId,
    assetType: asset.assetType,
    extension: asset.extension,
  });

  const expiresAt = new Date(Date.now() + DEFAULT_SIGNED_URL_TTL_SECONDS * 1000).toISOString();

  if (hasSupabaseConfig() && process.env.MOCK_SIGNED_UPLOADS !== "true") {
    const supabaseTarget = await createSupabaseSignedUploadTarget({
      storagePath,
      contentType: asset.contentType,
    });
    return {
      ...supabaseTarget,
      storagePath,
      expiresAt,
      publicAccess: false,
    };
  }

  if (!hasGoogleCloudStorageConfig() || process.env.MOCK_SIGNED_UPLOADS !== "false") {
    const token = crypto.randomUUID();
    return {
      provider: "mock-private-storage",
      method: "PUT",
      uploadUrl: `/api/uploads/mock-signed/${token}`,
      storagePath,
      expiresAt,
      headers: {
        "content-type": asset.contentType,
        "x-movianx-private-upload": "true",
      },
      publicAccess: false,
      mock: true,
    };
  }

  return {
    provider: "google-cloud-storage",
    method: "PUT",
    uploadUrl: `gcs-signed-url-pending:${storagePath}`,
    storagePath,
    expiresAt,
    headers: {
      "content-type": asset.contentType,
      "x-goog-content-length-range": `1,${asset.size}`,
    },
    publicAccess: false,
    mock: false,
  };
}

function sanitizePathSegment(value) {
  return String(value || "unknown").replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80);
}
