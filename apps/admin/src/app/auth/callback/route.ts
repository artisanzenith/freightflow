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
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/app';

  // Only allow same-origin relative redirect targets.
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/app';

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as 'email' | 'recovery' | 'invite' | 'email_change',
      token_hash: tokenHash,
    });
    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  // Something went wrong (expired/invalid link).
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
