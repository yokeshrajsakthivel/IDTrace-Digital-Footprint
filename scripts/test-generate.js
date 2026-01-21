const { createGoogleGenerativeAI } = require('@ai-sdk/google');
const { generateText } = require('ai');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function testGeneration() {
    console.log('--- IDTrace AI Generation Test ---');

    // 1. Load API Key
    let apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
        // Fallback to reading file manually if dotenv fails (sometimes issues in these environments)
        try {
            const content = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
            const match = content.match(/GOOGLE_GENERATIVE_AI_API_KEY=["']?([^"'\n]+)["']?/);
            if (match) apiKey = match[1];
        } catch (e) { }
    }

    if (!apiKey) {
        console.error('❌ Error: API Key not found.');
        return;
    }
    console.log('✅ API Key loaded');

    // 2. Configure Provider
    const google = createGoogleGenerativeAI({
        apiKey: apiKey
    });

    // 3. Select Model (Must match lib/ai.ts)
    const modelName = 'gemini-2.0-flash';
    console.log(`Testing Model: ${modelName}`);
    const model = google(modelName);

    // 4. Test Generation
    try {
        console.log('Sending prompt: "Hello, are you online?"...');
        const result = await generateText({
            model: model,
            prompt: 'Hello, are you online?',
        });

        console.log('✅ Generation Success!');
        console.log('Response:', result.text);
    } catch (error) {
        console.error('❌ Generation Failed:');
        console.error(error);
        if (error.message.includes('404')) {
            console.log('\nHint: The model might not be available for this API key/region.');
        }
    }
}

testGeneration();
