const POSTHOG_US_HOST = "https://us.posthog.com";

const METRIC_EVENTS = Object.freeze({
  moviesStarted: "movie_started",
  moviesCompleted: "movie_completed",
  storiesStarted: "story_started",
  storiesCompleted: "story_completed",
  originalSelections: "original_version_selected",
  reimaginedSelections: "reimagined_version_selected",
  alternateSelections: "alternate_ending_selected",
});

const MOVIANX_EVENT_NAMES = Object.freeze(Object.values(METRIC_EVENTS));

export function getPostHogOpsConfig(env = process.env) {
  const personalApiKey = env.POSTHOG_PERSONAL_API_KEY || env.POSTHOG_API_KEY;
  const projectId = env.POSTHOG_PROJECT_ID || env.POSTHOG_PROJECT;
  const apiHost = (env.POSTHOG_API_HOST || POSTHOG_US_HOST).replace(/\/$/, "");

  return {
    apiHost,
    personalApiKey,
    projectId,
    connected: Boolean(personalApiKey && projectId),
  };
}

function emptyMetrics(status = "not_connected", message = "PostHog query credentials are not configured.") {
  return {
    status,
    message,
    generatedAt: new Date().toISOString(),
    rangeLabel: "Last 24 hours",
    summary: {
      activeUsers: null,
      dailyVisitors: null,
      moviesStarted: null,
      moviesCompleted: null,
      storiesStarted: null,
      storiesCompleted: null,
      originalSelections: null,
      reimaginedSelections: null,
      alternateSelections: null,
      averageWatchTimeSeconds: null,
    },
    topContent: [],
    topCreators: [],
    recentActivity: [],
    instrumentation: {
      requiredEvents: MOVIANX_EVENT_NAMES,
      detected: [],
      missing: MOVIANX_EVENT_NAMES,
    },
  };
}

