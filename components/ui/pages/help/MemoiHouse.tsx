"use client";

import BenefitTable from "./BenefitTable";

export default function MemoiHouse() {
    return (
        <div className="text-sm space-y-16">
            <div className="space-y-5">

                <h2 className="uppercase text-[16px] leading-[120%] mb-4">The MEMOÍ House</h2>
                <div className="text-black space-y-2 leading-normal">
                    <p>
                        Welcome to The MEMOÍ House, our exclusive client collective where sophisticated belonging meets conscious elegance. More than a membership, the House is where we recognize and reward your commitment, granting you access to special discounts, personalized services, and priority access to new collections and events.
                    </p>
                </div>
            </div>
            <div>
                <BenefitTable />
            </div>
        </div>
    );
}
