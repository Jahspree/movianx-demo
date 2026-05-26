import fs from "node:fs/promises";
import path from "node:path";

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const ASSET_TYPES = ["poster", "hero", "thumbnail", "banner", "backdrop", "rail", "still"];
const CONTENT_TYPES = ["movies", "stories", "creators", "music", "worlds", "content"];
const CATEGORY_TO_ASSET_TYPE = {
  "creator-worlds": "creatorBanner",
  "hero-backgrounds": "hero",
  movies: "poster",
  music: "poster",
  "rail-art": "rail",
  stories: "story",
  thumbnails: "thumbnail",
};

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
  if (CATEGORY_TO_ASSET_TYPE[metadata.category]) return CATEGORY_TO_ASSET_TYPE[metadata.category];
  const source = `${metadata.type || ""} ${metadata.assetType || ""} ${metadata.asset_type || ""} ${metadata.role || ""} ${filePath} ${path.basename(filePath)}`.toLowerCase();
  if (source.includes("hero-background")) return "hero";
  if (source.includes("creator-world")) return "creatorBanner";
  if (source.includes("rail-art")) return "rail";
  return ASSET_TYPES.find(type => source.includes(type)) || "poster";
}

function inferContentType(filePath, metadata = {}) {
  const source = `${metadata.contentType || ""} ${metadata.category || ""} ${filePath}`.toLowerCase();
  return CONTENT_TYPES.find(type => source.includes(`/${type}/`) || source.includes(type)) || "content";
}

function inferContentId(filePath, approvedRoot, metadata = {}) {
  if (metadata.world_id || metadata.contentId || metadata.id || metadata.slug) {
    return safeSegment(metadata.world_id || metadata.contentId || metadata.id || metadata.slug);
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
    `approved-assets/${relative.replaceAll(path.sep, "/")}`,
    path.basename(filePath),
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
    const entries = Array.isArray(value) ? value : [
      value,
      ...(Array.isArray(value.assets) ? value.assets : []),
    ];
    for (const entry of entries) {
      const keys = [
        entry.contentId,
        entry.id,
        entry.slug,
        entry.world_id,
        entry.asset_id,
        entry.assetId,
        entry.file_name,
        entry.relative_path,
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

function titleFromId(id) {
  return String(id || "")
    .replace(/^world-\d+-/, "")
    .split("-")
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function contentFormatForCategory(category) {
  if (category === "music") return "music_experience";
  if (category === "stories") return "interactive_story";
  if (category === "creator-worlds") return "creator_spotlight";
  return "film";
}

function mediaTypeForCategory(category) {
  if (category === "music") return "Music Experience";
  if (category === "stories") return "Interactive Story";
  if (category === "creator-worlds") return "Creator World";
  return "Film Experience";
}

function genreFromEmotion(emotion) {
  return String(emotion || "cinematic")
    .split("-")
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function buildFactoryLiveExperiences({ manifest, copiedAssets, metadataByKey }) {
  return Object.entries(manifest).map(([contentId, images]) => {
    const assets = copiedAssets.filter(asset => asset.contentId === contentId);
    const primary = assets.find(asset => asset.assetType === "poster") || assets[0];
    const worldMeta = metadataByKey.get(contentId) || {};
    const title = worldMeta.title || primary?.metadata?.title || titleFromId(contentId);
    const creator = worldMeta.creator_identity || primary?.metadata?.creator_identity || "Movianx Factory";
    const emotion = worldMeta.genre || primary?.metadata?.emotional_category || "Cinematic";
    const category = primary?.contentType || "movies";
    const atmosphere = worldMeta.emotional_profile || worldMeta.cinematic_description || primary?.metadata?.atmospheric_profile || primary?.metadata?.quality_notes;

    return {
      id: contentId,
      title,
      creator,
      teamLabel: "Factory-approved cinematic world",
      year: "Factory",
      rights: "Movianx approved factory asset",
      sourceType: "Approved factory world",
      synopsis: worldMeta.cinematic_description || atmosphere || "A factory-approved cinematic world prepared for immersive discovery.",
      hook: worldMeta.cinematic_description || atmosphere || "A cinematic world generated and approved through the Movianx factory.",
      genre: genreFromEmotion(emotion),
      runtime: "Preview",
      rating: "Preview",
      language: "English",
      mediaType: mediaTypeForCategory(category),
      contentFormat: contentFormatForCategory(category),
      seriesType: "factory_world",
      series: null,
      immersiveReady: true,
      aiEnhanced: true,
      factoryIngested: true,
      creatorWorld: title,
      atmosphereProfile: atmosphere || "factory-approved cinematic atmosphere",
      ecosystemHook: worldMeta.quality_notes || "Approved through the Movianx cinematic factory with cohesive visual identity.",
      accent: "#b51f2a",
      image: images.poster || images.story || images.thumbnail || images.creatorBanner || images.rail || images.hero,
      heroImage: images.hero || images.poster || images.story || images.thumbnail,
      thumbnailImage: images.thumbnail || images.rail || images.poster || images.story,
      tags: ["Factory Approved", genreFromEmotion(emotion), "Cinematic World"],
      discoveryTags: [
        ...(worldMeta.recommended_rails || []),
        ...(primary?.metadata?.recommendation_tags || []),
        "factory approved",
        "cinematic world",
      ],
      moodTags: worldMeta.atmosphere_tags || primary?.metadata?.recommendation_tags || [genreFromEmotion(emotion)],
      styleTags: ["factory-generated", "premium", "cinematic"],
      enhancements: ["Factory asset sync", "Cinematic world mapping", "Recommendation-ready imagery"],
      merchCollections: [{
        title: `${title} Collection`,
        description: "A quiet support release connected to this cinematic world.",
        label: "From the creator world",
      }],
      href: `/watch/${contentId}`,
      launchHref: `/watch/${contentId}#player`,
    };
  });
}

export async function syncApprovedFactoryAssets({
  factoryRoot = path.join(process.cwd(), "movianx-ai-factory"),
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
      metadata,
      sourceFile,
      publicPath,
    });
  }

  const manifestPath = path.join(process.cwd(), "src", "data", "generatedLiveImageManifest.js");
  await fs.writeFile(
    manifestPath,
    `export const GENERATED_LIVE_IMAGE_MANIFEST = Object.freeze(${JSON.stringify(manifest, null, 2)});\n`
  );

  const contentPath = path.join(process.cwd(), "src", "data", "factoryLiveContent.js");
  const experiences = buildFactoryLiveExperiences({ manifest, copiedAssets, metadataByKey });
  await fs.writeFile(
    contentPath,
    `export const FACTORY_LIVE_EXPERIENCES = Object.freeze(${JSON.stringify(experiences, null, 2)});\n`
  );

  const reportPath = path.join(generatedLiveRoot, "sync-report.json");
  await fs.writeFile(reportPath, JSON.stringify({
    syncedAt: new Date().toISOString(),
    factoryRoot,
    assets: copiedAssets,
    manifestEntries: Object.keys(manifest).length,
    contentEntries: experiences.length,
  }, null, 2));

  return {
    manifest,
    copiedAssets,
    experiences,
    manifestPath,
    contentPath,
    reportPath,
  };
}
