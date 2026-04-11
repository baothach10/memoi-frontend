export type ProductSuggestion = {
  id: string;
  name: string;
  price: number;
  images: string[];
  currency: string;
};

export type ProductDetailsResponse = Array<ProductSuggestion>;

export async function getProductSuggestions(): Promise<ProductDetailsResponse> {
  const res = await fetch(
    `${process.env
      .NEXT_PUBLIC_API_BASE_URL!}/rest/v1/rpc/get_suggested_products_json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env
          .NEXT_PUBLIC_SUPABASE_ACCESS_TOKEN!}`,
        apiKey: process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({}),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch product details");
  }

  return res.json();
}
