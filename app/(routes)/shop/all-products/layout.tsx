import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop All Collections | Refined Luxury Essentials | MEMOÍ',
  description: 'Discover the full MEMOÍ collection. Explore our range of refined, accessible luxury designed for the modern woman who moves with quiet confidence.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
