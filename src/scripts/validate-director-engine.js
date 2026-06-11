#!/usr/bin/env node
// ===========================================================================
// validate-director-engine.js — Task 4: Director Engine Generalization Proof
//
// Runs the Director Engine on three original stories (NOT 10 Seconds):
//   1. Horror:          "The Last Room" — a woman trapped in a collapsing house
//   2. Drama:           "Letters Unsent" — a father reading letters he never sent to his son
//   3. Science Fiction: "Signal" — an astronaut receiving transmissions from a dead crewmate
//
// For each story:
//   → Generates a DirectorProfile via Gemini
//   → Validates the profile
//   → Saves to src/data/directorProfiles/{storyKey}.json
//   → Prints a summary with beat count, listener role, emotional arc
//
// Usage:
//   GEMINI_API_KEY=xxx node src/scripts/validate-director-engine.js
//
// Optional flags:
//   STORY=horror|drama|scifi   — run only one story
//   SKIP_WRITE=1               — validate without saving to disk
// ===========================================================================

import { generateDirectorProfile } from "../lib/director/generateDirectorProfile.js";
import { formatValidationReport } from "../lib/director/DirectorProfileValidator.js";
import { DirectorEngine, directorEngine } from "../lib/director/DirectorEngine.js";

// ── Story Corpus ─────────────────────────────────────────────────────────────
// Three original stories that demonstrate genre generalization.
// Each is written as a multi-chapter narrative in third person —
// the Director Engine will derive the companion voice, listener role,
// and beat structure from the raw text.

