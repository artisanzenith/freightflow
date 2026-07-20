'use client';

import Link from 'next/link';
import { Button, FormField, Input } from '@freightflow/ui';

import { AuthShell } from '@/components/auth/AuthShell';

/**
 * Registration page — UI only. No account is created yet; sign-up is wired up
 * in a later phase.
 */
export default function RegisterPage() {
  return (
    <AuthShell
      title="Start your free trial"
      subtitle="Create your FreightFlow account. No credit card required."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Log in
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()} aria-label="Create account">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="First name" required>
            {(field) => (
              <Input {...field} name="firstName" autoComplete="given-name" placeholder="Alex" />
            )}
          </FormField>
          <FormField label="Last name" required>
            {(field) => (
              <Input {...field} name="lastName" autoComplete="family-name" placeholder="Rivera" />
            )}
          </FormField>
        </div>

        <FormField label="Company name" required hint="Your carrier or fleet name.">
          {(field) => (
            <Input {...field} name="company" autoComplete="organization" placeholder="Rivera Trucking LLC" />
          )}
        </FormField>

        <FormField label="Work email" required>
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

        <label className="flex items-start gap-2 text-sm text-neutral-600">
          <input
            type="checkbox"
            name="terms"
            className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
          />
          <span>
            I agree to the{' '}
            <Link href="#" className="font-medium text-brand-600 hover:text-brand-700">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="#" className="font-medium text-brand-600 hover:text-brand-700">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        <Button type="submit" fullWidth size="lg">
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
