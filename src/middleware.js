import { NextResponse } from "next/server";
import {
  SECURITY_LIMITS,
  analysisRateLimiter,
  getRequestIdentifier,
  inspectUntrustedInput,
  logSecurityAnomaly,
  uploadRateLimiter,
} from "./lib/SecurityLayer.js";

function withSecurityHeaders(response) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return response;
}

function rejectJson(status, code) {
  return withSecurityHeaders(NextResponse.json({ error: code }, { status }));
}

export function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const identifier = getRequestIdentifier(request);
  const isApi = pathname.startsWith("/api/");
  const isUpload = pathname.startsWith("/api/upload");
  const isAnalysis = pathname.startsWith("/api/analyze") || pathname.startsWith("/api/emotion");
  const contentLength = Number(request.headers.get("content-length") || 0);

  if (contentLength > SECURITY_LIMITS.maxUploadBytes) {
    logSecurityAnomaly({ code: "upload_too_large", severity: "medium", route: pathname, identifier });
    return rejectJson(413, "UPLOAD_TOO_LARGE");
  }

  const queryInspection = inspectUntrustedInput(search, { maxChars: 2048 });
  if (!queryInspection.allowed) {
    queryInspection.anomalies.forEach(anomaly => logSecurityAnomaly({ ...anomaly, route: pathname, identifier }));
    return rejectJson(400, "UNSAFE_QUERY");
  }

  if (isUpload) {
    const rate = uploadRateLimiter(identifier);
    if (!rate.allowed) {
      logSecurityAnomaly({ code: "upload_rate_limited", severity: "medium", route: pathname, identifier });
      return rejectJson(429, "UPLOAD_RATE_LIMITED");
    }
  }

  if (isAnalysis) {
    const rate = analysisRateLimiter(identifier);
    if (!rate.allowed) {
      logSecurityAnomaly({ code: "analysis_rate_limited", severity: "medium", route: pathname, identifier });
      return rejectJson(429, "ANALYSIS_RATE_LIMITED");
    }
  }

  return withSecurityHeaders(isApi ? NextResponse.next() : NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
