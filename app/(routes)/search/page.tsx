"use client";

import SearchPage from "@/components/ui/pages/shop/SearchPage";
import { useSearchParams } from "next/navigation";

function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  return <SearchPage searchQuery={query} />;
}

export default SearchResultsPage;
