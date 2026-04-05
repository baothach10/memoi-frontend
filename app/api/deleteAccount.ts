import { createServerSupabaseClient } from "@/utils/supabase/server";

export type DeleteAccountResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function deleteAccount(): Promise<DeleteAccountResponse> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL!}/api/users/delete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
          apiKey: process.env.NEXT_PUBLIC_API_KEY!,
        },
      }
    );

    if (!res.ok) {
       // Try to parse error body if possible
       try {
         const errorData = await res.json();
         return { success: false, error: errorData.error || "Failed to delete account" };
       } catch (e) {
         return { success: false, error: "Server error" };
       }
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Server error",
    };
  }
}
