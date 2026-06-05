import { authenticateOpsRequest } from "../../../../../lib/ops/auth.js";
import { updateContentStatusByAdmin } from "../../../../../lib/creator/contentStore.js";
import {
  getCreatorUploadRecord,
  updateCreatorUploadRecord,
  writeCreatorUploadAudit,
} from "../../../../../lib/creator/supabaseUploadStore.js";
import { CREATOR_UPLOAD_STATUSES } from "../../../../../lib/creator/types.js";
import { sanitizeText, validateStatusTransition, ValidationError } from "../../../../../lib/creator/validation.js";
import { handleApiError, json } from "../../../_creatorResponse.js";

export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
  try {
    const auth = authenticateOpsRequest(request.headers);
    if (!auth.ok) return json({ error: { message: "Operations access required" } }, auth.status || 401);
    if (auth.role !== "admin") {
      return json({ error: { message: "Insufficient role" } }, 403);
    }

    const body = await request.json();
    const status = sanitizeText(body.status, { max: 40, field: "status", required: true });
    const reviewNotes = sanitizeText(body.reviewNotes || "", { max: 1200, field: "reviewNotes" });
    if (!CREATOR_UPLOAD_STATUSES.includes(status)) {
      throw new ValidationError("Invalid upload review status");
    }

    const record = await getCreatorUploadRecord({ id: params.id });
    if (!record) return json({ error: { message: "Upload record not found" } }, 404);
    if (record.status !== status) validateStatusTransition(record.status, status);

    const updated = await updateCreatorUploadRecord({
      id: params.id,
      patch: {
        status,
        reviewStatus: mapReviewStatus(status, record.reviewStatus),
        reviewNotes,
        lastReviewedAt: new Date().toISOString(),
      },
    });
    try {
      updateContentStatusByAdmin({ id: params.id, status });
    } catch (syncError) {
      console.warn("[creator-upload-review] content store sync skipped", {
        id: params.id,
        status,
        reason: syncError.message,
      });
    }
    await writeCreatorUploadAudit({
      actorId: auth.role,
      action: "admin.status.update",
      recordId: params.id,
      metadata: {
        from: record.status,
        to: status,
        reviewNotes,
      },
    });

    return json({ upload: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

function mapReviewStatus(status, current) {
  if (status === "under_review" || status === "processing" || status === "flagged") return "in_review";
  if (status === "approved" || status === "published") return "approved";
  if (status === "rejected") return "rejected";
  return current || "not_submitted";
}
