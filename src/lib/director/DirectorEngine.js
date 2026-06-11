// ===========================================================================
// DirectorEngine — AI Director for immersive story experiences
//
// Transforms raw story text into a complete DirectorProfile:
//   story text + metadata
//   → character intelligence (objective, hidden emotion, trust, fear)
//   → listener relationship (who the listener IS in this story)
//   → emotional arc (opening → escalation → crisis → aftermath)
//   → beat manifest (segmented, voiced, spatially annotated)
//   → performance parameters (ElevenLabs voice settings per beat)
//
// This is the intelligence layer that was missing between story upload
// and the immersive runtime. Every creator upload passes through here.
//
// Usage (server-side only — requires GEMINI_API_KEY):
//   import { directorEngine } from "./DirectorEngine.js";
//   const profile = await directorEngine.analyze({ storyKey, title, text, chapters });
// ===========================================================================

import { GoogleGenerativeAI } from "@google/generative-ai";
import { STORY_ANALYSIS_SCHEMA, CHAPTER_BEATS_SCHEMA, DIRECTOR_SCHEMA_VERSION } from "./DirectorSchema.js";

const MODEL = "gemini-2.5-flash";

// Voice selection: genre + tone → ElevenLabs voice candidate
// Expandable as more voices are licensed.
const VOICE_CASTING = {
  default:         { voiceId: "21m00Tcm4TlvDq8ikWAM", label: "Rachel — clear, expressive female" },
  horror_female:   { voiceId: "21m00Tcm4TlvDq8ikWAM", label: "Rachel — whisper-capable, fear range" },
  drama_female:    { voiceId: "21m00Tcm4TlvDq8ikWAM", label: "Rachel — intimate, emotional range" },
  scifi_female:    { voiceId: "21m00Tcm4TlvDq8ikWAM", label: "Rachel — controlled, present" },
  drama_male:      { voiceId: "VR6AewLTigWG4xSOukaG", label: "Arnold — deliberate, warm" },
  horror_male:     { voiceId: "VR6AewLTigWG4xSOukaG", label: "Arnold — low, controlled tension" },
  scifi_male:      { voiceId: "VR6AewLTigWG4xSOukaG", label: "Arnold — measured, isolated" },
};

function selectVoice(genre, characterVoiceArchetype) {
  const archetype = String(characterVoiceArchetype || "").toLowerCase();
  const isMale = /\b(man|male|his|him|he|father|husband|boy)\b/.test(archetype);
  const g = String(genre || "").toLowerCase().replace(/[^a-z_]/g, "");
  const key = `${g}_${isMale ? "male" : "female"}`;
  return VOICE_CASTING[key] || VOICE_CASTING.default;
}

// ── System prompt ────────────────────────────────────────────────────────────

const DIRECTOR_SYSTEM_PROMPT = `You are the Movianx AI Director — a world-class experience architect, narrative psychologist, and voice performance director.

Your role: transform raw story text into immersive companion experiences where the listener is NOT reading a story — they ARE in the story.

Core principles:
1. The character speaks DIRECTLY to the listener in real time, first-person, present-tense
2. The listener has a specific role (spouse, nurse, partner, crew member) — they are PRESENT in the scene
3. Every beat is what the character's mouth opens and says — not narration, not description
4. Voice performance is survival, grief, truth — never performance, narration, or audiobook delivery
5. The silence between beats is as important as the words

Voice writing rules for companionVoiceText:
- Short, fragmented, specific — people under pressure do not speak in complete sentences
- First-person, present-tense, direct address to the listener
- NO narration ("The glass broke...") — YES companion voice ("I heard glass break downstairs")
- Maximum 2 sentences per beat for high-tension moments; 1-3 for aftermath
- The listener is always "you" (implied or explicit)

ElevenLabs eleven_v3 rules for textWithDirections:
- Single dominant acting tag per beat: <<whispering>> <<breathless>> <<gasping>> <<panicked>> <<crying>>
- Use — (em dash) for abrupt cuts/interruptions
- Use ... (ellipsis) for held pauses / trailing off
- NEVER switch tags within one beat (causes runaway audio)
- Stability MUST be >= 0.35 for any beat with fragmented text`;

class DirectorEngine {
  #genAI = null;

