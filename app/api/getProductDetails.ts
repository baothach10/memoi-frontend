export type ProductImage = {
  url: string;
  order: number;
};

export type ProductVariant = {
  id: string;
  size: string;
  price: number;
  stock: number;
  currency: string;
};

export type ProductCategory = {
  id: number;
  name: string;
};

export type ProductColor = {
  color: string;
  product_id: string;
};

export type ProductDetailsResponse = {
  product_id: number;
  sku: string;
  name: string;
  currency: string;
  description: string;
  color: string;
  color_name: string;
  colors: ProductColor[];
  seo_meta_description: string;
  status: string;
  collection: string;
  category: ProductCategory;
  images: ProductImage[];
  variants: ProductVariant[];
  created_at: string;
  updated_at: string;
};

export async function getProductDetails(
  productId: number
): Promise<ProductDetailsResponse> {
  const res = await fetch(
    `${process.env
      .NEXT_PUBLIC_API_BASE_URL!}/rest/v1/rpc/get_product_details_json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env
          .NEXT_PUBLIC_SUPABASE_ACCESS_TOKEN!}`,
        apiKey: process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({ product_id: productId }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch product details");
  }

  return res.json();
}
