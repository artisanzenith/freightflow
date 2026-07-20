import Link from 'next/link';

import { AuthShell } from '@/components/auth/AuthShell';
import { UpdatePasswordForm } from '@/components/auth/UpdatePasswordForm';

/**
 * Set-a-new-password page. Reached after clicking a recovery link, which routes
 * through /auth/callback to establish a recovery session before landing here.
 */
export default function UpdatePasswordPage() {
  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a strong password you don’t use anywhere else."
      footer={
        <>
          Changed your mind?{' '}
          <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Back to log in
          </Link>
        </>
      }
    >
      <UpdatePasswordForm />
    </AuthShell>
  );
}
