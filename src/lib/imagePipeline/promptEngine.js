const ASSET_SPECS = Object.freeze({
  poster: { width: 1200, height: 1800, use: "poster" },
  hero: { width: 2400, height: 1350, use: "hero banner" },
  thumbnail: { width: 1200, height: 675, use: "thumbnail" },
  creatorBanner: { width: 1800, height: 900, use: "creator banner" },
  categoryVisual: { width: 1800, height: 1100, use: "category visual" },
});

export function buildCinematicPrompts(analysis, requestedTypes = ["poster", "hero", "thumbnail"]) {
  return requestedTypes.map(type => {
    const spec = ASSET_SPECS[type] || ASSET_SPECS.thumbnail;
    return {
      type,
      width: spec.width,
      height: spec.height,
      prompt: [
        `Create a ${spec.use} for "${analysis.title || analysis.contentId}".`,
        `Genre: ${analysis.genre}. Tone: ${analysis.tone}. Emotion: ${analysis.emotion}.`,
        `Themes: ${analysis.themes.join(", ")}.`,
        "Dark premium entertainment aesthetic, cinematic lighting, strong composition, mobile-safe focal area.",
        "No text artifacts, no transparent background, no clutter, no low quality stock look.",
      ].join(" "),
      negativePrompt: "blurry, distorted faces, unreadable text, watermark, transparent background, low resolution, cheap stock photo",
    };
  });
}

export function getAssetSpec(type) {
  return ASSET_SPECS[type] || ASSET_SPECS.thumbnail;
}
