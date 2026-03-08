import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { items } = body;

    const products = items.map((item: { productId: number; quantity: number }) => ({
      product_id: item.productId,
      quantity: item.quantity,
    }));

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL!}/api/stripe/payments/create-intent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ACCESS_TOKEN!}`,
          apiKey: process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({ products }),
      }
    );

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Stripe API error status:", res.status);
      console.error("Stripe API error body:", errorData);
      return NextResponse.json(
        { error: "Failed to create payment intent", details: errorData },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ clientSecret: data.clientSecret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
