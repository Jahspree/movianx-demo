import { getPostHogOpsConfig } from "./posthogMetrics.js";
import { getSystemHealth } from "./systemHealth.js";
import { getSupabaseConfig, hasSupabaseConfig } from "../creator/supabaseUploadStore.js";

const RANGE_OPTIONS = Object.freeze({
  today: { label: "Today", posthogInterval: "1 DAY", days: 1 },
  "7d": { label: "7 Days", posthogInterval: "7 DAY", days: 7 },
  "30d": { label: "30 Days", posthogInterval: "30 DAY", days: 30 },
  "90d": { label: "90 Days", posthogInterval: "90 DAY", days: 90 },
});

const DEFAULT_RANGE = "today";

export function normalizeDashboardRange(value) {
  return RANGE_OPTIONS[value] ? value : DEFAULT_RANGE;
}

export function getDashboardRangeMeta(value) {
  const key = normalizeDashboardRange(value);
  return { key, ...RANGE_OPTIONS[key] };
}

export async function getExecutiveDashboardData({ range = DEFAULT_RANGE, auth, env = process.env, fetchImpl = fetch } = {}) {
  const rangeMeta = getDashboardRangeMeta(range);
  const [posthog, supabase, system] = await Promise.all([
    getPostHogExecutiveMetrics({ rangeMeta, env, fetchImpl }),
    getSupabaseExecutiveMetrics({ rangeMeta, env, fetchImpl }),
    getSystemHealth({ auth }),
  ]);

  const status = {
    posthog: posthog.status,
    supabase: system.supabase.status,
    database: system.database.status,
    storage: system.storage.status,
    environment: system.environment.status,
  };

  return {
    generatedAt: new Date().toISOString(),
    range: rangeMeta,
    status,
    content: {
      moviesStartedToday: posthog.summary.moviesStartedToday,
      moviesCompletedToday: posthog.summary.moviesCompletedToday,
      storiesStartedToday: posthog.summary.storiesStartedToday,
      storiesCompletedToday: posthog.summary.storiesCompletedToday,
      musicPlaysToday: posthog.summary.musicPlaysToday,
      topContent7Days: posthog.topContent7Days,
      topContent30Days: posthog.topContent30Days,
    },
    users: {
      activeUsers: posthog.summary.activeUsers,
      newUsers: posthog.summary.newUsers,
      returningUsers: posthog.summary.returningUsers,
      dailyActiveUsers: posthog.summary.dailyActiveUsers,
      weeklyActiveUsers: posthog.summary.weeklyActiveUsers,
      monthlyActiveUsers: posthog.summary.monthlyActiveUsers,
    },
    engagement: {
      averageWatchTimeSeconds: posthog.summary.averageWatchTimeSeconds,
      completionRate: posthog.summary.completionRate,
      originalSelections: posthog.summary.originalSelections,
      reimaginedSelections: posthog.summary.reimaginedSelections,
      alternateEndingSelections: posthog.summary.alternateSelections,
      mostPopularContent: posthog.topContent30Days[0]?.title || null,
      mostPopularCreator: posthog.topCreators[0]?.name || null,
    },
    creators: supabase.creators,
    moderation: supabase.moderation,
    system,
    charts: {
      userGrowth: posthog.userGrowth,
      watchTime: posthog.watchTime,
      contentPerformance: posthog.topContent7Days.slice(0, 8).map(item => ({
        label: item.title,
        value: item.engagement,
      })),
      creatorGrowth: supabase.creatorGrowth,
      moderationActivity: supabase.moderationActivity,
    },
    sources: {
      posthog: {
        status: posthog.status,
        message: posthog.message,
      },
      supabase: {
        status: supabase.status,
        message: supabase.message,
      },
    },
    errors: [
      ...(posthog.status === "connected" ? [] : [posthog.message]),
      ...(supabase.status === "connected" ? [] : [supabase.message]),
    ].filter(Boolean),
  };
}

export function dashboardToJson(data) {
  return JSON.stringify(data, null, 2);
}

export function dashboardToCsv(data) {
  const rows = [
    ["section", "metric", "value"],
    ...Object.entries(data.content).map(([key, value]) => ["content", key, printable(value)]),
    ...Object.entries(data.users).map(([key, value]) => ["users", key, printable(value)]),
    ...Object.entries(data.engagement).map(([key, value]) => ["engagement", key, printable(value)]),
    ...Object.entries(data.creators).map(([key, value]) => ["creators", key, printable(value)]),
    ...Object.entries(data.moderation).map(([key, value]) => ["moderation", key, printable(value)]),
    ...Object.entries(data.status).map(([key, value]) => ["system", key, printable(value)]),
  ];
  return rows.map(row => row.map(csvCell).join(",")).join("\n");
}

