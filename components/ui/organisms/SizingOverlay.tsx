"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface SizingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SIZING_DATA = [
  { size: "SERENE", chest: "82 – 86", waist: "64 – 68", hip: "90 – 94", shoulder: "36", height: "155 – 162" },
  { size: "MUSE", chest: "86 – 90", waist: "68 – 72", hip: "94 – 98", shoulder: "37 – 38", height: "160 – 167" },
  { size: "LUMINOUS", chest: "90 – 96", waist: "72 – 78", hip: "98 – 104", shoulder: "39 – 40", height: "165 – 172" },
];

export default function SizingOverlay({
  isOpen,
  onClose,
}: SizingOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
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
        className={`fixed top-0 right-0 h-dvh w-4/10 bg-[#fffefa] z-101 transform transition-transform duration-300 ease-in-out max-tablet:w-full max-tablet:shadow-transparent ${isOpen ? "translate-x-0 pointer-events-auto shadow-2xl" : "translate-x-[105%] pointer-events-none"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Close Button Header */}
          <div className="absolute top-0 right-0 flex items-center justify-between px-6 pt-6">
            <div />
            <button
              onClick={onClose}
              className="text-black hover:text-gray-600 cursor-pointer transition-all duration-300 active:duration-0 p-2 active:bg-black/20"
              aria-label="Close sizing"
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

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-9 px-23 justify-center max-mobile:px-5">
            <div className="flex flex-col items-center gap-8 text-center">
              <h2 className="text-xl uppercase font-regular max-mobile:text-lg">SIZING</h2>
              <div >
                <p className="text-sm text-black font-light leading-normal max-mobile:text-xs">
                  The measurements may vary slightly due to the production process.
                  <br />
                  The garment is measured on a flat surface
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <p className="text-sm text-center underline font-regular uppercase decoration-black/40">CM</p>

              <div className="w-full">
                <table className="w-full text-center table-layout-fixed" style={{ tableLayout: 'fixed' }}>
                  <thead>
                    <tr className="text-xs text-black/40 uppercase max-mobile:text-[10px]">
                      <th className="font-regular py-2 text-left">Size</th>
                      <th className="font-regular py-2">Chest</th>
                      <th className="font-regular py-2">Waist</th>
                      <th className="font-regular py-2">Hip</th>
                      <th className="font-regular py-2">Shoulder</th>
                      <th className="font-regular py-2">Height</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SIZING_DATA.map((row) => (
                      <tr key={row.size} className="text-sm text-black font-light max-mobile:text-xs">
                        <td className="py-2 font-regular text-left text-black/40 max-mobile:text-[10px]">{row.size}</td>
                        <td className="py-2">{row.chest}</td>
                        <td className="py-2">{row.waist}</td>
                        <td className="py-2">{row.hip}</td>
                        <td className="py-2">{row.shoulder}</td>
                        <td className="py-2">{row.height}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
