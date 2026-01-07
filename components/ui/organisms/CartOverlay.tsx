"use client";

import { useEffect, useState } from "react";

interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CartItem {
  productId: number;
  color: string;
  size: string;
  price: number;
}

const getCartItems = (): CartItem[] => {
  try {
    const itemList = localStorage.getItem("itemList");
    if (itemList) {
      const parsedItems = JSON.parse(itemList);
      if (Array.isArray(parsedItems)) {
        return parsedItems;
      }
    }
  } catch (error) {
    console.error("Error reading cart items:", error);
  }
  return [];
};

export default function CartOverlay({ isOpen, onClose }: CartOverlayProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const updateCartItems = () => {
      setItems(getCartItems());
    };

    // Load items when overlay opens
    if (isOpen) {
      updateCartItems();
    }

    // Disable body scroll when overlay is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Listen for cart updates
    window.addEventListener("cartUpdated", updateCartItems);

    return () => {
      window.removeEventListener("cartUpdated", updateCartItems);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    localStorage.setItem("itemList", JSON.stringify(newItems));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("itemList");
    window.dispatchEvent(new Event("cartUpdated"));
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
        className={`fixed top-0 right-0 h-screen w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out max-tablet:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-black/10">
            <h2 className="text-xl font-regular uppercase">
              Shopping Cart ({items.length})
            </h2>
            <button
              onClick={onClose}
              className="text-black hover:text-gray-600 transition-colors"
              aria-label="Close cart"
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

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-sm text-black/60 mb-4">Your cart is empty</p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-black text-white text-sm hover:opacity-90 transition"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-black/10 rounded"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Product #{item.productId}
                      </p>
                      <p className="text-xs text-black/60 mt-1">
                        Color: {item.color} | Size: {item.size}
                      </p>
                      <p className="text-xs font-medium mt-1">
                        SGD {item.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(index)}
                      className="ml-4 text-red-600 hover:text-red-800 text-xs underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-black/10 space-y-4">
              <button
                onClick={clearCart}
                className="w-full py-3 border border-black text-black text-sm hover:bg-black hover:text-white transition"
              >
                Clear Cart
              </button>
              <button className="w-full py-3 bg-black text-white text-sm hover:opacity-90 transition">
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
