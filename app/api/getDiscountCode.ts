import { createServerSupabaseClient } from "@/utils/supabase/server";

export type DiscountResponse = {
  valid: boolean;
  discount_amount: number;
  unit: "percent" | "amount";
};

export type DiscountErrorResponse = {
  valid: boolean;
  reason: string;
};

export async function getDiscountCode(
  promoCode: string,
): Promise<DiscountResponse | DiscountErrorResponse | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const headers: Record<string, string> = {
      Authorization: `Bearer ${!session ? process.env.NEXT_PUBLIC_SUPABASE_ACCESS_TOKEN! : session.access_token}`,
      "Content-Type": "application/json",
      apiKey: process.env.NEXT_PUBLIC_API_KEY!,
    };

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL!}/api/discount/code/${promoCode}`;
    
    // Log request details for debugging (server-side only)
    console.log(`Fetching discount code: ${url}`);
    
    const res = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
        // Attempt to parse structured error response from backend
        try {
            const errorBody = await res.json();
            console.log(`Discount API error body for ${promoCode}:`, errorBody);
            
            // If the backend returns a structured error, pass it along
            if (errorBody && typeof errorBody.valid === 'boolean') {
                return errorBody; 
            }
        } catch (e) {
            // Ignore parse errors for non-JSON or malformed error bodies
        }

        if (res.status === 404) {
            return { valid: false, discount_amount: 0, unit: "amount" };
        }
        
        console.error(`Discount API failed with status ${res.status}: ${res.statusText}`);
        return null;
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Failed to fetch discount code:", error.message);
    return null;
  }
}
