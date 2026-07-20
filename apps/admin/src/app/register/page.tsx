import Link from 'next/link';

import { AuthShell } from '@/components/auth/AuthShell';
import { RegisterForm } from '@/components/auth/RegisterForm';

/** Registration page. Creates an account via the `signUp` server action. */
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
      <RegisterForm />
    </AuthShell>
  );
}
