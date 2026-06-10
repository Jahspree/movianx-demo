#!/usr/bin/env node
// ===========================================================================
// Generate Beat Performance Dataset — 5 Target Beats
//
// Calls Gemini 2.5 Flash to produce a voice-performance document for each
// of the 5 highest-ROI beats in 10 Seconds.
//
// Schema per beat:
//   contextPrefix         — what just happened before this line (acting context)
//   emotionallyOptimizedDialogue — text sent to ElevenLabs, with v3 acting
//                                  tags + punctuation for delivery
//   hiddenEmotion         — what Sarah feels but doesn't say
//   listenerRelationship  — how she relates to the listener in this line
//   breathingPattern      — physiological description
//   roomPresence          — acoustic/spatial state this beat occupies
//   performanceObjective  — single-sentence acting direction
//   stability             — ElevenLabs voice_settings.stability
//   style                 — ElevenLabs voice_settings.style
//   similarityBoost       — ElevenLabs voice_settings.similarity_boost
//   speed                 — ElevenLabs voice_settings.speed
//
// Usage:
//   GEMINI_API_KEY=xxx node src/scripts/generate-beat-performance.js
//
// Output: src/data/storyDNA/beat-performance-5.json
// ===========================================================================

const fs   = require("fs");
const path = require("path");

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL   = "gemini-2.5-flash";
const OUT     = path.join(__dirname, "../data/storyDNA/beat-performance-5.json");

