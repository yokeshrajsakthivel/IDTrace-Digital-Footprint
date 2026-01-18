
import dotenv from 'dotenv';
import path from 'path';
import axios from 'axios';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const execPromise = promisify(exec);
const logFile = path.resolve(process.cwd(), 'scripts', 'debug_output.txt');
fs.writeFileSync(logFile, ''); // Clear file

function log(message: string) {
    console.log(message);
    fs.appendFileSync(logFile, message + '\n');
}

log("=== ADAPTER DIAGNOSTIC TOOL (FULL) ===");

async function testLeakCheck() {
    log("\n[1/4] Testing LeakCheck PUBLIC Adapter...");
    try {
        log(`Connecting to LeakCheck PUBLIC API...`);
        const response = await axios.get(`https://leakcheck.io/api/public`, {
            params: { check: "test@example.com" }
        });

        if (response.data && response.data.success) {
            log("✅ LEAKCHECK PUBLIC SUCCESS: Connection established.");
        } else {
            log("❌ LEAKCHECK PUBLIC FAILED: API responded with success=false");
            log(JSON.stringify(response.data));
        }
    } catch (error: any) {
        log("❌ LEAKCHECK PUBLIC ERROR: HTTP Request failed");
        log(error.message);
    }
}

async function testIntelX() {
    log("\n[2/4] Skipping IntelX (Failed Key)...");
}

async function testMaigret() {
    log("\n[3/4] Maigret verified via file system already.");
}

async function testDeHashed() {
    log("\n[4/4] Testing DeHashed Adapter...");
    const apiKey = process.env.DEHASHED_API_KEY;
    const emailUser = process.env.DEHASHED_USER || "api_user"; // Default if missing

    if (!apiKey) {
        log("❌ SKIPPED: DEHASHED_API_KEY is missing");
        return;
    }

    try {
        log(`Connecting to DeHashed API with user: ${emailUser}...`);

        const response = await axios.get("https://api.dehashed.com/search", {
            params: { query: `email:"test@example.com"` },
            headers: { "Accept": "application/json" },
            auth: {
                username: emailUser,
                password: apiKey
            }
        });

        if (response.data.success) {
            log("✅ DEHASHED SUCCESS: Connection established.");
            log(`Found: ${response.data.entries ? response.data.entries.length : 0} entries.`);
        } else {
            log("❌ DEHASHED FAILED: API responded success=false");
            log(JSON.stringify(response.data));
        }

    } catch (error: any) {
        log("❌ DEHASHED ERROR: HTTP Request failed");
        if (error.response) {
            log(`Status: ${error.response.status}`);
            log(`Data: ${JSON.stringify(error.response.data)}`);
        } else {
            log(error.message);
        }
    }
}

async function main() {
    await testLeakCheck();
    await testIntelX();
    await testMaigret();
    await testDeHashed();
    log("\n=== DIAGNOSIS COMPLETE ===");
}

main();
