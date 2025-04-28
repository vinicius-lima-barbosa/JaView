import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  getUserByUsernameController,
  getUserProfileController,
  getUserReviewsController,
  updateUserProfileController,
  uploadUserAvatarContoller
} from '../controller/userController';

const upload = multer({});
const router = Router();

router.get('/reviews', authMiddleware, getUserReviewsController);

router.get('/profile', authMiddleware, getUserProfileController);

router.get('/search-user', getUserByUsernameController);

router.put('/update-profile', authMiddleware, updateUserProfileController);

router.post(
  '/upload-avatar',
  upload.single('avatar'),
  authMiddleware,
  uploadUserAvatarContoller
);

export default router;
