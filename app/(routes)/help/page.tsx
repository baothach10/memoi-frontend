import { Metadata } from 'next';
import HelpPageClient from './HelpPageClient';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ tab?: string }> }): Promise<Metadata> {
    const resolvedParams = await searchParams;
    const tab = resolvedParams.tab?.toLowerCase() || 'shipping';
    
    if (tab === 'shipping') {
        return {
            title: 'FAQ | Shipping, Exchanges & Policies | MEMOÍ',
            description: 'Find answers to your questions regarding shipping, delivery times, and our exchange policy at MEMOÍ. We are here to ensure your experience is seamless.',
        };
    } else if (tab === 'orders') {
        return {
            title: 'Orders & Payment | Shopping Guide | MEMOÍ',
            description: 'Shop with confidence at MEMOÍ. Learn more about our secure payment options, ordering process, and how to manage your pre-orders and account details.',
        };
    } else if (tab === 'care') {
        return {
            title: 'Garment Care Guide | Preserving Your MEMOÍ Pieces | MEMOÍ',
            description: 'Learn how to care for your delicate, premium fabrics. Follow our expert guide to cleaning, storing, and preserving the longevity of your MEMOÍ garments.',
        };
    } else if (tab === 'house') {
        return {
            title: 'The MEMOÍ House | Membership Tiers & Privileges | MEMOÍ',
            description: 'Explore the tiers and exclusive benefits of The MEMOÍ House. Discover how your relationship with MEMOÍ grants you priority access and curated experiences.',
        };
    }
    
    // Default fallback
    return {
        title: 'Help Center | MEMOÍ',
        description: 'Find answers to your questions at the MEMOÍ Help Center.',
    };
}

export default function HelpPage() {
    return <HelpPageClient />;
}
