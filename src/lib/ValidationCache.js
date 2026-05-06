function stableHash(input = "") {
  let hash = 2166136261;
  const text = String(input);
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}

export function createValidationCache({ maxEntries = 100, ttlMs = 60_000 } = {}) {
  const entries = new Map();

  function prune(now) {
    for (const [key, entry] of entries) {
      if (entry.expiresAt <= now) entries.delete(key);
    }
    while (entries.size > maxEntries) {
      const oldestKey = entries.keys().next().value;
      entries.delete(oldestKey);
    }
  }

  return {
    getOrSet(keyInput, producer, now = Date.now()) {
      const key = stableHash(keyInput);
      const existing = entries.get(key);
      if (existing && existing.expiresAt > now) {
        return { value: existing.value, cacheHit: true };
      }
      const value = producer();
      entries.set(key, { value, expiresAt: now + ttlMs });
      prune(now);
      return { value, cacheHit: false };
    },
    size() {
      return entries.size;
    },
    clear() {
      entries.clear();
    },
  };
}
