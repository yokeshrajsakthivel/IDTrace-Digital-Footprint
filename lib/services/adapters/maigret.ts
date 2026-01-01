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
        const reportPath = path.join(process.cwd(), "reports", `report_${username}_simple.json`);

        try {
            // Force UTF-8 encoding for Python to avoid Windows charmap errors
            const env = { ...process.env, PYTHONUTF8: "1" };

            // Note: Maigret automatically creates the 'reports' directory if it doesn't exist
            // Use --output to specify the report file path if needed, or it defaults to reports/
            await execPromise(`maigret ${username} --json simple --top-sites 50`, { env });
            const command = `maigret ${username} --json simple --top-sites 50`;

            console.log(`[MAIGRET] Executing: ${command}`);
            await execPromise(command, { env });

            const reportPath = path.join(process.cwd(), "reports", `report_${username}_simple.json`);
            console.log(`[MAIGRET] Checking for report at: ${reportPath}`);

            if (fs.existsSync(reportPath)) {
                console.log(`[MAIGRET] Report found, reading contents...`);
                const fileData = await readFilePromise(reportPath, "utf-8"); // Changed readFileAsync to readFilePromise
                const data = JSON.parse(fileData);
                console.log(`[MAIGRET] Successfully parsed report. Sites found: ${Object.keys(data.sites || {}).length}`);

                const exposures: Exposure[] = Object.entries(data.sites || {})
                    .filter(([_, info]: [string, any]) => info.status === "CLAIMED")
                    .map(([site, info]: [string, any]) => ({
                        id: `maigret-${site}`,
                        source: site,
                        type: "Account",
                        severity: "Low",
                        date: new Date().toISOString().split("T")[0],
                        details: `Profile found: ${info.url_user || info.status.url || "N/A"}`,
                        dataClasses: ["Social Profile"]
                    }));

                // Cleanup
                fs.unlink(reportPath, (err) => {
                    if (err) console.error("[MAIGRET] Cleanup error:", err);
                    else console.log("[MAIGRET] Report file cleaned up.");
                });

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
