'use client';

import { useActionState } from 'react';
import { FormField, Input } from '@freightflow/ui';

import { updatePassword, type AuthFormState } from '@/lib/auth/actions';
import { FormAlert } from './FormAlert';
import { SubmitButton } from './SubmitButton';

const initialState: AuthFormState = { ok: false };

/** New-password form used after following a recovery link. */
export function UpdatePasswordForm() {
  const [state, formAction] = useActionState(updatePassword, initialState);

  return (
    <form className="space-y-5" action={formAction} aria-label="Set a new password">
      {state.formError && <FormAlert>{state.formError}</FormAlert>}

      <FormField
        label="New password"
        required
        hint="At least 8 characters, including a number."
        error={state.fieldErrors?.password}
      >
        {(field) => (
          <Input
            {...field}
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="••••••••"
          />
        )}
      </FormField>

      <FormField
        label="Confirm new password"
        required
        error={state.fieldErrors?.confirmPassword}
      >
        {(field) => (
          <Input
            {...field}
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="••••••••"
          />
        )}
      </FormField>

      <SubmitButton fullWidth size="lg" pendingLabel="Updating…">
        Update password
      </SubmitButton>
    </form>
  );
}
