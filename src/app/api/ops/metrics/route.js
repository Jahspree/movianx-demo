import { authenticateOpsRequest } from "../../../../lib/ops/auth.js";
import { getOpsMetrics } from "../../../../lib/ops/posthogMetrics.js";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const auth = authenticateOpsRequest(request.headers);
  if (!auth.ok) {
    return Response.json(
      { ok: false, error: { message: "Operations access required", reason: auth.reason } },
      {
        status: auth.status,
        headers: {
          "cache-control": "no-store",
          "www-authenticate": "Basic realm=\"Movianx Operations\", charset=\"UTF-8\"",
        },
      },
    );
  }

  const metrics = await getOpsMetrics();
  return Response.json(
    {
      ok: metrics.status === "connected",
      role: auth.role,
      metrics,
    },
    {
      headers: {
        "cache-control": "no-store",
        "x-robots-tag": "noindex, nofollow, noarchive",
      },
    },
  );
}
