import { NextRequest, NextResponse } from "next/server";
import { LeakcheckAdapter } from "@/lib/services/adapters/leakcheck";
import { IntelXAdapter } from "@/lib/services/adapters/intelx";
import { MaigretAdapter } from "@/lib/services/adapters/maigret";
import { DeHashedAdapter } from "@/lib/services/adapters/dehashed";
import { IntelligenceResult } from "@/lib/types";
import { ScoringService } from "@/lib/services/scoring";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // DEMO DATA FOR JURY PRESENTATION
    if (email.toLowerCase() === "testuser@gmail.com" || email.toLowerCase() === "demo@idtrace.com") {
        const demoExposures: any[] = [
            {
                id: 'demo-1',
                source: 'LinkedIn',
                date: '2021-06-22',
                details: '700M records scraped including email, phone, gender',
                dataClasses: ['Email', 'Phone Number', 'Job Title'],
                severity: 'Medium',
                type: 'Scrape'
            },
            {
                id: 'demo-2',
                source: 'Canva',
                date: '2019-05-24',
                details: '137M subscribers details were exposed',
                dataClasses: ['Email', 'Password', 'Name', 'City'],
                severity: 'High',
                type: 'Breach'
            },
            {
                id: 'demo-3',
                source: 'Adobe',
                date: '2013-10-04',
                details: '153M accounts breached with encrypted passwords',
                dataClasses: ['Email', 'Password Hint', 'Username'],
                severity: 'High',
                type: 'Breach'
            },
            {
                id: 'demo-4',
                source: 'VK.com',
                date: '2016-06-05',
                details: '100M accounts compromised from Russian social network.',
                dataClasses: ['Email', 'Password', 'Location'],
                severity: 'High',
                type: 'Breach'
            },
            {
                id: 'demo-5',
                source: 'Deezer',
                date: '2022-11-23',
                details: '220M user records leaked affecting European users.',
                dataClasses: ['Email', 'Gender', 'DoB', 'IP Address'],
                severity: 'Medium',
                type: 'Leak'
            },
            {
                id: 'demo-6',
                source: 'Weibo',
                date: '2020-03-19',
                details: '538M user details scraped from Chinese microblogging site.',
                dataClasses: ['Phone Number', 'Name', 'Location'],
                severity: 'Medium',
                type: 'Scrape'
            }
        ];

        const demoResult: IntelligenceResult = {
            email,
            breaches: demoExposures.filter((e: any) => e.type === 'Breach' || e.type === 'Leak').length,
            exposures: demoExposures,
            stats: {
                scannedProviders: ['Leakcheck', 'IntelX', 'Maigret', 'DeHashed'],
                successProviders: ['Leakcheck', 'IntelX', 'Maigret', 'DeHashed'],
                failedProviders: []
            }
        };

        const riskProfile = ScoringService.calculate(demoResult);
        return NextResponse.json(riskProfile);
    }

    // CONTROLLED TEST CASE: 1 Breach (Score should be ~75)
    if (email.toLowerCase() === "moderate@idtrace.com") {
        const singleExpo: any[] = [{
            id: 'test-1',
            source: 'Adobe',
            date: '2013-10-04',
            details: 'Single logic test breach.',
            dataClasses: ['Email', 'Username'],
            severity: 'Low',
            type: 'Breach'
        }];
        return NextResponse.json(ScoringService.calculate({
            email,
            breaches: 1,
            exposures: singleExpo,
            stats: { scannedProviders: ['Test'], successProviders: ['Test'], failedProviders: [] }
        }));
    }

    // CONTROLLED TEST CASE: 3 Breaches (Score should be ~40-50)
    if (email.toLowerCase() === "risky@idtrace.com") {
        const tripleExpo: any[] = [
            { id: 't-1', source: 'LinkedIn', date: '2012', details: 'Test 1', dataClasses: ['Email'], severity: 'Low', type: 'Breach' },
            { id: 't-2', source: 'Canva', date: '2019', details: 'Test 2', dataClasses: ['Email'], severity: 'Medium', type: 'Breach' },
            { id: 't-3', source: 'Twitter', date: '2022', details: 'Test 3', dataClasses: ['Email'], severity: 'Medium', type: 'Scrape' }
        ];
        return NextResponse.json(ScoringService.calculate({
            email,
            breaches: 3,
            exposures: tripleExpo,
            stats: { scannedProviders: ['Test'], successProviders: ['Test'], failedProviders: [] }
        }));
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
                    const currentSev = exp.severity as 'Critical' | 'High' | 'Medium' | 'Low';
                    const existingSev = existing.severity as 'Critical' | 'High' | 'Medium' | 'Low';

                    if ((severityOrder[currentSev] || 0) > (severityOrder[existingSev] || 0)) {
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

    console.log(`[API] Final Result for ${email}: Breaches=${finalResult.breaches}, Exposures=${finalResult.exposures.length}`);
    finalResult.exposures.forEach(e => console.log(`[API] Exposure: ${e.source} (${e.type})`));

    // CALCULATE RISK PROFILE VIA BACKEND SERVICE
    const riskProfile = ScoringService.calculate(finalResult);
    console.log(`[API] Calculated Risk Score: ${riskProfile.score} (${riskProfile.level})`);

    return NextResponse.json(riskProfile);
}
