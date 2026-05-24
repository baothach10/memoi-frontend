import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Commitments | Ethical Craftsmanship & Conscious Elegance | MEMOÍ',
  description: 'At MEMOÍ, we believe in conscious elegance. Explore our commitment to ethical, sustainable production and timeless, high-quality design for the modern woman.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
