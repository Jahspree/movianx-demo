import { getSupabaseConfig } from "../creator/supabaseUploadStore.js";

const REQUIRED_ENV = Object.freeze([
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_UPLOAD_BUCKET",
  "REQUIRE_CREATOR_AUTH",
  "OPS_ADMIN_USERNAME",
  "OPS_ADMIN_PASSWORD",
]);

export async function getSystemHealth({ auth } = {}) {
  const env = getEnvironmentStatus();
  const authStatus = getAuthStatus(auth);
  const database = await checkDatabase();
  const storage = await checkStorage();

  return {
    generatedAt: new Date().toISOString(),
    supabase: summarizeSupabase(env, database, storage),
    database,
    storage,
    authentication: authStatus,
    environment: env,
  };
}

export function getEnvironmentStatus() {
  const entries = REQUIRED_ENV.map(name => ({
    name,
    configured: Boolean(process.env[name]),
    required: true,
  }));

  return {
    status: entries.every(entry => entry.configured) ? "healthy" : "degraded",
    entries,
    missing: entries.filter(entry => !entry.configured).map(entry => entry.name),
  };
}

function getAuthStatus(auth) {
  const adminOnly = auth?.ok && auth.role === "admin";
  return {
    status: adminOnly ? "healthy" : "failed",
    label: adminOnly ? "Administrator verified" : "Administrator access required",
    role: auth?.role || "none",
  };
}

async function checkDatabase() {
  const config = getSupabaseConfig();
  if (!config.url || !config.serviceKey) {
    return {
      status: "failed",
      label: "Missing Supabase URL or service role key",
      checks: {
        connection: false,
        uploadRecordsTable: false,
        auditTable: false,
      },
    };
  }

  try {
    await supabaseRest("creator_upload_records?select=id&limit=1", config);
    await supabaseRest("creator_upload_audit_logs?select=id&limit=1", config);
    return {
      status: "healthy",
      label: "Database reachable and intake tables are queryable",
      checks: {
        connection: true,
        uploadRecordsTable: true,
        auditTable: true,
      },
    };
  } catch (error) {
    return {
      status: "failed",
      label: sanitizeError(error),
      checks: {
        connection: false,
        uploadRecordsTable: false,
        auditTable: false,
      },
    };
  }
}

async function checkStorage() {
  const config = getSupabaseConfig();
  if (!config.url || !config.serviceKey || !config.uploadBucket) {
    return {
      status: "failed",
      label: "Missing Supabase storage configuration",
      checks: {
        connection: false,
        bucket: false,
      },
    };
  }

  try {
    const response = await fetch(`${trimSlash(config.url)}/storage/v1/bucket/${encodeURIComponent(config.uploadBucket)}`, {
      headers: {
        authorization: `Bearer ${config.serviceKey}`,
        apikey: config.serviceKey,
      },
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Storage bucket check failed with ${response.status}`);
    const bucket = await response.json();
    return {
      status: bucket?.public === false ? "healthy" : "degraded",
      label: bucket?.public === false
        ? "Private upload bucket reachable"
        : "Bucket reachable but privacy configuration needs review",
      checks: {
        connection: true,
        bucket: true,
        private: bucket?.public === false,
      },
    };
  } catch (error) {
    return {
      status: "failed",
      label: sanitizeError(error),
      checks: {
        connection: false,
        bucket: false,
      },
    };
  }
}

function summarizeSupabase(env, database, storage) {
  const healthy = env.missing.filter(name => name.startsWith("SUPABASE_")).length === 0 &&
    database.status === "healthy" &&
    storage.status === "healthy";

  return {
    status: healthy ? "healthy" : "failed",
    label: healthy ? "Supabase production integration is active" : "Supabase production integration is incomplete",
  };
}

async function supabaseRest(path, config) {
  const response = await fetch(`${trimSlash(config.url)}/rest/v1/${path}`, {
    headers: {
      authorization: `Bearer ${config.serviceKey}`,
      apikey: config.serviceKey,
      "content-type": "application/json",
    },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Database check failed with ${response.status}`);
  return response;
}

function sanitizeError(error) {
  return String(error?.message || "Unknown health check failure")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/g, "Bearer [redacted]")
    .replace(/apikey[=:]\s*[A-Za-z0-9._-]+/gi, "apikey=[redacted]")
    .slice(0, 180);
}

function trimSlash(value) {
  return String(value || "").replace(/\/+$/, "");
}
