// ===========================================================================
// DirectorSchema — canonical types and Gemini structured-output schemas
//
// Every story that passes through the Director Engine produces a
// DirectorProfile: a story-level document containing character intelligence,
// listener relationship, emotional arc, and a complete beat manifest — all
// automatically derived from raw story text.
//
// The profile is the single source of truth that feeds:
//   DirectorProfile → StoryDNA → PerformanceScript → ElevenLabs → Runtime
//
// Schema versioning: bump DIRECTOR_SCHEMA_VERSION when fields change.
// ===========================================================================

export const DIRECTOR_SCHEMA_VERSION = "1.0";

// ── Enumerations ────────────────────────────────────────────────────────────

export const SILENCE_TYPES   = Object.freeze(["normal", "anticipation", "fear", "grief"]);
export const PROXIMITY_LEVELS = Object.freeze(["far", "room", "close", "ear"]);
export const BREATHING_PATTERNS = Object.freeze(["slow", "uneven", "shallow", "panic", "held", "none"]);

// All speech behaviors the Director may assign to a beat.
// Tells the ElevenLabs pipeline how to direct the voice.
export const SPEECH_BEHAVIORS = Object.freeze([
  "whispered_confession",   // voice drops to near-inaudible intimacy
  "panicked_report",        // words arrive fast, unordered, breathless
  "hollow_grief",           // flat, dissociated, present-tense numbness
  "counting_aloud",         // tracks something by numbering — slows on each count
  "interrupts_self",        // starts a thought, abandons it, starts again
  "repeats_for_comfort",    // says the same phrase twice (seeking reassurance)
  "lies",                   // delivers false information; tone too controlled
  "confesses",              // information the character didn't want to say
  "blames",                 // attribution of fault — heat under the words
  "protects",               // speaks for someone else's safety
  "manipulates",            // delivers information strategically, not honestly
  "comforts",               // directed at the listener's fear, not their own
  "hesitates",              // pauses mid-thought — held breath before the word
  "commands",               // instruction under pressure
  "question_with_no_answer", // asks something both parties know cannot be answered
]);

// Things in the environment that carry narrative weight for a beat.
export const ENVIRONMENTAL_IMPORTANCES = Object.freeze([
  "children_nearby",
  "armed_intruder",
  "footsteps_approaching",
  "door_between_character_and_threat",
  "exit_blocked",
  "phone_dead",
  "complete_darkness",
  "weapon_accessible",
  "sirens_distant",
  "other_person_listening",
  "empty_space",
  "cold_air",
  "glass_broken",
]);

// ── Story-level context ──────────────────────────────────────────────────────

/**
 * Gemini structured-output schema for story-level analysis.
 * One call per story. Derives character, listener, arc, voice.
 */
