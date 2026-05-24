import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request an Exchange | MEMOÍ Concierge',
  description: 'Need to adjust your size? Initiate your one-time exchange request here. Please ensure your request is submitted within 7 days of receiving your order.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
