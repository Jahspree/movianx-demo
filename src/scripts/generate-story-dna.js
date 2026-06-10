#!/usr/bin/env node
// ===========================================================================
// Generate StoryDNA — Gemini 2.5 Flash structured output
//
// StoryDNA is the single source of truth for a story's beat-level
// performance: text, emotion, tension, voice direction, breathing,
// silence, sound priority, spatial direction, listener role, choices.
//
// Beat TEXT is an immutable input — Gemini enriches the performance
// dimensions but never rewrites the line, so existing narration audio
// stays valid (no regeneration cost).
//
// Usage:
//   GEMINI_API_KEY=xxx node src/scripts/generate-story-dna.js
//
// Output: src/data/storyDNA/10seconds.json
// ===========================================================================

const fs   = require("fs");
const path = require("path");

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL   = "gemini-2.5-flash";
const OUT     = path.join(__dirname, "../data/storyDNA/10seconds.json");

if (!API_KEY) {
  console.error("ERROR: Set GEMINI_API_KEY");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Immutable beat inputs — text matches the generated narration audio exactly.
// tension/silenceAfter carried from the proven beat manifest as anchors.
// ---------------------------------------------------------------------------

const STORY = {
  storyKey: "10seconds",
  title: "10 Seconds",
  premise:
    "Home invasion survival thriller. 3:47 AM. Intruders break in downstairs. " +
    "Sarah and her spouse are in bed upstairs; their two children sleep down the hall. " +
    "Every line is Sarah whispering to her spouse in real time.",
  listenerRole:
    "The listener IS Sarah's spouse, lying beside her in the dark. " +
    "Sarah speaks directly to them. They make the choices. They are hiding together.",
  chapters: [
    {
      idx: 0, label: "the quiet before", hasChoice: true,
      beats: [
        { beatId: "ch0_sleeping",      beatIndex: 0, text: "Hey. Wake up.", tension: 12, silenceAfter: 1200 },
        { beatId: "ch0_first_creak",   beatIndex: 1, text: "Did you hear that? No. Listen. That wasn't nothing.", tension: 34, silenceAfter: 900 },
        { beatId: "ch0_glass_breaks",  beatIndex: 2, text: "Someone's in the house. I heard glass downstairs. They're inside.", tension: 68, silenceAfter: 600 },
        { beatId: "ch0_realization",   beatIndex: 3, text: "I can hear them moving. More than one. The bat's in the closet. My phone's dead. The kids are down the hall.", tension: 82, silenceAfter: 800 },
        { beatId: "ch0_timer_warning", beatIndex: 4, text: "What do we do?", tension: 88, silenceAfter: 400 },
      ],
    },
    {
      idx: 1, label: "the threat advances", hasChoice: true,
      beats: [
        { beatId: "ch1_ransacking", beatIndex: 0, text: "They're coming up. The stairs. I can hear them.", tension: 72, silenceAfter: 700 },
        { beatId: "ch1_upstairs",   beatIndex: 1, text: "One step. Two. Three. They stopped. No. They're moving again.", tension: 84, silenceAfter: 600 },
        { beatId: "ch1_landing",    beatIndex: 2, text: "The kids are right there. Three doors down. He said something. He knows we're here.", tension: 91, silenceAfter: 500 },
        { beatId: "ch1_come_out",   beatIndex: 3, text: "He's on the landing now. Same floor. Same air. I can't think. What do we do? Please.", tension: 94, silenceAfter: 400 },
      ],
    },
    {
      idx: 2, label: "the choice", hasChoice: true,
      beats: [
        { beatId: "ch2_gun_revealed", beatIndex: 0, text: "He has a gun. I can see it.", tension: 88, silenceAfter: 700 },
        { beatId: "ch2_daughter_cry", beatIndex: 1, text: "Our baby is crying. She can hear us.", tension: 95, silenceAfter: 500 },
        { beatId: "ch2_last_chance",  beatIndex: 2, text: "He said last chance. Whatever happens, protect the kids. Promise me. Promise me.", tension: 98, silenceAfter: 300 },
        { beatId: "ch2_handle_turns", beatIndex: 3, text: "The handle is turning. Right now.", tension: 100, silenceAfter: 200 },
        { beatId: "ch2_the_choice",   beatIndex: 4, text: "Tell me. Please. I can't do this alone.", tension: 100, silenceAfter: 1500 },
      ],
    },
    {
      idx: 3, label: "the weight", hasChoice: true,
      beats: [
        { beatId: "ch3_aftermath",    beatIndex: 0, text: "It's done. There was no right answer. There never was.", tension: 42, silenceAfter: 1500 },
        { beatId: "ch3_sirens",       beatIndex: 1, text: "I keep hearing it. Over and over. The sound. The choices. The ten seconds.", tension: 36, silenceAfter: 1200 },
        { beatId: "ch3_james_speaks", beatIndex: 2, text: "What did we become?", tension: 32, silenceAfter: 2000 },
        { beatId: "ch3_the_weight",   beatIndex: 3, text: "What did we become... in ten seconds?", tension: 30, silenceAfter: 3000 },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Gemini structured-output schema for one enriched beat
// ---------------------------------------------------------------------------

const BEAT_SCHEMA = {
  type: "object",
  properties: {
    beatId:    { type: "string" },
    emotion:   { type: "string", description: "Sarah's emotional state in 1-2 words, e.g. 'terrified calculation', 'breaking', 'numb grief'" },
    voiceDirection: { type: "string", description: "One sentence of acting direction for the voice performance" },
    breathing: { type: "string", enum: ["slow", "uneven", "shallow", "panic", "held"], description: "Sarah's breathing pattern during this beat" },
    silenceType: { type: "string", enum: ["normal", "anticipation", "fear", "grief"], description: "Quality of the silence after this beat" },
    soundPriority: { type: "string", description: "The ONE sound that matters most this beat, e.g. 'her whisper', 'footstep on stair 3', 'total silence'" },
    spatial: {
      type: "object",
      description: "Where the threat sound source is relative to the listener (origin). Negative z = away through the house. Use the approach path: downstairs far (z -8), stairs (z -5), landing (z -2), outside bedroom door (z -0.9).",
      properties: {
        sourceLabel: { type: "string", description: "What is making sound at this position, e.g. 'glass breaking downstairs', 'footsteps on stairs'" },
        from: { type: "object", properties: { x: { type: "number" }, y: { type: "number" }, z: { type: "number" } }, required: ["x", "y", "z"] },
        to:   { type: "object", properties: { x: { type: "number" }, y: { type: "number" }, z: { type: "number" } }, required: ["x", "y", "z"] },
        movementMs: { type: "number", description: "0 if the source does not move during this beat" },
      },
      required: ["sourceLabel", "from", "to", "movementMs"],
    },
    sfx: { type: "string", description: "Sound effect to trigger at this beat from: glass_break, footsteps_stone, floor_creak, door_handle, none" },
    isChoiceMoment: { type: "boolean", description: "True only for the beat where the chapter's choice should appear" },
  },
  required: ["beatId", "emotion", "voiceDirection", "breathing", "silenceType", "soundPriority", "spatial", "sfx", "isChoiceMoment"],
};

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    beats: { type: "array", items: BEAT_SCHEMA },
  },
  required: ["beats"],
};

// ---------------------------------------------------------------------------

async function enrichChapter(chapter) {
  const prompt = [
    `Story: ${STORY.title}. ${STORY.premise}`,
    `Listener role: ${STORY.listenerRole}`,
    ``,
    `Chapter ${chapter.idx} — "${chapter.label}". Chapter has a timed choice: ${chapter.hasChoice}.`,
    `Enrich each beat below with performance DNA. Do NOT rewrite the text — it is already recorded.`,
    `The threat follows a physical approach path toward the listener across the story:`,
    `downstairs far (z=-8) → stairs (z=-5) → landing (z=-2) → outside the bedroom door (z=-0.9).`,
    `Chapter 3 is aftermath — threat gone, sounds recede (sirens far away, positive distance growing).`,
    `Mark isChoiceMoment=true ONLY on the final beat of the chapter when hasChoice is true.`,
    ``,
    `Beats:`,
    ...chapter.beats.map(b => `- ${b.beatId} (beat ${b.beatIndex}, tension ${b.tension}): "${b.text}"`),
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
          temperature: 0.4,
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
  if (!text) throw new Error(`Empty Gemini response for chapter ${chapter.idx}`);
  return JSON.parse(text).beats;
}

async function main() {
  console.log(`StoryDNA Generator — ${STORY.title} via ${MODEL}\n`);

  const dna = {
    storyKey: STORY.storyKey,
    title: STORY.title,
    premise: STORY.premise,
    listenerRole: STORY.listenerRole,
    generatedBy: MODEL,
    generatedAt: new Date().toISOString(),
    chapters: {},
  };

  for (const chapter of STORY.chapters) {
    process.stdout.write(`Chapter ${chapter.idx} (${chapter.beats.length} beats)... `);
    const enriched = await enrichChapter(chapter);

    const byId = Object.fromEntries(enriched.map(e => [e.beatId, e]));
    const beats = chapter.beats.map(input => {
      const e = byId[input.beatId];
      if (!e) throw new Error(`Gemini omitted beat ${input.beatId}`);
      return {
        id:           input.beatId,
        beatIndex:    input.beatIndex,
        text:         input.text,            // immutable — matches recorded audio
        tension:      input.tension,         // anchored — drives EmotionConductor bands
        silenceAfter: input.silenceAfter,    // anchored — proven pacing
        emotion:        e.emotion,
        voiceDirection: e.voiceDirection,
        breathing:      e.breathing,
        silenceType:    e.silenceType,
        soundPriority:  e.soundPriority,
        spatial:        e.spatial,
        sfx:            e.sfx === "none" ? null : e.sfx,
        isChoiceMoment: Boolean(e.isChoiceMoment),
      };
    });

    dna.chapters[chapter.idx] = { label: chapter.label, hasChoice: chapter.hasChoice, beats };
    console.log("done");
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(dna, null, 2));
  const totalBeats = Object.values(dna.chapters).reduce((n, c) => n + c.beats.length, 0);
  console.log(`\nWrote ${OUT} — ${totalBeats} beats`);
}

main().catch(e => { console.error(e.message || e); process.exit(1); });
