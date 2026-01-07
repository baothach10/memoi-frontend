export type ProductImage = {
  url: string;
  order: number;
};

export type SearchProduct = {
  product_id: string;
  name: string;
  price: number;
  currency: string;
  images: ProductImage[];
};

export type SearchProductsResponse = {
  products: SearchProduct[];
  current_page: number;
  total_pages: number;
  total_products: number;
  page_limit: number;
};

export async function searchProducts(
  searchQuery: string,
  pageNumber: number = 1,
  pageLimit: number = 9
): Promise<SearchProductsResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL!}/rest/v1/rpc/search_products`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env
          .NEXT_PUBLIC_SUPABASE_ACCESS_TOKEN!}`,
        apiKey: process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({
        search_query: searchQuery,
        page_number: pageNumber,
        page_limit: pageLimit,
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to search products");
  }

  return res.json();
}
