// src/lib/gemini.ts

require('dotenv').config();
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

const apiKey = "AIzaSyB-4d31pD2b31LbJaTaEA5PhOjoxH9QoTE"
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "Você precisa verificar se as reviews feitas pelos usuarios são extremamente ofensivas ou não (se for ofensiva tudo bem, não sendo extremamente, desde que não ofenda minorias é tudo permitido) e assim retornar o json com true ou false, true para adequada e false para ofensiva.",
});

const safetySettings = [
    {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
    }
];

const generationConfig = {
  temperature: 0,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema: {
    type: "object",
    properties: {
      verification: {
        type: "boolean",
      },
    },
    required: ["verification"],
  },
};

async function validateReview(reviewText: string) {
  const chatSession = model.startChat({
    generationConfig,
    safetySettings,
  });

  const result = await chatSession.sendMessage(reviewText);
  const responseText = await result.response.text();
  const jsonResponse = JSON.parse(responseText);

  return jsonResponse.verification;  // true (adequada) ou false (ofensiva)
}

module.exports = validateReview;
