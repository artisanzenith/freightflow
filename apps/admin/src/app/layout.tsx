import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FreightFlow Admin',
  description: 'Dispatch operations portal for owner-operators and small fleets.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
