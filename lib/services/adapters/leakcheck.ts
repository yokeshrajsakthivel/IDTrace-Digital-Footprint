import axios from "axios";
import { Exposure } from "@/lib/types";
import { ScanProvider } from "./base";

export class LeakcheckAdapter implements ScanProvider {
    name = "Leakcheck";
    enabled = !!process.env.LEAKCHECK_API_KEY;

    async scan(email: string): Promise<Exposure[]> {
        if (!this.enabled || !process.env.LEAKCHECK_API_KEY) return [];

        try {
            const response = await axios.get(`https://leakcheck.io/api`, {
                params: {
                    key: process.env.LEAKCHECK_API_KEY,
                    type: "email",
                    check: email
                }
            });

            if (response.data.success && response.data.found > 0) {
                return response.data.result.map((item: any, index: number) => ({
                    id: `leakcheck-${index}`,
                    source: item.line || "Private Leak",
                    date: item.last_breach || "Unknown",
                    details: `Found in ${item.sources?.join(", ") || "Unknown source"}`,
                    dataClasses: ["Email", "Password"], // Standard for Leakcheck
                    severity: "High",
                    type: "Leak"
                }));
            }
            return [];
        } catch (error) {
            console.error("Leakcheck scan error:", error);
            return [];
        }
    }
}
