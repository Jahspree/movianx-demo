import posthog from "posthog-js";

export const MOVIANX_EVENTS = Object.freeze({
  MOVIE_STARTED: "movie_started",
  MOVIE_COMPLETED: "movie_completed",
  STORY_STARTED: "story_started",
  STORY_COMPLETED: "story_completed",
  STORY_PAGE_ADVANCED: "story_page_advanced",
  ORIGINAL_VERSION_SELECTED: "original_version_selected",
  REIMAGINED_VERSION_SELECTED: "reimagined_version_selected",
  ALTERNATE_ENDING_SELECTED: "alternate_ending_selected",
  MUSIC_STARTED: "music_started",
  MUSIC_COMPLETED: "music_completed",
  CREATOR_PROFILE_VIEWED: "creator_profile_viewed",
  WATCH_PARTY_JOINED: "watch_party_joined",
  WATCH_PARTY_CREATED: "watch_party_created",
  ACCOUNT_CREATED: "account_created",
  ACCOUNT_LOGGED_IN: "account_logged_in",
  SUBSCRIPTION_STARTED: "subscription_started",
  SUBSCRIPTION_COMPLETED: "subscription_completed",
  SEARCH_PERFORMED: "search_performed",
  EXPLORE_ITEM_CLICKED: "explore_item_clicked",
  TRAILER_PLAYED: "trailer_played",
  VIDEO_PAUSED: "video_paused",
  VIDEO_RESUMED: "video_resumed",
});

export const MOVIANX_FEATURE_FLAGS = Object.freeze({
  REIMAGINED_EXPERIENCE: "reimagined_experience",
  WATCH_PARTY_V2: "watch_party_v2",
  CREATOR_UPLOADS_BETA: "creator_uploads_beta",
  PREMIUM_EXPERIENCE: "premium_experience",
});

const SESSION_REPLAY_PATHS = [
  /^\/$/,
  /^\/watch\/?$/,
  /^\/watch\/movies\/?$/,
  /^\/watch\/stories\/?$/,
  /^\/watch\/music\/?$/,
  /^\/watch\/creator[^/]*(?:\/.*)?$/,
  /^\/watch\/story[^/]*(?:\/.*)?$/,
  /^\/watch\/music[^/]*(?:\/.*)?$/,
];

const SENSITIVE_KEY_PATTERN = /(password|passcode|payment|card|cvc|cvv|token|secret|auth|authorization|cookie|email|phone|ssn|address)/i;
const EVENT_DEDUPE_WINDOW_MS = 750;
const recentEvents = new Map();

function canUsePostHog() {
  return typeof window !== "undefined" && Boolean(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN);
}

function compactProperties(properties = {}) {
  return Object.entries(properties).reduce((safe, [key, value]) => {
    if (value === undefined || value === null || value === "") return safe;
    if (SENSITIVE_KEY_PATTERN.test(key)) return safe;
    if (typeof value === "object" && !Array.isArray(value)) {
      safe[key] = compactProperties(value);
      return safe;
    }
    safe[key] = value;
    return safe;
  }, {});
}

function shortDedupeKey(event, properties) {
  const stable = [
    properties.movie_id,
    properties.story_id,
    properties.song_id,
    properties.creator_id,
    properties.current_page,
    properties.mode,
  ].filter(Boolean).join(":");
  return `${event}:${stable}`;
}

export function ensurePostHogInitialized() {
  if (!canUsePostHog()) return null;
  if (posthog.__loaded) return posthog;

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2026-01-30",
    capture_pageview: "history_change",
    capture_pageleave: "if_capture_pageview",
    capture_exceptions: true,
    capture_performance: true,
    autocapture: true,
    disable_session_recording: false,
    mask_all_text: false,
    mask_all_element_attributes: true,
    mask_personal_data_properties: true,
    custom_personal_data_properties: [
      "email",
      "phone",
      "password",
      "payment",
      "card",
      "token",
      "auth",
      "authorization",
    ],
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: "[data-ph-mask], .ph-mask, input, textarea, [contenteditable=true]",
      blockSelector: "[data-ph-block], .ph-block, [data-sensitive], [data-payment], [data-auth-token]",
    },
    loaded: (client) => {
      configureSessionReplayForPath(window.location.pathname, client);
    },
    debug: process.env.NODE_ENV === "development",
  });

  return posthog;
}

export function isSessionReplayPath(pathname = "") {
  return SESSION_REPLAY_PATHS.some((pattern) => pattern.test(pathname));
}

export function configureSessionReplayForPath(pathname, client = posthog) {
  if (!client?.startSessionRecording || !client?.stopSessionRecording) return;
  if (isSessionReplayPath(pathname)) {
    client.startSessionRecording({ sampling: true, linked_flag: true, url_trigger: true });
  } else {
    client.stopSessionRecording();
  }
}

export function captureMovianxEvent(event, properties = {}, options = {}) {
  const client = ensurePostHogInitialized();
  if (!client?.capture) return false;

  const safeProperties = compactProperties(properties);
  const key = options.dedupeKey || shortDedupeKey(event, safeProperties);
  const now = Date.now();
  if (!options.allowRapidRepeat && key) {
    const last = recentEvents.get(key) || 0;
    if (now - last < EVENT_DEDUPE_WINDOW_MS) return false;
    recentEvents.set(key, now);
  }

  client.capture(event, safeProperties);
  return true;
}

