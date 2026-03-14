// ===========================================================================
// ASSET RESOLVER
// Maps logical audio keys to URLs. Currently local paths.
// Later: signed GCS URLs, CDN, etc. The engine never knows where files live.
// ===========================================================================

class AssetResolver {
  constructor() {
    // Base paths - swap these to GCS/CDN later
    this.sfxBase = "/audio/sfx";
    this.frankBase = "/audio/frankenstein";
    this.timedBase = "/audio/timed";
  }

  // Get SFX URL by key (e.g. "wind_loop" -> "/audio/sfx/wind_loop.mp3")
  getAudio(key) {
    // Strip extension if provided, normalize
    const clean = key.replace(/\.mp3$/, "");
    return `${this.sfxBase}/${clean}.mp3`;
  }

  // Get narration URL for a story chapter
  getNarration(storyId, chapterIdx) {
    if (storyId === 1) return `${this.frankBase}/ch${chapterIdx}.mp3`;
    if (storyId === 3) return `${this.timedBase}/ch${chapterIdx}.mp3`;
    return null;
  }

  // Get companion narration (for timed story immersive mode)
  getCompanionNarration(storyId, chapterIdx) {
    if (storyId === 3) return `${this.timedBase}/ch${chapterIdx}_companion.mp3`;
    return null;
  }

  // Resolve a manifest file path — could be absolute or a key
  resolveFile(filePath) {
    if (!filePath) return null;
    // If it's already a full path, return it
    if (filePath.startsWith("/audio/")) return filePath;
    // Otherwise treat as SFX key
    return this.getAudio(filePath);
  }
}

const assetResolver = new AssetResolver();
export default assetResolver;
