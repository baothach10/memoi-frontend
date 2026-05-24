import { Metadata } from 'next';
import { getProductDetails } from '@/app/api/getProductDetails';

export async function generateMetadata({ params }: { params: Promise<{ productId: string }> }): Promise<Metadata> {
    try {
        const resolvedParams = await params;
        const productId = parseInt(resolvedParams.productId);
        
        if (isNaN(productId)) {
            return {
                title: 'Product | MEMOÍ',
                description: 'Discover refined luxury with MEMOÍ.',
            };
        }

        const product = await getProductDetails(productId);

        return {
            title: product.seo_title,
            description: product.seo_meta_description,
        };
    } catch (error) {
        return {
            title: 'Product | MEMOÍ',
            description: 'Discover refined luxury with MEMOÍ.',
        };
    }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