if (!API_KEY) {
  console.error("ERROR: Set GEMINI_API_KEY");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Target beats — beat text is immutable (matches the recorded audio).
// Acting tags / punctuation in emotionallyOptimizedDialogue can differ from
// the screen text; they control ElevenLabs delivery, not what's displayed.
//
// ElevenLabs eleven_v3 acting tags (official):
//   <<whispering>> <<breathless>> <<gasping>> <<panicked>> <<crying>>
//
// Effective v3 punctuation:
//   — (em dash)  = abrupt cut / interruption
//   ... (ellipsis) = held breath / trailing pause
//   ! = sharp emphasis
//
// NOTE: v3 does NOT support previous_text/next_text. contextPrefix is acting
//       reference for directing the optimizedDialogue — not an API field.
//
// Runaway audio rule: single dominant tag per beat; raise stability to 0.18+
//   if combining fragmented text + low stability. Beat 06 is HIGH RISK.
// ---------------------------------------------------------------------------

const TARGET_BEATS = [
  {
    globalIndex: 3,
    label: "First Escalation",
    beatId: "ch0_realization",
    chapterIdx: 0,
    beatIndex: 3,
    screenText: "I can hear them moving. More than one. The bat's in the closet. My phone's dead. The kids are down the hall.",
    currentTags: "<<breathless>> I can hear them moving. More than one. <<whispering>> The bat's in the closet. My phone's dead. The kids are down the hall.",
    tension: 82,
    currentStability: 0.18,
    currentStyle: 0.80,
    emotionalArcNote: "Cold inventory under terror. 'More than one' is the blow. Then rapid resource-checking against impossibility.",
    riskNote: "Multi-tag switch at mid-line inventory is the known AI artifact: voice enumerates with musical rising tone.",
  },
  {
    globalIndex: 6,
    label: "Ten Second Countdown",
    beatId: "ch1_upstairs",
    chapterIdx: 1,
    beatIndex: 1,
    screenText: "One step. Two. Three. They stopped. No. They're moving again.",
    currentTags: "<<breathless>> One step. Two. Three. <<whispering>> They stopped. <<breathless>> No. They're moving again.",
    tension: 84,
    currentStability: 0.12,
    currentStyle: 0.90,
    emotionalArcNote: "She's counting their footsteps. Each number is a step closer. 'They stopped' is false hope. 'No.' shatters it.",
    riskNote: "HIGHEST RUNAWAY RISK. Multi-tag + counting structure + stability 0.12 = previous 952K bak. Must: single dominant tag, stability >= 0.18, use — for the cut.",
  },
  {
    globalIndex: 8,
    label: "Complicity Disclosure",
    beatId: "ch1_come_out",
    chapterIdx: 1,
    beatIndex: 3,
    screenText: "He's on the landing now. Same floor. Same air. I can't think. What do we do? Please.",
    currentTags: "<<whispering>> He's on the landing now. Same floor. <<breathless>> Same air. I can't think. What do we do? <<crying>> Please.",
    tension: 94,
    currentStability: 0.10,
    currentStyle: 0.92,
    emotionalArcNote: "'Same air' — she can feel the intruder's presence through the door. 'I can't think' is the first admission of failure. 'Please' is the most vulnerable word in the story.",
    riskNote: "Three-tag switch. <<crying>> on 'Please.' produces theatrical sob not a broken single word. 'Please' must arrive small, cracked, almost inaudible — not performed.",
  },
  {
    globalIndex: 12,
    label: "Two Seconds",
    beatId: "ch2_handle_turns",
    chapterIdx: 2,
    beatIndex: 3,
    screenText: "The handle is turning. Right now.",
    currentTags: "<<breathless>> The handle is turning. Right now.",
    tension: 100,
    currentStability: 0.06,
    currentStyle: 0.95,
    emotionalArcNote: "She watches it happening in real time. Present tense. 'Right now' because she cannot believe it. Voice is barely air.",
    riskNote: "<<breathless>> is wrong emotion — breathless is exertion. She is FROZEN watching the handle. The correct affect is paralysis, barely-formed whisper.",
  },
  {
    globalIndex: 16,
    label: "Neurological Breakdown",
    beatId: "ch3_james_speaks",
    chapterIdx: 3,
    beatIndex: 2,
    screenText: "What did we become?",
    currentTags: "<<crying>> What did we become?",
    tension: 32,
    currentStability: 0.60,
    currentStyle: 0.20,
    emotionalArcNote: "She's asking her partner. Or herself. Or both. Not rhetorical. She genuinely doesn't know who they are after this. The silence after should breathe.",
    riskNote: "stability 0.60 too clean for 'barely audible, filled with self-reproach'. <<crying>> delivers performed grief not hollow shock. The correct affect is hollow, dissociated.",
  },
];

const CONTEXT = {
  premise: "Home invasion survival thriller. 3:47 AM. Sarah and her spouse in bed upstairs; two children down the hall. Intruders break in downstairs.",
  listenerRole: "The listener IS Sarah's spouse, lying beside her in the dark. She speaks directly to them in real time.",
  voiceModel: "ElevenLabs eleven_v3 (Rachel, voice_id: 21m00Tcm4TlvDq8ikWAM)",
  tags: "Official v3 acting tags: <<whispering>> <<breathless>> <<gasping>> <<panicked>> <<crying>>",
  punctuation: "v3 effective punctuation: — (abrupt cut), ... (held pause), ! (sharp emphasis). AVOID: multiple tag switches in one short line.",
};

const BEAT_SCHEMA = {
  type: "object",
  properties: {
    beatId: { type: "string" },
    contextPrefix: {
      type: "string",
      description: "1-2 sentences: what just happened in the story before this line. Used as acting reference, not sent to ElevenLabs.",
    },
    emotionallyOptimizedDialogue: {
      type: "string",
      description: "The ElevenLabs text for this beat. Include v3 acting tags and punctuation (— for cuts, ... for pauses). Screen text words are immutable — punctuation and acting tags may change. Single dominant acting tag per beat preferred (prevents runaway audio).",
    },
    hiddenEmotion: {
      type: "string",
      description: "What Sarah is actually feeling beneath the spoken words — the subtext she cannot say aloud.",
    },
    listenerRelationship: {
      type: "string",
      description: "How Sarah relates to the listener (her spouse) in this specific line. Is she asking? warning? confiding? begging?",
    },
    breathingPattern: {
      type: "string",
      enum: ["held", "shallow", "uneven", "panic", "slow", "none"],
      description: "Sarah's breathing during this beat.",
    },
    roomPresence: {
      type: "string",
      description: "The acoustic/spatial feeling of this beat — where are they, what does the air feel like, what sounds exist in the space.",
    },
    performanceObjective: {
      type: "string",
      description: "Single-sentence acting direction — what the voice performance must achieve. The one thing that must land.",
    },
    stability: {
      type: "number",
      description: "ElevenLabs stability (0-1). Lower = more emotional variation. Must be >= 0.18 if the text has fragmented phrases or multiple acting tags (runaway prevention). ch3 grief beats: use 0.42-0.58.",
    },
    style: {
      type: "number",
      description: "ElevenLabs style (0-1). Higher = more dramatic. Match to emotional intensity.",
    },
    similarityBoost: {
      type: "number",
      description: "ElevenLabs similarity_boost (0-1). Lower for extreme moments (0.72-0.78), higher for quieter moments (0.85-0.92).",
    },
    speed: {
      type: "number",
      description: "ElevenLabs speed (0.7-1.15). Slower for grief/shock (0.74-0.84), faster for panic (0.92-1.05).",
    },
  },
  required: ["beatId", "contextPrefix", "emotionallyOptimizedDialogue", "hiddenEmotion", "listenerRelationship", "breathingPattern", "roomPresence", "performanceObjective", "stability", "style", "similarityBoost", "speed"],
};

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    beats: { type: "array", items: BEAT_SCHEMA },
  },
  required: ["beats"],
};

