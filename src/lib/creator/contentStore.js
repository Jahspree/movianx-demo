import { createAnalysisJob, createDefaultMonetization } from "./types.js";
import { validateStatusTransition } from "./validation.js";

const store = globalThis.__movianxCreatorStore || {
  content: new Map(),
};

globalThis.__movianxCreatorStore = store;

export function createContentItem({ creator, payload, uploadAssets, id = crypto.randomUUID() }) {
  const now = new Date().toISOString();
  const status = payload.submitMode === "review" ? "uploading" : "draft";
  const item = {
    id,
    creatorId: creator.id,
    title: payload.title,
    description: payload.description,
    genre: payload.genre,
    language: payload.language,
    maturityRating: payload.maturityRating,
    tags: payload.tags,
    discoveryTags: payload.discoveryTags,
    contentFormat: payload.contentFormat,
    seriesTitle: payload.seriesTitle,
    seasonNumber: payload.seasonNumber,
    episodeNumber: payload.episodeNumber,
    continueWatchingEnabled: payload.contentFormat !== "standalone_film",
    status,
    reviewStatus: "not_submitted",
    assets: uploadAssets,
    analysisJob: null,
    monetization: createDefaultMonetization(),
    security: {
      uploadEncrypted: true,
      privateReviewState: true,
      publicAccess: false,
      securityScan: "pending",
      aiAnalysis: "pending",
    },
    createdAt: now,
    updatedAt: now,
  };
  store.content.set(id, item);
  return item;
}

export function listContent({ creatorId }) {
  return Array.from(store.content.values())
    .filter(item => item.creatorId === creatorId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getContent({ id, creatorId }) {
  const item = store.content.get(id);
  if (!item || item.creatorId !== creatorId) return null;
  return item;
}

export function getContentById({ id }) {
  return store.content.get(id) || null;
}

export function patchContent({ id, creatorId, patch }) {
  const item = getContent({ id, creatorId });
  if (!item) return null;
  Object.assign(item, patch, { updatedAt: new Date().toISOString() });
  store.content.set(id, item);
  return item;
}

export function markAssetsUploaded({ id, creatorId, uploadedAssets = [] }) {
  const item = getContent({ id, creatorId });
  if (!item) return null;

  const uploadedIds = new Set(uploadedAssets.map(asset => asset.assetId || asset.id));
  item.assets = item.assets.map(asset => ({
    ...asset,
    status: uploadedIds.has(asset.id) ? "uploaded" : asset.status,
    checksum: uploadedAssets.find(upload => (upload.assetId || upload.id) === asset.id)?.checksum || asset.checksum || null,
  }));

  const allUploaded = item.assets.length > 0 && item.assets.every(asset => asset.status === "uploaded");
  if (allUploaded && item.status === "uploading") {
    validateStatusTransition(item.status, "uploaded");
    item.status = "uploaded";
    item.security.securityScan = "completed";
  }
  item.updatedAt = new Date().toISOString();
  store.content.set(id, item);
  return item;
}

export function submitForReview({ id, creatorId }) {
  const item = getContent({ id, creatorId });
  if (!item) return null;
  if (item.status !== "under_review") {
    validateStatusTransition(item.status, "under_review");
  }
  item.status = "under_review";
  item.reviewStatus = "in_review";
  item.analysisJob = item.analysisJob || createAnalysisJob(id);
  item.analysisJob.status = "processing";
  item.security.aiAnalysis = "pending";
  item.updatedAt = new Date().toISOString();
  store.content.set(id, item);
  return item;
}

export function updateContentStatusByAdmin({ id, status }) {
  const item = getContentById({ id });
  if (!item) return null;
  if (item.status !== status) validateStatusTransition(item.status, status);
  item.status = status;
  item.reviewStatus = mapReviewStatus(status, item.reviewStatus);
  item.updatedAt = new Date().toISOString();
  store.content.set(id, item);
  return item;
}

export function getAnalysis({ id, creatorId }) {
  const item = getContent({ id, creatorId });
  if (!item) return null;
  return item.analysisJob || createAnalysisJob(id);
}

export function resetContentStoreForTests() {
  store.content.clear();
}

function mapReviewStatus(status, current) {
  if (status === "under_review" || status === "processing") return "in_review";
  if (status === "approved" || status === "published") return "approved";
  if (status === "rejected") return "rejected";
  return current || "not_submitted";
}
