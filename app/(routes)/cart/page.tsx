"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CartItemCard from "@/components/ui/molecules/CartItemCard";
import ExpandableSection from "@/components/ui/molecules/ExpandableSection";
import { CartItem, getCartItems } from "@/utils/cartUtils";
import Footer from "@/components/ui/organisms/Footer";

export default function CartPage() {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const updateCartItems = () => {
            setItems(getCartItems());
        };

        updateCartItems();
        window.addEventListener("cartUpdated", updateCartItems);

        return () => {
            window.removeEventListener("cartUpdated", updateCartItems);
        };
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

    if (items.length === 0) {
        return (
            <div className="relative w-full bg-[#fffefa]" data-header-theme="light">
                <section className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center pt-32 max-tablet:pt-24 max-mobile:pt-16 pb-20 max-mobile:pb-10">
                    <h1 className="text-2xl font-regular uppercase mb-6 tracking-widest">Your cart is empty</h1>
                    <p className="text-sm text-black/60 mb-10 max-w-sm">
                        Looks like you haven&apos;t added anything to your cart yet.
                    </p>
                    <Link
                        href="/shop"
                        className="px-12 py-4 bg-black text-white text-sm tracking-widest hover:opacity-90 transition uppercase"
                    >
                        Continue Shopping
                    </Link>
                </section>
                <Footer />
            </div>
        );
    }

    return (
        <div className="relative w-full bg-[#fffefa]" data-header-theme="light">
            <section className="w-full px-[100px] max-tablet:px-10 pt-32 max-tablet:pt-24 max-mobile:pt-16 pb-20 max-mobile:pb-10 max-mobile:px-5">
                <div className="grid grid-cols-10 gap-20 max-tablet:grid-cols-1 max-tablet:gap-8 max-mobile:gap-5">
                    {/* Left side: Cart Items */}
                    <div className="col-span-6 flex flex-col gap-10">
                        <div className="flex flex-col gap-6">
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
                    </div>

                    <div className="hidden max-tablet:col-span-6 max-tablet:block w-full h-px bg-black/10"></div>

                    {/* Right side: Summary */}
                    <div className="col-span-4 flex flex-col gap-8 max-tablet:col-span-6">
                        <div className="flex flex-col gap-12 max-mobile:gap-5">
                            <h2 className="text-2xl font-regular uppercase text-black max-mobile:text-lg">Summary</h2>

                            {/* Totals */}
                            <div className="flex flex-col gap-5 text-[16px] max-mobile:text-sm max-mobile:gap-3">
                                <div className="flex justify-between items-center font-regular">
                                    <span className="">Subtotal</span>
                                    <span>SGD {subtotal}</span>
                                </div>
                                <div className="flex justify-between items-center font-regular">
                                    <span className="">Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-regular">Total</span>
                                        <span className="text-sm text-black/60 uppercase">(TAX INCLUDED)</span>
                                    </div>
                                    <span className="text-2xl font-regular max-mobile:text-lg">SGD {subtotal}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2.5">
                                <Link
                                    href="/checkout"
                                    className="w-full bg-black text-white py-5 text-sm text-center hover:opacity-95 transition-opacity max-mobile:py-4 max-mobile:text-xs"
                                >
                                    Proceed to checkout
                                </Link>
                                <Link
                                    href="/shop"
                                    className="w-full border border-black/10 py-5 text-sm text-center hover:bg-black/2 transition-colors max-mobile:py-4 max-mobile:text-xs"
                                >
                                    Continue shopping
                                </Link>
                                <p className="text-sm text-black/60 text-center px-4 pt-2.5 max-mobile:text-xs max-mobile:pt-1.5">
                                    By proceeding, you agree to our{" "}
                                    <Link href="/terms" className="underline underline-offset-4 decoration-black/40">
                                        Terms & Conditions
                                    </Link>
                                </p>
                            </div>

                        </div>

                        {/* Information Sections */}
                        <div className="flex flex-col border-t border-black/10">
                            <ExpandableSection
                                title={<span>Secure Payment</span>}
                                titleClassName="font-regular py-8 text-[16px] border-b border-black/10 max-mobile:py-6 max-mobile:text-sm"
                            >
                                <div className="py-8 text-sm text-black/60 space-y-4 font-regular max-mobile:py-6 max-mobile:text-xs max-mobile:space-y-2.5">
                                    All our transactions are safe and encrypted. We accept all major credit cards, Apple Pay, and Google Pay.
                                </div>
                            </ExpandableSection>

                            <ExpandableSection
                                title={<span>Free Delivery & Returns</span>}
                                titleClassName="font-regular py-8 text-[16px] border-b border-black/10 max-mobile:py-6 max-mobile:text-sm"
                            >
                                <div className="py-8 text-sm text-black/60 space-y-4 font-regular max-mobile:py-6 max-mobile:text-xs max-mobile:space-y-2.5">
                                    <p>Free shipping in 3-5 business days from order confirmation.</p>
                                    <p>Shipping status can be verified at any time by using the tracking number provided via e-mail. You can also access this information within MyAccount.</p>
                                    <p>As per our legal terms, please be reminded that an adult signature is required upon delivery.</p>
                                    <p>You may return the products purchased within 30 days of delivery free of charge using the return label provided with your order.</p>
                                </div>
                            </ExpandableSection>

                            <ExpandableSection
                                title={<span>Need help? Contact us</span>}
                                titleClassName="font-regular py-8 text-[16px] border-b border-black/10 max-mobile:py-6 max-mobile:text-sm"
                            >
                                <div className="py-8 text-sm text-black/60 space-y-4 font-regular max-mobile:py-6 max-mobile:text-xs max-mobile:space-y-2.5">
                                    Our customer service is available Monday to Saturday, 10am to 7pm SGT. You can reach us via email or phone.
                                </div>
                            </ExpandableSection>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
