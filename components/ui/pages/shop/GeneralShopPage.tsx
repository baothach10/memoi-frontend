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
    ],
  };

  const underlineLink =
    "relative leading-[18px] after:absolute after:left-0 after:-bottom-px after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-white/40 after:transition-transform after:duration-200 hover:after:scale-x-100";

  if (isLoading || isFetching)
    return (
      <div className="relative w-full h-full bg-[#fffefa]">
        <section className="min-h-dvh w-full text-black gap-16 pb-20 pt-36 relative flex flex-col items-center justify-center text-center max-mobile:gap-10 max-mobile:pb-10 max-mobile:text-sm max-mobile:pt-24" data-header-theme="dark">
          <div>Loading products...</div>
        </section>
      </div>
    );

  if (isError)
    return (
      <div className="relative w-full h-full bg-[#fffefa]">
        <section className="min-h-dvh w-full text-black gap-16 pb-20 pt-36 relative flex flex-col items-center justify-center text-center max-mobile:gap-10 max-mobile:pb-10 max-mobile:text-sm max-mobile:pt-24" data-header-theme="dark">
          <div>Failed to load products...</div>
        </section>
      </div>
    );
  return (
    <div className="relative w-full h-full bg-[#fffefa]">
      <div className={`h-dvh overflow-hidden`}>
        <div className="h-dvh" data-header-theme="dark">
          <div className="relative h-full w-full">
            <HeroSection
              media={exampleWithLinks.media[0]}
              tabletMedia={exampleWithLinks.media[1]}
              mobileMedia={exampleWithLinks.media[2]}
            />
            <section className="text-white gap-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-1">
              <div className="gap-3 flex flex-col items-center justify-center">
                {itemsList &&
                  itemsList.map((category) => (
                    <Link
                      className="flex"
                      href={`/shop/category/${category.name}`}
                      key={category.id}
                    >
                      <span
                        className={`text-[16px] capitalize ${underlineLink}`}
                      >
                        {category.name}
                      </span>
                    </Link>
                  ))}
              </div>
              <Link href={`/shop/all-products`} className="flex">
                <span className={`text-[16px] ${underlineLink}`}>
                  All products
                </span>
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
