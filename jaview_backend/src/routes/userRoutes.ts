import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  getUserByUsernameController,
  getUserProfileController,
  getUserReviewsController,
  updateUserProfileController
} from '../controller/userController';

const router = Router();

router.get('/reviews', authMiddleware, getUserReviewsController);

router.get('/profile', authMiddleware, getUserProfileController);

router.get('/search-user', getUserByUsernameController);

router.put(
  '/update-profile',
  authMiddleware,
  updateUserProfileController
);

export default router;
