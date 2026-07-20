'use client';

import { useSearchParams } from 'next/navigation';

/** Shows which address the confirmation email was sent to, when known. */
export function VerifyEmailNotice() {
  const email = useSearchParams().get('email');

  return (
    <div className="space-y-4 text-sm text-neutral-600">
      <p>
        {email ? (
          <>
            A confirmation link is on its way to{' '}
            <span className="font-semibold text-navy-900">{email}</span>. Click the link in that
            email to activate your account.
          </>
        ) : (
          <>Click the link in the email we just sent to activate your account.</>
        )}
      </p>
      <p>
        Didn’t get it? Check your spam folder, or wait a minute and try again. The link expires
        after a short while for security.
      </p>
    </div>
  );
}
