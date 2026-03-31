import { NextResponse } from "next/server";
import { getCart } from "@/app/api/getCart";
import { updateCart, UpdateCartPayload } from "@/app/api/updateCart";

export async function GET() {
  try {
    const result = await getCart();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body: UpdateCartPayload = await request.json();
    const result = await updateCart(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
