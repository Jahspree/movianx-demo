#!/usr/bin/env node
// ===========================================================================
// Generate Narration via ElevenLabs TTS API
//
// Usage:
//   ELEVEN_LABS_API_KEY=xxx node src/scripts/generate-narration.js
//
// Environment variables:
//   ELEVEN_LABS_API_KEY   — required
//   SCOPE                 — "timed" | "frank" | "all" (default: "all")
//   TIMED_VOICE_ID        — override voice ID for 10 Seconds
//   ELEVEN_MODEL_ID       — override model (default: eleven_multilingual_v2)
//   FORCE_REGEN           — "1" to overwrite all existing files
//   FORCE_REGEN_PATTERN   — regex pattern; overwrites files whose basename matches
//
// Examples:
//   # Regenerate only 10 Seconds chapters 1-3 and companions:
//   SCOPE=timed FORCE_REGEN_PATTERN="ch[123]" ELEVEN_LABS_API_KEY=xxx node src/scripts/generate-narration.js
//
//   # Regenerate all 10 Seconds files:
//   SCOPE=timed FORCE_REGEN=1 ELEVEN_LABS_API_KEY=xxx node src/scripts/generate-narration.js
//
//   # Regenerate everything:
//   FORCE_REGEN=1 ELEVEN_LABS_API_KEY=xxx node src/scripts/generate-narration.js
// ===========================================================================

const fs   = require("fs");
const path = require("path");
const https = require("https");

const API_KEY    = process.env.ELEVEN_LABS_API_KEY;
const SCOPE      = process.env.SCOPE || "all";          // "timed" | "frank" | "all"
const MODEL_ID   = process.env.ELEVEN_MODEL_ID || "eleven_multilingual_v2";
const RACHEL_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";        // Rachel — clear female whisper

