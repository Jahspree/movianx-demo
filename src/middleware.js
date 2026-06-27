import { NextResponse } from 'next/server';

// TEMPORARY SITE LOCKDOWN
// Public surface = the marketing pages plus the public supporting pages. Everything else
// (dashboards, /watch story routes, /qa, /poc, internal demos, experimental/unfinished
// functionality) is redirected to the homepage so it cannot be discovered via URL manipulation.
// No auth/waitlist/invite — pure routing lockdown.
// Reverse this by widening PUBLIC_ROUTES (or removing this file) when those areas are ready.

const PUBLIC_ROUTES = new Set([
  '/',
  '/create',
  '/creators',
  '/explore',
  // Public supporting pages (footer destinations): About / News / Contact / Privacy / Terms.
  '/about',
  '/news',
  '/contact',
  '/privacy',
  '/terms',
]);

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.has(pathname)) {
    return NextResponse.next();
  }

  // Anything else → send to the public homepage.
  const url = request.nextUrl.clone();
  url.pathname = '/';
  url.search = '';
  return NextResponse.redirect(url, 307);
}

export const config = {
  // Run on page navigations only. Skip Next internals and any static asset (paths containing a dot,
  // plus the public asset folders) so the locked pages still load their images, audio, and logo.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/|audio/|movianx-logo.png|.*\\..*).*)',
  ],
};
