import { useQuery } from "@tanstack/react-query";
import { RawOrderDetails, OrderDetails, OrderItem } from "@/components/ui/pages/account/types";

function formatProgressDate(date?: string): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function transformRawOrderDetails(raw: RawOrderDetails): OrderDetails {
  const customer = raw.billing_info ?? raw.customer;
  const shipTo = raw.billing_info
    ? `${raw.billing_info.address}, ${raw.billing_info.city}, ${raw.billing_info.country}`
    : raw.destination;

  return {
    id: raw.id,
    order_number: raw.order_number,
    date: new Date(raw.created_at).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    shipTo,
    status: raw.status,
    deliveryDetail:
      raw.status === "IN_PROGRESS" ? "Estimated arrival: Pending" : "Delivered",
    total: raw.total_amount,
    currency: raw.items[0]?.product?.currency?.toUpperCase() || "SGD",
    items: raw.items.map(
      (item, idx): OrderItem => ({
        id: `${raw.id}-item-${idx}`,
        name: item.product.name,
        color_name: item.product.color_name,
        size: item.product.size,
        price: item.product.price,
        sale_price: item.product.sale_price,
        quantity: item.quantity,
        image: item.product.image_url,
      }),
    ),
    customer: {
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      phone_number: customer.phone_number,
    },
    birth_month_discount: raw.birth_month_discount,
    welcome_discount_amount: raw.welcome_discount_amount,
    tier_discount_amount: raw.tier_discount_amount ?? 0,
    promo_discount_amount: raw.promo_discount_amount,
    shipping_fee: raw.shipping_fee,
    progress: raw.progress.map((step) => ({
      label: step.label,
      date: formatProgressDate(step.date),
      completed: step.completed,
      active: step.active,
    })),
  };
}

export function useOrderDetailQuery(orderId: string) {
  return useQuery<OrderDetails, Error>({
    queryKey: ["order", orderId],
    enabled: Boolean(orderId),
    queryFn: async () => {
      const res = await fetch(`/api/orders/details/${orderId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch order details");
      }
      const json = await res.json();
      if (!json.data) {
        throw new Error("Order response is missing data field");
      }
      return transformRawOrderDetails(json.data);
    },
  });
}
