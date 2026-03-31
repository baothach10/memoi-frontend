import { NextResponse } from "next/server";
import { getOrderDetail } from "@/app/api/getOrderDetail";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const result = await getOrderDetail(id);
    
    if (result === undefined) {
        // This would happen if getOrderDetail returned null for auth issues
        // but for now getOrderDetail returns null for any failure.
        // Keeping it consistent but awaiting params is the main fix.
    }

    if (!result) {
      return NextResponse.json({ error: "Order details not found or unauthenticated" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API error fetching order detail:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
