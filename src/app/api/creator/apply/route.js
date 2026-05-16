import { writeAuditLog } from "../../../../lib/creator/auditLog.js";
import { saveCreatorApplication, saveEmailCapture } from "../../../../lib/creator/intakeStore.js";
import {
  validateCreatorApplicationPayload,
  validateEmailCapturePayload,
} from "../../../../lib/creator/validation.js";
import { handleApiError, json } from "../../_creatorResponse.js";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const raw = await request.json();
    const applicationPayload = validateCreatorApplicationPayload(raw);
    const emailPayload = validateEmailCapturePayload({
      email: applicationPayload.email,
      source: "creator_application",
      intent: "creator_application",
      website: raw.website,
    });

    saveEmailCapture(emailPayload);
    const application = saveCreatorApplication(applicationPayload);

    writeAuditLog({
      creatorId: application.email,
      action: "creator.application.submit",
      resourceType: "creator_application",
      resourceId: application.id,
      metadata: {
        creatorType: application.creatorType,
        verificationState: application.verificationState,
      },
    });

    return json({
      application: {
        id: application.id,
        verificationState: application.verificationState,
        moderationStatus: application.moderationStatus,
        uploadPermission: application.uploadPermission,
      },
    }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
