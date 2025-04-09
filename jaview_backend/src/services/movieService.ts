import { Movie } from "../models/moviesModel";
import { User } from "../models/usersModel";

export const addReviewService = async (
  userId: string,
  movieId: string,
  review: string,
  rating: number
) => {
  let movie = await Movie.findById(movieId);

  if (movie) {
    const existingReview = movie.reviews.find(
      (review) => review.user_id.toString() === userId
    );
    if (existingReview) {
      throw new Error("You have already reviewed this movie.");
    }
  } else {
    movie = new Movie({ _id: movieId, reviews: [] });
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

  return { message: "Review added successfully!", movie };
};

export const removeReviewService = async (
  movieId: string,
  reviewId: string,
  userId: string
) => {
  const movie = await Movie.findById(movieId);

  if (!movie) {
    throw new Error("Movie not found");
  }

  const reviewIndexInMovie = movie.reviews.findIndex(
    (review) =>
      review._id.toString() === reviewId && review.user_id.toString() === userId
  );

  if (reviewIndexInMovie === -1) {
    throw new Error("Review not found for this movie");
  }

  movie.reviews.splice(reviewIndexInMovie, 1);
  await movie.save();

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const reviewIndexInUser = user.reviews.findIndex(
    (review) =>
      review.movie_id === movieId && review._id.toString() === reviewId
  );

  if (reviewIndexInUser === -1) {
    throw new Error("Review not found in user profile");
  }

  user.reviews.splice(reviewIndexInUser, 1);
  await user.save();
};

export const getMovieReviewsService = async (movieId: string) => {
  const movie = await Movie.findById(movieId).populate({
    path: "reviews.user_id",
    select: "name",
  });

  if (!movie) {
    return [];
  }

  return movie.reviews;
};
