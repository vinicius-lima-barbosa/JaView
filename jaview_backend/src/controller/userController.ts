import { Request, Response } from 'express';
import {
  createUserService,
  getUserByUsernameService,
  getUserProfileService,
  getUserReviewsService,
  loginUserService,
  updateUserProfileService
} from '../services/userService';

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
  try {
    const userId = request.userId;
    const { name, bio } = request.body;

    const newProfile = await updateUserProfileService(userId, name, bio);

    response.status(200).send(newProfile);
  } catch (error) {
    response.status(500).send({ message: error.message });
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
