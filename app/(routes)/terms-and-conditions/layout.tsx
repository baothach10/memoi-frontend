import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Shop Policy | MEMOÍ',
  description: 'Please review the MEMOÍ Terms & Conditions. By using our website and purchasing our collections, you agree to our policies regarding sales, shipping, and returns.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
