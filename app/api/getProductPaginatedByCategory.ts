import { ProductsPaginatedResponse } from "./getProductPaginated";

export type GetProductsByCategoryParams = {
  category_name: string;
  page_number: number;
  page_limit: number;
};

export async function getProductPaginatedByCategory(
  params: GetProductsByCategoryParams
): Promise<ProductsPaginatedResponse> {
  const res = await fetch(
    `${process.env
      .NEXT_PUBLIC_API_BASE_URL!}/rest/v1/rpc/get_products_by_category_name_paginated`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env
          .NEXT_PUBLIC_SUPABASE_ACCESS_TOKEN!}`,
        apiKey: process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({
        category_name: params.category_name,
        page_number: params.page_number,
        page_limit: params.page_limit,
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}
