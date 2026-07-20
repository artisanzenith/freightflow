'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { Button } from '@freightflow/ui';


import { resendVerification, type AuthFormState } from '@/lib/auth/actions';
import { FormAlert } from './FormAlert';

/** Seconds the user must wait between resend attempts. */
const RESEND_COOLDOWN_SECONDS = 60;

const initialState: AuthFormState = { ok: false };

export interface VerifyEmailNoticeProps {
  /** The address the confirmation email was sent to, if known. */
  email?: string;
}

/**
 * Post-sign-up confirmation panel. Confirms the account was created, shows the
 * destination email, and offers a rate-limit-aware "resend" plus a way to go
 * back and use a different address.
 */
export function VerifyEmailNotice({ email }: VerifyEmailNoticeProps) {
  const [state, formAction] = useActionState(resendVerification, initialState);
  const [cooldown, setCooldown] = useState(0);

  // Start the cooldown whenever a resend succeeds.
  useEffect(() => {
    if (state.ok) {
      setCooldown(RESEND_COOLDOWN_SECONDS);
    }
  }, [state]);

  // Tick the cooldown down to zero.
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((value) => (value <= 1 ? 0 : value - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const onCooldown = cooldown > 0;

  return (
    <div className="space-y-6">
      {/* Success confirmation */}
      <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/5 p-4">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success text-white"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 111.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <div className="text-sm">
          <p className="font-semibold text-navy-900">Your account was created.</p>
          <p className="mt-1 text-neutral-600">
            One last step: confirm your email address to activate your account.
          </p>
        </div>
      </div>

      {/* Destination + instructions */}
      <div className="space-y-3 text-sm text-neutral-600">
        <p>
          {email ? (
            <>
              We’ve sent a verification link to{' '}
              <span className="font-semibold text-navy-900">{email}</span>. Click the link in that
              email to finish setting up your account.
            </>
          ) : (
            <>Click the link in the email we just sent to finish setting up your account.</>
          )}
        </p>
        <p>
          <span className="font-medium text-navy-900">You can’t sign in yet.</span> Your account
          stays inactive until your email is verified.
        </p>
        <p className="text-neutral-500">
          Didn’t get it? Check your spam folder, or resend the link below. Links expire after a
          short while for security.
        </p>
      </div>

      {/* Resend result */}
      {state.formError && <FormAlert>{state.formError}</FormAlert>}
      {state.ok && state.message && <FormAlert variant="success">{state.message}</FormAlert>}

      {/* Resend action */}
      <form action={formAction} className="space-y-3">
        {email && <input type="hidden" name="email" value={email} />}
        <ResendButton disabled={!email || onCooldown} cooldown={cooldown} />
        {!email && (
          <p className="text-xs text-neutral-500">
            We don’t have your email on this page. Use “Change email address” below to continue.
          </p>
        )}
      </form>

      {/* Change email / secondary actions */}
      <div className="border-t border-neutral-200 pt-4 text-sm text-neutral-600">
        <p>
          Wrong address?{' '}
          <Link
            href="/register"
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            Change email address
          </Link>
        </p>
      </div>
    </div>
  );
}

/**
 * Resend button reflecting both the form's pending state and the active
 * cooldown window. Split out so it can read `useFormStatus` inside the form.
 */

function ResendButton({ disabled, cooldown }: { disabled: boolean; cooldown: number }) {
  const { pending } = useFormStatus();

  let label = 'Resend verification email';
  if (pending) label = 'Sending…';
  else if (cooldown > 0) label = `Resend available in ${cooldown}s`;

  return (
    <Button
      type="submit"
      variant="outline"
      fullWidth
      size="lg"
      disabled={disabled || pending}
      aria-busy={pending}
    >
      {label}
    </Button>
  );
}
