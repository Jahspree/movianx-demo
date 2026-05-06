# Movianx Immersion Human Listening Validation

Human listening validation is required because spatial placement, emotional realism, and masking cannot be fully proven by unit tests.

## Pass Conditions

- Narration sounds like a person reacting inside the moment, not a system narrator.
- No spoken metadata is audible, including "you feel", "the scene", "emotion", "ambience", or "music".
- Breathing is heard only as isolated one-shots, never as a bed or loop.
- Heartbeat is heard only as short bursts under high intensity, never as a constant loop.
- SFX have audible cooldown and do not repeat in a pattern.
- Fear scenes use rear or side spatial cues.
- Calm scenes feel wide and low-pressure.
- Narration words are not cut off at phrase or sentence boundaries.

## Fail Conditions

- Any continuous breathing loop is audible.
- Any constant heartbeat loop is audible.
- Narration describes metadata or scenery in a bookish way.
- Words are clipped or chopped between narration segments.
- SFX stack into noise or distract from narration.
- Spatial audio feels flat stereo in fear scenes.

## Required Manual Run

1. Open the deployed demo.
2. Play 10 Seconds page 1 in immersive mode with headphones.
3. Play one Frankenstein scene in immersive mode with headphones.
4. Record pass/fail against every condition above before approving marketing traffic.
