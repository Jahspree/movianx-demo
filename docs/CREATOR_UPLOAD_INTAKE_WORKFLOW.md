# Movianx Creator Upload Intake Workflow

## Scope

This is the internal creator intake path for private media review. It supports:

- Video upload
- Audio upload
- Cover art upload
- Creator description and metadata
- Supabase-backed upload records
- Internal ops review

The workflow is intentionally not linked from the public `demo.movianx.com` navigation.

## Runtime Flow

1. Creator dashboard posts metadata and asset descriptors to `POST /api/uploads/create`.
2. Server validates filenames, MIME types, file sizes, and required video asset.
3. Server creates private signed upload targets.
4. Browser uploads files directly to the signed targets.
5. Browser calls `POST /api/uploads/complete`.
6. Server stores/updates a creator upload record.
7. Creator may submit to review.
8. Internal ops reviews at `/ops/uploads`.

## Status Flow

Allowed intake status flow:

`Uploaded -> Processing -> Under Review -> Approved -> Published`

Rejected content may move to `Rejected` from review/approval states.

## Supabase Environment Variables

Required for production persistence:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_UPLOAD_BUCKET=creator-private-uploads`

The service role key must stay server-side only. Never expose it as `NEXT_PUBLIC_*`.

## Migration

Apply:

`supabase/migrations/20260605133000_creator_upload_intake.sql`

It creates:

- private `creator-private-uploads` storage bucket
- `public.creator_upload_records`
- `public.creator_upload_audit_logs`
- status constraints
- indexes
- RLS enabled
- no broad `anon` or `authenticated` grants

## Security Controls

- Upload APIs can require creator auth with `REQUIRE_CREATOR_AUTH=true`.
- Production should keep this enabled until real session auth/RBAC is wired.
- Upload records are server-written only.
- Files use UUID-based private storage paths.
- Raw user filenames are sanitized and never used in storage paths.
- SVG and executable/polyglot extension segments are rejected.
- Admin review is under `/ops/uploads`, protected by ops Basic Auth middleware.

## Current Limitations

- If Supabase env vars are absent, local/test runtime uses in-memory fallback.
- In-memory fallback is not durable in Vercel serverless production.
- Real creator sessions/RBAC are still a future integration.
