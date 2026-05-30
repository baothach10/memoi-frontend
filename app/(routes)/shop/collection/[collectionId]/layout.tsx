import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop "The Becoming" Collection | MEMOÍ',
  description: 'Explore the full "The Becoming" collection by MEMOÍ. Shop our signature fluid silhouettes, minimal structures, and intentional essentials.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
