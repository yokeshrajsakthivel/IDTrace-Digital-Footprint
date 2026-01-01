import { NextRequest, NextResponse } from "next/server";
import { LeakcheckAdapter } from "@/lib/services/adapters/leakcheck";
import { IntelXAdapter } from "@/lib/services/adapters/intelx";
import { MaigretAdapter } from "@/lib/services/adapters/maigret";
import { DeHashedAdapter } from "@/lib/services/adapters/dehashed";
import { IntelligenceResult } from "@/lib/types";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const providers = [
        new LeakcheckAdapter(),
        new IntelXAdapter(),
        new MaigretAdapter(),
        new DeHashedAdapter()
    ];

    const stats = {
        scannedProviders: [] as string[],
        successProviders: [] as string[],
        failedProviders: [] as string[],
    };

    const results = await Promise.allSettled(
        providers.map(async (p) => {
            if (p.enabled) {
                stats.scannedProviders.push(p.name);
                const data = await p.scan(email);
                stats.successProviders.push(p.name);
                return data;
            }
            return [];
        })
    );

    const mergedExposures = new Map<string, any>();

    results.forEach((res, index) => {
        if (res.status === "fulfilled") {
            res.value.forEach((exp: any) => {
                const key = exp.source.toLowerCase().trim();
                if (mergedExposures.has(key)) {
                    const existing = mergedExposures.get(key);
                    // Merge data classes
                    existing.dataClasses = Array.from(new Set([...existing.dataClasses, ...exp.dataClasses]));
                    // Take the most severe type
                    const severityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
                    if (severityOrder[exp.severity as keyof typeof severityOrder] > severityOrder[existing.severity as keyof typeof severityOrder]) {
                        existing.severity = exp.severity;
                    }
                } else {
                    mergedExposures.set(key, { ...exp });
                }
            });
        } else {
            const providerName = providers[index].name;
            stats.failedProviders.push(providerName);
        }
    });

    const exposures = Array.from(mergedExposures.values());

    const finalResult: IntelligenceResult = {
        email,
        breaches: exposures.filter(e => e.type === 'Breach' || e.type === 'Leak').length,
        exposures,
        stats
    };

    return NextResponse.json(finalResult);
}
