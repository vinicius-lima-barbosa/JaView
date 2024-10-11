import { Movie } from "../models/moviesModel";
import { Response, Request } from "express";
import { User } from "../models/usersModel";
import { verifyReview } from "../services/reviewService"; // Importação do serviço de verificação

export const addReview = async (request: Request, response: Response) => {
  try {
    const { movieId } = request.params;
    const { review, rating } = request.body;
    const userId = request.userId;

    // Verificação da review pela IA
    const { verificationResult, justification } = await verifyReview(review);

    if (!verificationResult) {
      return response.status(400).json({
        error: true,
        message: "Review rejeitada: conteúdo ofensivo",
        justification: justification, // Justificativa do porque foi marcada como ofensiva
      });
    }

    // Continua o processo de salvar a avaliação
    let movie = await Movie.findById(movieId);

    if (!movie) {
      movie = new Movie({
        _id: movieId,
        reviews: [],
      });
    }

    const movieReview = {
      user_id: userId,
      review,
      rating,
      created_at: new Date(),
    };

    movie.reviews.push(movieReview);
    const savedMovie = await movie.save();

    const newReviewId = savedMovie.reviews[savedMovie.reviews.length - 1]._id;

    const user = await User.findById(userId);
    if (user) {
      const userReview = {
        movie_id: movieId,
        review,
        rating,
        created_at: new Date(),
        _id: newReviewId,
      };

      user.reviews.push(userReview);
      await user.save();
    }

    return response.status(201).json({
      error: false,
      message: "Review adicionada com sucesso!",
      movie,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Ocorreu um erro ao adicionar a avaliação!",
      error: error.message,
    });
  }
};