export function captureMovianxEventOnce(event, properties = {}, dedupeKey = "") {
  if (typeof window === "undefined") return false;
  const key = `movianx:${event}:${dedupeKey || shortDedupeKey(event, properties)}`;
  if (window.sessionStorage?.getItem(key)) return false;
  window.sessionStorage?.setItem(key, "1");
  return captureMovianxEvent(event, properties, { dedupeKey: key });
}

export function movieMetadata(experience = {}, overrides = {}) {
  return compactProperties({
    movie_id: experience.id,
    movie_title: experience.title,
    watch_duration: overrides.watch_duration,
    completion_percentage: overrides.completion_percentage,
  });
}

export function storyMetadata(story = {}, overrides = {}) {
  return compactProperties({
    story_id: story.id,
    story_title: story.title,
    current_page: overrides.current_page,
    completion_percentage: overrides.completion_percentage,
    mode: overrides.mode,
  });
}

export function musicMetadata(experience = {}, overrides = {}) {
  return compactProperties({
    song_id: experience.id,
    song_title: experience.title,
    artist_name: experience.creator,
    play_duration: overrides.play_duration,
  });
}

export function creatorMetadata(experience = {}) {
  return compactProperties({
    creator_id: experience.creatorId || experience.id,
    creator_name: experience.creatorName || experience.creator || experience.title,
  });
}

export function featureFlagEnabled(flag, fallback = false) {
  const client = ensurePostHogInitialized();
  if (!client?.isFeatureEnabled) return fallback;
  const value = client.isFeatureEnabled(flag);
  return typeof value === "boolean" ? value : fallback;
}

export const movianxAnalytics = Object.freeze({
  movieStarted: (experience, metadata) => captureMovianxEvent(MOVIANX_EVENTS.MOVIE_STARTED, movieMetadata(experience, metadata)),
  movieCompleted: (experience, metadata) => captureMovianxEvent(MOVIANX_EVENTS.MOVIE_COMPLETED, movieMetadata(experience, metadata)),
  storyStarted: (story, metadata) => captureMovianxEvent(MOVIANX_EVENTS.STORY_STARTED, storyMetadata(story, metadata)),
  storyCompleted: (story, metadata) => captureMovianxEvent(MOVIANX_EVENTS.STORY_COMPLETED, storyMetadata(story, metadata)),
  storyPageAdvanced: (story, metadata) => captureMovianxEvent(MOVIANX_EVENTS.STORY_PAGE_ADVANCED, storyMetadata(story, metadata)),
  originalVersionSelected: (story, metadata) => captureMovianxEvent(MOVIANX_EVENTS.ORIGINAL_VERSION_SELECTED, storyMetadata(story, { ...metadata, mode: "original" })),
  reimaginedVersionSelected: (story, metadata) => captureMovianxEvent(MOVIANX_EVENTS.REIMAGINED_VERSION_SELECTED, storyMetadata(story, { ...metadata, mode: "reimagined" })),
  alternateEndingSelected: (story, metadata) => captureMovianxEvent(MOVIANX_EVENTS.ALTERNATE_ENDING_SELECTED, storyMetadata(story, { ...metadata, mode: "alternate_ending" })),
  musicStarted: (experience, metadata) => captureMovianxEvent(MOVIANX_EVENTS.MUSIC_STARTED, musicMetadata(experience, metadata)),
  musicCompleted: (experience, metadata) => captureMovianxEvent(MOVIANX_EVENTS.MUSIC_COMPLETED, musicMetadata(experience, metadata)),
  creatorProfileViewed: (experience) => captureMovianxEvent(MOVIANX_EVENTS.CREATOR_PROFILE_VIEWED, creatorMetadata(experience)),
  watchPartyJoined: (metadata) => captureMovianxEvent(MOVIANX_EVENTS.WATCH_PARTY_JOINED, metadata),
  watchPartyCreated: (metadata) => captureMovianxEvent(MOVIANX_EVENTS.WATCH_PARTY_CREATED, metadata),
  accountCreated: (metadata) => captureMovianxEvent(MOVIANX_EVENTS.ACCOUNT_CREATED, metadata),
  accountLoggedIn: (metadata) => captureMovianxEvent(MOVIANX_EVENTS.ACCOUNT_LOGGED_IN, metadata),
  subscriptionStarted: (metadata) => captureMovianxEvent(MOVIANX_EVENTS.SUBSCRIPTION_STARTED, metadata),
  subscriptionCompleted: (metadata) => captureMovianxEvent(MOVIANX_EVENTS.SUBSCRIPTION_COMPLETED, metadata),
  searchPerformed: (metadata) => captureMovianxEvent(MOVIANX_EVENTS.SEARCH_PERFORMED, metadata),
  exploreItemClicked: (metadata) => captureMovianxEvent(MOVIANX_EVENTS.EXPLORE_ITEM_CLICKED, metadata),
  trailerPlayed: (experience, metadata) => captureMovianxEvent(MOVIANX_EVENTS.TRAILER_PLAYED, movieMetadata(experience, metadata)),
  videoPaused: (experience, metadata) => captureMovianxEvent(MOVIANX_EVENTS.VIDEO_PAUSED, movieMetadata(experience, metadata)),
  videoResumed: (experience, metadata) => captureMovianxEvent(MOVIANX_EVENTS.VIDEO_RESUMED, movieMetadata(experience, metadata)),
});
