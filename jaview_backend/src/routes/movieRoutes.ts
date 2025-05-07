import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  addReviewController,
  getMovieReviewsController,
  getUserFeedController,
  removeReviewController
} from '../controller/movieController';

const router = Router();

router.post('/:movieId/reviews', authMiddleware, addReviewController);

router.delete(
  '/:movieId/reviews/:reviewId',
  authMiddleware,
  removeReviewController
);

router.get('/:movieId/reviews', getMovieReviewsController);

router.get('/feed', authMiddleware, getUserFeedController);

export default router;
