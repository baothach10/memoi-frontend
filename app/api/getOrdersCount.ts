import { createServerSupabaseClient } from "@/utils/supabase/server";

export type OrdersCount = {
  total: number;
  in_progress: number;
  completed: number;
};

export async function getOrdersCount(): Promise<OrdersCount | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return null;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL!}/api/orders/all/count`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
          apiKey: process.env.NEXT_PUBLIC_API_KEY!,
        },
      }
    );

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    return json.data;
  } catch (error: any) {
    console.error("Failed to fetch orders count:", error.message);
    return null;
  }
}
