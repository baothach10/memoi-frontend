import { NextRequest, NextResponse } from "next/server";

type FormValues = {
  email: string;
  phoneZone: string;
  phone: string;
  orderNumber: string;
};

export async function POST(request: NextRequest) {
  try {
    const body: FormValues = await request.json();

    // Transform FormValues to API payload format
    const payload = {
      email: body.email,
      phone_number: body.phone,
      phone_country_code: body.phoneZone,
      order_number: body.orderNumber,
    };

    // Get the Supabase URL from environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
    }

    // Make the request to Supabase RPC endpoint
    const response = await fetch(
      `${supabaseUrl}/rest/v1/rpc/exchange_request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env
            .NEXT_PUBLIC_SUPABASE_ACCESS_TOKEN!}`,
          apiKey: process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify(payload),
      },
    );

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          error:
            errorData.message ||
            errorData.error ||
            "Failed to submit exchange request",
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Check if the response indicates failure
    if (data.status === "failed") {
      return NextResponse.json(
        { error: data.message || "Failed to submit exchange request" },
        { status: 400 },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Exchange request error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 },
    );
  }
}
