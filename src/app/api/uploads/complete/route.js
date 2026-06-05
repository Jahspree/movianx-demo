import { requireCreator } from "../../../../lib/creator/auth.js";
import { writeAuditLog } from "../../../../lib/creator/auditLog.js";
import { markAssetsUploaded } from "../../../../lib/creator/contentStore.js";
import { sanitizeText, ValidationError } from "../../../../lib/creator/validation.js";
import { handleApiError, json } from "../../_creatorResponse.js";
import { captureServerEvent } from "../../../../lib/posthog-server.js";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const creator = requireCreator(request);
    const body = await request.json();
    const contentId = sanitizeText(body.contentId, { max: 80, field: "contentId", required: true });
    const uploadedAssets = Array.isArray(body.uploadedAssets) ? body.uploadedAssets : [];
    if (!uploadedAssets.length) throw new ValidationError("uploadedAssets is required");

    const content = markAssetsUploaded({ id: contentId, creatorId: creator.id, uploadedAssets });
    if (!content) return json({ error: { message: "Content not found" } }, 404);

    writeAuditLog({
      creatorId: creator.id,
      action: "upload.complete",
      resourceType: "content",
      resourceId: contentId,
      metadata: { uploadedAssetCount: uploadedAssets.length },
    });

    captureServerEvent("upload_completed", {
      content_id: contentId,
      uploaded_asset_count: uploadedAssets.length,
    }, creator.id);

    return json({ content });
  } catch (error) {
    return handleApiError(error);
  }
}
