"use client";

import HeroSection from "@/components/ui/pages/home/HeroSection";
import { useCategoriesQuery } from "@/queries/useCategoriesQuery";
import Link from "next/link";

export default function GeneralShopPage() {

    const {
        data: itemsList,
        isFetching,
        isLoading,
        isError,
    } = useCategoriesQuery();

    // Example content
    const exampleWithLinks = {
        media: [
            {
                type: "image" as const,
                src: "/images/shop-menu.webp",
            },
            {
                type: "image" as const,
                src: "/images/shop-menu.webp",
            },
            {
                type: "image" as const,
                src: "/images/shop-menu.webp",
            },
        ]
    };

    if (isLoading || isFetching) return (
        <div className="relative w-full h-full bg-[#fffefa]">
            <section className="h-screen" data-header-theme="dark">
                <div>Loading products...</div>
            </section>
        </div>
    )

    if (isError) return (

        <div className="relative w-full h-full bg-[#fffefa]">
            <section className="h-screen" data-header-theme="dark">
                <div>Failed to load products...</div>
            </section>
        </div>
    )
    return (
        <div className="relative w-full h-full bg-[#fffefa]">
            <div
                className={`h-screen overflow-hidden`}
            >
                <section className="h-screen" data-header-theme="dark">
                    <div className="relative h-full w-full">
                        <HeroSection
                            media={exampleWithLinks.media[0]}
                            tabletMedia={exampleWithLinks.media[1]}
                            mobileMedia={exampleWithLinks.media[2]}
                        />
                        <div className="text-white gap-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-1">
                            <div className="gap-3 flex flex-col items-center justify-center">

                                {itemsList && itemsList.map((category) => (
                                    <Link href={`/shop/category/${category.name}`} key={category.id}>
                                        <div className="text-[16px] capitalize">{category.name}</div>
                                    </Link>
                                ))}
                            </div>
                            <Link href={`/shop/all-products`}>
                                <div className="text-[16px]">All products</div>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
