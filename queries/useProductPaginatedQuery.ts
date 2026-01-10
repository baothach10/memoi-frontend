import {
  getProductsPaginated,
  GetProductsParams,
} from "@/app/api/getProductPaginated";
import { useQuery } from "@tanstack/react-query";

export function useProductsPaginatedQuery(params: GetProductsParams) {
  return useQuery({
    queryKey: ["products-paginated", params.page_number, params.page_limit],
    queryFn: () => getProductsPaginated(params),
    staleTime: 1000 * 60 * 5,
  });
}
