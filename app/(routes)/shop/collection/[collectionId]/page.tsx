'use client'
import ShopByCollectionPage from "@/components/ui/pages/shop/ShopByCollectionPage"
import { useParams } from "next/navigation"


function CollectionsPage() {
    const { collectionId } = useParams()
    return (
        <ShopByCollectionPage collection={collectionId as string} />
    )
}

export default CollectionsPage