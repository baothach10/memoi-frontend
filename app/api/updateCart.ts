import { createServerSupabaseClient } from "@/utils/supabase/server";

export interface UpdateCartPayload {
  products: UpdateCartItem[];
}

export interface UpdateCartItem {
  product_id: number;
  quantity: number;
  size: string;
}

export async function updateCart(payload: UpdateCartPayload) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL!}/api/users/cart`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
      apiKey: process.env.NEXT_PUBLIC_API_KEY!,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to update cart on backend");
  }

  return res.json();
}
