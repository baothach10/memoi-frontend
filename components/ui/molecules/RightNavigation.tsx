"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SearchIcon from "../atoms/SearchIcon";
import CartIcon from "../atoms/CartIcon";
import UserIcon from "../atoms/UserIcon";
import SearchOverlay from "../organisms/SearchOverlay";
import CartOverlay from "../organisms/CartOverlay";
import { getCartItems } from "@/utils/cartUtils";
import { useCartQuery } from "@/queries/useCartQuery";
import { MOBILE_LOGO_SIZE } from "@/constants";

type OverlayType = "search" | "cart" | null;

function RightNavigation({
  color = "white",
  onClose,
  className,
}: {
  color?: string;
  onClose?: () => void;
  className?: string;
}) {
  const { data: backendItems } = useCartQuery();
  const [cartCount, setCartCount] = useState(0);
  const [activeOverlay, setActiveOverlay] = useState<OverlayType>(null);

  useEffect(() => {
    const updateCartCount = () => {
      if (backendItems) {
        setCartCount(backendItems.length);
      } else {
        const items = getCartItems();
        setCartCount(items.length);
      }
    };

    updateCartCount();

    // Listen for storage changes (for updates from other tabs)
    window.addEventListener("storage", updateCartCount);

    // Listen for custom event (for updates in the same tab)
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, [backendItems]);

  useEffect(() => {
    if (activeOverlay) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [activeOverlay]);

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setActiveOverlay(activeOverlay === "search" ? null : "search");
  };

  const handleSearchTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    setActiveOverlay(activeOverlay === "search" ? null : "search");
  }
  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveOverlay(activeOverlay === "cart" ? null : "cart");
  };

  const handleCartTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    setActiveOverlay(activeOverlay === "cart" ? null : "cart");
  }

  const closeOverlay = () => {
    setActiveOverlay(null);
  };

  return (
    <>
      <div className={`relative flex items-center gap-2 max-mobile:gap-1 ${className}`}>
        <button
          onClick={handleSearchClick}
          onTouchEnd={handleSearchTouch}
          className="p-2 relative group text-white hover:text-gray-300 cursor-pointer transition-all ease-in max-tablet:hidden"
        >
          <SearchIcon width={MOBILE_LOGO_SIZE} height={MOBILE_LOGO_SIZE} color={color} />
          <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 p-2 bg-black text-white text-xs whitespace-nowrap rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Search products
          </span>
        </button>
        <button
          onClick={handleSearchClick}
          onTouchEnd={handleSearchTouch}
          className="p-2 relative group text-white hover:text-gray-300 cursor-pointer transition-all duration-300 active:duration-0 active:bg-black/20 laptop:hidden"
        >
          <SearchIcon width={MOBILE_LOGO_SIZE} height={MOBILE_LOGO_SIZE} color={color} />
        </button>

        <button
          onClick={handleCartClick}
          onTouchEnd={handleCartTouch}
          className="p-2 relative flex items-center gap-1 group text-white cursor-pointer hover:text-gray-300 transition-all ease-in max-tablet:hidden"
        >
          <CartIcon width={MOBILE_LOGO_SIZE} height={MOBILE_LOGO_SIZE} color={color} />
          {cartCount > 0 && (
            <span
              className="h-4 flex items-center text-[15px] font-medium"
              style={{ color }}
            >
              ({cartCount})
            </span>
          )}
          <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 p-2 bg-black text-white text-xs whitespace-nowrap rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Cart
          </span>
        </button>
        <button
          onClick={handleCartClick}
          onTouchEnd={handleCartTouch}
          className="p-2 relative flex items-center gap-1 group text-white cursor-pointer hover:text-gray-300 transition-all duration-300 active:duration-0 active:bg-black/20 laptop:hidden"
        >
          <CartIcon width={MOBILE_LOGO_SIZE} height={MOBILE_LOGO_SIZE} color={color} />
          {cartCount > 0 && (
            <span
              className="h-4 flex items-center max-mobile:text-[15px] font-medium"
              style={{ color }}
            >
              ({cartCount})
            </span>
          )}
        </button>

        <Link
          href="/account"
          onClick={() => onClose?.()}
          className="p-2 relative group text-white hover:text-gray-300 transition-all duration-300 active:duration-0 active:bg-black/20 cursor-pointer"
        >
          <UserIcon width={MOBILE_LOGO_SIZE} height={MOBILE_LOGO_SIZE} color={color} />
          <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 p-2 bg-black text-white text-xs whitespace-nowrap rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Your profile
          </span>
        </Link>
      </div>

      {/* Overlays */}
      <SearchOverlay
        isOpen={activeOverlay === "search"}
        onClose={closeOverlay}
      />
      <CartOverlay isOpen={activeOverlay === "cart"} onClose={closeOverlay} />
    </>
  );
}

export default RightNavigation;
