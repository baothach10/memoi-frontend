"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ProductDetailsResponse } from "@/app/api/getProductDetails";
import Link from "next/link";

interface ProductInfoProps {
  product: ProductDetailsResponse;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  /* ---------------------------------------------
   * COLORS
   --------------------------------------------- */
  // const colors = useMemo(
  //   () => Array.from(new Set(product.variants.map((v) => v.color))),
  //   [product.variants]
  // );
  const colors = ["#000000", "#ffffff", "#ff0000"]; // Placeholder until variants are set up

  const [selectedColor, setSelectedColor] = useState(() => product.color || "");
  const [showSizeOverlay, setShowSizeOverlay] = useState(false);

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

  const handleSizeSelect = (size: string, price: number) => {
    const cartItems = JSON.parse(localStorage.getItem("itemList") || "[]");

    cartItems.push({
      productId: product.product_id,
      productName: product.name,
      productImage: product.images[0].url,
      color: product.color,
      quantity: 1,
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

      <div className="px-16 flex flex-col items-center justify-center w-full max-w-sm">
        {/* CATEGORY */}
        <p className="text-xs tracking-widest mb-2">
          {product.category.name.toUpperCase()}
        </p>

        {/* NAME */}
        <h1 className="text-xl font-regular mb-4 text-center uppercase">
          {product.name}
        </h1>

        {/* PRICE */}
        <p className="text-sm mb-8 text-center">{product.currency} {displayPrice.toFixed(2)}</p>

        {/* COLOR SELECTOR */}
        <div className="mb-10 flex flex-col items-center justify-center text-center">
          <p className="text-xs mb-2">COLOR: {product.color.toUpperCase()}</p>

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
        <div className="relative w-full mb-6">
          {/* SIZE OVERLAY */}
          <div
            ref={overlayRef}
            className="
              absolute left-0 z-10
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
                    ${disabled
                      ? "opacity-40 line-through cursor-not-allowed"
                      : "hover:underline"
                    }
                  `}
                >
                  {size}
                </button>
              );
            })}

            <button onClick={() => { }} className="text-xs underline mt-2">
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
