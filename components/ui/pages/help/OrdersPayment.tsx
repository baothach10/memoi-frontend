"use client";

import ExpandableSection from "@/components/ui/molecules/ExpandableSection";

export default function OrdersPayment() {
    return (
        <div className="text-sm">
            <h2 className="uppercase text-[16px] leading-[120%] py-4">Orders & Payment</h2>
            <ExpandableSection title={"PLACING AN ORDER"} titleClassName="text-[16px] py-5 border-t border-t-black/10" defaultOpen={true}>
                <div className="leading-normal space-y-2 text-sm pb-8">
                    <p>
                        All orders can be placed directly through the official MEMOI website. Upon completing your purchase,
                        you will receive an order confirmation email detailing your order summary and payment information.
                    </p>
                    <p className="mt-4">
                        MEMOI offers both in-stock and pre-order pieces. For pre-order items, the estimated delivery timeframe will
                        be indicated on the product page.
                    </p>
                    <p className="mt-4">
                        Should you wish to update your delivery information or request a size change after placing an order,
                        please contact us promptly via email or WhatsApp, or direct message on our official page.
                    </p>
                </div>
            </ExpandableSection>

            <ExpandableSection title={"PAYMENT METHODS"} titleClassName="text-[16px] py-5 border-t border-t-black/10" defaultOpen={true}>
                <div className="space-y-2 pb-8">
                    <p>
                        MEMOI accepts the following secure payment options:
                    </p>
                    <ul className="mt-3 list-disc list-inside text-sm space-y-2">
                        <li>Visa, MasterCard, American Express</li>
                        <li>PayPal</li>
                        <li>Apple Pay</li>
                        <li>Bank Transfer</li>
                        <li>PayNow, PayLah!</li>
                    </ul>
                    <p className="mt-4 text-sm">All prices displayed on our website are in Singapore Dollars (SGD) and inclusive of GST.</p>
                </div>
            </ExpandableSection>
            <div className="border-t pt-8 space-y-8 border-t-black/10">
                <h2 className=" text-[16px] font-regular">Additional Information</h2>
                <div className="text-black leading-normal space-y-2">
                    <p>Once your payment is successfully processed, you will receive a confirmation email with a digital invoice for your records.</p>
                    <p>For any questions regarding orders or payments, please contact our Customer Care team at support@memoiofficial.com.</p>
                </div>
            </div>

        </div>
    );
}
