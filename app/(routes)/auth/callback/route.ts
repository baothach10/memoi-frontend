import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        console.log("Session missing or error:", error);
        redirect(`${origin}`);
      }

      const user = session.user;
      const accessToken = session.access_token;
      // 
      const refreshToken = session.refresh_token;

      // save to session or local storage

      return NextResponse.redirect(`${origin}/register`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
