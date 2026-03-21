"use client";

import { useEffect, useState } from "react";
import CartItemCard from "@/components/ui/molecules/CartItemCard";
import CartFooter from "@/components/ui/molecules/CartFooter";
import { CartItem, getCartItems } from "@/utils/cartUtils";

interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartOverlay({ isOpen, onClose }: CartOverlayProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const updateCartItems = () => {
      setItems(getCartItems());
    };

    if (isOpen) {
      updateCartItems();
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    window.addEventListener("cartUpdated", updateCartItems);

    return () => {
      window.removeEventListener("cartUpdated", updateCartItems);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const updateLocalStorage = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem("itemList", JSON.stringify(newItems));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    updateLocalStorage(newItems);
  };

  const updateQuantity = (index: number, delta: number) => {
    const newItems = items.map((item, i) => {
      if (i === index) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    updateLocalStorage(newItems);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-100 transition-opacity duration-300 max-tablet:w-full ${isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      {/* Overlay Panel */}
      <div
        className={`fixed top-0 right-0 h-screen w-4/10 bg-[#fffefa] z-100 transform transition-transform duration-300 ease-in-out max-tablet:w-full max-tablet:shadow-transparent ${isOpen
          ? "translate-x-0 pointer-events-auto shadow-2xl"
          : "translate-x-full pointer-events-none"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-[5%] py-[3%]">
            <h2 className="text-base font-regular leading-tight tracking-wide">Cart</h2>
            <button
              onClick={onClose}
              className="text-black hover:text-gray-500 transition-colors"
              aria-label="Close cart"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 4L4 12M4 4l8 8" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-[7%]">
                <p className="text-sm font-regular text-black mb-6">
                  There’s nothing in your Cart, yet.
                </p>
                <button
                  onClick={onClose}
                  className="px-[7%] py-[2.5%] bg-black text-white text-xs tracking-wider hover:opacity-90 transition"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            ) : (
              <div className="flex flex-col px-[5%] gap-2.5">
                {items.map((item, index) => (
                  <CartItemCard
                    key={`${item.productId}-${index}`}
                    item={item}
                    onRemove={() => removeItem(index)}
                    onIncrease={() => updateQuantity(index, 1)}
                    onDecrease={() => updateQuantity(index, -1)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <CartFooter subtotal={subtotal} onClose={onClose} />
          )}
        </div>
      </div>
    </>
  );
}
