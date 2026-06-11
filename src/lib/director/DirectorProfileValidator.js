// ===========================================================================
// DirectorProfileValidator — validates Director Engine output
//
// Validates a DirectorProfile against the expected schema. Used after
// generation to catch Gemini schema violations, stability floor breaches,
// and structural errors before the profile is committed to disk.
//
// Usage:
//   import { validateDirectorProfile } from "./DirectorProfileValidator.js";
//   const result = validateDirectorProfile(profile);
//   if (!result.valid) console.warn(result.errors);
// ===========================================================================

import { DIRECTOR_SCHEMA_VERSION, SILENCE_TYPES, PROXIMITY_LEVELS, BREATHING_PATTERNS } from "./DirectorSchema.js";

// ── Field validators ──────────────────────────────────────────────────────────

const REQUIRED_TOP_LEVEL = [
  "schemaVersion", "storyKey", "title", "genre", "tone", "premise",
  "character", "listenerRole", "trustLevel", "trustArc", "emotionalArc",
  "spatialContext", "generatedBy", "generatedAt", "chapters",
];

const REQUIRED_CHARACTER = ["name", "role", "primaryEmotion", "objective", "secret", "voiceArchetype"];
const REQUIRED_EMOTIONAL_ARC = ["opening", "escalation", "crisis", "aftermath"];
const REQUIRED_SPATIAL_CONTEXT = ["setting", "threatDirection", "approachPath"];

const REQUIRED_BEAT = [
  "id", "beatIndex", "companionVoiceText", "tension", "silenceAfter",
  "silenceType", "proximity", "characterObjective", "hiddenEmotion",
  "performanceStyle", "breathingPattern", "voiceStability", "voiceStyle",
  "voiceSpeed", "voiceSimilarityBoost", "isChoiceMoment",
];

// ── Stability check ────────────────────────────────────────────────────────────

const STABILITY_FLOOR = 0.35;

function isFragmented(text) {
  // Fragmented text: multiple short phrases, em-dashes, or 3+ segments
  return (text.match(/—|\.\.\./g) || []).length >= 2
    || text.split(/[.!?]/).filter(s => s.trim()).length >= 3;
}

// ── Main validator ────────────────────────────────────────────────────────────

/**
 * Validate a DirectorProfile.
 * @param {object} profile
 * @returns {{ valid: boolean, errors: string[], warnings: string[], beatCount: number, chapterCount: number }}
 */
