import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  commentReviewController,
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

export default router;
