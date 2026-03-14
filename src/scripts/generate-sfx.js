#!/usr/bin/env node
// ===========================================================================
// Generate Sound Effects via ElevenLabs Sound Generation API
// Usage: ELEVEN_LABS_API_KEY=xxx node src/scripts/generate-sfx.js
// ===========================================================================

const fs = require("fs");
const path = require("path");
const https = require("https");

const API_KEY = process.env.ELEVEN_LABS_API_KEY;
if (!API_KEY) {
  console.error("ERROR: Set ELEVEN_LABS_API_KEY environment variable");
  process.exit(1);
}

const OUT_DIR = path.join(__dirname, "../../public/audio/sfx");
fs.mkdirSync(OUT_DIR, { recursive: true });

// Deduplicated SFX from both manifests
const ALL_SFX = [
  { file: "wind_loop.mp3", description: "arctic wind howling, continuous loop, cold atmosphere" },
  { file: "rain_loop.mp3", description: "heavy rain hitting glass window, continuous, indoor perspective" },
  { file: "thunder.mp3", description: "single loud thunder crack, dramatic, close" },
  { file: "heartbeat.mp3", description: "slow human heartbeat, rhythmic, deep bass thump" },
  { file: "footsteps_stone.mp3", description: "footsteps on stone floor, slow deliberate steps, echoey" },
  { file: "footsteps_dirt.mp3", description: "footsteps on dirt path, crunching, walking pace" },
  { file: "wolf_howl.mp3", description: "distant wolf howling at night, lonely, eerie" },
  { file: "door_creak.mp3", description: "old wooden door creaking open slowly, horror atmosphere" },
  { file: "fire_crackle.mp3", description: "fire crackling in fireplace, warm, close" },
  { file: "ice_crack.mp3", description: "ice cracking and breaking, sharp, cold environment" },
  { file: "electrical_hum.mp3", description: "electrical equipment humming and buzzing, laboratory" },
  { file: "breathing_raspy.mp3", description: "raspy heavy labored breathing, close, unsettling" },
  { file: "water_lapping.mp3", description: "gentle water lapping on lakeshore, peaceful" },
  { file: "leaves_rustle.mp3", description: "leaves rustling in gentle breeze, nature" },
  // Timed story specific
  { file: "glass_break.mp3", description: "glass window breaking, sharp crack, home invasion" },
  { file: "drawer_opening.mp3", description: "wooden drawer being pulled open roughly, searching" },
  { file: "floor_creak.mp3", description: "old wooden floorboard creaking under weight, tension" },
];

function generateSFX(sfx) {
  return new Promise((resolve, reject) => {
    const outPath = path.join(OUT_DIR, sfx.file);
    if (fs.existsSync(outPath)) {
      console.log(`  SKIP ${sfx.file} (already exists)`);
      resolve();
      return;
    }

    const body = JSON.stringify({
      text: sfx.description,
      duration_seconds: 5,
    });

    const options = {
      hostname: "api.elevenlabs.io",
      path: "/v1/sound-generation",
      method: "POST",
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    console.log(`  GEN  ${sfx.file} — "${sfx.description}"`);

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let errBody = "";
        res.on("data", (d) => (errBody += d));
        res.on("end", () => {
          console.error(`  FAIL ${sfx.file} — HTTP ${res.statusCode}: ${errBody}`);
          reject(new Error(`HTTP ${res.statusCode}`));
        });
        return;
      }
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        fs.writeFileSync(outPath, Buffer.concat(chunks));
        console.log(`  OK   ${sfx.file} (${(Buffer.concat(chunks).length / 1024).toFixed(1)} KB)`);
        resolve();
      });
    });

    req.on("error", (e) => {
      console.error(`  ERR  ${sfx.file} — ${e.message}`);
      reject(e);
    });

    req.write(body);
    req.end();
  });
}

async function main() {
  console.log(`\nGenerating ${ALL_SFX.length} sound effects via ElevenLabs...\n`);
  let success = 0, fail = 0;

  for (const sfx of ALL_SFX) {
    try {
      await generateSFX(sfx);
      success++;
      // Rate limit: small delay between requests
      await new Promise((r) => setTimeout(r, 500));
    } catch (e) {
      fail++;
    }
  }

  console.log(`\nDone: ${success} generated, ${fail} failed.\n`);
}

main();
