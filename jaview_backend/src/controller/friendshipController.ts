import { Request, Response } from 'express';
import {
  acceptFriendRequestService,
  listFriendsRequestsService,
  listFriendsService,
  rejectFriendRequestService,
  removeFriendRequestService,
  sendFriendRequestService
} from '../services/friendshipService';

export const sendFriendRequestController = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { friendId } = request.body;
    const userId = request.userId;

    const friendship = await sendFriendRequestService(userId, friendId);
    response
      .status(201)
      .send({ message: 'Friend request sent successfully', friendship });
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
};

export const acceptFriendRequestController = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { friendshipId } = request.params;
    const userId = request.userId;

    const friendship = await acceptFriendRequestService(friendshipId, userId);
    response
      .status(200)
      .send({ message: 'Friend request accepted successfully', friendship });
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
};

export const rejectFriendRequestController = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { friendshipId } = request.params;
    const userId = request.userId;

    const friendship = await rejectFriendRequestService(friendshipId, userId);
    response
      .status(200)
      .send({ message: 'Friend request rejected successfully', friendship });
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
};

export const removeFriendController = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { friendshipId } = request.params;
    const userId = request.userId;

    await removeFriendRequestService(friendshipId, userId);
    response.status(200).send({ message: 'Friend removed successfully' });
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
};

export const listFriendsController = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const userId = request.userId;

    const friendships = await listFriendsService(userId);
    response.status(200).send({ friendships });
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
};

export const listFriendsRequestsController = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const userId = request.userId;

    const friendships = await listFriendsRequestsService(userId);
    response.status(200).send({ friendships });
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
};
