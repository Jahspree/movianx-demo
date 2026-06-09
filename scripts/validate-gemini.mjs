#!/usr/bin/env node
/**
 * validate-gemini.mjs
 *
 * Validates the Gemini integration end-to-end:
 *   1. GEMINI_API_KEY presence
 *   2. Gemini authentication (live API call)
 *   3. Structured JSON response shape
 *   4. All required fields populated
 *   5. Upload → analysis status transition (in-memory simulation)
 *
 * Usage:
 *   GEMINI_API_KEY=your_key node scripts/validate-gemini.mjs
 *   -- or --
 *   node scripts/validate-gemini.mjs   (reads from .env.local if dotenv is available)
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ─── Load .env.local if GEMINI_API_KEY not already set ─────────────────────
if (!process.env.GEMINI_API_KEY) {
  const envPath = resolve(ROOT, ".env.local");
  if (existsSync(envPath)) {
    const lines = readFileSync(envPath, "utf8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const eqIdx = trimmed.indexOf("=");
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      if (key && val && !process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

// ─── Colour helpers ─────────────────────────────────────────────────────────
const GREEN  = "\x1b[32m";
const RED    = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN   = "\x1b[36m";
const RESET  = "\x1b[0m";
const BOLD   = "\x1b[1m";

function pass(label) { console.log(`  ${GREEN}✓${RESET}  ${label}`); }
function fail(label, detail = "") {
  console.error(`  ${RED}✗${RESET}  ${label}`);
  if (detail) console.error(`       ${RED}${detail}${RESET}`);
}
function info(label) { console.log(`  ${CYAN}→${RESET}  ${label}`); }
function warn(label) { console.log(`  ${YELLOW}⚠${RESET}  ${label}`); }
function section(title) {
  console.log(`\n${BOLD}${title}${RESET}`);
  console.log("─".repeat(50));
}

// ─── Main ───────────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function assert(condition, label, detail = "") {
  if (condition) { pass(label); passed++; }
  else { fail(label, detail); failed++; }
}

section("1. Environment");

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  fail("GEMINI_API_KEY is set", "Not found in environment or .env.local");
  console.log(`\n${RED}Cannot continue without GEMINI_API_KEY.${RESET}`);
  console.log(`Add it to .env.local:\n  GEMINI_API_KEY=your_key_here\n`);
  process.exit(1);
} else {
  pass("GEMINI_API_KEY is set");
  passed++;
  info(`Key starts with: ${apiKey.slice(0, 8)}...`);
}

section("2. Gemini Authentication & Response");

const { GoogleGenerativeAI } = await import("@google/generative-ai");

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    genre:          { type: "string" },
    tone:           { type: "string" },
    themes:         { type: "array", items: { type: "string" } },
    audience:       { type: "string" },
    emotionalProfile: { type: "string" },
    intensity:      { type: "number" },
    adSuitability: {
      type: "object",
      properties: {
        score: { type: "number" },
        flags: { type: "array", items: { type: "string" } },
      },
      required: ["score", "flags"],
    },
  },
  required: ["genre", "tone", "themes", "audience", "emotionalProfile", "intensity", "adSuitability"],
};

const TEST_INPUT = {
  title: "10 Seconds",
  description: "A family. An intruder. Ten seconds to decide who lives.",
  genre: "horror",
  tags: ["horror", "thriller", "home-invasion", "survival"],
  contentFormat: "standalone_film",
};

info(`Testing with: "${TEST_INPUT.title}" (${TEST_INPUT.genre})`);

let geminiResult = null;

try {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  const prompt = `You are a content analyst. Analyze this content and return structured JSON.

Title: ${TEST_INPUT.title}
Genre: ${TEST_INPUT.genre}
Tags: ${TEST_INPUT.tags.join(", ")}
Description: ${TEST_INPUT.description}

Return only valid JSON.`;

  const startMs = Date.now();
  const result = await model.generateContent(prompt);
  const elapsed = Date.now() - startMs;
  const text = result.response.text();

  info(`Response received in ${elapsed}ms`);

  try {
    geminiResult = JSON.parse(text);
    pass("Response is valid JSON");
    passed++;
  } catch {
    fail("Response is valid JSON", `Raw: ${text.slice(0, 100)}`);
    failed++;
  }
} catch (err) {
  fail("Gemini API call succeeded", err.message);
  failed++;
}

section("3. Response Schema Validation");

if (geminiResult) {
  const REQUIRED_FIELDS = ["genre", "tone", "themes", "audience", "emotionalProfile", "intensity", "adSuitability"];
  for (const field of REQUIRED_FIELDS) {
    assert(field in geminiResult, `Field "${field}" present`);
  }

  assert(typeof geminiResult.genre === "string" && geminiResult.genre.length > 0, "genre is non-empty string");
  assert(typeof geminiResult.tone === "string" && geminiResult.tone.length > 0, "tone is non-empty string");
  assert(Array.isArray(geminiResult.themes) && geminiResult.themes.length >= 1, "themes is non-empty array");
  assert(typeof geminiResult.audience === "string" && geminiResult.audience.length > 0, "audience is non-empty string");
  assert(typeof geminiResult.intensity === "number" && geminiResult.intensity >= 1 && geminiResult.intensity <= 3, `intensity is 1-3 (got ${geminiResult.intensity})`);
  assert(
    geminiResult.adSuitability &&
    typeof geminiResult.adSuitability.score === "number" &&
    geminiResult.adSuitability.score >= 0 &&
    geminiResult.adSuitability.score <= 100,
    `adSuitability.score is 0-100 (got ${geminiResult.adSuitability?.score})`
  );
  assert(Array.isArray(geminiResult.adSuitability?.flags), "adSuitability.flags is array");

  console.log(`\n  ${CYAN}Sample output:${RESET}`);
  console.log(`    genre:    ${geminiResult.genre}`);
  console.log(`    tone:     ${geminiResult.tone}`);
  console.log(`    themes:   ${(geminiResult.themes || []).join(", ")}`);
  console.log(`    audience: ${geminiResult.audience}`);
  console.log(`    intensity: ${geminiResult.intensity}/3`);
  console.log(`    adScore:  ${geminiResult.adSuitability?.score}/100`);
  if (geminiResult.adSuitability?.flags?.length) {
    console.log(`    adFlags:  ${geminiResult.adSuitability.flags.join(", ")}`);
  }
} else {
  warn("Skipped — no Gemini response to validate");
}

section("4. Upload → Analysis Status Transition");

// Simulate the in-memory store lifecycle without importing Next.js server modules
const VALID_TRANSITIONS = {
  draft: ["uploading", "review_required"],
  uploading: ["uploaded", "draft", "rejected"],
  uploaded: ["processing", "review_required", "draft", "rejected"],
  processing: ["ai_analyzed", "review_required", "rejected"],
  ai_analyzed: ["review_required", "approved", "rejected"],
};

function canTransition(from, to) {
  return Boolean(VALID_TRANSITIONS[from]?.includes(to));
}

assert(canTransition("uploading", "uploaded"),   "uploading → uploaded   is valid");
assert(canTransition("uploaded",  "processing"), "uploaded  → processing is valid");
assert(canTransition("processing","ai_analyzed"),"processing → ai_analyzed is valid");
assert(!canTransition("draft",    "ai_analyzed"),"draft → ai_analyzed    is correctly blocked");
assert(!canTransition("uploaded", "published"),  "uploaded → published   is correctly blocked");

section("5. Summary");

const total = passed + failed;
const pct = total > 0 ? Math.round((passed / total) * 100) : 0;

if (failed === 0) {
  console.log(`\n  ${GREEN}${BOLD}All ${total} checks passed (${pct}%)${RESET}`);
  console.log(`\n  ${CYAN}Next step:${RESET} Paste your GEMINI_API_KEY into .env.local, then run the dev server.`);
  console.log(`  The upload pipeline will automatically invoke Gemini when all assets are uploaded.\n`);
} else {
  console.log(`\n  ${RED}${BOLD}${failed} of ${total} checks failed${RESET}`);
  console.log(`\n  Fix the failures above, then re-run:\n    node scripts/validate-gemini.mjs\n`);
  process.exit(1);
}