const STORIES = [

  // ── 1. Horror ──────────────────────────────────────────────────────────────
  {
    storyKey:    "the_last_room",
    title:       "The Last Room",
    genre:       "horror",
    description: "A woman trapped in a flooding basement while her daughter waits upstairs.",
    chapters: [
      {
        text: `
Maya had been in the basement for six minutes when the first pipe burst.

She was looking for the circuit breaker — the lights had gone out upstairs, and Lily was alone up there, seven years old, in the dark. Simple errand. She would be back in thirty seconds.

Then the wall gave.

Not all of it. Just the south corner, where the foundation had been cracking all winter. Water didn't pour in. It erupted. Cold, black, smelling of soil and rot. It hit her knees before she had time to step back.

She turned for the stairs. The stairs were on the other side of the water.

She stood in the corner and watched it rise.

"Lily." Her voice came out wrong. Too quiet. "Lily!"

Nothing from upstairs. Maybe the walls were too thick. Maybe Lily had her headphones on, the pink ones with the cats on the earcups, the ones she wore when she was scared.

The water found her waist.

She had her phone. No signal — the basement was a dead zone, always had been. She typed a message anyway, knowing it wouldn't send until she was in range. Just in case.

*I'm in the basement. I'm okay. Don't come down. Stay upstairs.*

The water found her chest.

She found a shelf bracket to stand on. Eight inches of space between the water and the ceiling.

Eight inches.

She put her face into that space and breathed.
        `,
        hasChoice: true,
      },
      {
        text: `
Lily heard her mother call her name.

It came from below. Through the floor. Like the house was speaking.

She went to the basement door — not down the stairs, just to the door, the way her mother had always told her to stop when she got to the street, not step into it. Stand at the edge. Look first.

She looked.

The water was the first thing she saw. It was dark, and it was moving.

"Mom?"

Nothing. The kind of nothing that has weight.

She had a flashlight on her keychain — the same keychain as her mom's, matching ones from a hardware store. She switched it on. The beam caught the water and broke apart on the surface.

Her mother's shoes were floating near the bottom of the stairs.

Lily stood at the door for ten seconds. She counted. It was something her mother had taught her: when you don't know what to do, count ten seconds. Give your brain time to find the answer.

One. Two. Three. Four. Five. Six. Seven. Eight. Nine. Ten.

She turned around. She went to the kitchen. She called 911.

Her hands were shaking but her voice was steady.

"My mom is trapped in the basement. There's water."

While she waited, she sat on the kitchen floor with her back against the door. Still there. Still between her mother and whatever came next.
        `,
        hasChoice: true,
      },
      {
        text: `
The water reached the top shelf bracket at six minutes, fourteen seconds.

Maya had counted. She didn't know why she was counting. It felt important to keep track.

There were four inches between the water and the ceiling now.

She was breathing in shallow sips, conserving the air, trying to make it last longer than physics would allow. She knew that wasn't how physics worked. She counted anyway.

She thought about the last thing she'd said to Lily that morning. It had been about shoes. *Those shoes don't match that shirt.*

She hoped it wasn't the last thing.

She thought about the message on her phone. She hoped it sent.

She heard something.

Not water. Not the house settling. Not the grinding of the pipes.

Sirens.

Faint. Far away. Getting less far.

She pressed her face into the last two inches of air and listened.

Sirens.

Lily.
        `,
        hasChoice: false,
      },
    ],
  },

  // ── 2. Drama ──────────────────────────────────────────────────────────────
  {
    storyKey:    "letters_unsent",
    title:       "Letters Unsent",
    genre:       "drama",
    description: "A father alone in his son's childhood bedroom, reading letters he wrote but never sent.",
    chapters: [
      {
        text: `
Robert sat on the edge of Danny's bed for a long time before he opened the drawer.

He'd been in this room a hundred times since the accident. He'd straightened the trophies. He'd washed the sheets twice — once when they still smelled like him, once when they stopped. He'd sat in this exact spot and not opened any drawers.

Today he opened the drawer.

There were the letters. Eight of them, in a stack, bound with a rubber band. He'd written the first one when Danny was nine and had stopped talking to him. Children did that — closed off, went somewhere you couldn't follow. He'd tried to write instead of speak, thinking that might be easier.

He'd never sent any of them.

He'd written them, sealed them, put them in the drawer. Told himself he'd send them when things improved. When Danny was older. When there was more distance and things would hurt less going in.

Now he held the first one. *Danny. September, nine years ago.*

He turned it over in his hands three times.

Then he opened it.
        `,
        hasChoice: true,
      },
      {
        text: `
The second letter was dated two years later. Danny was eleven.

Robert had missed his school play. He'd had a work conference — he'd told himself it was unavoidable, had believed that for a long time. Reading the letter now, he saw that he'd known even then that he'd chosen it. He'd written it down right there in his own handwriting: *I chose the wrong thing. I don't know how to fix that.*

He hadn't fixed it.

He thought about reading them all the way through, every letter, and then he thought about stopping after this one, and then he thought about burning them and not having to choose at all.

He didn't do any of those things. He sat there with the second letter in his hands, holding it at arms length the way you hold something hot.

His wife had asked him once, three months after the accident, what he regretted most. He'd said he didn't know. He'd meant it then.

He knew now.

Not the play. Not the letters. Not any single thing he hadn't done.

He regretted that he'd kept thinking there was still time.
        `,
        hasChoice: true,
      },
      {
        text: `
The last letter was dated eight months ago. Four months before.

He'd written it after their worst fight — the one about the graduation trip, the one where Danny had said *you never* and he had said *I always* and neither of those things was true and both of those things were true.

He'd written: *I don't know how to be your father. I only know how to want to be.*

He'd sealed it. He'd written Danny's name on the front. He'd sat in this same spot and told himself he would bring it up the next time they talked. Slide it across the table. Say, here, I wrote this, I mean it.

There wasn't a next time.

Robert folded the letter back into its envelope and placed it on top of the stack. He held the whole stack in both hands.

He sat with them.

He didn't know what the right thing to do with them was. He suspected there wasn't one. He suspected that was the point. That some things exist only to be held.

He held them.

The room was very quiet. Outside, someone mowed a lawn. Someone was washing a car. The world continued in its ordinary way, and inside this room, Robert kept his word — the one he was giving now, the only one he had left to give.

*I'm not putting these back in the drawer.*
        `,
        hasChoice: false,
      },
    ],
  },

  // ── 3. Science Fiction ─────────────────────────────────────────────────────
  {
    storyKey:    "signal",
    title:       "Signal",
    genre:       "sci_fi",
    description: "Mission commander Voss begins receiving voice transmissions from her dead crewmate 40 million miles from Earth.",
    chapters: [
      {
        text: `
Mission day 847. Commander Voss logged the transmission at 03:14 station time.

It was a voice.

Not static. Not interference. Not a pattern she could explain with cosmic background noise or instrument error. A voice. Forty-one million miles from the nearest human being.

Dr. Nadia Okafor had died on mission day 620. Airlock malfunction. They'd recovered everything they could and held a formal service and logged it in the black box and Voss had written a letter to Nadia's husband that she still wasn't sure she'd sent correctly. The delay on outgoing transmissions was eleven minutes. It was possible the letter was still traveling.

The voice came again at 03:22.

She recorded it. She didn't play it back immediately. She sat with the fact of it for four minutes — the same amount of time it had taken her to unseal the inner airlock door on mission day 620.

Then she played it back.

It was Nadia.

Not similar. Not like. It was her voice, her specific cadence, the slight South London accent she'd kept for thirty-eight years. She was saying something. The signal was compressed, partial. Voss played it six times and got this:

*— not what you think. I need you to—*

Then nothing. Then the regular hiss of space.

Voss sat in her chair and did not move for a long time.
        `,
        hasChoice: true,
      },
      {
        text: `
She didn't report it to mission control.

That was the first decision, and she knew it was the wrong one by every protocol she'd agreed to, and she made it anyway. Because reporting it meant a fourteen-minute round-trip before anyone could respond, and she needed to understand it first, alone, before it became data.

On day 848, another signal came. Longer.

She got three full sentences before the compression broke it apart:

*Voss. I need you to listen to me carefully. What happened to me — there's something in the logs you haven't seen yet.*

She checked the logs. Nadia's logs from days 618 through 620 were intact, unchanged, nothing she hadn't read twice already. She checked the instrument error rate. She tested the communications array for phantom signal generation.

Everything checked clean.

On day 849, the signal came again at the same time. 03:14.

*Third transmission. I know this is difficult. I know what it sounds like. I need you to check the external array housing. Specifically the secondary relay panel. There's something—*

The signal fragmented. Then: *—please, Voss.*

She'd heard Nadia say please exactly once in 847 days. Day one, when Voss had accidentally eaten her yogurt during the launch sequence debrief, and Nadia had said — very precisely, with perfect warmth — *please, Commander, that was the last one.*

She picked up her tool kit.

She went to the airlock.
        `,
        hasChoice: true,
      },
      {
        text: `
Inside the secondary relay panel, she found the device on day 849, at 07:52 station time.

She didn't know what it was. She photographed it from seven angles and ran it through every database she had onboard. Nothing matched exactly. But the materials, the construction, the installation point — they pointed to something placed there deliberately, before launch, by someone who knew exactly where the signal path ran.

It wasn't transmitting anything dangerous. As far as she could tell, it was only receiving.

She sat on the floor of the cargo bay for forty minutes.

She thought about Nadia's face on day 620, three seconds before the malfunction. She thought about whether a malfunction could be designed. She thought about whether she was being told a truth or constructed into a position where she would make a mistake.

Then she thought about the voice. The South London accent. The way Nadia had always ended a hard conversation by saying *but you already know that.*

The last transmission came at 11:00.

Just four words.

*But you already know.*

Voss stayed on the floor for another twenty minutes. Then she got up. She photographed everything. She wrote it all down, timestamped, three copies.

Then she opened a transmission to Earth and began: *Mission Control, I need to report a discovery. I'm going to need you to clear fourteen minutes.*

She waited.

Space has very specific silences. She had learned them all by now. This one felt like the beginning of something.
        `,
        hasChoice: false,
      },
    ],
  },
];

