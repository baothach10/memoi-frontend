"use client";

import { useEffect, useState } from "react";
import CartItemCard from "@/components/ui/molecules/CartItemCard";
import CartFooter from "@/components/ui/molecules/CartFooter";
import { CartItem, getCartItems, setCartItems, clearCart } from "@/utils/cartUtils";
import { useUpdateCart } from "@/queries/useUpdateCart";
import { useCartQuery } from "@/queries/useCartQuery";
import { MOBILE_LOGO_SIZE } from "@/constants";
import ExitIcon from "../atoms/ExitIcon";

interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartOverlay({ isOpen, onClose }: CartOverlayProps) {
  const updateCartMutation = useUpdateCart();
  const { data: backendItems } = useCartQuery();
  const [localItems, setLocalItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // If backendItems is non-null, it means we are authenticated and the backend is the source of truth.
    if (backendItems !== null && backendItems !== undefined) {
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
        // Only clear if the user is authenticated and the backend says the cart is empty.
        clearCart();
        setLocalItems([]);
      }
    } else if (isOpen) {
      // For guest users (backendItems is null) or before initial fetch, use local storage.
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
        className={`fixed inset-0 h-dvh bg-black/30 z-100 transition-opacity duration-300 max-tablet:w-full ${isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      {/* Overlay Panel */}
      <div
        className={`fixed top-0 right-0 h-dvh w-4/10 bg-[#fffefa] z-100 transform transition-transform duration-300 ease-in-out max-tablet:w-full max-tablet:shadow-transparent ${isOpen
          ? "translate-x-0 pointer-events-auto shadow-2xl"
          : "translate-x-[105%] pointer-events-none"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <h2 className="text-base font-regular leading-tight tracking-wide max-mobile:text-sm">Cart</h2>
            <button
              onClick={onClose}
              className="text-black hover:text-gray-500 cursor-pointer transition-all duration-300 active:duration-0 p-2 active:bg-black/20"
              aria-label="Close cart"
            >
              <ExitIcon width={MOBILE_LOGO_SIZE} height={MOBILE_LOGO_SIZE} color={"black"} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {itemsToDisplay.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-[7%]">
                <p className="text-sm font-regular text-black mb-6 max-mobile:text-xs">
                  There’s nothing in your Cart, yet.
                </p>
                <button
                  onClick={onClose}
                  className="px-12 py-4 leading-none bg-black text-white cursor-pointer text-sm hover:opacity-90 transition max-mobile:py-3.5 max-mobile:text-xs max-mobile:px-10"
                >
                  Continue shopping
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
