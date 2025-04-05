import { Request, Response } from 'express';
import {
  addReviewService,
  getMovieReviewsService,
  removeReviewService
} from '../services/movieService';

export const addReviewController = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { movieId } = request.params;
    const { review, rating } = request.body;
    const userId = request.userId;

    const result = await addReviewService(userId, movieId, review, rating);
    response.status(201).send(result);
  } catch (error) {
    response.status(500).send({
      message: `An error occurred while deleting the review! ${error.message}`
    });
  }
};

export const removeReviewController = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { movieId, reviewId } = request.params;
    const userId = request.userId;

    await removeReviewService(movieId, reviewId, userId);

    response.status(200).send({ message: 'Review deleted successfully!' });
  } catch (error) {
    response.status(500).send({
      message: `An error occurred while deleting the review! ${error.message}`
    });
  }
};

export const getMovieReviewsController = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { movieId } = request.params;

    const reviews = await getMovieReviewsService(movieId);

    response.status(200).send({ reviews });
  } catch (error) {
    response.status(500).send({
      message: `Error while fetching reviews! ${error.message}`
    });
  }
};
