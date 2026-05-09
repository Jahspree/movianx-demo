# Movianx Emotional Baseline 7ad9795

## Baseline

- Baseline commit: `7ad9795 Stabilize navigation and narration processing`
- Baseline branch: `stable-emotional-baseline-7ad9795`
- Baseline tag: `v1-emotional-baseline-7ad9795`

## Why This Is The Preferred Baseline

This commit is the functional emotional baseline for the Movianx demo because it preserves the strongest working combination of navigation stability, narration lifecycle protection, and cinematic narration processing before the later balancing pass changed the experience.

The later post-balance version is archived separately as `archive-current-post-balance-version`, but it is not the stable baseline.

## What Worked In This Version

- Navigation priority fixes for back and previous actions.
- Runtime-safe narration playback that avoids overlap and mid-sentence interruption.
- Cinematic narration processing with subtle compression, close room presence, filtering, and gain variation.
- Stabilized immersive initialization for the 10 Seconds experience.
- Functional emotional audio behavior without the later balancing changes that weakened the experience.

## Change Rules

Do not change this baseline directly for audio quality experiments, immersion tuning, timing experiments, or plugin/runtime changes.

Any future changes to narration, audio mixing, spatial timing, runtime orchestration, or emotional intensity should be tested on a separate branch first and compared against this baseline before promotion.

## Rollback Instructions

To create a history-safe rollback from a later `main` state:

```bash
git checkout main
git revert --no-commit 7ad9795..HEAD
git commit -m "Revert to functional emotional baseline at 7ad9795"
npm test
npm run build
vercel deploy --prod --force --yes
vercel cache purge --type=cdn --yes
```

To inspect the preserved baseline directly:

```bash
git checkout stable-emotional-baseline-7ad9795
```

Or use the annotated tag:

```bash
git checkout v1-emotional-baseline-7ad9795
```