async function generatePerformance(beats) {
  const prompt = [
    `Story: ${CONTEXT.premise}`,
    `Listener: ${CONTEXT.listenerRole}`,
    `Voice model: ${CONTEXT.voiceModel}`,
    `Acting tags: ${CONTEXT.tags}`,
    `Punctuation: ${CONTEXT.punctuation}`,
    ``,
    `Generate a voice performance dataset for these 5 beats. The goal:`,
    `Sarah must sound: frightened, vulnerable, dependent, exhausted, human.`,
    `NOT: narrator, storyteller, audiobook reader, AI voice assistant.`,
    ``,
    `CRITICAL RULES:`,
    `1. Single dominant acting tag per beat (prevents runaway multi-megabyte audio).`,
    `2. Use — for abrupt cuts, ... for held pauses. These work in eleven_v3.`,
    `3. Beat 06 (ch1_upstairs): stability MUST be >= 0.18 (previous run generated 952KB due to multi-tag + low stability). Keep to 1-2 tags max.`,
    `4. Beat 16 (ch3_james_speaks): this is hollow shock / dissociation, NOT active crying. Do not use <<crying>> tag. Use <<whispering>> or no tag.`,
    `5. Beat 12 (ch2_handle_turns): <<breathless>> is WRONG for frozen terror watching a handle turn. Use <<whispering>>.`,
    ``,
    `Beats to enrich:`,
    ...beats.map(b => [
      `--- Beat ${b.globalIndex} [${b.label}] ---`,
      `beatId: ${b.beatId}`,
      `Screen text (immutable words): "${b.screenText}"`,
      `Current ElevenLabs text (has issues): ${b.currentTags}`,
      `Tension: ${b.tension}/100`,
      `Arc note: ${b.emotionalArcNote}`,
      `Known issue: ${b.riskNote}`,
    ].join("\n")),
  ].join("\n");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
          temperature: 0.35,
        },
      }),
    }
  );

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Gemini HTTP ${res.status}: ${detail.slice(0, 400)}`);
  }

  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty Gemini response");
  return JSON.parse(text).beats;
}

async function main() {
  console.log(`Beat Performance Generator — 5 target beats via ${MODEL}\n`);

  const enriched = await generatePerformance(TARGET_BEATS);
  console.log(`Gemini returned ${enriched.length} beats`);

  // Merge with input data for the output document
  const byId = Object.fromEntries(enriched.map(e => [e.beatId, e]));
  const output = {
    storyKey: "10seconds",
    generatedBy: MODEL,
    generatedAt: new Date().toISOString(),
    scope: "5 highest-ROI beats for voice performance improvement",
    beats: TARGET_BEATS.map(input => {
      const e = byId[input.beatId];
      if (!e) throw new Error(`Gemini omitted beat ${input.beatId}`);
      return {
        globalIndex: input.globalIndex,
        label: input.label,
        beatId: input.beatId,
        chapterIdx: input.chapterIdx,
        beatIndex: input.beatIndex,
        screenText: input.screenText,
        // Gemini output
        contextPrefix: e.contextPrefix,
        emotionallyOptimizedDialogue: e.emotionallyOptimizedDialogue,
        hiddenEmotion: e.hiddenEmotion,
        listenerRelationship: e.listenerRelationship,
        breathingPattern: e.breathingPattern,
        roomPresence: e.roomPresence,
        performanceObjective: e.performanceObjective,
        voiceSettings: {
          stability: e.stability,
          style: e.style,
          similarityBoost: e.similarityBoost,
          speed: e.speed,
        },
      };
    }),
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(output, null, 2));

  console.log(`\nWrote ${OUT}`);
  console.log("\nSummary:");
  output.beats.forEach(b => {
    console.log(`\n[Beat ${b.globalIndex}] ${b.label} (${b.beatId})`);
    console.log(`  Stability: ${b.voiceSettings.stability}  Style: ${b.voiceSettings.style}  Speed: ${b.voiceSettings.speed}`);
    console.log(`  Text: ${b.emotionallyOptimizedDialogue}`);
    console.log(`  Objective: ${b.performanceObjective}`);
  });
}

main().catch(e => { console.error(e.message || e); process.exit(1); });
