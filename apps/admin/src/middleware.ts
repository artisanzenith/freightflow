import { type NextRequest } from 'next/server';

import { updateSession } from '@/lib/supabase/middleware';

/**
 * Root middleware: refreshes the Supabase session on every request and enforces
 * route protection (see `updateSession`).
 */
export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  /**
   * Run on all paths except Next.js internals and static assets. Keeping this
   * broad ensures the session is refreshed everywhere the user navigates.
   */
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
