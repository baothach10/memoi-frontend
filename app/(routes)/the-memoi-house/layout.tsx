import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The MEMOÍ House | Exclusive Membership & Privileges',
  description: 'Welcome to The MEMOÍ House. An intimate collective for our community. Enjoy private access to collections, priority experiences, and refined privileges.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
