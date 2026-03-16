#!/usr/bin/env node
// ===========================================================================
// Generate Narration via ElevenLabs TTS API
// Usage: ELEVEN_LABS_API_KEY=xxx node src/scripts/generate-narration.js
// ===========================================================================

const fs = require("fs");
const path = require("path");
const https = require("https");

const API_KEY = process.env.ELEVEN_LABS_API_KEY;
if (!API_KEY) {
  console.error("ERROR: Set ELEVEN_LABS_API_KEY environment variable");
  process.exit(1);
}

const FRANK_DIR = path.join(__dirname, "../../public/audio/frankenstein");
const TIMED_DIR = path.join(__dirname, "../../public/audio/timed");
fs.mkdirSync(FRANK_DIR, { recursive: true });
fs.mkdirSync(TIMED_DIR, { recursive: true });

// --- Frankenstein chapter texts (condensed for TTS) ---
const FRANK_CHAPTERS = [
  "You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking. I am already far north of London, and as I walk in the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight. Inspired by this wind of promise, my daydreams become more fervent and vivid. I shall satiate my ardent curiosity with the sight of a part of the world never before visited, and may tread a land never before imprinted by the foot of man.",
  "So strange an accident has happened to us that I cannot forbear recording it. Last Monday we were nearly surrounded by ice. At about two o'clock the mist cleared away, and we beheld vast and irregular plains of ice. We perceived a low carriage, fixed on a sledge and drawn by dogs, pass on towards the north; a being which had the shape of a man, but apparently of gigantic stature, sat in the sledge. The next morning a traveller's sledge appeared. His limbs were nearly frozen, and his body dreadfully emaciated by fatigue and suffering. I never saw a man in so wretched a condition.",
  "I am by birth a Genevese, and my family is one of the most distinguished of that republic. My mother's tender caresses and my father's smile of benevolent pleasure while regarding me are my first recollections. When I was about five years old, they passed a week on the shores of the Lake of Como. That young girl was Elizabeth Lavenza. She became more than a sister to me. My temper was sometimes violent, and my passions vehement; but by some law they were turned not towards childish pursuits but to an eager desire to learn.",
  "It was on a dreary night of November that I beheld the accomplishment of my toils. With an anxiety that almost amounted to agony, I collected the instruments of life around me. It was already one in the morning; the rain pattered dismally against the panes, and my candle was nearly burnt out, when, by the glimmer of the half-extinguished light, I saw the dull yellow eye of the creature open; it breathed hard, and a convulsive motion agitated its limbs. How can I describe my emotions at this catastrophe? His yellow skin scarcely covered the work of muscles and arteries beneath. Unable to endure the aspect of the being I had created, I rushed out of the room.",
  "All men hate the wretched; how, then, must I be hated, who am miserable beyond all living things! Yet you, my creator, detest and spurn me, thy creature. You purpose to kill me. How dare you sport thus with life? Remember, thou hast made me more powerful than thyself. I was benevolent and good; misery made me a fiend. Make me happy, and I shall again be virtuous.",
  "Farewell, Walton! Seek happiness in tranquillity and avoid ambition. His voice became fainter as he spoke. The monster has disappeared, vanished into the darkness of the Arctic night. What lessons will you carry forward? The icy wastes hold many secrets still. But some stories end not with triumph, but with the haunting question: What have we become in our pursuit to become gods?",
];

// --- 10 Seconds standard narration ---
const TIMED_CHAPTERS = [
  "You wake up to glass breaking downstairs. Your wife Sarah is asleep beside you. Your two kids are down the hall. You reach for your phone: 3:47 AM. Another crash. This time louder. Closer. Footsteps. More than one person. You have a baseball bat in the closet. Your phone is at 4% battery. The home alarm panel is downstairs. Sarah stirs. 'What was that?' You have 10 seconds to decide.",
  "You can hear them ransacking the living room. Drawers being pulled out. Furniture overturned. Then a voice: 'Check upstairs.' Footsteps on the stairs. Heavy. Deliberate. Sarah grabs your arm. 'They're coming.' Your daughter's room is three doors down. The footsteps stop. They're on the landing now. 'I know someone's up here. Come out, and nobody gets hurt.' You have 10 seconds.",
  "One of them has a gun. You can see it in the dim light from the street. Your daughter is crying. She can hear everything. 'Last chance. Come out now.' Sarah whispers: 'Whatever you do, protect the kids.' The door handle turns. You have 10 seconds. This is the choice that determines everything.",
  "There was no good choice. Just the one you made in 10 seconds. And the one you'll live with forever. Every path had a cost. Every decision left a scar. This is what pressure feels like. This is what stakes mean. Every choice in 10 seconds. Every consequence permanent.",
];

