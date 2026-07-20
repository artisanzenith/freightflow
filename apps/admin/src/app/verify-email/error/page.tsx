import Link from 'next/link';
import { Button } from '@freightflow/ui';

import { AuthShell } from '@/components/auth/AuthShell';

/**
 * Friendly recovery screen shown when an email verification link is invalid or
 * expired (see /auth/callback). Offers clear next steps rather than a raw error
 * so the user can get unstuck: request a fresh link or start over.
 */
export default function VerifyEmailErrorPage() {
  return (
    <AuthShell
      title="This link didn’t work"
      subtitle="Your verification link is invalid or has expired."
      footer={
        <>
          Need a hand?{' '}
          <a
            href="mailto:support@freightflow.com"
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            Contact support
          </a>
        </>
      }
    >
      <div className="space-y-6">
        <div className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 p-4">
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-warning text-white"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.72-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.492-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <div className="text-sm">
            <p className="font-semibold text-navy-900">We couldn’t verify your email.</p>
            <p className="mt-1 text-neutral-600">
              Verification links expire after a short while for security, and each link can only be
              used once.
            </p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-neutral-600">
          <p>Here’s how to get back on track:</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              If you already confirmed your email, just{' '}
              <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
                log in
              </Link>
              .
            </li>
            <li>Otherwise, request a new verification link from the sign-up screen.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link href="/register" className="block">
            <Button fullWidth size="lg">
              Get a new verification link
            </Button>
          </Link>
          <Link href="/login" className="block">
            <Button variant="outline" fullWidth size="lg">
              Back to log in
            </Button>
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
