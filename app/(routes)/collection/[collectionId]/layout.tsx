import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Becoming | Our First Collection | MEMOÍ',
  description: 'Discover "The Becoming," the debut collection from MEMOÍ. A journey of quiet confidence, fluid silhouettes, and intentional design for the modern woman.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
