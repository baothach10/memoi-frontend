import { getProductSuggestions } from "@/app/api/getProductSuggestions";
import { useQuery } from "@tanstack/react-query";
import { useCurrency } from "@/context/CurrencyContext";
import { useEffect } from "react";

export function useProductSuggestionsQuery() {
    const { updateCurrency, currency: globalCurrency } = useCurrency();
    const query = useQuery({
    queryKey: ["product-suggestions"],
    queryFn: () => getProductSuggestions(),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data && query.data.length > 0) {
      const firstProductCurrency = query.data[0].currency;
      if (firstProductCurrency && firstProductCurrency.toUpperCase() !== globalCurrency) {
        updateCurrency(firstProductCurrency);
      }
    }
  }, [query.data, updateCurrency]);

  return query;
}
