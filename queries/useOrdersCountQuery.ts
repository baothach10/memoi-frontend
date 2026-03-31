import { useQuery } from "@tanstack/react-query";

export interface OrdersCount {
  total: number;
  in_progress: number;
  completed: number;
}

export function useOrdersCountQuery() {
  return useQuery<OrdersCount>({
    queryKey: ["ordersCount"],
    queryFn: async () => {
      const res = await fetch("/api/orders/count");
      if (!res.ok) {
        throw new Error("Failed to fetch orders count");
      }
      return res.json();
    },
  });
}
