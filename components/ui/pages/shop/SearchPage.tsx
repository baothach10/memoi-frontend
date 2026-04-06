"use client";

import { useState, useRef, useEffect } from "react";
import PaginationComponent from "../../molecules/Pagination";
import Footer from "../../organisms/Footer";
import ShopInteractiveItem from "./ShopInteractiveItem";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useSearchProductsQuery } from "@/queries/useSearchProductsQuery";
import SearchProductSuggestions from "../../organisms/SearchProductSuggestions";

gsap.registerPlugin(ScrollToPlugin);

type SearchPageProps = {
  searchQuery: string;
};

export default function SearchPage({ searchQuery }: SearchPageProps) {
  const PAGE_SIZE = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isFetching, isLoading, isError } = useSearchProductsQuery({
    search_query: searchQuery,
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
  }, [data, isFetching, isLoading]);

  if (isLoading || isFetching)
    return (
      <div className="relative w-full h-full bg-[#fffefa]">
        <section
          data-header-theme="light"
          className="min-h-dvh w-full text-black gap-16 pb-20 pt-36 relative flex flex-col items-center justify-center text-center max-mobile:gap-10 max-mobile:pb-10 max-mobile:text-sm max-mobile:pt-24"
        >
          <div>Searching...</div>
        </section>
      </div>
    );

  if (isError)
    return (
      <div className="relative w-full h-full bg-[#fffefa]">
        <section
          data-header-theme="light"
          className="min-h-dvh w-full text-black gap-16 pb-20 pt-36 relative flex flex-col items-center justify-center text-center max-mobile:gap-10 max-mobile:pb-10 max-mobile:text-sm max-mobile:pt-24"
        >
          <div>Failed to search products...</div>
        </section>
      </div>
    );

  if (!searchQuery.trim())
    return (
      <div className="relative w-full h-full bg-[#fffefa]">
        <section
          data-header-theme="light"
          className="min-h-dvh w-full text-black gap-16 pb-20 pt-36 relative flex flex-col items-center text-center max-mobile:gap-10 max-mobile:pb-10 max-mobile:pt-24"
        >
          <div>Please enter a search query</div>
        </section>
      </div>
    );

  const hasResults = data?.total_products && data.total_products > 0;

  return (
    <div className="relative w-full h-full bg-[#fffefa]">
      <section
        data-header-theme="light"
        className="min-h-dvh w-full text-black gap-16 pb-20 pt-36 relative flex flex-col items-center text-center max-mobile:gap-10 max-mobile:pb-10 max-mobile:pt-24"
      >
        <div className="mx-auto text-center space-y-2">
          <div className="text-black leading-[1.2] text-2xl max-mobile:text-lg">
            <div className="flex flex-wrap justify-center gap-4 font-regular">
              <div className={`transition-colors decoration-white/40 uppercase`}>
                <span>Result for</span> &quot;
                {searchQuery}&quot;
              </div>
            </div>
          </div>
          {hasResults ? (
            <div className="text-black/60 text-[14px]">
              {data.total_products} products
            </div>
          ) : (
            <div className="text-[14px] text-black/60 max-mobile:text-xs">
              Sorry, there are no results for your search &quot;{searchQuery}&quot;.
              <br />
              Please try again or consult our bestsellers
            </div>
          )}
        </div>

        {hasResults ? (
          <>
            <div ref={topRef} className="absolute top-0 left-0" />
            <div className="grid grid-cols-4 gap-2.5 max-tablet:grid-cols-2 max-mobile:grid-cols-2 w-full px-2.5 smaller-tablet:max-tablet:px-10 max-mobile:px-5">
              {data?.products.map((item) => (
                <ShopInteractiveItem
                  key={item.product_id}
                  id={item.product_id}
                  image={item.images[0]?.url || ""}
                  hoveredImage={item.images[1]?.url || item.images[0]?.url || ""}
                  name={item.name}
                  currency={item.currency}
                  price={item.price}
                />
              ))}
            </div>
            {data && data?.total_pages > 1 && (
              <PaginationComponent
                totalPage={data?.total_pages ?? 1}
                page={currentPage}
                onChange={(page) => {
                  setCurrentPage(page);
                }}
              />
            )}
          </>
        ) : (
          <div className="w-full px-2.5 smaller-tablet:max-tablet:px-10 max-mobile:px-5">
            <SearchProductSuggestions
              numberOfSuggestions={8}
              gridClassName="grid grid-cols-4 gap-2.5 max-tablet:grid-cols-2 max-mobile:grid-cols-2"
            />
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
