"use client";

import { useEffect, useRef, useState } from "react";
import SearchIcon from "../atoms/SearchIcon";
import { searchProducts, SearchProduct } from "@/app/api/searchProducts";
import SearchInteractiveItem from "../pages/overlay/SearchInteractiveItem";
import { ArrowRight } from "lucide-react";

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

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }

    // Disable body scroll when overlay is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 max-tablet:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Overlay Panel */}
      <div
        className={`fixed top-0 right-0 h-screen w-[668px] bg-[#fffefa] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out max-tablet:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6">
            <h2 className="text-xl font-regular">Search</h2>
            <button
              onClick={onClose}
              className="text-black hover:text-gray-600 transition-colors"
              aria-label="Close search"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 5L5 15M5 5l10 10" />
              </svg>
            </button>
          </div>

          {/* Search Input */}
          <div className="p-6">
            <div className="relative flex items-center justify-between border-[#7E7D78] border-b">
              <div>
                <SearchIcon width={16} height={16} color="rgba(0,0,0,0.6)" />
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={handleInputChange}
                className="w-full text-[14px] font-regular text-black mx-3 bg-transparent py-3 outline-none focus:border-black placeholder:text-[14px] placeholder:text-black/60"
              />
              <div
                className="cursor-pointer"
                onClick={handleSearchRedirect}
                onTouchEnd={handleSearchRedirect}
              >
                <ArrowRight size={16} color="rgba(0, 0, 0, 0.6)" />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col">
            {isLoading ? (
              <p className="text-sm text-black font-regular">Searching...</p>
            ) : !hasSearched ? (
              <div className="mt-auto w-full h-1/3 flex flex-col gap-5">
                <p className="text-sm text-black font-regular">
                  You may also like
                </p>
                <div className="relative w-full h-full bg-gray-400"></div>
              </div>
            ) : products.length === 0 ? (
              <>
                <p className="text-sm text-black font-regular">
                  There are no results for your search &quot;{searchQuery}
                  &quot;. Please try again.
                </p>
                <div className="mt-auto w-full h-1/3 flex flex-col gap-5">
                  <p className="text-sm text-black font-regular">
                    You may also like
                  </p>
                  <div className="relative w-full h-full bg-gray-400"></div>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-3 gap-2.5">
                {products.map((product) => (
                  <SearchInteractiveItem
                    key={product.product_id}
                    image={product.images[0]?.url || ""}
                    hoveredImage={
                      product.images[1]?.url || product.images[0]?.url || ""
                    }
                    name={product.name}
                    currency={product.currency}
                    price={product.price}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
