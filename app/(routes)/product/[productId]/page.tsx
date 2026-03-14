"use client";

import { useParams } from "next/navigation";
import ImageColumn from "@/components/ui/pages/product/ImageColumn";
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
          className="min-h-screen w-full text-black gap-16 pb-20 pt-36 relative flex items-center justify-center text-center max-mobile:gap-10 max-mobile:pb-10 max-mobile:pt-16"
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
          className="min-h-screen w-full text-black gap-16 pb-20 pt-36 relative flex items-center text-center justify-center max-mobile:gap-10 max-mobile:pb-10 max-mobile:pt-16"
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
      className="relative w-full h-full bg-[#fffefa] flex flex-col gap-20"
      data-header-theme="light"
    >
      <section className="relative grid grid-cols-10">
        <div className="col-span-6 pt-30 min-h-[calc(100vh-120px)]">
          <ImageColumn images={imageUrls} />
        </div>
        <div className="col-span-4 ">
          <ProductInfo product={product} />
        </div>
      </section>
      <section className="relative flex flex-col gap-8 items-center justify-center">
        <div className="uppercase text-[16px] leading-[120%] text-black">You may also like</div>
        <ProductDetailsSuggestions numberOfSuggestions={4} />
      </section>
      <Footer />
    </div>
  );
}
