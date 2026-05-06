const DEFAULT_PLUGIN_NAMES = [
  "EmotionPlugin",
  "SpatialAudioPlugin",
  "NarrationPlugin",
  "TensionPlugin",
];

export class PluginManager {
  constructor({ eventBus, store, fallbackManager, logger = console } = {}) {
    this.eventBus = eventBus;
    this.store = store;
    this.fallbackManager = fallbackManager;
    this.logger = logger;
    this.plugins = new Map();
  }

  register(plugin) {
    if (!plugin?.name) return false;
    const safePlugin = {
      initialize: async () => {},
      startScene: async () => {},
      stopScene: async () => {},
      terminate: async () => {},
      ...plugin,
      status: "registered",
      enabled: true,
    };
    this.plugins.set(safePlugin.name, safePlugin);
    this.store?.setPluginState(safePlugin.name, { status: "registered", enabled: true });
    this.eventBus?.emit("plugin:registered", { pluginName: safePlugin.name });
    return true;
  }

  registerBuiltIns() {
    DEFAULT_PLUGIN_NAMES.forEach(name => {
      if (!this.plugins.has(name)) {
        this.register({ name });
      }
    });
  }

  async initialize(context = {}) {
    for (const plugin of this.plugins.values()) {
      await this.safeCall(plugin, "initialize", context);
    }
  }

  async startScene(scene) {
    const calls = [...this.plugins.values()].map(plugin => this.safeCall(plugin, "startScene", scene));
    await Promise.allSettled(calls);
  }

  async stopScene(scene) {
    const calls = [...this.plugins.values()].map(plugin => this.safeCall(plugin, "stopScene", scene));
    await Promise.allSettled(calls);
  }

  async terminate() {
    const calls = [...this.plugins.values()].map(plugin => this.safeCall(plugin, "terminate", {}));
    await Promise.allSettled(calls);
  }

  async safeCall(plugin, method, payload) {
    if (!plugin?.enabled || plugin.status === "disabled") return { ok: false, skipped: true };
    try {
      this.eventBus?.emit("plugin:call", { pluginName: plugin.name, method });
      await plugin[method]?.({
        eventBus: this.eventBus,
        emit: (eventName, data) => this.eventBus?.emit(`plugin:${eventName}`, {
          pluginName: plugin.name,
          data,
        }),
        payload,
      });
      plugin.status = "active";
      this.store?.setPluginState(plugin.name, { status: "active", enabled: true });
      return { ok: true };
    } catch (error) {
      plugin.enabled = false;
      plugin.status = "disabled";
      this.fallbackManager?.pluginFailed(plugin.name, error);
      this.logger?.error?.("[MovianxRuntime]", {
        type: "plugin:disabled",
        pluginName: plugin.name,
        method,
        error: error?.message || String(error),
      });
      return { ok: false, error };
    }
  }

  getPluginState(pluginName) {
    const plugin = this.plugins.get(pluginName);
    return plugin ? { name: plugin.name, status: plugin.status, enabled: plugin.enabled } : null;
  }
}

export default PluginManager;
