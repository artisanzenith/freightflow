import { PagePlaceholder } from '@/components/app/PagePlaceholder';

/** Active Loads — the dispatch board for loads in flight. */
export default function ActiveLoadsPage() {
  return (
    <PagePlaceholder
      title="Active Loads"
      description="Track every load from assignment to delivery, with driver, truck, and trailer assignments and a full status history."
      icon="truck"
      upcoming={[
        'Assign drivers, trucks, and trailers',
        'Move loads through the dispatch lifecycle',
        'Follow pickup and delivery windows',
        'See an append-only status history per load',
      ]}
    />
  );
}
