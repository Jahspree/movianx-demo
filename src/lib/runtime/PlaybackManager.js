export class PlaybackManager {
  constructor({ eventBus, store, assetLoader, fallbackManager, logger = console } = {}) {
    this.eventBus = eventBus;
    this.store = store;
    this.assetLoader = assetLoader;
    this.fallbackManager = fallbackManager;
    this.logger = logger;
    this.currentSceneKey = null;
  }

  startScene(scene) {
    const sceneKey = scene?.key || `${scene?.storyId ?? "story"}:${scene?.chapterIdx ?? "chapter"}`;
    this.currentSceneKey = sceneKey;
    this.store?.setPlayback({
      status: "playing",
      sceneKey,
      narrationStatus: "pending",
    });
    this.eventBus?.emit("playback:scene-started", { sceneKey, scene });
    return sceneKey;
  }

  completeScene(sceneKey = this.currentSceneKey) {
    this.store?.setPlayback({ status: "complete", sceneKey });
    this.eventBus?.emit("playback:scene-complete", { sceneKey });
  }

  stopScene(sceneKey = this.currentSceneKey) {
    this.store?.setPlayback({ status: "stopped", sceneKey, narrationStatus: "idle" });
    this.eventBus?.emit("playback:scene-stopped", { sceneKey });
  }

  async playNarration({ url, volume = 1, play, sceneKey = this.currentSceneKey, timeoutMs, onStatus } = {}) {
    const setStatus = status => {
      if (typeof onStatus === "function") onStatus(status);
    };

    if (!url) {
      const fallback = this.fallbackManager?.narrationUnavailable(url, new Error("Missing narration URL")) || { ok: false };
      this.eventBus?.emit("playback:narration-failed", { sceneKey, url });
      setStatus("unavailable");
      return fallback;
    }

    this.store?.setPlayback({ narrationStatus: "loading", sceneKey });
    setStatus("loading");
    this.eventBus?.emit("playback:narration-loading", { sceneKey, url });

    const loaded = this.assetLoader
      ? await this.assetLoader.preloadAudio(url, { timeoutMs })
      : { ok: true, status: "skipped", url };
    if (!loaded.ok) {
      this.store?.setPlayback({ narrationStatus: "unavailable", sceneKey });
      this.eventBus?.emit("playback:narration-failed", { sceneKey, url, error: loaded.error });
      setStatus("unavailable");
      return loaded;
    }

    try {
      if (typeof play === "function") play(url, volume);
      this.store?.setPlayback({ narrationStatus: "playing", sceneKey });
      setStatus("playing");
      this.eventBus?.emit("playback:narration-playing", { sceneKey, url });
      return { ok: true, status: "playing", url };
    } catch (error) {
      const fallback = this.fallbackManager?.narrationUnavailable(url, error) || { ok: false, error };
      this.store?.setPlayback({ narrationStatus: "unavailable", sceneKey });
      this.eventBus?.emit("playback:narration-failed", { sceneKey, url, error: error?.message || String(error) });
      setStatus("unavailable");
      return fallback;
    }
  }
}

export default PlaybackManager;
