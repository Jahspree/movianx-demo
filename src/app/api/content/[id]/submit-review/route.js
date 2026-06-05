import { requireCreator } from "../../../../../lib/creator/auth.js";
import { writeAuditLog } from "../../../../../lib/creator/auditLog.js";
import { submitForReview } from "../../../../../lib/creator/contentStore.js";
import {
  createUploadRecordFromContent,
  updateCreatorUploadRecord,
  writeCreatorUploadAudit,
} from "../../../../../lib/creator/supabaseUploadStore.js";
import { handleApiError, json } from "../../../_creatorResponse.js";
import { captureServerEvent } from "../../../../../lib/posthog-server.js";

export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  try {
    const creator = requireCreator(request);
    const content = submitForReview({ id: params.id, creatorId: creator.id });
    if (!content) return json({ error: { message: "Content not found" } }, 404);
    await updateCreatorUploadRecord({
      id: content.id,
      patch: createUploadRecordFromContent({
        content,
        storageProvider: "supabase-or-private-storage",
      }),
    });
    writeAuditLog({
      creatorId: creator.id,
      action: "content.submit-review",
      resourceType: "content",
      resourceId: params.id,
      metadata: { status: content.status, reviewStatus: content.reviewStatus },
    });
    await writeCreatorUploadAudit({
      actorId: creator.id,
      action: "content.submit-review",
      recordId: params.id,
      metadata: { status: content.status, reviewStatus: content.reviewStatus },
    });

    captureServerEvent("content_submitted_for_review", {
      content_id: params.id,
      status: content.status,
      review_status: content.reviewStatus,
    }, creator.id);

    return json({ content });
  } catch (error) {
    return handleApiError(error);
  }
}
