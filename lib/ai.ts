import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Explicitly pass the key to ensure it's picked up
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!apiKey) {
    console.error("CRITICAL: GOOGLE_GENERATIVE_AI_API_KEY is missing in lib/ai.ts");
} else {
    console.log("AI Config: Key found (" + apiKey.substring(0, 5) + "...)");
}

const google = createGoogleGenerativeAI({
    apiKey: apiKey || ""
});

export const aiModel = google('gemini-flash-lite-latest');
