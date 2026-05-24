import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop All Collections | Dresses, Tops & More | MEMOÍ',
  description: 'Shop the full MEMOÍ range. From premium dresses and tops to refined pants and shorts, find your perfect fit with our timeless, elegant essentials.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
