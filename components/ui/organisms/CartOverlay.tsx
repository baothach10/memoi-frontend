"use client";

import { useEffect, useState } from "react";
import CartItemCard from "@/components/ui/molecules/CartItemCard";
import CartFooter from "@/components/ui/molecules/CartFooter";
import { CartItem, getCartItems, setCartItems, clearCart } from "@/utils/cartUtils";
import { useUpdateCart } from "@/queries/useUpdateCart";
import { useCartQuery } from "@/queries/useCartQuery";

interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartOverlay({ isOpen, onClose }: CartOverlayProps) {
  const updateCartMutation = useUpdateCart();
  const { data: backendItems } = useCartQuery();
  const [localItems, setLocalItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (backendItems) {
      if (backendItems.length > 0) {
        const mappedItems = backendItems.map((item) => ({
          product_id: item.product_variant_id,
          size: item.size,
          quantity: item.quantity,
          productName: item.product_name,
          productImage: item.image_url,
          color_name: item.color_name,
          price: item.unit_price,
          stock: item.stock,
        }));
        setLocalItems(mappedItems);
      } else {
        clearCart();
        setLocalItems([]);
      }
  } else if (isOpen) {
      setLocalItems(getCartItems());
    }
  }, [backendItems, isOpen]);

  const itemsToDisplay = localItems.map(item => ({
    ...item,
    productId: item.product_id, // ensure compatibility with CartItemCard
  }));

  const updateLocalStorage = async (newItems: CartItem[]) => {
    setLocalItems(newItems);
    setCartItems(newItems);
    await updateCartMutation.mutateAsync({ products: newItems });
  };

  const removeItem = (index: number) => {
    const newItems = localItems.filter((_, i) => i !== index);
    updateLocalStorage(newItems);
  };

  const updateQuantity = (index: number, delta: number) => {
    const newItems = localItems.map((item, i) => {
      const newQty = i === index ? Math.max(1, item.quantity + delta) : item.quantity;
      return {
        ...item,
        quantity: newQty,
      };
    });
    updateLocalStorage(newItems);
  };

  const subtotal = itemsToDisplay.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const hasStockError = itemsToDisplay.some(item => (item.stock === 0 || item.quantity > item.stock));

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
            {itemsToDisplay.length === 0 ? (
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
                {itemsToDisplay.map((item, index) => (
                  <CartItemCard
                    key={`${item.product_id}-${index}`}
                    item={item as CartItem}
                    onRemove={() => removeItem(index)}
                    onIncrease={() => updateQuantity(index, 1)}
                    onDecrease={() => updateQuantity(index, -1)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {itemsToDisplay.length > 0 && (
            
            <CartFooter 
              subtotal={subtotal} 
              onClose={onClose} 
              showStockError={hasStockError}
            />
          )}
        </div>
      </div>
    </>
  );
}
