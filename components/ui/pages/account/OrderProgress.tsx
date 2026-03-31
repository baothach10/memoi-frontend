"use client";

import { ProgressStep } from "./types";

interface OrderProgressProps {
  steps: ProgressStep[];
}

export default function OrderProgress({ steps }: OrderProgressProps) {
  const lastActiveIndex = [...steps].reverse().findIndex(s => s.completed || s.active);
  const activeIndex = lastActiveIndex === -1 ? 0 : steps.length - 1 - lastActiveIndex;
  const stepStyles = [0, 36, 66, 100]; // Adjusted for visual balance
  const progressPercent = stepStyles[activeIndex];

  const getMarker = (completed: boolean, active?: boolean, isMobile?: boolean) => {
    const isFilled = completed || active;
    return (
      <div className={`${isMobile ? "w-5 h-5" : "w-6 h-6"} rounded-full border border-black/10 bg-[#fffefa] flex items-center justify-center ring-1 ring-white z-20`}>
        {isFilled ? (
          <div className={`${isMobile ? "w-3 h-3" : "w-4 h-4"} rounded-full bg-black `} />
        ) : (
          <div className={`${isMobile ? "w-3 h-3" : "w-4 h-4"} rounded-full bg-[#fffefa] border border-black/10 `} />
        )}
      </div>
    );
  };

  return (
    <div className="w-full p-8 border border-black/10 bg-[#fffefa] max-mobile:p-4">
      {/* Desktop Horizontal View */}
      <div className="relative w-full hidden smaller-tablet:block">
        <div className="h-0.5 w-full bg-black/10 absolute top-[11px] left-0" />
        <div
          className="absolute top-[11px] left-0 h-0.5 bg-black transition-all duration-500 z-10"
          style={{ width: `${progressPercent}%` }}
        />

        <div className="flex justify-between relative">
          {steps.map((step, index) => {
            const isFirst = index === 0;
            const isLast = index === steps.length - 1;
            return (
              <div key={index} className={`flex flex-col relative z-20 ${isFirst ? "items-start" : isLast ? "items-end" : "items-center"}`}>
                <div className="h-6 flex items-center">{getMarker(step.completed, step.active)}</div>
                <div className={`mt-8 flex flex-col text-[16px] gap-4 whitespace-nowrap max-tablet:text-sm ${isFirst ? "items-start text-left" : isLast ? "items-end text-right" : "items-start text-left transform translate-x-2/5"}`}>
                  <p className={` uppercase font-regular`}>
                    {step.label}
                  </p>
                  <p className=" text-black/60 font-regular">
                    {step.date}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical View */}
      <div className="relative flex flex-col gap-10 smaller-tablet:hidden">
        <div className="absolute left-2.5 top-0 w-px h-full bg-black/10" />
        <div
          className="absolute left-2.5 top-0 w-px bg-black transition-all duration-500 z-10"
          style={{ height: `${progressPercent}%` }}
        />

        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-6 relative z-20">
            <div className="shrink-0">{getMarker(step.completed, step.active, true)}</div>
            <div className="flex gap-2.5">
              <p className={`text-xs uppercase font-regular text-black `}>
                {step.label}
              </p>
              <p className="text-xs text-black/60 font-regular">
                {step.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