// --- 10 Seconds: Per-chapter voice settings for emotional progression ---
// Each chapter escalates emotionally, then drops to hollow emptiness
const TIMED_STANDARD_SETTINGS = [
  { stability: 0.25, similarity_boost: 0.9, style: 0.7 },   // Ch0: groggy → scared
  { stability: 0.2, similarity_boost: 0.9, style: 0.8 },    // Ch1: full fear
  { stability: 0.15, similarity_boost: 0.9, style: 0.9 },   // Ch2: absolute panic
  { stability: 0.6, similarity_boost: 0.9, style: 0.3 },    // Ch3: hollow, numb
];

// --- 10 Seconds companion narration with pauses and emotional delivery ---
// ElevenLabs interprets [...] cues as pauses, breathing, and emotional shifts.
// Real terror = short bursts of words separated by silence, freezing, listening.
const TIMED_COMPANION = [
  // Ch0: Groggy → alert → scared → panicked. Lots of pauses - listening, freezing.
  "[groggy, confused] Hmm... what... [3 second pause] [suddenly alert] Wait. [2 second pause] Did you hear that? [long pause] [whispering] That was glass. [pause] Downstairs. [long pause - listening] [faster, scared] There's someone in the house. [pause] [breathing] Oh god. [pause] I think... [pause] I think there's more than one. [pause] I can hear footsteps. [3 second pause - listening to the sounds below] [desperate whisper] What do we do? [long pause] The bat... [pause] it's in the closet. [pause] My phone is almost dead. [pause] The alarm is downstairs. [pause] Where they are. [long shaky breath] [3 second pause] The kids are down the hall. [pause] [voice cracking] We have ten seconds. [pause] Tell me what to do.",
  // Ch1: Terrified, freezing between words. Counting footsteps in silence.
  "[trembling whisper] They're coming up. [3 second pause - listening] [swallows] I can hear them on the stairs. [long pause] [breathing through teeth] One step... [pause] two... [pause] three... [3 second pause] They stopped. [long pause - silence] [barely audible] No wait. [pause] They're moving again. [long pause] [voice breaking] The kids... [pause] the kids are right there. [pause] Three doors down. [3 second pause] [sharp inhale] He just said... [pause] he said he knows someone's up here. [long pause] [crying quietly, muffled] He's on the landing. [pause] Same floor as us. [pause] Same air. [3 second pause] [barely breathing] I can't... [pause] I can't think. [long pause] What do we do? [pause] Please. [choking back tears]",
  // Ch2: Absolute panic. Long dread-filled silences. Hyperventilating.
  "[hyperventilating whisper] He has a gun. [long pause] I can see it. [3 second pause] [long shaking breath] [sobbing silently] Our baby is crying. [pause] She can hear everything. [pause] She's calling for us. [3 second pause - listening to daughter cry] [desperate, barely controlled] He said last chance. [long pause] Come out now. [3 second pause] [voice cracks completely] Whatever happens... [long pause] whatever you decide... [pause] [gasping] protect the kids. [pause] Promise me. [pause] Promise me right now. [3 second pause] [almost inaudible, shattered] The handle. [long pause] It's turning. [pause] Right now. [3 second pause - silence] Tell me what to do. [pause] Right now. [pause] Please. [long pause] I can't... [pause] I can't decide this alone.",
  // Ch3: Hollow. Numb. Long empty silences between thoughts.
  "[hollow, distant] It's done. [5 second pause] [flat, disconnected] There was no right answer. [long pause] There never was. [3 second pause] [quiet, empty] I keep hearing it. [long pause] Over and over. [pause] The sound. [pause] The choices. [pause] The ten seconds. [5 second pause] [barely audible, numb] What did we become? [3 second pause] What did we become... [long pause] in ten seconds?",
];

