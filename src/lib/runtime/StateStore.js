const INITIAL_STATE = {
  activeScene: null,
  playback: {
    status: "idle",
    sceneKey: null,
    narrationStatus: "idle",
    assetStatus: {},
  },
  navigation: {
    status: "idle",
    from: null,
    to: null,
  },
  plugins: {},
};

function clone(value) {
  if (value === undefined || value === null) return value;
  return JSON.parse(JSON.stringify(value));
}

function mergeState(current, patch) {
  const next = { ...current };
  Object.keys(patch || {}).forEach(key => {
    const value = patch[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      current[key] &&
      typeof current[key] === "object" &&
      !Array.isArray(current[key])
    ) {
      next[key] = mergeState(current[key], value);
    } else {
      next[key] = value;
    }
  });
  return next;
}

export class StateStore {
  constructor(initialState = {}) {
    this.state = mergeState(clone(INITIAL_STATE), initialState);
    this.listeners = new Set();
  }

  getState() {
    return clone(this.state);
  }

  setState(patch = {}, meta = {}) {
    this.state = mergeState(this.state, patch);
    const snapshot = this.getState();
    this.listeners.forEach(listener => listener(snapshot, meta));
    return snapshot;
  }

  subscribe(listener) {
    if (typeof listener !== "function") return () => {};
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  setActiveScene(scene) {
    return this.setState({ activeScene: scene }, { type: "active-scene" });
  }

  setPlayback(patch) {
    return this.setState({ playback: patch }, { type: "playback" });
  }

  setNavigation(patch) {
    return this.setState({ navigation: patch }, { type: "navigation" });
  }

  setPluginState(pluginName, patch) {
    const current = this.state.plugins[pluginName] || {};
    return this.setState({
      plugins: {
        [pluginName]: mergeState(current, patch),
      },
    }, { type: "plugin", pluginName });
  }
}

export default StateStore;