export const STORY_ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    genre: {
      type: "string",
      description: "Primary genre: horror | drama | sci_fi | thriller | romance | mystery | literary",
    },
    tone: {
      type: "string",
      description: "Dominant emotional tone: dread | grief | wonder | kinetic | intimate | surreal | melancholic | tense",
    },
    premise: {
      type: "string",
      description: "One sentence: setting, central situation, and the stakes. No spoilers.",
    },
    character: {
      type: "object",
      properties: {
        name:             { type: "string" },
        role:             { type: "string", description: "Who they are in the story — e.g. 'terrified mother', 'dying patient', 'isolated astronaut'" },
        primaryEmotion:   { type: "string", description: "The dominant emotion driving them through the story" },
        objective:        { type: "string", description: "What they most want by the end of the story" },
        secret:           { type: "string", description: "What they feel but will not say directly — the subtext beneath every line" },
        voiceArchetype:   { type: "string", description: "Voice casting note — e.g. 'mid-30s woman, exhausted but fierce', '60-year-old man, quiet, deliberate'" },
      },
      required: ["name", "role", "primaryEmotion", "objective", "secret", "voiceArchetype"],
    },
    listenerRole: {
      type: "string",
      description: "Who the LISTENER is in this story — written in second person. The listener is never described as 'the reader'. They have a specific role: 'You are Sarah's spouse, lying beside her in the dark.' or 'You are the nurse who found the letter.' Be specific.",
    },
    trustLevel: {
      type: "number",
      description: "How much the character trusts the listener at the start: 0 = complete distrust, 1 = complete trust",
    },
    trustArc: {
      type: "string",
      description: "How trust changes across the story: 'builds', 'collapses', 'holds steady', 'never established'",
    },
    emotionalArc: {
      type: "object",
      properties: {
        opening:    { type: "string", description: "Emotional state at the story's start" },
        escalation: { type: "string", description: "How and why emotion intensifies" },
        crisis:     { type: "string", description: "The peak emotional moment" },
        aftermath:  { type: "string", description: "Emotional state at the story's end" },
      },
      required: ["opening", "escalation", "crisis", "aftermath"],
    },
    spatialContext: {
      type: "object",
      properties: {
        setting:          { type: "string", description: "Physical space of the story" },
        threatDirection:  { type: "string", description: "Where the primary threat comes from spatially" },
        approachPath:     { type: "string", description: "How threat or change moves toward the listener over the story" },
      },
      required: ["setting", "threatDirection", "approachPath"],
    },
    chapterCount: {
      type: "number",
      description: "Recommended number of chapters (2-5). Each chapter should have a distinct emotional phase.",
    },
    chapterLabels: {
      type: "array",
      items: { type: "string" },
      description: "A label for each chapter — short noun phrase describing the emotional phase",
    },
  },
  required: ["genre", "tone", "premise", "character", "listenerRole", "trustLevel", "trustArc", "emotionalArc", "spatialContext", "chapterCount", "chapterLabels"],
};

// ── Beat-level schema ────────────────────────────────────────────────────────

/**
 * Gemini structured-output schema for chapter beat generation.
 * One call per chapter. Segments the chapter into 3-6 emotional beats
 * and derives all Director intelligence per beat.
 */
