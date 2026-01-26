import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerSupabaseClient } from "./utils/supabase/server";
import { getUserProfile } from "./app/api/getUserProfile";

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Allow auth callback for Google redirect URI
  if (pathname === "/auth/callback") {
    return NextResponse.next();
  }

  const res = NextResponse.next();

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAccountRoute = pathname.startsWith("/account");
  const isAuthPage = pathname === "/sign-in";
  const isRegisterPage = pathname === "/register";

  // 🚫 Block /account for unauthenticated users
  if (!user && isAccountRoute) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // 🚫 For authenticated users, check profile completion
  if (user && !isRegisterPage) {
    const userData = await getUserProfile();
    // Redirect to register if profile is not completed (mandatory step)
    if (!userData.authenticated || !userData.profile_completed)
      return NextResponse.redirect(new URL("/register", req.url));
  }

  // 🚫 Block auth pages when logged in with completed profile
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Allow completed users to access all other pages
  if (user && isRegisterPage) {
    const userData = await getUserProfile();
    if (userData.authenticated && userData.profile_completed)
      return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|models|assets|images|fonts|icons|videos).*)",
  ],
};
