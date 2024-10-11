// geminiConfig.js
require('dotenv').config();

const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

const apiKey = "AIzaSyB-4d31pD2b31LbJaTaEA5PhOjoxH9QoTE";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `Você deve revisar as avaliações e identificar se elas contêm discursos discriminatórios contra minorias protegidas, como racismo, homofobia, transfobia, xenofobia ou qualquer outra forma de preconceito direcionado a grupos vulneráveis. Críticas fortes, palavras de baixo calão, ou descrições ofensivas sobre características genéricas, como aparência ou habilidades de uma pessoa, devem ser consideradas adequadas, desde que não discriminem minorias. True para adequada e false para ofensiva (Justifique o porque do "false")`,
});

const generationConfig = {
    temperature: 0,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
    responseSchema: {
      type: "object",
      properties: {
        response: {
          type: "boolean"
        },
        justify: {
          type: "string"
        }
      },
      required: [
        "response"
      ]
    },
  };  

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
  },
];

module.exports = {
  model,
  generationConfig,
  safetySettings
};
