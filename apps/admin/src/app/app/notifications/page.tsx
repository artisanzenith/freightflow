import { PagePlaceholder } from '@/components/app/PagePlaceholder';

/** Notifications — alerts for loads, documents, messages, and payments. */
export default function NotificationsPage() {
  return (
    <PagePlaceholder
      title="Notifications"
      description="Stay on top of what needs your attention across loads, documents, messages, and payments."
      icon="bell"
      upcoming={[
        'Real-time alerts for load and status changes',
        'Document and payment reminders',
        'Per-user read/unread state',
        'Push notifications to the driver app',
      ]}
    />
  );
}
