"use client";

import { useQuery } from "@tanstack/react-query";
import type { UserMembership } from "@/app/api/getUserMembership";

export function useMembershipQuery() {
  return useQuery<UserMembership | null>({
    queryKey: ["userMembership"],
    queryFn: async () => {
      const res = await fetch("/api/users/membership");
      if (!res.ok) {
        return null;
      }
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
}
