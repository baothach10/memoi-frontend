"use client";

import { useEffect, useState, forwardRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { BillingInfo, ProductItem } from "@/queries/useCreatePaymentIntent";
import PaymentForm, { PaymentFormRef } from "@/components/ui/molecules/PaymentForm";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const appearance = (isMobile: boolean) => ({
    theme: "flat" as const,
    variables: {
        colorPrimary: "#000000",
        colorBackground: "#fffefa",
        colorText: "#000000",
        colorDanger: "#df1b41",
        fontFamily: "HelveticaNeueRegular, sans-serif",
        spacingUnit: "4px",
        borderRadius: "0px",
        colorTextSecondary: "rgba(0, 0, 0, 1)",
        colorTextPlaceholder: "rgba(0, 0, 0, 0.4)",
    },
    rules: {
        ".Tab": {
            border: "1px solid rgba(0, 0, 0, 0.1)",
            boxShadow: "none",
        },
        ".TabLabel": {
            fontWeight: '200',
        },
        ".Tab:hover": {
            color: "rgba(0, 0, 0, 1)",
        },
        ".Tab--selected, .Tab--selected:hover, .Tab--selected:focus": {
            border: "1px solid #000000",
            backgroundColor: "#fffefa",
            color: "rgba(0, 0, 0, 1)",
            boxShadow: "none",
        },
        ".TabIcon--selected": {
            fill: "rgba(0, 0, 0, 1)",
            color: "rgba(0, 0, 0, 1)",
        },
        ".Input": {
            border: "1px solid rgba(0, 0, 0, 0.2)",
            boxShadow: "none",
            fontSize: isMobile ? "12px" : "14px",
            fontWeight: '200',
        },
        ".Input:focus": {
            border: "1px solid rgba(0, 0, 0, 0.6)",
            boxShadow: "none",
        },
        ".Label": {
            fontSize: isMobile ? "14px" : "16px",
            marginBottom: isMobile ? "8px" : "16px",
            marginTop: isMobile ? "24px" : "36px",
            textTransform: "uppercase",
            color: "rgba(0, 0, 0, 1)",
        },
    },
});

interface StripePaymentProps {
    items: ProductItem[];
    billingInfo: BillingInfo | null;
    promoCode?: string;
    amount: number; // in cents
    currency: string;
}

const StripePayment = forwardRef<PaymentFormRef, StripePaymentProps>(function StripePayment({ 
    items, 
    billingInfo, 
    promoCode,
    amount,
    currency
}, ref) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 640px)");
        setIsMobile(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    if (!items.length || !billingInfo || !billingInfo.first_name || !billingInfo.address) {
        return (
            <div className="border border-black/10 p-6 max-mobile:p-4">
                <p className="text-sm text-black/40">
                    Please complete your shipping information to continue to payment.
                </p>
            </div>
        );
    }

    return (
        <Elements
            stripe={stripePromise}
            options={{
                mode: "payment",
                amount: Math.max(1, amount), 
                currency: currency.toLowerCase(),
                paymentMethodTypes: ['card', 'paynow'],
                appearance: appearance(isMobile),
            }}
        >
            <PaymentForm 
                ref={ref} 
                items={items} 
                billingInfo={billingInfo} 
                promoCode={promoCode} 
            />
        </Elements>
    );
});

export default StripePayment;
