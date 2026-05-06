import test from "node:test";
import assert from "node:assert/strict";

import { buildNarration } from "../src/lib/NarrationBuilder.js";
import { buildAudioOrchestration } from "../src/lib/AudioOrchestrationEngine.js";
import { analyzeStoryEmotion } from "../src/lib/EmotionAnalysisEngine.js";
import { createValidationCache } from "../src/lib/ValidationCache.js";

const FORBIDDEN_SPOKEN = /\b(?:you feel|the scene|emotion|ambience|music)\b/i;

function sentences(text) {
  return text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(sentence => sentence.trim()).filter(Boolean) || [];
}

function maxWordsPerSentence(text) {
  return Math.max(...sentences(text).map(sentence => sentence.split(/\s+/).filter(Boolean).length));
}

test("narration removes metadata and forbidden feeling phrases", () => {
  const result = buildNarration(
    "The scene says you feel scared. Emotion: fear. Ambience: dark room. Footsteps behind the door. Silence.",
    { emotionLabel: "fear", intensity: 3 }
  );

  assert.deepEqual(Object.keys(result), ["spokenText"]);
  assert.equal(FORBIDDEN_SPOKEN.test(result.spokenText), false);
  assert.match(result.spokenText, /quiet|move|door|stay|listen/i);
});

test("narration sentence structure changes by emotion", () => {
  const fear = buildNarration(
    "Glass breaks downstairs. Footsteps move behind the door. The handle turns. Someone has a gun.",
    { emotionLabel: "fear", intensity: 3 }
  ).spokenText;
  const sadness = buildNarration(
    "She was gone after the farewell, and the house carried the quiet weight of everything they had lost.",
    { emotionLabel: "sadness", intensity: 2 }
  ).spokenText;

  assert.ok(maxWordsPerSentence(fear) < maxWordsPerSentence(sadness));
  assert.ok(sentences(fear).length >= 2);
});

test("narration hesitation is capped to one per two sentences", () => {
  const { spokenText } = buildNarration(
    "Silence. Quiet. Something stopped. Footsteps behind the door. Glass breaks.",
    { emotionLabel: "fear", intensity: 3 }
  );
  const hesitationCount = (spokenText.match(/\.\.\./g) || []).length;
  const sentenceCount = sentences(spokenText).length;

  assert.ok(hesitationCount <= Math.ceil(sentenceCount / 2));
});

test("audio orchestration never loops breathing or heartbeat", () => {
  const plan = buildAudioOrchestration({
    emotionLabel: "fear",
    genre: "horror",
    pacing: "fast",
    intensity: 3,
    environment: "indoor",
  });
  const physiology = plan.sfxTriggers.filter(trigger => /heartbeat|breathing_raspy|breath/i.test(trigger.sound));

  assert.ok(physiology.length >= 1);
  physiology.forEach(trigger => {
    assert.equal(trigger.loop, false);
    assert.match(trigger.triggerMode, /spike|intermittent/);
    assert.ok(trigger.cooldownMs >= 10_000);
  });
});

test("audio SFX triggers use cooldowns and avoid constant repetition", () => {
  const plan = buildAudioOrchestration({
    emotionLabel: "suspense",
    genre: "thriller",
    pacing: "medium",
    intensity: 2,
    environment: "urban",
  });

  assert.ok(plan.sfxTriggers.length > 0);
  plan.sfxTriggers.forEach(trigger => {
    assert.equal(trigger.loop, false);
    assert.ok(trigger.cooldownMs >= 5_000);
    assert.ok(trigger.delayMs >= 0);
  });
  assert.ok(new Set(plan.sfxTriggers.map(trigger => trigger.delayMs)).size === plan.sfxTriggers.length);
});

test("cut-off guard: narration output contains complete sentences", () => {
  const { spokenText } = buildNarration(
    "The door handle turns slowly. Footsteps stop outside. Silence fills the hallway.",
    { emotionLabel: "fear", intensity: 3 }
  );

  assert.ok(spokenText.length > 0);
  sentences(spokenText).forEach(sentence => {
    assert.match(sentence, /[.!?]$/);
    assert.doesNotMatch(sentence, /[,;:]$/);
  });
});

test("emotion analysis maps fear scene to intensity 3", () => {
  const result = analyzeStoryEmotion(
    "The intruder has a gun. Blood on the stairs. The door breaks open. I run, but footsteps chase me."
  );

  assert.equal(result.emotionLabel, "fear");
  assert.equal(result.intensity, 3);
});

test("emotion analysis maps sadness scene to intensity 2", () => {
  const result = analyzeStoryEmotion(
    "She stood alone after the farewell, grieving the loss they could not repair."
  );

  assert.equal(result.emotionLabel, "sadness");
  assert.equal(result.intensity, 2);
});

test("performance guard: engines do not make network API calls", () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = () => {
    calls += 1;
    throw new Error("network disabled in validation tests");
  };

  try {
    analyzeStoryEmotion("Footsteps behind the door. Silence. I hide.");
    buildAudioOrchestration({ emotionLabel: "fear", intensity: 3, environment: "indoor" });
    buildNarration("Footsteps behind the door. Silence.", { emotionLabel: "fear", intensity: 3 });
    assert.equal(calls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("performance guard: validation cache prevents repeated work", () => {
  const cache = createValidationCache({ maxEntries: 4, ttlMs: 10_000 });
  let producerCalls = 0;
  const first = cache.getOrSet("same-story", () => {
    producerCalls += 1;
    return analyzeStoryEmotion("The intruder waits behind the door with a gun.");
  }, 1_000);
  const second = cache.getOrSet("same-story", () => {
    producerCalls += 1;
    return analyzeStoryEmotion("This should not run.");
  }, 1_001);

  assert.equal(first.cacheHit, false);
  assert.equal(second.cacheHit, true);
  assert.equal(producerCalls, 1);
  assert.deepEqual(second.value, first.value);
});
