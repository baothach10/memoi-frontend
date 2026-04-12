"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface DetailsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  description: string;
}

export default function DetailsOverlay({
  isOpen,
  onClose,
  description,
}: DetailsOverlayProps) {
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
              aria-label="Close details"
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
            <h2 className="text-xl uppercase font-regular max-mobile:text-lg">Details</h2>
            {/* Content Area */}
            <div className="flex flex-col gap-8">
              <div className="space-y-5">
                <h3 className="text-xs font-regular uppercase tracking-widest text-black/40 max-mobile:text-[10px]">Description</h3>
                <p className="text-sm leading-relaxed font-light text-black/80 max-mobile:text-xs">
                  {description}
                </p>
              </div>

              <div className="space-y-5">
                <h3 className="text-xs font-regular uppercase tracking-widest text-black/40 max-mobile:text-[10px]">Care Guide</h3>
                <div className="text-sm leading-normal text-black space-y-1 max-mobile:text-xs">
                  <p>Caring for your garments to extend their useful life.</p>
                  <p>
                    Lower temperature washes and delicate spin cycles are gentler on garments and help to protect the color, shape and structure of the fabric.
                  </p>
                  <p>
                    Our garments are crafted from delicate, high-quality fabrics that require thoughtful care to preserve their beauty, structure, and longevity.
                  </p>
                  <p>
                    Recommended care: Professional dry cleaning to maintain the fabric&apos;s original texture, colour, and form.
                  </p>
                  <ul className="space-y-2">
                    <li>- Hand wash only if necessary, using cold water and mild detergent. Do not soak.</li>
                    <li>- Do not bleach or wring. Avoid harsh chemicals and excessive friction.</li>
                    <li>- Dry flat or hang to air dry in a shaded, well-ventilated area. Avoid direct sunlight.</li>
                    <li>- Low-heat steaming only. Avoid direct contact with high heat or ironing on embellished areas.</li>
                    <li>- Store carefully, away from moisture and sharp objects, to prevent snagging or distortion.</li>
                  </ul>
                  <p>
                    Due to the natural and delicate nature of these materials, slight variations in texture or colour are part of their inherent character.
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