async function getPostHogExecutiveMetrics({ rangeMeta, env, fetchImpl }) {
  const config = getPostHogOpsConfig(env);
  if (!config.connected) return emptyPostHog("PostHog query credentials are not configured.");

  const interval = rangeMeta.posthogInterval;
  const todayInterval = "1 DAY";

  const summaryQuery = `
    SELECT
      uniqIf(distinct_id, timestamp >= now() - INTERVAL 5 MINUTE) AS active_users,
      uniqIf(distinct_id, timestamp >= now() - INTERVAL ${interval}) AS range_active_users,
      uniqIf(distinct_id, timestamp >= now() - INTERVAL 1 DAY) AS daily_active_users,
      uniqIf(distinct_id, timestamp >= now() - INTERVAL 7 DAY) AS weekly_active_users,
      uniqIf(distinct_id, timestamp >= now() - INTERVAL 30 DAY) AS monthly_active_users,
      uniqIf(distinct_id, timestamp >= now() - INTERVAL ${interval} AND person.created_at >= now() - INTERVAL ${interval}) AS new_users,
      greatest(uniqIf(distinct_id, timestamp >= now() - INTERVAL ${interval}) - uniqIf(distinct_id, timestamp >= now() - INTERVAL ${interval} AND person.created_at >= now() - INTERVAL ${interval}), 0) AS returning_users,
      countIf(event = 'movie_started' AND timestamp >= now() - INTERVAL ${todayInterval}) AS movies_started_today,
      countIf(event = 'movie_completed' AND timestamp >= now() - INTERVAL ${todayInterval}) AS movies_completed_today,
      countIf(event = 'story_started' AND timestamp >= now() - INTERVAL ${todayInterval}) AS stories_started_today,
      countIf(event = 'story_completed' AND timestamp >= now() - INTERVAL ${todayInterval}) AS stories_completed_today,
      countIf(event = 'music_started' AND timestamp >= now() - INTERVAL ${todayInterval}) AS music_plays_today,
      countIf(event = 'original_version_selected' AND timestamp >= now() - INTERVAL ${interval}) AS original_selections,
      countIf(event = 'reimagined_version_selected' AND timestamp >= now() - INTERVAL ${interval}) AS reimagined_selections,
      countIf(event = 'alternate_ending_selected' AND timestamp >= now() - INTERVAL ${interval}) AS alternate_selections,
      avgOrNull(toFloatOrNull(coalesce(properties['watch_duration'], properties['play_duration'], properties['duration'], properties['watch_time']))) AS average_watch_time_seconds,
      countIf(event IN ('movie_completed', 'story_completed', 'music_completed') AND timestamp >= now() - INTERVAL ${interval}) AS completions,
      countIf(event IN ('movie_started', 'story_started', 'music_started') AND timestamp >= now() - INTERVAL ${interval}) AS starts
    FROM events
    WHERE timestamp >= now() - INTERVAL 90 DAY
      AND (
        event = '$pageview' OR
        event IN ('movie_started','movie_completed','story_started','story_completed','music_started','music_completed','original_version_selected','reimagined_version_selected','alternate_ending_selected')
      )
  `;

  try {
    const [summary, top7, top30, creators, userGrowth, watchTime] = await Promise.all([
      posthogQuery(summaryQuery, "executive summary", config, fetchImpl),
      posthogQuery(topContentQuery("7 DAY"), "top content 7 days", config, fetchImpl),
      posthogQuery(topContentQuery("30 DAY"), "top content 30 days", config, fetchImpl),
      posthogQuery(topCreatorsQuery(interval), "top creators", config, fetchImpl),
      posthogQuery(userGrowthQuery(interval), "user growth", config, fetchImpl),
      posthogQuery(watchTimeQuery(interval), "watch time", config, fetchImpl),
    ]);
    return shapePostHogExecutive({ summary, top7, top30, creators, userGrowth, watchTime });
  } catch (error) {
    return emptyPostHog(error?.message || "PostHog query failed.", "error");
  }
}

