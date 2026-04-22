import { NextResponse } from "next/server";
import { getMembershipDiscount } from "@/app/api/getMembershipDiscount";

export async function GET(request: Request) {

  try {
    const result = await getMembershipDiscount();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Unauthorized" ? 401 : 500 },
    );
  }
}
