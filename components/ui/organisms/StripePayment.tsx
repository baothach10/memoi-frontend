"use client";

import { useEffect, forwardRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCreatePaymentIntent } from "@/queries/useCreatePaymentIntent";
import PaymentForm, { PaymentFormRef } from "@/components/ui/molecules/PaymentForm";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const appearance = {
    theme: "flat" as const,
    variables: {
        colorPrimary: "#000000",
        colorBackground: "#fffefa",
        colorText: "#000000",
        colorDanger: "#df1b41",
        fontFamily: "HelveticaNeueLightWoff, sans-serif",
        spacingUnit: "4px",
        borderRadius: "0px",
        colorTextSecondary: "rgba(0, 0, 0, 0.6)",
        colorTextPlaceholder: "rgba(0, 0, 0, 0.4)",
    },
    rules: {
        ".Tab": {
            border: "1px solid rgba(0, 0, 0, 0.1)",
            boxShadow: "none",
        },
        ".Tab:hover": {
            color: "#000000",
        },
        ".Tab--selected": {
            border: "1px solid #000000",
            boxShadow: "none",
        },
        ".Input": {
            border: "1px solid rgba(0, 0, 0, 0.2)",
            boxShadow: "none",
        },
        ".Input:focus": {
            border: "1px solid rgba(0, 0, 0, 0.6)",
            boxShadow: "none",
        },
        ".Label": {
            fontSize: "14px",
            fontWeight: "400",
            color: "rgba(0, 0, 0, 0.7)",
        },
    },
};

const StripePayment = forwardRef<PaymentFormRef>(function StripePayment(_props, ref) {
    const { mutate, data: clientSecret, error, isPending } = useCreatePaymentIntent();

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
                appearance,
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
