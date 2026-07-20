'use client';

import Link from 'next/link';
import { Button, FormField, Input } from '@freightflow/ui';

import { AuthShell } from '@/components/auth/AuthShell';

/**
 * Login page — UI only. The form does not submit anywhere yet; authentication
 * is wired up in a later phase.
 */
export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to your FreightFlow account to manage your dispatch."
      footer={
        <>
          Don’t have an account?{' '}
          <Link href="/register" className="font-semibold text-brand-600 hover:text-brand-700">
            Start free trial
          </Link>
        </>
      }
    >
      <form
        className="space-y-5"
        onSubmit={(e) => e.preventDefault()}
        aria-label="Log in"
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

        <FormField label="Password" required>
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

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-neutral-600">
            <input
              type="checkbox"
              name="remember"
              className="h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
            />
            Remember me
          </label>
          <Link
            href="/reset-password"
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth size="lg">
          Log in
        </Button>
      </form>
    </AuthShell>
  );
}
