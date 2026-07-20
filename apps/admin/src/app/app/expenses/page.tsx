import { redirect } from 'next/navigation';
import { canAccessNav } from '@freightflow/shared';

import { getAppUser } from '@/lib/auth/user';
import { PagePlaceholder } from '@/components/app/PagePlaceholder';

/** Expenses — costs logged against loads and trucks (finance roles only). */
export default async function ExpensesPage() {
  const user = await getAppUser();
  if (user && !canAccessNav(user.role, 'expenses')) redirect('/app');

  return (
    <PagePlaceholder
      title="Expenses"
      description="Log fuel, maintenance, tolls, and other costs against loads and trucks to understand true per-load profitability."
      icon="expenses"
      upcoming={[
        'Categorize expenses (fuel, maintenance, tolls, and more)',
        'Attach receipts from the document hub',
        'Tie costs to specific loads, trucks, and drivers',
        'Track payment status through to paid',
      ]}
    />
  );
}
