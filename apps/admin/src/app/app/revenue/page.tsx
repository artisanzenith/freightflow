import { redirect } from 'next/navigation';
import { canAccessNav } from '@freightflow/shared';

import { getAppUser } from '@/lib/auth/user';
import { PagePlaceholder } from '@/components/app/PagePlaceholder';

/** Revenue — income from delivered loads and invoicing (finance roles only). */
export default async function RevenuePage() {
  const user = await getAppUser();
  if (user && !canAccessNav(user.role, 'revenue')) redirect('/app');

  return (
    <PagePlaceholder
      title="Revenue"
      description="Record income from delivered loads, manage invoices, and follow payments through to settlement."
      icon="revenue"
      upcoming={[
        'Record revenue per load and payer',
        'Generate and track invoices',
        'Follow payment status through to paid',
        'Export to factoring and accounting tools',
      ]}
    />
  );
}
