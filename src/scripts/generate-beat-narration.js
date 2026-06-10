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
        text:      "<<whispering>> Hey. Wake up.",
        stability: 0.48, style: 0.52, speed: 0.86, similarity_boost: 0.88,
        direction: "Sarah waking partner in the dark — urgent, quiet, intimate, no threat yet",
      },
      {
        beatId:    "ch0_first_creak",
        beatIndex: 1,
        text:      "<<whispering>> Did you hear that? <<breathless>> No. Listen. That wasn't nothing.",
        stability: 0.30, style: 0.65, speed: 0.86, similarity_boost: 0.86,
        direction: "almost hopeful question, then she stops pretending — 'That wasn't nothing' is the moment",
      },
      {
        beatId:    "ch0_glass_breaks",
        beatIndex: 2,
        text:      "<<gasping>> Someone's in the house. <<breathless>> I heard glass downstairs. They're inside.",
        stability: 0.14, style: 0.86, speed: 0.88, similarity_boost: 0.82,
        direction: "gasp before first word, short direct sentences, 'They're inside' closes every safe thing",
      },
      {
        beatId:    "ch0_realization",
        beatIndex: 3,
        text:      "<<breathless>> I can hear them moving. More than one. <<whispering>> The bat's in the closet. My phone's dead. The kids are down the hall.",
        stability: 0.18, style: 0.80, speed: 0.84, similarity_boost: 0.84,
        direction: "cold inventory under terror — 'More than one' is the blow, then resource-checking against impossibility",
      },
      {
        beatId:    "ch0_timer_warning",
        beatIndex: 4,
        text:      "<<panicked>> What do we do?",
        stability: 0.08, style: 0.94, speed: 1.00, similarity_boost: 0.80,
        direction: "three words, everything stripped — not a question with an answer, voice breaks on last word",
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
        text:      "<<whispering>> They're coming up. The stairs. <<breathless>> I can hear them.",
        stability: 0.20, style: 0.80, speed: 0.88, similarity_boost: 0.82,
        direction: "tracking their movement in real time, 'I can hear them' makes it irrefutable",
      },
      {
        beatId:    "ch1_upstairs",
        beatIndex: 1,
        text:      "<<breathless>> One step. Two. Three. <<whispering>> They stopped. <<breathless>> No. They're moving again.",
        stability: 0.12, style: 0.90, speed: 0.80, similarity_boost: 0.80,
        direction: "counting footsteps, false hope on 'They stopped', whisper because silence might mean safety, 'No.' shatters it",
      },
      {
        beatId:    "ch1_landing",
        beatIndex: 2,
        text:      "<<whispering>> The kids are right there. Three doors down. <<breathless>> He said something. He knows we're here.",
        stability: 0.08, style: 0.94, speed: 0.78, similarity_boost: 0.78,
        direction: "children are the only thing that matters, 'Three doors down' is exact distance, voice disappears on last four words",
      },
      {
        beatId:    "ch1_come_out",
        beatIndex: 3,
        text:      "<<whispering>> He's on the landing now. Same floor. <<breathless>> Same air. I can't think. What do we do? <<crying>> Please.",
        stability: 0.10, style: 0.92, speed: 0.82, similarity_boost: 0.80,
        direction: "'Same air' through the door — most intimate line. 'Please' is the most vulnerable word in the story",
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
        text:      "<<breathless>> He has a gun. I can see it.",
        stability: 0.10, style: 0.90, speed: 0.88, similarity_boost: 0.80,
        direction: "sees it before she can process it, two short sentences, 'I can see it' makes it irrefutably real",
      },
      {
        beatId:    "ch2_daughter_cry",
        beatIndex: 1,
        text:      "<<panicked>> Our baby is crying. She can hear us.",
        stability: 0.06, style: 0.96, speed: 0.92, similarity_boost: 0.76,
        direction: "'Our baby' — both parents' child, 'She can hear us' means she hears them too, voice cracks",
      },
      {
        beatId:    "ch2_last_chance",
        beatIndex: 2,
        text:      "<<panicked>> He said last chance. Whatever happens, protect the kids. <<breathless>> Promise me. Promise me.",
        stability: 0.05, style: 0.96, speed: 0.94, similarity_boost: 0.74,
        direction: "'Whatever happens' acknowledges she may not survive, second 'Promise me' is desperation not emphasis, voice breaks",
      },
      {
        beatId:    "ch2_handle_turns",
        beatIndex: 3,
        text:      "<<breathless>> The handle is turning. Right now.",
        stability: 0.06, style: 0.95, speed: 0.90, similarity_boost: 0.76,
        direction: "present tense, happening as she speaks, 'Right now' because she can't believe it, voice is barely air",
      },
      {
        beatId:    "ch2_the_choice",
        beatIndex: 4,
        text:      "<<whispering>> Tell me. <<crying>> Please. I can't do this alone.",
        stability: 0.08, style: 0.92, speed: 0.80, similarity_boost: 0.80,
        direction: "most exposed line — 'Please' holds everything, 'I can't do this alone' is the only honest thing left",
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
        text:      "It's done. <<crying>> There was no right answer. There never was.",
        stability: 0.68, style: 0.18, speed: 0.84, similarity_boost: 0.90,
        direction: "'It's done' is exhaustion not relief, crying is contained — person who realizes the weight they'll carry",
      },
      {
        beatId:    "ch3_sirens",
        beatIndex: 1,
        text:      "I keep hearing it. Over and over. The sound. The choices. The ten seconds.",
        stability: 0.72, style: 0.12, speed: 0.82, similarity_boost: 0.90,
        direction: "dissociated repetition, still inside the event, 'The sound' is the worst word she won't name, completely flat",
      },
      {
        beatId:    "ch3_james_speaks",
        beatIndex: 2,
        text:      "<<crying>> What did we become?",
        stability: 0.60, style: 0.20, speed: 0.76, similarity_boost: 0.88,
        direction: "asking partner, or herself, or both — not rhetorical, she genuinely doesn't know, let silence breathe after",
      },
      {
        beatId:    "ch3_the_weight",
        beatIndex: 3,
        text:      "<<crying>> What did we become... in ten seconds?",
        stability: 0.58, style: 0.20, speed: 0.74, similarity_boost: 0.88,
        direction: "same question with time attached — pause before 'in ten seconds' is the full story landing, 3s silence is the last breath",
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
