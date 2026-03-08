"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CartItem, getCartItems, getColorName } from "@/utils/cartUtils";

export default function CheckoutSummary() {
    const [items, setItems] = useState<CartItem[]>([]);

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
        <div className="flex flex-col gap-10">
            {/* Summary Box */}
            <div>
                <h2 className="text-lg font-regular uppercase tracking-wider mb-6">
                    Summary
                </h2>
                <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>SGD {subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="text-black/60">Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-3 border-t border-black/10 mt-2">
                        <div className="flex items-baseline gap-2">
                            <span className="text-base font-regular">Total</span>
                            <span className="text-xs text-black/50">(TAX INCLUDED)</span>
                        </div>
                        <span className="text-xl font-regular">SGD {subtotal}</span>
                    </div>
                </div>
            </div>

            {/* Your Cart */}
            {items.length > 0 && (
                <div>
                    <h2 className="text-lg font-regular uppercase tracking-wider mb-6">
                        Your Cart
                    </h2>
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
                </div>
            )}
        </div>
    );
}
