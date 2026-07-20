import { getAppUser } from '@/lib/auth/user';
import { DispatchDashboard } from '@/features/dispatch';

/**
 * Dashboard landing — the dispatch dashboard and core MVP experience. The
 * owner-operator flips "Available for Loads" on and our dispatch team takes it
 * from there. All workflow state is client-side (see the dispatch feature);
 * this server component only resolves the greeting name.
 */
export default async function DashboardPage() {
  const user = await getAppUser();
  const firstName = user?.fullName?.trim().split(/\s+/)[0] ?? '';

  return <DispatchDashboard greetingName={firstName} />;
}
