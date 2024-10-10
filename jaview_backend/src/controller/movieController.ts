import { Movie } from "../models/moviesModel";
import connectDB from "../lib/mongodb";
import { Response, Request } from "express";
import { User } from "../models/usersModel";
import { isReviewValid } from "../services/reviewService";


export const addReview = async (request: Request, response: Response) => {
  try {
    const { movieId } = request.params;
    const { review, rating } = request.body;
    const userId = request.userId;

    // Validação da review usando o Gemini
    const isValid = await isReviewValid(review);
    if (!isValid) {
      return response.status(400).json({
        error: true,
        message: "Review considerada ofensiva e não foi aceita.",
      });
    }
    
    let movie = await Movie.findById(movieId);

    if (!movie) {
      movie = new Movie({
        _id: movieId,
        title: `Simulated title for ${movieId}`,
        poster_url: `https://example.com/poster/${movieId}.jpg`,
        genre: "Simulated genre",
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
    await movie.save();

    const user = await User.findById(userId);
    if (user) {
      const userReview = {
        movie_id: movieId,
        review,
        rating,
        created_at: new Date(),
      };

      user.reviews.push(userReview);
      await user.save();
    }

    return response.status(201).json({
      error: false,
      message: "Review added succesfully!",
      movie,
    });
  } catch (error) {
    return response.status(500).json({
      message: "An error occurred while adding the review!",
      error: error.message,
    });
  }
};
