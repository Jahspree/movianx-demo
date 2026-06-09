/**
 * Gemini 2.5 Flash — Content Analysis Service
 *
 * Provides structured AI analysis of content metadata.
 * Requires GEMINI_API_KEY in the server environment.
 * Never expose this module to the browser (no NEXT_PUBLIC_ prefix).
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL = "gemini-2.5-flash";

/**
 * JSON response schema for structured output.
 * Matches the ExperienceProfile shape expected by downstream consumers.
 */
const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    genre: {
      type: "string",
      description:
        "Primary content genre, e.g. horror, thriller, drama, romance, action, sci_fi, music, documentary",
    },
    tone: {
      type: "string",
      description:
        "Dominant emotional tone the viewer experiences, e.g. dread, wonder, intimate, kinetic, surreal, melancholic",
    },
    themes: {
      type: "array",
      items: { type: "string" },
      description: "3 to 6 primary themes present in the content",
    },
    audience: {
      type: "string",
      description:
        "Target audience description, e.g. 'premium thriller fans', 'family audience', 'horror enthusiasts'",
    },
    emotionalProfile: {
      type: "string",
      description:
        "One sentence describing the emotional experience this content creates for the viewer",
    },
    intensity: {
      type: "number",
      description:
        "Intensity score: 1 = mild / atmospheric, 2 = moderate tension, 3 = high intensity / disturbing",
    },
    adSuitability: {
      type: "object",
      properties: {
        score: {
          type: "number",
          description:
            "Brand-safety score 0–100 (100 = fully brand-safe, 0 = not suitable for advertising)",
        },
        flags: {
          type: "array",
          items: { type: "string" },
          description:
            "Content flags that affect ad suitability, e.g. 'violence', 'adult_themes', 'profanity', 'disturbing_imagery'",
        },
      },
      required: ["score", "flags"],
    },
  },
  required: [
    "genre",
    "tone",
    "themes",
    "audience",
    "emotionalProfile",
    "intensity",
    "adSuitability",
  ],
};

/**
 * Build the analysis prompt from content metadata.
 */
function buildPrompt({ title, description, tags, genre, contentFormat }) {
  const tagList = Array.isArray(tags) && tags.length ? tags.join(", ") : "none";
  return `You are an expert content analyst for Movianx, a premium cinematic streaming platform. Analyze the following content metadata and return a precise structured analysis.

Content Details:
- Title: ${title}
- Genre (creator-specified): ${genre || "not specified"}
- Format: ${contentFormat || "not specified"}
- Tags: ${tagList}
- Description: ${description || "not provided"}

Instructions:
1. Identify the most accurate primary genre based on all provided metadata
2. Identify the dominant emotional tone a viewer would experience
3. List 3 to 6 specific themes present in the content (be concrete, not generic)
4. Describe the target audience
5. Write one sentence describing the emotional experience this content creates
6. Score intensity 1-3 (1=atmospheric/mild, 2=moderate tension, 3=high intensity)
7. Score ad suitability 0-100 (100=fully brand-safe) and list specific content flags if any

Respond ONLY with valid JSON matching the schema. Do not include explanations outside the JSON.`;
}

/**
 * Analyze content metadata using Gemini 2.5 Flash with structured JSON output.
 *
 * @param {{
 *   title: string,
 *   description?: string,
 *   tags?: string[],
 *   genre?: string,
 *   contentFormat?: string,
 * }} input
 * @returns {Promise<{
 *   genre: string,
 *   tone: string,
 *   themes: string[],
 *   audience: string,
 *   emotionalProfile: string,
 *   intensity: number,
 *   adSuitability: { score: number, flags: string[] },
 * }>}
 * @throws {Error} if GEMINI_API_KEY is not set or Gemini returns an error
 */
export async function analyzeContent(input = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. " +
        "Add it to .env.local for local development or to Vercel Environment Variables for production. " +
        "The key must never be committed to source control."
    );
  }

  const {
    title = "Untitled",
    description = "",
    tags = [],
    genre = "",
    contentFormat = "",
  } = input;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  const prompt = buildPrompt({ title, description, tags, genre, contentFormat });
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(
      `Gemini returned non-JSON response. First 200 chars: ${text.slice(0, 200)}`
    );
  }

  // Clamp intensity to integer 1-3
  parsed.intensity = Math.min(3, Math.max(1, Math.round(Number(parsed.intensity) || 1)));

  // Clamp adSuitability score to 0-100
  if (parsed.adSuitability) {
    parsed.adSuitability.score = Math.min(
      100,
      Math.max(0, Math.round(Number(parsed.adSuitability.score) || 0))
    );
    parsed.adSuitability.flags = Array.isArray(parsed.adSuitability.flags)
      ? parsed.adSuitability.flags
      : [];
  }

  return parsed;
}

/**
 * Returns true if GEMINI_API_KEY is present in the server environment.
 * Use this to choose between AI and fallback paths without throwing.
 */
export function hasGeminiConfig() {
  return Boolean(process.env.GEMINI_API_KEY);
}