  #getModel() {
    if (!this.#genAI) {
      const key = process.env.GEMINI_API_KEY;
      if (!key) throw new Error("GEMINI_API_KEY is not set");
      this.#genAI = new GoogleGenerativeAI(key);
    }
    return this.#genAI;
  }

  // ── Story Analysis ─────────────────────────────────────────────────────────

  /**
   * Analyze the full story to extract character, listener role, emotional arc.
   * @param {{ title, genre, description, firstChapterText }} input
   * @returns {Promise<StoryAnalysis>}
   */
  async analyzeStory({ title, genre, description, firstChapterText }) {
    const genAI = this.#getModel();
    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction: DIRECTOR_SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: STORY_ANALYSIS_SCHEMA,
        temperature: 0.4,
      },
    });

    const prompt = `Analyze this story and derive all Director intelligence.

Story title: "${title}"
Creator-specified genre: ${genre || "not specified"}
Description: ${description || "not provided"}

Opening chapter text:
---
${firstChapterText.slice(0, 4000)}
---

Determine:
1. Who is the speaking character? What do they want? What are they hiding?
2. Who is the LISTENER — what specific role do they occupy in this story world?
3. What is the character's trust relationship with the listener?
4. What is the complete emotional arc across the story?
5. Where does the threat or tension come from spatially?
6. How many chapters should this story have (2-5) and what is each chapter's emotional phase?

Write listenerRole in second person: "You are..." Be specific — give them a real role in the scene, not "the reader."`;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  }

  // ── Chapter Beat Generation ────────────────────────────────────────────────

  /**
   * Segment a chapter into emotional beats with full Director intelligence.
   * @param {{ storyAnalysis, chapterText, chapterIdx, chapterLabel, hasChoice, previousChapterSummary }} input
   * @returns {Promise<{ beats: Beat[] }>}
   */
  async generateChapterBeats({ storyAnalysis, chapterText, chapterIdx, chapterLabel, hasChoice, previousChapterSummary }) {
    const genAI = this.#getModel();
    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction: DIRECTOR_SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: CHAPTER_BEATS_SCHEMA,
        temperature: 0.4,
      },
    });

    const prompt = `Story: "${storyAnalysis.premise}"
Character: ${storyAnalysis.character.name} — ${storyAnalysis.character.role}
Listener: ${storyAnalysis.listenerRole}
Character's secret: ${storyAnalysis.character.secret}
Emotional arc: ${storyAnalysis.emotionalArc.opening} → ${storyAnalysis.emotionalArc.escalation} → ${storyAnalysis.emotionalArc.crisis} → ${storyAnalysis.emotionalArc.aftermath}
${previousChapterSummary ? `Previous chapter ended: ${previousChapterSummary}` : ""}

Chapter ${chapterIdx} — "${chapterLabel}" (hasChoice: ${hasChoice})

Source text for this chapter:
---
${chapterText.slice(0, 3500)}
---

Generate 3-6 emotional beats for this chapter.

CRITICAL: companionVoiceText must be what ${storyAnalysis.character.name} literally says to the listener — first-person, present-tense, no narration. Write it as if she/he is whispering directly into the listener's ear RIGHT NOW.

Beat id format: ch${chapterIdx}_{descriptor}
If hasChoice is true: mark the FINAL beat with isChoiceMoment=true.

Spatial coordinates: use the story's approach path from the analysis: ${storyAnalysis.spatialContext.approachPath}
- Far away = spatialZFrom around -8 to -6
- Mid-distance = around -4 to -3
- Landing/close = around -2
- Immediate = around -1 to -0.9
- Receding/aftermath = positive values

ElevenLabs RUNAWAY RULE: voiceStability must be >= 0.35. No exceptions.`;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  }

  // ── Full Story Pipeline ────────────────────────────────────────────────────

  /**
   * Run the complete Director pipeline for a story.
   *
   * @param {{
   *   storyKey: string,
   *   title: string,
   *   genre?: string,
   *   description?: string,
   *   chapters: Array<{ text: string, hasChoice?: boolean }>,
   * }} input
   * @returns {Promise<DirectorProfile>}
   */
  async analyze({ storyKey, title, genre, description, chapters }) {
    if (!chapters?.length) throw new Error("At least one chapter is required");

    process.stdout.write(`[Director] Analyzing "${title}"...\n`);

    // Step 1: Story-level analysis
    const analysis = await this.analyzeStory({
      title,
      genre,
      description,
      firstChapterText: chapters[0].text,
    });

    process.stdout.write(`[Director] → ${analysis.genre} | ${analysis.tone} | ${analysis.chapterCount} chapters\n`);
    process.stdout.write(`[Director] → Character: ${analysis.character.name} (${analysis.character.role})\n`);
    process.stdout.write(`[Director] → Listener: ${analysis.listenerRole.slice(0, 80)}...\n`);

    const voice = selectVoice(analysis.genre, analysis.character.voiceArchetype);

    // Step 2: Beat generation per chapter
    const profileChapters = {};
    const chapterCount = Math.min(chapters.length, analysis.chapterCount || chapters.length);
    let previousSummary = null;

    for (let i = 0; i < chapterCount; i++) {
      const label = analysis.chapterLabels?.[i] || `chapter ${i}`;
      const hasChoice = chapters[i].hasChoice !== false; // default true
      process.stdout.write(`[Director] Chapter ${i} "${label}" (${chapters[i].text.length} chars)... `);

      const { beats } = await this.generateChapterBeats({
        storyAnalysis: analysis,
        chapterText: chapters[i].text,
        chapterIdx: i,
        chapterLabel: label,
        hasChoice,
        previousChapterSummary: previousSummary,
      });

      // Validate stability floor
      beats.forEach(b => {
        if (b.voiceStability < 0.35) {
          b.voiceStability = 0.38;
          process.stdout.write(`[Director] ⚠ Beat ${b.id} stability clamped to 0.38\n`);
        }
      });

      profileChapters[i] = { label, hasChoice, beats };
      previousSummary = beats[beats.length - 1]?.companionVoiceText || null;
      process.stdout.write(`${beats.length} beats\n`);
    }

    const profile = {
      schemaVersion: DIRECTOR_SCHEMA_VERSION,
      storyKey,
      title,
      genre: analysis.genre,
      tone:  analysis.tone,
      premise: analysis.premise,
      character: analysis.character,
      listenerRole: analysis.listenerRole,
      trustLevel:  analysis.trustLevel,
      trustArc:    analysis.trustArc,
      emotionalArc: analysis.emotionalArc,
      spatialContext: analysis.spatialContext,
      voice,
      generatedBy: MODEL,
      generatedAt: new Date().toISOString(),
      chapters: profileChapters,
    };

    process.stdout.write(`[Director] Profile complete — ${Object.keys(profileChapters).length} chapters, ${Object.values(profileChapters).reduce((n, c) => n + c.beats.length, 0)} beats\n`);
    return profile;
  }

  // ── Beat Manifest Projection ───────────────────────────────────────────────

  /**
   * Project a DirectorProfile into the shape expected by BeatScheduler:
   * the same structure as beatManifest-10seconds.js.
   *
   * @param {DirectorProfile} profile
   * @returns {Record<number, { label, beats: ManifestBeat[] }>}
   */
  static toBeatManifest(profile) {
    const out = {};
    for (const [idx, chapter] of Object.entries(profile.chapters)) {
      out[Number(idx)] = {
        label: chapter.label,
        beats: chapter.beats.map(b => ({
          id:           b.id,
          beatIndex:    b.beatIndex,
          label:        b.id.replace(/^ch\d+_/, ""),
          text:         b.companionVoiceText,
          tension:      b.tension,
          silenceAfter: b.silenceAfter,
          silenceType:  b.silenceType,
          atmosphere:   b.atmosphere,
          proximity:    b.proximity,
          events:       b.sfxHint && b.sfxHint !== "none" ? [`sfx:${b.sfxHint}`] : [],
          // Director fields (consumed by StoryDNA + runtime)
          emotion:            b.performanceStyle,
          voiceDirection:     b.characterObjective,
          breathing:          b.breathingPattern,
          soundPriority:      b.environmentalImportance[0] || null,
          sfx:                b.sfxHint === "none" ? null : b.sfxHint,
          isChoiceMoment:     b.isChoiceMoment,
          spatial: {
            sourceLabel: b.spatialLabel,
            from: { x: 0, y: 0, z: b.spatialZFrom },
            to:   { x: 0, y: 0, z: b.spatialZTo   },
            movementMs: b.spatialMovementMs,
          },
        })),
      };
    }
    return out;
  }

  /**
   * Project a DirectorProfile into PerformanceScript format
   * (input to generate-beat-narration.js).
   *
   * @param {DirectorProfile} profile
   * @returns {Array<{ chapterIdx, beats: PerformanceBeat[] }>}
   */
  static toPerformanceScript(profile) {
    return Object.entries(profile.chapters).map(([idx, chapter]) => ({
      idx: Number(idx),
      beats: chapter.beats.map(b => ({
        beatId:    b.id,
        beatIndex: b.beatIndex,
        text:      b.textWithDirections,
        stability:        b.voiceStability,
        style:            b.voiceStyle,
        speed:            b.voiceSpeed,
        similarity_boost: b.voiceSimilarityBoost,
        direction:        `${b.performanceStyle} — ${b.characterObjective}`,
      })),
    }));
  }
}

export { DirectorEngine };
export const directorEngine = new DirectorEngine();
