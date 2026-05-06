const DEFAULT_TIMEOUT_MS = 5000;

function canUseBrowserAudio() {
  return typeof window !== "undefined" && typeof Audio !== "undefined";
}

export class AssetLoader {
  constructor({ eventBus, fallbackManager, timeoutMs = DEFAULT_TIMEOUT_MS, createAudio } = {}) {
    this.eventBus = eventBus;
    this.fallbackManager = fallbackManager;
    this.timeoutMs = timeoutMs;
    this.createAudio = createAudio;
    this.cache = new Map();
  }

  preloadAudio(url, options = {}) {
    const timeoutMs = options.timeoutMs || this.timeoutMs;
    if (!url) {
      return Promise.resolve(this.fallbackManager?.assetUnavailable("missing-url", new Error("Missing audio URL")) || {
        ok: false,
        status: "unavailable",
      });
    }
    if (this.cache.has(url)) return this.cache.get(url);
    if (!canUseBrowserAudio() && typeof this.createAudio !== "function") {
      const result = Promise.resolve({ ok: true, status: "skipped", url });
      this.cache.set(url, result);
      return result;
    }

    const promise = new Promise(resolve => {
      let settled = false;
      const audio = typeof this.createAudio === "function" ? this.createAudio(url) : new Audio(url);
      audio.preload = options.metadataOnly ? "metadata" : "auto";

      const finish = result => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        try {
          audio.pause();
          audio.src = "";
        } catch (e) {}
        this.eventBus?.emit(result.ok ? "asset:ready" : "asset:failed", result);
        resolve(result);
      };

      const timer = setTimeout(() => {
        const fallback = this.fallbackManager?.assetUnavailable(url, new Error(`Audio preload timed out after ${timeoutMs}ms`));
        finish(fallback || { ok: false, status: "timeout", url });
      }, timeoutMs);

      audio.addEventListener(options.metadataOnly ? "loadedmetadata" : "canplaythrough", () => {
        finish({
          ok: true,
          status: "ready",
          url,
          durationMs: Number.isFinite(audio.duration) ? Math.round(audio.duration * 1000) : null,
        });
      }, { once: true });

      audio.addEventListener("error", () => {
        const fallback = this.fallbackManager?.assetUnavailable(url, new Error("Audio asset failed to load"));
        finish(fallback || { ok: false, status: "failed", url });
      }, { once: true });

      try {
        audio.load();
      } catch (error) {
        const fallback = this.fallbackManager?.assetUnavailable(url, error);
        finish(fallback || { ok: false, status: "failed", url });
      }
    });

    this.cache.set(url, promise);
    return promise;
  }

  clear() {
    this.cache.clear();
  }
}

export default AssetLoader;
