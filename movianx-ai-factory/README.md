# Movianx Autonomous Media Factory Runtime

**Status:** OPERATIONAL  
**Initialized:** 2026-05-26T00:24:35Z  
**Physical Root:** /Users/jahspringer/movianx-ai-factory  
**Logical Root (per mission):** /movianx-ai-factory  
**Runtime Agent:** Grok 4.3 (xAI) — Movianx Media Factory Mode

## Mission
Continuously generate, organize, and prepare cinematic assets for automatic integration into Movianx.  
This is a **production media pipeline**, not a browser workflow.

## Primary Responsibilities
1. Generate cinematic assets (posters, stills, backdrops, banners, rail art, thumbnails, music worlds, hero visuals)
2. Save assets locally into the factory
3. Categorize by content type and emotional profile
4. Prevent duplicates via prompt signatures + asset index
5. Maintain strict style consistency (cinematic, premium, filmic, atmospheric)
6. Enforce quality filter — auto-reject malformed/low-detail outputs
7. Attach rich metadata (title, creator, emotional tags, rail assignment, genre, atmospheric profile)
8. Prepare approved assets for Codex ingestion pipeline
9. Populate Movianx ecosystem density so the platform feels alive, active, immersive, and emotionally cinematic

## Directory Structure
```
/movianx-ai-factory
├── generated-assets/
│   ├── movies/
│   ├── stories/
│   ├── music/
│   ├── creator-worlds/
│   ├── thumbnails/
│   ├── rail-art/
│   └── hero-backgrounds/
├── approved-assets/          (mirrors category structure)
├── rejected-assets/          (mirrors category structure)
├── metadata/
│   ├── asset_index.json
│   ├── pipeline_state.json
│   └── asset_schema.json
├── logs/
├── pipelines/
│   └── codex_handoff.md
└── README.md
```

## Style Bible (Enforced)
All outputs MUST feel:
- cinematic
- premium
- emotionally immersive
- moody
- filmic
- atmospheric
- realistic
- artistically curated

Forbidden:
- generic AI look
- repetitive compositions
- fake HDR glow / over-sharpening
- cyberpunk overload
- low-detail / AI slop

## Emotional Matching
- Psychological Horror → oppressive, isolated, dread-filled, cinematic darkness
- Emotional Drama → intimate, human, warm, melancholic
- Dark Sci-Fi → atmospheric, mysterious, volumetric, immersive
- Music Worlds → ambient, dreamlike, emotionally rhythmic

## Pipeline Handoff
Approved assets in `/approved-assets/...` + corresponding JSON in `/metadata/` are ready for Codex ingestion.

Codex will:
- Map assets into Movianx CMS
- Populate rails and recommendation surfaces
- Update creator worlds
- Deploy production changes

## Current Run
See `metadata/pipeline_state.json` and `logs/`.

This factory is self-documenting and autonomous. The runtime (this agent session) owns generation, QA, organization, and handoff prep.

---
*Movianx Autonomous Media Factory — making the ecosystem feel alive.*
