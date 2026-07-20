import { PagePlaceholder } from '@/components/app/PagePlaceholder';

/** Documents — the secure hub for rate cons, BOLs, PODs, and compliance docs. */
export default function DocumentsPage() {
  return (
    <PagePlaceholder
      title="Documents"
      description="Store rate confirmations, BOLs, PODs, and compliance documents securely, attached to the right load, truck, or driver."
      icon="documents"
      upcoming={[
        'Upload documents to private, company-scoped storage',
        'Attach files to loads, trucks, and drivers',
        'Organize with document categories',
        'Track expiration dates for compliance docs',
      ]}
    />
  );
}
