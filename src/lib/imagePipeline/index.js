import { analyzeVisualMetadata } from "./analysis.js";
import { buildCinematicPrompts } from "./promptEngine.js";
import { createImageProvider } from "./providers.js";
import { validateGeneratedImage } from "./validation.js";
import { storeGeneratedAsset } from "./storage.js";

export async function runCinematicImagePipeline({
  content,
  provider = createImageProvider("local"),
  requestedTypes = ["poster", "hero", "thumbnail"],
  persist = true,
} = {}) {
  const analysis = await analyzeVisualMetadata(content);
  const prompts = buildCinematicPrompts(analysis, requestedTypes);
  const assets = [];

  for (const prompt of prompts) {
    const generated = await provider.generate({
      ...prompt,
      contentId: analysis.contentId,
      title: analysis.title,
    });
    const validation = validateGeneratedImage(generated);
    const stored = persist
      ? await storeGeneratedAsset({ contentId: analysis.contentId, type: prompt.type, asset: generated })
      : null;
    assets.push({
      type: prompt.type,
      prompt: prompt.prompt,
      validation,
      publicPath: stored?.publicPath || null,
      width: generated.width,
      height: generated.height,
      providerId: generated.providerId,
    });
  }

  return {
    contentId: analysis.contentId,
    analysis,
    prompts,
    assets,
    manifestEntry: Object.fromEntries(assets.map(asset => [asset.type, asset.publicPath]).filter(([, value]) => value)),
  };
}
