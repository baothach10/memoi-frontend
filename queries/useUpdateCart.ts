import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { CartItem } from "@/utils/cartUtils";
import { BackendCartItem } from "./useCartQuery";
import { useRef, useCallback, useMemo } from "react";

export interface UpdateCartPayload {
  products: CartItem[];
}

export function useUpdateCart() {
  const supabase = createBrowserSupabaseClient();
  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const mutation = useMutation({
    mutationFn: async (payload: UpdateCartPayload) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const editedPayload = payload.products.map((item) => {
        return {
          product_variant_id: item.product_id, // Map the stored variant ID to product_variant_id
          quantity: item.quantity,
        };
      });

      const res = await fetch(`/api/users/cart`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: editedPayload }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message || "Failed to update backend cart");
      }

      return res.json();
    },
    onMutate: async (newPayload: UpdateCartPayload) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData<BackendCartItem[]>(["cart"]);
      const previousCartArray = Array.isArray(previousCart) ? previousCart : [];

      // Optimistically update to the new value
      // We try to keep metadata from the existing items if they match
      const optimisticCart = newPayload.products.map((item) => {
        const existing = previousCartArray.find(
          (p) => String(p.product_variant_id) === String(item.product_id)
        );
        if (existing) {
          return { ...existing, quantity: item.quantity };
        }
        return {
          product_id: 0,
          product_variant_id: item.product_id,
          size: item.size,
          quantity: item.quantity,
          product_name: item.productName || "Updating...",
          image_url: item.productImage || "",
          unit_price: item.price || 0,
          sale_price: item.sale_price,
          color_name: item.color_name || "",
        } as unknown as BackendCartItem;
      });

      queryClient.setQueryData(["cart"], optimisticCart);

      // Return a context object with the snapshotted value
      return { previousCart };
    },
    onError: (err, newPayload, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to throw away the optimistic update
      // and ensure the server state is the source of truth.
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Debounced mutate function
  const debouncedMutate = useCallback((payload: UpdateCartPayload) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Still perform the optimistic update immediately for UI responsiveness
    // However, the standard React Query onMutate only runs when mutate() is called.
    // To have instant UI + debounced API, we can either:
    // 1. Manually setQueryData here (before debounce)
    // 2. Or just accept that the sync is slightly delayed but the local state (if managed separately) is instant.
    
    // Given the components use BOTH local state and useCartQuery:
    // CartOverlay, CartPage, etc. already have localItems state that updates instantly.
    // So debouncing the entire mutation call is safe.

    timeoutRef.current = setTimeout(() => {
      mutation.mutate(payload);
    }, 100);
  }, [mutation]);

  return useMemo(() => ({
    ...mutation,
    mutate: debouncedMutate, // override the default mutate with the debounced version
    mutateSync: mutation.mutate, // allow original mutate if needed
    mutateAsync: mutation.mutateAsync, // original async mutate
  }), [mutation, debouncedMutate]);
}
