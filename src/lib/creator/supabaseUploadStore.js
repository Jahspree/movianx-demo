const SUPABASE_TABLE = "creator_upload_records";
const AUDIT_TABLE = "creator_upload_audit_logs";

const fallbackState = globalThis.__movianxSupabaseUploadFallback || {
  records: new Map(),
  audit: [],
};

globalThis.__movianxSupabaseUploadFallback = fallbackState;

export function getSupabaseConfig() {
  return {
    url: process.env.SUPABASE_URL || "",
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || "",
    uploadBucket: process.env.SUPABASE_UPLOAD_BUCKET || "creator-private-uploads",
  };
}

export function hasSupabaseConfig() {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.serviceKey && config.uploadBucket);
}

export function getUploadPersistenceMode() {
  return hasSupabaseConfig() ? "supabase" : "development-memory";
}

export async function createSupabaseSignedUploadTarget({ storagePath, contentType }) {
  const config = getSupabaseConfig();
  if (!hasSupabaseConfig()) return null;

  const encodedPath = storagePath.split("/").map(encodeURIComponent).join("/");
  const response = await fetch(`${trimSlash(config.url)}/storage/v1/object/upload/sign/${encodeURIComponent(config.uploadBucket)}/${encodedPath}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.serviceKey}`,
      apikey: config.serviceKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({ upsert: false }),
  });

  if (!response.ok) {
    const message = await safeResponseText(response);
    throw new Error(`Supabase signed upload target failed: ${response.status} ${message}`);
  }

  const body = await response.json();
  const signedPath = body.url || body.signedURL || body.signedUrl || "";
  const token = body.token || "";
  const uploadUrl = signedPath.startsWith("http")
    ? signedPath
    : `${trimSlash(config.url)}/storage/v1${signedPath}`;

  return {
    provider: "supabase-storage",
    method: "PUT",
    uploadUrl,
    token,
    headers: {
      "content-type": contentType,
      ...(token ? { "x-signature": token } : {}),
    },
    mock: false,
  };
}

export async function upsertCreatorUploadRecord(record) {
  if (!hasSupabaseConfig()) {
    fallbackState.records.set(record.id, record);
    return record;
  }

  const rows = await supabaseRest(`${SUPABASE_TABLE}?on_conflict=id&select=*`, {
    method: "POST",
    headers: {
      prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify([toSupabaseRecord(record)]),
  });

  return fromSupabaseRecord(rows?.[0] || toSupabaseRecord(record));
}

export async function updateCreatorUploadRecord({ id, patch }) {
  const existing = await getCreatorUploadRecord({ id });
  if (!existing) return null;
  const updated = {
    ...existing,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  if (!hasSupabaseConfig()) {
    fallbackState.records.set(id, updated);
    return updated;
  }

  const rows = await supabaseRest(`${SUPABASE_TABLE}?id=eq.${encodeURIComponent(id)}&select=*`, {
    method: "PATCH",
    headers: { prefer: "return=representation" },
    body: JSON.stringify(toSupabasePatch(updated)),
  });
  return rows?.[0] ? fromSupabaseRecord(rows[0]) : null;
}

export async function getCreatorUploadRecord({ id }) {
  if (!hasSupabaseConfig()) return fallbackState.records.get(id) || null;

  const rows = await supabaseRest(`${SUPABASE_TABLE}?id=eq.${encodeURIComponent(id)}&limit=1`);
  return rows?.[0] ? fromSupabaseRecord(rows[0]) : null;
}

export async function listCreatorUploadRecords({ creatorId } = {}) {
  if (!hasSupabaseConfig()) {
    return Array.from(fallbackState.records.values())
      .filter(record => !creatorId || record.creatorId === creatorId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  const filter = creatorId ? `&creator_id=eq.${encodeURIComponent(creatorId)}` : "";
  const rows = await supabaseRest(`${SUPABASE_TABLE}?select=*&order=updated_at.desc${filter}`);
  return rows.map(fromSupabaseRecord);
}

export async function writeCreatorUploadAudit({ actorId, action, recordId, metadata = {} }) {
  const entry = {
    id: crypto.randomUUID(),
    actorId,
    action,
    recordId,
    metadata: redactMetadata(metadata),
    createdAt: new Date().toISOString(),
  };

  if (!hasSupabaseConfig()) {
    fallbackState.audit.unshift(entry);
    fallbackState.audit = fallbackState.audit.slice(0, 500);
    return entry;
  }

  await supabaseRest(AUDIT_TABLE, {
    method: "POST",
    headers: { prefer: "return=minimal" },
    body: JSON.stringify([{
      id: entry.id,
      actor_id: entry.actorId,
      action: entry.action,
      record_id: entry.recordId,
      metadata: entry.metadata,
      created_at: entry.createdAt,
    }]),
  });
  return entry;
}

export function createUploadRecordFromContent({ content, storageProvider }) {
  return {
    id: content.id,
    contentId: content.id,
    creatorId: content.creatorId,
    title: content.title,
    description: content.description,
    genre: content.genre,
    language: content.language,
    maturityRating: content.maturityRating,
    tags: content.tags,
    status: normalizeUploadStatus(content.status),
    reviewStatus: content.reviewStatus,
    assets: content.assets,
    storageProvider,
    security: content.security,
    createdAt: content.createdAt,
    updatedAt: content.updatedAt,
  };
}

export function normalizeUploadStatus(status) {
  if (status === "review_required") return "under_review";
  if (status === "uploading" || status === "draft") return "uploaded";
  if (status === "ai_analyzed") return "processing";
  return status;
}

function toSupabaseRecord(record) {
  return {
    id: record.id,
    content_id: record.contentId,
    creator_id: record.creatorId,
    title: record.title,
    description: record.description,
    genre: record.genre,
    language: record.language,
    maturity_rating: record.maturityRating,
    tags: record.tags || [],
    status: record.status,
    review_status: record.reviewStatus || "not_submitted",
    assets: record.assets || [],
    storage_provider: record.storageProvider,
    security: record.security || {},
    created_at: record.createdAt,
    updated_at: record.updatedAt,
  };
}

function toSupabasePatch(record) {
  const row = toSupabaseRecord(record);
  delete row.id;
  delete row.created_at;
  return row;
}

function fromSupabaseRecord(row) {
  return {
    id: row.id,
    contentId: row.content_id,
    creatorId: row.creator_id,
    title: row.title,
    description: row.description || "",
    genre: row.genre || "",
    language: row.language || "",
    maturityRating: row.maturity_rating || "",
    tags: row.tags || [],
    status: row.status,
    reviewStatus: row.review_status || "not_submitted",
    assets: row.assets || [],
    storageProvider: row.storage_provider || "unknown",
    security: row.security || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
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
    throw new Error(`Supabase request failed: ${response.status} ${message}`);
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function safeResponseText(response) {
  const text = await response.text().catch(() => "");
  return text.slice(0, 300);
}

function trimSlash(value) {
  return String(value || "").replace(/\/+$/, "");
}

function redactMetadata(metadata) {
  const safe = {};
  Object.entries(metadata || {}).forEach(([key, value]) => {
    if (/token|secret|key|password|signed/i.test(key)) return;
    safe[key] = value;
  });
  return safe;
}

export function resetSupabaseUploadFallbackForTests() {
  fallbackState.records.clear();
  fallbackState.audit = [];
}
