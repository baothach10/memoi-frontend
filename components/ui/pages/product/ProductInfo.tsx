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
  const [showDetailsOverlay, setShowDetailsOverlay] = useState(false);
  const [showShippingOverlay, setShowShippingOverlay] = useState(false);
  const [showSizingOverlay, setShowSizingOverlay] = useState(false);
  const [showSizeSuggestion, setShowSizeSuggestion] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);

  /* ---------------------------------------------
   * SIZES (stock-aware, per color)
   --------------------------------------------- */
  const sizes = useMemo(() => {
    return product.variants
      .map((v) => ({
        size: v.size,
        stock: v.stock,
        price: v.price,
      }));
  }, [product.variants]);

  const displayPrice = product.variants[0].price;

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

  /* ---------------------------------------------
   * ACTIONS
   --------------------------------------------- */
  const handleAddToCartClick = () => {
    setShowSizeOverlay(true);
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
      size,
      price,
    });

    await updateCartMutation.mutateAsync({ products: updatedItems });
    setShowSizeOverlay(false);
  };

  /* ---------------------------------------------
   * RENDER
   --------------------------------------------- */
  return (
    <div className={isMobileLayout ? "flex items-center justify-center py-8" : "sticky top-0 h-screen flex items-center justify-center"}>
      {/* BACKDROP */}
      {showSizeOverlay && (
        <div
          onClick={() => setShowSizeOverlay(false)}
          className="fixed inset-0 z-5 bg-transparent"
        />
      )}

      <div className="px-16 flex flex-col items-center justify-center w-full">
        {/* CATEGORY */}
        <p className="text-xs font-regular text-black/40 mb-2">
          {product.category.name.toUpperCase()}
        </p>

        {/* NAME */}
        <h1 className="text-2xl font-regular mb-4 text-center uppercase max-mobile:text-lg">
          {product.name}
        </h1>

        {/* PRICE */}
        <p className="text-[16px] mb-8 text-center font-regular max-mobile:text-sm">{product.currency} {displayPrice.toFixed(2)}</p>

        {/* COLOR SELECTOR */}
        <div className="mb-10 flex flex-col items-center justify-center text-center max-mobile:mb-8">
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
                className="relative w-4 h-4 flex items-center justify-center rounded-full"
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
        <div className="relative w-full mb-6 flex flex-col items-center max-mobile:mb-8">
          {/* SIZE OVERLAY */}
          <div
            ref={overlayRef}
            className="
              absolute mx-auto z-10
              w-1/3 min-h-[200px]
              bg-[#FFFEFA] border border-neutral-300 shadow-lg
              flex flex-col items-center justify-center
              gap-3 py-6 text-sm
              opacity-0 pointer-events-none
              max-mobile:w-full
            "
          >
            {sizes.map(({ size, stock, price }) => {
              const disabled = stock === 0;

              return (
                <button
                  key={size}
                  disabled={disabled}
                  onClick={() => !disabled && handleSizeSelect(size, price)}
                  className={`x
                    transition
                    ${disabled
                      ? "opacity-40 line-through cursor-not-allowed"
                      : "hover:underline decoration-black/40 underline-offset-4"
                    }
                  `}
                >
                  {size}
                </button>
              );
            })}

            <button onClick={() => { setShowSizeOverlay(false); setShowSizeSuggestion(true); }} className="text-sm underline decoration-black/40 underline-offset-4">
              Size Suggestion
            </button>
          </div>

          {/* ADD TO CART BUTTON */}
          <button
            onClick={handleAddToCartClick}
            className="w-1/3 bg-black text-white py-3 max-mobile:py-5 text-sm max-mobile:w-full"
          >
            Add to cart
          </button>
        </div>

        {/* FOOTER LINKS */}
        <div className="flex gap-6 text-sm underline underline-offset-4 decoration-black/40 mt-4 max-mobile:text-xs">
          <button onClick={() => setShowDetailsOverlay(true)}>Details</button>
          <button onClick={() => setShowSizingOverlay(true)}>Sizing</button>
          <button onClick={() => setShowShippingOverlay(true)}>Shipping & Returns</button>
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
          onAddSize={(size) => {
            const variant = product.variants.find((v) => v.size.toLowerCase() === size.toLowerCase());
            if (variant) {
              handleSizeSelect(variant.size, variant.price);
            }
            setShowSizeSuggestion(false);
          }}
        />
      </div>
    </div>
  );
}
