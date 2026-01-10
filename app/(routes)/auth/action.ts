"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// --- Google Login ---
export async function loginWithGoogle() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN}/auth/callback`,
      // redirectTo: `http://localhost:3000/auth/callback`,
    },
  });

  if (data.url) {
    
    redirect(data.url);
  }
}

// --- Email OTP: Step 1 (Send Code) ---
export async function sendOTP(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const email = formData.get("email") as string;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });

  if (error) return { error: error.message };
  return { success: true, email };
}

// --- Email OTP: Step 2 (Verify Code) ---
export async function verifyOTP(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const email = formData.get("email") as string;
  const token = formData.get("token") as string;

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) return { error: error.message };

  redirect("/");
}

// --- Sign Out ---
export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}
