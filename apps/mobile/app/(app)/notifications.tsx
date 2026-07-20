import { ScreenScaffold } from '../../src/components/ScreenScaffold';

/** Alerts — load assignments, updates, and reminders. */
export default function NotificationsScreen() {
  return (
    <ScreenScaffold
      title="Alerts"
      description="Get notified about new load assignments, schedule changes, and paperwork you still owe."
      icon="notifications"
      upcoming={[
        'New load assignment alerts',
        'Pickup and delivery reminders',
        'Missing-document nudges',
        'Mark alerts as read',
      ]}
    />
  );
}
