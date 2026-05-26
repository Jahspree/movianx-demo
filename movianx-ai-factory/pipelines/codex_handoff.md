# Codex Ingestion Pipeline — Handoff Specification

**Factory:** Movianx Autonomous Media Factory  
**Target:** Movianx Codex ingestion system  
**Version:** 1.0  
**Date:** 2026-05-26

## Purpose
This document defines the contract between the Autonomous Media Factory and Codex so that generated cinematic assets flow automatically into Movianx production surfaces (rails, hero modules, creator worlds, recommendation engines, etc.).

## Directory Contract

Approved assets live here (after passing quality filter):
/movianx-ai-factory/approved-assets/{category}/{filename}

Corresponding metadata lives here:
/movianx-ai-factory/metadata/assets/{asset-id}.json

## Expected Codex Behavior on Handoff

Codex will:
1. Scan /approved-assets for new files since last ingest timestamp.
2. Read paired metadata JSON for each asset.
3. Map asset → Movianx entity:
   - movie-poster / cinematic-still → title page hero or rail card
   - rail-art / thumbnail → specific rail (e.g. "horror-rails", "dark-sci-fi-discover")
   - hero-backgrounds → homepage or world landing cinematic backdrop
   - creator-worlds / music → creator profile banner + world atmosphere
4. Update creator world density and emotional tagging for discovery.
5. Mark asset as "deployed" and move or tag in factory (optional archival step).
6. Trigger any production cache invalidation or CDN purge.

## Asset Metadata Schema (Required for Codex)

See metadata/asset_index.json and individual per-asset JSONs for full shape.
Minimum fields Codex requires:
- id
- title
- category
- emotional_category
- genre
- atmospheric_profile
- recommendation_tags (array)
- rail_assignment (or multiple)
- creator_identity
- source_file (factory relative path)
- approved_at
- prompt_signature (for traceability)

## File Naming (Stable)

Factory guarantees stable, sortable names. Codex may re-key on ingest.

## Rejection & Rollback

If an asset is later found to violate style bible after handoff, factory will:
- Move from approved-assets to rejected-assets
- Write a correction note in metadata
- Codex should support soft-delete or unpublish on re-ingest signal.

## Current Status

**Factory initialized and operational.** First autonomous production cycle (001) completed 2026-05-26.

**Cycle 001 Deliverables (all passed strict quality filter + style bible):**
- 1× Psychological Horror movie poster — "The Hollowing Signal" (horror-rails)
- 1× Dark Sci-Fi hero backdrop — "Veil of Static" (featured-home-hero)
- 1× Ambient Music World visual — "The Quiet Frequency" by Elias Voss (music-worlds-rail)

**Approved assets in factory:** 3  
**Cumulative quality pass rate:** 100%  
**Codex handoff:** NOT YET TRIGGERED (target: 12+ assets across categories for meaningful ecosystem density per factory charter).

Next cycles will continue generating rail thumbnails, creator-world banners, emotional drama stills, and additional hero variations until density target is reached, at which point a batch handoff to Codex will be executed.

See:
- /logs/cycle-001-first-production.log
- /metadata/asset_index.json
- /metadata/assets/*.json for full per-asset details.

## Contact / Ownership

This pipeline is owned by the Movianx Autonomous Media Factory Runtime.
Any changes to this contract require update to both this file and the Codex ingestion code.

---
End of handoff specification.
