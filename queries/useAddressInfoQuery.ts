"use client";

import { useQuery } from "@tanstack/react-query";
import type { UserAddressInfo } from "@/app/api/getUserAddressInfo";

export function useAddressInfoQuery() {
  return useQuery<UserAddressInfo | null>({
    queryKey: ["userAddressInfo"],
    queryFn: async () => {
      const res = await fetch("/api/users/address-info");
      if (!res.ok) {
        return null;
      }
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
}
