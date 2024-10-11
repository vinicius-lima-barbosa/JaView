// reviewService.js
const { model, generationConfig, safetySettings } = require("../lib/gemini");

async function verifyReview(input) {
  const chatSession = model.startChat({
    generationConfig,
    safetySettings,
  });

  const result = await chatSession.sendMessage(input);

  // Faz o parse da resposta como JSON
  const responseText = await result.response.text(); // Obtem a resposta em string
  const jsonResponse = JSON.parse(responseText); // Converte a string em objeto JSON

  // Acessa os campos 'response' e 'justify' e guarda os valores
  const verificationResult = jsonResponse.response;
  const justification = jsonResponse.justify;

  // Log dos resultados
  //console.log("O valor da verificação é:", verificationResult);
  //console.log("Justificativa:", justification);

  return { verificationResult, justification };
}

module.exports = { verifyReview };
