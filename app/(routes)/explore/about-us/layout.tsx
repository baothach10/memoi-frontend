import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story | Empowering Quiet Elegance | MEMOÍ',
  description: 'Founded in 2025, MEMOÍ is a luxury fashion house dedicated to the modern woman. Discover our philosophy of conscious elegance, self-expression, and grace.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
