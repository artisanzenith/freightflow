import { Suspense } from 'react';
import Link from 'next/link';

import { AuthShell } from '@/components/auth/AuthShell';
import { LoginForm } from '@/components/auth/LoginForm';

/**
 * Login page. The form itself is a client component (it reads the `redirectTo`
 * query param and manages action state), wrapped in Suspense as required by
 * `useSearchParams`.
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
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
