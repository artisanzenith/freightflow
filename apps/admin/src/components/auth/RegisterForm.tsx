'use client';

import { useActionState } from 'react';
import { FormField, Input } from '@freightflow/ui';

import { signUp, type AuthFormState } from '@/lib/auth/actions';
import { FormAlert } from './FormAlert';
import { SubmitButton } from './SubmitButton';

const initialState: AuthFormState = { ok: false };

/** Registration form wired to the `signUp` server action. */
export function RegisterForm() {
  const [state, formAction] = useActionState(signUp, initialState);

  return (
    <form className="space-y-5" action={formAction} aria-label="Create account">
      {state.formError && <FormAlert>{state.formError}</FormAlert>}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="First name" required error={state.fieldErrors?.firstName}>
          {(field) => (
            <Input {...field} name="firstName" autoComplete="given-name" placeholder="Alex" />
          )}
        </FormField>
        <FormField label="Last name" required error={state.fieldErrors?.lastName}>
          {(field) => (
            <Input {...field} name="lastName" autoComplete="family-name" placeholder="Rivera" />
          )}
        </FormField>
      </div>

      <FormField
        label="Company name"
        required
        hint="Your carrier or fleet name."
        error={state.fieldErrors?.company}
      >
        {(field) => (
          <Input
            {...field}
            name="company"
            autoComplete="organization"
            placeholder="Rivera Trucking LLC"
          />
        )}
      </FormField>

      <FormField label="Work email" required error={state.fieldErrors?.email}>
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

      <FormField
        label="Password"
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

      <div className="space-y-1.5">
        <label className="flex items-start gap-2 text-sm text-neutral-600">
          <input
            type="checkbox"
            name="acceptTerms"
            className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
          />
          <span>
            I agree to the{' '}
            <a href="#" className="font-medium text-brand-600 hover:text-brand-700">
              Terms
            </a>{' '}
            and{' '}
            <a href="#" className="font-medium text-brand-600 hover:text-brand-700">
              Privacy Policy
            </a>
            .
          </span>
        </label>
        {state.fieldErrors?.acceptTerms && (
          <p className="text-xs font-medium text-danger" role="alert">
            {state.fieldErrors.acceptTerms}
          </p>
        )}
      </div>

      <SubmitButton fullWidth size="lg" pendingLabel="Creating account…">
        Create account
      </SubmitButton>
    </form>
  );
}
