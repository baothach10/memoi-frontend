import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | How We Protect Your Data | MEMOÍ',
  description: 'Your privacy is a priority at MEMOÍ. Read our policy to understand how we collect, use, and protect your personal information with complete transparency.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