async function getSupabaseExecutiveMetrics({ rangeMeta, env, fetchImpl }) {
  const config = getSupabaseConfig();
  if (!hasSupabaseConfig()) {
    return emptySupabase("Supabase service role key is not configured.");
  }

  try {
    const [records, audit] = await Promise.all([
      supabaseRest("creator_upload_records?select=id,creator_id,status,created_at,updated_at&order=created_at.desc&limit=10000", config, fetchImpl),
      supabaseRest("creator_upload_audit_logs?select=id,actor_id,action,record_id,created_at&order=created_at.desc&limit=10000", config, fetchImpl),
    ]);
    return shapeSupabaseExecutive({ records, audit, rangeMeta });
  } catch (error) {
    return emptySupabase(error?.message || "Supabase dashboard query failed.", "error");
  }
}

function shapePostHogExecutive({ summary, top7, top30, creators, userGrowth, watchTime }) {
  const row = summary?.results?.[0] || [];
  const starts = numeric(row[18]);
  const completions = numeric(row[17]);
  return {
    status: "connected",
    message: "PostHog executive metrics loaded.",
    summary: {
      activeUsers: numeric(row[0]),
      rangeActiveUsers: numeric(row[1]),
      dailyActiveUsers: numeric(row[2]),
      weeklyActiveUsers: numeric(row[3]),
      monthlyActiveUsers: numeric(row[4]),
      newUsers: numeric(row[5]),
      returningUsers: numeric(row[6]),
      moviesStartedToday: numeric(row[7]),
      moviesCompletedToday: numeric(row[8]),
      storiesStartedToday: numeric(row[9]),
      storiesCompletedToday: numeric(row[10]),
      musicPlaysToday: numeric(row[11]),
      originalSelections: numeric(row[12]),
      reimaginedSelections: numeric(row[13]),
      alternateSelections: numeric(row[14]),
      averageWatchTimeSeconds: nullableNumber(row[15]),
      completionRate: starts ? Math.round((completions / starts) * 100) : null,
    },
    topContent7Days: shapeRanked(top7?.results),
    topContent30Days: shapeRanked(top30?.results),
    topCreators: shapeCreatorRanked(creators?.results),
    userGrowth: shapeChart(userGrowth?.results),
    watchTime: shapeChart(watchTime?.results),
  };
}

function shapeSupabaseExecutive({ records = [], audit = [], rangeMeta }) {
  const since = Date.now() - rangeMeta.days * 24 * 60 * 60 * 1000;
  const today = startOfToday();
  const recentRecords = records.filter(record => timestamp(record.created_at) >= since);
  const recentAudit = audit.filter(entry => timestamp(entry.created_at) >= since);
  const audit24 = audit.filter(entry => timestamp(entry.created_at) >= Date.now() - 24 * 60 * 60 * 1000);
  const creators = new Set(records.map(record => record.creator_id).filter(Boolean));

  return {
    status: "connected",
    message: "Supabase creator and moderation data loaded.",
    creators: {
      totalCreators: creators.size,
      uploadCount: records.length,
      publishedCount: countStatus(records, "published"),
      pendingReviewCount: countStatuses(records, ["uploaded", "processing", "under_review", "flagged"]),
      rejectedCount: countStatus(records, "rejected"),
    },
    moderation: {
      pendingReviews: countStatuses(records, ["under_review", "flagged"]),
      approvedContent: countStatus(records, "approved"),
      rejectedContent: countStatus(records, "rejected"),
      flaggedContent: countStatus(records, "flagged"),
      moderationActionsLast24Hours: audit24.length,
    },
    creatorGrowth: bucketByDay(recentRecords, "created_at", rangeMeta.days),
    moderationActivity: bucketByDay(recentAudit, "created_at", rangeMeta.days),
    todayUploads: records.filter(record => timestamp(record.created_at) >= today).length,
  };
}

function emptyPostHog(message, status = "not_connected") {
  return {
    status,
    message,
    summary: {
      activeUsers: null,
      rangeActiveUsers: null,
      dailyActiveUsers: null,
      weeklyActiveUsers: null,
      monthlyActiveUsers: null,
      newUsers: null,
      returningUsers: null,
      moviesStartedToday: null,
      moviesCompletedToday: null,
      storiesStartedToday: null,
      storiesCompletedToday: null,
      musicPlaysToday: null,
      originalSelections: null,
      reimaginedSelections: null,
      alternateSelections: null,
      averageWatchTimeSeconds: null,
      completionRate: null,
    },
    topContent7Days: [],
    topContent30Days: [],
    topCreators: [],
    userGrowth: [],
    watchTime: [],
  };
}

