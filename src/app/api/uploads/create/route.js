import { requireCreator } from "../../../../lib/creator/auth.js";
import { writeAuditLog } from "../../../../lib/creator/auditLog.js";
import { createContentItem } from "../../../../lib/creator/contentStore.js";
import { createSignedUploadTarget } from "../../../../lib/creator/storage.js";
import { validateCreatePayload } from "../../../../lib/creator/validation.js";
import { handleApiError, json } from "../../_creatorResponse.js";
import { captureServerEvent } from "../../../../lib/posthog-server.js";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const creator = requireCreator(request);
    const payload = validateCreatePayload(await request.json());
    const contentId = crypto.randomUUID();
    const signedTargets = await Promise.all(payload.assets.map(async asset => ({
      asset,
      target: await createSignedUploadTarget({ asset, creatorId: creator.id, contentId }),
    })));

    const uploadAssets = signedTargets.map(({ asset, target }) => ({
      id: crypto.randomUUID(),
      assetType: asset.assetType,
      originalFilename: asset.originalFilename,
      sanitizedFilename: asset.sanitizedFilename,
      contentType: asset.contentType,
      size: asset.size,
      storagePath: target.storagePath,
      status: "pending",
    }));

    const content = createContentItem({ creator, payload, uploadAssets, id: contentId });

    const uploadTargets = uploadAssets.map(asset => {
      const target = signedTargets.find(entry => entry.target.storagePath === asset.storagePath).target;
      return {
        assetId: asset.id,
        assetType: asset.assetType,
        method: target.method,
        uploadUrl: target.uploadUrl,
        headers: target.headers,
        expiresAt: target.expiresAt,
        storagePath: target.storagePath,
        publicAccess: false,
        mock: target.mock,
      };
    });

    writeAuditLog({
      creatorId: creator.id,
      action: "upload.create",
      resourceType: "content",
      resourceId: content.id,
      metadata: {
        assetCount: uploadAssets.length,
        submitMode: payload.submitMode,
        storageProvider: signedTargets[0]?.target.provider,
      },
    });

    captureServerEvent("upload_session_created", {
      content_id: content.id,
      submit_mode: payload.submitMode,
      asset_count: uploadAssets.length,
      genre: payload.genre,
      content_format: payload.contentFormat,
    }, creator.id);

    return json({
      content,
      uploadSession: {
        privateStorage: true,
        directPublicAccess: false,
        uploadTargets,
      },
    }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
