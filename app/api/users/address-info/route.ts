import { NextResponse } from "next/server";
import { getUserAddressInfo } from "@/app/api/getUserAddressInfo";

export async function GET() {
  try {
    const addressInfo = await getUserAddressInfo();
    return NextResponse.json(addressInfo);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
