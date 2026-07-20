import { PagePlaceholder } from '@/components/app/PagePlaceholder';

/** Messages — in-app communication between dispatch and drivers. */
export default function MessagesPage() {
  return (
    <PagePlaceholder
      title="Messages"
      description="Communicate with drivers and teammates in context, tied to the loads you’re working on."
      icon="messages"
      upcoming={[
        'Direct and load-scoped conversations',
        'Share document attachments in threads',
        'Read receipts and unread indicators',
        'System messages for load status changes',
      ]}
    />
  );
}
