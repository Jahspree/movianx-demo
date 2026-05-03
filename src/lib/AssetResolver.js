const VERSION = "v3";

export function resolveAudio(path) {
  const clean = String(path || "").replace(/^\/?audio\/(?:v\d+\/)?/, "");
  return `/audio/${VERSION}/${clean}`;
}

class AssetResolver {
  getAudio(key) {
    const clean = String(key || "").replace(/\.mp3$/, "");
    return resolveAudio(`sfx/${clean}.mp3`);
  }

  resolveNarrationFile(filePath) {
    if (!filePath) return null;
    return this.resolveFile(filePath);
  }

  getNarrationFromManifest(manifest, chapterIdx) {
    return this.resolveNarrationFile(manifest?.chapters?.[chapterIdx]?.narration);
  }

  getCompanionNarrationFromManifest(manifest, chapterIdx) {
    return this.resolveNarrationFile(manifest?.chapters?.[chapterIdx]?.narrationCompanion);
  }

  resolveFile(filePath) {
    if (!filePath) return null;
    if (filePath.startsWith("/audio/")) return resolveAudio(filePath);
    return this.getAudio(filePath);
  }
}

const assetResolver = new AssetResolver();
export default assetResolver;
