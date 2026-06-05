import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  getOpsRecommendationSnapshot,
  getRecommendationsForUser,
  getSimilarContent,
  getTrendingContent,
  recordMovieRecommendationSignal,
  recordStoryRecommendationSignal,
} from "../src/lib/recommendations/recommendationService.js";

function withoutSupabaseConfig(fn) {
  const previous = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  };
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_SECRET_KEY;

  return Promise.resolve()
    .then(fn)
    .finally(() => {
      for (const [key, value] of Object.entries(previous)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    });
}

test("recommendation service records movie and story signals without public Supabase config", async () => {
  await withoutSupabaseConfig(async () => {
    const movie = await recordMovieRecommendationSignal({
      userId: "viewer-1",
      contentId: "nosferatu",
      event: "started",
      watchDurationSeconds: 92,
      completionPercentage: 14,
      metadata: { token: "redacted", surface: "test" },
    });
    assert.equal(movie.stored, false);
    assert.equal(movie.contentType, "movie");
    assert.equal(movie.watchDurationSeconds, 92);

    const story = await recordStoryRecommendationSignal({
      userId: "viewer-1",
      contentId: "story-3",
      event: "completed",
      pagesViewed: 4,
      modeSelected: "reimagined",
      endingSelected: "alternate",
    });
    assert.equal(story.event, "completed");
    assert.equal(story.completionPercentage, 100);
    assert.equal(story.modeSelected, "reimagined");
  });
});

test("recommendation service returns seeded similar content and trending fallback safely", async () => {
  await withoutSupabaseConfig(async () => {
    const similar = await getSimilarContent({ contentId: "nosferatu" });
    assert.equal(similar[0].targetContentId, "story-3");

    const recommendations = await getRecommendationsForUser({ userId: "viewer-1", contentId: "nosferatu", limit: 3 });
    assert.equal(recommendations.length, 3);
    assert.equal(recommendations[0].contentId, "story-3");

    const trending = await getTrendingContent({ limit: 2 });
    assert.equal(trending.length, 2);

    const snapshot = await getOpsRecommendationSnapshot();
    assert.equal(snapshot.status, "not_configured");
    assert.ok(snapshot.contentAffinity.length >= 3);
  });
});

test("recommendation migration keeps infrastructure private and includes required tables", () => {
  const migration = fs.readFileSync("supabase/migrations/20260605190000_recommendation_infrastructure.sql", "utf8");
  [
    "user_content_views",
    "user_content_completions",
    "user_content_likes",
    "user_creator_affinity",
    "content_affinity",
    "genre_affinity",
    "viewer_similarity",
    "recommendation_events",
  ].forEach(table => {
    assert.match(migration, new RegExp(`create table if not exists public\\.${table}`));
    assert.match(migration, new RegExp(`alter table public\\.${table} enable row level security`));
    assert.match(migration, new RegExp(`revoke all on public\\.${table} from anon, authenticated`));
  });
});
