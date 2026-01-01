import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "./utils/supabase/client";

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(user)

  const pathname = req.nextUrl.pathname;

  // 🔒 Protect routes
  if (!user && pathname.startsWith("/account")) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // 🚫 Block auth pages when logged in
  if (user && pathname === "/sign-in") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/account/:path*", "/login"],
};
