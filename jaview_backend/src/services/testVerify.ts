// testVerifyReview.ts
import * as dotenv from "dotenv"; // Para carregar variáveis de ambiente
dotenv.config(); // Carregar as variáveis de ambiente

import { verifyReview } from "./reviewService"; // Ajuste o caminho conforme sua estrutura

(async () => {
  const input: string = "esse filme é tão ruim , que meu cu se abriu e eu me caguei todinho de merda. Pelo amor de Deus , escolheram um ator ruim e uma feia pra ele ficar atrás de torar o filme todinho, prefeiro comer merda do que asssistir isso"; // Exemplo de input

  try {
    const { verificationResult, justification }: { verificationResult: boolean; justification: string } = await verifyReview(input);
    console.log("Resultado da verificação:", verificationResult);
    console.log("Justificativa:", justification);
  } catch (error: any) {
    console.error("Erro ao verificar a revisão:", error.message);
  }
})();
