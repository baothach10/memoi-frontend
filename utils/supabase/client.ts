import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_API_BASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ACCESS_TOKEN!
    );
}