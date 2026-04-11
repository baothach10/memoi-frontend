import {
  getProductsPaginated,
  GetProductsParams,
} from "@/app/api/getProductPaginated";
import { useQuery } from "@tanstack/react-query";
import { useCurrency } from "@/context/CurrencyContext";
import { useEffect } from "react";

export function useProductsPaginatedQuery(params: GetProductsParams) {
  const { updateCurrency, currency: globalCurrency } = useCurrency();
  const query = useQuery({
    queryKey: ["products-paginated", params.page_number, params.page_limit],
    queryFn: () => getProductsPaginated(params),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data?.products && query.data.products.length > 0) {
      const firstProductCurrency = query.data.products[0].currency;
      if (firstProductCurrency && firstProductCurrency.toUpperCase() !== globalCurrency) {
        updateCurrency(firstProductCurrency);
      }
    }
  }, [query.data, updateCurrency]);

  return query;
}
