"use client";

import { useState } from "react";
import Footer from "@/components/ui/organisms/Footer";
import AccountNavigation from "@/components/ui/pages/account/AccountNavigation";
import AccountTier from "@/components/ui/pages/account/AccountTier";
import AccountProfileForm from "@/components/ui/pages/account/AccountProfileForm";
import AccountAddressForm from "@/components/ui/pages/account/AccountAddressForm";
import DeleteAccountSection from "@/components/ui/pages/account/DeleteAccountSection";

export default function AccountPage() {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="px-[100px] max-tablet:px-[5%] relative w-full bg-[#fffefa]" data-header-theme="light">
      <section className="mx-auto grid grid-cols-10 max-tablet:grid-cols-1 gap-32 max-tablet:gap-10 pt-32 max-tablet:pt-26 pb-27 max-tablet:pb-24 max-mobile:pb-15 max-mobile:pt-16">
        
        {/* LEFT – STICKY side section */}
        <aside className="col-span-3 self-start h-full max-tablet:hidden">
          <AccountNavigation active={activeSection} setActive={setActiveSection} />
        </aside>

        {/* RIGHT – CONTENT */}
        <div className="col-span-7 max-tablet:col-span-1 flex flex-col gap-9 max-tablet:gap-0">
          
          {/* Mobile Navigation (shown below header on tablet/mobile only) */}
          <div className="hidden max-tablet:block max-tablet:mt-9 max-tablet:mb-16 max-mobile:mt-6 max-mobile:mb-9">
            <AccountNavigation active={activeSection} setActive={setActiveSection} />
          </div>

          {activeSection === "profile" && (
            <div className="flex flex-col gap-24">
              <AccountTier />
              <div className="h-px w-full bg-black/10" />
              <AccountProfileForm />
              <div className="h-px w-full bg-black/10" />
              <AccountAddressForm />
              <div className="h-px w-full bg-black/10" />
              <DeleteAccountSection />
            </div>
          )}

          {activeSection === "orders" && (
            <div className="min-h-[400px] flex items-center justify-center">
              <p className="text-sm text-black/40 uppercase tracking-widest font-light">
                No orders found
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
