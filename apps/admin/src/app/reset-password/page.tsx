'use client';

import Link from 'next/link';
import { Button, FormField, Input } from '@freightflow/ui';

import { AuthShell } from '@/components/auth/AuthShell';

/**
 * Password reset request page — UI only. No email is sent yet; the reset flow
 * is wired up in a later phase.
 */
export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we’ll send you a link to reset your password."
      footer={
        <>
          Remembered it?{' '}
          <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Back to log in
          </Link>
        </>
      }
    >
      <form
        className="space-y-5"
        onSubmit={(e) => e.preventDefault()}
        aria-label="Reset password"
      >
        <FormField label="Email" required>
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

        <Button type="submit" fullWidth size="lg">
          Send reset link
        </Button>
      </form>
    </AuthShell>
  );
}
