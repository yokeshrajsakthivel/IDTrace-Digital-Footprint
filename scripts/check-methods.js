const { streamText } = require('ai');
const { createGoogleGenerativeAI } = require('@ai-sdk/google');
require('dotenv').config({ path: '.env.local' });

async function checkMethods() {
    console.log('--- Checking streamText result methods ---');
    const google = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
    });

    try {
        const result = await streamText({
            model: google('gemini-flash-lite-latest'), // Use working model
            prompt: 'Hi',
        });

        console.log('Keys on result object:');
        console.log(Object.keys(result));

        console.log('toDataStreamResponse exists?', typeof result.toDataStreamResponse);

    } catch (e) {
        console.error(e);
    }
}

checkMethods();
