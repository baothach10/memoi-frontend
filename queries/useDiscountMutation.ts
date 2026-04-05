"use client";

import { useMutation } from "@tanstack/react-query";

export type DiscountResponse = {
  valid: boolean;
  discount_amount: number;
  unit: "percent" | "amount";
};

export function useDiscountMutation() {
  return useMutation<DiscountResponse, Error, string>({
    mutationFn: async (promoCode: string) => {
      const res = await fetch(`/api/discount/${promoCode}`);
      if (!res.ok) {
        throw new Error("Failed to validate promocode");
      }
      return res.json();
    },
  });
}
