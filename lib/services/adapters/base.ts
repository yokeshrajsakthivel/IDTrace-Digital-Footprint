import { Exposure } from "@/lib/types";

export interface ScanProvider {
    name: string;
    enabled: boolean;
    scan(email: string): Promise<Exposure[]>;
}
