import { writeAuditLog } from "../../../lib/creator/auditLog.js";
import { saveEmailCapture } from "../../../lib/creator/intakeStore.js";
import { validateEmailCapturePayload } from "../../../lib/creator/validation.js";
import { handleApiError, json } from "../_creatorResponse.js";
import { captureServerEvent } from "../../../lib/posthog-server.js";

export const dynamic = "force-dynamic";

async function readPayload(request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    return Object.fromEntries(formData.entries());
  }

  return request.json();
}

export async function POST(request) {
  try {
    const isFormPost = (request.headers.get("content-type") || "").includes("application/x-www-form-urlencoded");
    const payload = validateEmailCapturePayload(await readPayload(request));
    const entry = saveEmailCapture(payload);

    writeAuditLog({
      creatorId: "public",
      action: "email.capture",
      resourceType: "waitlist",
      resourceId: entry.id,
      metadata: {
        source: payload.source,
        intent: payload.intent,
      },
    });

    captureServerEvent("waitlist_email_captured", { source: payload.source, intent: payload.intent }, entry.id);

    if (isFormPost) {
      return Response.redirect(new URL("/watch?waitlist=joined#early-access", request.url), 303);
    }

    return json({
      ok: true,
      capture: {
        id: entry.id,
        source: entry.source,
        intent: entry.intent,
      },
      privacy: "Email is stored for Movianx access updates only in this demo abstraction.",
    }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
