import { Request, Response } from 'express';
import { clientS3 } from '../lib/client.supabase';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import {
  createUserService,
  getUserByUsernameService,
  getUserProfileService,
  getUserReviewsService,
  loginUserService
} from '../services/userService';
import { User } from '../models/usersModel';

type ProfileUpdate = {
  name?: string;
  bio?: string;
  avatar_url?: string;
};

export const createUserController = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { name, email, password, confirmedPassword } = request.body;
    const result = await createUserService(
      name,
      email,
      password,
      confirmedPassword
    );
    response.status(201).send(result);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const loginUserController = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { email, password } = request.body;
    const result = await loginUserService(email, password);
    response.status(200).send(result);
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
};

export const getUserReviewsController = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const userId = request.userId;
    const reviews = await getUserReviewsService(userId);

    response.status(200).send({ reviews });
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
};

export const getUserProfileController = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const userId = request.userId;
    const profile = await getUserProfileService(userId);

    response.status(200).send(profile);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
};

export const updateUserProfileController = async (
  request: Request,
  response: Response
): Promise<void> => {
  const userId = request.userId as string;
  const { name, bio } = request.body;

  let avatar_url: string | undefined;
  if (request.file) {
    const existing = await getUserProfileService(userId);
    if (existing?.avatar_url) {
      const key = existing.avatar_url.split('avatar/')[1];
      const deletePdfObjectCommand = new DeleteObjectCommand({
        Bucket: 'avatar',
        Key: key
      });

      await clientS3.send(deletePdfObjectCommand);
    }
    const new_avatar_url_filename = randomUUID();

    const putObjectCommand = new PutObjectCommand({
      Bucket: 'avatar',
      Key: new_avatar_url_filename,
      Body: request.file.buffer,
      ContentType: request.file.mimetype
    });

    await clientS3.send(putObjectCommand);

    avatar_url = `${process.env.ENDPOINT_URL}/storage/v1/object/public/avatar/${new_avatar_url_filename}`;
  }

  const updateData: Partial<
    Pick<ProfileUpdate, 'name' | 'bio' | 'avatar_url'>
  > = {};
  if (name) updateData.name = name;
  updateData.bio = bio ? bio : '';
  if (avatar_url) updateData.avatar_url = avatar_url;

  if (name) {
    const nameTaken = await User.findOne({ name, _id: { $ne: userId } });
    if (nameTaken) {
      response.status(400).json({ message: 'Name already exists' });
      return;
    }
  }

  try {
    const updated = await User.findByIdAndUpdate(userId, updateData, {
      new: true
    }).select('-password');

    if (!updated) {
      response.status(404).json({ message: 'User not found' });
      return;
    }

    response.status(200).json({
      name: updated.name,
      email: updated.email,
      bio: updated.bio,
      avatar_url: updated.avatar_url
    });
  } catch (err) {
    response.status(500).json({ message: err.message });
    return;
  }
};

export const getUserByUsernameController = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { username } = request.query;

    const users = await getUserByUsernameService(username as string);

    response.status(200).send({ users });
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
};
