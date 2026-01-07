import { getProductSuggestions } from "@/app/api/getProductSuggestions";
import { useQuery } from "@tanstack/react-query";

export function useProductSuggestionsQuery() {
  return useQuery({
    queryKey: ["product-suggestions"],
    queryFn: () => getProductSuggestions(),
    staleTime: 1000 * 60 * 5,
  });
}