// ── Runner ────────────────────────────────────────────────────────────────────

const STORY_FILTER = process.env.STORY?.toLowerCase();
const SKIP_WRITE   = process.env.SKIP_WRITE === "1";

async function runStory(story) {
  console.log(`\n${"=".repeat(70)}`);
  console.log(`  ${story.genre.toUpperCase()}: "${story.title}" (${story.storyKey})`);
  console.log("=".repeat(70));

  const opts = {
    storyKey:    story.storyKey,
    title:       story.title,
    genre:       story.genre,
    description: story.description,
    chapters:    story.chapters,
  };

  let result;
  if (SKIP_WRITE) {
    const { validateDirectorProfile } = await import("../lib/director/DirectorProfileValidator.js");
    const profile    = await directorEngine.analyze(opts);
    const validation = validateDirectorProfile(profile);
    const beatManifest      = DirectorEngine.toBeatManifest(profile);
    const performanceScript = DirectorEngine.toPerformanceScript(profile);
    result = { profile, validation, beatManifest, performanceScript, outputPath: "(dry run)" };
  } else {
    result = await generateDirectorProfile(opts);
  }

  const { profile, validation, beatManifest, performanceScript } = result;

  // ── Print profile summary ──
  console.log(`\n  STORY INTELLIGENCE`);
  console.log(`  Genre:    ${profile.genre}  |  Tone: ${profile.tone}`);
  console.log(`  Premise:  ${profile.premise}`);
  console.log(`  Character: ${profile.character.name} — "${profile.character.role}"`);
  console.log(`  Secret:    ${profile.character.secret}`);
  console.log(`  Listener:  ${profile.listenerRole}`);
  console.log(`  Trust:     ${profile.trustLevel} (${profile.trustArc})`);
  console.log(`\n  EMOTIONAL ARC`);
  console.log(`  Opening:    ${profile.emotionalArc.opening}`);
  console.log(`  Escalation: ${profile.emotionalArc.escalation}`);
  console.log(`  Crisis:     ${profile.emotionalArc.crisis}`);
  console.log(`  Aftermath:  ${profile.emotionalArc.aftermath}`);
  console.log(`\n  SPATIAL CONTEXT`);
  console.log(`  Setting:    ${profile.spatialContext.setting}`);
  console.log(`  Threat:     ${profile.spatialContext.threatDirection}`);
  console.log(`  Path:       ${profile.spatialContext.approachPath}`);

  // ── Print beats ──
  console.log(`\n  BEATS`);
  for (const [chIdx, chapter] of Object.entries(profile.chapters)) {
    console.log(`\n  Chapter ${chIdx}: "${chapter.label}"`);
    for (const beat of chapter.beats) {
      const stability = beat.voiceStability?.toFixed(2) || "??";
      const tension   = String(beat.tension || 0).padStart(3);
      const choice    = beat.isChoiceMoment ? " ← CHOICE" : "";
      console.log(`    [${tension}t / stab:${stability}] ${beat.id}${choice}`);
      console.log(`      Voice: "${beat.companionVoiceText?.slice(0, 80)}"`);
      console.log(`      Eleven: "${beat.textWithDirections?.slice(0, 80)}"`);
      console.log(`      Direction: ${beat.performanceStyle}`);
    }
  }

  // ── Print validation ──
  const { formatValidationReport } = await import("../lib/director/DirectorProfileValidator.js");
  console.log(`\n${formatValidationReport(validation, story.storyKey)}`);

  // ── Print downstream artifacts ──
  const totalBeats = Object.values(beatManifest).reduce((n, ch) => n + ch.beats.length, 0);
  console.log(`\n  DOWNSTREAM ARTIFACTS`);
  console.log(`  BeatManifest: ${totalBeats} beats across ${Object.keys(beatManifest).length} chapters`);
  console.log(`  PerformanceScript: ${performanceScript.reduce((n, ch) => n + ch.beats.length, 0)} beats`);
  if (!SKIP_WRITE) console.log(`  Saved: ${result.outputPath}`);

  return result;
}

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("ERROR: GEMINI_API_KEY is required");
    process.exit(1);
  }

  const stories = STORY_FILTER
    ? STORIES.filter(s => s.genre.startsWith(STORY_FILTER) || s.storyKey.includes(STORY_FILTER))
    : STORIES;

  if (!stories.length) {
    console.error(`No story matched STORY="${STORY_FILTER}". Available: horror, drama, scifi`);
    process.exit(1);
  }

  console.log(`\nMovianx Director Engine V1 — Generalization Validation`);
  console.log(`Running ${stories.length} story/stories: ${stories.map(s => s.genre).join(", ")}\n`);

  const results = [];
  let allValid = true;

  for (const story of stories) {
    try {
      const result = await runStory(story);
      results.push({ storyKey: story.storyKey, success: true, valid: result.validation.valid });
      if (!result.validation.valid) allValid = false;
    } catch (err) {
      console.error(`\nERROR processing "${story.title}":`, err.message);
      results.push({ storyKey: story.storyKey, success: false, valid: false });
      allValid = false;
    }
  }

  // Final summary
  console.log(`\n${"=".repeat(70)}`);
  console.log(`  VALIDATION SUMMARY`);
  console.log("=".repeat(70));
  for (const r of results) {
    const status = r.success
      ? (r.valid ? "✓ VALID" : "⚠ INVALID")
      : "✗ ERROR";
    console.log(`  ${r.storyKey.padEnd(24)} ${status}`);
  }
  console.log();

  process.exit(allValid ? 0 : 1);
}

main().catch(e => { console.error(e); process.exit(1); });
