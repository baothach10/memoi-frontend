"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ProductDetailsResponse } from "@/app/api/getProductDetails";

interface ProductInfoProps {
  product: ProductDetailsResponse;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  /* ---------------------------------------------
   * COLORS
   --------------------------------------------- */
  const colors = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.color))),
    [product.variants]
  );

  const [selectedColor, setSelectedColor] = useState(() => colors[0] || "");
  const [showSizeOverlay, setShowSizeOverlay] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);

  /* ---------------------------------------------
   * SIZES (stock-aware, per color)
   --------------------------------------------- */
  const sizes = useMemo(() => {
    return product.variants
      .filter((v) => v.color === selectedColor)
      .map((v) => ({
        size: v.size,
        stock: v.stock,
        price: v.price,
      }));
  }, [product.variants, selectedColor]);

  const displayPrice =
    product.variants.find((s) => s.color === selectedColor)?.price ??
    product.variants[0].price;

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

  const handleSizeSelect = (size: string, price: number) => {
    const cartItems = JSON.parse(localStorage.getItem("itemList") || "[]");

    cartItems.push({
      productId: product.product_id,
      color: selectedColor,
      size,
      price,
    });

    localStorage.setItem("itemList", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cartUpdated"));

    setShowSizeOverlay(false);
  };

  /* ---------------------------------------------
   * RENDER
   --------------------------------------------- */
  return (
    <div className="sticky top-0 h-screen flex items-center justify-center">
      {/* BACKDROP */}
      {showSizeOverlay && (
        <div
          onClick={() => setShowSizeOverlay(false)}
          className="fixed inset-0 z-5 bg-transparent"
        />
      )}

      <div className="px-16 flex flex-col items-center w-full max-w-sm">
        {/* CATEGORY */}
        <p className="text-xs tracking-widest mb-2">
          {product.category.name.toUpperCase()}
        </p>

        {/* NAME */}
        <h1 className="text-xl font-regular mb-4 text-center uppercase">
          {product.name}
        </h1>

        {/* PRICE */}
        <p className="text-sm mb-8">SGD {displayPrice.toFixed(2)}</p>

        {/* COLOR SELECTOR */}
        <div className="mb-10">
          <p className="text-xs mb-2">COLOR: {selectedColor.toUpperCase()}</p>

          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`
                  w-3 h-3 rounded-full ring-1
                  ${selectedColor === color ? "ring-black" : "ring-neutral-300"}
                  ${
                    color.toLowerCase() === "black"
                      ? "bg-black"
                      : "bg-neutral-300"
                  }
                `}
              />
            ))}
          </div>
        </div>

        {/* ADD TO CART + SIZE OVERLAY */}
        <div className="relative w-full mb-6">
          {/* SIZE OVERLAY */}
          <div
            ref={overlayRef}
            className="
              absolute left-0 mb-2 z-10
              w-full min-h-[200px]
              bg-white border border-neutral-300 shadow-lg
              flex flex-col items-center justify-center
              gap-3 py-6 text-sm
              opacity-0 pointer-events-none
            "
          >
            {sizes.map(({ size, stock, price }) => {
              const disabled = stock === 0;

              return (
                <button
                  key={size}
                  disabled={disabled}
                  onClick={() => !disabled && handleSizeSelect(size, price)}
                  className={`
                    transition
                    ${
                      disabled
                        ? "opacity-40 line-through cursor-not-allowed"
                        : "hover:underline"
                    }
                  `}
                >
                  {size}
                </button>
              );
            })}

            <button onClick={() => {}} className="text-xs underline mt-2">
              Size Suggestion
            </button>
          </div>

          {/* ADD TO CART BUTTON */}
          <button
            onClick={handleAddToCartClick}
            className="w-full bg-black text-white py-3 text-sm"
          >
            Add to cart
          </button>
        </div>

        {/* FOOTER LINKS */}
        <div className="flex gap-6 text-xs underline mt-4">
          <button>Details</button>
          <button>Sizing</button>
          <button>Shipping & Returns</button>
        </div>
      </div>
    </div>
  );
}
