"use client";

import Footer from "@/components/ui/organisms/Footer";
import { useRouter, useSearchParams } from "next/navigation";
import ShippingExchanges from "@/components/ui/pages/help/ShippingExchanges";
import OrdersPayment from "@/components/ui/pages/help/OrdersPayment";
import MemoiHouse from "@/components/ui/pages/help/MemoiHouse";
import MemoiCare from "@/components/ui/pages/help/MemoiCare";
import LeftHelpNavigation from "@/components/ui/pages/help/LeftHelpNavigation";



export default function HelpPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const activeSection = searchParams.get("tab") || "shipping";
    const validSections = ["shipping", "orders", "house", "care"];

    // Ensure activeSection is valid
    const currentSection = validSections.includes(activeSection) ? activeSection : "shipping";

    const handleSetActive = (section: string) => {
        router.push(`/help?tab=${section}`);
    };

    return (
        <div className=" px-[100px] relative w-full bg-[#fffefa]" data-header-theme="light">
            {/* FAQ CONTENT WRAPPER (sticky boundary) */}
            <section className=" mx-auto grid grid-cols-10 gap-32 pt-36 pb-27" id="help-section">

                {/* LEFT – STICKY side section */}
                <aside className="col-span-3 self-start h-full">
                    <LeftHelpNavigation active={currentSection} setActive={handleSetActive} />
                </aside>

                {/* RIGHT – FAQ CONTENT */}
                <div id="help-main" className="col-span-7 flex flex-col gap-9">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-2xl font-regular uppercase">
                            FREQUENTLY ASKED QUESTIONS
                        </h1>
                        <p className="text-sm text-black/60">
                            Latest Updates: 12/12/2025
                        </p>
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
