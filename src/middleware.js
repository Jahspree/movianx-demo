import { NextResponse } from "next/server";
import {
  authenticateOpsRequest,
  getOpsRealm,
  isOpsPath,
  isPublicDemoHost,
} from "./lib/ops/auth.js";

function unauthorized(message = "Operations access required", status = 401) {
  return new NextResponse(message, {
    status,
    headers: {
      "www-authenticate": `Basic realm="${getOpsRealm()}", charset="UTF-8"`,
      "cache-control": "no-store",
    },
  });
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  if (!isOpsPath(pathname)) return NextResponse.next();

  const host = request.headers.get("host") || "";
  if (isPublicDemoHost(host)) {
    return new NextResponse("Not found", {
      status: 404,
      headers: { "cache-control": "no-store" },
    });
  }

  const auth = authenticateOpsRequest(request.headers);
  if (!auth.ok) {
    return unauthorized(
      auth.reason === "ops_auth_not_configured"
        ? "Operations auth is not configured"
        : "Operations access required",
      auth.status,
    );
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-movianx-ops-role", auth.role);
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set("x-movianx-ops-role", auth.role);
  response.headers.set("x-robots-tag", "noindex, nofollow, noarchive");
  response.headers.set("cache-control", "no-store");
  return response;
}

export const config = {
  matcher: ["/ops/:path*", "/api/ops/:path*"],
};
