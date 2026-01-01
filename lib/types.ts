export interface Exposure {
    id: string;
    source: string;
    date: string;
    details: string;
    dataClasses: string[];
    severity?: 'Low' | 'Medium' | 'High' | 'Critical';
    type?: 'Breach' | 'Leak' | 'Scrape' | 'Account';
}

export interface IntelligenceResult {
    email: string;
    breaches: number;
    exposures: Exposure[];
    stats?: {
        scannedProviders: string[];
        successProviders: string[];
        failedProviders: string[];
    };
    locations?: Array<{ country: string, lat: number, lng: number, count: number }>;
}

export interface RiskProfile {
    score: number;
    level: 'Low' | 'Medium' | 'High' | 'Critical';
    summary: string;
    details: IntelligenceResult;
}
