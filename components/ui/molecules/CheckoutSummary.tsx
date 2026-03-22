"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItem, getCartItems, getColorName } from "@/utils/cartUtils";
import CartItemCard from "./CartItemCard";

interface CheckoutSummaryProps {
    onPlaceOrder: () => void;
    isProcessing: boolean;
    shippingCost: number;
    shippingLabel: string;
}

// --- Sub-components ---

export const SummaryHeader = () => (
    <h2 className="text-2xl font-regular uppercase max-mobile:text-lg">
        Your Cart
    </h2>
);

export const SummaryItems = ({ 
    items,
    onRemove,
    onIncrease,
    onDecrease
}: { 
    items: CartItem[];
    onRemove: (index: number) => void;
    onIncrease: (index: number) => void;
    onDecrease: (index: number) => void;
}) => (
    <div className="flex flex-col px-[5%] gap-2.5">
        {items.map((item, index) => (
            <CartItemCard
                key={`${item.productId}-${index}`}
                item={item}
                onRemove={() => onRemove(index)}
                onIncrease={() => onIncrease(index)}
                onDecrease={() => onDecrease(index)}
            />
        ))}
    </div>
);

export const SummaryPromo = ({
    promoCode,
    setPromoCode,
}: {
    promoCode: string;
    setPromoCode: (val: string) => void;
}) => (
    <div className="flex gap-2.5 items-end justify-end">
        <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Promocode"
            className="relative h-fit flex-1 border-b border-black/40 pb-2 bg-transparent text-sm outline-none focus:border-black/60 placeholder:text-black/40"
        />
        <button
            type="button"
            className="border border-black/20 px-18 py-4 text-sm hover:border-black/40 transition-colors"
        >
            Apply
        </button>
    </div>
);

export const SummaryTotals = ({
    subtotal,
    shippingLabel,
}: {
    subtotal: number;
    shippingLabel: string;
}) => (
    <div className="flex flex-col gap-2 text-sm font-regular">
        <div className="flex justify-between">
            <span>Subtotal</span>
            <span>SGD {subtotal}</span>
        </div>
        <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shippingLabel}</span>
        </div>
        <div className="flex justify-between">
            <span>Discount</span>
            <span>SGD 0.00</span>
        </div>
    </div>
);

export const SummaryTotalAmount = ({ total }: { total: number }) => (
    <div className="flex justify-between items-baseline pt-8 border-t border-black/10 text-2xl max-mobile:text-lg">
        <div className="flex items-baseline gap-2">
            <span className=" font-regular">Total</span>
            <span className="text-black/50">(TAX INCLUDED)</span>
        </div>
        <span className=" font-regular">SGD {total}</span>
    </div>
);

export const MobileSummaryTotalAmount = ({ total }: { total: number }) => (
    <div className="flex justify-between items-baseline border-black/10 text-lg">
        <div className="flex items-baseline gap-2">
            <span className=" font-regular">Total</span>
            <span className="text-black/50">(TAX INCLUDED)</span>
        </div>
        <span className=" font-regular">SGD {total}</span>
    </div>
);

export const SummaryActions = ({
    onPlaceOrder,
    isProcessing,
}: {
    onPlaceOrder: () => void;
    isProcessing: boolean;
}) => (
    <div className="flex flex-col gap-8">
        <button
            type="button"
            onClick={onPlaceOrder}
            disabled={isProcessing}
            className="w-full bg-black text-white py-4 text-sm tracking-wider hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isProcessing ? "Processing..." : "Pre-order"}
        </button>

        <p className="text-sm text-black leading-relaxed">
            By proceeding, I confirm that I have read and accept the{" "}
            <Link
                href="/explore/terms-conditions"
                className="underline underline-offset-4 decoration-black/40"
            >
                Terms and Conditions
            </Link>{" "}
            and the{" "}
            <Link
                href="/explore/privacy-policy"
                className="underline underline-offset-4 decoration-black/40"
            >
                Privacy Policy
            </Link>
            .
        </p>
    </div>
);

// --- Main Component ---

export default function CheckoutSummary({
    onPlaceOrder,
    isProcessing,
    shippingCost,
    shippingLabel,
}: CheckoutSummaryProps) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [promoCode, setPromoCode] = useState("");

    useEffect(() => {
        setItems(getCartItems());

        const handleUpdate = () => setItems(getCartItems());
        window.addEventListener("cartUpdated", handleUpdate);
        return () => window.removeEventListener("cartUpdated", handleUpdate);
    }, []);

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
        <div className="flex flex-col gap-12">
            <SummaryHeader />

            {items.length > 0 && (
                <SummaryItems
                    items={items}
                    onRemove={removeItem}
                    onIncrease={(idx) => updateQuantity(idx, 1)}
                    onDecrease={(idx) => updateQuantity(idx, -1)}
                />
            )}

            <div className="flex flex-col gap-8">
                <SummaryPromo
                    promoCode={promoCode}
                    setPromoCode={setPromoCode}
                />
                <SummaryTotals
                    subtotal={subtotal}
                    shippingLabel={shippingLabel}
                />
                <SummaryTotalAmount total={subtotal + shippingCost} />
            </div>

            <SummaryActions
                onPlaceOrder={onPlaceOrder}
                isProcessing={isProcessing}
            />
        </div>
    );
}
