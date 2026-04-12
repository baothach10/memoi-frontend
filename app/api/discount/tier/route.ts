import { NextResponse } from "next/server";
import { getMembershipDiscount } from "@/app/api/getMembershipDiscount";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const amountStr = searchParams.get("amount");
  const amount = amountStr ? parseInt(amountStr, 10) : null;

  if (amount === null || isNaN(amount)) {
    return NextResponse.json(
      { error: "Missing or invalid amount parameter" },
      { status: 400 },
    );
  }

  try {
    const result = await getMembershipDiscount(amount);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Unauthorized" ? 401 : 500 },
    );
  }
}
