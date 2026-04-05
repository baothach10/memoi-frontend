"use client";

import { useParams } from "next/navigation";
import ImageColumn from "@/components/ui/pages/product/ImageColumn";
import MobileImageCarousel from "@/components/ui/pages/product/MobileImageCarousel";
import ProductInfo from "@/components/ui/pages/product/ProductInfo";
import { useProductDetailsQuery } from "@/queries/useProductDetailsQuery";
import Footer from "@/components/ui/organisms/Footer";
import ProductDetailsSuggestions from "@/components/ui/organisms/ProductDetailsSuggestions";

export default function ProductPage() {
  const params = useParams();
  const productId = parseInt(params.productId as string);

  const {
    data: product,
    isLoading,
    isFetching,
    isError,
  } = useProductDetailsQuery(productId);

  if (isLoading || isFetching) {
    return (
      <div className="relative w-full h-full bg-[#fffefa]">
        <section
          data-header-theme="light"
          className="min-h-svh w-full text-black gap-16 pb-20 pt-36 relative flex flex-col items-center justify-center text-center max-mobile:gap-10 max-mobile:py-10 max-mobile:text-sm"
        >
          <div>Loading product...</div>
        </section>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="relative w-full h-full bg-[#fffefa]">
        <section
          data-header-theme="light"
          className="min-h-svh w-full text-black gap-16 pb-20 pt-36 relative flex flex-col items-center justify-center text-center max-mobile:gap-10 max-mobile:py-10 max-mobile:text-sm"
        >
          <div>Failed to load product...</div>
        </section>
      </div>
    );
  }

  const imageUrls = product.images
    .sort((a, b) => a.order - b.order)
    .map((img) => img.url);

  return (
    <div
      className="relative w-full h-full bg-[#fffefa] flex flex-col gap-20 max-tablet:gap-10"
      data-header-theme="light"
    >
      {/* Desktop: side-by-side grid layout */}
      <section className="relative grid grid-cols-10 max-tablet:hidden">
        <div className="col-span-6 pt-30 min-h-[calc(100vh-120px)]">
          <ImageColumn images={imageUrls} />
        </div>
        <div className="col-span-4">
          <ProductInfo product={product} />
        </div>
      </section>

      {/* Tablet/Mobile: stacked vertical layout */}
      <section className="relative tablet:hidden flex flex-col max-mobile:pt-24">
        {/* Swipeable image carousel */}
        <div className="pt-16 max-tablet:pt-0">
          <MobileImageCarousel images={imageUrls} />
        </div>

        {/* Product info (non-sticky, flows below carousel) */}
        <div className="px-10 max-mobile:px-5">
          <ProductInfo product={product} isMobileLayout />
        </div>
      </section>

      {/* "You may also like" suggestions */}
      <section className="relative flex flex-col gap-8 items-center justify-center max-mobile:gap-6">
        <div className="uppercase text-[16px] font-regular leading-[120%] text-black max-mobile:text-sm">
          You may also like
        </div>
        <ProductDetailsSuggestions
          numberOfSuggestions={4}
          gridClassName="max-tablet:hidden grid grid-cols-4 gap-2.5 max-tablet:grid-cols-2 w-full px-2.5 smaller-tablet:max-tablet:px-10 max-mobile:px-5"
        />
        <ProductDetailsSuggestions
          numberOfSuggestions={2}
          gridClassName="hidden max-tablet:grid grid-cols-4 gap-2.5 max-tablet:grid-cols-2 w-full px-2.5 smaller-tablet:max-tablet:px-10 max-mobile:px-5"
        />
      </section>

      <Footer />
    </div>
  );
}

