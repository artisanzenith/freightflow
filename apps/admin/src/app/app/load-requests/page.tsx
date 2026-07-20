import { redirect } from 'next/navigation';
import { canAccessNav } from '@freightflow/shared';

import { getAppUser } from '@/lib/auth/user';
import { PagePlaceholder } from '@/components/app/PagePlaceholder';

/** Load Requests — inbound freight opportunities before they become loads. */
export default async function LoadRequestsPage() {
  const user = await getAppUser();
  if (user && !canAccessNav(user.role, 'load-requests')) redirect('/app');

  return (
    <PagePlaceholder
      title="Load Requests"
      description="Review inbound freight opportunities, quote rates, and convert accepted requests into active loads."
      icon="inbox"
      upcoming={[
        'Capture requests from brokers and load boards',
        'Quote and negotiate rates',
        'Accept, reject, or let requests expire',
        'Convert accepted requests into active loads',
      ]}
    />
  );
}
