export class SceneManager {
  constructor({ eventBus, store, playbackManager, pluginManager } = {}) {
    this.eventBus = eventBus;
    this.store = store;
    this.playbackManager = playbackManager;
    this.pluginManager = pluginManager;
    this.activeScene = null;
  }

  buildScene({ storyId, chapterIdx, mode, title, text }) {
    return {
      key: `${storyId ?? "story"}:${chapterIdx ?? 0}:${mode || "Reader"}`,
      storyId,
      chapterIdx,
      mode,
      title,
      text,
      startedAt: Date.now(),
    };
  }

  async startScene(sceneInput = {}) {
    const scene = this.buildScene(sceneInput);
    this.activeScene = scene;
    this.store?.setActiveScene(scene);
    this.eventBus?.emit("scene:start", scene);
    this.playbackManager?.startScene(scene);
    Promise.resolve(this.pluginManager?.startScene(scene)).catch(error => {
      this.eventBus?.emit("scene:plugin-start-failed", {
        sceneKey: scene.key,
        error: error?.message || String(error),
      });
    });
    return scene;
  }

  async stopScene() {
    const scene = this.activeScene;
    if (!scene) return;
    this.eventBus?.emit("scene:stop", scene);
    this.playbackManager?.stopScene(scene.key);
    Promise.resolve(this.pluginManager?.stopScene(scene)).catch(error => {
      this.eventBus?.emit("scene:plugin-stop-failed", {
        sceneKey: scene.key,
        error: error?.message || String(error),
      });
    });
    this.activeScene = null;
    this.store?.setActiveScene(null);
  }

  completeScene() {
    if (!this.activeScene) return;
    this.playbackManager?.completeScene(this.activeScene.key);
    this.eventBus?.emit("scene:complete", this.activeScene);
  }
}

export default SceneManager;
