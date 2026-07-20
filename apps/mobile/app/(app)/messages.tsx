import { ScreenScaffold } from '../../src/components/ScreenScaffold';

/** Messages — stay in touch with dispatch. */
export default function MessagesScreen() {
  return (
    <ScreenScaffold
      title="Messages"
      description="Chat with dispatch about your loads, share photos, and keep everyone in the loop."
      icon="chatbubbles"
      upcoming={[
        'Direct chat with dispatch',
        'Load-scoped conversations',
        'Share document and photo attachments',
        'Push notifications for new messages',
      ]}
    />
  );
}
