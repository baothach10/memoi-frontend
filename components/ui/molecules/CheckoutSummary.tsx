"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItem, getCartItems, getColorName } from "@/utils/cartUtils";

interface CheckoutSummaryProps {
    onPlaceOrder: () => void;
    isProcessing: boolean;
}

export default function CheckoutSummary({ onPlaceOrder, isProcessing }: CheckoutSummaryProps) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [promoCode, setPromoCode] = useState("");

    useEffect(() => {
        setItems(getCartItems());

        const handleUpdate = () => setItems(getCartItems());
        window.addEventListener("cartUpdated", handleUpdate);
        return () => window.removeEventListener("cartUpdated", handleUpdate);
    }, []);

    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="flex flex-col gap-12">
            {/* Your Cart Title */}
            <h2 className="text-2xl font-regular uppercase max-mobile:text-lg">
                Your Cart
            </h2>

            {/* Cart Items */}
            {items.length > 0 && (
                <div className="flex flex-col gap-2.5">
                    {items.map((item, index) => (
                        <div
                            key={`${item.productId}-${index}`}
                            className="flex gap-5 bg-linear-to-r from-[#fffefa] via-black/2 to-[#fffefa]"
                        >
                            {/* Product Image */}
                            <div className="w-[20%] aspect-2/3 shrink-0 flex items-center justify-center overflow-hidden">
                                <Image
                                    src={item.productImage}
                                    alt={item.productName}
                                    width={100}
                                    height={140}
                                    className="object-cover w-full h-full"
                                    unoptimized
                                />
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col justify-between flex-1 min-w-0 py-6">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-sm font-regular leading-snug">
                                        {item.productName}
                                    </h3>
                                    <p className="text-xs text-black/60 tracking-wide uppercase">
                                        {getColorName(item.color)}, {item.size}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-regular">
                                        SGD {item.price}
                                    </p>
                                    <p className="text-xs text-black/50 uppercase tracking-wide">
                                        Quantity: {item.quantity}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="flex flex-col gap-8">
                {/* Promo Code */}
                <div className="flex gap-2.5">
                    <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Promocode"
                        className="flex-1 border-b border-black/40 bg-transparent text-sm outline-none py-2 focus:border-black/60 placeholder:text-black/40"
                    />
                    <button
                        type="button"
                        className="border border-black/20 px-18 py-3 text-sm hover:border-black/40 transition-colors"
                    >
                        Apply
                    </button>
                </div>

                {/* Totals */}
                <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>SGD {subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Discount</span>
                        <span>SGD 0.00</span>
                    </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-baseline pt-8 border-t border-black/10 text-2xl">
                    <div className="flex items-baseline gap-2">
                        <span className=" font-regular">Total</span>
                        <span className="text-black/50">(TAX INCLUDED)</span>
                    </div>
                    <span className=" font-regular">SGD {subtotal}</span>
                </div>
            </div>

            {/* Place Order Button */}
            <button
                type="button"
                onClick={onPlaceOrder}
                disabled={isProcessing}
                className="w-full bg-black text-white py-4 text-sm tracking-wider hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isProcessing ? "Processing..." : "Place order"}
            </button>

            {/* Terms */}
            <p className="text-sm text-black leading-relaxed">
                By proceeding, I confirm that I have read and accept the{" "}
                <Link href="/explore/terms-conditions" className="underline underline-offset-2">
                    Terms and Conditions
                </Link>{" "}
                and the{" "}
                <Link href="/explore/privacy-policy" className="underline underline-offset-2">
                    Privacy Policy
                </Link>
                .
            </p>
        </div>
    );
}
