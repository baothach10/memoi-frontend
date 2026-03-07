"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CartItem {
  productId: number;
  productName: string;
  productImage: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
}

const COLOR_NAME_MAP: Record<string, string> = {
  "#FFFFFF": "WHITE",
  "#ffffff": "WHITE",
  "#000000": "BLACK",
  "#FF0000": "RED",
  "#ff0000": "RED",
  "#A52A2A": "BROWN",
  "#a52a2a": "BROWN",
  "#808080": "GREY",
  "#C0C0C0": "SILVER",
  "#FFC0CB": "PINK",
  "#ffc0cb": "PINK",
  "#0000FF": "BLUE",
  "#0000ff": "BLUE",
  "#008000": "GREEN",
  "#FFFF00": "YELLOW",
  "#ffff00": "YELLOW",
  "#FFA500": "ORANGE",
  "#ffa500": "ORANGE",
  "#800080": "PURPLE",
  "#F5F5DC": "BEIGE",
  "#f5f5dc": "BEIGE",
  "#000080": "NAVY",
  "#800000": "MAROON",
};

const getColorName = (hex: string): string => {
  return COLOR_NAME_MAP[hex] || hex.toUpperCase();
};

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
        className={`fixed inset-0 bg-black/50 z-100 transition-opacity duration-300 max-tablet:hidden ${isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      {/* Overlay Panel */}
      <div
        className={`fixed top-0 right-0 h-screen w-4/10 bg-[#fffefa] shadow-2xl z-100 transform transition-transform duration-300 ease-in-out max-tablet:hidden max-tablet:shadow-transparent ${isOpen
          ? "translate-x-0 pointer-events-auto"
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
                <p className="text-sm text-black/50 mb-6">
                  Your cart is empty
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
                  <div
                    key={`${item.productId}-${index}`}
                    className="bg-linear-to-r from-[#fffefa] via-black/2 to-[#fffefa]"
                  >
                    <div className="flex gap-8">
                      {/* Product Image */}
                      <div className="w-[25%] aspect-5/6 shrink-0 flex items-center justify-center overflow-hidden">
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          width={100}
                          height={140}
                          className="object-cover w-full h-full"
                          unoptimized
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex flex-col justify-between flex-1 min-w-0 py-[2.5%]">
                        <div className="flex flex-col gap-2">
                          <h3 className="text-sm font-normal leading-snug font-regular">
                            {item.productName}
                          </h3>
                          <p className="text-sm text-black/60 tracking-wide">
                              {getColorName(item.color)}, {item.size}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-base font-normal font-regular">
                            SGD {item.price}
                          </p>

                          <div className="flex items-center gap-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center bg-black/10">
                              <button
                                onClick={() => updateQuantity(index, -1)}
                                disabled={item.quantity <= 1}
                                className={`w-8 h-8 flex items-center justify-center transition-colors text-sm ${item.quantity <= 1
                                  ? "text-black/20 cursor-not-allowed"
                                  : "text-black hover:text-black/70"
                                  }`}
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <div className="py-0.5 bg-[#fffefa] relative h-full">
                                <div className="relative w-12 h-6 flex items-center justify-center text-sm">
                                  {item.quantity}
                                </div>
                              </div>
                              <button
                                onClick={() => updateQuantity(index, 1)}
                                className="w-8 h-8 flex items-center justify-center text-black hover:text-black transition-colors text-sm"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeItem(index)}
                              className="text-xs text-black/60 hover:text-black tracking-wide transition-colors uppercase underline decoration-black/40"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-black/10">
              {/* Subtotal */}
              <div className="px-[5%] pt-[2%] pb-[2%]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xl tracking-wider uppercase font-regular">
                      Subtotal
                    </p>
                    <p className="text-sm text-black/60 mt-4 tracking-wide">
                      TAX INCLUDED
                    </p>
                  </div>
                  <p className="text-xl font-regular">SGD {subtotal}</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="px-[5%] pb-[2%] flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-[2%] border border-black/20 text-black text-sm tracking-wider hover:bg-black hover:text-white transition-all duration-200"
                >
                  View cart
                </button>
                <button className="flex-[1.5] py-[2%] bg-black text-white text-sm tracking-wider hover:opacity-90 transition-all duration-200">
                  Checkout
                </button>
              </div>

              {/* Footer Links */}
              <div className="px-[5%] pb-[2%] flex items-center justify-between text-sm text-black/60 decoration-black/60 h-[25%]">
                <p>
                  Need help?{" "}
                  <Link
                    href="/explore/contact-us"
                    className="underline underline-offset-2 hover:text-black transition-colors"
                  >
                    Contact us
                  </Link>
                </p>
                <p>
                  By proceeding, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="underline underline-offset-2 hover:text-black transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
