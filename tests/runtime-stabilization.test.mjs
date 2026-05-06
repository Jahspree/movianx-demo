import test from "node:test";
import assert from "node:assert/strict";
import { RuntimeManager } from "../src/lib/runtime/RuntimeManager.js";

function createMockAudio({ outcome = "ready", delayMs = 0 } = {}) {
  return url => {
    const listeners = new Map();
    return {
      url,
      duration: 1.25,
      preload: "auto",
      src: url,
      addEventListener(eventName, handler) {
        listeners.set(eventName, handler);
      },
      load() {
        setTimeout(() => {
          if (outcome === "ready") {
            listeners.get("canplaythrough")?.();
            listeners.get("loadedmetadata")?.();
          } else {
            listeners.get("error")?.(new Error("mock asset failure"));
          }
        }, delayMs);
      },
      pause() {},
    };
  };
}

test("navigation survives plugin crash and disables the failed plugin", async () => {
  const runtime = new RuntimeManager({ logger: null });
  let pluginContextKeys = [];

  runtime.registerPlugin({
    name: "CrashPlugin",
    initialize(context) {
      pluginContextKeys = Object.keys(context).sort();
      throw new Error("plugin exploded");
    },
  });

  await runtime.initializePlugins();
  const navigation = runtime.navigate({ from: "reading", to: "detail", kind: "view" });
  const state = runtime.getState();

  assert.equal(navigation.ok, true);
  assert.equal(state.navigation.status, "idle");
  assert.equal(state.navigation.to, "detail");
  assert.equal(state.plugins.CrashPlugin.status, "disabled");
  assert.deepEqual(pluginContextKeys, ["emit", "eventBus", "payload"]);
});

test("audio survives missing asset without freezing playback", async () => {
  const runtime = new RuntimeManager({ logger: null });
  const scene = await runtime.startScene({ storyId: 3, chapterIdx: 0, mode: "Immersive" });
  const statuses = [];

  const result = await runtime.playbackManager.playNarration({
    sceneKey: scene.key,
    url: null,
    onStatus: status => statuses.push(status),
  });

  runtime.completeScene();
  const state = runtime.getState();

  assert.equal(result.ok, false);
  assert.equal(result.status, "unavailable");
  assert.deepEqual(statuses, ["unavailable"]);
  assert.equal(state.playback.status, "complete");
  assert.equal(state.playback.narrationStatus, "unavailable");
});

test("playback survives narration play failure and can still complete scene", async () => {
  const runtime = new RuntimeManager({
    logger: null,
    createAudio: createMockAudio({ outcome: "ready" }),
  });
  const scene = await runtime.startScene({ storyId: 1, chapterIdx: 0, mode: "Cinematic" });

  const result = await runtime.playbackManager.playNarration({
    sceneKey: scene.key,
    url: "/audio/v3/frankenstein/ch0.mp3",
    play() {
      throw new Error("audio context refused playback");
    },
  });

  runtime.completeScene();
  const state = runtime.getState();

  assert.equal(result.ok, false);
  assert.equal(result.status, "unavailable");
  assert.equal(state.playback.status, "complete");
  assert.equal(state.playback.narrationStatus, "unavailable");
});

test("asset loader timeouts resolve as failures instead of throwing", async () => {
  const runtime = new RuntimeManager({
    logger: null,
    assetTimeoutMs: 10,
    createAudio: () => ({
      duration: 0,
      addEventListener() {},
      load() {},
      pause() {},
      src: "",
    }),
  });

  const result = await runtime.assetLoader.preloadAudio("/audio/v3/missing.mp3");

  assert.equal(result.ok, false);
  assert.equal(result.status, "unavailable");
  assert.match(result.error, /timed out/i);
});
