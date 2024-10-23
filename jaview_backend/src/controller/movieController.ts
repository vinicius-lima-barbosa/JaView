import { Request, Response } from "express";
import {
  addReviewService,
  getMovieReviewsService,
  removeReviewService,
} from "../services/movieService";

export const addReviewController = async (req: Request, res: Response) => {
  try {
    const { movieId } = req.params;
    const { review, rating } = req.body;
    const userId = req.userId;

    const result = await addReviewService(userId, movieId, review, rating);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const removeReviewController = async (
  request: Request,
  response: Response
) => {
  try {
    const { movieId, reviewId } = request.params;
    const userId = request.userId;

    await removeReviewService(movieId, reviewId, userId);

    return response
      .status(200)
      .json({ message: "Review deleted successfully!" });
  } catch (error) {
    return response.status(500).json({
      message: `An error occurred while deleting the review! ${error.message}`,
    });
  }
};

export const getMovieReviewsController = async (
  request: Request,
  response: Response
) => {
  try {
    const { movieId } = request.params;

    const reviews = await getMovieReviewsService(movieId);

    return response.status(200).json({ reviews });
  } catch (error) {
    return response.status(500).json({
      message: `Error while fetching reviews! ${error.message}`,
    });
  }
};
