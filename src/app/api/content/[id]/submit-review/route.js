import { requireCreator } from "../../../../../lib/creator/auth.js";
import { writeAuditLog } from "../../../../../lib/creator/auditLog.js";
import { submitForReview } from "../../../../../lib/creator/contentStore.js";
import { handleApiError, json } from "../../../_creatorResponse.js";

export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  try {
    const creator = requireCreator(request);
    const content = submitForReview({ id: params.id, creatorId: creator.id });
    if (!content) return json({ error: { message: "Content not found" } }, 404);
    writeAuditLog({
      creatorId: creator.id,
      action: "content.submit-review",
      resourceType: "content",
      resourceId: params.id,
      metadata: { status: content.status, reviewStatus: content.reviewStatus },
    });
    return json({ content });
  } catch (error) {
    return handleApiError(error);
  }
}
