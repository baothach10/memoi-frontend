"use client";

import Link from "next/link";
import ExpandableSection from "../../molecules/ExpandableSection";

export default function ShippingExchanges() {
    return (
        <div className="text-sm">
            <h2 className="uppercase text-[16px] leading-[120%] py-4 max-mobile:text-sm">Shipping & Exchanges</h2>
            <ExpandableSection title={"SHIPPING POLICY"} titleClassName="text-[16px] py-8 border-t border-t-black/10 max-mobile:text-sm max-mobile:py-6" defaultOpen={true}>
                <div className="leading-normal space-y-2 text-sm pb-8 max-mobile:text-xs max-mobile:pb-6">
                    <p>
                        At MEMOÍ, each order is carefully prepared and packaged with precision to ensure your pieces arrive in perfect condition. We offer worldwide shipping from Singapore.
                    </p>
                    <p>
                        <span className="font-regular">Processing Time: </span>Orders are processed within 2–3 business days upon confirmation (excluding weekends and public holidays).
                    </p>
                    <div className="space-y-2">
                        <p className="font-regular ">Delivery Time: </p>
                        <ul className="list-['-_'] list-inside space-y-2">
                            <li>Domestic (Singapore): Estimated 2-3 business days after dispatch.</li>
                            <li>International: 5-10 business days  after dispatch, depending on destination and customs clearance.</li>
                        </ul>
                    </div>
                    <p>Complimentary International Shipping is offered for all orders from 500 SGD.</p>
                </div>
            </ExpandableSection>
            <ExpandableSection title={"EXCHANGE POLICY"} titleClassName="text-[16px] py-8 border-t border-t-black/10 max-mobile:text-sm max-mobile:py-6" defaultOpen={true}>
                <div className="leading-normal space-y-2 text-sm pb-8 max-mobile:text-xs max-mobile:pb-6">
                    <div className="space-y-2">
                        <p>At MEMOÍ, each piece is designed to fit with intention. We offer a one-time exchange per order within 7 days of receipt, for size adjustments only.</p>
                        <ul className="list-['-_'] list-inside pace-y-2">
                            <li>Domestic Orders (Singapore): One-time complimentary return shipping is provided.</li>
                            <li>International Orders: Return and reshipment costs are borne by the customer.</li>
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <p>Conditions:</p>
                        <ul className="list-['-_'] list-inside space-y-2">
                            <li>Items must be returned in original condition — unworn, unwashed, and unaltered — with all tags, labels, and packaging intact.</li>
                        </ul>
                    </div>
                    <p>PLEASE NOTE REFUNDS ARE NOT OFFERED. CUSTOM-MADE AND PRE-ORDER PIECES ARE NOT ELIGIBLE FOR EXCHANGE.</p>
                </div>
            </ExpandableSection>
            <div className="border-t pt-8 space-y-8 border-t-black/10 max-mobile:text-xs max-mobile:pt-6 max-mobile:space-y-6">
                <h2 className=" text-[16px] font-regular max-mobile:text-sm">Additional Information</h2>
                <div className="text-black leading-normal space-y-2">
                    <p>MEMOÍ reserves the right to decline any item that does not meet the stated exchange conditions.</p>
                    <p>Once your request is approved, our Customer Care team will guide you through the next steps with care.</p>
                    <p>For all shipping and exchange inquiries, please contact us at <Link href="mailto:memoi@memoiofficial.com" className="cursor-pointer">
                        memoi@memoiofficial.com
                    </Link>.</p>
                </div>
            </div>
        </div>
    );
}
