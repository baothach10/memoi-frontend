import { createServerSupabaseClient } from "@/utils/supabase/server";

export async function getOrderDetail(orderId: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return null;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL!}/api/orders/details/${orderId}`,
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

    return res.json();
  } catch (error: any) {
    console.error("Failed to fetch order detail:", error.message);
    return null;
  }
}
