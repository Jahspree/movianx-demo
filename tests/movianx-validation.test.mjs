import test from "node:test";
import assert from "node:assert/strict";

import { buildNarration } from "../src/lib/NarrationBuilder.js";
import { buildAudioOrchestration } from "../src/lib/AudioOrchestrationEngine.js";
import { analyzeStoryEmotion } from "../src/lib/EmotionAnalysisEngine.js";
import {
  createHollywoodModeSequence,
  getHollywoodSilenceDuration,
  getProximityProfile,
} from "../src/lib/HollywoodModeEngine.js";
import { createValidationCache } from "../src/lib/ValidationCache.js";
import {
  buildDirectedSsml,
  buildElevenLabsRequest,
  buildVoiceDelivery,
} from "../src/lib/VoiceDirector.js";

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

test("Hollywood Mode sequences buildup, silence, event, and reaction in order", () => {
  const sequence = createHollywoodModeSequence(
    { emotionLabel: "fear", intensity: 3, location: "horror hallway" },
    "Footsteps stop outside the door. The handle turns.",
    { storyId: 3, chapterId: 0 }
  );
  const phases = sequence.phases.map(phase => phase.phase);
  const event = sequence.phases.find(phase => phase.phase === "event");
  const reaction = sequence.phases.find(phase => phase.phase === "reaction");

  assert.deepEqual(phases, ["presence", "tension", "silence", "event", "reaction"]);
  assert.ok(event.delayMs >= sequence.minMajorEventSpacingMs);
  assert.ok(reaction.delayMs > event.delayMs);
  assert.ok(reaction.reactionDelayMs >= 200);
  assert.ok(reaction.reactionDelayMs <= 600);
});

test("Hollywood Mode never creates constant looping cues", () => {
  const sequence = createHollywoodModeSequence(
    { emotionLabel: "suspense", intensity: 2, location: "farm" },
    "The barn settles. Something shifts behind the boards.",
    { storyId: 1, chapterId: 2 }
  );

  assert.equal(sequence.noConstantAudio, true);
  sequence.phases.forEach(phase => assert.equal(phase.loop, false));
});

test("Hollywood silence duration follows intensity bands", () => {
  const low = getHollywoodSilenceDuration(1, "same");
  const mid = getHollywoodSilenceDuration(2, "same");
  const high = getHollywoodSilenceDuration(3, "same");

  assert.ok(low >= 1000 && low <= 2000);
  assert.ok(mid >= 2000 && mid <= 4000);
  assert.ok(high >= 3000 && high <= 6000);
});

test("Hollywood proximity makes close sounds clearer and nearer than far sounds", () => {
  const far = getProximityProfile("far");
  const close = getProximityProfile("close");
  const farDistance = Math.sqrt(far.position.x ** 2 + far.position.y ** 2 + far.position.z ** 2);
  const closeDistance = Math.sqrt(close.position.x ** 2 + close.position.y ** 2 + close.position.z ** 2);

  assert.ok(closeDistance < farDistance);
  assert.ok(close.volume > far.volume);
  assert.ok(close.reverbAmount < far.reverbAmount);
});

test("Hollywood spatial cues move instead of remaining static", () => {
  const sequence = createHollywoodModeSequence(
    { emotionLabel: "fear", intensity: 3, location: "indoor" },
    "Glass breaks downstairs. Someone is inside.",
    { storyId: 3, chapterId: 0 }
  );
  const moving = sequence.phases.filter(phase => phase.startPosition && phase.endPosition);

  assert.ok(moving.length >= 2);
  moving.forEach(phase => assert.notDeepEqual(phase.startPosition, phase.endPosition));
});

test("Voice Director creates irregular fear micro-pauses", () => {
  const delivery = buildVoiceDelivery(
    "The glass breaks downstairs. Footsteps stop. The handle turns. Someone is inside.",
    { emotionLabel: "fear", intensity: 3, storyId: 3, chapterId: 0 },
    "terrified whisper"
  );

  assert.equal(delivery.emotion, "fear");
  assert.equal(delivery.cadence, "irregular");
  assert.ok(new Set(delivery.pauses).size > 1);
  assert.ok(delivery.maxWordsPerLine <= 7);
});

test("Voice Director gives sadness longer pauses than fear", () => {
  const sadness = buildVoiceDelivery(
    "It is over now. There was nothing left to hold onto. We stayed there in the quiet.",
    { emotionLabel: "sadness", intensity: 2 },
    "grief filled delivery"
  );
  const fear = buildVoiceDelivery(
    "Stay down. Do not move. Someone is outside.",
    { emotionLabel: "fear", intensity: 3 },
    "terrified whisper"
  );
  const avg = values => values.reduce((sum, value) => sum + value, 0) / values.length;

  assert.ok(avg(sadness.pauses) > avg(fear.pauses));
});

test("Voice Director keeps breath as non-looping cue metadata, not spoken text", () => {
  const delivery = buildVoiceDelivery(
    "Something moved behind us. I can hear it. Do not turn around.",
    { emotionLabel: "fear", intensity: 3, storyId: 3, chapterId: 1 },
    "panic rising"
  );
  const ssml = buildDirectedSsml("Something moved behind us. I can hear it. Do not turn around.", delivery);

  delivery.imperfectionCues.forEach(cue => assert.equal(cue.loop, false));
  assert.doesNotMatch(ssml, /\(breathing\)|\[breathing\]|short_breath|held_breath/i);
});

test("Voice Director maps energy curve into ElevenLabs settings", () => {
  const low = buildElevenLabsRequest({
    text: "The morning is quiet. We can move slowly.",
    sceneProfile: { emotionLabel: "joy", intensity: 1 },
    direction: "warm relief",
    voiceSettings: { stability: 0.4, similarity_boost: 0.85, style: 0.35, speed: 0.95 },
  });
  const high = buildElevenLabsRequest({
    text: "The lock breaks. They are inside. Run now.",
    sceneProfile: { emotionLabel: "fear", intensity: 3 },
    direction: "terrified panic",
    voiceSettings: { stability: 0.4, similarity_boost: 0.85, style: 0.35, speed: 0.95 },
  });

  assert.ok(high.delivery.energy > low.delivery.energy);
  assert.ok(high.request.voice_settings.style > low.request.voice_settings.style);
  assert.ok(high.request.voice_settings.stability < low.request.voice_settings.stability);
});

test("Voice Director builds ElevenLabs SSML without robotic uniform timing", () => {
  const { request, delivery, spokenText } = buildElevenLabsRequest({
    text: "What was that? Stay quiet. The door is moving.",
    sceneProfile: { emotionLabel: "fear", intensity: 3 },
    direction: "terrified whisper",
    modelId: "eleven_turbo_v2",
    previousText: "The house had gone still.",
    nextText: "The footsteps reached the landing.",
  });

  assert.equal(request.model_id, "eleven_turbo_v2");
  assert.match(request.text, /^<speak>/);
  assert.match(request.text, /<break time="\d+ms"\/>/);
  assert.ok(new Set(delivery.pauses).size > 1);
  assert.equal(spokenText.includes("(breathing)"), false);
  assert.equal(request.previous_text.includes("<speak>"), false);
  assert.equal(request.next_text.includes("<speak>"), false);
});
