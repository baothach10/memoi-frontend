"use client";

import { useQuery } from "@tanstack/react-query";
import type { UserProfileResponse } from "@/app/api/getUserProfile";

export function useUserQuery() {
  return useQuery<UserProfileResponse>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await fetch("/api/users/profile");
      if (!res.ok) {
        return { authenticated: false, profile_completed: false };
      }
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
}
