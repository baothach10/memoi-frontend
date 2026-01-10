import {
  getProductPaginatedByCategory,
  GetProductsByCategoryParams,
} from "@/app/api/getProductPaginatedByCategory";
import { useQuery } from "@tanstack/react-query";

export function useProductPaginatedByCategoryQuery(
  params: GetProductsByCategoryParams
) {
  return useQuery({
    queryKey: [
      "products-paginated-by-category",
      params.category_name,
      params.page_number,
      params.page_limit,
    ],
    queryFn: () => getProductPaginatedByCategory(params),
    staleTime: 1000 * 60 * 5,
  });
}
