import { getCollections } from "@/app/api/getCollections";
import { useQuery } from "@tanstack/react-query";

export function useCollectionsQuery() {
  return useQuery({
    queryKey: ["collections"],
    queryFn: () => getCollections(),
    staleTime: 1000 * 60 * 5,
  });
}
