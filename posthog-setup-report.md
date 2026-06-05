<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Movianx. The integration covers both client-side and server-side event tracking, user identification on creator sign-up, and error capture on critical upload flows.

**What was set up:**
- `instrumentation-client.js` — client-side PostHog initialization via Next.js 15.3+ instrumentation hook, with reverse-proxy ingestion and exception capture enabled
- `next.config.js` — PostHog reverse proxy rewrites (`/ingest/*`) to avoid ad-blockers and reduce latency
- `src/lib/posthog-server.js` — singleton server-side PostHog client for API route tracking
- `.env.local` — `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` configured

| Event | Description | File |
|-------|-------------|------|
| `waitlist_joined` | Viewer successfully joins the early access waitlist | `src/app/watch/WaitlistInline.jsx` |
| `creator_application_submitted` | Creator submits their application form (+ `identify` call) | `src/app/dashboard/application/CreatorApplicationForm.jsx` |
| `content_upload_submitted` | Creator submits a content upload (draft or for review) | `src/app/dashboard/upload/UploadForm.jsx` |
| `story_mode_launched` | Viewer selects an experience mode and launches a story | `src/app/watch/ExperienceModeSelector.jsx` |
| `waitlist_email_captured` | Server confirms an email was saved to the waitlist | `src/app/api/waitlist/route.js` |
| `creator_application_received` | Server confirms a creator application was saved (+ `identify` call) | `src/app/api/creator/apply/route.js` |
| `upload_session_created` | Server confirms a content item and signed upload targets were created | `src/app/api/uploads/create/route.js` |
| `upload_completed` | Server confirms all assets for a content item have been uploaded | `src/app/api/uploads/complete/route.js` |
| `content_submitted_for_review` | Server confirms a content item was submitted for editorial review | `src/app/api/content/[id]/submit-review/route.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/455926/dashboard/1674462)
- [Viewer Waitlist Signups (wizard)](https://us.posthog.com/project/455926/insights/xNpHBLuP) — Daily waitlist sign-ups over 30 days
- [Creator Pipeline Funnel (wizard)](https://us.posthog.com/project/455926/insights/X10ecHzq) — Conversion from application → upload → review
- [Content Upload Activity (wizard)](https://us.posthog.com/project/455926/insights/1tBHxihN) — Upload sessions created vs completed (pipeline health)
- [Story Mode Launches (wizard)](https://us.posthog.com/project/455926/insights/jMX0gss7) — Story engagement by day
- [Viewer & Creator Growth (wizard)](https://us.posthog.com/project/455926/insights/BWkXCo7P) — Top-of-funnel for both audiences side by side

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
