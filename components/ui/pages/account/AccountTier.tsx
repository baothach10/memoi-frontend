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

  if (isLoading) {
    return (
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-regular uppercase">ACCOUNT TIER</h2>
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
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-regular uppercase">ACCOUNT TIER</h2>
        <p className="text-sm text-black/80 leading-relaxed">
          Elevate your status to unlock new levels of privilege and reward. View full details at{" "}
          <Link href="/the-memoi-house" className="inline underline underline-offset-4 decoration-black/40 hover:decoration-black transition-colors">The MEMOÍ House</Link>
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <div className="space-y-2">
          <p className="text-xl font-regular uppercase">{formatCurrency(currentSpending)}</p>
          <p className="text-sm text-black/80 uppercase tracking-widest">{getNextTierMessage()}</p>
        </div>

        {/* Progress Bar */}
        <div className="relative pt-2">
          <div className="h-px w-full bg-black/10 relative">
            <div className="absolute left-0 top-0 h-[1.5px] bg-black transition-all duration-500" style={{ width: `${getProgressPercent()}%` }} />

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

          <div className="flex justify-between mt-6 text-sm uppercase font-regular">
            <span className={tier === "MEMOÍ" ? "" : "text-black/40"}>MEMOÍ</span>
            <span className={tier === "MEMOÍ +" ? "" : "text-black/40"}>MEMOÍ +</span>
            <span className={tier === "MEMOÍ ELITE" ? "" : "text-black/40"}>MEMOÍ ELITE</span>
          </div>
        </div>

        {tierExpiry && (
          <p className="text-sm text-black/80 font-regular">
            Status valid until {formatExpiryDate(tierExpiry)}. Buy more to upgrade to the next level and unlock exclusive benefits.
          </p>
        )}
      </div>
    </div>
  );
}
