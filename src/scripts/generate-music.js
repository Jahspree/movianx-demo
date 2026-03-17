#!/usr/bin/env node
// ===========================================================================
// Generate Suspense Music via ElevenLabs Sound Effects API
// Usage: ELEVEN_LABS_API_KEY=xxx node src/scripts/generate-music.js
// ===========================================================================

const fs = require("fs");
const path = require("path");
const https = require("https");

const API_KEY = process.env.ELEVEN_LABS_API_KEY;
if (!API_KEY) {
  console.error("ERROR: Set ELEVEN_LABS_API_KEY environment variable");
  process.exit(1);
}

const MUSIC_DIR = path.join(__dirname, "../../public/audio/music");
fs.mkdirSync(MUSIC_DIR, { recursive: true });

// Each chapter gets a distinct mood of suspense music
const TRACKS = [
  {
    file: "timed_ch0.mp3",
    prompt: "dark ambient suspense drone, low frequency rumble, quiet tension, horror film underscore, minimal, 30 seconds, loopable",
    duration_seconds: 30,
  },
  {
    file: "timed_ch1.mp3",
    prompt: "tense horror underscore, building dread, low strings tremolo, heartbeat pulse underneath, dark ambient, 30 seconds, loopable",
    duration_seconds: 30,
  },
  {
    file: "timed_ch2.mp3",
    prompt: "intense horror climax music, dissonant strings, overwhelming dread, panic, dark ambient crescendo, 30 seconds, loopable",
    duration_seconds: 30,
  },
  {
    file: "timed_ch3.mp3",
    prompt: "hollow aftermath ambient, empty room tone, distant echoes fading, melancholic minimal drone, post-trauma silence, 30 seconds, loopable",
    duration_seconds: 30,
  },
];

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
          try {
            resolve({ json: JSON.parse(raw.toString()), status: res.statusCode });
          } catch (e) {
            resolve({ text: raw.toString(), status: res.statusCode });
          }
        }
      });
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function generateSFX(prompt, durationSeconds, outPath) {
  const forceRegen = process.env.FORCE_REGEN === "1";
  if (!forceRegen && fs.existsSync(outPath) && fs.statSync(outPath).size > 1000) {
    console.log(`  SKIP ${path.basename(outPath)} (already exists, ${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
    return true;
  }

  const body = JSON.stringify({
    text: prompt,
    duration_seconds: durationSeconds,
  });

  console.log(`  GEN  ${path.basename(outPath)} — "${prompt.substring(0, 60)}..."`);
  const res = await apiRequest("/v1/sound-generation", "POST", body);

  if (res.audio && res.status === 200) {
    fs.writeFileSync(outPath, res.audio);
    console.log(`  OK   ${path.basename(outPath)} (${(res.audio.length / 1024).toFixed(1)} KB)`);
    return true;
  } else {
    console.error(`  FAIL ${path.basename(outPath)} — HTTP ${res.status}: ${res.text || JSON.stringify(res.json)}`);
    return false;
  }
}

async function main() {
  console.log("\n=== MOVIANX SUSPENSE MUSIC GENERATOR ===\n");

  for (let i = 0; i < TRACKS.length; i++) {
    const track = TRACKS[i];
    console.log(`\nTrack ${i + 1}/${TRACKS.length}: ${track.file}`);
    await generateSFX(track.prompt, track.duration_seconds, path.join(MUSIC_DIR, track.file));
    await new Promise((r) => setTimeout(r, 2000)); // Rate limit
  }

  console.log("\n=== DONE ===\n");
}

main();
