const auditState = globalThis.__movianxAuditState || {
  entries: [],
};

globalThis.__movianxAuditState = auditState;

export function writeAuditLog({ creatorId, action, resourceType, resourceId, metadata = {} }) {
  const entry = {
    id: crypto.randomUUID(),
    creatorId,
    action,
    resourceType,
    resourceId,
    metadata: redactMetadata(metadata),
    createdAt: new Date().toISOString(),
  };
  auditState.entries.unshift(entry);
  auditState.entries = auditState.entries.slice(0, 500);
  console.info("[creator-audit]", {
    id: entry.id,
    creatorId,
    action,
    resourceType,
    resourceId,
  });
  return entry;
}

export function listAuditLogs({ creatorId } = {}) {
  return auditState.entries.filter(entry => !creatorId || entry.creatorId === creatorId);
}

function redactMetadata(metadata) {
  const safe = {};
  Object.entries(metadata || {}).forEach(([key, value]) => {
    if (/token|secret|key|password|signed/i.test(key)) return;
    safe[key] = value;
  });
  return safe;
}
