import { ScreenScaffold } from '../../src/components/ScreenScaffold';

/** Documents — capture and view load paperwork from the field. */
export default function DocumentsScreen() {
  return (
    <ScreenScaffold
      title="Documents"
      description="Snap photos of BOLs and PODs, and access the paperwork attached to your loads."
      icon="document-text"
      upcoming={[
        'Capture BOLs and PODs with your camera',
        'Attach documents to the right load',
        'View rate confirmations and instructions',
        'Offline capture with automatic sync',
      ]}
    />
  );
}
