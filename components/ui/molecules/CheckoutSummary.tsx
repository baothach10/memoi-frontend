"use client";

import Link from "next/link";
import { CartItem } from "@/utils/cartUtils";
import OrderItemCard from "../pages/account/OrderItemCard";
import { AlertCircle } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

// --- Sub-components ---

export const SummaryHeader = () => (
    <h2 className="text-xl font-regular uppercase max-mobile:text-lg">
        Your Cart
    </h2>
);

export const SummaryItems = ({
    items,
}: {
    items: CartItem[];
}) => (
    <div className="flex flex-col gap-2.5">
        {items.map((item, index) => (
            <OrderItemCard
                key={`${item.product_id}-${index}`}
                item={
                    {
                        id: item.product_id as string,
                        name: item.productName,
                        color_name: item.color_name,
                        size: item.size,
                        price: item.price,
                        sale_price: item.sale_price,
                        quantity: item.quantity,
                        image: item.productImage,
                    }
                }
            />
        ))}
    </div>
);

export const SummaryPromo = ({
    promoCode,
    setPromoCode,
    onApply,
    isValidating,
    error,
}: {
    promoCode: string;
    setPromoCode: (val: string) => void;
    onApply: () => void;
    isValidating: boolean;
    error: string | null;
}) => (
    <div className="flex flex-col gap-2">
        <div className="flex gap-2.5 items-end justify-end">
            <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promocode"
                className="relative h-fit flex-1 border-b border-black/40 pb-2 bg-transparent text-sm outline-none focus:border-black/60 placeholder:text-black/40"
            />
            <button
                type="button"
                onClick={onApply}
                disabled={isValidating || !promoCode}
                className="border border-black/20 px-18 py-4 text-sm cursor-pointer leading-none hover:border-black/40 transition-colors disabled:opacity-50 max-mobile:text-xs max-mobile:py-3 max-mobile:px-14"
            >
                {isValidating ? "Checking..." : "Apply"}
            </button>
        </div>
        {error && (
            <div className="flex items-start gap-1 text-[#B3261E] text-xs">
                <AlertCircle size={12} className="mt-px max-tablet:mt-px" />
                <span>{error}</span>
            </div>
        )}
    </div>
);

