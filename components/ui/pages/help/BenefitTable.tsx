"use client";

import TickIcon from "@/components/ui/atoms/TickIcon";

type Tier = "MEMOI" | "MEMOI+" | "MEMOI ELITE";

const TIERS: Tier[] = ["MEMOI", "MEMOI+", "MEMOI ELITE"];
const TIERS_PRICE: Record<Tier, string> = {
    "MEMOI": "",
    "MEMOI+": "S$3,000",
    "MEMOI ELITE": "S$8,000",
};

const BENEFITS: Array<{
    title: string;
    subtitle?: string;
    included: Record<Tier, boolean>;
}> = [
        {
            title: "Welcome Discount",
            subtitle: "S$10 discount for first purchase",
            included: { "MEMOI": true, "MEMOI+": true, "MEMOI ELITE": true },
        },
        {
            title: "Community Channel",
            subtitle: "Access to the Private community channel",
            included: { "MEMOI": true, "MEMOI+": true, "MEMOI ELITE": true },
        },
        {
            title: "Birth Month Discount",
            subtitle: "10% discount during your birth month",
            included: { "MEMOI": true, "MEMOI+": true, "MEMOI ELITE": true },
        },
        {
            title: "Popups",
            subtitle: "Access to MEMOÍ popups",
            included: { "MEMOI": true, "MEMOI+": true, "MEMOI ELITE": true },
        },
        {
            title: "Exclusive Lifetime Discount",
            subtitle: "10% discount for all orders",
            included: { "MEMOI": false, "MEMOI+": true, "MEMOI ELITE": false },
        },
        {
            title: "Exclusive Lifetime Discount",
            subtitle: "15% discount for all orders",
            included: { "MEMOI": false, "MEMOI+": false, "MEMOI ELITE": true },
        },
        {
            title: "Exclusive Events",
            subtitle: "Invitations to MEMOÍ events",
            included: { "MEMOI": false, "MEMOI+": true, "MEMOI ELITE": true },
        },
        {
            title: "Priority Orders",
            subtitle: "Priority orders limited edition",
            included: { "MEMOI": false, "MEMOI+": true, "MEMOI ELITE": true },
        },
        {
            title: "Personalized Service",
            subtitle: "Personalized styling session",
            included: { "MEMOI": false, "MEMOI+": false, "MEMOI ELITE": true },
        },
    ];

export default function BenefitTable() {


    return (
        <div className="w-full overflow-x-auto">
            <div className="grid grid-cols-[1fr_120px_120px_120px] gap-x-20">
                {/* Header */}
                <div />
                {TIERS.map((t) => (
                    <div key={t} className="text-center pb-4">
                        <div className="text-[16px] font-regular">{t}</div>
                        <div className="text-[16px] text-black/60 mt-2">{TIERS_PRICE[t]}</div>
                    </div>
                ))}

                {/* Rows */}
                {BENEFITS.map((b, idx) => (
                    <div key={idx} className="contents space-y-8">
                        <div >
                            <div className="text-sm font-regular">{b.title}</div>
                            {b.subtitle && <div className="text-sm text-black/60 mt-2">{b.subtitle}</div>}
                        </div>

                        {TIERS.map((t) => (
                            <div key={`${t}-${idx}`} className="text-center flex items-center justify-center">
                                {b.included[t] ? (
                                    <div className="flex items-center justify-center">
                                        <TickIcon width={24} height={24} />
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
