import { authenticateOpsRequest } from "../../../../../lib/ops/auth.js";
import {
  dashboardToCsv,
  dashboardToJson,
  getExecutiveDashboardData,
  normalizeDashboardRange,
} from "../../../../../lib/ops/executiveDashboard.js";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const auth = authenticateOpsRequest(request.headers);
  if (!auth.ok || auth.role !== "admin") {
    return Response.json({ error: { message: "Administrator access required" } }, { status: auth.status || 401 });
  }

  const url = new URL(request.url);
  const range = normalizeDashboardRange(url.searchParams.get("range"));
  const format = url.searchParams.get("format") === "json" ? "json" : "csv";
  const data = await getExecutiveDashboardData({ range, auth });

  if (format === "json") {
    return new Response(dashboardToJson(data), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "content-disposition": `attachment; filename="movianx-executive-dashboard-${range}.json"`,
        "cache-control": "no-store",
      },
    });
  }

  return new Response(dashboardToCsv(data), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="movianx-executive-dashboard-${range}.csv"`,
      "cache-control": "no-store",
    },
  });
}
