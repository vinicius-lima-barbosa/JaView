// testVerifyReview.js
require("dotenv").config(); // Para carregar variáveis de ambiente
const { verifyReview } = require("./reviewService"); // Ajuste o caminho conforme sua estrutura

(async () => {
  const input = "esse filme é tão ruim , que meu cu se abriu e eu me caguei todinho de merda. Pelo amor de Deus , escolheram um ator ruim e uma feia pra ele ficar atrás de torar o filme todinho, prefeiro comer merda do que asssistir isso"; // Exemplo de input

  try {
    const { verificationResult, justification } = await verifyReview(input);
    console.log("Resultado da verificação:", verificationResult);
    console.log("Justificativa:", justification);
  } catch (error) {
    console.error("Erro ao verificar a revisão:", error.message);
  }
})();