export const SummaryTotals = ({
    subtotal,
    shippingLabel,
    shippingCost,
    welcomeDiscountAmount,
    tierDiscount,
    birthMonthDiscount,
    promoDiscount,
    currency
}: {
    subtotal: number;
    shippingLabel: string;
    shippingCost: number;
    welcomeDiscountAmount: number;
    birthMonthDiscount: number;
    tierDiscount: number;
    promoDiscount: number;
    currency: string;
}) => (
    <div className="flex flex-col gap-2 text-sm font-regular">
        <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{currency} {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shippingCost == 0 ? shippingLabel : `${currency} ${shippingCost.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between">
            <span>Tier Discount</span>
            <span>{currency} {tierDiscount > 0 ? `${tierDiscount.toFixed(2)}` : "0.00"}</span>
        </div>
        <div className="flex justify-between">
            <span>Birth Month Discount</span>
            <span>{currency} {birthMonthDiscount > 0 ? `${birthMonthDiscount.toFixed(2)}` : "0.00"}</span>
        </div>
        <div className="flex justify-between">
            <span>Promo Discount</span>
            <span>{currency} {promoDiscount > 0 ? `${promoDiscount.toFixed(2)}` : "0.00"}</span>
        </div>
        <div className="flex justify-between">
            <span>Welcome Discount</span>
            <span>{currency} {welcomeDiscountAmount > 0 ? `${welcomeDiscountAmount.toFixed(2)}` : "0.00"}</span>
        </div>
    </div>
);

export const SummaryTotalAmount = ({ total, currency }: { total: number, currency: string }) => (
    <div className="flex justify-between items-baseline pt-8 border-t border-black/10 text-xl max-mobile:text-lg">
        <div className="flex items-baseline gap-2">
            <span className=" font-regular">Total</span>
            <span className="text-black/50">(TAX INCLUDED)</span>
        </div>
        <span className=" font-regular">{currency} {total.toFixed(2)}</span>
    </div>
);

export const MobileSummaryTotalAmount = ({ total, currency }: { total: number, currency: string }) => (
    <div className="flex justify-between items-baseline border-black/10 text-lg">
        <div className="flex items-baseline gap-2">
            <span className=" font-regular">Total</span>
            <span className="text-black/50">(TAX INCLUDED)</span>
        </div>
        <span className=" font-regular">{currency} {total.toFixed(2)}</span>
    </div>
);

export const SummaryActions = ({
    onPlaceOrder,
    isProcessing,
}: {
    onPlaceOrder: () => void;
    isProcessing: boolean;
}) => (
    <div className="flex flex-col gap-8">
        <button
            type="button"
            onClick={onPlaceOrder}
            disabled={isProcessing}
            className="w-full bg-black text-white py-4 text-sm leading-none cursor-pointer hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed max-mobile:py-3.5 max-mobile:text-xs"
        >
            {isProcessing ? "Processing..." : "Preorder"}
        </button>

        <p className="text-sm text-black max-mobile:text-xs">
            By proceeding, I confirm that I have read and accept the{" "}
            <Link
                href="/terms-and-conditions"
                className="underline underline-offset-4 decoration-black/40 cursor-pointer"
            >
                Terms and Conditions
            </Link>{" "}
            and the{" "}
            <Link
                href="/privacy-policy"
                className="underline underline-offset-4 decoration-black/40 cursor-pointer"
            >
                Privacy Policy
            </Link>
            .
        </p>
    </div>
);

interface CheckoutSummaryProps {
    onPlaceOrder: () => void;
    isProcessing: boolean;
    shippingCost: number;
    shippingLabel: string;
    items: CartItem[];
    subtotal: number;
    promoDiscountAmount: number;
    welcomeDiscountAmount: number;
    tierDiscountAmount: number;
    birthMonthDiscountAmount: number;
    total: number;
    promoCode: string;
    setPromoCode: (val: string) => void;
    onApplyPromo: () => void;
    isValidatingPromo: boolean;
    promoError: string | null;
}

// --- Main Component ---

export default function CheckoutSummary({
    onPlaceOrder,
    isProcessing,
    shippingCost,
    shippingLabel,
    items,
    subtotal,
    promoDiscountAmount,
    welcomeDiscountAmount,
    birthMonthDiscountAmount,
    tierDiscountAmount,
    total,
    promoCode,
    setPromoCode,
    onApplyPromo,
    isValidatingPromo,
    promoError,
}: CheckoutSummaryProps) {
    const { currency } = useCurrency();
    const activeCurrency = currency || "SGD";
    return (
        <div className="flex flex-col gap-12">
            <SummaryHeader />

            {items.length > 0 && (
                <SummaryItems
                    items={items}
                />
            )}

            <div className="flex flex-col gap-8 ">
                <SummaryPromo
                    promoCode={promoCode}
                    setPromoCode={setPromoCode}
                    onApply={onApplyPromo}
                    isValidating={isValidatingPromo}
                    error={promoError}
                />
                <SummaryTotals
                    subtotal={subtotal}
                    shippingLabel={shippingLabel}
                    shippingCost={shippingCost}
                    welcomeDiscountAmount={welcomeDiscountAmount}
                    tierDiscount={tierDiscountAmount}
                    promoDiscount={promoDiscountAmount}
                    birthMonthDiscount={birthMonthDiscountAmount}
                    currency={activeCurrency}
                />
                <SummaryTotalAmount total={total} currency={activeCurrency} />
            </div>

            <SummaryActions
                onPlaceOrder={onPlaceOrder}
                isProcessing={isProcessing}
            />
        </div>
    );
}
