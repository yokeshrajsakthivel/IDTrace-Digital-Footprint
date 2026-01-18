import axios from "axios";
import { Exposure } from "@/lib/types";
import { ScanProvider } from "./base";

export class IntelXAdapter implements ScanProvider {
    name = "IntelligenceX";
    enabled = false; // process.env.INTELX_API_KEY; // Key invalid (401), disabling.

    async scan(email: string): Promise<Exposure[]> {
        if (!this.enabled || !process.env.INTELX_API_KEY) return [];

        try {
            // First, initiate the search
            const searchResponse = await axios.post(
                "https://2.intelx.io/intelligent/search",
                {
                    term: email,
                    maxresults: 10,
                    media: 0,
                    terminate: []
                },
                {
                    headers: { "x-key": process.env.INTELX_API_KEY }
                }
            );

            const searchId = searchResponse.data.id;
            if (!searchId) return [];

            // Wait a bit for results
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Get result list
            const resultResponse = await axios.get(
                `https://2.intelx.io/intelligent/search/result?id=${searchId}`,
                {
                    headers: { "x-key": process.env.INTELX_API_KEY }
                }
            );

            if (resultResponse.data && resultResponse.data.records) {
                return resultResponse.data.records.map((record: any) => ({
                    id: record.systemid,
                    source: record.name || "IntelX Result",
                    date: record.date || "Unknown",
                    details: `Found in IntelligenceX database. Storage: ${record.storageid}`,
                    dataClasses: ["Identity Data"],
                    severity: "Medium",
                    type: "Breach"
                }));
            }
            return [];
        } catch (error) {
            console.error("IntelX scan error:", error);
            return [];
        }
    }
}
