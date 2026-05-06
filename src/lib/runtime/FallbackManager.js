export class FallbackManager {
  constructor({ eventBus, store, logger = console } = {}) {
    this.eventBus = eventBus;
    this.store = store;
    this.logger = logger;
  }

  assetUnavailable(asset, error) {
    const message = error?.message || String(error || "asset unavailable");
    const payload = { asset, error: message };
    this.logger?.error?.("[MovianxRuntime]", { type: "asset:failed", ...payload });
    this.eventBus?.emit("asset:failed", payload);
    this.store?.setPlayback({
      assetStatus: {
        [asset]: "failed",
      },
    });
    return {
      ok: false,
      status: "unavailable",
      message: "Audio unavailable",
      asset,
      error: message,
    };
  }

  narrationUnavailable(asset, error) {
    const fallback = this.assetUnavailable(asset || "narration", error);
    this.eventBus?.emit("playback:narration-unavailable", fallback);
    this.store?.setPlayback({ narrationStatus: "unavailable" });
    return fallback;
  }

  pluginFailed(pluginName, error) {
    const message = error?.message || String(error || "plugin failed");
    const payload = { pluginName, error: message };
    this.logger?.error?.("[MovianxRuntime]", { type: "plugin:failed", ...payload });
    this.eventBus?.emit("plugin:failed", payload);
    this.store?.setPluginState(pluginName, {
      status: "disabled",
      error: message,
    });
    return payload;
  }
}

export default FallbackManager;
