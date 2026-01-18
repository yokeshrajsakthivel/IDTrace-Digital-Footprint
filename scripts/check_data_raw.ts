
import axios from "axios";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execPromise = promisify(exec);
const LOG_FILE = path.join(__dirname, 'debug_data.txt');

function log(msg: string) {
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + '\n');
}

async function checkLeakCheck(email: string) {
    log(`\n--- Checking LeakCheck for ${email} ---`);
    try {
        const response = await axios.get(`https://leakcheck.io/api/public`, {
            params: { check: email }
        });
        log("Status: " + response.status);
        log("Data: " + JSON.stringify(response.data, null, 2));
    } catch (error: any) {
        log("LeakCheck Error: " + error.message);
    }
}

async function checkMaigret(username: string) {
    log(`\n--- Checking Maigret for ${username} ---`);
    const REPORT_FILE = `report_${username}_simple.json`;
    if (fs.existsSync(REPORT_FILE)) fs.unlinkSync(REPORT_FILE);

    try {
        const cmd = `maigret ${username} --json simple --top-sites 20`;
        log("Running: " + cmd);
        await execPromise(cmd);

        if (fs.existsSync(REPORT_FILE)) {
            const content = fs.readFileSync(REPORT_FILE, 'utf-8');
            log(`Report Found.`);
            const json = JSON.parse(content);
            const claimed = Object.entries(json.sites || {})
                .filter(([_, val]: [string, any]) => val.status === "CLAIMED")
                .map(c => c[0]);
            log("Claimed: " + JSON.stringify(claimed));
        } else {
            log("No report file generated.");
        }
    } catch (error: any) {
        log("Maigret Execution Error: " + error.message);
    }
}

async function main() {
    if (!fs.existsSync(LOG_FILE)) fs.writeFileSync(LOG_FILE, '');
    await checkLeakCheck("admin@gmail.com");
    // enable maigret check for pewdiepie
    await checkMaigret("pewdiepie");
}

main();
