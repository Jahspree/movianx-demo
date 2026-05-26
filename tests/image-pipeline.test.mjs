import test from "node:test";
import assert from "node:assert/strict";
import { analyzeVisualMetadata } from "../src/lib/imagePipeline/analysis.js";
import { buildCinematicPrompts } from "../src/lib/imagePipeline/promptEngine.js";
import { LocalCinematicImageProvider } from "../src/lib/imagePipeline/providers.js";
import { validateGeneratedImage, ImageValidationError } from "../src/lib/imagePipeline/validation.js";
import { mapGeneratedAssetsToExperience } from "../src/lib/imagePipeline/mapper.js";

test("visual analysis detects horror/thriller tone deterministically", () => {
  const first = analyzeVisualMetadata({
    id: "story-3",
    title: "10 Seconds",
    genre: "Thriller / Survival Horror",
    description: "Intruders, fear, silence, pressure, and danger inside the house.",
    tags: ["psychological thriller"],
  });
  const second = analyzeVisualMetadata({
    id: "story-3",
    title: "10 Seconds",
    genre: "Thriller / Survival Horror",
    description: "Intruders, fear, silence, pressure, and danger inside the house.",
    tags: ["psychological thriller"],
  });

  assert.deepEqual(first, second);
  assert.equal(first.genre, "horror");
  assert.equal(first.tone, "dread");
  assert.equal(first.emotion, "fear");
  assert.equal(first.intensity, 3);
});

test("prompt engine creates HD cinematic asset prompts", () => {
  const analysis = analyzeVisualMetadata({ id: "film-1", title: "Night Film", genre: "horror", description: "A haunted cinema." });
  const prompts = buildCinematicPrompts(analysis, ["poster", "hero", "thumbnail"]);

  assert.equal(prompts.length, 3);
  assert.ok(prompts.every(prompt => prompt.width >= 1000));
  assert.ok(prompts.every(prompt => prompt.height >= 600));
  assert.ok(prompts.every(prompt => prompt.prompt.includes("Dark premium entertainment aesthetic")));
  assert.ok(prompts.every(prompt => prompt.negativePrompt.includes("transparent background")));
});

test("local provider output validates without executable SVG content", async () => {
  const provider = new LocalCinematicImageProvider();
  const generated = await provider.generate({
    contentId: "safe-content",
    title: "Safe Content",
    type: "poster",
    width: 1200,
    height: 1800,
    prompt: "cinematic poster",
  });
  const validation = validateGeneratedImage(generated);

  assert.equal(generated.contentType, "image/svg+xml");
  assert.equal(validation.quality, "pass");
  assert.doesNotMatch(generated.bytes.toString("utf8"), /<script|onload=|href="http/i);
});

test("validation rejects unsafe or undersized images", () => {
  assert.throws(() => validateGeneratedImage({
    contentType: "image/svg+xml",
    width: 100,
    height: 100,
    bytes: Buffer.from("<svg><script>alert(1)</script></svg>"),
  }), ImageValidationError);
});

test("mapper does not let placeholder SVG factory assets override real artwork", () => {
  const mapped = mapGeneratedAssetsToExperience({
    id: "story-3",
    title: "10 Seconds",
    image: "/images/stories/ten-seconds.jpg",
  }, {
    "story-3": {
      poster: "/images/generated/content/story-3/poster.svg",
      hero: "/images/generated/content/story-3/hero.svg",
      thumbnail: "/images/generated/content/story-3/thumbnail.svg",
    },
  });

  assert.equal(mapped.image, "/images/stories/ten-seconds.jpg");
  assert.equal(mapped.heroImage, "/images/stories/ten-seconds.jpg");
  assert.equal(mapped.thumbnailImage, "/images/stories/ten-seconds.jpg");
  assert.equal(mapped.generatedImages.poster, "/images/generated/content/story-3/poster.svg");
});

test("mapper uses raster generated assets when they are available", () => {
  const mapped = mapGeneratedAssetsToExperience({
    id: "story-3",
    title: "10 Seconds",
    image: "/images/stories/ten-seconds.jpg",
  }, {
    "story-3": {
      poster: "/images/generated/content/story-3/poster.webp",
      hero: "/images/generated/content/story-3/hero.jpg",
      thumbnail: "/images/generated/content/story-3/thumbnail.png",
    },
  });

  assert.equal(mapped.image, "/images/generated/content/story-3/poster.webp");
  assert.equal(mapped.heroImage, "/images/generated/content/story-3/hero.jpg");
  assert.equal(mapped.thumbnailImage, "/images/generated/content/story-3/thumbnail.png");
});

test("mapper binds legacy live content IDs to approved generated-live assets", () => {
  const mapped = mapGeneratedAssetsToExperience({
    id: "story-3",
    title: "10 Seconds",
    image: "/images/stories/ten-seconds.jpg",
  }, {
    "world-01-the-weight-of-silence": {
      poster: "/images/generated-live/movies/world-01-the-weight-of-silence/poster.jpg",
      hero: "/images/generated-live/content/world-01-the-weight-of-silence/hero.jpg",
      rail: "/images/generated-live/content/world-01-the-weight-of-silence/rail.jpg",
    },
  });

  assert.equal(mapped.generatedAssetBindingId, "world-01-the-weight-of-silence");
  assert.equal(mapped.image, "/images/generated-live/movies/world-01-the-weight-of-silence/poster.jpg");
  assert.equal(mapped.heroImage, "/images/generated-live/content/world-01-the-weight-of-silence/hero.jpg");
  assert.equal(mapped.thumbnailImage, "/images/generated-live/content/world-01-the-weight-of-silence/rail.jpg");
});
