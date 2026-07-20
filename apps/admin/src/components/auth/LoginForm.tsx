'use client';

import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FormField, Input } from '@freightflow/ui';

import { signIn, type AuthFormState } from '@/lib/auth/actions';
import { FormAlert } from './FormAlert';
import { SubmitButton } from './SubmitButton';

const initialState: AuthFormState = { ok: false };

/** Login form wired to the `signIn` server action. */
export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '/app';
  const callbackError = searchParams.get('error');

  const [state, formAction] = useActionState(signIn, initialState);

  return (
    <form className="space-y-5" action={formAction} aria-label="Log in">
      {state.formError && <FormAlert>{state.formError}</FormAlert>}
      {!state.formError && callbackError && (
        <FormAlert>Your link was invalid or expired. Please log in again.</FormAlert>
      )}

      <input type="hidden" name="redirectTo" value={redirectTo} />

      <FormField label="Email" required error={state.fieldErrors?.email}>
        {(field) => (
          <Input
            {...field}
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@company.com"
          />
        )}
      </FormField>

      <FormField label="Password" required error={state.fieldErrors?.password}>
        {(field) => (
          <Input
            {...field}
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
          />
        )}
      </FormField>

      <div className="flex items-center justify-end">
        <Link
          href="/reset-password"
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Forgot password?
        </Link>
      </div>

      <SubmitButton fullWidth size="lg" pendingLabel="Logging in…">
        Log in
      </SubmitButton>
    </form>
  );
}
