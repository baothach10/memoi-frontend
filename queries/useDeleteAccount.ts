"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { clearCart } from "@/utils/cartUtils";

export function useDeleteAccount() {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/users/delete", {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || "Failed to delete account");
      }
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "User deleted successfully");
      
      // Clear memory and local storage
      queryClient.clear();
      clearCart();

      // Sign out and redirect
      supabase.auth.signOut().then(() => {
          router.push("/");
          router.refresh();
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete account");
    },
  });
}
