import EventBus from "./EventBus.js";
import StateStore from "./StateStore.js";
import FallbackManager from "./FallbackManager.js";
import AssetLoader from "./AssetLoader.js";
import PlaybackManager from "./PlaybackManager.js";
import PluginManager from "./PluginManager.js";
import SceneManager from "./SceneManager.js";

export class RuntimeManager {
  constructor({ logger = console, assetTimeoutMs = 5000, createAudio } = {}) {
    this.logger = logger;
    this.eventBus = new EventBus({ logger });
    this.store = new StateStore();
    this.fallbackManager = new FallbackManager({
      eventBus: this.eventBus,
      store: this.store,
      logger,
    });
    this.assetLoader = new AssetLoader({
      eventBus: this.eventBus,
      fallbackManager: this.fallbackManager,
      timeoutMs: assetTimeoutMs,
      createAudio,
    });
    this.playbackManager = new PlaybackManager({
      eventBus: this.eventBus,
      store: this.store,
      assetLoader: this.assetLoader,
      fallbackManager: this.fallbackManager,
      logger,
    });
    this.pluginManager = new PluginManager({
      eventBus: this.eventBus,
      store: this.store,
      fallbackManager: this.fallbackManager,
      logger,
    });
    this.sceneManager = new SceneManager({
      eventBus: this.eventBus,
      store: this.store,
      playbackManager: this.playbackManager,
      pluginManager: this.pluginManager,
    });

    this.pluginManager.registerBuiltIns();
  }

  getState() {
    return this.store.getState();
  }

  subscribe(listener) {
    return this.store.subscribe(listener);
  }

  on(eventName, handler) {
    return this.eventBus.on(eventName, handler);
  }

  emit(eventName, payload) {
    return this.eventBus.emit(eventName, payload);
  }

  registerPlugin(plugin) {
    return this.pluginManager.register(plugin);
  }

  async initializePlugins() {
    return this.pluginManager.initialize({
      eventBus: this.eventBus,
      getState: () => this.getState(),
    });
  }

  navigate({ from = null, to = null, kind = "view" } = {}) {
    this.store.setNavigation({ status: "transitioning", from, to, kind });
    this.eventBus.emit("runtime:navigate", { from, to, kind });
    this.store.setNavigation({ status: "idle", from, to, kind });
    return { ok: true, from, to, kind };
  }

  startScene(sceneInput = {}) {
    return this.sceneManager.startScene(sceneInput);
  }

  completeScene() {
    return this.sceneManager.completeScene();
  }

  stopScene() {
    return this.sceneManager.stopScene();
  }

  async shutdown() {
    await this.sceneManager.stopScene();
    await this.pluginManager.terminate();
    this.assetLoader.clear();
    this.eventBus.clear();
  }
}

export default RuntimeManager;
