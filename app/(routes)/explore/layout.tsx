import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore MEMOÍ | Our Story, House & Commitments',
  description: 'Get to know the world of MEMOÍ. Learn about our commitment to conscious elegance, join The MEMOÍ House, or get in touch with our team today.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
