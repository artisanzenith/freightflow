import { ScreenScaffold } from '../../src/components/ScreenScaffold';

/** More — profile, expenses, and app settings. */
export default function MoreScreen() {
  return (
    <ScreenScaffold
      title="More"
      description="Your profile, expense logging, and app settings live here."
      icon="ellipsis-horizontal"
      upcoming={[
        'View and edit your driver profile',
        'Log fuel and other expenses on the go',
        'App preferences and notifications',
        'Sign out',
      ]}
    />
  );
}
