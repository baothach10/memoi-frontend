import { useMutation } from "@tanstack/react-query";
import type { UpdatePersonalInfoPayload } from "@/app/api/updatePersonalInfo";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";

export function useUpdatePersonalInfo() {
  const supabase = createBrowserSupabaseClient();

  return useMutation({
    mutationFn: async (body: UpdatePersonalInfoPayload) => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        const res = await fetch("/api/users/personal-info", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
            apiKey: process.env.NEXT_PUBLIC_API_KEY!,
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData?.error || "Failed to update personal info");
        }

        return res.json();
      } catch (error: any) {
        throw new Error(error.message || "An unexpected error occurred");
      }
    },
  });
}
