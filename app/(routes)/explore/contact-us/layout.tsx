import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Get in Touch with MEMOÍ',
  description: 'We are here to assist you. Connect with MEMOÍ via email, WhatsApp, or our social channels. We look forward to hearing from you.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
