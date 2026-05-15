import { requireCreator } from "../../../../lib/creator/auth.js";
import { writeAuditLog } from "../../../../lib/creator/auditLog.js";
import { getContent, patchContent } from "../../../../lib/creator/contentStore.js";
import { validatePatchPayload } from "../../../../lib/creator/validation.js";
import { handleApiError, json } from "../../_creatorResponse.js";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const creator = requireCreator(request);
    const content = getContent({ id: params.id, creatorId: creator.id });
    if (!content) return json({ error: { message: "Content not found" } }, 404);
    return json({ content });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request, { params }) {
  try {
    const creator = requireCreator(request);
    const patch = validatePatchPayload(await request.json());
    const content = patchContent({ id: params.id, creatorId: creator.id, patch });
    if (!content) return json({ error: { message: "Content not found" } }, 404);
    writeAuditLog({
      creatorId: creator.id,
      action: "content.patch",
      resourceType: "content",
      resourceId: params.id,
      metadata: { fields: Object.keys(patch) },
    });
    return json({ content });
  } catch (error) {
    return handleApiError(error);
  }
}