if (!API_KEY) {
  console.error("ERROR: Set ELEVEN_LABS_API_KEY environment variable");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const FRANK_DIR = path.join(__dirname, "../../public/audio/v3/frankenstein");
const TIMED_DIR = path.join(__dirname, "../../public/audio/v3/timed");
fs.mkdirSync(FRANK_DIR, { recursive: true });
fs.mkdirSync(TIMED_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// 10 Seconds — Emotional Arc
//
// Standard narration: omniscient narrator, present-tense, inside the house
// Companion narration: Sarah, whispering directly in the listener's ear
//
// ElevenLabs levers:
//   stability        — 0 = max emotional variation, 1 = flat/monotone
//   similarity_boost — voice identity fidelity; lowered for wilder chapters
//   style            — 0 = neutral, 1 = maximum drama/exaggeration
// ---------------------------------------------------------------------------

const TIMED_VOICE_ID = process.env.TIMED_VOICE_ID || RACHEL_VOICE_ID;

// Standard narration — omniscient, present-tense
const TIMED_CHAPTERS = [
  // Ch0 — 3:47 AM
  "3:47 AM. You open your eyes. Something woke you. You don't know what. The house is quiet... Sarah is breathing beside you. The kids are down the hall... Then you hear it. Glass. Downstairs. Not a branch. Not a glass falling off a counter. A window... pushed in. Silence. You count. One. Two. Three... Then the crunch of glass under a shoe. Someone is in your house. A voice. Low. Then another voice. At least two of them. Sarah's hand finds your arm. Her nails dig in. The bat is in the closet. Your phone says four percent. The alarm is downstairs... where they are. You have ten seconds.",
  // Ch1 — The Hallway
  "You can hear them ransacking the living room. Drawers being pulled out. Furniture overturned. Then a voice: 'Check upstairs.' Footsteps on the stairs. Heavy. Deliberate. Sarah grabs your arm. 'They're coming.' Your daughter's room is three doors down. The footsteps stop. They're on the landing now. 'I know someone's up here. Come out, and nobody gets hurt.' You have 10 seconds.",
  // Ch2 — The Choice
  "One of them has a gun. You can see it in the dim light from the street. Your daughter is crying. She can hear everything. 'Last chance. Come out now.' Sarah whispers: 'Whatever you do, protect the kids.' The door handle turns. You have 10 seconds. This is the choice that determines everything.",
  // Ch3 — Consequences
  "There was no good choice. Just the one you made in 10 seconds. And the one you'll live with forever. Every path had a cost. Every decision left a scar. This is what pressure feels like. This is what stakes mean. Every choice in 10 seconds. Every consequence permanent.",
];

// Per-chapter emotional settings — standard narration
// Designed for maximum audible emotional escalation across chapters.
const TIMED_STANDARD_SETTINGS = [
  // Ch0: Fear starting — controlled but shaking
  { stability: 0.35, similarity_boost: 0.85, style: 0.45, use_speaker_boost: true },
  // Ch1: Fear rising — voice breaks, clipped breath, rushing
  { stability: 0.22, similarity_boost: 0.80, style: 0.72, use_speaker_boost: true },
  // Ch2: Panic barely contained — maximum expressiveness, near tears
  { stability: 0.12, similarity_boost: 0.74, style: 0.90, use_speaker_boost: true },
  // Ch3: Hollow aftermath — all emotion spent, flat and numb
  { stability: 0.72, similarity_boost: 0.92, style: 0.12, use_speaker_boost: true },
];

// Performance directions — guide the voice delivery character
const TIMED_STANDARD_DIRECTIONS = [
  "terrified whisper, shaking breath, hesitant pauses, fear starting immediately",
  "panicked urgency, clipped breath, listening between phrases, voice shaking",
  "near tears, broken pacing, breath catching, desperation building to the choice",
  "hollow aftermath, grief-filled delivery, numb and quiet, all urgency gone",
];

// Companion narration — Sarah, mouth close to the listener's ear
// Short bursts. Fragments. Each line is its own breath.
const TIMED_COMPANION = [
  // Ch0: Groggy → confused → terrified
  "Hey. Wake up. Did you hear that? No. Listen. That wasn't nothing. Someone's in the house. I heard glass downstairs. They're inside. I can hear them moving. More than one. The bat's in the closet. My phone's dead. The kids are down the hall. What do we do?",
  // Ch1: Terrified. Mostly fragments. Long silences.
  "They're coming up. The stairs. I can hear them. One step. Two. Three. They stopped. No. They're moving again. The kids are right there. Three doors down. He said something. He knows we're here. He's on the landing now. Same floor. Same air. I can't think. What do we do? Please.",
  // Ch2: Breaking. Can barely form words.
  "He has a gun. I can see it. Our baby is crying. She can hear us. He said last chance. Whatever happens, protect the kids. Promise me. Promise me. The handle is turning. Right now. Tell me. Please. I can't do this alone.",
  // Ch3: Hollow. Flat. Disconnected.
  "It's done. There was no right answer. There never was. I keep hearing it. Over and over. The sound. The choices. The ten seconds. What did we become? What did we become in ten seconds?",
];

// Per-chapter emotional settings — companion (Sarah)
// Companion escalates harder — she's in the listener's ear, less composed.
const TIMED_COMPANION_SETTINGS = [
  // Ch0: Close whisper, scared, just barely holding it together
  { stability: 0.30, similarity_boost: 0.85, style: 0.55, use_speaker_boost: true },
  // Ch1: Voice breaking, fragments coming faster, terror climbing
  { stability: 0.18, similarity_boost: 0.78, style: 0.80, use_speaker_boost: true },
  // Ch2: Near collapse, crying or at the edge, breathless
  { stability: 0.10, similarity_boost: 0.72, style: 0.92, use_speaker_boost: true },
  // Ch3: Hollow shock, disconnected, grief-filled emptiness
  { stability: 0.68, similarity_boost: 0.90, style: 0.10, use_speaker_boost: true },
];

const TIMED_COMPANION_DIRECTIONS = [
  "terrified whisper, mouth close to listener's ear, panic rising, intimate and urgent",
  "panicked whisper, interrupted breathing, urgent but trying not to be heard, fragments",
  "crying or near tears, broken words, desperate and breathless, barely holding together",
  "hollow shock, grief-filled delivery, disconnected and quiet, all urgency gone",
];

// ---------------------------------------------------------------------------
// Frankenstein — unchanged
// ---------------------------------------------------------------------------
const FRANK_CHAPTERS = [
  "You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking. I am already far north of London, and as I walk in the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight. Inspired by this wind of promise, my daydreams become more fervent and vivid. I shall satiate my ardent curiosity with the sight of a part of the world never before visited, and may tread a land never before imprinted by the foot of man.",
  "So strange an accident has happened to us that I cannot forbear recording it. Last Monday we were nearly surrounded by ice. At about two o'clock the mist cleared away, and we beheld vast and irregular plains of ice. We perceived a low carriage, fixed on a sledge and drawn by dogs, pass on towards the north; a being which had the shape of a man, but apparently of gigantic stature, sat in the sledge. The next morning a traveller's sledge appeared. His limbs were nearly frozen, and his body dreadfully emaciated by fatigue and suffering. I never saw a man in so wretched a condition.",
  "I am by birth a Genevese, and my family is one of the most distinguished of that republic. My mother's tender caresses and my father's smile of benevolent pleasure while regarding me are my first recollections. When I was about five years old, they passed a week on the shores of the Lake of Como. That young girl was Elizabeth Lavenza. She became more than a sister to me. My temper was sometimes violent, and my passions vehement; but by some law they were turned not towards childish pursuits but to an eager desire to learn.",
  "It was on a dreary night of November that I beheld the accomplishment of my toils. With an anxiety that almost amounted to agony, I collected the instruments of life around me. It was already one in the morning; the rain pattered dismally against the panes, and my candle was nearly burnt out, when, by the glimmer of the half-extinguished light, I saw the dull yellow eye of the creature open; it breathed hard, and a convulsive motion agitated its limbs. How can I describe my emotions at this catastrophe? His yellow skin scarcely covered the work of muscles and arteries beneath. Unable to endure the aspect of the being I had created, I rushed out of the room.",
  "All men hate the wretched; how, then, must I be hated, who am miserable beyond all living things! Yet you, my creator, detest and spurn me, thy creature. You purpose to kill me. How dare you sport thus with life? Remember, thou hast made me more powerful than thyself. I was benevolent and good; misery made me a fiend. Make me happy, and I shall again be virtuous.",
  "Farewell, Walton! Seek happiness in tranquillity and avoid ambition. His voice became fainter as he spoke. The monster has disappeared, vanished into the darkness of the Arctic night. What lessons will you carry forward? The icy wastes hold many secrets still. But some stories end not with triumph, but with the haunting question: What have we become in our pursuit to become gods?",
];

const FRANK_DIRECTIONS = [
  "cinematic gothic narrator, intimate wonder, cold air in the voice",
  "low suspenseful dread, exhausted awe, careful pauses",
  "reflective warmth, romantic softness, gentle timing",
  "terrified realization, shaking breath, horror held back until it breaks",
  "grief filled creature voice, wounded dignity, near tears",
  "desolate farewell, low energy, final silence between thoughts",
];

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------

function apiRequest(urlPath, method, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.elevenlabs.io",
      path: urlPath,
      method,
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
      },
    };
    if (body) options.headers["Content-Length"] = Buffer.byteLength(body);
    const req = https.request(options, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        const raw = Buffer.concat(chunks);
        if (res.headers["content-type"]?.includes("audio")) {
          resolve({ audio: raw, status: res.statusCode });
        } else {
          try { resolve({ json: JSON.parse(raw.toString()), status: res.statusCode }); }
          catch (e) { resolve({ text: raw.toString(), status: res.statusCode }); }
        }
      });
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function searchVoice(query) {
  const res = await apiRequest(`/v1/shared-voices?page_size=5&search=${encodeURIComponent(query)}`, "GET");
  if (res.status !== 200 || !res.json?.voices?.length) {
    console.log(`  Voice search failed (${res.status}), using default voice`);
    return null;
  }
  const voice = res.json.voices[0];
  console.log(`  Found voice: "${voice.name}" (${voice.voice_id})`);
  return voice.voice_id;
}

