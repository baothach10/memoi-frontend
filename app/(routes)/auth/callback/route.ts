import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  console.log('asdasdasd')

  if (code) {
    console.error('123')
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    console.log('first')
    if (!error) {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      console.log('second')

      if (error || !session) {
        console.log("Session missing or error:", error);
        redirect(`${origin}`);
      }

      const user = session.user;
      const accessToken = session.access_token;
      //
      const refreshToken = session.refresh_token;

      // save to session or local storage

      console.log('third',user, accessToken);
      return NextResponse.redirect(`${origin}`);
    }
  }

  console.log('fourth')

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
