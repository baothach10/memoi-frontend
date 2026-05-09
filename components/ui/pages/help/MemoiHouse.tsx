"use client";

import ExpandableSection from "../../molecules/ExpandableSection";
import BenefitTable from "./BenefitTable";

export default function MemoiHouse() {
    return (
        <div className="text-sm space-y-16">
            <div className="space-y-5">

                <h2 className="uppercase text-[16px] leading-[120%] mb-4 max-mobile:text-sm">The MEMOÍ House</h2>
                <div className="text-black space-y-2 leading-normal max-mobile:text-xs">
                    <p>
                        Welcome to The MEMOÍ House, an intimate collective shaped by a shared sense of refinement and intention.
                        More than membership, it is a space of quiet belonging. Here, your presence is acknowledged through considered privileges, including private access to collections, thoughtful offerings, and priority experiences.
                    </p>
                </div>
            </div>
            <div className="relative w-full h-full space-y-16 max-mobile:space-y-10">
                <div>
                    <BenefitTable />
                </div>
                <div>
                    <ExpandableSection title={"How to Qualify"} titleClassName="text-[16px] py-8 border-t border-t-black/10 max-mobile:text-sm max-mobile:py-6" defaultOpen={true}>
                        <div className="leading-normal space-y-2 text-sm pb-8 max-mobile:text-xs max-mobile:pb-6">
                            <p >Exclusive membership tiers are achieved when your cumulative spending reaches the required threshold:</p>
                            <ul className="list-['-_'] list-inside space-y-2">
                                <li><span className="font-regular">MEMOÍ +:</span> Achieve S$3,000 in accumulated spending.</li>
                                <li><span className="font-regular">MEMOÍ ELITE:</span> Achieve S$8,000 in accumulated spending.</li>
                            </ul>
                        </div>
                    </ExpandableSection>
                    <ExpandableSection title={"Status Maintenance and Validity"} titleClassName="text-[16px] py-8 border-t border-t-black/10 max-mobile:text-sm max-mobile:py-6" defaultOpen={true}>
                        <div className="leading-normal space-y-2 text-sm pb-8 max-mobile:text-xs max-mobile:pb-6">
                            <p >To ensure the best experience and extend membership benefits, your status is tied to a rolling 6-month period from the date of your last purchase.</p>
                            <ul className="list-['-_'] list-inside space-y-2">
                                <li><span className="font-regular">Validity Period:</span> Your privileges are active for 6 months after your last transaction.</li>
                                <li><span className="font-regular">Maintenance & Upgrade:</span> To maintain your current status or upgrade to the next level, you must generate sufficient new spending within this 6-month period.</li>
                                <li><span className="font-regular">Extension:</span> Every new purchase you make automatically extends your 6-month validity period.</li>
                            </ul>
                        </div>
                    </ExpandableSection>
                </div>
            </div>
        </div >
    );
}