function emptySupabase(message, status = "not_connected") {
  return {
    status,
    message,
    creators: {
      totalCreators: null,
      uploadCount: null,
      publishedCount: null,
      pendingReviewCount: null,
      rejectedCount: null,
    },
    moderation: {
      pendingReviews: null,
      approvedContent: null,
      rejectedContent: null,
      flaggedContent: null,
      moderationActionsLast24Hours: null,
    },
    creatorGrowth: [],
    moderationActivity: [],
  };
}

function topContentQuery(interval) {
  return `
    SELECT
      coalesce(properties['movie_title'], properties['story_title'], properties['song_title'], properties['content_title'], properties['movie_id'], properties['story_id'], properties['song_id'], 'Unknown content') AS content_title,
      countIf(event IN ('movie_started','story_started','music_started')) AS starts,
      countIf(event IN ('movie_completed','story_completed','music_completed')) AS completions,
      count() AS engagement
    FROM events
    WHERE timestamp >= now() - INTERVAL ${interval}
      AND event IN ('movie_started','movie_completed','story_started','story_completed','music_started','music_completed')
    GROUP BY content_title
    ORDER BY engagement DESC
    LIMIT 10
  `;
}

function topCreatorsQuery(interval) {
  return `
    SELECT
      coalesce(properties['creator_name'], properties['artist_name'], 'Unknown creator') AS creator_name,
      count() AS engagement
    FROM events
    WHERE timestamp >= now() - INTERVAL ${interval}
      AND event IN ('movie_started','movie_completed','story_started','story_completed','music_started','music_completed','creator_profile_viewed')
    GROUP BY creator_name
    ORDER BY engagement DESC
    LIMIT 10
  `;
}

function userGrowthQuery(interval) {
  return `
    SELECT toDate(timestamp) AS day, uniq(distinct_id) AS value
    FROM events
    WHERE timestamp >= now() - INTERVAL ${interval}
      AND event = '$pageview'
    GROUP BY day
    ORDER BY day ASC
    LIMIT 100
  `;
}

function watchTimeQuery(interval) {
  return `
    SELECT
      toDate(timestamp) AS day,
      avgOrNull(toFloatOrNull(coalesce(properties['watch_duration'], properties['play_duration'], properties['duration'], properties['watch_time']))) AS value
    FROM events
    WHERE timestamp >= now() - INTERVAL ${interval}
      AND event IN ('movie_completed','story_completed','music_completed')
    GROUP BY day
    ORDER BY day ASC
    LIMIT 100
  `;
}

async function posthogQuery(query, name, config, fetchImpl) {
  const response = await fetchImpl(`${config.apiHost}/api/projects/${config.projectId}/query/`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.personalApiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`${name} query failed with ${response.status}`);
  return response.json();
}

async function supabaseRest(path, config, fetchImpl) {
  const response = await fetchImpl(`${trimSlash(config.url)}/rest/v1/${path}`, {
    headers: {
      authorization: `Bearer ${config.serviceKey}`,
      apikey: config.serviceKey,
      "content-type": "application/json",
    },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Supabase query failed with ${response.status}`);
  const text = await response.text();
  return text ? JSON.parse(text) : [];
}

function shapeRanked(rows = []) {
  return rows.map(row => ({
    title: label(row[0]),
    starts: numeric(row[1]),
    completions: numeric(row[2]),
    engagement: numeric(row[3]),
  }));
}

function shapeCreatorRanked(rows = []) {
  return rows.map(row => ({
    name: label(row[0], "Unknown creator"),
    engagement: numeric(row[1]),
  }));
}

function shapeChart(rows = []) {
  return rows.map(row => ({
    label: String(row[0] || ""),
    value: numeric(row[1]),
  }));
}

function bucketByDay(rows, field, days) {
  const buckets = new Map();
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = date.toISOString().slice(0, 10);
    buckets.set(key, 0);
  }
  rows.forEach(row => {
    const key = String(row[field] || "").slice(0, 10);
    if (buckets.has(key)) buckets.set(key, buckets.get(key) + 1);
  });
  return Array.from(buckets.entries()).map(([label, value]) => ({ label, value }));
}

function countStatus(records, status) {
  return records.filter(record => record.status === status).length;
}

function countStatuses(records, statuses) {
  return records.filter(record => statuses.includes(record.status)).length;
}

function timestamp(value) {
  return value ? new Date(value).getTime() : 0;
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

function numeric(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function nullableNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function label(value, fallback = "Unknown content") {
  const text = String(value || "").trim();
  return text || fallback;
}

function printable(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return value;
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function trimSlash(value) {
  return String(value || "").replace(/\/+$/, "");
}
