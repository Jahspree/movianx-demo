import fs from "node:fs/promises";
import { CONSUMER_EXPERIENCES } from "../data/consumerExperiences.js";
import { runCinematicImagePipeline } from "../lib/imagePipeline/index.js";

const TARGET_IDS = process.env.MOVIANX_IMAGE_IDS
  ? process.env.MOVIANX_IMAGE_IDS.split(",").map(id => id.trim()).filter(Boolean)
  : ["story-3", "night-of-the-living-dead", "music-echoes-in-orbit", "creator-director-noir"];

const targets = CONSUMER_EXPERIENCES.filter(item => TARGET_IDS.includes(item.id));
const results = [];

for (const content of targets) {
  const result = await runCinematicImagePipeline({
    content,
    requestedTypes: ["poster", "hero", "thumbnail"],
    persist: true,
  });
  results.push(result);
}

await fs.mkdir("public/images/generated", { recursive: true });
await fs.writeFile(
  "public/images/generated/pipeline-report.json",
  JSON.stringify({
    generatedAt: new Date().toISOString(),
    provider: "local-cinematic-svg",
    contentIds: results.map(result => result.contentId),
    assets: results.flatMap(result => result.assets.map(asset => ({
      contentId: result.contentId,
      type: asset.type,
      publicPath: asset.publicPath,
      validation: asset.validation.quality,
      moderation: asset.validation.moderation,
      dimensions: asset.validation.dimensions,
    }))),
  }, null, 2),
);

console.log(JSON.stringify({
  generated: results.length,
  assets: results.reduce((count, result) => count + result.assets.length, 0),
  contentIds: results.map(result => result.contentId),
}, null, 2));
