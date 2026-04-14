import { useQuery } from "@tanstack/react-query";
import { RawOrderDetails, OrderDetails, OrderItem } from "@/components/ui/pages/account/types";

function transformRawOrderDetails(raw: RawOrderDetails): OrderDetails {
  const bi = raw.billing_info;
  
  return {
    id: raw.id,
    order_number: raw.order_number,
    date: new Date(raw.created_at).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    shipTo: `${bi.address}, ${bi.city}, ${bi.country}`,
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
        quantity: item.quantity,
        image: item.product.image_url,
      }),
    ),
    customer: {
      first_name: bi.first_name,
      last_name: bi.last_name,
      email: bi.email,
      phone_number: bi.phone_number,
    },
    birth_month_discount: raw.birth_month_discount_amount,
    tier_discount_amount: raw.tier_discount_amount ?? 0,
    promo_discount_amount: raw.promo_discount_amount,
    shipping_fee: raw.shipping_fee,
    progress: [
      {
        label: "Order Placed",
        date: new Date(raw.created_at).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        }),
        completed: true,
        active: raw.status === "IN_PROGRESS",
      },
      {
        label: "Processing",
        date: "",
        completed: raw.status === "COMPLETED",
        active: false,
      },
      {
        label: "Shipped",
        date: "",
        completed: raw.status === "COMPLETED",
        active: false,
      },
      {
        label: "Delivered",
        date: "",
        completed: raw.status === "COMPLETED",
        active: false,
      },
    ],
  };
}

export function useOrderDetailQuery(orderId: string) {
  return useQuery<RawOrderDetails, Error, OrderDetails>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const res = await fetch(`/api/orders/details/${orderId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch order details");
      }
      const json = await res.json();
      return json.data;
    },
    select: transformRawOrderDetails,
  });
}
