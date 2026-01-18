import axios from "axios";
import { Exposure } from "@/lib/types";
import { ScanProvider } from "./base";

export class DeHashedAdapter implements ScanProvider {
    name = "DeHashed";
    enabled = !!process.env.DEHASHED_API_KEY;

    async scan(email: string): Promise<Exposure[]> {
        if (!this.enabled || !process.env.DEHASHED_API_KEY) return [];

        // DeHashed requires the account email as the username for Basic Auth
        const emailUser = process.env.DEHASHED_USER;
        if (!emailUser) {
            console.warn("[DEHASHED] Missing DEHASHED_USER in .env.local. API request will likely fail (401/404).");
            // We continue anyway as requested, but log the warning.
        }

        try {
            // DeHashed standard is query=email:"email"
            const response = await axios.get("https://api.dehashed.com/search", {
                params: { query: `email:"${email}"` },
                headers: {
                    "Accept": "application/json",
                },
                auth: {
                    username: process.env.DEHASHED_USER || "api_user", // Placeholder if user hasn't provided the account email
                    password: process.env.DEHASHED_API_KEY
                }
            });

            if (response.data.success && response.data.entries) {
                return response.data.entries.map((entry: any, index: number) => ({
                    id: `dehashed-${index}`,
                    source: entry.database_name || "DeHashed Entry",
                    date: entry.obtained_date || "Unknown",
                    details: `Data point: ${entry.email} found in ${entry.database_name}`,
                    dataClasses: ["Email", entry.hashed_password ? "Hashed Password" : "Password"].filter(Boolean),
                    severity: "High",
                    type: "Breach"
                }));
            }
            return [];
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404 || error.response?.status === 400 || error.response?.status === 401) {
                    console.log(`[DEHASHED] Skipped: API rejected credentials (Status ${error.response.status}).`);
                    return [];
                }
            }
            console.error("DeHashed scan error:", error.message);
            return [];
        }
    }
}
