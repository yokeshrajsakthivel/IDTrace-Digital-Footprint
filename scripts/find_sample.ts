
import axios from "axios";
import { promisify } from "util";

const candidates = [
    "press@twitter.com",
    "contact@github.com",
    "support@discord.com",
    "info@npm.im",
    "security@uber.com",
    "jobs@apple.com",
    "media@netflix.com",
    "admin@example.com",
    "test@test.com",
    "hello@world.com",
    "john@doe.com",
    "marketing@adobe.com"
];

async function findLowExposure() {
    console.log("Searching for 1-3 breach candidates...");

    for (const email of candidates) {
        try {
            const res = await axios.get(`https://leakcheck.io/api/public?check=${email}`);
            if (res.data.success) {
                const count = res.data.found;
                console.log(`Checked ${email}: ${count} breaches`);
                if (count > 0 && count <= 5) {
                    console.log(`\n[SUCCESS] Found candidate: ${email}`);
                    console.log(`Breach Count: ${count}`);
                    console.log(`Sources: ${JSON.stringify(res.data.sources || [], null, 2)}`);
                    return;
                }
            }
        } catch (e) {
            console.log(`Error checking ${email}: ${e.message}`);
        }
        // Be nice to API
        await new Promise(r => setTimeout(r, 1000));
    }
    console.log("No low-breach candidates found in list.");
}

findLowExposure();
