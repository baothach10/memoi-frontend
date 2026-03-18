"use client";

import { useEffect, useState, forwardRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCreatePaymentIntent } from "@/queries/useCreatePaymentIntent";
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
        fontFamily: "HelveticaNeueRegularWoff, sans-serif",
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
            fontWeight: '200',
        },
        ".Input:focus": {
            border: "1px solid rgba(0, 0, 0, 0.6)",
            boxShadow: "none",
        },
        ".Label": {
            fontSize: isMobile ? "14px" : "16px",
            fontWeight: '200',
            marginBottom: isMobile ? "8px" : "16px",
            marginTop: isMobile ? "36px" : "48px",
            textTransform: "uppercase",
            color: "rgba(0, 0, 0, 1)",
        },
    },
});

const StripePayment = forwardRef<PaymentFormRef>(function StripePayment(_props, ref) {
    const { mutate, data: clientSecret, error, isPending } = useCreatePaymentIntent();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 640px)");
        setIsMobile(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
        mutate();
    }, [mutate]);

    if (error) {
        return (
            <div className="text-sm text-black/50 py-4">{error.message}</div>
        );
    }

    if (isPending || !clientSecret) {
        return (
            <div className="py-4 text-sm text-black/50 animate-pulse">
                Loading payment methods...
            </div>
        );
    }

    return (
        <Elements
            stripe={stripePromise}
            
            options={{
                clientSecret,
                appearance: appearance(isMobile),
                fonts: [
                    {
                        cssSrc: "/fonts/font.css",
                    },
                ],
            }}
        >
            <PaymentForm ref={ref} />
        </Elements>
    );
});

export default StripePayment;
