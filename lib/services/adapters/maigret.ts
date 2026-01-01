import { Exposure } from "@/lib/types";
import { ScanProvider } from "./base";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export class MaigretAdapter implements ScanProvider {
    name = "Maigret";
    enabled = true; // Always enabled, but requires python on system

    async scan(email: string): Promise<Exposure[]> {
        // Extract username from email
        const username = email.split("@")[0];

        try {
            // Run maigret with JSON output and limited sites for speed
            // Note: requires 'maigret' to be in PATH
            const { stdout } = await execPromise(`maigret ${username} --json simple --top-sites 20`);
            const data = JSON.parse(stdout);

            if (data && data.status === "found" && data.sites) {
                return Object.entries(data.sites).map(([site, info]: [string, any]) => ({
                    id: `maigret-${site}`,
                    source: site,
                    date: new Date().toISOString().split("T")[0],
                    details: `Public profile found at ${info.url}`,
                    dataClasses: ["Public Profile"],
                    severity: "Low",
                    type: "Account"
                }));
            }
            return [];
        } catch (error) {
            console.error("Maigret scan error:", error);
            // If maigret is not installed, fail silently
            return [];
        }
    }
}
