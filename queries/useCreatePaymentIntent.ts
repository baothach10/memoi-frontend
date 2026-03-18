import { CartItem, getCartItems } from "@/utils/cartUtils";
import { useMutation } from "@tanstack/react-query";

async function createPaymentIntent(items: CartItem[]) {
  const res = await fetch("/api/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });

  if (!res.ok) throw new Error("Failed to create payment intent");

  const data = await res.json();
  return data.clientSecret as string;
}

export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: () => {
      const items = getCartItems();
      if (items.length === 0) throw new Error("There’s nothing in your Cart, yet.");
      return createPaymentIntent(items);
    },
  });
}
