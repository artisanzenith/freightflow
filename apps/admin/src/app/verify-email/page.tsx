import Link from 'next/link';

import { AuthShell } from '@/components/auth/AuthShell';
import { VerifyEmailNotice } from '@/components/auth/VerifyEmailNotice';

interface VerifyEmailPageProps {
  searchParams: Promise<{ email?: string }>;
}

/**
 * Post-sign-up screen. Confirms the account was created and guides the user to
 * verify their email. The confirmation link routes through /auth/callback,
 * which establishes the session and forwards into the app.
 *
 * The email is read server-side from the query string so it is available on
 * first paint (no client flash) and can be passed to the resend action.
 */
export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { email } = await searchParams;

  return (
    <AuthShell
      title="Verify your email"
      subtitle="You’re almost there — just confirm your email address to get started."
      footer={
        <>
          Already confirmed?{' '}
          <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Log in
          </Link>
        </>
      }
    >
      <VerifyEmailNotice email={email} />
    </AuthShell>
  );
}
