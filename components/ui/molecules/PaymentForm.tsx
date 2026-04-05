"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { useCreatePaymentIntent, BillingInfo, ProductItem } from "@/queries/useCreatePaymentIntent";

export interface PaymentFormRef {
    confirmPayment: () => Promise<boolean>;
}

interface PaymentFormProps {
    items: ProductItem[];
    billingInfo: BillingInfo;
    promoCode?: string;
}

const PaymentForm = forwardRef<PaymentFormRef, PaymentFormProps>(function PaymentForm({ items, billingInfo, promoCode }, ref) {
    const stripe = useStripe();
    const elements = useElements();
    const { mutateAsync: createIntent } = useCreatePaymentIntent();
    const [message, setMessage] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useImperativeHandle(ref, () => ({
        confirmPayment: async () => {
            if (!stripe || !elements || !isReady) {
                console.warn("Stripe, Elements, or PaymentElement not ready yet.");
                return false;
            }

            setIsProcessing(true);
            setMessage(null);

            try {
                // 1. Validate form fields via elements.submit()
                const { error: submitError } = await elements.submit();
                if (submitError) {
                    setMessage(submitError.message || "Please fix validation errors.");
                    return false;
                }

                // 2. Create actual Payment Intent via backend
                const clientSecret = await createIntent({
                    products: items,
                    billingInfo,
                    promoCode
                });

                if (!clientSecret) {               
                    throw new Error("Failed to create payment intent");
                }

                // 3. Confirm payment with the client secret
                const { error } = await stripe.confirmPayment({
                    elements,
                    clientSecret,
                    confirmParams: {
                        return_url: `${window.location.origin}/checkout/success`,
                    },
                });

                if (error) {
                    setMessage(error.message || "An unexpected error occurred.");
                    return false;
                }

                return true;
            } catch (err: any) {
                setMessage(err.message || "Failed to process payment.");
                return false;
            } finally {
                setIsProcessing(false);
            }
        },
    }));

    return (
        <div className="flex flex-col gap-6">
            <div className={isProcessing ? "pointer-events-none opacity-50 transition-opacity" : ""}>
                <PaymentElement
                    onReady={() => setIsReady(true)}
                    options={{
                        layout: "tabs",
                    }}
                />
            </div>
            {message && <div className="text-sm text-red-500 mt-2">{message}</div>}
            {isProcessing && <div className="text-sm text-black/50 animate-pulse">Processing your order...</div>}
        </div>
    );
});

export default PaymentForm;
