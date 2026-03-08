"use client";

import { useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";

export default function PaymentForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handlePayment = async () => {
        if (!stripe || !elements) return;

        setIsProcessing(true);
        setMessage(null);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/success`,
            },
        });

        if (error) {
            setMessage(error.message || "An unexpected error occurred.");
        }

        setIsProcessing(false);
    };

    return (
        <div className="flex flex-col gap-6">
            <PaymentElement
                options={{
                    layout: "tabs",
                    wallets: {
                        applePay: "auto",
                        googlePay: "auto",
                    },
                }}
            />

            {message && (
                <div className="text-sm text-red-600">{message}</div>
            )}

            <button
                type="button"
                onClick={handlePayment}
                disabled={!stripe || isProcessing}
                className="w-full bg-black text-white py-4 text-sm tracking-wider hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isProcessing ? "Processing..." : "Pay"}
            </button>
        </div>
    );
}
