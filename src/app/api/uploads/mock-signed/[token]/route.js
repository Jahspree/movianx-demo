import { writeAuditLog } from "../../../../../lib/creator/auditLog.js";
import { requireCreator } from "../../../../../lib/creator/auth.js";
import { handleApiError, json } from "../../../_creatorResponse.js";

export const dynamic = "force-dynamic";

export async function PUT(request, { params }) {
  try {
    const creator = requireCreator(request);
    writeAuditLog({
      creatorId: creator.id,
      action: "upload.mock-put",
      resourceType: "upload-token",
      resourceId: params.token,
      metadata: {
        contentType: request.headers.get("content-type") || "unknown",
        contentLength: request.headers.get("content-length") || "unknown",
      },
    });
    return new Response(null, {
      status: 204,
      headers: {
        "cache-control": "no-store",
        "x-content-type-options": "nosniff",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET() {
  return json({ error: { message: "Mock signed upload URLs accept PUT only" } }, 405);
}
