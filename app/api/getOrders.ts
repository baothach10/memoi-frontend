import { createServerSupabaseClient } from "@/utils/supabase/server";

export async function getOrders(status?: "IN_PROGRESS" | "COMPLETED") {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return null;
    }

    const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL!}/api/orders/all`);
    if (status) {
      url.searchParams.append("status", status);
    }

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
        apiKey: process.env.NEXT_PUBLIC_API_KEY!,
      },
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error: any) {
    console.error("Failed to fetch orders:", error.message);
    return null;
  }
}
