# Movianx Autonomous Media Factory — Validation Batch 001 Plan

**Type:** CONTROLLED VALIDATION BATCH (NOT mass generation)  
**Date:** 2026-05-26  
**Objective:** Prove complete end-to-end autonomous pipeline integrity: Generation → Visual QA → Metadata → Categorization → Approval → Handoff Prep.  
**Constraint:** Maximum 5 worlds × 5 assets = 25 images. No flooding. Every asset individually inspected.

---

## Baseline at Start of Validation
- Existing approved assets: 3 (from Cycle 001)
- Existing prompt signatures tracked: 3
- Rejected: 0
- Generated staging: 0
- Codex handoff ready: false (target 12+)

All new signatures must be unique vs. the 3 existing ones.

---

## The 5 Cinematic Worlds

### 1. Psychological Horror
- **Title:** The Weight of Silence
- **Creator Identity:** Mara Kaine
- **Emotional Profile:** oppressive, suffocating quiet, guilt, isolation, psychological weight
- **Genre:** Psychological Horror
- **Primary Rail:** horror-rails-deep
- **Atmosphere Tags:** silence, guilt, decaying domestic, low-key practical light, negative space

### 2. Dark Sci-Fi
- **Title:** The Event Horizon Choir
- **Creator Identity:** Dr. Liora Kane
- **Emotional Profile:** cosmic loneliness, quantum dread, elegiac wonder, vast emptiness
- **Genre:** Dark Sci-Fi / Existential
- **Primary Rail:** dark-sci-fi-rails
- **Atmosphere Tags:** cosmic scale, quantum phenomena, abandoned megastructures, melancholic beauty

### 3. Emotional Drama
- **Title:** Letters Never Sent
- **Creator Identity:** Elias Rowe
- **Emotional Profile:** quiet heartbreak, memory, forgiveness, human warmth in decay, melancholic intimacy
- **Genre:** Emotional Drama
- **Primary Rail:** drama-rails-intimate
- **Atmosphere Tags:** lived-in spaces, window light, rain, handwritten objects, emotional micro-detail

### 4. Atmospheric Thriller
- **Title:** The Perimeter Line
- **Creator Identity:** Jonah Slate
- **Emotional Profile:** paranoia, liminal spaces, slow-building tension, rural isolation, unreliable perception
- **Genre:** Atmospheric Thriller
- **Primary Rail:** thriller-rails
- **Atmosphere Tags:** fog, empty roads, rural decay, surveillance, liminal Americana

### 5. Immersive Soundscape
- **Title:** Frequencies of the Forgotten
- **Creator Identity:** The Archivists (sound artist: Kael Vey)
- **Emotional Profile:** synesthetic memory, dreamlike resonance, melancholy beauty, sound as place
- **Genre:** Immersive Ambient / Cinematic Sound World
- **Primary Rail:** music-worlds-immersive
- **Atmosphere Tags:** synesthesia, resonance, forgotten archives, soft light through haze, musical architecture

---

## Asset Types Per World (5 × 5 = 25)

For every world the following 5 asset types will be generated with **unique compositions, lighting, color temperature, and framing** (no repetition across the batch):

1. **poster** — Vertical cinematic poster (2:3). Environmental storytelling dominant. Title never literal floating text unless diegetic.
2. **cinematic-backdrop** — Wide immersive hero (16:9 or 2:1). Vast environmental scale.
3. **rail-thumbnail** — Tighter 16:9 or 4:3 composition optimized for rail cards. Strong focal point + mood.
4. **creator-banner** — Wide 2:1 or 3:2. Symbolic of the creator/world without being a portrait. Often includes subtle signature objects or environments.
5. **atmospheric-still** — More intimate 4:3 or 3:2. Micro-detail, texture, emotional residue. "The moment between moments."

---

## Duplicate Prevention (Enforced)
- All 25 prompts will produce normalized signatures checked against the 3 existing signatures in asset_index.json before generation.
- If any risk of repetition in style/composition, prompt will be rewritten on the fly.

---

## Quality Filter (Same as Style Bible)
Every single image will be:
1. Generated
2. Located on disk
3. Visually inspected via `read_file` (multimodal description)
4. Scored against the full style bible (no malformed anatomy, no muddy lighting, no repetitive framing, no low detail, no generic AI look, no oversharpening, strong emotional match)
5. Only then moved to approved or rejected.

---

## Execution Rules for This Validation
- Generate in small controlled batches (max 3–4 images per wave).
- Full visual QA + decision before next wave.
- No skipping inspection.
- All naming follows exact convention: `{category}_{emotional-key}_{world-slug}_{YYYYMMDDTHHMMSSZ}_{shortid}.{ext}`
- Metadata written for each world + individual assets.
- Central registry updated after each approved asset or at logical checkpoints.
- Final mandatory command: `find /movianx-ai-factory -type f`

---

## Success Criteria for Validation
The pipeline is considered validated only if:
- All 25 (or fewer if any rejected) files exist in correct locations
- Metadata is complete and queryable
- Approved vs Rejected separation is proven
- No duplicate signatures
- No quality issues slipped through
- Full traceability from generation to handoff prep exists in logs and JSON

**Status:** Plan written. Awaiting controlled execution.

---
*This is a validation test, not a content drop. Integrity > quantity.*
