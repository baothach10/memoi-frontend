import {
  getProductPaginatedByCategory,
  GetProductsByCategoryParams,
} from "@/app/api/getProductPaginatedByCategory";
import { useQuery } from "@tanstack/react-query";
import { useCurrency } from "@/context/CurrencyContext";
import { useEffect } from "react";

export function useProductPaginatedByCategoryQuery(
  params: GetProductsByCategoryParams
) {
    const query =  useQuery({
      queryKey: [
        "products-paginated-by-category",
        params.category_name,
        params.page_number,
        params.page_limit,
      ],
      queryFn: () => getProductPaginatedByCategory(params),
      staleTime: 1000 * 60 * 5,
    });
    const { updateCurrency, currency: globalCurrency } = useCurrency();
    
    useEffect(() => {
      if (query.data?.products && query.data.products.length > 0) {
        const firstProductCurrency = query.data.products[0].currency;
        if (firstProductCurrency && firstProductCurrency.toUpperCase() !== globalCurrency) {
          updateCurrency(firstProductCurrency);
        }
      }
    }, [query.data, updateCurrency]);

    return query
}
