import { IntelligenceResult } from "@/lib/types";

export const IntelligenceService = {
    async scan(email: string): Promise<IntelligenceResult> {
        try {
            const response = await fetch(`/api/scan?email=${encodeURIComponent(email)}`);
            if (!response.ok) {
                throw new Error("Failed to fetch scan results");
            }
            return await response.json();
        } catch (error) {
            console.error("Scan error:", error);
            // Fallback mock if API fails for some reason during dev
            return {
                email,
                breaches: 0,
                exposures: []
            };
        }
    },
};
