"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ShippingPolicyOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShippingPolicyOverlay({
  isOpen,
  onClose,
}: ShippingPolicyOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Disable body scroll when overlay is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-100 transition-opacity duration-300 max-tablet:w-full ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      {/* Overlay Panel */}
      <div
        className={`fixed top-0 right-0 h-dvh w-4/10 bg-[#fffefa] z-101 transform transition-transform duration-300 ease-in-out max-tablet:w-full max-tablet:shadow-transparent ${isOpen ? "translate-x-0 pointer-events-auto shadow-2xl" : "translate-x-full pointer-events-none"
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="absolute top-0 right-0 flex items-center justify-between px-6 pt-6">
            <div />
            <button
              onClick={onClose}
              className="text-black hover:text-gray-600 cursor-pointer transition-colors"
              aria-label="Close shipping policy"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 5L5 15M5 5l10 10" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col gap-9 px-23 justify-center max-mobile:px-5">
            <h2 className="text-xl uppercase font-regular max-mobile:text-lg">SHIPPING & EXCHANGES</h2>
            {/* Content Area */}
            <div className="flex flex-col gap-8">
              <div className="space-y-5">
                <h3 className="text-xs font-regular uppercase tracking-widest text-black/40 max-mobile:text-[10px]">SHIPPING POLICY</h3>
                <div className="text-sm leading-normal text-black font-light space-y-2 max-mobile:text-xs">
                  <p>
                    At MEMOÍ, we meticulously prepare and package every order for perfect arrival. We offer Worldwide Shipping originating from Singapore.
                  </p>
                  <ul className="space-y-2">
                    <li>- Processing Time: Orders are processed within 2-3 business days (excluding weekends/public holidays).</li>
                    <li>- Delivery Time: Domestic (Singapore): Estimated 2-3 business days after dispatch. International: Estimated 7-14 business days (dependent on destination and customs).</li>
                    <li>- Shipping Fees: Costs are not included in the product price and are calculated at checkout based on your region.</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-5">
                <h3 className="text-xs font-regular uppercase tracking-widest text-black/40 max-mobile:text-[10px]">EXCHANGE POLICY</h3>
                <div className="text-sm leading-normal text-black font-light space-y-2 max-mobile:text-xs">
                  <p>We accept exchanges within 7 days of receipt for size exchange only.</p>
                  <ul className="space-y-2">
                    <li>- Eligibility: Items must be unworn, unwashed, unaltered, and returned with all original tags, labels, and packaging intact.</li>
                    <li>- Fees Responsibility: Domestic (Singapore): One-time free return shipping is provided for size exchanges. International: Customers are responsible for both return and reshipment costs.</li>
                    <li>- Exclusions: Returns for refunds are NOT accepted. Custom-made or pre-order items are non-exchangeable.</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-5">
                <h3 className="text-xs font-regular uppercase tracking-widest text-black/40 max-mobile:text-[10px]">ADDITIONAL INFORMATION</h3>
                <div className="text-sm leading-normal text-black font-light space-y-2 max-mobile:text-xs">
                  <p>
                    MEMOÍ reserves the right to reject any items that do not meet the exchange conditions. Our Customer Care team will guide you through the next steps once your request is approved.
                  </p>
                  <p>
                    Please contact us at [INFO@MEMOICOFFICIAL.COM] for all shipping and exchange questions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
