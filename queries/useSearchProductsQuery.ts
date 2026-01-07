import { searchProducts } from "@/app/api/searchProducts";
import { useQuery } from "@tanstack/react-query";

export type SearchProductsParams = {
  search_query: string;
  page_number: number;
  page_limit: number;
};

export function useSearchProductsQuery(params: SearchProductsParams) {
  return useQuery({
    queryKey: [
      "search-products",
      params.search_query,
      params.page_number,
      params.page_limit,
    ],
    queryFn: () =>
      searchProducts(
        params.search_query,
        params.page_number,
        params.page_limit
      ),
    staleTime: 1000 * 60 * 5,
    enabled: !!params.search_query.trim(),
  });
}
