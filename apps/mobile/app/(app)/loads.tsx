import { ScreenScaffold } from '../../src/components/ScreenScaffold';

/** Loads — the driver's assigned loads and their current status. */
export default function LoadsScreen() {
  return (
    <ScreenScaffold
      title="My Loads"
      description="See the loads assigned to you, with pickup and delivery details, and update status as you go."
      icon="cube"
      upcoming={[
        'View assigned and upcoming loads',
        'Pickup and delivery windows with addresses',
        'Update load status from the road',
        'Turn-by-turn handoff to your maps app',
      ]}
    />
  );
}
