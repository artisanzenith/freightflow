import { PagePlaceholder } from '@/components/app/PagePlaceholder';

/** Settings — company profile, team, and workspace preferences. */
export default function SettingsPage() {
  return (
    <PagePlaceholder
      title="Settings"
      description="Manage your company profile, team members and roles, and workspace preferences."
      icon="settings"
      upcoming={[
        'Company profile and carrier details (MC/DOT)',
        'Invite teammates and assign roles',
        'Manage trucks and trailers',
        'Configure workspace preferences',
      ]}
    />
  );
}
