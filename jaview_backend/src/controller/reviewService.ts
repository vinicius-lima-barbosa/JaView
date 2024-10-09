// src/controller/reviewService.ts

const validateReview = require('../lib/gemini');

export const isReviewValid = async (review: string): Promise<boolean> => {
  try {
    const verification = await validateReview(review);
    return verification;
  } catch (error) {
    console.error("Erro ao validar a review:", error);
    return false;  // Caso ocorra erro, por padrão, considerar ofensiva
  }
};
