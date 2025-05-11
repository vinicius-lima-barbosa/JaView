import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  commentReviewController,
  deleteCommentController,
  getCommentsController,
  getLikesController,
  likeReviewController,
  unlikeReviewController
} from '../controller/reviewInteractionController';

const router = express.Router();

router.get('/:id/comments', authMiddleware, getCommentsController);
router.post('/:id/comments', authMiddleware, commentReviewController);
router.delete(
  '/:id/comments/:commentId',
  authMiddleware,
  unlikeReviewController
);
router.post('/:id/like', authMiddleware, likeReviewController);
router.get('/:id/likes', authMiddleware, getLikesController);
router.delete(
  '/:reviewId/comments/:commentId',
  authMiddleware,
  deleteCommentController
);

export default router;
