import { Suspense } from 'react';
import Link from 'next/link';

import { AuthShell } from '@/components/auth/AuthShell';
import { VerifyEmailNotice } from '@/components/auth/VerifyEmailNotice';

/**
 * Post-sign-up screen. Tells the user to check their inbox and confirm their
 * email. The confirmation link routes through /auth/callback, which establishes
 * the session and forwards to /app.
 */
export default function VerifyEmailPage() {
  return (
    <AuthShell
      title="Check your email"
      subtitle="We’ve sent you a confirmation link to finish setting up your account."
      footer={
        <>
          Already confirmed?{' '}
          <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Log in
          </Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <VerifyEmailNotice />
      </Suspense>
    </AuthShell>
  );
}
