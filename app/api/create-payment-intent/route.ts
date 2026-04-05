import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { products, billingInfo, promoCode } = body;
    const supabase = await createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL!}/api/stripe/payments/create-intent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${!session ? process.env.NEXT_PUBLIC_SUPABASE_ACCESS_TOKEN! : session.access_token}`,
          apiKey: process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({ 
          products,
          billingInfo,
          promoCode: promoCode || null
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.text();
      console.log("Error creating payment intent 1:", errorData);
      return NextResponse.json(
        { error: "Failed to create payment intent", details: errorData },
        { status: res.status }
      );
    }

    const data = await res.json();
    const clientSecret = data.clientSecret || data.client_secret;
    return NextResponse.json({ clientSecret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
     console.log("Error creating payment intent 2");
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
