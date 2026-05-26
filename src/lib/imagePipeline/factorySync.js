import fs from "node:fs/promises";
import path from "node:path";

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const ASSET_TYPES = ["poster", "hero", "thumbnail", "banner", "backdrop", "rail", "still"];
const CONTENT_TYPES = ["movies", "stories", "creators", "music", "worlds", "content"];

function safeSegment(value) {
  return String(value || "asset")
    .normalize("NFKC")
    .replace(/[^\w-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 96) || "asset";
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJsonFile(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function listFiles(root) {
  const entries = await fs.readdir(root, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

function inferAssetType(filePath, metadata = {}) {
  const source = `${metadata.type || ""} ${metadata.assetType || ""} ${metadata.role || ""} ${path.basename(filePath)}`.toLowerCase();
  return ASSET_TYPES.find(type => source.includes(type)) || "poster";
}

function inferContentType(filePath, metadata = {}) {
  const source = `${metadata.contentType || ""} ${metadata.category || ""} ${filePath}`.toLowerCase();
  return CONTENT_TYPES.find(type => source.includes(`/${type}/`) || source.includes(type)) || "content";
}

function inferContentId(filePath, approvedRoot, metadata = {}) {
  if (metadata.contentId || metadata.id || metadata.slug) {
    return safeSegment(metadata.contentId || metadata.id || metadata.slug);
  }

  const relative = path.relative(approvedRoot, filePath);
  const segments = relative.split(path.sep).map(segment => path.parse(segment).name);
  const ignored = new Set([...ASSET_TYPES, ...CONTENT_TYPES, "approved-assets", "images", "assets"]);
  const candidate = segments.find(segment => !ignored.has(safeSegment(segment))) || path.parse(filePath).name;
  return safeSegment(candidate.replace(new RegExp(`[-_]?(${ASSET_TYPES.join("|")})$`, "i"), ""));
}

function chooseMetadataForAsset(filePath, approvedRoot, metadataByKey) {
  const relative = path.relative(approvedRoot, filePath);
  const parsed = path.parse(relative);
  const keys = [
    relative,
    relative.replaceAll(path.sep, "/"),
    parsed.name,
    safeSegment(parsed.name),
    safeSegment(parsed.dir.split(path.sep).pop() || ""),
  ];
  return keys.map(key => metadataByKey.get(key)).find(Boolean) || {};
}

export async function loadFactoryMetadata(metadataRoot) {
  if (!await exists(metadataRoot)) return new Map();
  const files = (await listFiles(metadataRoot)).filter(file => path.extname(file).toLowerCase() === ".json");
  const metadataByKey = new Map();

  for (const file of files) {
    const value = await readJsonFile(file);
    const entries = Array.isArray(value) ? value : [value];
    for (const entry of entries) {
      const keys = [
        entry.contentId,
        entry.id,
        entry.slug,
        entry.assetId,
        path.parse(file).name,
      ].filter(Boolean);
      for (const key of keys) {
        metadataByKey.set(String(key), entry);
        metadataByKey.set(safeSegment(key), entry);
      }
    }
  }

  return metadataByKey;
}

export async function syncApprovedFactoryAssets({
  factoryRoot = "/movianx-ai-factory",
  publicRoot = path.join(process.cwd(), "public"),
} = {}) {
  const approvedRoot = path.join(factoryRoot, "approved-assets");
  const metadataRoot = path.join(factoryRoot, "metadata");
  if (!await exists(approvedRoot)) {
    throw new Error(`Factory approved assets directory not found: ${approvedRoot}`);
  }

  const metadataByKey = await loadFactoryMetadata(metadataRoot);
  const sourceFiles = (await listFiles(approvedRoot))
    .filter(file => ALLOWED_EXTENSIONS.has(path.extname(file).toLowerCase()));

  if (!sourceFiles.length) {
    throw new Error(`No approved raster assets found in ${approvedRoot}`);
  }

  const generatedLiveRoot = path.join(publicRoot, "images", "generated-live");
  const manifest = {};
  const copiedAssets = [];

  for (const sourceFile of sourceFiles) {
    const metadata = chooseMetadataForAsset(sourceFile, approvedRoot, metadataByKey);
    const contentId = inferContentId(sourceFile, approvedRoot, metadata);
    const contentType = safeSegment(inferContentType(sourceFile, metadata));
    const assetType = safeSegment(inferAssetType(sourceFile, metadata));
    const extension = path.extname(sourceFile).toLowerCase();
    const filename = `${assetType}${extension}`;
    const targetDir = path.join(generatedLiveRoot, contentType, contentId);
    const targetPath = path.join(targetDir, filename);
    const publicPath = `/images/generated-live/${contentType}/${contentId}/${filename}`;

    await fs.mkdir(targetDir, { recursive: true });
    await fs.copyFile(sourceFile, targetPath);

    manifest[contentId] = {
      ...(manifest[contentId] || {}),
      [assetType]: publicPath,
    };
    copiedAssets.push({
      contentId,
      contentType,
      assetType,
      sourceFile,
      publicPath,
    });
  }

  const manifestPath = path.join(process.cwd(), "src", "data", "generatedLiveImageManifest.js");
  await fs.writeFile(
    manifestPath,
    `export const GENERATED_LIVE_IMAGE_MANIFEST = Object.freeze(${JSON.stringify(manifest, null, 2)});\n`
  );

  const reportPath = path.join(generatedLiveRoot, "sync-report.json");
  await fs.writeFile(reportPath, JSON.stringify({
    syncedAt: new Date().toISOString(),
    factoryRoot,
    assets: copiedAssets,
    manifestEntries: Object.keys(manifest).length,
  }, null, 2));

  return {
    manifest,
    copiedAssets,
    manifestPath,
    reportPath,
  };
}
