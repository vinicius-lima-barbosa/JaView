import { Friendship } from '../models/friendshipModel';

export const sendFriendRequestService = async (
  userId: string,
  friendId: string
) => {
  if (userId === friendId) {
    throw new Error('You can´t add yourself as a friend');
  }

  const existingFriendship = await Friendship.findOne({
    user_id: userId,
    friend_id: friendId
  });
  if (existingFriendship) {
    throw new Error('Friend request already sent');
  }

  const friendship = new Friendship({
    user_id: userId,
    friend_id: friendId,
    status: 'pending'
  });
  await friendship.save();

  return friendship;
};

export const acceptFriendRequestService = async (
  friendshipId: string,
  userId: string
) => {
  const friendship = await Friendship.findById(friendshipId);
  if (!friendship) {
    throw new Error('Friendship not found');
  }

  if (!friendship.friend_id.equals(userId)) {
    throw new Error('You are not authorized to accept this friend request');
  }

  friendship.status = 'accepted';
  await friendship.save();
  return friendship;
};

export const rejectFriendRequestService = async (
  friendshipId: string,
  userId: string
) => {
  const friendship = await Friendship.findById(friendshipId);
  if (!friendship) {
    throw new Error('Friendship not found');
  }
  if (!friendship.friend_id.equals(userId)) {
    throw new Error('You are not authorized to reject this friend request');
  }
  friendship.status = 'rejected';
  await friendship.save();
  return friendship;
};

export const removeFriendRequestService = async (
  friendshipId: string,
  userId: string
) => {
  const friendship = await Friendship.findById(friendshipId);
  if (!friendship) {
    throw new Error('Friendship not found');
  }

  const isParticipant =
    friendship.user_id.equals(userId) || friendship.friend_id.equals(userId);

  if (!isParticipant) {
    throw new Error('You are not authorized to remove this friend');
  }

  await Friendship.deleteOne({ _id: friendshipId });
  return { message: 'Friend removed successfully' };
};

export const listFriendsService = async (userId: string) => {
  const friendships = await Friendship.find({
    $or: [
      { user_id: userId, status: 'accepted' },
      { friend_id: userId, status: 'accepted' }
    ]
  }).populate('friend_id', 'name email avatar_url');

  return friendships;
};

export const listFriendsRequestsService = async (userId: string) => {
  const friendships = await Friendship.find({
    friend_id: userId,
    status: 'pending'
  }).populate('user_id', 'name email avatar_url');

  return friendships;
};

export const listFriendsRequestsSentService = async (userId: string) => {
  const friendships = await Friendship.find({
    user_id: userId,
    status: 'pending'
  }).populate('friend_id', 'name email avatar_url');

  return friendships;
};