const TIMED_COMPANION_SETTINGS = [
  { stability: 0.25, similarity_boost: 0.9, style: 0.7 },   // Ch0: confused → scared
  { stability: 0.2, similarity_boost: 0.9, style: 0.8 },    // Ch1: shaking fear
  { stability: 0.15, similarity_boost: 0.9, style: 0.9 },   // Ch2: panic, crying
  { stability: 0.6, similarity_boost: 0.9, style: 0.3 },    // Ch3: hollow, empty
];

// --- API helpers ---

function apiRequest(urlPath, method, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.elevenlabs.io",
      path: urlPath,
      method: method,
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

async function searchVoice(query) {
  // Use shared voices endpoint to find a match
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
  return voiceId; // Fallback: try using the public ID directly
}

async function generateTTS(voiceId, text, settings, outPath) {
  const forceRegen = process.env.FORCE_REGEN === "1";
  if (!forceRegen && fs.existsSync(outPath)) {
    console.log(`  SKIP ${path.basename(outPath)} (already exists, set FORCE_REGEN=1 to overwrite)`);
    return true;
  }

  const body = JSON.stringify({
    text: text,
    model_id: "eleven_multilingual_v2",
    voice_settings: settings,
  });

  console.log(`  GEN  ${path.basename(outPath)} (${text.length} chars)`);
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

async function main() {
  console.log("\n=== MOVIANX NARRATION GENERATOR ===\n");

  // --- FRANKENSTEIN ---
  console.log("1. Searching for Frankenstein narrator voice...");
  let frankVoiceId = await searchVoice("male dramatic dark narrator British");
  if (frankVoiceId) {
    console.log("   Adding voice to library...");
    frankVoiceId = await addSharedVoice(frankVoiceId);
  }
  if (!frankVoiceId) {
    // Fallback: use ElevenLabs default "Adam" voice
    frankVoiceId = "pNInz6obpgDQGcFmaJgB";
    console.log(`   Using fallback voice: Adam (${frankVoiceId})`);
  }

  const frankSettings = { stability: 0.5, similarity_boost: 0.8, style: 0.3 };
  console.log(`\n2. Generating ${FRANK_CHAPTERS.length} Frankenstein chapters...\n`);
  for (let i = 0; i < FRANK_CHAPTERS.length; i++) {
    await generateTTS(frankVoiceId, FRANK_CHAPTERS[i], frankSettings, path.join(FRANK_DIR, `ch${i}.mp3`));
    await new Promise((r) => setTimeout(r, 1000)); // Rate limit
  }

  // --- 10 SECONDS: Standard (per-chapter emotional settings) ---
  console.log("\n3. Searching for 10 Seconds narrator voice...");
  let timedVoiceId = await searchVoice("male whisper urgent scared American");
  if (timedVoiceId) {
    console.log("   Adding voice to library...");
    timedVoiceId = await addSharedVoice(timedVoiceId);
  }
  if (!timedVoiceId) {
    // Fallback
    timedVoiceId = "ErXwobaYiN019PkySvjV";
    console.log(`   Using fallback voice: Antoni (${timedVoiceId})`);
  }

  console.log(`\n4. Generating ${TIMED_CHAPTERS.length} standard 10 Seconds chapters (per-chapter emotion)...\n`);
  for (let i = 0; i < TIMED_CHAPTERS.length; i++) {
    const settings = TIMED_STANDARD_SETTINGS[i];
    console.log(`   Ch${i} settings: stability=${settings.stability} style=${settings.style}`);
    await generateTTS(timedVoiceId, TIMED_CHAPTERS[i], settings, path.join(TIMED_DIR, `ch${i}.mp3`));
    await new Promise((r) => setTimeout(r, 1000));
  }

  // --- 10 SECONDS: Companion (per-chapter emotional whisper) ---
  console.log(`\n5. Generating ${TIMED_COMPANION.length} companion chapters (emotional progression)...\n`);
  for (let i = 0; i < TIMED_COMPANION.length; i++) {
    const settings = TIMED_COMPANION_SETTINGS[i];
    console.log(`   Ch${i} companion: stability=${settings.stability} style=${settings.style}`);
    await generateTTS(timedVoiceId, TIMED_COMPANION[i], settings, path.join(TIMED_DIR, `ch${i}_companion.mp3`));
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log("\n=== DONE ===\n");
}

main();
