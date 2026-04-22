import { createServerSupabaseClient } from "@/utils/supabase/server";

export async function getMembershipDiscount() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL!}/api/discount/membership`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
        apiKey: process.env.NEXT_PUBLIC_API_KEY!,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch tier discount from backend");
  }

  return res.json();
}
