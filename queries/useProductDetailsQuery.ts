import { getProductDetails } from "@/app/api/getProductDetails";
import { useQuery } from "@tanstack/react-query";
import { useCurrency } from "@/context/CurrencyContext";
import { useEffect } from "react";

export function useProductDetailsQuery(productId: number) {
  const { updateCurrency, currency: globalCurrency } = useCurrency();
  const query = useQuery({
    queryKey: ["product-details", productId],
    queryFn: () => getProductDetails(productId),
    staleTime: 1000 * 60 * 5,
    enabled: !!productId && !isNaN(productId),
  });

  useEffect(() => {
    if (query.data?.currency && query.data.currency.toUpperCase() !== globalCurrency) {
      updateCurrency(query.data.currency);
    }
  }, [query.data, updateCurrency]);

  return query;
}
