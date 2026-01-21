const { createGoogleGenerativeAI } = require('@ai-sdk/google');
const { generateText } = require('ai');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function findWorkingModel() {
    console.log('--- Finding Working Model ---');

    let apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
        try {
            const content = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
            const match = content.match(/GOOGLE_GENERATIVE_AI_API_KEY=["']?([^"'\n]+)["']?/);
            if (match) apiKey = match[1];
        } catch (e) { }
    }

    if (!apiKey) {
        console.error('No API Key.');
        return;
    }

    const google = createGoogleGenerativeAI({ apiKey });

    const candidates = [
        'gemini-1.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-pro',
        'gemini-pro',
        'gemini-flash-latest'
    ];

    for (const modelName of candidates) {
        console.log(`Testing: ${modelName}...`);
        try {
            const model = google(modelName);
            await generateText({
                model: model,
                prompt: 'Hi',
            });
            console.log(`SUCCESS: ${modelName}`);
            // Write to file for me to read
            fs.writeFileSync('working-model.txt', modelName);
            return;
        } catch (e) {
            console.log(`FAILED: ${modelName} - ${e.message ? e.message.substring(0, 100) : 'Unknown Error'}`);
        }
    }
    console.log('All models failed.');
}

findWorkingModel();
