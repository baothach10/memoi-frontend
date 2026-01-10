export type CategoryType = {
  id: string;
  name: string;
};

export type CategoriesResponse = Array<CategoryType>;

export async function getCategories(
): Promise<CategoriesResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL!}/rest/v1/rpc/get_all_categories`,
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
    throw new Error("Failed to fetch products");
  }

  return res.json();
}
