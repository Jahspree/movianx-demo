import { CONSUMER_EXPERIENCES } from "../../data/consumerExperiences.js";
import { getSupabaseConfig, hasSupabaseConfig } from "../creator/supabaseUploadStore.js";

const TABLES = Object.freeze({
  views: "user_content_views",
  completions: "user_content_completions",
  likes: "user_content_likes",
  creatorAffinity: "user_creator_affinity",
  contentAffinity: "content_affinity",
  genreAffinity: "genre_affinity",
  viewerSimilarity: "viewer_similarity",
  recommendationEvents: "recommendation_events",
});

const DEFAULT_LIMIT = 12;

const SEEDED_AFFINITY = Object.freeze([
  {
    sourceContentId: "nosferatu",
    targetContentId: "story-3",
    affinityScore: 0.91,
    relationshipType: "similar_content",
    reason: "Shared dread, nighttime vulnerability, and psychological horror pacing.",
  },
  {
    sourceContentId: "nosferatu",
    targetContentId: "wraith",
    affinityScore: 0.87,
    relationshipType: "similar_content",
    reason: "Silent-era shadow language mapped to spectral atmospheric discovery.",
  },
  {
    sourceContentId: "wraith",
    targetContentId: "sirens",
    affinityScore: 0.82,
    relationshipType: "similar_content",
    reason: "Shared supernatural atmosphere and slow-burn sensory tension.",
  },
  {
    sourceContentId: "night-of-the-living-dead",
    targetContentId: "story-3",
    affinityScore: 0.89,
    relationshipType: "because_you_watched",
    reason: "Survival pressure and home-invasion panic sit in the same emotional corridor.",
  },
  {
    sourceContentId: "story-3",
    targetContentId: "music-echoes-in-orbit",
    affinityScore: 0.64,
    relationshipType: "you_may_also_like",
    reason: "A controlled descent from panic into spatial memory and quiet signal.",
  },
]);

export function getRecommendationPersistenceMode() {
  return hasSupabaseConfig() ? "supabase" : "development-memory";
}

export async function recordMovieRecommendationSignal({
  userId,
  sessionId,
  contentId,
  event,
  watchDurationSeconds = 0,
  completionPercentage = 0,
  metadata = {},
} = {}) {
  return recordContentSignal({
    userId,
    sessionId,
    contentId,
    contentType: "movie",
    event,
    watchDurationSeconds,
    completionPercentage,
    metadata,
  });
}

export async function recordStoryRecommendationSignal({
  userId,
  sessionId,
  contentId,
  event,
  pagesViewed = 0,
  modeSelected = "",
  endingSelected = "",
  metadata = {},
} = {}) {
  return recordContentSignal({
    userId,
    sessionId,
    contentId,
    contentType: "story",
    event,
    pagesViewed,
    modeSelected,
    endingSelected,
    completionPercentage: event === "completed" ? 100 : 0,
    metadata,
  });
}

export async function recordMusicRecommendationSignal({
  userId,
  sessionId,
  contentId,
  event,
  replayCount = 0,
  listeningDurationSeconds = 0,
  metadata = {},
} = {}) {
  return recordContentSignal({
    userId,
    sessionId,
    contentId,
    contentType: "music",
    event,
    replayCount,
    listeningDurationSeconds,
    completionPercentage: event === "completed" ? 100 : 0,
    metadata,
  });
}

