"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/ui/organisms/Footer";
import { clearCart } from "@/utils/cartUtils";
import { useUpdateCart } from "@/queries/useUpdateCart";

function CheckoutSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isValid, setIsValid] = useState(false);
    const updateCartMutation = useUpdateCart();

    useEffect(() => {
        if (isValid) return; // Only run once

        const paymentIntent = searchParams.get("payment_intent");
        const status = searchParams.get("redirect_status");

        if (!paymentIntent || status !== "succeeded") {
            router.replace("/");
            return;
        }

        clearCart();
        updateCartMutation.mutate({ products: [] });
        setIsValid(true);
    }, [searchParams, router, updateCartMutation, isValid]);

    return (
        <div className="" data-header-theme="light">
            {!isValid ? (
                <div className="flex justify-center py-50 text-sm text-black/50">
                    Validating order...
                </div>
            ) : (
                <section className="flex w-full justify-center py-50 max-mobile:py-38 smaller-tablet:max-tablet:py-73">
                    <div className="w-full max-w-[620px] flex flex-col gap-12 text-center max-mobile:px-5 max-mobile:gap-9">

                        {/* Title and Description */}
                        <div className="flex flex-col gap-8">
                            <h1 className="text-2xl font-regular uppercase max-mobile:text-lg">
                                Order Confirmed!
                            </h1>
                            <div className="text-sm text-black/80 max-mobile:text-xs leading-relaxed space-y-2">
                                <p className="font-regular">
                                    Thank you for your purchase!
                                </p>
                                <div className="space-y-1">
                                    <p>
                                        Your order has been successfully placed. You will receive a confirmation email shortly with your order details and tracking information.
                                    </p>
                                    <p>
                                        If you have any questions regarding your order, you can find information in our <Link href="/help" className="underline underline-offset-4 decoration-black/80">FAQ</Link> or visit <Link href="/explore/contact-us" className="underline underline-offset-4 decoration-black/80">Contact Us</Link> for direct assistance.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Button */}
                        <Link href="/">
                            <button className="w-full bg-black text-white py-4 text-sm">
                                Continue Shopping
                            </button>
                        </Link>
                    </div>
                </section>
            )}
            <Footer />
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen py-50 flex justify-center text-sm text-black/50">Loading...</div>}>
            <CheckoutSuccessContent />
        </Suspense>
    );
}
