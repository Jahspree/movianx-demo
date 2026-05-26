export const GENERATED_LIVE_CONTENT_BINDINGS = Object.freeze({
  "night-of-the-living-dead": "movies_psychological-horror_the-hollowing-signal_20260526t003000z_h1k9p4",
  nosferatu: "world-03-the-salt-line",
  "cabinet-of-dr-caligari": "world-01-the-weight-of-silence",
  "a-trip-to-the-moon": "world-02-the-event-horizon-choir",
  "the-general": "world-04-the-last-summer-we-spoke",
  "house-on-haunted-hill": "world-01-the-weight-of-silence",
  "creator-proof-film": "hero-backgrounds",
  "the-phantom-carriage": "world-06-the-last-polar-night",
  "the-lost-world": "world-02-the-event-horizon-choir",
  "story-1": "world-03-the-salt-line",
  "story-2": "world-04-the-last-summer-we-spoke",
  "story-3": "world-01-the-weight-of-silence",
  "music-echoes-in-orbit": "music_ambient-dreamlike_the-quiet-frequency_20260526t003500z_e4n7r2",
  "music-velvet-static": "music_ambient-dreamlike_the-quiet-frequency_20260526t003500z_e4n7r2",
  "creator-director-noir": "world-01-the-weight-of-silence",
  "creator-sound-architect": "music_ambient-dreamlike_the-quiet-frequency_20260526t003500z_e4n7r2",
  "creator-visual-poet": "world-04-the-last-summer-we-spoke",
  "creator-spotlight-lab": "world-05-the-record-shop-at-the-end-of-the-world",
});

export function getGeneratedLiveBindingIds(experience = {}) {
  return [
    experience.id,
    experience.storyId,
    experience.title,
    GENERATED_LIVE_CONTENT_BINDINGS[experience.id],
    GENERATED_LIVE_CONTENT_BINDINGS[experience.storyId],
    GENERATED_LIVE_CONTENT_BINDINGS[experience.title],
  ].filter(Boolean);
}
