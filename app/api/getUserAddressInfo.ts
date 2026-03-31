import { createServerSupabaseClient } from "@/utils/supabase/server";

export type UserAddressInfo = {
  id: string;
  country: string | null;
  state: string | null;
  city: string | null;
  zip_code: string | null;
  address: string | null;
  optional_address: string | null;
};

export async function getUserAddressInfo(): Promise<UserAddressInfo | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return null;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL!}/api/users/address-info`,
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
    console.error("Failed to fetch address info:", error.message);
    return null;
  }
}
