const https = require('https');
const fs = require('fs');
const path = require('path');

// Try to load .env.local first, then .env
let apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
    const envPaths = ['.env.local', '.env'];
    for (const envPath of envPaths) {
        try {
            const content = fs.readFileSync(path.join(process.cwd(), envPath), 'utf8');
            const match = content.match(/GOOGLE_GENERATIVE_AI_API_KEY=["']?([^"'\n]+)["']?/);
            if (match) {
                apiKey = match[1];
                console.log(`Loaded key from ${envPath}`);
                break;
            }
        } catch (e) {
            // Ignore missing files
        }
    }
}

if (!apiKey) {
    console.error('Error: GOOGLE_GENERATIVE_AI_API_KEY not found in environment or .env files');
    process.exit(1);
}

// Mask key for logging
console.log(`Testing API Key: ${apiKey.substring(0, 8)}...`);

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}`);
        try {
            const json = JSON.parse(data);
            if (res.statusCode === 200) {
                console.log('Success! Writing full list to models.txt...');

                const models = json.models || [];
                // Sort for readability
                models.sort((a, b) => a.name.localeCompare(b.name));

                // Write detailed list to file
                const output = models.map(m => `Name: ${m.name}\nMethods: ${m.supportedGenerationMethods}\n`).join('\n---\n\n');
                fs.writeFileSync(path.join(__dirname, 'models.txt'), output);
                console.log('Done.');
            } else {
                console.error('API Error:', JSON.stringify(json, null, 2));
            }
        } catch (e) {
            console.error('Failed to parse response:', data);
        }
    });
}).on('error', (e) => {
    console.error('Request failed:', e.message);
});
