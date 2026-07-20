'use client';

import { useActionState } from 'react';
import { FormField, Input } from '@freightflow/ui';

import { requestPasswordReset, type AuthFormState } from '@/lib/auth/actions';
import { FormAlert } from './FormAlert';
import { SubmitButton } from './SubmitButton';

const initialState: AuthFormState = { ok: false };

/** Password-reset request form wired to the `requestPasswordReset` action. */
export function ResetPasswordForm() {
  const [state, formAction] = useActionState(requestPasswordReset, initialState);

  if (state.ok && state.message) {
    return <FormAlert variant="success">{state.message}</FormAlert>;
  }

  return (
    <form className="space-y-5" action={formAction} aria-label="Reset password">
      {state.formError && <FormAlert>{state.formError}</FormAlert>}

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

      <SubmitButton fullWidth size="lg" pendingLabel="Sending…">
        Send reset link
      </SubmitButton>
    </form>
  );
}
