import {
  getProductPaginatedByCollection,
  GetProductsByCollectionParams,
} from "@/app/api/getProductPaginatedByCollection";
import { useQuery } from "@tanstack/react-query";

export function useProductPaginatedByCollectionQuery(
  params: GetProductsByCollectionParams
) {
  return useQuery({
    queryKey: [
      "products-paginated-by-collection",
      params.collection_name,
      params.page_number,
      params.page_limit,
    ],
    queryFn: () => getProductPaginatedByCollection(params),
    staleTime: 1000 * 60 * 5,
  });
}
