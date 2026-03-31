import { NextResponse } from "next/server";
import { getOrders } from "@/app/api/getOrders";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as "IN_PROGRESS" | "COMPLETED" | null;

  try {
    const result = await getOrders(status || undefined);
    if (!result) {
      return NextResponse.json({ data: [] });
    }
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
