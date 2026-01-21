import { streamText } from 'ai';
import { aiModel } from '@/lib/ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Debug: Check if API Key is configured (do not log the key itself)
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("ERROR: GOOGLE_GENERATIVE_AI_API_KEY is missing in environment variables.");
      return new Response("Configuration Error: API Key missing", { status: 500 });
    }

    const result = await streamText({
      model: aiModel,
      messages,
      system: `
      You are IDTrace Sentinel, an elite cybersecurity assistant.
      Your goal is to help users understand their digital footprint, privacy risks, and how to secure their accounts.
      
      Guidelines:
      1. Be concise, professional, and reassuring.
      2. If asked about specific leaks (like "What is the Adobe breach?"), provide accurate historical details.
      3. Recommend best practices: 2FA, Password Managers, Unique Passwords.
      4. Do NOT give legal advice.
      5. If the user is panicked, guide them through immediate recovery steps (e.g. "Change your password now").
    `,
    });

    // Debug: Log success
    // console.log("AI Stream started successfully");

    // Use toUIMessageStreamResponse to return a stream compatible with useChat
    // Note: We cast to any because TS definitions might be slightly out of sync in this env, 
    // but the method exists in the checked d.ts file.
    if (typeof (result as any).toUIMessageStreamResponse === 'function') {
      return (result as any).toUIMessageStreamResponse();
    }

    // Fallback if method is missing (unlikely given d.ts verification)
    console.warn("toUIMessageStreamResponse missing, falling back to text stream");
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
