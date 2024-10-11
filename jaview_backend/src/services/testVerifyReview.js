// testVerifyReview.js
require("dotenv").config(); // Para carregar variáveis de ambiente
const { verifyReview } = require("./reviewService"); // Ajuste o caminho conforme sua estrutura

(async () => {
  const input = "Filmaço do caralho, belissimo, uma obra prima"; // Exemplo de input

  try {
    const { verificationResult, justification } = await verifyReview(input);
    console.log("Resultado da verificação:", verificationResult);
    console.log("Justificativa:", justification);
  } catch (error) {
    console.error("Erro ao verificar a revisão:", error.message);
  }
})();
