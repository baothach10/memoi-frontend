import { createServerSupabaseClient } from "@/utils/supabase/server";

export type UserProfile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_country_code: string;
  phone_number: string;
  country: string;
  marketing_opt_in: boolean;
  created_at: string;
  updated_at: string;
};

export type UserAddress = {
  id: string;
  country: string;
  state: string;
  city: string;
  zip_postal_code: string;
  address_line_1: string;
  address_line_2: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export type UserProfileResponse = {
  authenticated: boolean;
  profile_completed: boolean;
  error?: string;
  user_id?: string;
  message?: string;
  addresses?: UserAddress[];
  user?: UserProfile;
};

export async function getUserProfile(): Promise<UserProfileResponse> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL!}/rest/v1/rpc/get_user_profile`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
        apiKey: process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({}),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}
