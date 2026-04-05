import { createServerSupabaseClient } from "@/utils/supabase/server";

export async function getCart() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL!}/api/users/cart`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
      apiKey: process.env.NEXT_PUBLIC_API_KEY!,
    },
  });

  console.log(session.access_token)

  if (!res.ok) {
    throw new Error("Failed to fetch cart from backend");
  }

  return res.json();
}
