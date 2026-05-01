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
    this.audioVersion = "20260501-launch-audio-1";
    this.timedCompanionVersion = "20260501-companion-truth-1";
    this.musicVersion = "20260501-score-persistent-1";
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

  resolveNarrationFile(filePath, { companion = false } = {}) {
    if (!filePath) return null;
    const version = companion || filePath.includes("_companion")
      ? this.timedCompanionVersion
      : this.audioVersion;
    return this.withVersion(filePath, version);
  }

  getNarrationFromManifest(manifest, chapterIdx) {
    return this.resolveNarrationFile(manifest?.chapters?.[chapterIdx]?.narration);
  }

  getCompanionNarrationFromManifest(manifest, chapterIdx) {
    return this.resolveNarrationFile(manifest?.chapters?.[chapterIdx]?.narrationCompanion, { companion: true });
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
