'use client'
import ProductsByCategoryPage from '@/components/ui/pages/shop/ProductsByCategoryPage'
import { useParams } from 'next/navigation'

function CategoriesPage() {
    const { categoryId } = useParams()

    return (
        <ProductsByCategoryPage category={categoryId as string} />
    )
}

export default CategoriesPage