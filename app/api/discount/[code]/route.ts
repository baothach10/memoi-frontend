import { NextResponse } from "next/server";
import { getDiscountCode } from "@/app/api/getDiscountCode";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const discount = await getDiscountCode(code);
    return NextResponse.json(discount);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
