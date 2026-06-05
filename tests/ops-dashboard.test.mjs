import test from "node:test";
import assert from "node:assert/strict";
import {
  authenticateOpsRequest,
  isOpsPath,
  isPublicDemoHost,
  parseAllowedRoles,
} from "../src/lib/ops/auth.js";
import {
  getPostHogOpsConfig,
  shapeOpsMetrics,
} from "../src/lib/ops/posthogMetrics.js";

function headersFor(username, password) {
  return new Headers({
    authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
  });
}

test("ops route matching stays scoped to internal operations paths", () => {
  assert.equal(isOpsPath("/ops"), true);
  assert.equal(isOpsPath("/ops/content"), true);
  assert.equal(isOpsPath("/api/ops/metrics"), true);
  assert.equal(isOpsPath("/watch"), false);
  assert.equal(isOpsPath("/dashboard"), false);
});

test("public demo host is recognized for ops isolation", () => {
  assert.equal(isPublicDemoHost("demo.movianx.com"), true);
  assert.equal(isPublicDemoHost("demo.movianx.com:443"), true);
  assert.equal(isPublicDemoHost("ops.movianx.com"), false);
});

test("ops basic auth requires configured role credentials", () => {
  const env = {
    NODE_ENV: "production",
    OPS_ADMIN_USERNAME: "admin",
    OPS_ADMIN_PASSWORD: "secret",
    OPS_ALLOWED_ROLES: "admin",
  };

  assert.equal(authenticateOpsRequest(new Headers(), env).status, 401);
  assert.equal(authenticateOpsRequest(headersFor("admin", "wrong"), env).status, 401);

  const result = authenticateOpsRequest(headersFor("admin", "secret"), env);
  assert.equal(result.ok, true);
  assert.equal(result.role, "admin");
});

test("ops auth rejects roles outside the allowed set", () => {
  const env = {
    NODE_ENV: "production",
    OPS_VIEWER_USERNAME: "viewer",
    OPS_VIEWER_PASSWORD: "secret",
    OPS_ALLOWED_ROLES: "admin,ops",
  };

  const result = authenticateOpsRequest(headersFor("viewer", "secret"), env);
  assert.equal(result.ok, false);
  assert.equal(result.status, 403);
});

test("posthog ops config requires personal API key and project id", () => {
  assert.equal(getPostHogOpsConfig({}).connected, false);
  assert.equal(getPostHogOpsConfig({
    POSTHOG_PERSONAL_API_KEY: "phx_secret",
    POSTHOG_PROJECT_ID: "123",
  }).connected, true);
});

test("ops metrics are shaped deterministically without fabricating rows", () => {
  const metrics = shapeOpsMetrics({
    summary: {
      results: [[2, 14, 4, 1, 7, 3, 5, 9, 1, 128.5]],
    },
    topContent: {
      results: [["10 Seconds", "Story", 7, 3, 11]],
    },
    topCreators: {
      results: [["Movianx Originals", 7, 3, 12]],
    },
    recentActivity: {
      results: [["2026-06-05T12:00:00Z", "story_started", "10 Seconds", "Story", "Movianx Originals", "reimagined", "user-123456789"]],
    },
    detectedEvents: {
      results: [["story_started"], ["reimagined_version_selected"]],
    },
  });

  assert.equal(metrics.summary.activeUsers, 2);
  assert.equal(metrics.summary.reimaginedSelections, 9);
  assert.equal(metrics.topContent[0].title, "10 Seconds");
  assert.equal(metrics.topCreators[0].name, "Movianx Originals");
  assert.equal(metrics.recentActivity[0].distinctId, "user-12345");
  assert.ok(metrics.instrumentation.missing.includes("movie_started"));
});
