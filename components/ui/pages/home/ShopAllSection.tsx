"use client";

import Link from "next/link";
import { forwardRef } from "react";
import ShopInteractiveItem from "@/components/ui/pages/shop/ShopInteractiveItem";
import { useCurrency } from "@/context/CurrencyContext";
import { useProductSuggestionsQuery } from "@/queries/useProductSuggestionsQuery";

const ShopAllSection = forwardRef<HTMLElement>((_, ref) => {
  const { data: products, isLoading, isFetching, isError } =
    useProductSuggestionsQuery();
  const { currency } = useCurrency();

  const isLoadingState = isLoading || isFetching;

  return (
    <section
      ref={ref}
      className="h-full relative w-full flex flex-col bg-[#fffefa]"
      data-header-theme="light"
    >
      <div className="flex relative h-full flex-col items-center justify-between px-2.5 pt-30 smaller-tablet:max-tablet:px-10 max-tablet:gap-8 max-mobile:px-5 max-mobile:pt-24 max-mobile:gap-4">
        <h2 className="shrink-0 uppercase text-2xl font-regular text-black leading-none max-mobile:text-sm">
          Shop all
        </h2>

        {isLoadingState ? (
          <div className="text-black text-sm max-mobile:text-xs">Loading...</div>
        ) : isError ? (
          <div className="text-black text-sm max-mobile:text-xs">
            Failed to load products...
          </div>
        ) : (
          <div className="flex relative w-full items-center">
            <div className="grid h-full max-h-full w-full min-h-0 grid-cols-4 gap-2.5 max-tablet:grid-cols-2 max-tablet:grid-rows-2 max-tablet:gap-2">
              {products?.slice(0, 4).map((product) => (
                <ShopInteractiveItem
                  key={product.id}
                  id={product.id}
                  image={product.images[0] || ""}
                  hoveredImage={product.images[1] || product.images[0] || ""}
                  name={product.name}
                  currency={currency ?? product.currency}
                  price={product.price}
                  salePrice={product.sale_price}
                />
              ))}
            </div>
          </div>
        )}

        <Link
          href="/shop/all-products"
          className="shrink-0 hover:bg-black bg-transparent hover:text-white text-black border border-black/10 px-22 py-5 text-sm leading-none cursor-pointer hover:opacity-90 transition max-mobile:px-16 max-mobile:py-3.5 max-mobile:text-xs"
        >
          View more
        </Link>
      </div>
    </section>
  );
});

ShopAllSection.displayName = "ShopAllSection";

export default ShopAllSection;
