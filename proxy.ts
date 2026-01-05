import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerSupabaseClient } from "./utils/supabase/server";

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("session:", session);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("user: ", user);

  const pathname = req.nextUrl.pathname;

  const publicRoutes = ["/register", "/sign-in"];

  if (!user && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/register", req.url));
  }

  // 🚫 Block auth pages when logged in
  if (user && pathname === "/sign-in") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|models|assets|images|fonts|icons|videos).*)",
  ],
};
