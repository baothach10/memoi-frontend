import { getCategories } from "@/app/api/getCategories";
import { useQuery } from "@tanstack/react-query";

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
    staleTime: 1000 * 60 * 5,
  });
}
