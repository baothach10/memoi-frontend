"use client";

import ExpandableSection from "@/components/ui/molecules/ExpandableSection";

export default function OrdersPayment() {
    return (
        <div className="text-sm">
            <h2 className="uppercase text-[16px] leading-[120%] py-4 max-mobile:text-sm">Orders & Payment</h2>
            <ExpandableSection title={"PLACING AN ORDER"} titleClassName="text-[16px] py-5 border-t border-t-black/10 max-mobile:text-sm" defaultOpen={true}>
                <div className="leading-normal space-y-2 text-sm pb-8 max-mobile:text-xs">
                    <p>
                        All orders are placed through the official MEMOÍ website. Upon completion, you will receive a confirmation email with your order details and payment summary.
                    </p>
                    <p className="mt-4">
                        MEMOÍ offers both in-stock and pre-order pieces. For pre-order pieces, the estimated delivery timeframe will be indicated on the product page.
                    </p>
                    <p className="mt-4">
                        If you wish to update your delivery details or request a size adjustment after placing an order, please contact us promptly via email, WhatsApp, or direct message on our official channels.
                    </p>
                </div>
            </ExpandableSection>

            <ExpandableSection title={"PAYMENT METHODS"} titleClassName="text-[16px] py-5 border-t border-t-black/10 max-mobile:text-sm" defaultOpen={true}>
                <div className="space-y-2 pb-8 max-mobile:text-xs">
                    <p>
                        MEMOÍ accepts the following secure payment options:
                    </p>
                    <ul className="mt-3 list-disc list-inside text-sm space-y-2 max-mobile:text-xs">
                        <li>Visa, MasterCard, American Express</li>
                        <li>PayNow</li>
                    </ul>
                    <p className="mt-4 text-sm max-mobile:text-xs">All prices displayed on our website are in Singapore Dollars (SGD) and inclusive of GST.</p>
                </div>
            </ExpandableSection>
            <div className="border-t pt-8 space-y-8 border-t-black/10 max-mobile:pt-5 max-mobile:space-y-5">
                <h2 className=" text-[16px] font-regular max-mobile:text-sm">Additional Information</h2>
                <div className="text-black leading-normal space-y-2  max-mobile:text-xs">
                    <p>Once your payment is successfully processed, you will receive a confirmation email with a digital invoice for your records.</p>
                    <p>For any questions regarding orders or payments, please contact our Customer Care team at support@memoiofficial.com.</p>
                </div>
            </div>

        </div>
    );
}
