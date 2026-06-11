// ===========================================================================
// generateDirectorProfile — top-level pipeline entry point
//
// Input:  raw story submission from a creator
// Output: DirectorProfile JSON saved to src/data/directorProfiles/{storyKey}.json
//
// This is the function called after a creator uploads a story.
// It orchestrates the Director Engine and writes the output to disk.
//
// Usage:
//   import { generateDirectorProfile } from "../lib/director/generateDirectorProfile.js";
//   const { profile, outputPath, validation } = await generateDirectorProfile({ storyKey, title, genre, description, chapters });
// ===========================================================================

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { directorEngine, DirectorEngine } from "./DirectorEngine.js";
import { validateDirectorProfile } from "./DirectorProfileValidator.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROFILES_DIR = path.resolve(__dirname, "../../data/directorProfiles");

/**
 * Run the full Director pipeline for a story submission.
 *
 * @param {{
 *   storyKey:    string,   — unique story identifier (slug-safe, e.g. "the_call")
 *   title:       string,   — human-readable story title
 *   genre?:      string,   — creator-specified genre hint (optional)
 *   description?: string,  — creator-written description (optional)
 *   chapters:    Array<{
 *     text:       string,  — raw story text for this chapter
 *     hasChoice?: boolean, — whether this chapter ends with a timed choice (default true)
 *   }>,
 * }} input
 *
 * @returns {Promise<{
 *   profile:     DirectorProfile,
 *   outputPath:  string,
 *   validation:  ValidationResult,
 *   beatManifest: object,
 *   performanceScript: object,
 * }>}
 */
export async function generateDirectorProfile({ storyKey, title, genre, description, chapters }) {
  if (!storyKey) throw new Error("storyKey is required");
  if (!title)    throw new Error("title is required");
  if (!chapters?.length) throw new Error("chapters array must have at least one entry");

  // Run Director Engine
  const profile = await directorEngine.analyze({ storyKey, title, genre, description, chapters });

  // Validate
  const validation = validateDirectorProfile(profile);
  if (!validation.valid) {
    const errors = validation.errors.slice(0, 5).join("; ");
    process.stderr.write(`[Director] Validation warnings: ${errors}\n`);
  }

  // Persist profile
  fs.mkdirSync(PROFILES_DIR, { recursive: true });
  const outputPath = path.join(PROFILES_DIR, `${storyKey}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(profile, null, 2));
  process.stdout.write(`[Director] Saved → ${outputPath}\n`);

  // Derive downstream artifacts
  const beatManifest      = DirectorEngine.toBeatManifest(profile);
  const performanceScript = DirectorEngine.toPerformanceScript(profile);

  return { profile, outputPath, validation, beatManifest, performanceScript };
}
