import Link from 'next/link';

import { AuthShell } from '@/components/auth/AuthShell';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

/** Password-reset request page. Sends a recovery email via Supabase. */
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
      <ResetPasswordForm />
    </AuthShell>
  );
}
