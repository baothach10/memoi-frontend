"use client";

import { Suspense } from "react";
import Footer from "@/components/ui/organisms/Footer";
import { useRouter, useSearchParams } from "next/navigation";
import ShippingExchanges from "@/components/ui/pages/help/ShippingExchanges";
import OrdersPayment from "@/components/ui/pages/help/OrdersPayment";
import MemoiHouse from "@/components/ui/pages/help/MemoiHouse";
import MemoiCare from "@/components/ui/pages/help/MemoiCare";
import LeftHelpNavigation from "@/components/ui/pages/help/LeftHelpNavigation";

function HelpPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const activeSection = searchParams.get("tab") || "shipping";
    const validSections = ["shipping", "orders", "house", "care"];

    // Ensure activeSection is valid
    const currentSection = validSections.includes(activeSection) ? activeSection : "shipping";

    const handleSetActive = (section: string) => {
        router.push(`/help?tab=${section}`, { scroll: false });
    };

    return (
        <div className="relative w-full bg-[#fffefa]" data-header-theme="light">
            {/* FAQ CONTENT WRAPPER (sticky boundary) */}
            <section className="px-[100px] max-tablet:px-[5%] mx-auto grid grid-cols-10 max-tablet:grid-cols-1 gap-32 max-tablet:gap-10 pt-32 max-tablet:pt-26 pb-27 max-tablet:pb-24 max-mobile:pb-15 max-mobile:pt-24" id="help-section">

                {/* LEFT – STICKY side section (hidden on tablet/mobile) */}
                <aside className="col-span-3 self-start h-full max-tablet:hidden">
                    <LeftHelpNavigation active={currentSection} setActive={handleSetActive} />
                </aside>

                {/* RIGHT – FAQ CONTENT */}
                <div id="help-main" className="col-span-7 max-tablet:col-span-1 flex flex-col gap-9 max-tablet:gap-0">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-2xl font-regular uppercase max-mobile:text-lg">
                            FREQUENTLY ASKED QUESTIONS
                        </h1>
                        <p className="text-sm text-black/60 max-mobile:text-xs">
                            Latest Updates: 12/12/2025
                        </p>
                    </div>

                    {/* Navigation – shown below header on tablet/mobile only */}
                    <div className="hidden max-tablet:block max-tablet:mt-9 max-tablet:mb-16 max-mobile:mt-6 max-mobile:mb-9">
                        <LeftHelpNavigation active={currentSection} setActive={handleSetActive} />
                    </div>

                    <div>
                        {currentSection === "shipping" && <ShippingExchanges />}
                        {currentSection === "orders" && <OrdersPayment />}
                        {currentSection === "house" && <MemoiHouse />}
                        {currentSection === "care" && <MemoiCare />}
                    </div>
                </div>
            </section>

            {/* FOOTER (outside sticky boundary) */}
            <Footer />
        </div>
    );
}

export default function HelpPage() {
    return (
        <Suspense fallback={<div className="min-h-screen py-50 flex justify-center text-sm text-black/50">Loading...</div>}>
            <HelpPageContent />
        </Suspense>
    );
}
