import { IntelligenceResult, RiskProfile } from "@/lib/types";
import { getLocationForSource } from "@/lib/utils/location-mapper";

export const ScoringService = {
    calculate(data: IntelligenceResult): RiskProfile {
        console.log(`[SCORING] Calculating logic started. Exposures count: ${data.exposures?.length}, Breaches count: ${data.breaches}`);
        let baseScore = 100;

        // Deduct based on exposure types
        let isBreached = false;

        data.exposures.forEach(exp => {
            let penalty = 0;
            if (exp.type === 'Breach' || exp.type === 'Leak') isBreached = true;

            switch (exp.type) {
                case 'Breach': penalty = 25; break; // Increased from 15
                case 'Leak': penalty = 20; break;   // Increased from 12
                case 'Scrape': penalty = 10; break;
                case 'Account': penalty = 5; break;
                default: penalty = 10;
            }

            // Modifier based on severity
            if (exp.severity === 'Critical') penalty *= 2.0; // Increased
            if (exp.severity === 'High') penalty *= 1.5;     // Increased
            if (exp.severity === 'Low') penalty *= 0.5;

            // Modifier for data classes
            if (exp.dataClasses) {
                const classes = exp.dataClasses.map(c => c.toLowerCase());
                if (classes.includes("password")) {
                    penalty += 15;
                }
            }

            baseScore -= penalty;
        });

        // Deduct for sensitive data types across all exposures (Global Penalties)
        const allDataClasses = Array.from(new Set(data.exposures.flatMap(e => e.dataClasses)));
        if (allDataClasses.some(c => c.toLowerCase().includes("password"))) baseScore -= 20;
        if (allDataClasses.some(c => c.toLowerCase().includes("phone"))) baseScore -= 10;
        if (allDataClasses.some(c => c.toLowerCase().includes("ssn") || c.toLowerCase().includes("national id"))) baseScore -= 40;

        // CRITICAL: If any confirmed breach exists, score CANNOT be High Safety (>=65).
        // Cap max score at 60 for any breached account.
        if (isBreached && baseScore > 64) {
            baseScore = 60;
        }

        // Clamp score
        const score = Math.max(0, Math.min(100, Math.floor(baseScore)));

        let level: RiskProfile['level'] = 'Low'; // 'Low' MEANS Low Risk? No, typically Low Score = High Risk.
        // Wait, typical credit score logic: High Score = Good. Low Score = Bad.
        // Let's verify existing mapping: 
        // if (score < 40) level = 'Critical';
        // else if (score < 65) level = 'High';
        // else if (score < 85) level = 'Medium';
        // else level = 'Low' (Safe)

        if (score < 40) level = 'Critical';
        else if (score < 65) level = 'High'; // High Risk
        else if (score < 85) level = 'Medium';
        else level = 'Low';

        // Real-time Geolocation Intelligence
        const detectedLocations = new Map<string, { country: string, lat: number, lng: number, count: number }>();

        data.exposures.forEach(exp => {
            const loc = getLocationForSource(exp.source);
            // Unique key by country usually, but better by lat/lng to group pins
            const key = `${loc.lat},${loc.lng}`;

            if (detectedLocations.has(key)) {
                detectedLocations.get(key)!.count++;
            } else {
                detectedLocations.set(key, { ...loc, count: 1 });
            }
        });

        const realLocations = Array.from(detectedLocations.values());

        const summary = `Analysis across ${data.stats?.scannedProviders.length || 0} intelligence sources found ${data.breaches} breaches and leaks. Your overall profile shows a ${level.toLowerCase()} risk level.`;

        return {
            score,
            level,
            summary,
            details: {
                ...data,
                locations: realLocations
            }
        };
    },
};

