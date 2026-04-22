import { useQuery } from "@tanstack/react-query";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";

export interface MemberDiscountResponse {
  tier_discount_amount: number;
  birth_month_discount: number;
  welcome_discount_amount:number;
  amount: number;
}

export function useMembershipDiscountQuery(amount: number) {
  const supabase = createBrowserSupabaseClient();

  return useQuery<MemberDiscountResponse>({
    queryKey: ["membership-discount", amount],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

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
        throw new Error("Failed to fetch membership discount information");
      }

      return res.json();
    },
    enabled: !!amount && amount > 0,
  });
}
