import { IntelligenceResult, RiskProfile } from "@/lib/types";

export const ScoringService = {
    calculate(data: IntelligenceResult): RiskProfile {
        let baseScore = 100;

        // Deduct based on exposure types
        data.exposures.forEach(exp => {
            let penalty = 0;
            switch (exp.type) {
                case 'Breach': penalty = 15; break;
                case 'Leak': penalty = 12; break;
                case 'Scrape': penalty = 5; break;
                case 'Account': penalty = 2; break;
                default: penalty = 10;
            }

            // Modifier based on severity
            if (exp.severity === 'Critical') penalty *= 1.5;
            if (exp.severity === 'High') penalty *= 1.25;
            if (exp.severity === 'Low') penalty *= 0.5;

            baseScore -= penalty;
        });

        // Deduct for sensitive data types across all exposures
        const allDataClasses = Array.from(new Set(data.exposures.flatMap(e => e.dataClasses)));
        if (allDataClasses.some(c => c.toLowerCase().includes("password"))) baseScore -= 20;
        if (allDataClasses.some(c => c.toLowerCase().includes("phone"))) baseScore -= 10;
        if (allDataClasses.some(c => c.toLowerCase().includes("ssn") || c.toLowerCase().includes("national id"))) baseScore -= 30;

        // Clamp score
        const score = Math.max(0, Math.min(100, Math.floor(baseScore)));

        let level: RiskProfile['level'] = 'Low';
        if (score < 40) level = 'Critical';
        else if (score < 65) level = 'High';
        else if (score < 85) level = 'Medium';

        // Mock Geolocation Intelligence (Simulating where the breaches originated)
        const breaches = data.breaches || 0; // Ensure breaches is a number
        const mockLocations = [
            { country: "United States", lat: 38, lng: -97, count: breaches * 2 },
            { country: "Germany", lat: 51, lng: 10, count: Math.floor(breaches / 2) },
            { country: "Russia", lat: 61, lng: 105, count: Math.max(1, Math.floor(breaches / 3)) },
            { country: "China", lat: 35, lng: 105, count: Math.max(1, Math.floor(breaches / 4)) },
        ].filter(l => l.count > 0);

        const summary = `Analysis across ${data.stats?.scannedProviders.length || 0} intelligence sources found ${data.breaches} breaches and leaks. Your overall profile shows a ${level.toLowerCase()} risk level.`;

        return {
            score,
            level,
            summary,
            details: {
                ...data,
                locations: mockLocations
            }
        };
    },
};

