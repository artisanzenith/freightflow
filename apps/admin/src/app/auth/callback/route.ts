import { NextResponse, type NextRequest } from 'next/server';

import { createClient } from '@/lib/supabase/server';

/**
 * OAuth / email-link callback.
 *
 * Supabase redirects here after the user clicks a confirmation or password
 * recovery link. We exchange the `code` for a session (setting auth cookies)
 * and then forward to `next` (defaults to /app). PKCE code exchange is handled
 * by `exchangeCodeForSession`; older email links may instead arrive with
 * `token_hash` + `type`, which we verify via `verifyOtp`.
 *
 * On any failure (expired/invalid link, missing params) we send the user to a
 * friendly recovery page rather than a raw error, so they can resend the link
 * or start over.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/app';

  // Only allow same-origin relative redirect targets.
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/app';

  const errorRedirect = `${origin}/verify-email/error`;

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(errorRedirect);
    }
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as 'email' | 'recovery' | 'invite' | 'email_change',
      token_hash: tokenHash,
    });
    if (error) {
      return NextResponse.redirect(errorRedirect);
    }
  } else {
    // No usable verification parameters were present.
    return NextResponse.redirect(errorRedirect);
  }

  // Confirm the session was actually established before sending the user into
  // the app. If it wasn't, treat it as a failed verification.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(errorRedirect);
  }

  return NextResponse.redirect(`${origin}${safeNext}`);
}
