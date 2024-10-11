const { model, generationConfig, safetySettings } = require('../config/geminiConfig');

async function verifyReview(input) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
    });

    const result = await chatSession.sendMessage(input);

    // Acessa diretamente a resposta
    const verificationResult = result.response;  // Assume-se que a resposta já é um objeto
    const justification = result.justify;

    return { verificationResult, justification };
  } catch (error) {
    console.error("Erro ao verificar a review:", error);
    return { verificationResult: false, justification: "Erro ao processar a avaliação." };
  }
}

module.exports = {
  verifyReview,
};