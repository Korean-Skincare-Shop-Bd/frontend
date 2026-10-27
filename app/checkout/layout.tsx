import type { Metadata } from 'next';
import { connection } from 'next/server';
import { BkashEnabledProvider } from './bkash-flag';

export const metadata: Metadata = {
  title: 'Checkout | Korean Skincare Shop BD',
  description: 'Complete your order securely. Fast and safe payment options for your Korean skincare products.',
  keywords: ['checkout', 'payment', 'secure checkout', 'Korean skincare purchase'],
  robots: {
    index: false,
    follow: true,
  },
};

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Opt into per-request rendering so the runtime env var is read live, not at build time.
  await connection();
  const bkashEnabled = process.env.BKASH_ENABLED === 'true';

  return (
    <BkashEnabledProvider value={bkashEnabled}>{children}</BkashEnabledProvider>
  );
}
