export type GetProductsParams = {
  page_number: number;
  page_limit: number;
};

export type Product = {
  product_id: string;
  name: string;
  price: number;
  sale_price?: number | null;
  currency: string;
  images: Array<ProductImage>;
};

export type ProductImage = {
  url: string;
  order: number;
};

export type ProductsPaginatedResponse = {
  products: Product[];
  page_limit: number;
  current_page: number;
  total_pages: number;
  total_products: number;
};

export async function getProductsPaginated(
  params: GetProductsParams,
): Promise<ProductsPaginatedResponse> {
  const res = await fetch(
    `${process.env
      .NEXT_PUBLIC_API_BASE_URL!}/rest/v1/rpc/get_products_paginated`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env
          .NEXT_PUBLIC_SUPABASE_ACCESS_TOKEN!}`,
        apiKey: process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({
        page_number: params.page_number,
        page_limit: params.page_limit,
      }),
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}
