import { useQuery } from "@tanstack/react-query";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";

export interface BackendCartItem {
  id: string;
  cart_id: string;
  product_id: number;
  product_variant_id: number;
  quantity: number;
  product_name: string;
  product_sku: string;
  unit_price: number;
  sale_price?: number;
  total_price: number;
  currency: string;
  stock: number;
  created_at: string;
  image_url: string;
  size: string;
  color_name: string;
}

import { useEffect } from "react";
import { setCartItems } from "@/utils/cartUtils";

import { useCurrency } from "@/context/CurrencyContext";

export function useCartQuery() {
  const supabase = createBrowserSupabaseClient();
  const { updateCurrency, currency } = useCurrency();

  const query = useQuery<BackendCartItem[] | null>({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        return null;
      }

      const res = await fetch(`/api/users/cart`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch cart information");
      }

      return res.json();
    },
    enabled: true,
  });

  useEffect(() => {
    const syncBackendToLocal = async () => {
      // 1. Wait until the query is fully successful and fetched from the server
      if (!query.isSuccess || !query.isFetched) return;

      // 2. ONLY sync if the user is authenticated. 
      // This prevents guest carts from being overwritten by an empty backend response.
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      if (query.data && query.data.length > 0) {
        // Synchronize global currency
        const cartCurrency = query.data[0].currency;
        if (cartCurrency && currency !== cartCurrency.toUpperCase()) {
          updateCurrency(cartCurrency);
        }

        const localFormat = query.data.map((item: BackendCartItem) => ({
          product_id: item.product_variant_id, 
          size: item.size,
          quantity: item.quantity,
          productName: item.product_name,
          productImage: item.image_url,
          sale_price: item.sale_price,
          stock: item.stock,
          color_name: item.color_name,
          price: item.unit_price,
        }));
        setCartItems(localFormat);
      } else if (query.data && query.data.length === 0) {
        // Backend confirms the user's cart is empty - sync this state to local
        setCartItems([]);
      }
    };

    syncBackendToLocal();
  }, [query.data, query.isSuccess, query.isFetched, supabase.auth, updateCurrency, currency]);

  return query;
}