function numeric(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function label(value, fallback = "Unknown") {
  const text = String(value || "").trim();
  return text || fallback;
}

function formatActivity(row = []) {
  const [timestamp, event, contentTitle, contentType, creatorName, mode, distinctId] = row;
  return {
    timestamp,
    event,
    contentTitle: label(contentTitle, "Unknown content"),
    contentType: label(contentType, "Experience"),
    creatorName: label(creatorName, "Unknown creator"),
    mode: label(mode, "standard"),
    distinctId: distinctId ? String(distinctId).slice(0, 10) : "anonymous",
  };
}

export function shapeOpsMetrics(results = {}) {
  const summaryRows = results.summary?.results || [];
  const summary = summaryRows[0] || [];
  const topContent = (results.topContent?.results || []).map(row => ({
    title: label(row[0], "Unknown content"),
    type: label(row[1], "Experience"),
    starts: numeric(row[2]),
    completions: numeric(row[3]),
    engagement: numeric(row[4]),
  }));
  const topCreators = (results.topCreators?.results || []).map(row => ({
    name: label(row[0], "Unknown creator"),
    starts: numeric(row[1]),
    completions: numeric(row[2]),
    engagement: numeric(row[3]),
  }));
  const detected = (results.detectedEvents?.results || []).map(row => row[0]).filter(Boolean);

  return {
    status: "connected",
    message: "PostHog metrics loaded.",
    generatedAt: new Date().toISOString(),
    rangeLabel: "Last 24 hours",
    summary: {
      activeUsers: numeric(summary[0]),
      dailyVisitors: numeric(summary[1]),
      moviesStarted: numeric(summary[2]),
      moviesCompleted: numeric(summary[3]),
      storiesStarted: numeric(summary[4]),
      storiesCompleted: numeric(summary[5]),
      originalSelections: numeric(summary[6]),
      reimaginedSelections: numeric(summary[7]),
      alternateSelections: numeric(summary[8]),
      averageWatchTimeSeconds: numeric(summary[9]),
    },
    topContent,
    topCreators,
    recentActivity: (results.recentActivity?.results || []).map(formatActivity),
    instrumentation: {
      requiredEvents: MOVIANX_EVENT_NAMES,
      detected,
      missing: MOVIANX_EVENT_NAMES.filter(event => !detected.includes(event)),
    },
  };
}

async function queryPostHog({ query, name, config, fetchImpl = fetch }) {
  const response = await fetchImpl(`${config.apiHost}/api/projects/${config.projectId}/query/`, {
    method: "POST",
    headers: {
      "authorization": `Bearer ${config.personalApiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: {
        kind: "HogQLQuery",
        query,
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`${name} query failed (${response.status}): ${detail.slice(0, 220)}`);
  }

  return response.json();
}

export async function getOpsMetrics({ env = process.env, fetchImpl = fetch } = {}) {
  const config = getPostHogOpsConfig(env);
  if (!config.connected) return emptyMetrics();

  const summaryQuery = `
    SELECT
      uniqIf(distinct_id, event = '$pageview' AND timestamp >= now() - INTERVAL 5 MINUTE) AS active_users,
      uniqIf(distinct_id, event = '$pageview' AND timestamp >= today()) AS daily_visitors,
      countIf(event = '${METRIC_EVENTS.moviesStarted}') AS movies_started,
      countIf(event = '${METRIC_EVENTS.moviesCompleted}') AS movies_completed,
      countIf(event = '${METRIC_EVENTS.storiesStarted}') AS stories_started,
      countIf(event = '${METRIC_EVENTS.storiesCompleted}') AS stories_completed,
      countIf(event = '${METRIC_EVENTS.originalSelections}') AS original_selections,
      countIf(event = '${METRIC_EVENTS.reimaginedSelections}') AS reimagined_selections,
      countIf(event = '${METRIC_EVENTS.alternateSelections}') AS alternate_selections,
      avgOrNull(toFloatOrNull(coalesce(
        properties['watch_duration'],
        properties['play_duration'],
        properties['duration'],
        properties['watch_time']
      ))) AS average_watch_time_seconds
    FROM events
    WHERE timestamp >= now() - INTERVAL 24 HOUR
      AND (
        event = '$pageview' OR
        event IN (${MOVIANX_EVENT_NAMES.map(event => `'${event}'`).join(", ")})
      )
  `;

  const topContentQuery = `
    SELECT
      coalesce(properties['movie_title'], properties['story_title'], properties['song_title'], properties['content_title'], properties['movie_id'], properties['story_id'], properties['song_id'], 'Unknown content') AS content_title,
      coalesce(properties['content_type'], if(event LIKE 'movie_%', 'Movie', if(event LIKE 'story_%', 'Story', if(event LIKE 'music_%', 'Music', 'Experience')))) AS content_type,
      countIf(event IN ('${METRIC_EVENTS.moviesStarted}', '${METRIC_EVENTS.storiesStarted}', 'music_started')) AS starts,
      countIf(event IN ('${METRIC_EVENTS.moviesCompleted}', '${METRIC_EVENTS.storiesCompleted}', 'music_completed')) AS completions,
      count() AS engagement
    FROM events
    WHERE timestamp >= now() - INTERVAL 7 DAY
      AND event IN (${[...MOVIANX_EVENT_NAMES, "music_started", "music_completed"].map(event => `'${event}'`).join(", ")})
    GROUP BY content_title, content_type
    ORDER BY engagement DESC
    LIMIT 8
  `;

  const topCreatorsQuery = `
    SELECT
      coalesce(properties['creator_name'], properties['artist_name'], 'Unknown creator') AS creator_name,
      countIf(event IN ('${METRIC_EVENTS.moviesStarted}', '${METRIC_EVENTS.storiesStarted}', 'music_started', 'creator_profile_viewed')) AS starts,
      countIf(event IN ('${METRIC_EVENTS.moviesCompleted}', '${METRIC_EVENTS.storiesCompleted}', 'music_completed')) AS completions,
      count() AS engagement
    FROM events
    WHERE timestamp >= now() - INTERVAL 7 DAY
      AND event IN (${[...MOVIANX_EVENT_NAMES, "music_started", "music_completed", "creator_profile_viewed"].map(event => `'${event}'`).join(", ")})
    GROUP BY creator_name
    ORDER BY engagement DESC
    LIMIT 8
  `;

  const recentActivityQuery = `
    SELECT
      timestamp,
      event,
      coalesce(properties['movie_title'], properties['story_title'], properties['song_title'], properties['content_title'], properties['$current_url'], 'Unknown content') AS content_title,
      coalesce(properties['content_type'], if(event LIKE 'movie_%', 'Movie', if(event LIKE 'story_%', 'Story', if(event LIKE 'music_%', 'Music', 'Experience')))) AS content_type,
      coalesce(properties['creator_name'], properties['artist_name'], '') AS creator_name,
      coalesce(properties['mode'], '') AS mode,
      distinct_id
    FROM events
    WHERE timestamp >= now() - INTERVAL 24 HOUR
      AND (event = '$pageview' OR event IN (${[...MOVIANX_EVENT_NAMES, "music_started", "music_completed", "creator_profile_viewed"].map(event => `'${event}'`).join(", ")}))
    ORDER BY timestamp DESC
    LIMIT 12
  `;

  const detectedEventsQuery = `
    SELECT event
    FROM events
    WHERE timestamp >= now() - INTERVAL 30 DAY
      AND event IN (${[...MOVIANX_EVENT_NAMES, "music_started", "music_completed"].map(event => `'${event}'`).join(", ")})
    GROUP BY event
    ORDER BY event ASC
  `;

  try {
    const [summary, topContent, topCreators, recentActivity, detectedEvents] = await Promise.all([
      queryPostHog({ query: summaryQuery, name: "summary", config, fetchImpl }),
      queryPostHog({ query: topContentQuery, name: "top content", config, fetchImpl }),
      queryPostHog({ query: topCreatorsQuery, name: "top creators", config, fetchImpl }),
      queryPostHog({ query: recentActivityQuery, name: "recent activity", config, fetchImpl }),
      queryPostHog({ query: detectedEventsQuery, name: "detected events", config, fetchImpl }),
    ]);

    return shapeOpsMetrics({ summary, topContent, topCreators, recentActivity, detectedEvents });
  } catch (error) {
    return {
      ...emptyMetrics("error", error?.message || "PostHog query failed."),
      generatedAt: new Date().toISOString(),
    };
  }
}

export { MOVIANX_EVENT_NAMES };
