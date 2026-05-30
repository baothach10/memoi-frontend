"use client";

import { useEffect, useRef, useState } from "react";
import SearchIcon from "../atoms/SearchIcon";
import { searchProducts, SearchProduct } from "@/app/api/searchProducts";
import SearchInteractiveItem from "../pages/overlay/SearchInteractiveItem";
import { ArrowRight } from "lucide-react";
import SearchProductSuggestions from "./SearchProductSuggestions";
import useIsMobile from "@/hooks/useIsMobile";
import { MOBILE_LOGO_SIZE } from "@/constants";
import ExitIcon from "../atoms/ExitIcon";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const isMobile = useIsMobile(768);


  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setProducts([]);
      setHasSearched(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const result = await searchProducts(searchQuery, 1, 9);
        setProducts(result.products);
        setHasSearched(true);
      } catch (error) {
        console.error("Search error:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchRedirect = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?query=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 h-dvh bg-black/30 z-100 transition-opacity duration-300 max-tablet:w-full ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Overlay Panel */}
      <div
        className={`fixed top-0 right-0 h-dvh w-4/10 bg-[#fffefa] z-100 transform transition-transform duration-300 ease-in-out max-tablet:w-full max-tablet:shadow-transparent ${isOpen ? "translate-x-0 pointer-events-auto shadow-2xl" : "translate-x-[105%] pointer-events-none"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6">
            <h2 className="text-base font-regular max-mobile:text-sm">Search</h2>
            <button
              onClick={onClose}
              className="text-black hover:text-gray-600 transition-all duration-300 active:duration-0 w-10 h-10 flex items-center justify-center cursor-pointer active:bg-black/20"
              aria-label="Close search"
            >
              <ExitIcon width={MOBILE_LOGO_SIZE} height={MOBILE_LOGO_SIZE} color={"black"} />
            </button>
          </div>

          {/* Search Input */}
          <div className="p-6">
            <div className="relative flex items-center justify-between border-[#7E7D78] border-b">
              <div className="w-4.5 h-auto max-mobile:w-4 max-mobile:h-auto">
                <SearchIcon width="100%" height="100%" color="rgba(0,0,0,0.6)" />
              </div>
              <input
                suppressHydrationWarning
                ref={inputRef}
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={handleInputChange}
                className="w-full text-sm font-regular text-black mx-3 bg-transparent py-3 outline-none focus:border-black placeholder:text-sm placeholder:text-black/60 max-mobile:text-xs max-mobile:py-2 max-mobile:placeholder:text-xs"
              />
              <div
                className="cursor-pointer w-10 h-10 flex items-center justify-center transition-all duration-300 active:duration-0 active:bg-black/20"
                onClick={handleSearchRedirect}
                onTouchEnd={handleSearchRedirect}
              >
                <div className="w-4.5 h-auto max-mobile:w-4">
                  <ArrowRight width="100%" height="100%" color="rgba(0, 0, 0, 0.6)" />
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col">
            {isLoading ? (
              <p className="text-sm text-black font-regular max-mobile:text-xs">Searching...</p>
            ) : !hasSearched ? (
              <div className="mt-auto w-full h-fit flex flex-col gap-5">
                <p className="text-sm text-black font-regular">
                  You may also like
                </p>
                <div className="relative w-full h-full">
                  <SearchProductSuggestions numberOfSuggestions={isMobile ? 2 : 3} />
                </div>
              </div>
            ) : products.length === 0 ? (
              <>
                <p className="text-sm text-black font-regular max-mobile:text-xs">
                  There are no results for your search &quot;{searchQuery}
                  &quot;. Please try again.
                </p>
                <div className="mt-auto w-full h-fit flex flex-col gap-5">
                  <p className="text-sm text-black font-regular">
                    You may also like
                  </p>
                  <div className="relative w-full h-full">
                    <SearchProductSuggestions numberOfSuggestions={isMobile ? 2 : 3} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  className={`grid gap-2.5 ${isMobile ? "grid-cols-2" : "grid-cols-3"
                    }`}
                >
                  {products.map((product) => (
                    <SearchInteractiveItem
                      key={product.product_id}
                      image={product.images[0]?.url || ""}
                      hoveredImage={
                        product.images[1]?.url || product.images[0]?.url || ""
                      }
                      id={product.product_id}
                      name={product.name}
                      currency={product.currency}
                      price={product.price}
                    />
                  ))}
                </div>
                <div className="p-8 text-center cursor-pointer"
                  onClick={handleSearchRedirect}
                  onTouchEnd={handleSearchRedirect}>
                  <div className="relative text-black text-[16px] inline-flex leading-[18px] after:absolute after:left-0 after:-bottom-px after:h-px after:w-full after:origin-left after:scale-x-100 after:bg-black/40 max-mobile:text-sm">
                    Show more
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
