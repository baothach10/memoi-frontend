"use client";

export default function AccountTier() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-regular uppercase tracking-tight">ACCOUNT TIER</h2>
        <p className="text-sm text-black/60 leading-relaxed font-light max-w-[500px]">
          Elevate your status to unlock new levels of privilege and reward. View full details at{" "}
          <a href="#" className="underline underline-offset-4 decoration-black/20 hover:decoration-black transition-colors">The MEMOÍ House</a>
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <p className="text-lg font-regular uppercase">S$1,000</p>
          <p className="text-xs text-black/40 uppercase tracking-widest">Reach S$3,000 to unlock MEMOÍ +</p>
        </div>

        {/* Progress Bar */}
        <div className="relative pt-4">
          <div className="h-[1px] w-full bg-black/10 relative">
            <div className="absolute left-0 top-0 h-[1.5px] bg-black w-1/3" />
            
            {/* Tiers Markers */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-2 h-2 rounded-full bg-black border border-white" />
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border border-black/20 bg-white" />
            <div className="absolute top-1/2 -translate-y-1/2 left-full -translate-x-full w-2 h-2 rounded-full border border-black/20 bg-white" />
          </div>

          <div className="flex justify-between mt-6 text-[10px] uppercase tracking-[0.2em]">
            <span className="font-regular">MEMOÍ</span>
            <span className="text-black/40">MEMOÍ +</span>
            <span className="text-black/40">MEMOÍ ELITE</span>
          </div>
        </div>

        <p className="text-xs text-black/40 font-light italic">
          Status valid until 31/12/2025. Buy more to upgrade to the next level and unlock exclusive benefits.
        </p>
      </div>
    </div>
  );
}
