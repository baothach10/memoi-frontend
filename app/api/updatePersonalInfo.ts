import { createServerSupabaseClient } from "@/utils/supabase/server";

export type UpdatePersonalInfoPayload = {
  first_name?: string | null;
  last_name?: string | null;
  phone_number?: string | null;
  phone_country_code?: string | null;
  date_of_birth?: string | null;
  country?: string | null;
  marketing_opt_in?: boolean | null;
  tier_name?: string | null;
  tier_expiry?: string | null;
  current_spending?: number | null;
  state?: string | null;
  city?: string | null;
  zip_code?: string | null;
  address?: string | null;
  optional_address?: string | null;
};

export async function updatePersonalInfo(body: UpdatePersonalInfoPayload) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL!}/api/users/personal-info`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
          apiKey: process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to update personal info");
    }

    return res.json();
  } catch (error: any) {
    console.error("Failed to update personal info:", error.message);
    throw error;
  }
}
