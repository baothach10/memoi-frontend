import { useMutation } from "@tanstack/react-query";

interface SizingRange {
  size: string;
  chest: number[];
  waist: number[];
  hip: number[];
  height: number[];
}

interface SizeSuggestionParams {
  height: number;
  weight: number;
  age: number;
  chest: number;
  waist: number;
  hip: number;
  preference: number;
  sizingRanges: SizingRange[];
  ai_notes?: string;
}

interface SizeSuggestionResponse {
  suggestedSize: string;
}

async function getSizeSuggestion(
  params: SizeSuggestionParams,
): Promise<SizeSuggestionResponse> {
  const res = await fetch("/api/size-suggestion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to get size suggestion");
  }

  return res.json();
}

export function useSizeSuggestionMutation() {
  return useMutation({
    mutationFn: getSizeSuggestion,
  });
}