export function validateDirectorProfile(profile) {
  const errors   = [];
  const warnings = [];

  if (!profile || typeof profile !== "object") {
    return { valid: false, errors: ["Profile is null or not an object"], warnings: [], beatCount: 0, chapterCount: 0 };
  }

  // Schema version
  if (profile.schemaVersion !== DIRECTOR_SCHEMA_VERSION) {
    warnings.push(`schemaVersion "${profile.schemaVersion}" !== expected "${DIRECTOR_SCHEMA_VERSION}"`);
  }

  // Top-level required fields
  for (const f of REQUIRED_TOP_LEVEL) {
    if (profile[f] == null) errors.push(`Missing top-level field: ${f}`);
  }

  // Character
  if (profile.character && typeof profile.character === "object") {
    for (const f of REQUIRED_CHARACTER) {
      if (!profile.character[f]) errors.push(`character.${f} is empty or missing`);
    }
  }

  // listenerRole
  if (profile.listenerRole && !profile.listenerRole.toLowerCase().includes("you")) {
    warnings.push(`listenerRole does not use second-person "you": "${profile.listenerRole.slice(0, 60)}"`);
  }

  // trustLevel
  if (profile.trustLevel != null && (profile.trustLevel < 0 || profile.trustLevel > 1)) {
    errors.push(`trustLevel out of range [0,1]: ${profile.trustLevel}`);
  }

  // emotionalArc
  if (profile.emotionalArc && typeof profile.emotionalArc === "object") {
    for (const f of REQUIRED_EMOTIONAL_ARC) {
      if (!profile.emotionalArc[f]) warnings.push(`emotionalArc.${f} is empty`);
    }
  }

  // spatialContext
  if (profile.spatialContext && typeof profile.spatialContext === "object") {
    for (const f of REQUIRED_SPATIAL_CONTEXT) {
      if (!profile.spatialContext[f]) warnings.push(`spatialContext.${f} is empty`);
    }
  }

  // chapters
  if (!profile.chapters || typeof profile.chapters !== "object" || !Object.keys(profile.chapters).length) {
    errors.push("chapters is empty or missing");
    return { valid: errors.length === 0, errors, warnings, beatCount: 0, chapterCount: 0 };
  }

  let beatCount = 0;
  let choiceCount = 0;

  for (const [chIdx, chapter] of Object.entries(profile.chapters)) {
    if (!chapter.beats?.length) {
      errors.push(`chapter ${chIdx} has no beats`);
      continue;
    }

    let chapterChoiceCount = 0;

    for (const beat of chapter.beats) {
      beatCount++;
      const loc = `ch${chIdx}/${beat.id || `beat[${beat.beatIndex}]`}`;

      // Required fields
      for (const f of REQUIRED_BEAT) {
        if (beat[f] == null) errors.push(`${loc}: missing field "${f}"`);
      }

      // Stability floor — the critical runaway prevention check
      if (beat.voiceStability != null && beat.voiceStability < STABILITY_FLOOR) {
        errors.push(`${loc}: voiceStability ${beat.voiceStability} < ${STABILITY_FLOOR} (runaway risk)`);
      }

      // Fragmented text stability cross-check
      if (beat.textWithDirections && beat.voiceStability != null) {
        if (isFragmented(beat.textWithDirections) && beat.voiceStability < 0.40) {
          warnings.push(`${loc}: fragmented text with stability ${beat.voiceStability} — consider >= 0.40`);
        }
      }

      // Tension range
      if (beat.tension != null && (beat.tension < 0 || beat.tension > 100)) {
        errors.push(`${loc}: tension ${beat.tension} out of range [0, 100]`);
      }

      // Silence type
      if (beat.silenceType && !SILENCE_TYPES.includes(beat.silenceType)) {
        warnings.push(`${loc}: unknown silenceType "${beat.silenceType}"`);
      }

      // Proximity
      if (beat.proximity && !PROXIMITY_LEVELS.includes(beat.proximity)) {
        warnings.push(`${loc}: unknown proximity "${beat.proximity}"`);
      }

      // Breathing
      if (beat.breathingPattern && !BREATHING_PATTERNS.includes(beat.breathingPattern)) {
        warnings.push(`${loc}: unknown breathingPattern "${beat.breathingPattern}"`);
      }

      // companionVoiceText should be first-person / second-person (rough heuristic)
      if (beat.companionVoiceText) {
        const text = beat.companionVoiceText.toLowerCase();
        const hasFirstPerson = /\b(i |i'm|i've|i'll|i'd|my |we |our )\b/.test(text);
        if (!hasFirstPerson) {
          warnings.push(`${loc}: companionVoiceText may not be first-person: "${beat.companionVoiceText.slice(0, 50)}"`);
        }
      }

      // textWithDirections tag check — no tag switching
      if (beat.textWithDirections) {
        const tagMatches = beat.textWithDirections.match(/<<[^>]+>>/g) || [];
        const uniqueTags = new Set(tagMatches);
        if (uniqueTags.size > 1) {
          warnings.push(`${loc}: multiple acting tags found (runaway risk): ${[...uniqueTags].join(", ")}`);
        }
      }

      // isChoiceMoment: max 1 per chapter
      if (beat.isChoiceMoment) {
        chapterChoiceCount++;
        choiceCount++;
      }
    }

    if (chapterChoiceCount > 1) {
      errors.push(`chapter ${chIdx}: ${chapterChoiceCount} isChoiceMoment=true beats (max 1 per chapter)`);
    }
  }

  const chapterCount = Object.keys(profile.chapters).length;

  return {
    valid:       errors.length === 0,
    errors,
    warnings,
    beatCount,
    chapterCount,
  };
}

/**
 * Format a validation result as a human-readable summary string.
 */
export function formatValidationReport(validation, storyKey) {
  const { valid, errors, warnings, beatCount, chapterCount } = validation;
  const lines = [
    `── ${storyKey} ──`,
    `  ${chapterCount} chapters, ${beatCount} beats`,
    `  Status: ${valid ? "VALID ✓" : "INVALID ✗"}`,
  ];
  if (errors.length)   lines.push(`  Errors (${errors.length}):\n` + errors.map(e => `    ✗ ${e}`).join("\n"));
  if (warnings.length) lines.push(`  Warnings (${warnings.length}):\n` + warnings.map(w => `    ⚠ ${w}`).join("\n"));
  return lines.join("\n");
}