export async function recordCreatorRecommendationSignal({
  userId,
  creatorId,
  event,
  metadata = {},
} = {}) {
  assertText(userId, "userId");
  assertText(creatorId, "creatorId");
  const normalizedEvent = normalizeCreatorEvent(event);

  if (!hasSupabaseConfig()) {
    return {
      mode: "development-memory",
      userId,
      creatorId,
      event: normalizedEvent,
      stored: false,
    };
  }

  const existing = await selectRows(`${TABLES.creatorAffinity}?user_id=eq.${encodeURIComponent(userId)}&creator_id=eq.${encodeURIComponent(creatorId)}&limit=1`);
  const current = existing?.[0] || {};
  const profileViews = numeric(current.profile_views) + (normalizedEvent === "profile_viewed" ? 1 : 0);
  const contentConsumedCount = numeric(current.content_consumed_count) + (normalizedEvent === "creator_content_consumed" ? 1 : 0);
  const followed = Boolean(current.followed) || normalizedEvent === "creator_followed";
  const affinityScore = Math.min(1, profileViews * 0.08 + contentConsumedCount * 0.18 + (followed ? 0.35 : 0));

  const rows = await supabaseRest(`${TABLES.creatorAffinity}?on_conflict=user_id,creator_id&select=*`, {
    method: "POST",
    headers: { prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify([{
      user_id: userId,
      creator_id: creatorId,
      profile_views: profileViews,
      followed,
      content_consumed_count: contentConsumedCount,
      affinity_score: roundScore(affinityScore),
      last_event_at: new Date().toISOString(),
      metadata: sanitizeMetadata(metadata),
    }]),
  });

  return fromCreatorAffinity(rows?.[0]);
}

export async function recordRecommendationEvent({
  userId,
  sessionId,
  recommendationType,
  sourceContentId,
  recommendedContentId,
  creatorId,
  score = 0,
  position = 0,
  outcome = "shown",
  context = "",
  metadata = {},
} = {}) {
  const type = normalizeRecommendationType(recommendationType);
  const normalizedOutcome = normalizeRecommendationOutcome(outcome);

  if (!hasSupabaseConfig()) {
    return {
      id: "development-memory",
      recommendationType: type,
      sourceContentId,
      recommendedContentId,
      outcome: normalizedOutcome,
      stored: false,
    };
  }

  const rows = await supabaseRest(`${TABLES.recommendationEvents}?select=*`, {
    method: "POST",
    headers: { prefer: "return=representation" },
    body: JSON.stringify([{
      user_id: userId || null,
      session_id: sessionId || null,
      recommendation_type: type,
      source_content_id: sourceContentId || null,
      recommended_content_id: recommendedContentId || null,
      creator_id: creatorId || null,
      score: roundScore(score),
      position: Number(position) || 0,
      outcome: normalizedOutcome,
      context: String(context || "").slice(0, 120),
      metadata: sanitizeMetadata(metadata),
    }]),
  });

  return fromRecommendationEvent(rows?.[0]);
}

export async function getRecommendationsForUser({ userId, contentId, limit = DEFAULT_LIMIT } = {}) {
  const cap = normalizeLimit(limit);
  if (!hasSupabaseConfig()) {
    return getFallbackRecommendations({ contentId, limit: cap, reason: "Supabase not configured." });
  }

  try {
    const [creatorAffinity, genreAffinity, similarViewers, similarContent, trending] = await Promise.all([
      userId ? selectRows(`${TABLES.creatorAffinity}?user_id=eq.${encodeURIComponent(userId)}&order=affinity_score.desc&limit=8`) : [],
      userId ? selectRows(`${TABLES.genreAffinity}?user_id=eq.${encodeURIComponent(userId)}&order=affinity_score.desc&limit=8`) : [],
      userId ? selectRows(`${TABLES.viewerSimilarity}?user_id=eq.${encodeURIComponent(userId)}&order=similarity_score.desc&limit=8`) : [],
      contentId ? selectRows(`${TABLES.contentAffinity}?source_content_id=eq.${encodeURIComponent(contentId)}&order=affinity_score.desc&limit=${cap}`) : [],
      getTrendingContent({ limit: cap }),
    ]);

    const ids = [
      ...similarContent.map(row => row.target_content_id),
      ...similarViewers.flatMap(row => row.shared_content || []),
      ...trending.map(item => item.contentId),
    ].filter(Boolean);

    return uniqueRecommendations(ids, cap).map((id, index) => ({
      ...contentSummary(id),
      score: scoreFor(id, similarContent, trending, index),
      reason: recommendationReason(id, { similarContent, creatorAffinity, genreAffinity }),
      recommendationType: index === 0 ? "because_you_watched" : "you_may_also_like",
    }));
  } catch (error) {
    return getFallbackRecommendations({ contentId, limit: cap, reason: error.message });
  }
}

export async function getSimilarContent({ contentId, limit = DEFAULT_LIMIT } = {}) {
  assertText(contentId, "contentId");
  const cap = normalizeLimit(limit);

  if (!hasSupabaseConfig()) {
    return seededSimilar(contentId, cap);
  }

  const rows = await selectRows(`${TABLES.contentAffinity}?source_content_id=eq.${encodeURIComponent(contentId)}&order=affinity_score.desc&limit=${cap}`);
  return rows.map(fromContentAffinity);
}

export async function getTrendingContent({ days = 7, limit = DEFAULT_LIMIT } = {}) {
  const cap = normalizeLimit(limit);
  const since = Date.now() - normalizeDays(days) * 24 * 60 * 60 * 1000;

  if (!hasSupabaseConfig()) {
    return contentCatalog().slice(0, cap).map((content, index) => ({
      contentId: content.id,
      title: content.title,
      contentType: content.contentType,
      starts: 0,
      completions: 0,
      score: roundScore(1 - index * 0.05),
      source: "catalog-fallback",
    }));
  }

  const [views, completions, likes] = await Promise.all([
    selectRows(`${TABLES.views}?select=content_id,content_type,created_at&created_at=gte.${new Date(since).toISOString()}&limit=10000`),
    selectRows(`${TABLES.completions}?select=content_id,content_type,completed_at&completed_at=gte.${new Date(since).toISOString()}&limit=10000`),
    selectRows(`${TABLES.likes}?select=content_id,content_type,liked_at&liked_at=gte.${new Date(since).toISOString()}&limit=10000`),
  ]);

  const scores = new Map();
  for (const row of views) addTrend(scores, row, 1);
  for (const row of completions) addTrend(scores, row, 3, "completions");
  for (const row of likes) addTrend(scores, row, 2, "likes");

  return [...scores.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, cap)
    .map(item => ({ ...contentSummary(item.contentId), ...item, score: roundScore(item.score) }));
}

export async function getCreatorRecommendations({ userId, limit = DEFAULT_LIMIT } = {}) {
  const cap = normalizeLimit(limit);
  if (!hasSupabaseConfig() || !userId) {
    return creatorCatalog().slice(0, cap).map((creator, index) => ({
      ...creator,
      score: roundScore(1 - index * 0.08),
      reason: "Editorial creator discovery fallback.",
    }));
  }

  const rows = await selectRows(`${TABLES.creatorAffinity}?user_id=eq.${encodeURIComponent(userId)}&order=affinity_score.desc&limit=${cap}`);
  return rows.map(row => ({
    creatorId: row.creator_id,
    title: creatorCatalog().find(creator => creator.creatorId === row.creator_id)?.title || row.creator_id,
    score: Number(row.affinity_score) || 0,
    reason: row.followed ? "Followed creator." : "Creator affinity from viewing behavior.",
  }));
}

export async function getOpsRecommendationSnapshot({ limit = 25 } = {}) {
  const cap = normalizeLimit(limit, 50);
  if (!hasSupabaseConfig()) {
    return {
      mode: "development-memory",
      status: "not_configured",
      message: "Supabase service role key is not configured.",
      contentAffinity: SEEDED_AFFINITY,
      viewerSimilarity: [],
      recommendationEvents: [],
      trendingContent: await getTrendingContent({ limit: 10 }),
      generationStatus: {
        contentAffinityRecords: SEEDED_AFFINITY.length,
        viewerSimilarityRecords: 0,
        recommendationEvents: 0,
        lastRecommendationEventAt: null,
      },
    };
  }

  try {
    const [contentAffinity, viewerSimilarity, recommendationEvents, trendingContent] = await Promise.all([
      selectRows(`${TABLES.contentAffinity}?select=*&order=affinity_score.desc&limit=${cap}`),
      selectRows(`${TABLES.viewerSimilarity}?select=*&order=similarity_score.desc&limit=${cap}`),
      selectRows(`${TABLES.recommendationEvents}?select=*&order=created_at.desc&limit=${cap}`),
      getTrendingContent({ limit: 10 }),
    ]);

    return {
      mode: "supabase",
      status: "connected",
      message: "Recommendation infrastructure connected.",
      contentAffinity: contentAffinity.map(fromContentAffinity),
      viewerSimilarity: viewerSimilarity.map(fromViewerSimilarity),
      recommendationEvents: recommendationEvents.map(fromRecommendationEvent),
      trendingContent,
      generationStatus: {
        contentAffinityRecords: contentAffinity.length,
        viewerSimilarityRecords: viewerSimilarity.length,
        recommendationEvents: recommendationEvents.length,
        lastRecommendationEventAt: recommendationEvents[0]?.created_at || null,
      },
    };
  } catch (error) {
    return {
      mode: "supabase",
      status: "error",
      message: error.message,
      contentAffinity: [],
      viewerSimilarity: [],
      recommendationEvents: [],
      trendingContent: [],
      generationStatus: {
        contentAffinityRecords: 0,
        viewerSimilarityRecords: 0,
        recommendationEvents: 0,
        lastRecommendationEventAt: null,
      },
    };
  }
}

async function recordContentSignal(signal) {
  assertText(signal.userId, "userId");
  assertText(signal.contentId, "contentId");
  const event = normalizeContentEvent(signal.event);
  const row = {
    user_id: signal.userId,
    session_id: signal.sessionId || null,
    content_id: signal.contentId,
    content_type: signal.contentType,
    watch_duration_seconds: numeric(signal.watchDurationSeconds),
    completion_percentage: clampPercentage(signal.completionPercentage),
    pages_viewed: numeric(signal.pagesViewed),
    mode_selected: signal.modeSelected || null,
    ending_selected: signal.endingSelected || null,
    replay_count: numeric(signal.replayCount),
    listening_duration_seconds: numeric(signal.listeningDurationSeconds),
    metadata: sanitizeMetadata(signal.metadata),
  };

  if (!hasSupabaseConfig()) {
    return { ...fromSignalRow({ ...row, event_type: event, created_at: new Date().toISOString() }), stored: false };
  }

  const table = event === "completed" ? TABLES.completions : TABLES.views;
  const timestamped = event === "completed"
    ? { ...row, completed_at: new Date().toISOString() }
    : { ...row, event_type: event, created_at: new Date().toISOString() };
  const rows = await supabaseRest(`${table}?select=*`, {
    method: "POST",
    headers: { prefer: "return=representation" },
    body: JSON.stringify([timestamped]),
  });

  return fromSignalRow(rows?.[0]);
}

async function selectRows(path) {
  return supabaseRest(path);
}

async function supabaseRest(path, options = {}) {
  const config = getSupabaseConfig();
  const response = await fetch(`${trimSlash(config.url)}/rest/v1/${path}`, {
    ...options,
    headers: {
      authorization: `Bearer ${config.serviceKey}`,
      apikey: config.serviceKey,
      "content-type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await safeResponseText(response);
    throw new Error(`Supabase recommendation request failed: ${response.status} ${message}`);
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function getFallbackRecommendations({ contentId, limit, reason }) {
  const similar = contentId ? seededSimilar(contentId, limit) : [];
  const fallbackIds = [
    ...similar.map(item => item.targetContentId),
    ...contentCatalog().map(item => item.id),
  ];
  return uniqueRecommendations(fallbackIds, limit).map((id, index) => ({
    ...contentSummary(id),
    score: roundScore(0.75 - index * 0.04),
    reason: index === 0 && reason ? reason : "Catalog fallback recommendation.",
    recommendationType: index === 0 ? "because_you_watched" : "you_may_also_like",
  }));
}

function seededSimilar(contentId, limit) {
  return SEEDED_AFFINITY
    .filter(item => item.sourceContentId === contentId)
    .sort((a, b) => b.affinityScore - a.affinityScore)
    .slice(0, limit);
}

function contentCatalog() {
  return CONSUMER_EXPERIENCES.map(experience => ({
    id: experience.id,
    title: experience.title,
    creator: experience.creator,
    contentType: inferContentType(experience),
    genre: experience.genre,
  }));
}

function creatorCatalog() {
  const creators = new Map();
  CONSUMER_EXPERIENCES.forEach(experience => {
    const creatorId = slugify(experience.creator || experience.id);
    if (!creators.has(creatorId)) {
      creators.set(creatorId, {
        creatorId,
        title: experience.creator || experience.title,
        sampleContentId: experience.id,
      });
    }
  });
  return [...creators.values()];
}

function contentSummary(contentId) {
  const content = contentCatalog().find(item => item.id === contentId);
  return {
    contentId,
    title: content?.title || titleize(contentId),
    contentType: content?.contentType || "unknown",
    creator: content?.creator || "Unknown",
    genre: content?.genre || "Unclassified",
  };
}

function addTrend(scores, row, weight, bucket = "starts") {
  const id = row.content_id;
  if (!id) return;
  const existing = scores.get(id) || {
    contentId: id,
    contentType: row.content_type || "unknown",
    starts: 0,
    completions: 0,
    likes: 0,
    score: 0,
    source: "supabase",
  };
  if (bucket === "starts") existing.starts += 1;
  if (bucket === "completions") existing.completions += 1;
  if (bucket === "likes") existing.likes += 1;
  existing.score += weight;
  scores.set(id, existing);
}

function uniqueRecommendations(ids, limit) {
  return [...new Set(ids.filter(Boolean))].slice(0, limit);
}

function scoreFor(id, similarContent, trending, index) {
  const affinity = similarContent.find(row => row.target_content_id === id);
  const trend = trending.find(row => row.contentId === id);
  return roundScore(Number(affinity?.affinity_score) || Number(trend?.score) || (0.5 - index * 0.03));
}

function recommendationReason(id, { similarContent, creatorAffinity, genreAffinity }) {
  const affinity = similarContent.find(row => row.target_content_id === id);
  if (affinity?.reason) return affinity.reason;
  if (creatorAffinity.length) return "Creator affinity signal.";
  if (genreAffinity.length) return "Genre affinity signal.";
  return "Viewing pattern signal.";
}

function fromSignalRow(row = {}) {
  return {
    id: row.id,
    userId: row.user_id,
    sessionId: row.session_id,
    contentId: row.content_id,
    contentType: row.content_type,
    event: row.event_type || "completed",
    watchDurationSeconds: numeric(row.watch_duration_seconds),
    completionPercentage: Number(row.completion_percentage) || 0,
    pagesViewed: numeric(row.pages_viewed),
    modeSelected: row.mode_selected || "",
    endingSelected: row.ending_selected || "",
    replayCount: numeric(row.replay_count),
    listeningDurationSeconds: numeric(row.listening_duration_seconds),
    createdAt: row.created_at || row.completed_at,
  };
}

function fromCreatorAffinity(row = {}) {
  return {
    id: row.id,
    userId: row.user_id,
    creatorId: row.creator_id,
    profileViews: numeric(row.profile_views),
    followed: Boolean(row.followed),
    contentConsumedCount: numeric(row.content_consumed_count),
    affinityScore: Number(row.affinity_score) || 0,
    lastEventAt: row.last_event_at,
  };
}

function fromContentAffinity(row = {}) {
  return {
    id: row.id,
    sourceContentId: row.source_content_id,
    targetContentId: row.target_content_id,
    affinityScore: Number(row.affinity_score) || 0,
    relationshipType: row.relationship_type,
    reason: row.reason || "",
    generatedAt: row.generated_at,
    ...contentSummary(row.target_content_id),
  };
}

function fromViewerSimilarity(row = {}) {
  return {
    id: row.id,
    userId: row.user_id,
    similarUserId: row.similar_user_id,
    similarityScore: Number(row.similarity_score) || 0,
    sharedGenres: row.shared_genres || [],
    sharedCreators: row.shared_creators || [],
    sharedContent: row.shared_content || [],
    generatedAt: row.generated_at,
  };
}

function fromRecommendationEvent(row = {}) {
  return {
    id: row.id,
    userId: row.user_id,
    sessionId: row.session_id,
    recommendationType: row.recommendation_type,
    sourceContentId: row.source_content_id,
    recommendedContentId: row.recommended_content_id,
    creatorId: row.creator_id,
    score: Number(row.score) || 0,
    position: numeric(row.position),
    outcome: row.outcome,
    context: row.context || "",
    createdAt: row.created_at,
  };
}

function normalizeContentEvent(value) {
  if (value === "completed") return value;
  if (value === "progress" || value === "replay") return value;
  return "started";
}

function normalizeCreatorEvent(value) {
  if (value === "creator_followed" || value === "creator_content_consumed") return value;
  return "profile_viewed";
}

function normalizeRecommendationType(value) {
  const allowed = new Set(["because_you_watched", "similar_content", "you_may_also_like", "popular_with_viewers_like_you", "creator_recommendation", "trending"]);
  return allowed.has(value) ? value : "you_may_also_like";
}

function normalizeRecommendationOutcome(value) {
  const allowed = new Set(["shown", "clicked", "dismissed", "started", "completed"]);
  return allowed.has(value) ? value : "shown";
}

function inferContentType(experience) {
  const format = String(experience.contentFormat || experience.mediaType || "").toLowerCase();
  if (format.includes("music")) return "music";
  if (format.includes("story")) return "story";
  if (format.includes("creator")) return "creator";
  return "movie";
}

function sanitizeMetadata(metadata = {}) {
  const safe = {};
  Object.entries(metadata || {}).forEach(([key, value]) => {
    if (/token|secret|password|key|authorization|cookie/i.test(key)) return;
    safe[String(key).slice(0, 60)] = typeof value === "string" ? value.slice(0, 500) : value;
  });
  return safe;
}

function assertText(value, name) {
  if (!value || typeof value !== "string") throw new Error(`${name} is required`);
}

function numeric(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.round(number)) : 0;
}

function clampPercentage(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(100, number));
}

function normalizeLimit(value, max = 100) {
  const number = Number(value);
  if (!Number.isFinite(number)) return DEFAULT_LIMIT;
  return Math.max(1, Math.min(max, Math.round(number)));
}

function normalizeDays(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 7;
  return Math.max(1, Math.min(365, Math.round(number)));
}

function roundScore(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.round(Math.max(0, Math.min(1, number)) * 10000) / 10000;
}

function titleize(value) {
  return String(value || "Unknown")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, char => char.toUpperCase());
}

function slugify(value) {
  return String(value || "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "unknown";
}

async function safeResponseText(response) {
  const text = await response.text().catch(() => "");
  return text.slice(0, 300);
}

function trimSlash(value) {
  return String(value || "").replace(/\/+$/, "");
}
