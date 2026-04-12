"use client";

import { Suspense } from "react";
import SearchPage from "@/components/ui/pages/shop/SearchPage";
import { useSearchParams } from "next/navigation";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  return <SearchPage searchQuery={query} />;
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh py-50 flex justify-center text-sm text-black max-mobile:text-xs">Loading...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
