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
    this.audioVersion = "20260320-livefix-2";
    this.timedCompanionVersion = "20260320-companion-2";
    this.musicVersion = "20260320-music-2";
  }

  withVersion(url, version = this.audioVersion) {
    if (!url) return null;
    const joiner = url.includes("?") ? "&" : "?";
    return `${url}${joiner}v=${version}`;
  }

  // Get SFX URL by key (e.g. "wind_loop" -> "/audio/sfx/wind_loop.mp3")
  getAudio(key) {
    // Strip extension if provided, normalize
    const clean = key.replace(/\.mp3$/, "");
    return this.withVersion(`${this.sfxBase}/${clean}.mp3`);
  }

  // Get narration URL for a story chapter
  getNarration(storyId, chapterIdx) {
    if (storyId === 1) return this.withVersion(`${this.frankBase}/ch${chapterIdx}.mp3`);
    if (storyId === 3) return this.withVersion(`${this.timedBase}/ch${chapterIdx}.mp3`);
    return null;
  }

  // Get companion narration (for timed story immersive mode)
  getCompanionNarration(storyId, chapterIdx) {
    if (storyId === 3) return this.withVersion(`${this.timedBase}/ch${chapterIdx}_companion.mp3`, this.timedCompanionVersion);
    return null;
  }

  // Resolve a manifest file path — could be absolute or a key
  resolveFile(filePath) {
    if (!filePath) return null;
    // If it's already a full path, return it
    if (filePath.startsWith("/audio/music/")) return this.withVersion(filePath, this.musicVersion);
    if (filePath.startsWith("/audio/")) return this.withVersion(filePath);
    // Otherwise treat as SFX key
    return this.getAudio(filePath);
  }
}

const assetResolver = new AssetResolver();
export default assetResolver;
