import { useQuery } from "@tanstack/react-query";
import { RawOrder, Order, OrderItem } from "@/components/ui/pages/account/types";

function transformRawOrder(raw: RawOrder): Order {
  return {
    id: raw.id,
    order_number: raw.order_number,
    date: new Date(raw.created_at).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    shipTo: raw.destination,
    status: raw.status,
    deliveryDetail: raw.status === "IN_PROGRESS" ? "Estimated arrival: Pending" : "Delivered",
    total: raw.total_amount,
    currency: "SGD",
    items: raw.items.map((item, idx): OrderItem => ({
      id: `${raw.id}-item-${idx}`,
      name: item.product.name,
      color_name: item.product.color_name,
      size: item.product.size,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image_url,
    })),
  };
}

export function useOrdersQuery(status?: "IN_PROGRESS" | "COMPLETED") {
  return useQuery<RawOrder[], Error, Order[]>({
    queryKey: ["orders", status],
    queryFn: async () => {
      const url = new URL("/api/orders/all", window.location.origin);
      if (status) {
        url.searchParams.append("status", status);
      }
      
      const res = await fetch(url.toString());
      
      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }
      
      const json = await res.json();
      return json.data; // The API returns { data: [...] }
    },
    select: (data) => data.map(transformRawOrder),
  });
}
