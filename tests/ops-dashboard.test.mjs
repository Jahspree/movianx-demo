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
import {
  getEnvironmentStatus,
  getSystemHealth,
} from "../src/lib/ops/systemHealth.js";
import {
  dashboardToCsv,
  dashboardToJson,
  getExecutiveDashboardData,
  normalizeDashboardRange,
} from "../src/lib/ops/executiveDashboard.js";

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

test("system diagnostics reports missing Supabase service key safely", async () => {
  const previous = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_UPLOAD_BUCKET: process.env.SUPABASE_UPLOAD_BUCKET,
  };
  process.env.SUPABASE_URL = "https://example.supabase.co";
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.SUPABASE_UPLOAD_BUCKET = "creator-private-uploads";

  try {
    const env = getEnvironmentStatus();
    const health = await getSystemHealth({ auth: { ok: true, role: "admin" } });
    assert.equal(env.missing.includes("SUPABASE_SERVICE_ROLE_KEY"), true);
    assert.equal(health.database.status, "failed");
    assert.equal(health.storage.status, "failed");
    assert.doesNotMatch(JSON.stringify(health), /phx_|eyJ[A-Za-z0-9_-]{20,}/);
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test("executive dashboard normalizes ranges and exports empty-source data safely", async () => {
  const previous = {
    POSTHOG_PERSONAL_API_KEY: process.env.POSTHOG_PERSONAL_API_KEY,
    POSTHOG_PROJECT_ID: process.env.POSTHOG_PROJECT_ID,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_UPLOAD_BUCKET: process.env.SUPABASE_UPLOAD_BUCKET,
  };
  delete process.env.POSTHOG_PERSONAL_API_KEY;
  delete process.env.POSTHOG_PROJECT_ID;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;

  try {
    assert.equal(normalizeDashboardRange("90d"), "90d");
    assert.equal(normalizeDashboardRange("bad"), "today");
    const data = await getExecutiveDashboardData({
      range: "7d",
      auth: { ok: true, role: "admin" },
      fetchImpl: async () => {
        throw new Error("fetch should not run without configured data sources");
      },
    });
    assert.equal(data.range.key, "7d");
    assert.equal(data.sources.posthog.status, "not_connected");
    assert.equal(data.sources.supabase.status, "not_connected");
    assert.match(dashboardToCsv(data), /section,metric,value/);
    assert.match(dashboardToJson(data), /"range"/);
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
