import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

import { supabaseAnonKey, supabaseUrl } from '@/lib/env';

interface CookieToSet {
  name: string;
  value: string;
  options: CookieOptions;
}


/** Routes that make up the authentication surface (unauthenticated area). */
const AUTH_ROUTES = ['/login', '/register', '/reset-password', '/update-password'];

/** Public routes that never require a session. */
const PUBLIC_ROUTES = ['/', '/auth'];

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) =>
    route === '/' ? pathname === '/' : pathname === route || pathname.startsWith(`${route}/`),
  );
}

/**
 * Runs on every matched request. Refreshes the Supabase session (rotating auth
 * cookies) and enforces route protection:
 *   - Unauthenticated users hitting a protected route → redirected to /login.
 *   - Authenticated users hitting an auth route → redirected to /app.
 *
 * IMPORTANT: the returned `supabaseResponse` must be passed through unmodified
 * (aside from redirects that copy its cookies) so refreshed cookies persist.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },

    },
  });

  // Do NOT run code between createServerClient and getUser(); it must be the
  // first call so the session is validated/refreshed on every request.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Authenticated users should not sit on auth screens.
  if (user && isAuthRoute(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/app';
    url.search = '';
    return NextResponse.redirect(url);
  }

  // Unauthenticated users may only access public + auth routes.
  if (!user && !isAuthRoute(pathname) && !isPublicRoute(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // Preserve where they were headed so we can bounce them back post-login.
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
