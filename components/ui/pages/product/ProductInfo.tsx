"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ProductDetailsResponse } from "@/app/api/getProductDetails";
import Link from "next/link";
import DetailsOverlay from "../../organisms/DetailsOverlay";
import ShippingPolicyOverlay from "../../organisms/ShippingPolicyOverlay";
import SizingOverlay from "../../organisms/SizingOverlay";
import SizeSuggestionOverlay from "../../organisms/SizeSuggestionOverlay";
import { addItemToCart } from "@/utils/cartUtils";
import { useUpdateCart } from "@/queries/useUpdateCart";
import { useRouter } from "next/navigation";

interface ProductInfoProps {
  product: ProductDetailsResponse;
  isMobileLayout?: boolean;
}

export default function ProductInfo({ product, isMobileLayout = false }: ProductInfoProps) {
  /* ---------------------------------------------
   * COLORS
   --------------------------------------------- */
  // const colors = useMemo(
  //   () => Array.from(new Set(product.variants.map((v) => v.color))),
  //   [product.variants]
  // );
  const [showSizeOverlay, setShowSizeOverlay] = useState(false);
  const [showSizeBuyNowOverlay, setShowSizeBuyNowOverlay] = useState(false);
  const [showDetailsOverlay, setShowDetailsOverlay] = useState(false);
  const [showShippingOverlay, setShowShippingOverlay] = useState(false);
  const [showSizingOverlay, setShowSizingOverlay] = useState(false);
  const [showSizeSuggestion, setShowSizeSuggestion] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);

  const overlayBuyNowRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  /* ---------------------------------------------
   * SIZES (stock-aware, per color)
   --------------------------------------------- */
  const sizes = useMemo(() => {
    return product.variants
      .map((v) => ({
        size: v.size,
        stock: v.stock,
        price: v.price,
        sale_price: v.sale_price || null,
      }));
  }, [product.variants]);

  const displayPrice = product.variants[0].price;

  const displaySalePrice = product.variants[0].sale_price || null;

  /* ---------------------------------------------
   * GSAP overlay animation
   --------------------------------------------- */
  useEffect(() => {
    if (!overlayRef.current) return;

    gsap.to(overlayRef.current, {
      autoAlpha: showSizeOverlay ? 1 : 0,
      scale: showSizeOverlay ? 1 : 0.96,
      duration: 0.25,
      ease: "power2.out",
      pointerEvents: showSizeOverlay ? "auto" : "none",
    });
  }, [showSizeOverlay]);

  useEffect(() => {
    if (!overlayBuyNowRef.current) return;

    gsap.to(overlayBuyNowRef.current, {
      autoAlpha: showSizeBuyNowOverlay ? 1 : 0,
      scale: showSizeBuyNowOverlay ? 1 : 0.96,
      duration: 0.25,
      ease: "power2.out",
      pointerEvents: showSizeBuyNowOverlay ? "auto" : "none",
    });
  }, [showSizeBuyNowOverlay]);

  /* ---------------------------------------------
   * ACTIONS
   --------------------------------------------- */
  const closeAllOverlays = () => {
    setShowSizeOverlay(false);
    setShowSizeBuyNowOverlay(false);
    setShowDetailsOverlay(false);
    setShowShippingOverlay(false);
    setShowSizingOverlay(false);
    setShowSizeSuggestion(false);
  };

  const handleAddToCartClick = () => {
    closeAllOverlays();
    setShowSizeOverlay(true);
  };

  const handleBuyNowClick = () => {
    closeAllOverlays();
    setShowSizeBuyNowOverlay(true);
  };

  const updateCartMutation = useUpdateCart();

  const handleSizeSelect = async (size: string, price: number) => {


    // Find the variant for the selected size to get its ID
    const variant = product.variants.find(v => v.size === size);
    if (!variant) return;

    const updatedItems = addItemToCart({
      product_id: variant.id, // Use variant ID instead of product.product_id
      productName: product.name,
      productImage: product.images[0].url,
      stock: variant.stock,
      color_name: product.color_name,
      quantity: 1,
      sale_price: variant.sale_price ? variant.sale_price : undefined,
      size,
      price,
    });

    await updateCartMutation.mutateAsync({ products: updatedItems });
    closeAllOverlays();
  };

  const handleBuyNowSizeSelect = async (size: string, price: number) => {
    await handleSizeSelect(size, price);
    // Redirect to checkout page after adding to cart
    router.push("/checkout");
  };

  /* ---------------------------------------------
   * RENDER
   --------------------------------------------- */
  return (
    <div className={isMobileLayout ? "flex items-center justify-center py-8" : "sticky top-0 h-dvh flex items-center justify-center"}>
      {/* BACKDROP */}
      {(showSizeOverlay || showSizeBuyNowOverlay) && (
        <div
          onClick={closeAllOverlays}
          className="fixed inset-0 z-5 bg-transparent"
        />
      )}

      <div className="px-12 flex flex-col items-center justify-center w-full">
        {/* CATEGORY */}
        <p className="text-xs font-regular text-black/40 mb-2">
          {product.category.name.toUpperCase()}
        </p>

        {/* NAME */}
        <h1 className="text-2xl font-regular mb-4 text-center uppercase max-mobile:text-lg max-mobile:mb-3">
          {product.name}
        </h1>

        {/* PRICE */}
        <div className="flex items-center justify-center text-center gap-2.5 max-mobile:gap-3 max-tablet:gap-4">
          <p className={`text-[16px] mb-8 text-center font-regular ${displaySalePrice ? 'line-through text-black/40' : ''} max-mobile:text-sm max-mobile:mb-6`}>
            {product.currency} {displayPrice.toFixed(2)}
          </p>
          {displaySalePrice && (
            <p className="text-[16px] mb-8 text-center font-regular max-mobile:text-sm max-mobile:mb-6">
              {product.currency} {displaySalePrice.toFixed(2)}
            </p>
          )}
        </div>

        {/* COLOR SELECTOR */}
        <div className="mb-10 flex flex-col items-center justify-center text-center max-mobile:mb-6">
          <div className="flex gap-2">
            <div className="relative w-4 h-4 flex items-center justify-center">
              {/* Outer ring (with offset) */}
              <span className="absolute inset-0 rounded-full ring-1 ring-black/20 ring-offset-2 ring-offset-white" />

              {/* Inner ring + color */}
              <span
                style={{ backgroundColor: product.color }}
                className="relative z-10 w-3 h-3 rounded-full ring-1 ring-black/20"
              />
            </div>

            {product.colors.map((colorData, id) => (
              <Link
                key={id}
                // onClick={() => setSelectedColor(colorData.color)}
                href={`/product/${colorData.product_id}`}
                className="relative w-4 h-4 flex items-center cursor-pointer justify-center rounded-full"
              >
                {/* Inner base ring + color */}
                <span
                  style={{ backgroundColor: colorData.color }}
                  className="relative z-10 w-3 h-3 rounded-full ring-1 ring-black/20"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* ADD TO CART + SIZE OVERLAY */}
        <div className="relative w-1/2 mb-6 flex flex-col items-center max-tablet:w-2/3 max-mobile:w-full max-mobile:mb-6">
          {/* SIZE OVERLAY */}
          <div
            ref={overlayRef}
            className="
              absolute left-0 z-10
              w-1/2
              bg-[#FFFEFA] border border-neutral-300 shadow-lg
              flex flex-col items-center justify-center
              gap-4 py-8 text-sm
              opacity-0 pointer-events-none
              max-mobile:text-xs
              max-mobile:gap-5
            "
          >
            {sizes.map(({ size, stock, price, sale_price }) => {
              const disabled = stock === 0;

              return (
                <button
                  key={size}
                  disabled={disabled}
                  onClick={() => !disabled && handleSizeSelect(size, sale_price ? sale_price : price)}
                  className={`x
                    transition
                    ${disabled
                      ? "opacity-40 line-through cursor-not-allowed"
                      : "hover:underline decoration-black/40 underline-offset-4 cursor-pointer"
                    }
                  `}
                >
                  {size}
                </button>
              );
            })}

            <button onClick={() => { closeAllOverlays(); setShowSizeSuggestion(true); }} className="underline cursor-pointer decoration-black/40 underline-offset-4">
              Size Suggestion
            </button>
          </div>

          <div
            ref={overlayBuyNowRef}
            className="
              absolute right-0 z-10
              w-1/2
              bg-[#FFFEFA] border border-neutral-300 shadow-lg
              flex flex-col items-center justify-center
              gap-4 py-8 text-sm
              opacity-0 pointer-events-none
              max-mobile:text-xs
              max-mobile:gap-5
            "
          >
            {sizes.map(({ size, stock, price }) => {
              const disabled = stock === 0;

              return (
                <button
                  key={size}
                  disabled={disabled}
                  onClick={() => !disabled && handleBuyNowSizeSelect(size, price)}
                  className={`x
                    transition
                    ${disabled
                      ? "opacity-40 line-through cursor-not-allowed"
                      : "hover:underline decoration-black/40 underline-offset-4 cursor-pointer"
                    }
                  `}
                >
                  {size}
                </button>
              );
            })}

            <button onClick={() => { closeAllOverlays(); setShowSizeSuggestion(true); }} className="underline cursor-pointer decoration-black/40 underline-offset-4">
              Size Suggestion
            </button>
          </div>

          {/* ADD TO CART + BUY NOW BUTTONS */}
          <div className="flex w-full gap-2.5">
            <button
              onClick={handleAddToCartClick}
              className="w-1/2 bg-[#FFFEFA] border border-neutral-300 text-black hover:bg-black hover:border-black hover:text-white transition py-4 cursor-pointer leading-none text-sm max-mobile:py-3 max-mobile:w-full max-mobile:text-xs"
            >
              Add to cart
            </button>
            <button
              onClick={handleBuyNowClick}
              className="w-1/2 bg-black text-white py-4 cursor-pointer leading-none text-sm max-mobile:py-3 max-mobile:w-full max-mobile:text-xs"
            >
              Buy now
            </button>
          </div>
        </div>

        {/* FOOTER LINKS */}
        <div className="flex gap-6 text-sm underline underline-offset-4 decoration-black/40 mt-4 max-mobile:text-xs max-mobile:mt-0">
          <button className="cursor-pointer whitespace-nowrap" onClick={() => { closeAllOverlays(); setShowDetailsOverlay(true); }}>Details</button>
          <button className="cursor-pointer whitespace-nowrap" onClick={() => { closeAllOverlays(); setShowSizingOverlay(true); }}>Sizing</button>
          <button className="cursor-pointer whitespace-nowrap" onClick={() => { closeAllOverlays(); setShowShippingOverlay(true); }}>Shipping & Exchanges</button>
        </div>

        <DetailsOverlay
          isOpen={showDetailsOverlay}
          onClose={() => setShowDetailsOverlay(false)}
          description={product.description}
        />

        <ShippingPolicyOverlay
          isOpen={showShippingOverlay}
          onClose={() => setShowShippingOverlay(false)}
        />

        <SizingOverlay
          isOpen={showSizingOverlay}
          onClose={() => setShowSizingOverlay(false)}
        />

        <SizeSuggestionOverlay
          isOpen={showSizeSuggestion}
          onClose={() => setShowSizeSuggestion(false)}
          aiNotes={product.ai_notes}
          onAddSize={(size) => {
            const variant = product.variants.find((v) => v.size.toLowerCase() === size.toLowerCase());
            if (variant) {
              handleSizeSelect(variant.size, variant.sale_price ? variant.sale_price : variant.price);
            }
            setShowSizeSuggestion(false);
          }}
        />
      </div>
    </div>
  );
}
