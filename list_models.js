const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

async function listModels() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.list();
    console.log('Available models:');
    for await (const model of response) {
      console.log(`- ${model.name} (${model.displayName})`);
    }
  } catch (err) {
    console.error('Error listing models:', err.message);
  }
}

listModels();
