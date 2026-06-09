import { createAnalysisJob, createDefaultMonetization } from "./types.js";
import { validateStatusTransition } from "./validation.js";
import { analyzeContent, hasGeminiConfig } from "../gemini/analyzeContent.js";

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
  if (item.status !== "review_required") {
    validateStatusTransition(item.status, "review_required");
  }
  item.status = "review_required";
  item.reviewStatus = "pending";
  item.analysisJob = item.analysisJob || createAnalysisJob(id);
  item.analysisJob.status = "processing";
  item.security.aiAnalysis = "pending";
  item.updatedAt = new Date().toISOString();
  store.content.set(id, item);
  return item;
}

export function getAnalysis({ id, creatorId }) {
  const item = getContent({ id, creatorId });
  if (!item) return null;
  return item.analysisJob || createAnalysisJob(id);
}

/**
 * Dispatch Gemini analysis for an uploaded content item.
 *
 * Transitions: uploaded → processing → ai_analyzed
 *
 * Implements genre_detection, tone_analysis, ad_suitability via Gemini 2.5 Flash.
 * audio_analysis, subtitle_generation, immersive_audio_mapping remain stubbed
 * for future sprints.
 *
 * Designed to be called fire-and-forget from the upload.complete route:
 *   dispatchGeminiAnalysis({ id, creatorId }).catch(err => console.error(err));
 *
 * @param {{ id: string, creatorId: string }} params
 * @returns {Promise<ContentItem|null>}
 */
export async function dispatchGeminiAnalysis({ id, creatorId }) {
  const item = getContent({ id, creatorId });
  if (!item) return null;

  // Only dispatch if the content is in "uploaded" state
  if (item.status !== "uploaded") return item;

  // Advance to processing
  validateStatusTransition(item.status, "processing");
  item.status = "processing";
  item.analysisJob = item.analysisJob || createAnalysisJob(id);
  item.analysisJob.status = "processing";
  item.security.aiAnalysis = "pending";
  item.updatedAt = new Date().toISOString();
  store.content.set(id, item);

  if (!hasGeminiConfig()) {
    console.warn("[gemini] GEMINI_API_KEY not configured — analysis skipped for content:", id);
    item.analysisJob.status = "failed";
    item.analysisJob.error = "GEMINI_API_KEY is not configured";
    item.security.aiAnalysis = "failed";
    item.updatedAt = new Date().toISOString();
    store.content.set(id, item);
    return item;
  }

  try {
    const result = await analyzeContent({
      title: item.title,
      description: item.description,
      tags: item.tags,
      genre: item.genre,
      contentFormat: item.contentFormat,
    });

    const completedAt = new Date().toISOString();

    // Map Gemini results to the three implemented analysis tasks
    const taskResults = {
      genre_detection: {
        genre: result.genre,
      },
      tone_analysis: {
        tone: result.tone,
        emotionalProfile: result.emotionalProfile,
        themes: result.themes,
        audience: result.audience,
        intensity: result.intensity,
      },
      ad_suitability: {
        score: result.adSuitability.score,
        flags: result.adSuitability.flags,
        eligible: result.adSuitability.score >= 70,
      },
    };

    // Update each task: completed for the three we handle, leave others pending
    item.analysisJob.tasks = item.analysisJob.tasks.map(task => {
      if (taskResults[task.name]) {
        return {
          ...task,
          status: "completed",
          result: taskResults[task.name],
          completedAt,
        };
      }
      // Stub remaining tasks
      return { ...task, status: "pending" };
    });

    item.analysisJob.status = "completed";
    item.analysisJob.completedAt = completedAt;
    item.analysisJob.profile = {
      genre: result.genre,
      tone: result.tone,
      themes: result.themes,
      audience: result.audience,
      emotionalProfile: result.emotionalProfile,
      intensity: result.intensity,
    };

    // Advance to ai_analyzed
    validateStatusTransition(item.status, "ai_analyzed");
    item.status = "ai_analyzed";
    item.security.aiAnalysis = "completed";

    // Update monetization with real ad suitability data
    item.monetization.adSuitabilityScore = result.adSuitability.score;
    item.monetization.adSupportedEligible = result.adSuitability.score >= 70;

    item.updatedAt = new Date().toISOString();
    store.content.set(id, item);

    console.log(
      `[gemini] analysis complete for "${item.title}" — genre: ${result.genre}, tone: ${result.tone}, adScore: ${result.adSuitability.score}`
    );

    return item;
  } catch (err) {
    // Mark job failed but do not re-throw — caller decides whether to escalate
    if (item.analysisJob) {
      item.analysisJob.status = "failed";
      item.analysisJob.error = err.message;
      item.analysisJob.failedAt = new Date().toISOString();
    }
    item.security.aiAnalysis = "failed";
    item.updatedAt = new Date().toISOString();
    store.content.set(id, item);

    console.error(`[gemini] analysis failed for content ${id}:`, err.message);
    throw err;
  }
}

export function resetContentStoreForTests() {
  store.content.clear();
}
