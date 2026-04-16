import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js 16 Proxy (formerly "middleware") for server-side route protection.
 * File convention: src/proxy.ts, exported function named `proxy`.
 * See: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
 *
 * Cookie names are set by AuthController.cs:
 *   SetTokenCookie("access_token", accessToken)
 *   SetTokenCookie("refresh_token", refreshToken)
 *
 * Both are HttpOnly — readable here (server-side) but NOT in client JS.
 * Because the frontend proxies all /api/* requests through Next.js rewrites,
 * Set-Cookie headers from the backend are forwarded to the browser scoped to
 * the frontend domain (agency-ccrm.netlify.app), so this proxy can read them.
 */

// Routes that are fully public (no session required) — prefix matches
const PUBLIC_PREFIXES = [
  '/login',
  '/register',
  '/signup',
  '/portal',
  '/forgot-password',
  '/reset-password',
];

// Exact public paths (not prefix-matched to avoid accidental catch-all)
const PUBLIC_EXACT = ['/'];

// Auth pages where an already-authenticated user should be bounced away from
const AUTH_PAGE_PREFIXES = ['/login', '/register', '/signup'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for the access_token cookie set by the .NET backend
  const hasSession = request.cookies.has('access_token');

  // Landing page: redirect authenticated users straight to the dashboard
  if (pathname === '/' && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const isPublic =
    PUBLIC_EXACT.includes(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));

  if (!isPublic && !hasSession) {
    // Unauthenticated request to a protected route → redirect to login.
    // Skip the redirect param for /onboarding so we don't send new users
    // back there after they later log in on a different device.
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/onboarding') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Already-authenticated users visiting auth pages → redirect to dashboard.
  // (Onboarding-aware routing is handled client-side via the User.isOnboarded
  // flag so the proxy doesn't need to know about onboarding state.)
  if (hasSession && AUTH_PAGE_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
