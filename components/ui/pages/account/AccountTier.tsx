import { UserProfileResponse } from "@/app/api/getUserProfile";
import Link from "next/link";

interface AccountTierProps {
  userProfile: UserProfileResponse;
}

export default function AccountTier({ userProfile }: AccountTierProps) {
  // Logic to determine tier - this is a placeholder. 
  // You might want to get this from userProfile in the future.
  const tier = "MEMOÍ" as "MEMOÍ" | "MEMOÍ +" | "MEMOÍ ELITE";

  const getProgress = () => {
    switch (tier) {
      case "MEMOÍ": return "w-0";
      case "MEMOÍ +": return "w-1/2";
      case "MEMOÍ ELITE": return "w-full";
      default: return "w-0";
    }
  };

  const getMarkerStyle = (active: boolean) => {
    if (active) {
      return (
        <div className="relative w-4 h-4 flex items-center justify-center">
          {/* Outer ring (with offset) */}
          <span className="absolute inset-0 rounded-full ring-1 ring-black/20 ring-offset-2 ring-offset-white" />
          {/* Inner ring + color */}
          <span className="relative z-10 w-3.5 h-3.5 rounded-full bg-black ring-1 ring-black/20" />
        </div>
      );
    }
    return (
      <div className="relative w-4 h-4 flex items-center justify-center rounded-full">

        <span className="absolute inset-0 rounded-full ring-1 ring-black/20 ring-offset-2 ring-offset-white" />
        {/* Inner base ring + color */}
        <span className="relative z-10 w-3.5 h-3.5 rounded-full bg-white ring-1 ring-black/20" />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-regular uppercase tracking-tight">ACCOUNT TIER</h2>
        <p className="text-sm text-black/80 leading-relaxed">
          Elevate your status to unlock new levels of privilege and reward. View full details at{" "}
          <Link href="/the-memoi-house" className="inline underline underline-offset-4 decoration-black/40 hover:decoration-black transition-colors">The MEMOÍ House</Link>
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <div className="space-y-2">
          <p className="text-xl font-regular uppercase">S$1,000</p>
          <p className="text-sm text-black/80 uppercase tracking-widest">Reach S$3,000 to unlock MEMOÍ +</p>
        </div>

        {/* Progress Bar */}
        <div className="relative pt-2">
          <div className="h-px w-full bg-black/10 relative">
            <div className={`absolute left-0 top-0 h-[1.5px] bg-black ${getProgress()}`} />

            {/* Tiers Markers */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0">
              {getMarkerStyle(tier === "MEMOÍ" || tier === "MEMOÍ +" || tier === "MEMOÍ ELITE")}
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
              {getMarkerStyle(tier === "MEMOÍ +" || tier === "MEMOÍ ELITE")}
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 left-full -translate-x-full">
              {getMarkerStyle(tier === "MEMOÍ ELITE")}
            </div>
          </div>

          <div className="flex justify-between mt-6 text-sm uppercase tracking-[0.2em]">
            <span className={tier === "MEMOÍ" ? "font-regular" : "text-black/40"}>MEMOÍ</span>
            <span className={tier === "MEMOÍ +" ? "font-regular" : "text-black/40"}>MEMOÍ +</span>
            <span className={tier === "MEMOÍ ELITE" ? "font-regular" : "text-black/40"}>MEMOÍ ELITE</span>
          </div>
        </div>

        <p className="text-sm text-black/80 font-regular">
          Status valid until 31/12/2025. Buy more to upgrade to the next level and unlock exclusive benefits.
        </p>
      </div>
    </div>
  );
}
