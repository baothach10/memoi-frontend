"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";

export interface PaymentFormRef {
    confirmPayment: () => Promise<boolean>;
}

const PaymentForm = forwardRef<PaymentFormRef>(function PaymentForm(_props, ref) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
        confirmPayment: async () => {
            if (!stripe || !elements) return false;

            setMessage(null);

            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/checkout/success`,
                },
            });

            if (error) {
                setMessage(error.message || "An unexpected error occurred.");
                return false;
            }

            return true;
        },
    }));

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

        </div>
    );
});

export default PaymentForm;
