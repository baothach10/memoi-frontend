"use client";

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
                        <span className="font-regular">Processing Time: </span>Orders are processed within 2-3 business days once confirmed. Please note that this does not include weekends or public holidays.
                    </p>
                    <div className="space-y-2">
                        <p className="font-regular ">Delivery Time: </p>
                        <ul className="list-['-_'] list-inside space-y-2">
                            <li>Domestic (Singapore): Estimated 2-3 business days after dispatch.</li>
                            <li>International: Estimated 7-14 business days (dependent on destination and customs).</li>
                        </ul>
                    </div>
                </div>
            </ExpandableSection>
            <ExpandableSection title={"EXCHANGE POLICY"} titleClassName="text-[16px] py-8 border-t border-t-black/10 max-mobile:text-sm max-mobile:py-6" defaultOpen={true}>
                <div className="leading-normal space-y-2 text-sm pb-8 max-mobile:text-xs max-mobile:pb-6">
                    <div className="space-y-2">
                        <p>We want every MEMOÍ piece to fit you perfectly. Exchanges are accepted within 7 days from the date of receipt, for SIZE EXCHANGE ONLY.</p>
                        <ul className="list-['-_'] list-inside pace-y-2">
                            <li>Domestic Orders (Singapore): One-time free return shipping is provided for size exchanges.</li>
                            <li>International Orders: Customers are responsible for return and reshipment costs.</li>
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <p>To qualify for an exchange, items must be:</p>
                        <ul className="list-['-_'] list-inside space-y-2">
                            <li>In original condition, unworn, unwashed, and unaltered.</li>
                            <li>Returned with all original tags, labels, and packaging intact.</li>
                        </ul>
                    </div>
                    <p>PLEASE NOTE THAT RETURNS FOR REFUNDS ARE NOT ACCEPTED, AND CUSTOM-MADE OR PRE-ORDER ITEMS ARE NON-EXCHANGEABLE.</p>
                </div>
            </ExpandableSection>
            <div className="border-t pt-8 space-y-8 border-t-black/10 max-mobile:text-xs max-mobile:pt-6 max-mobile:space-y-6">
                <h2 className=" text-[16px] font-regular max-mobile:text-sm">Additional Information</h2>
                <div className="text-black leading-normal space-y-2">
                    <p>MEMOÍ reserves the right to reject any items that do not meet the exchange conditions. Our Customer Care team will guide you through the next steps once your request is approved.</p>
                    <p>Please contact us at support@memoiofficial.com for all shipping and exchange inquiries.</p>
                </div>
            </div>
        </div>
    );
}
