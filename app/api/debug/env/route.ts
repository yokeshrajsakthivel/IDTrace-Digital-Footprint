import { NextResponse } from "next/server";

export async function GET() {
    const dbUrl = process.env.DATABASE_URL || "";
    const directUrl = process.env.DIRECT_URL || "";

    const cleanUrl = (url: string) => {
        if (!url) return "NOT_SET";
        try {
            const parsed = new URL(url);
            return {
                protocol: parsed.protocol,
                host: parsed.hostname,
                port: parsed.port,
                hasPassword: !!parsed.password,
                valid: true
            };
        } catch (e) {
            return {
                error: (e as Error).message,
                length: url.length,
                startsWith: url.substring(0, 10),
                endsWith: url.substring(url.length - 10),
                valid: false
            };
        }
    };

    return NextResponse.json({
        DATABASE_URL: cleanUrl(dbUrl),
        DIRECT_URL: cleanUrl(directUrl),
        NEXTAUTH_SECRET: !!process.env.AUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL
    });
}