async function addSharedVoice(voiceId) {
  const body = JSON.stringify({ new_name: `movianx_${voiceId}` });
  const res = await apiRequest(`/v1/voices/add/${voiceId}`, "POST", body);
  if (res.status === 200 && res.json?.voice_id) return res.json.voice_id;
  return voiceId;
}

async function generateTTS(voiceId, text, settings, outPath, label = "") {
  const forceRegen   = process.env.FORCE_REGEN === "1";
  const forcePattern = process.env.FORCE_REGEN_PATTERN ? new RegExp(process.env.FORCE_REGEN_PATTERN) : null;
  const shouldOverwrite = forceRegen || (forcePattern && forcePattern.test(path.basename(outPath)));

  if (!shouldOverwrite && fs.existsSync(outPath)) {
    console.log(`  SKIP ${path.basename(outPath)} (exists — use FORCE_REGEN=1 or FORCE_REGEN_PATTERN to overwrite)`);
    return true;
  }

  // Back up existing file before overwriting
  if (fs.existsSync(outPath)) {
    const bakPath = outPath.replace(/\.mp3$/, ".bak.mp3");
    fs.copyFileSync(outPath, bakPath);
    console.log(`  BAK  ${path.basename(bakPath)}`);
  }

  const settingsLine = `stability=${settings.stability} similarity=${settings.similarity_boost} style=${settings.style}`;
  console.log(`  GEN  ${path.basename(outPath)}  [${label}]  ${settingsLine}  (${text.length} chars)`);

  const body = JSON.stringify({
    text,
    model_id: MODEL_ID,
    voice_settings: { ...settings, use_speaker_boost: true },
  });

  const res = await apiRequest(`/v1/text-to-speech/${voiceId}`, "POST", body);

  if (res.audio && res.status === 200) {
    fs.writeFileSync(outPath, res.audio);
    console.log(`  OK   ${path.basename(outPath)} (${(res.audio.length / 1024).toFixed(1)} KB)`);
    return true;
  } else {
    console.error(`  FAIL ${path.basename(outPath)} — HTTP ${res.status}: ${res.text || JSON.stringify(res.json)}`);
    return false;
  }
}