export const CHAPTER_BEATS_SCHEMA = {
  type: "object",
  properties: {
    beats: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Unique snake_case id: ch{N}_{descriptor} — e.g. ch0_wake_up, ch1_footsteps",
          },
          beatIndex: {
            type: "number",
            description: "0-indexed position within this chapter",
          },
          companionVoiceText: {
            type: "string",
            description: "What the character actually SAYS to the listener in this beat. First-person, present-tense, direct address. This IS the audio — spoken, intimate, specific. NOT narration. NOT description. The character's mouth opening and saying words to the person beside them.",
          },
          tension: {
            type: "number",
            description: "Tension 0-100. 0-20=calm, 21-45=unease, 46-70=fear, 71-90=panic, 91-100=climax",
          },
          silenceAfter: {
            type: "number",
            description: "Milliseconds of silence after this beat. 400-800 for panic. 1200-2000 for grief. 800-1200 for anticipation.",
          },
          silenceType: {
            type: "string",
            enum: ["normal", "anticipation", "fear", "grief"],
          },
          proximity: {
            type: "string",
            enum: ["far", "room", "close", "ear"],
            description: "How close the threat or tension source feels to the listener",
          },
          atmosphere: {
            type: "string",
            description: "One word for the audio atmosphere at this beat — e.g. ambient_silence, footsteps, shatter, grief_drone",
          },
          characterObjective: {
            type: "string",
            description: "What the character wants to achieve in this specific beat — not globally, just right now",
          },
          hiddenEmotion: {
            type: "string",
            description: "What the character is actually feeling beneath what they say — the subtext",
          },
          listenerRelationship: {
            type: "string",
            description: "How the character relates to the listener in this specific beat — one of: confiding, warning, begging, commanding, protecting, confessing, blaming, manipulating, comforting, questioning",
          },
          trustLevel: {
            type: "number",
            description: "Character's trust in the listener at this moment: 0-1",
          },
          fearLevel: {
            type: "number",
            description: "Character's fear level at this moment: 0-1",
          },
          performanceStyle: {
            type: "string",
            description: "How the voice should sound — e.g. 'whispered calculation', 'panicked tracking', 'hollow grief', 'frozen terror', 'dissociated repetition'",
          },
          breathingPattern: {
            type: "string",
            enum: ["slow", "uneven", "shallow", "panic", "held", "none"],
          },
          speechBehavior: {
            type: "array",
            items: {
              type: "string",
              enum: [
                "whispered_confession", "panicked_report", "hollow_grief",
                "counting_aloud", "interrupts_self", "repeats_for_comfort",
                "lies", "confesses", "blames", "protects", "manipulates",
                "comforts", "hesitates", "commands", "question_with_no_answer",
              ],
            },
            description: "1-3 speech behaviors that define how this beat should be performed",
          },
          environmentalImportance: {
            type: "array",
            items: { type: "string" },
            description: "1-3 environmental elements that matter to this beat — what the listener should feel in the space",
          },
          sfxHint: {
            type: "string",
            description: "What sound effect should play at this beat — glass_break | footsteps | door_creak | sirens | none",
          },
          spatialZFrom: {
            type: "number",
            description: "Where the threat source is spatially at the beat's start. Negative = behind/away from listener. Use: downstairs far=-8, stairs=-5, landing=-2, bedroom door=-0.9, same room=0, receding=positive",
          },
          spatialZTo: {
            type: "number",
            description: "Where the threat source ends spatially. Same as from if stationary.",
          },
          spatialMovementMs: {
            type: "number",
            description: "How long the spatial movement takes in ms. 0 if stationary.",
          },
          spatialLabel: {
            type: "string",
            description: "What is making the spatial sound — e.g. 'footsteps downstairs', 'intruder on landing', 'sirens fading'",
          },
          textWithDirections: {
            type: "string",
            description: "The ElevenLabs voice text for this beat. Take companionVoiceText and add: one dominant v3 acting tag (<<whispering>> <<breathless>> <<gasping>> <<panicked>> <<crying>>), em-dash for abrupt cuts, ... for held pauses. Single dominant tag only — no tag switching. Example: '<<whispering>> They're in the house... I can hear them moving.'",
          },
          voiceStability: {
            type: "number",
            description: "ElevenLabs stability 0-1. MUST be >= 0.35 for any line with fragmented text or multiple short phrases (runaway prevention). High-panic beats: 0.35-0.55. Grief: 0.45-0.65. High-terror: 0.38-0.50.",
          },
          voiceStyle: {
            type: "number",
            description: "ElevenLabs style 0-1. 0=neutral, 1=maximum drama. Match to emotional intensity.",
          },
          voiceSpeed: {
            type: "number",
            description: "ElevenLabs speed 0.7-1.15. Panic: 0.95-1.05. Terror/frozen: 0.75-0.88. Grief: 0.72-0.84.",
          },
          voiceSimilarityBoost: {
            type: "number",
            description: "ElevenLabs similarity_boost 0-1. Lower for extreme moments (0.70-0.78). Higher for quiet moments (0.82-0.90).",
          },
          isChoiceMoment: {
            type: "boolean",
            description: "True ONLY for the final beat of a chapter that has a timed choice. Maximum one per chapter.",
          },
        },
        required: [
          "id", "beatIndex", "companionVoiceText", "tension", "silenceAfter",
          "silenceType", "proximity", "atmosphere", "characterObjective",
          "hiddenEmotion", "listenerRelationship", "trustLevel", "fearLevel",
          "performanceStyle", "breathingPattern", "speechBehavior",
          "environmentalImportance", "sfxHint", "spatialZFrom", "spatialZTo",
          "spatialMovementMs", "spatialLabel", "textWithDirections",
          "voiceStability", "voiceStyle", "voiceSpeed", "voiceSimilarityBoost",
          "isChoiceMoment",
        ],
      },
    },
  },
  required: ["beats"],
};

// ── DirectorProfile shape ────────────────────────────────────────────────────

/**
 * The full output of the Director Engine for one story.
 * This is what gets saved to src/data/directorProfiles/{storyKey}.json.
 *
 * @typedef {object} DirectorProfile
 * @property {string} schemaVersion
 * @property {string} storyKey
 * @property {string} title
 * @property {string} genre
 * @property {string} tone
 * @property {string} premise
 * @property {object} character
 * @property {string} listenerRole
 * @property {number} trustLevel
 * @property {string} trustArc
 * @property {object} emotionalArc
 * @property {object} spatialContext
 * @property {string} generatedBy
 * @property {string} generatedAt
 * @property {Record<string, { label: string, hasChoice: boolean, beats: object[] }>} chapters
 */
