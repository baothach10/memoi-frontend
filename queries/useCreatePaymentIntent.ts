import { useMutation } from "@tanstack/react-query";

export interface BillingInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  optional_address?: string;
  city: string;
  zip_code: string;
  country: string;
}

export interface ProductItem {
  product_variant_id: string;
  quantity: number;
}

interface CreateIntentParams {
  products: ProductItem[];
  billingInfo: BillingInfo;
  promoCode?: string;
}
 
async function createPaymentIntent({ products, billingInfo, promoCode }: CreateIntentParams) {
 
  const res = await fetch("/api/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ products, billingInfo, promoCode }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.details || "Failed to create payment intent");
  }

  const data = await res.json();
  return data.clientSecret as string;
}

export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: (params: CreateIntentParams) => {
      if (params.products.length === 0) throw new Error("There’s nothing in your Cart, yet.");
      return createPaymentIntent(params);
    },
  });
}
