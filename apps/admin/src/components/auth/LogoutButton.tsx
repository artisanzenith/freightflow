'use client';

import { signOut } from '@/lib/auth/actions';
import { SubmitButton } from './SubmitButton';

/** Logs the current user out via the `signOut` server action. */
export function LogoutButton() {
  return (
    <form action={signOut}>
      <SubmitButton variant="outline" size="sm" pendingLabel="Signing out…">
        Log out
      </SubmitButton>
    </form>
  );
}
