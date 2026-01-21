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
    try {
        const prompt = `
      You are a security consultant.
      User Risk Level: ${level}
      Exposures: ${JSON.stringify(exposures.map(e => e.source))}
      
      Provide 3 specific, actionable mitigation steps.
      Format as a JSON array of strings.
      Example: ["step 1", "step 2", "step 3"]
      Do not include markdown formatting.
    `;

        const { text } = await generateText({
            model: aiModel,
            prompt: prompt,
        });

        // specific parsing to ensure array
        try {
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanText);
        } catch (e) {
            return [text]; // Fallback if not proper JSON
        }
    } catch (error) {
        return ["Enable 2FA on all accounts immediately.", "Change passwords for exposed services.", "Monitor bank statements for suspicious activity."];
    }
}
