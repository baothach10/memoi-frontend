import { NextResponse } from "next/server";
import { getOrdersCount } from "@/app/api/getOrdersCount";

export async function GET() {
  try {
    const result = await getOrdersCount();
    if (!result) {
      return NextResponse.json({ error: "Failed to fetch orders count" }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
