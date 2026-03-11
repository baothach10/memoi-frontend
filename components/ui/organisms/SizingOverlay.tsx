"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface SizingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SIZING_DATA = [
  { size: "XXS", chest: 76, waist: 56, hip: 84, shoulder: 34, neck: 30 },
  { size: "XS", chest: 80, waist: 60, hip: 88, shoulder: 35, neck: 32 },
  { size: "S", chest: 84, waist: 64, hip: 92, shoulder: 36, neck: 34 },
  { size: "M", chest: 88, waist: 68, hip: 96, shoulder: 37, neck: 36 },
  { size: "L", chest: 92, waist: 72, hip: 100, shoulder: 38, neck: 38 },
  { size: "XL", chest: 96, waist: 76, hip: 104, shoulder: 39, neck: 40 },
  { size: "XXL", chest: 100, waist: 80, hip: 108, shoulder: 40, neck: 42 },
];

export default function SizingOverlay({
  isOpen,
  onClose,
}: SizingOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
        className={`fixed inset-0 bg-black/30 z-100 transition-opacity duration-300 max-tablet:w-full ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Overlay Panel */}
      <div
        className={`fixed top-0 right-0 h-screen w-4/10 bg-[#fffefa] shadow-2xl z-101 transform transition-transform duration-300 ease-in-out max-tablet:w-full max-tablet:shadow-transparent ${
          isOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close Button Header */}
          <div className="absolute top-0 right-0 flex items-center justify-between px-6 pt-6">
            <div />
            <button
              onClick={onClose}
              className="text-black hover:text-gray-600 transition-colors"
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
          <div className="flex-1 overflow-y-auto flex flex-col gap-9 px-23 justify-center">
            <div className="flex flex-col items-center gap-8 text-center">
              <h2 className="text-xl uppercase tracking-widest leading-none">SIZING</h2>
              <div >
                <p className="text-sm text-black font-light leading-normal">
                  The measurements may vary slightly due to the production process.
                  <br />
                  The garment is measured on a flat surface
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <p className="text-sm text-center underline font-regular tracking-widest uppercase decoration-black/40">CM</p>
              
              <div className="w-full">
                <table className="w-full text-center table-layout-fixed" style={{ tableLayout: 'fixed' }}>
                  <thead>
                    <tr className="text-xs text-black/40 uppercase">
                      <th className="font-regular py-2">Size</th>
                      <th className="font-regular py-2">Chest</th>
                      <th className="font-regular py-2">Waist</th>
                      <th className="font-regular py-2">Hip</th>
                      <th className="font-regular py-2">Shoulder</th>
                      <th className="font-regular py-2">Neck</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SIZING_DATA.map((row) => (
                      <tr key={row.size} className="text-sm text-black font-light ">
                        <td className="py-2 font-regular text-black/40">{row.size}</td>
                        <td className="py-2">{row.chest}</td>
                        <td className="py-2">{row.waist}</td>
                        <td className="py-2">{row.hip}</td>
                        <td className="py-2">{row.shoulder}</td>
                        <td className="py-2">{row.neck}</td>
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
