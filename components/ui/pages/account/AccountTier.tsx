"use client";

import { useMembershipQuery } from "@/queries/useMembershipQuery";
import Link from "next/link";


type TierLevel = "MEMOÍ" | "MEMOÍ +" | "MEMOÍ ELITE";

function mapTierName(tierName: string): TierLevel {
  switch (tierName.toLowerCase()) {
    case "basic":
      return "MEMOÍ";
    case "plus":
      return "MEMOÍ +";
    case "elite":
      return "MEMOÍ ELITE";
    default:
      return "MEMOÍ";
  }
}

function formatCurrency(amount: number): string {
  return `S$${amount.toLocaleString()}`;
}

function formatExpiryDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
}

export default function AccountTier() {
  const { data: membership, isLoading } = useMembershipQuery();

  const tier: TierLevel = membership ? mapTierName(membership.tier_name) : "MEMOÍ";
  const currentSpending = membership?.current_spending ?? 0;
  const tierExpiry = membership?.tier_expiry ?? "";

  const PLUS_THRESHOLD = 3000;
  const ELITE_THRESHOLD = 8000;

  const getProgressPercent = () => {
    if (currentSpending <= 0) return 0;
    if (currentSpending >= ELITE_THRESHOLD) return 100;
    if (currentSpending <= PLUS_THRESHOLD) {
      // 0 to 3000 maps to 0% – 50%
      return (currentSpending / PLUS_THRESHOLD) * 50;
    }
    // 3000 to 8000 maps to 50% – 100%
    return 50 + ((currentSpending - PLUS_THRESHOLD) / (ELITE_THRESHOLD - PLUS_THRESHOLD)) * 50;
  };

  const getNextTierMessage = () => {
    switch (tier) {
      case "MEMOÍ":
        return `Reach S$3,000 to unlock MEMOÍ +`;
      case "MEMOÍ +":
        return `Reach S$8,000 to unlock MEMOÍ ELITE`;
      case "MEMOÍ ELITE":
        return `You have reached the highest tier`;
      default:
        return "";
    }
  };

  const getMarkerStyle = (active: boolean) => {
    return (
      <div className="w-6 h-6 rounded-full border border-black/10 bg-[#fffefa] flex items-center justify-center ring-1 ring-white z-20">
        {active ? (
          <div className="w-4 h-4 rounded-full bg-black" />
        ) : (
          <div className="w-4 h-4 rounded-full bg-[#fffefa] border border-black/10" />
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-6 max-mobile:gap-4">
          <h2 className="text-2xl font-regular uppercase max-mobile:text-lg">ACCOUNT TIER</h2>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-black/5 rounded w-3/4"></div>
            <div className="h-8 bg-black/5 rounded w-1/2"></div>
            <div className="h-1 bg-black/5 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 max-mobile:gap-9">
      <div className="flex flex-col gap-6 max-mobile:gap-4">
        <h2 className="text-2xl font-regular uppercase max-mobile:text-lg">ACCOUNT TIER</h2>
        <p className="text-sm text-black/80 max-mobile:text-xs">
          Elevate your status to unlock new levels of privilege and reward. View full details at{" "}
          <Link href="/the-memoi-house" className="inline cursor-pointer underline underline-offset-4 decoration-black/40 hover:decoration-black transition-colors">The MEMOÍ House</Link>
        </p>
      </div>

      <div className="flex flex-col gap-8 max-mobile:gap-6">
        <div className="space-y-2">
          <p className="text-xl font-regular uppercase max-mobile:text-[16px]">{formatCurrency(currentSpending)}</p>
          <p className="text-sm text-black/80 max-mobile:text-xs">
            {getNextTierMessage()}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full">
          {/* Track */}
          <div className="h-0.5 w-full bg-black/10 absolute top-[11px] left-0" />
          {/* Fill */}
          <div
            className="absolute top-[11px] left-0 h-0.5 bg-black transition-all duration-500 z-10"
            style={{ width: `${getProgressPercent()}%` }}
          />

          {/* Markers */}
          <div className="flex justify-between relative">
            <div className="flex flex-col items-start relative z-20">
              <div className="h-6 flex items-center">{getMarkerStyle(tier === "MEMOÍ" || tier === "MEMOÍ +" || tier === "MEMOÍ ELITE")}</div>
              <p className={`mt-6 text-sm uppercase font-regular max-mobile:mt-4 ${tier === "MEMOÍ" ? "" : "text-black/40"}`}>MEMOÍ</p>
            </div>
            <div className="flex flex-col items-center relative z-20">
              <div className="h-6 flex items-center">{getMarkerStyle(tier === "MEMOÍ +" || tier === "MEMOÍ ELITE")}</div>
              <p className={`mt-6 text-sm uppercase font-regular max-mobile:mt-4 ${tier === "MEMOÍ +" ? "" : "text-black/40"}`}>MEMOÍ +</p>
            </div>
            <div className="flex flex-col items-end relative z-20">
              <div className="h-6 flex items-center">{getMarkerStyle(tier === "MEMOÍ ELITE")}</div>
              <p className={`mt-6 text-sm uppercase font-regular max-mobile:mt-4 ${tier === "MEMOÍ ELITE" ? "" : "text-black/40"}`}>MEMOÍ ELITE</p>
            </div>
          </div>
        </div>

        {tierExpiry && (
          <p className="text-sm text-black/80 max-mobile:text-xs">
            <span className="font-regular">Status valid until {formatExpiryDate(tierExpiry)}.</span> Buy more to upgrade to the next level and unlock exclusive benefits.
          </p>
        )}
      </div>
    </div>
  );
}
