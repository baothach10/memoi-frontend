"use client";

import { useState } from "react";
import AccountNavigation from "@/components/ui/pages/account/AccountNavigation";
import AccountTier from "@/components/ui/pages/account/AccountTier";
import AccountProfileForm from "@/components/ui/pages/account/AccountProfileForm";
import AccountAddressForm from "@/components/ui/pages/account/AccountAddressForm";
import DeleteAccountSection from "@/components/ui/pages/account/DeleteAccountSection";
import { UserProfileResponse } from "@/app/api/getUserProfile";

import OrdersContent from "@/components/ui/pages/account/OrdersContent";

interface AccountContentProps {
  userProfile: UserProfileResponse;
}

export default function AccountContent({ userProfile }: AccountContentProps) {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="w-full grid grid-cols-10 max-tablet:grid-cols-1 gap-32 max-tablet:gap-10 pt-32 max-tablet:pt-26 pb-27 max-tablet:pb-24 max-mobile:pb-15 max-mobile:pt-16">

      {/* LEFT – STICKY side section */}
      <aside className="col-span-3 self-start h-full max-tablet:hidden">
        <AccountNavigation active={activeSection} setActive={setActiveSection} />
      </aside>

      {/* RIGHT – CONTENT */}
      {activeSection === "profile" && (
        <div className="col-span-6 max-tablet:col-span-1 flex flex-col gap-9 max-tablet:gap-0">

          {/* Mobile Navigation (shown below header on tablet/mobile only) */}
          <div className="hidden max-tablet:block max-tablet:mt-9 max-tablet:mb-16 max-mobile:mt-6 max-mobile:mb-9">
            <AccountNavigation active={activeSection} setActive={setActiveSection} />
          </div>

          <div className="flex flex-col gap-20">
            <AccountTier userProfile={userProfile} />
            <AccountProfileForm userProfile={userProfile} />
            <AccountAddressForm userProfile={userProfile} />
            <DeleteAccountSection />
          </div>
        </div>
      )}
      {/* RIGHT – CONTENT */}
      {activeSection === "orders" && (
        < div className="col-span-7 max-tablet:col-span-1 flex flex-col gap-9 max-tablet:gap-0">
          {/* Mobile Navigation (shown below header on tablet/mobile only) */}
          <div className="hidden max-tablet:block max-tablet:mt-9 max-tablet:mb-16 max-mobile:mt-6 max-mobile:mb-9">
            <AccountNavigation active={activeSection} setActive={setActiveSection} />
          </div>
          <OrdersContent />
        </div>
      )
      }
    </div >
  );
}
