import { NextResponse } from "next/server";
import { getUserMembership } from "@/app/api/getUserMembership";

export async function GET() {
  try {
    const membership = await getUserMembership();
    return NextResponse.json(membership);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
