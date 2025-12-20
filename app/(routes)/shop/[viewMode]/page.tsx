"use client";

import ShopByCategory from "@/components/ui/pages/shop/ShopByCategory";
import ShopByCollection from "@/components/ui/pages/shop/ShopByCollection";
import { usePathname } from "next/navigation";

// Main Home Component
export default function ShopByViewModePage() {
  const viewMode = usePathname();

  return (
    <>
      {viewMode.includes("category") && <ShopByCategory />}
      {viewMode.includes("collection") && <ShopByCollection />}
    </>
  );
}
