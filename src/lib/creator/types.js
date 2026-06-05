export const CONTENT_STATUSES = Object.freeze([
  "draft",
  "uploading",
  "uploaded",
  "processing",
  "under_review",
  "ai_analyzed",
  "review_required",
  "approved",
  "published",
  "rejected",
]);

export const REVIEW_STATUSES = Object.freeze([
  "not_submitted",
  "pending",
  "in_review",
  "approved",
  "rejected",
  "changes_requested",
]);

export const MONETIZATION_STATUSES = Object.freeze([
  "not_eligible",
  "pending_review",
  "eligible",
  "limited",
  "disabled",
]);

export const ASSET_TYPES = Object.freeze([
  "video",
  "audio",
  "cover_art",
  "movie",
  "trailer",
  "poster",
]);

export const CREATOR_UPLOAD_STATUSES = Object.freeze([
  "uploaded",
  "processing",
  "under_review",
  "approved",
  "published",
  "rejected",
]);

export const CONTENT_FORMATS = Object.freeze([
  "standalone_film",
  "series",
  "franchise",
  "episodic_story",
  "documentary_series",
]);

export const DISCOVERY_TAG_GROUPS = Object.freeze([
  "genres",
  "themes",
  "audience_interests",
  "moods",
  "styles",
  "aesthetics",
  "fandom_categories",
]);

export const CREATOR_VERIFICATION_STATES = Object.freeze([
  "pending_application",
  "basic_verified",
  "identity_verified",
  "trusted_creator",
  "enterprise_creator",
]);

export const EMAIL_CAPTURE_INTENTS = Object.freeze([
  "early_access",
  "waitlist",
  "creator_application",
]);

export const ANALYSIS_TASKS = Object.freeze([
  "genre_detection",
  "tone_analysis",
  "audio_analysis",
  "subtitle_generation",
  "immersive_audio_mapping",
  "ad_suitability",
]);

/**
 * @typedef {Object} Creator
 * @property {string} id
 * @property {string} displayName
 * @property {string} email
 * @property {string} role
 * @property {string} verificationState
 */

/**
 * @typedef {Object} CreatorApplication
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {string} company
 * @property {string} portfolioUrl
 * @property {string} creatorType
 * @property {string} verificationState
 * @property {string} moderationStatus
 * @property {string} createdAt
 */

/**
 * @typedef {Object} EmailCapture
 * @property {string} id
 * @property {string} email
 * @property {string} source
 * @property {string} intent
 * @property {string} createdAt
 */

/**
 * @typedef {Object} UploadAsset
 * @property {string} id
 * @property {"video"|"audio"|"cover_art"|"movie"|"trailer"|"poster"} assetType
 * @property {string} originalFilename
 * @property {string} sanitizedFilename
 * @property {string} contentType
 * @property {number} size
 * @property {string} storagePath
 * @property {"pending"|"uploaded"|"rejected"} status
 */

/**
 * @typedef {Object} AIAnalysisJob
 * @property {string} id
 * @property {string} contentId
 * @property {"pending"|"processing"|"completed"|"failed"} status
 * @property {Array<{name:string,status:string}>} tasks
 */

/**
 * @typedef {Object} MonetizationSettings
 * @property {boolean} adSupportedEligible
 * @property {number|null} adSuitabilityScore
 * @property {string} monetizationStatus
 * @property {string} revenueShareTier
 * @property {number|null} estimatedViews
 * @property {number|null} estimatedRevenue
 */

/**
 * @typedef {Object} ContentItem
 * @property {string} id
 * @property {string} creatorId
 * @property {string} title
 * @property {string} description
 * @property {string} genre
 * @property {string} language
 * @property {string} maturityRating
 * @property {string[]} tags
 * @property {string} contentFormat
 * @property {string} seriesTitle
 * @property {number|null} seasonNumber
 * @property {number|null} episodeNumber
 * @property {string[]} discoveryTags
 * @property {string} status
 * @property {string} reviewStatus
 * @property {UploadAsset[]} assets
 * @property {AIAnalysisJob|null} analysisJob
 * @property {MonetizationSettings} monetization
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} CreatorUploadRecord
 * @property {string} id
 * @property {string} contentId
 * @property {string} creatorId
 * @property {string} title
 * @property {string} description
 * @property {string} status
 * @property {UploadAsset[]} assets
 * @property {string} storageProvider
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} AuditLogEntry
 * @property {string} id
 * @property {string} creatorId
 * @property {string} action
 * @property {string} resourceType
 * @property {string} resourceId
 * @property {string} createdAt
 * @property {Object} metadata
 */

export function createAnalysisJob(contentId) {
  return {
    id: crypto.randomUUID(),
    contentId,
    status: "pending",
    tasks: ANALYSIS_TASKS.map(name => ({ name, status: "pending" })),
    createdAt: new Date().toISOString(),
  };
}

export function createDefaultMonetization() {
  return {
    adSupportedEligible: false,
    adSuitabilityScore: null,
    monetizationStatus: "pending_review",
    revenueShareTier: "standard",
    estimatedViews: null,
    estimatedRevenue: null,
  };
}
