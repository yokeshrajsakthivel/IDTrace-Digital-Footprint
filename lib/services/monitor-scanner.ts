import { db } from "@/lib/db";
import { LeakcheckAdapter } from "./adapters/leakcheck";
import { IntelXAdapter } from "./adapters/intelx";
import { MaigretAdapter } from "./adapters/maigret";
import { DeHashedAdapter } from "./adapters/dehashed";

const providers = [
    new LeakcheckAdapter(),
    new IntelXAdapter(),
    new MaigretAdapter(),
    new DeHashedAdapter()
];

export async function processMonitor(monitorId: string) {
    console.log(`[SCANNER] Starting scan for monitor: ${monitorId}`);
    const monitor = await (db as any).monitor.findUnique({
        where: { id: monitorId }
    });

    if (!monitor) {
        console.error(`[SCANNER] Monitor ${monitorId} not found`);
        return;
    }

    console.log(`[SCANNER] Target value: ${monitor.value} (${monitor.type})`);

    try {
        let allExposures: any[] = [];

        // Run all enabled providers
        const scanPromises = providers.map(async (provider) => {
            try {
                console.log(`[SCANNER] Calling provider: ${provider.name}`);
                const startTime = Date.now();
                const results = await provider.scan(monitor.value);
                console.log(`[SCANNER] Provider ${provider.name} finished in ${Date.now() - startTime}ms. Found ${results.length} exposures.`);
                return results;
            } catch (e) {
                console.error(`[SCANNER] Provider ${provider.name} failed:`, e);
                return [];
            }
        });

        const results = await Promise.all(scanPromises);
        allExposures = results.flat();
        console.log(`[SCANNER] Total exposures found for ${monitor.value}: ${allExposures.length}`);

        const leakCount = allExposures.length;
        const status = leakCount > 0 ? "LEAKED" : "CLEAN";

        await (db as any).monitor.update({
            where: { id: monitorId },
            data: {
                status,
                leakCount,
                lastChecked: new Date(),
            }
        });
        console.log(`[SCANNER] Monitor ${monitorId} updated to ${status} with ${leakCount} leaks.`);

        return { status, leakCount };
    } catch (error) {
        console.error(`Failed to process monitor ${monitorId}:`, error);
        await (db as any).monitor.update({
            where: { id: monitorId },
            data: { status: "CLEAN", lastChecked: new Date() } // Fallback
        });
    }
}
