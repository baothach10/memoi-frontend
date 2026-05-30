import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, Output, jsonSchema } from "ai";
import { NextResponse } from "next/server";

export const runtime = "edge";

// Instantiate the provider with the API key using createGoogleGenerativeAI
// (preferred over the default singleton `google` when passing custom config)
const googleAI = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

const sizeSuggestionSchema = jsonSchema<{
  suggestedSize: string;
}>({
  type: "object",
  properties: {
    suggestedSize: {
      type: "string",
      description:
        "The name of the suggested size (e.g., SERENE - S, MUSE - M, LUMINOUS - L)",
    },
  },
  required: ["suggestedSize"],
  additionalProperties: false,
});

export async function POST(req: Request) {
  try {
    const {
      height,
      weight,
      age,
      chest,
      waist,
      hip,
      preference,
      sizingRanges,
      ai_notes,
    } = await req.json();

    const { output: object } = await generateText({
      model: googleAI("gemini-2.5-flash"),
      output: Output.object({ schema: sizeSuggestionSchema }),
      prompt: `You are a professional fashion sizing assistant for MEMOÍ, a luxury clothing brand.
Your task is to recommend the best clothing size for a customer based on their measurements, preferences, and product-specific notes.

Customer Profile:
- Height: ${height} cm
- Weight: ${weight} kg
- Age: ${age > 0 ? age : "Not provided"} years
- Chest: ${chest} cm
- Waist: ${waist} cm
- Hip: ${hip} cm
- Clothing Preference: ${preference} (Scale: 0=Very Fitted, 1=Fitted, 2=Normal, 3=Loose, 4=Very Loose)

Product AI Notes:
${ai_notes ?? "None provided"}

Available Sizing Ranges:
${JSON.stringify(sizingRanges, null, 2)}

Instructions:
1. Analyze the customer's measurements against the chest, waist, hip, and height ranges provided.
2. Consider their weight and age for body shape estimation.
3. Factor in their clothing preference (e.g., if they prefer 'Loose', suggest a size up when between sizes).
4. Select the most appropriate size from: ${sizingRanges.map((r: { size: string }) => r.size).join(", ")}.
5. Reply with a JSON object containing only the suggestedSize field.`,
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error("Size suggestion error:", error);
    return NextResponse.json(
      { error: "Failed to generate size suggestion" },
      { status: 500 },
    );
  }
}
