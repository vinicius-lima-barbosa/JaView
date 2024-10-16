import { Movie } from "../models/moviesModel";
import { Response, Request } from "express";
import { User } from "../models/usersModel";

export const addReview = async (request: Request, response: Response) => {
  try {
    const { movieId } = request.params;
    const { review, rating } = request.body;
    const userId = request.userId;

    let movie = await Movie.findById(movieId);

    if (movie) {
      const existingReview = movie.reviews.find(
        (r: any) => r.user_id.toString() === userId
      );

      if (existingReview) {
        return response.status(403).json({
          message: "You have already reviewed this movie.",
        });
      }
    } else {
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
      message: "Review added succesfully!",
      movie,
    });
  } catch (error) {
    return response.status(500).json({
      message: "An error occurred while adding the review!",
    });
  }
};

export const removeReview = async (request: Request, response: Response) => {
  try {
    // Movie

    const { movieId, reviewId } = request.params;
    const userId = request.userId;

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return response.status(404).json({
        message: "Movie not found!",
      });
    }

    const reviewIdInMovie = movie.reviews.findIndex(
      (review) =>
        review._id.toString() === reviewId &&
        review.user_id.toString() === userId
    );
    if (reviewIdInMovie === -1) {
      return response
        .status(404)
        .json({ message: "Review not found for this movie!" });
    }

    movie.reviews.splice(reviewIdInMovie, 1);
    await movie.save();

    // User

    const user = await User.findById(userId);
    const reviewIdInUser = user.reviews.findIndex(
      (review) =>
        review.movie_id === movieId && review._id.toString() === reviewId
    );
    if (reviewIdInUser === -1) {
      return response
        .status(404)
        .json({ message: "Review not found for this movie!" });
    }

    user.reviews.splice(reviewIdInUser, 1);
    await user.save();

    return response
      .status(200)
      .json({ message: "Review deleted successfully!" });
  } catch (error) {
    return response.status(500).json({
      message: "An error occurred while deleting the review!",
    });
  }
};
