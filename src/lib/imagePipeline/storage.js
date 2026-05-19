import fs from "node:fs/promises";
import path from "node:path";

function safeSegment(value) {
  return String(value || "asset")
    .normalize("NFKC")
    .replace(/[^\w-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 96) || "asset";
}

export function buildGeneratedAssetPath({ contentId, type, extension = ".svg" }) {
  const safeId = safeSegment(contentId);
  const safeType = safeSegment(type);
  return {
    publicPath: `/images/generated/content/${safeId}/${safeType}${extension}`,
    filePath: path.join(process.cwd(), "public", "images", "generated", "content", safeId, `${safeType}${extension}`),
  };
}

export async function storeGeneratedAsset({ contentId, type, asset }) {
  const target = buildGeneratedAssetPath({ contentId, type, extension: asset.extension || ".svg" });
  await fs.mkdir(path.dirname(target.filePath), { recursive: true });
  await fs.writeFile(target.filePath, asset.bytes);
  return {
    ...target,
    contentType: asset.contentType,
    width: asset.width,
    height: asset.height,
    providerId: asset.providerId,
  };
}
