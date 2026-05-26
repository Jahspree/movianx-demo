import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { syncApprovedFactoryAssets } from "../src/lib/imagePipeline/factorySync.js";

async function makeTempFactory() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "movianx-factory-"));
  await fs.mkdir(path.join(root, "approved-assets", "stories", "story-3"), { recursive: true });
  await fs.mkdir(path.join(root, "metadata"), { recursive: true });
  await fs.writeFile(path.join(root, "approved-assets", "stories", "story-3", "poster.webp"), "fake-webp");
  await fs.writeFile(path.join(root, "approved-assets", "stories", "story-3", "hero.jpg"), "fake-jpg");
  await fs.writeFile(path.join(root, "metadata", "story-3.json"), JSON.stringify({
    contentId: "story-3",
    contentType: "stories",
    atmosphereProfile: "close-room pressure",
  }));
  return root;
}

test("factory sync copies approved raster assets into generated-live and writes manifest", async () => {
  const factoryRoot = await makeTempFactory();
  const projectRoot = await fs.mkdtemp(path.join(os.tmpdir(), "movianx-project-"));
  await fs.mkdir(path.join(projectRoot, "src", "data"), { recursive: true });
  await fs.mkdir(path.join(projectRoot, "public"), { recursive: true });
  const previousCwd = process.cwd();
  process.chdir(projectRoot);

  try {
    const result = await syncApprovedFactoryAssets({
      factoryRoot,
      publicRoot: path.join(projectRoot, "public"),
    });

    assert.equal(result.copiedAssets.length, 2);
    assert.equal(result.manifest["story-3"].poster, "/images/generated-live/stories/story-3/poster.webp");
    assert.equal(result.manifest["story-3"].hero, "/images/generated-live/stories/story-3/hero.jpg");
    assert.equal(
      await fs.readFile(path.join(projectRoot, "public", "images", "generated-live", "stories", "story-3", "poster.webp"), "utf8"),
      "fake-webp"
    );
    assert.match(
      await fs.readFile(path.join(projectRoot, "src", "data", "generatedLiveImageManifest.js"), "utf8"),
      /GENERATED_LIVE_IMAGE_MANIFEST/
    );
  } finally {
    process.chdir(previousCwd);
  }
});

test("factory sync fails clearly when approved assets directory is missing", async () => {
  await assert.rejects(
    () => syncApprovedFactoryAssets({ factoryRoot: "/definitely-missing-movianx-factory" }),
    /Factory approved assets directory not found/
  );
});
