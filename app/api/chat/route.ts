import { streamText } from 'ai';
import { aiModel } from '@/lib/ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response("Configuration Error: API Key missing", { status: 500 });
    }

    const result = await streamText({
      model: aiModel,
      messages,
      system: `You are IDTrace Sentinel, an elite cybersecurity assistant.

      PLATFORM CONTEXT:
      - You are embedded in "IDTrace", a Digital Footprint Awareness & Risk Scoring Platform.
      - Users can scan their email to find breaches, leaks, and exposed data.
      - The platform calculates a Risk Score (0-100).

      SCORING LOGIC (Memorize this):
      - 0-39: CRITICAL Risk (Immediate action needed).
      - 40-64: HIGH Risk (Severe data exposed).
      - 65-84: MEDIUM Risk (Some exposure).
      - 85-100: LOW Risk (Safe, good hygiene).

      NAVIGATION & ACTIONS:
      - To scan an email: Direct users to the "Monitor" or "Dashboard" page (/dashboard/user).
      - To view past results: Direct users to "History" (/dashboard/user/history).
      - To update settings: Direct users to "Settings" (/dashboard/user/settings).

      GUIDELINES:
      - If a user asks "How do I scan?", tell them to go to the Dashboard.
      - If a user asks "What is my score?", explain the ranges above.
      - Be concise, professional, and reassuring.
      - Do NOT give legal advice.
      `,
    });

    // SIMPLE METHOD: Return raw text stream.
    // No protocols, no envelopes, just pure text chunks.
    return result.toTextStreamResponse();

  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
