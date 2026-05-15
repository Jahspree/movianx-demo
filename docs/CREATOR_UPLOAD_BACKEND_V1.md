# Creator Upload Backend V1

## Purpose

This phase adds the first creator-first backend foundation for Movianx movie and media uploads. It is intentionally small: secure upload intent creation, private storage abstraction, content metadata, review status, AI analysis placeholders, monetization fields, audit logging, and dashboard routes.

The legacy interactive demo remains separate from this dashboard foundation.

## Routes

Dashboard routes:

- `/dashboard`
- `/dashboard/upload`
- `/dashboard/content`
- `/dashboard/content/[id]`
- `/dashboard/review-status`
- `/dashboard/analytics`
- `/dashboard/monetization`

API routes:

- `POST /api/uploads/create`
- `POST /api/uploads/complete`
- `PUT /api/uploads/mock-signed/[token]`
- `GET /api/content`
- `GET /api/content/[id]`
- `PATCH /api/content/[id]`
- `POST /api/content/[id]/submit-review`
- `GET /api/content/[id]/analysis`

## Architecture

- `src/lib/creator/validation.js` validates metadata, file type, size, filenames, tags, and status transitions.
- `src/lib/creator/storage.js` creates UUID-based private storage paths and signed upload target descriptors.
- `src/lib/creator/contentStore.js` provides a temporary in-memory content store for Phase 1.
- `src/lib/creator/auditLog.js` records security-relevant actions without sensitive upload tokens.
- `src/lib/creator/auth.js` provides a least-privilege auth placeholder that can require a creator identity header.
- `src/lib/creator/types.js` defines the Phase 1 domain shape.

## Environment Variables

Current local/dev behavior uses mock signed upload URLs unless real storage is configured.

Required later for Google Cloud Storage:

- `GOOGLE_CLOUD_PROJECT`
- `GCS_UPLOAD_BUCKET`
- `GOOGLE_APPLICATION_CREDENTIALS` or workload identity credentials
- `GOOGLE_CLOUD_CLIENT_EMAIL` when using service account JSON from environment
- `GOOGLE_CLOUD_PRIVATE_KEY` when using service account JSON from environment

Optional:

- `MOCK_SIGNED_UPLOADS=false` to require real signed upload URL generation once implemented.
- `REQUIRE_CREATOR_AUTH=true` to reject requests without creator identity headers.

## Google Cloud Setup Steps

1. Create a private Google Cloud Storage bucket.
2. Disable public access and enforce uniform bucket-level access.
3. Create a service account with the minimum permissions required to create signed upload URLs.
4. Restrict signed URLs to `PUT`, exact content type, and a short expiration window.
5. Add malware/security scanning after upload completion before review submission.
6. Store object paths only; never expose raw bucket public URLs to the client.

## Security Controls

- File type allowlist by asset role.
- Max file size limits by asset role.
- Filename sanitization.
- UUID-based storage paths.
- Private storage path pattern.
- Mock signed upload URL pattern in development.
- Server-side validation for create, complete, patch, and review submission.
- Audit logs for upload creation, completion, mock upload, content patch, and review submission.
- No secrets are sent to the client.
- No direct public file access is assumed.
- Raw user filenames are not used in storage paths.
- Unsafe HTML rendering is not used in the dashboard.

## Content Statuses

- `draft`
- `uploading`
- `uploaded`
- `processing`
- `ai_analyzed`
- `review_required`
- `approved`
- `published`
- `rejected`

## AI Analysis Placeholder

No expensive AI runs in Phase 1. The analysis route returns a placeholder job with pending tasks:

- genre detection
- tone analysis
- audio analysis
- subtitle generation
- immersive audio mapping
- ad suitability

Future pipeline:

1. Trigger analysis after upload completion.
2. Run security scan first.
3. Extract technical metadata.
4. Generate subtitles.
5. Analyze content tone, genre, pacing, and ad suitability.
6. Prepare immersive audio mapping suggestions.
7. Store results for review and creator feedback.

## Ads And Monetization Foundation

The data model includes:

- `adSupportedEligible`
- `adSuitabilityScore`
- `monetizationStatus`
- `revenueShareTier`
- `estimatedViews`
- `estimatedRevenue`

No ad network is integrated in Phase 1.

Future ads pipeline:

1. Require content approval.
2. Require ad suitability analysis.
3. Assign monetization status.
4. Estimate views and revenue.
5. Connect to ad decisioning only after compliance review.

## Known Limitations

- Content storage is in-memory for Phase 1 and is not durable across server restarts.
- Mock signed upload URLs accept `PUT` but do not persist uploaded bytes.
- Real Google Cloud signed URL generation is abstracted but not wired to a cloud SDK yet.
- Authentication is a placeholder and should be replaced by production identity before launch.
- Security scanning is represented as state only; no scanner is integrated yet.
