import { syncApprovedFactoryAssets } from "../lib/imagePipeline/factorySync.js";

try {
  const result = await syncApprovedFactoryAssets({
    factoryRoot: process.env.MOVIANX_FACTORY_ROOT || "/movianx-ai-factory",
  });

  console.log(JSON.stringify({
    syncedAssets: result.copiedAssets.length,
    manifestEntries: Object.keys(result.manifest).length,
    reportPath: result.reportPath,
  }, null, 2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
