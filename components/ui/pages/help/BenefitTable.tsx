"use client";

import TickIcon from "@/components/ui/atoms/TickIcon";

type Tier = "MEMOÍ" | "MEMOÍ +" | "MEMOÍ ELITE";

const TIERS: Tier[] = ["MEMOÍ", "MEMOÍ +", "MEMOÍ ELITE"];
const TIERS_PRICE: Record<Tier, string> = {
    "MEMOÍ": "",
    "MEMOÍ +": "S$3,000",
    "MEMOÍ ELITE": "S$8,000",
};

const BENEFITS: Array<{
    title: string;
    subtitle?: string;
    included: Record<Tier, boolean>;
}> = [
        {
            title: "Welcome Discount",
            subtitle: "10% discount off for first purchase",
            included: { "MEMOÍ": true, "MEMOÍ +": true, "MEMOÍ ELITE": true },
        },
        {
            title: "Community Channel",
            subtitle: "Access to the Private community channel",
            included: { "MEMOÍ": true, "MEMOÍ +": true, "MEMOÍ ELITE": true },
        },
        {
            title: "Birth Month Offer",
            subtitle: "One-time 5% off during your birth month",
            included: { "MEMOÍ": true, "MEMOÍ +": true, "MEMOÍ ELITE": true },
        },
        {
            title: "Popups",
            subtitle: "Access to MEMOÍ popups",
            included: { "MEMOÍ": true, "MEMOÍ +": true, "MEMOÍ ELITE": true },
        },
        {
            title: "Exclusive Lifetime Discount",
            subtitle: "10% discount for all orders",
            included: { "MEMOÍ": false, "MEMOÍ +": true, "MEMOÍ ELITE": false },
        },
        {
            title: "Exclusive Lifetime Discount",
            subtitle: "15% discount for all orders",
            included: { "MEMOÍ": false, "MEMOÍ +": false, "MEMOÍ ELITE": true },
        },
        {
            title: "Exclusive Events",
            subtitle: "Invitations to MEMOÍ events",
            included: { "MEMOÍ": false, "MEMOÍ +": true, "MEMOÍ ELITE": true },
        },
        {
            title: "Priority Orders",
            subtitle: "Priority orders limited edition",
            included: { "MEMOÍ": false, "MEMOÍ +": true, "MEMOÍ ELITE": true },
        },
        {
            title: "Personalized Service",
            subtitle: "Personalized styling session",
            included: { "MEMOÍ": false, "MEMOÍ +": false, "MEMOÍ ELITE": true },
        },
    ];

export default function BenefitTable() {


    return (
        <div className="w-full overflow-x-auto">
            <div className="grid grid-cols-[1fr_120px_120px_120px] gap-x-20 max-mobile:grid-cols-[1fr_1fr_1fr_1fr] max-mobile:gap-x-0">
                {/* Header */}
                <div />
                {TIERS.map((t) => (
                    <div key={t} className="text-center pb-4 flex flex-col items-center max-mobile:text-sm justify-between">
                        <div className="text-[16px] font-regular max-mobile:text-sm">{t}</div>
                        <div className="text-[16px] text-black/60 mt-2 max-mobile:gap-2 max-mobile:text-sm">{TIERS_PRICE[t]}</div>
                    </div>
                ))}

                {/* Rows */}
                {BENEFITS.map((b, idx) => (
                    <div key={idx} className="contents text-sm max-mobile:text-xs">
                        <div className={idx === BENEFITS.length - 1 ? "mb-0" : "mb-8"}>
                            <div className=" font-regular">{b.title}</div>
                            {b.subtitle && <div className=" text-black/60 mt-2 max-mobile:mt-1">{b.subtitle}</div>}
                        </div>

                        {TIERS.map((t) => (
                            <div key={`${t}-${idx}`} className={`text-center flex items-center justify-center ${idx === BENEFITS.length - 1 ? "mb-0" : "mb-8"}`}>
                                {b.included[t] ? (
                                    <div className="flex items-center justify-center">
                                        <div className="max-mobile:hidden block">
                                            <TickIcon width={24} height={24} />
                                        </div>
                                        <div className="hidden max-mobile:block">
                                            <TickIcon width={20} height={20} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-4" />
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