function writeProfile(dir, data) {
  const outPath = path.join(dir, "NarrationProfile_10Seconds_FemaleFear.json");
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
  console.log(`  PROFILE written → ${path.basename(outPath)}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("\n=== MOVIANX NARRATION GENERATOR ===");
  console.log(`    Model:  ${MODEL_ID}`);
  console.log(`    Scope:  ${SCOPE}`);
  console.log(`    Force:  ${process.env.FORCE_REGEN === "1" ? "ALL" : process.env.FORCE_REGEN_PATTERN ? `pattern=${process.env.FORCE_REGEN_PATTERN}` : "none (skip existing)"}`);
  console.log();

  // ── FRANKENSTEIN ──────────────────────────────────────────────────────────
  if (SCOPE === "frank" || SCOPE === "all") {
    console.log("── FRANKENSTEIN ──────────────────────────────────");
    console.log("1. Searching for Frankenstein narrator voice...");
    let frankVoiceId = await searchVoice("male dramatic dark narrator British");
    if (frankVoiceId) {
      console.log("   Adding voice to library...");
      frankVoiceId = await addSharedVoice(frankVoiceId);
    }
    if (!frankVoiceId) {
      frankVoiceId = "pNInz6obpgDQGcFmaJgB"; // Adam
      console.log(`   Using fallback voice: Adam (${frankVoiceId})`);
    }

    const frankSettings = { stability: 0.5, similarity_boost: 0.8, style: 0.3 };
    console.log(`\n2. Generating ${FRANK_CHAPTERS.length} Frankenstein chapters...\n`);
    for (let i = 0; i < FRANK_CHAPTERS.length; i++) {
      await generateTTS(frankVoiceId, FRANK_CHAPTERS[i], frankSettings, path.join(FRANK_DIR, `ch${i}.mp3`), FRANK_DIRECTIONS[i]);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  // ── 10 SECONDS ────────────────────────────────────────────────────────────
  if (SCOPE === "timed" || SCOPE === "all") {
    console.log("── 10 SECONDS: STANDARD NARRATION ────────────────");
    console.log(`   Voice:  ${TIMED_VOICE_ID} (Rachel)`);
    console.log(`   Model:  ${MODEL_ID}`);
    console.log(`   Arc:    4 chapters with escalating emotional settings\n`);

    console.log("   Emotional arc — standard:");
    TIMED_STANDARD_SETTINGS.forEach((s, i) => {
      console.log(`   Ch${i}  stability=${s.stability}  similarity=${s.similarity_boost}  style=${s.style}  [${TIMED_STANDARD_DIRECTIONS[i]}]`);
    });
    console.log();

    for (let i = 0; i < TIMED_CHAPTERS.length; i++) {
      await generateTTS(
        TIMED_VOICE_ID,
        TIMED_CHAPTERS[i],
        TIMED_STANDARD_SETTINGS[i],
        path.join(TIMED_DIR, `ch${i}.mp3`),
        `Ch${i} standard — ${TIMED_STANDARD_DIRECTIONS[i]}`,
      );
      await new Promise((r) => setTimeout(r, 1200));
    }

    console.log("\n── 10 SECONDS: COMPANION NARRATION (Sarah) ───────");
    console.log("   Arc:    4 chapters, more extreme escalation (intimate whisper)\n");

    console.log("   Emotional arc — companion:");
    TIMED_COMPANION_SETTINGS.forEach((s, i) => {
      console.log(`   Ch${i}  stability=${s.stability}  similarity=${s.similarity_boost}  style=${s.style}  [${TIMED_COMPANION_DIRECTIONS[i]}]`);
    });
    console.log();

    for (let i = 0; i < TIMED_COMPANION.length; i++) {
      await generateTTS(
        TIMED_VOICE_ID,
        TIMED_COMPANION[i],
        TIMED_COMPANION_SETTINGS[i],
        path.join(TIMED_DIR, `ch${i}_companion.mp3`),
        `Ch${i} companion — ${TIMED_COMPANION_DIRECTIONS[i]}`,
      );
      await new Promise((r) => setTimeout(r, 1200));
    }

    // Write updated profile
    writeProfile(TIMED_DIR, {
      name: "NarrationProfile_10Seconds_FemaleFear",
      voice_id: TIMED_VOICE_ID,
      voice_name: "Rachel",
      model_id: MODEL_ID,
      emotional_arc: TIMED_STANDARD_SETTINGS.map((s, i) => ({
        chapter: i,
        label: TIMED_STANDARD_DIRECTIONS[i],
        ...s,
      })),
      companion_arc: TIMED_COMPANION_SETTINGS.map((s, i) => ({
        chapter: i,
        label: TIMED_COMPANION_DIRECTIONS[i],
        ...s,
      })),
      scope: "10 Seconds standard and companion narration assets only",
      files: [
        "ch0.mp3", "ch1.mp3", "ch2.mp3", "ch3.mp3",
        "ch0_companion.mp3", "ch1_companion.mp3", "ch2_companion.mp3", "ch3_companion.mp3",
      ],
    });
  }

  console.log("\n=== DONE ===\n");
}

main();
