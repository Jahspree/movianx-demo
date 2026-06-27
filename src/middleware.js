import { NextResponse } from "next/server";
import { createMiddlewareClient } from "./lib/supabase/middleware.js";

// Site access model:
//  - Public marketing pages (/, /create, /creators, /explore) are open and untouched (no session work).
//  - PUBLIC watch: /watch (published discovery hub) + /watch/[published-slug] (detail; page enforces
//    published+public+non-archived, else 404). Demo/internal watch zones are NOT public.
//  - /dashboard and /studio require a logged-in Supabase session, else → /login.
//  - /api/* passes through (each route enforces its own auth); /login + /auth/* are open.
//  - Everything else (poc, qa, experimental) stays hidden → redirected home.

const PUBLIC_PAGES = new Set([
  "/",
  "/create",
  "/creators",
  "/explore",
  // Public supporting pages (footer destinations): About / News / Contact / Privacy / Terms.
  "/about",
  "/news",
  "/contact",
  "/privacy",
  "/terms",
]);

// Demo/internal watch zones — hidden from the public at launch (redirect to the public hub).
const BLOCKED_WATCH_ZONES = new Set(["/watch/movies", "/watch/music", "/watch/stories", "/watch/sirens"]);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Demo/internal watch zones: redirect to the public watch hub before any public bypass.
  if (BLOCKED_WATCH_ZONES.has(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/watch";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Marketing pages + public watch (hub + published detail slugs): bypass entirely (fast, no session).
  // The /watch/[slug] page itself enforces published-only, so unpublished/archived/demo slugs 404.
  if (PUBLIC_PAGES.has(pathname) || pathname === "/watch" || pathname.startsWith("/watch/")) {
    return NextResponse.next();
  }

  // Refresh the Supabase session and read the current user.
  const { supabase, response } = createMiddlewareClient(request);
  let user = null;
  if (supabase) {
    try {
      user = (await supabase.auth.getUser()).data?.user || null;
    } catch {
      user = null;
    }
  }

  // API routes + auth flow pass through (routes/pages enforce their own access).
  if (
    pathname.startsWith("/api/") ||
    pathname === "/login" ||
    pathname.startsWith("/auth/")
  ) {
    return response;
  }

  // Session-gated areas.
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/studio")) {
    if (user) return response;
    // Dev-only founder bypass: the Genesis Lab opens locally (e.g. when Supabase auth isn't
    // configured) so the founder can test in the browser. NEVER active in a production build.
    if (process.env.NODE_ENV !== "production" && pathname.startsWith("/dashboard/genesis-test")) {
      return response;
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Everything else stays hidden.
  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|audio/|movianx-logo.png|.*\\..*).*)",
  ],
};
