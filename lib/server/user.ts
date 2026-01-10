import { createServerSupabaseClient } from "@/utils/supabase/server";

export type CreateUserPayload = {
  firstName: string;
  lastName: string;
  country: string;
  phone: string;
  phoneZone: string;
  dob: string;
  marketing: boolean;
};

export async function createUser(body: CreateUserPayload) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
        apiKey: process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({
        first_name: body.firstName,
        last_name: body.lastName,
        country: body.country,
        phone: body.phone,
        phoneZone: body.phoneZone,
        dob: body.dob,
        marketing: body.marketing,
      }),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    
    throw new Error(errorText || "Failed to create user");
  }

  return res.json();
}
