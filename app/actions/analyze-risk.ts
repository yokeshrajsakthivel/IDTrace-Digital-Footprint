'use server';

import { generateText } from 'ai';
import { aiModel } from '@/lib/ai';

interface RiskAnalysisDetails {
    score: number;
    level: string;
    breaches: number;
    exposures: Array<{
        source: string;
        type: string;
        severity?: string;
        dataClasses: string[];
    }>;
}

export async function generateRiskAnalysis(details: RiskAnalysisDetails) {
    try {
        const prompt = `
      You are an expert cybersecurity analyst.
      Analyze the following breach data for a user:
      
      Risk Score: ${details.score}
      Risk Level: ${details.level}
      Breach Count: ${details.breaches}
      Exposures: ${JSON.stringify(details.exposures.map(e => ({
            source: e.source,
            type: e.type,
            severity: e.severity,
            data: e.dataClasses
        })))}

      Please provide a concise, natural language explanation of WHY the risk is at this level.
      Focus on the most critical exposures. 
      Do NOT list every single breach. 
      Explain the potential consequences (e.g. "Because your password was leaked in the Adobe breach...").
      Keep it under 3 sentences.
      Tone: Professional, urgent but calm.
    `;

        const { text } = await generateText({
            model: aiModel,
            prompt: prompt,
        });

        return { analysis: text };
    } catch (error) {
        console.error('AI Analysis failed:', error);
        return { analysis: "AI analysis unavailable at this time." };
    }
}

export async function generateMitigationPlan(level: string, exposures: any[]) {
    console.log(`[AI Mitigation] Generating plan for ${exposures.length} exposures. Risk Level: ${level}`);

    try {
        const exposureNames = exposures.map(e => e.source).join(", ");
        const prompt = `
      You are an expert security consultant for a user with Risk Level: ${level}.
      
      Their data appeared in these specific breaches: ${exposureNames}
      
      Task:
      Generate 3 highly specific, actionable mitigation steps TAILORED to these specific breaches.
      - If "Adobe" is listed, mention password reuse.
      - If "LinkedIn" is listed, mention business email security.
      - If "Gravatar" is listed, mention public profile scrubbing.
      
      Format as a JSON array of strings.
      Example: ["step 1", "step 2", "step 3"]
      Do not include markdown formatting.
    `;

        console.log(`[AI Mitigation] Prompt sent: ${prompt.substring(0, 100)}...`);

        const { text } = await generateText({
            model: aiModel,
            prompt: prompt,
        });

        console.log(`[AI Mitigation] Raw AI response: ${text}`);

        // specific parsing to ensure array
        try {
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanText);
            console.log(`[AI Mitigation] Successfully parsed JSON.`);
            return parsed;
        } catch (e) {
            console.error(`[AI Mitigation] JSON parse failed. Returning raw text as single item.`);
            return [text]; // Fallback if not proper JSON
        }
    } catch (error) {
        console.error('[AI Mitigation] API Call Failed:', error);
        return [
            "Enable 2FA on all accounts immediately (Fallback Recommendation).",
            "Change passwords for exposed services (Fallback Recommendation).",
            "Monitor bank statements for suspicious activity (Fallback Recommendation)."
        ];
    }
}
