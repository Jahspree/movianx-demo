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
        text:      "<<whispering>> Did you hear that?... No. Listen. That wasn't nothing.",
        stability: 0.42, style: 0.65, speed: 0.86, similarity_boost: 0.86,
        direction: "almost hopeful question, ellipsis holds the disbelief before she stops pretending — single whispering tag throughout",
      },
      {
        beatId:    "ch0_glass_breaks",
        beatIndex: 2,
        text:      "<<breathless>> Someone's in the house— I heard glass downstairs. They're inside.",
        stability: 0.42, style: 0.86, speed: 0.88, similarity_boost: 0.82,
        direction: "breathless throughout — em-dash after 'house' is the impact break, 'They're inside' closes every safe thing",
      },
      {
        beatId:    "ch0_realization",
        beatIndex: 3,
        text:      "<<whispering>> I can hear them moving... More than one. The bat's in the closet— My phone's dead— The kids are down the hall.",
        stability: 0.48, style: 0.85, speed: 0.92, similarity_boost: 0.78,
        direction: "rapid inventory under terror — single whispering tag, em-dashes break the list rhythm, ... holds the breath after 'moving'",
      },
      {
        beatId:    "ch0_timer_warning",
        beatIndex: 4,
        text:      "<<panicked>> What do we do?",
        stability: 0.40, style: 0.94, speed: 1.00, similarity_boost: 0.80,
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
        text:      "<<whispering>> They're coming up. The stairs... I can hear them.",
        stability: 0.40, style: 0.80, speed: 0.88, similarity_boost: 0.82,
        direction: "whispering throughout — ellipsis holds the listening pause, 'I can hear them' makes it irrefutable",
      },
      {
        beatId:    "ch1_upstairs",
        beatIndex: 1,
        text:      "<<panicked>> One step. Two. Three— They stopped... No. They're moving again.",
        stability: 0.42, style: 0.95, speed: 1.02, similarity_boost: 0.72,
        direction: "counting footsteps — single panicked tag, — after Three for abrupt cut, ... holds the false-hope moment, 'No.' arrives small",
      },
      {
        beatId:    "ch1_landing",
        beatIndex: 2,
        text:      "<<whispering>> The kids are right there. Three doors down— He said something. He knows we're here.",
        stability: 0.40, style: 0.94, speed: 0.78, similarity_boost: 0.78,
        direction: "whispering throughout — em-dash after 'down' is the horror of the realization, voice disappears on last four words",
      },
      {
        beatId:    "ch1_come_out",
        beatIndex: 3,
        text:      "<<whispering>> He's on the landing now. Same floor. Same air... I can't think. What do we do? Please.",
        stability: 0.48, style: 0.90, speed: 0.88, similarity_boost: 0.75,
        direction: "single whisper throughout — removes theatrical <<crying>> from 'Please', ... after 'Same air' holds the proximity horror, 'Please' arrives small and broken",
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
        stability: 0.40, style: 0.90, speed: 0.88, similarity_boost: 0.80,
        direction: "sees it before she can process it, two short sentences, 'I can see it' makes it irrefutably real",
      },
      {
        beatId:    "ch2_daughter_cry",
        beatIndex: 1,
        text:      "<<panicked>> Our baby is crying. She can hear us.",
        stability: 0.40, style: 0.96, speed: 0.92, similarity_boost: 0.76,
        direction: "'Our baby' — both parents' child, 'She can hear us' means she hears them too, voice cracks",
      },
      {
        beatId:    "ch2_last_chance",
        beatIndex: 2,
        text:      "<<panicked>> He said last chance. Whatever happens, protect the kids— Promise me. Promise me.",
        stability: 0.42, style: 0.96, speed: 0.94, similarity_boost: 0.74,
        direction: "panicked throughout — em-dash before repetition is the pact-making break, second 'Promise me' is desperation not emphasis",
      },
      {
        beatId:    "ch2_handle_turns",
        beatIndex: 3,
        text:      "<<whispering>> The handle is turning... Right now.",
        stability: 0.42, style: 1.00, speed: 0.78, similarity_boost: 0.72,
        direction: "frozen terror watching the handle — whispering (not breathless, she's still), ... holds the pause as time slows, slow delivery 0.78",
      },
      {
        beatId:    "ch2_the_choice",
        beatIndex: 4,
        text:      "<<crying>> Tell me... Please. I can't do this alone.",
        stability: 0.42, style: 0.92, speed: 0.80, similarity_boost: 0.80,
        direction: "crying throughout — ellipsis after 'Tell me' holds the silent plea, 'I can't do this alone' is the only honest thing left",
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
        text:      "<<crying>> It's done. There was no right answer. There never was.",
        stability: 0.68, style: 0.18, speed: 0.84, similarity_boost: 0.90,
        direction: "crying leads the whole beat — style 0.18 keeps it contained grief, not explosive; exhaustion not relief",
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
        text:      "<<whispering>> What did we become?",
        stability: 0.48, style: 0.65, speed: 0.76, similarity_boost: 0.82,
        direction: "hollow dissociated whisper — removed <<crying>> tag (was theatrical grief), whispering delivers hollow shock instead",
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
