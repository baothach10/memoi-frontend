import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Our Collections | MEMOÍ',
  description: 'Discover the world of MEMOÍ. Explore our curated collections and experience timeless elegance designed for the modern, independent woman.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
