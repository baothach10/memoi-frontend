"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SearchIcon from "../atoms/SearchIcon";
import CartIcon from "../atoms/CartIcon";
import UserIcon from "../atoms/UserIcon";
import SearchOverlay from "../organisms/SearchOverlay";
import CartOverlay from "../organisms/CartOverlay";

type OverlayType = "search" | "cart" | null;

function RightNavigation({
  color = "white",
  onClose,
}: {
  color?: string;
  onClose?: () => void;
}) {
  const [cartCount, setCartCount] = useState(0);
  const [activeOverlay, setActiveOverlay] = useState<OverlayType>(null);

  useEffect(() => {

    const updateCartCount = () => {
      try {
        const itemList = localStorage.getItem("itemList");
        if (itemList) {
          const items = JSON.parse(itemList);
          if (Array.isArray(items)) {
            setCartCount(items.length);
          }
        } else {
          setCartCount(0);
        }
      } catch (error) {
        console.error("Error reading cart items:", error);
      }
    };

    // Initial load
    updateCartCount();

    // Listen for storage changes (for updates from other tabs)
    window.addEventListener("storage", updateCartCount);

    // Listen for custom event (for updates in the same tab)
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveOverlay(activeOverlay === "search" ? null : "search");
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveOverlay(activeOverlay === "cart" ? null : "cart");
  };

  const closeOverlay = () => {
    setActiveOverlay(null);
  };

  return (
    <>
      <div className="relative flex items-center gap-6 max-mobile:gap-4">
        <button
          onClick={handleSearchClick}
          className="relative group text-white hover:text-gray-300 transition-all ease-in max-tablet:hidden"
        >
          <SearchIcon width={14} height={14} color={color} />
          <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 p-2 bg-black text-white text-xs whitespace-nowrap rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Search products
          </span>
        </button>
        <Link
          href="#"
          onClick={() => onClose?.()}
          className="relative group text-white hover:text-gray-300 transition-all ease-in tablet:hidden"
        >
          <SearchIcon width={14} height={14} color={color} />
          <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 p-2 bg-black text-white text-xs whitespace-nowrap rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Search products
          </span>
        </Link>

        <button
          onClick={handleCartClick}
          className="relative flex items-center gap-1 group text-white hover:text-gray-300 transition-all ease-in max-tablet:hidden"
        >
          <CartIcon width={14} height={14} color={color} />
          {cartCount > 0 && (
            <span
              className="h-4 flex items-center text-[14px] font-medium"
              style={{ color }}
            >
              ({cartCount})
            </span>
          )}
          <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 p-2 bg-black text-white text-xs whitespace-nowrap rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Cart
          </span>
        </button>
        <Link
          href="#"
          onClick={() => onClose?.()}
          className="relative flex items-center gap-1 group text-white hover:text-gray-300 transition-all ease-in tablet:hidden"
        >
          <CartIcon width={14} height={14} color={color} />
          {cartCount > 0 && (
            <span
              className="h-4 flex items-center text-[14px] font-medium"
              style={{ color }}
            >
              ({cartCount})
            </span>
          )}
          <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 p-2 bg-black text-white text-xs whitespace-nowrap rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Cart
          </span>
        </Link>

        <Link
          href="/account"
          onClick={() => onClose?.()}
          className="relative group text-white hover:text-gray-300 transition-all ease-in"
        >
          <UserIcon width={14} height={14} color={color} />
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
