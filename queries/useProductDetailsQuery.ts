import { getProductDetails } from "@/app/api/getProductDetails";
import { useQuery } from "@tanstack/react-query";

export function useProductDetailsQuery(productId: number) {
  return useQuery({
    queryKey: ["product-details", productId],
    queryFn: () => getProductDetails(productId),
    staleTime: 1000 * 60 * 5,
    enabled: !!productId && !isNaN(productId),
  });
}
