import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  acceptFriendRequestController,
  listFriendsController,
  listFriendsRequestsController,
  listFriendsRequestsSentController,
  rejectFriendRequestController,
  removeFriendController,
  sendFriendRequestController
} from '../controller/friendshipController';

const router = Router();

router.post('/send-request', authMiddleware, sendFriendRequestController);

router.put(
  '/:friendshipId/accept',
  authMiddleware,
  acceptFriendRequestController
);

router.put(
  '/:friendshipId/reject',
  authMiddleware,
  rejectFriendRequestController
);

router.delete('/:friendshipId/delete', authMiddleware, removeFriendController);

router.get('/friends', authMiddleware, listFriendsController);

router.get('/friends-requests', authMiddleware, listFriendsRequestsController);

router.get(
  '/friends-requests-sent',
  authMiddleware,
  listFriendsRequestsSentController
);

export default router;
