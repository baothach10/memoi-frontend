import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ categoryId: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const category = resolvedParams.categoryId?.toLowerCase() || '';
    
    if (category === 'dresses') {
        return {
            title: 'Luxury Dresses | Quiet Elegance & Timeless Style | MEMOÍ',
            description: 'Discover our curated collection of fluid, minimalist dresses. Designed for grace and quiet confidence, these are foundational pieces for your wardrobe.'
        };
    } else if (category === 'pants' || category === 'trousers') {
        return {
            title: 'Refined Trousers & Pants | Modern Tailoring | MEMOÍ',
            description: 'Elevate your everyday style with our premium pants. Featuring soft, structured silhouettes that offer both comfort and intentional, timeless design.'
        };
    } else if (category === 'shorts') {
        return {
            title: 'Tailored Shorts | Sophisticated Comfort | MEMOÍ',
            description: 'Discover versatile, tailored shorts from MEMOÍ. Crafted with precision for the modern woman who embraces quiet elegance and effortless style.'
        };
    } else if (category === 'tops') {
        return {
            title: 'Refined Tops & Blouses | Timeless Versatility | MEMOÍ',
            description: 'Explore our curated tops and blouses. From delicate textures to clean lines, find the perfect piece to honor your individual rhythm and grace.'
        };
    }
    
    return {
        title: `${resolvedParams.categoryId.charAt(0).toUpperCase() + resolvedParams.categoryId.slice(1)} | MEMOÍ`,
        description: `Explore our ${resolvedParams.categoryId} collection at MEMOÍ.`
    };
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
