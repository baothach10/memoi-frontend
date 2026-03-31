import { NextResponse } from "next/server";
import { updatePersonalInfo, UpdatePersonalInfoPayload } from "@/app/api/updatePersonalInfo";

export async function PATCH(request: Request) {
  try {
    const body: UpdatePersonalInfoPayload = await request.json();
    const result = await updatePersonalInfo(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
