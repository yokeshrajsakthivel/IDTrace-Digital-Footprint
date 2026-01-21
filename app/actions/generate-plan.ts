'use server';

import { generateObject } from 'ai';
import { aiModel } from '@/lib/ai';
import { z } from 'zod';

const ActionPlanSchema = z.object({
    plans: z.array(z.object({
        title: z.string(),
        description: z.string(),
        priority: z.enum(['High', 'Medium', 'Low']),
        steps: z.array(z.string()),
        service: z.string().optional().describe('The name of the compromised service (e.g. Netflix, Gmail)'),
    }))
});

interface Breach {
    source: string;
    dataClasses: string[];
}

export async function generateActionPlan(breaches: Breach[]) {
    try {
        const prompt = `
      Create a personalized security action plan based on these breaches:
      ${JSON.stringify(breaches.map(b => ({ source: b.source, data: b.dataClasses })))}

      For each unique major service (like Gmail, Adobe, LinkedIn, etc.), provide a specific recovery plan.
      Also include general security improvements if there are many breaches.
      Focus on actionable steps like "Enable 2FA", "Change Password", "Revoke App Permissions".
      
      Limit to 3-5 high-impact plans.
    `;

        const { object } = await generateObject({
            model: aiModel,
            schema: ActionPlanSchema,
            prompt: prompt,
        });

        return { success: true, plan: object.plans };
    } catch (error) {
        console.error('Action Plan Generation failed:', error);
        return { success: false, error: 'Failed to generate plan' };
    }
}
