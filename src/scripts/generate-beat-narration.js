#!/usr/bin/env node
// ===========================================================================
// Generate Beat-Level Narration — 10 Seconds
//
// Uses ElevenLabs eleven_v3 with acting direction tags.
// Generates one MP3 per beat (18 total across 4 chapters).
//
// Usage:
//   ELEVEN_LABS_API_KEY=xxx node src/scripts/generate-beat-narration.js
//
// Environment variables:
//   ELEVEN_LABS_API_KEY   — required
//   FORCE_REGEN           — "1" to overwrite all existing files
//   FORCE_BEAT            — "ch0_beat2" to regenerate a specific beat
//   VOICE_ID              — override voice (default: Rachel 21m00Tcm4TlvDq8ikWAM)
// ===========================================================================

const fs    = require("fs");
const path  = require("path");
const https = require("https");

const API_KEY    = process.env.ELEVEN_LABS_API_KEY;
const VOICE_ID   = process.env.VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // Rachel
const MODEL_ID   = "eleven_v3";
const FORCE      = process.env.FORCE_REGEN === "1";
const FORCE_BEAT = process.env.FORCE_BEAT || null;
const OUT_DIR    = path.join(__dirname, "../../public/audio/v3/timed/beats");

if (!API_KEY) {
  console.error("ERROR: Set ELEVEN_LABS_API_KEY");
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// Performance script — inline (same data as src/data/performanceScripts/10seconds.js
// but in CommonJS format for the Node script environment)
// ---------------------------------------------------------------------------

const CHAPTERS = [
  // Ch0 — The Quiet Before
  {
    idx: 0,
    beats: [
      {
        beatId:    "ch0_sleeping",
        beatIndex: 0,
        text:      "A family asleep. The house is still.",
        stability: 0.78, style: 0.08, speed: 0.93, similarity_boost: 0.88,
        direction: "warm, quiet, tender — no threat, voice settles like the house",
      },
      {
        beatId:    "ch0_first_creak",
        beatIndex: 1,
        text:      "A sound... downstairs. <<whispering>> You freeze.",
        stability: 0.38, style: 0.58, speed: 0.88, similarity_boost: 0.86,
        direction: "warmth cuts, voice drops mid-sentence, whisper on freeze",
      },
      {
        beatId:    "ch0_glass_breaks",
        beatIndex: 2,
        text:      "<<gasping>> Glass. Downstairs. <<breathless>> Someone... is inside.",
        stability: 0.14, style: 0.86, speed: 0.84, similarity_boost: 0.82,
        direction: "gasp catches breath, three blows, ellipsis is a physical stop",
      },
      {
        beatId:    "ch0_realization",
        beatIndex: 3,
        text:      "<<whispering>> Your children are in their rooms. You are between them... and the stairs.",
        stability: 0.18, style: 0.80, speed: 0.86, similarity_boost: 0.84,
        direction: "horrified calculation, pause before 'and the stairs' is reckoning",
      },
      {
        beatId:    "ch0_timer_warning",
        beatIndex: 4,
        text:      "<<breathless>> Ten seconds. That is all you have.",
        stability: 0.12, style: 0.90, speed: 1.04, similarity_boost: 0.80,
        direction: "countdown starts, breathless from holding terror, each word lands",
      },
    ],
  },

  // Ch1 — The Threat Advances
  {
    idx: 1,
    beats: [
      {
        beatId:    "ch1_ransacking",
        beatIndex: 0,
        text:      "<<whispering>> Drawers. Cabinets. They are... searching.",
        stability: 0.20, style: 0.80, speed: 0.90, similarity_boost: 0.82,
        direction: "clipped fragments, each word a sound heard through the floor",
      },
      {
        beatId:    "ch1_upstairs",
        beatIndex: 1,
        text:      "<<breathless>> Footsteps... on the stairs. Slow. <<whispering>> Deliberate.",
        stability: 0.12, style: 0.90, speed: 0.80, similarity_boost: 0.80,
        direction: "worst word is deliberate — they know they own this, voice slows to match",
      },
      {
        beatId:    "ch1_landing",
        beatIndex: 2,
        text:      "<<whispering>> They are on the landing. <<breathless>> Inches... from your door.",
        stability: 0.08, style: 0.94, speed: 0.76, similarity_boost: 0.78,
        direction: "voice nearly disappears, ellipsis is a body freezing",
      },
      {
        beatId:    "ch1_come_out",
        beatIndex: 3,
        text:      "<<whispering>> \"Come out. I know you're in there.\"",
        stability: 0.10, style: 0.92, speed: 0.88, similarity_boost: 0.80,
        direction: "Sarah repeating the intruder's words — not confrontational, disbelieving",
      },
    ],
  },

  // Ch2 — The Choice
  {
    idx: 2,
    beats: [
      {
        beatId:    "ch2_gun_revealed",
        beatIndex: 0,
        text:      "<<breathless>> You find the gun your husband left. Cold. <<whispering>> Heavy.",
        stability: 0.14, style: 0.86, speed: 0.86, similarity_boost: 0.82,
        direction: "cold and heavy are single words — nothing larger forms, weight arrives on heavy",
      },
      {
        beatId:    "ch2_daughter_cry",
        beatIndex: 1,
        text:      "<<panicked>> Your daughter cries out from her room. She... heard.",
        stability: 0.06, style: 0.96, speed: 0.92, similarity_boost: 0.76,
        direction: "panic breaks surface, voice cracks on heard, mother breaking",
      },
      {
        beatId:    "ch2_last_chance",
        beatIndex: 2,
        text:      "\"Last chance.\" <<panicked>> The handle is turning.",
        stability: 0.05, style: 0.96, speed: 1.00, similarity_boost: 0.74,
        direction: "first sentence flat — intruder's words, then panic, present tense, time collapsing",
      },
      {
        beatId:    "ch2_handle_turns",
        beatIndex: 3,
        text:      "<<breathless>> The door... opens.",
        stability: 0.06, style: 0.95, speed: 0.78, similarity_boost: 0.76,
        direction: "three words, world ending, pause is the door itself, voice barely there",
      },
      {
        beatId:    "ch2_the_choice",
        beatIndex: 4,
        text:      "<<whispering>> You choose.",
        stability: 0.14, style: 0.85, speed: 0.76, similarity_boost: 0.82,
        direction: "past panic, eye of the storm, held breath at maximum capacity",
      },
    ],
  },

  // Ch3 — The Weight
  {
    idx: 3,
    beats: [
      {
        beatId:    "ch3_aftermath",
        beatIndex: 0,
        text:      "The house is quiet again. <<crying>> A different quiet.",
        stability: 0.76, style: 0.14, speed: 0.86, similarity_boost: 0.90,
        direction: "grief in the distinction — first sentence flat, emotion surfaces quietly on second",
      },
      {
        beatId:    "ch3_sirens",
        beatIndex: 1,
        text:      "Sirens. Distant. Someone called.",
        stability: 0.72, style: 0.12, speed: 0.84, similarity_boost: 0.90,
        direction: "completely dissociated, three fragments, flat — absence of emotion IS the emotion",
      },
      {
        beatId:    "ch3_james_speaks",
        beatIndex: 2,
        text:      "Your son says your name. <<crying>> Just your name.",
        stability: 0.62, style: 0.18, speed: 0.80, similarity_boost: 0.88,
        direction: "most tender moment, quiet grief of what son witnessed, not sobbing — contained",
      },
      {
        beatId:    "ch3_the_weight",
        beatIndex: 3,
        text:      "<<crying>> Some things you carry. Some things... carry you.",
        stability: 0.58, style: 0.20, speed: 0.76, similarity_boost: 0.88,
        direction: "final line, pause before carry you is understanding which one this is, gives way",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

function apiRequest(urlPath, body) {
  return new Promise((resolve, reject) => {
    const bodyBuf = Buffer.from(body);
    const opts = {
      hostname: "api.elevenlabs.io",
      path:     urlPath,
      method:   "POST",
      headers:  {
        "xi-api-key":    API_KEY,
        "Content-Type":  "application/json",
        "Content-Length": bodyBuf.length,
      },
    };
    const req = https.request(opts, (res) => {
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => {
        const raw = Buffer.concat(chunks);
        const ct  = res.headers["content-type"] || "";
        if (ct.includes("audio")) {
          resolve({ audio: raw, status: res.statusCode });
        } else {
          try { resolve({ json: JSON.parse(raw.toString()), status: res.statusCode }); }
          catch(e) { resolve({ text: raw.toString(), status: res.statusCode }); }
        }
      });
    });
    req.on("error", reject);
    req.write(bodyBuf);
    req.end();
  });
}

async function generateBeat(chIdx, beat) {
  const filename = `ch${chIdx}_beat${beat.beatIndex}.mp3`;
  const outPath  = path.join(OUT_DIR, filename);
  const shouldSkip = !FORCE && !FORCE_BEAT && fs.existsSync(outPath);
  const forcedBeat = FORCE_BEAT && beat.beatId === FORCE_BEAT;

  if (shouldSkip && !forcedBeat) {
    console.log(`  SKIP ${filename} (exists)`);
    return true;
  }

  // Back up existing file
  if (fs.existsSync(outPath)) {
    const bak = outPath.replace(/\.mp3$/, ".bak.mp3");
    fs.copyFileSync(outPath, bak);
  }

  const settingsLine = `stability=${beat.stability} style=${beat.style} speed=${beat.speed}`;
  console.log(`  GEN  ${filename}  [${beat.direction.slice(0, 60)}...]`);
  console.log(`       ${settingsLine}  ${beat.text.length} chars`);

  const body = JSON.stringify({
    text: beat.text,
    model_id: MODEL_ID,
    voice_settings: {
      stability:        beat.stability,
      similarity_boost: beat.similarity_boost,
      style:            beat.style,
      use_speaker_boost: true,
      speed:            beat.speed,
    },
  });

  const res = await apiRequest(`/v1/text-to-speech/${VOICE_ID}`, body);

  if (res.status !== 200 || !res.audio) {
    const detail = res.json?.detail || res.text || `HTTP ${res.status}`;
    console.error(`  FAIL ${filename}: ${JSON.stringify(detail)}`);
    return false;
  }

  fs.writeFileSync(outPath, res.audio);
  const kb = Math.round(res.audio.length / 1024);
  console.log(`  DONE ${filename} (${kb} KB)`);
  return true;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`\nMovianx Beat Narration Generator`);
  console.log(`Model: ${MODEL_ID} | Voice: ${VOICE_ID}`);
  console.log(`Output: ${OUT_DIR}\n`);

  let total = 0, ok = 0, skipped = 0, failed = 0;

  for (const chapter of CHAPTERS) {
    console.log(`\n── Chapter ${chapter.idx} (${chapter.beats.length} beats) ──`);
    for (const beat of chapter.beats) {
      total++;
      const outPath  = path.join(OUT_DIR, `ch${chapter.idx}_beat${beat.beatIndex}.mp3`);
      const willSkip = !FORCE && !FORCE_BEAT && fs.existsSync(outPath) && beat.beatId !== FORCE_BEAT;
      if (willSkip) { skipped++; console.log(`  SKIP ch${chapter.idx}_beat${beat.beatIndex}.mp3`); continue; }

      const success = await generateBeat(chapter.idx, beat);
      if (success) ok++;
      else failed++;

      // Rate limit: 1 request per second to stay under API limits
      await new Promise(r => setTimeout(r, 1100));
    }
  }

  console.log(`\n── Summary ──`);
  console.log(`  Total:   ${total}`);
  console.log(`  Generated: ${ok}`);
  console.log(`  Skipped:   ${skipped}`);
  console.log(`  Failed:    ${failed}`);

  if (failed > 0) process.exit(1);
}

main().catch(e => { console.error(e); process.exit(1); });
