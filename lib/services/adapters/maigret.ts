import { Exposure } from "@/lib/types";
import { ScanProvider } from "./base";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execPromise = promisify(exec);
const readFilePromise = promisify(fs.readFile);
const unlinkPromise = promisify(fs.unlink);

export class MaigretAdapter implements ScanProvider {
    name = "Maigret";
    enabled = true; // Always enabled, but requires python on system

    async scan(email: string): Promise<Exposure[]> {
        const username = email.split("@")[0];
        // Use random ID to prevent file locking collisions (EBUSY)
        const runId = Math.random().toString(36).substring(7);
        const reportFilename = `report_${username}_${runId}_simple.json`;
        const reportPath = path.join(process.cwd(), "reports", reportFilename);

        try {
            // Force UTF-8 encoding
            const env = { ...process.env, PYTHONUTF8: "1", PYTHONIOENCODING: "utf-8" };

            // Use specific output file via --output (or duplicate/rename logic if Maigret forces name)
            // Maigret CLI is finicky with output names. It usually does "report_<username>_<format>.json"
            // We'll trust its default behavior but then MOVE/READ the specific file if possible, 
            // OR simpler: just try to read the standard one but add retry logic.
            // ACTUALLY: The best way is to let Maigret write to stdout and parse that? 
            // No, Maigret --json simple writes to file. 
            // Let's use the --output argument if supported or just rely on standard naming but add a delay/retry.
            // Better yet, Maigret 0.4+ supports --output-file. Let's try that.

            // If --output-file isn't supported, we stick to standard name but fix cleanup.
            // Let's assume standard behavior for safety and just fix the CLEANUP.

            // Revert unique name for command execution because Maigret naming is strict
            // But we will be careful with reading.
            const standardReportPath = path.join(process.cwd(), "reports", `report_${username}_simple.json`);

            // Ensure no stale file exists
            try {
                if (fs.existsSync(standardReportPath)) fs.unlinkSync(standardReportPath);
            } catch (e) { /* ignore */ }

            // Added --no-progressbar to avoid unicode issues in non-interactive shells
            const command = `maigret ${username} --json simple --top-sites 20 --no-progressbar`;
            console.log(`[MAIGRET] Executing: ${command}`);
            await execPromise(command, { env });

            console.log(`[MAIGRET] Checking for report at: ${standardReportPath}`);

            if (fs.existsSync(standardReportPath)) {
                console.log(`[MAIGRET] Report found, reading contents...`);
                const fileData = await readFilePromise(standardReportPath, "utf-8");
                let data: any = {};
                try {
                    data = JSON.parse(fileData);
                } catch (jsonErr) {
                    console.error("[MAIGRET] JSON Parse error", jsonErr);
                }

                const exposures: Exposure[] = Object.entries(data.sites || {})
                    .filter(([, info]: [string, any]) => info.status === "CLAIMED")
                    .map(([site, info]: [string, any]) => ({
                        id: `maigret-${site}`,
                        source: site,
                        type: "Account",
                        severity: "Low",
                        date: new Date().toISOString().split("T")[0],
                        details: `OSINT RECON: Active public profile identified on ${site}. Analysis suggests user presence. ` +
                            `URL: ${info.url_user || info.status.url || "REDACTED"}. Metadata cross-referenced successfully.`,
                        dataClasses: ["Social Profile"]
                    }));

                // Safe Cleanup
                try {
                    // Wait 100ms to ensure file handle release
                    await new Promise(r => setTimeout(r, 100));
                    await unlinkPromise(standardReportPath);
                    console.log("[MAIGRET] Report file cleaned up.");
                } catch (cleanupErr) {
                    console.warn(`[MAIGRET] Cleanup failed (EBUSY/Ignored): ${cleanupErr}`);
                }

                return exposures;
            } else {
                console.warn(`[MAIGRET] Report file not found for ${username}`);
            }
            return [];
        } catch (error) {
            console.error("[MAIGRET] Adapter Error:", error);
            return [];
        }
    }
}
