import { useEffect, useRef, useState } from 'react'
import PaginationComponent from '../../molecules/Pagination';
import ShopInteractiveItem from './ShopInteractiveItem';
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useProductPaginatedByCollectionQuery } from '@/queries/useProductPaginatedByCollectionQuery';

gsap.registerPlugin(ScrollToPlugin);

type ShopByCollectionGridType = {
    collectionName: string
}

function ShopByCollectionGrid({ collectionName }: ShopByCollectionGridType) {
    const PAGE_SIZE = 12;
    const [currentPage, setCurrentPage] = useState(1)
    const {
        data,
        isFetching,
        isLoading,
        isError,
    } = useProductPaginatedByCollectionQuery({
        collection_name: collectionName,
        page_number: currentPage,
        page_limit: PAGE_SIZE,
    });
    const topRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!data || !topRef.current || isLoading || isFetching) return;

        gsap.to(window, {
            duration: 0.6,
            scrollTo: {
                y: topRef.current,
                offsetY: 40,
            },
            ease: "power2.in",
        });
    }, [data]);




    if (isLoading || isFetching) return (
        <div>Loading products...</div>
    )

    if (isError) return (
        <div>Failed to load products...</div>
    )

    return (
        <>
            <div ref={topRef} className='absolute top-0 left-0' />
            <div className="grid grid-cols-4 gap-2.5 max-tablet:grid-cols-2 max-mobile:grid-cols-2 w-full px-2.5 smaller-tablet:max-tablet:px-10 max-mobile:px-5">
                {data?.products.map((item) => (
                    <ShopInteractiveItem
                        key={item.product_id}
                        image={item.images[0].url}
                        hoveredImage={item.images[1].url}
                        name={item.name}
                        currency="SGD"
                        price={item.price}
                    />
                ))}
            </div>

            {
                data && data?.total_pages > 1 &&
                <PaginationComponent
                    totalPage={data?.total_pages ?? 1}
                    page={currentPage}
                    onChange={(page) => { setCurrentPage(page) }}
                />
            }
        </>
    )
}

export default ShopByCollectionGrid