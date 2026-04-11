import { useQuery } from "@tanstack/react-query";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";

export interface TierDiscountResponse {
  tier_discount_amount: number;
}

export function useTierDiscountQuery(amount: number) {
  const supabase = createBrowserSupabaseClient();

  return useQuery<TierDiscountResponse>({
    queryKey: ["tier-discount", amount],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Unauthorized");
      }

      const res = await fetch(`/api/discount/tier?amount=${amount}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch tier discount information");
      }

      return res.json();
    },
    enabled: !!amount && amount > 0,
  });
}
