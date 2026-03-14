import { createUser, CreateUserPayload } from "@/lib/server/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body: CreateUserPayload = await req.json();
    const data = await createUser(body);

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
