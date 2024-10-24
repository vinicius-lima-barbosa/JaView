import { Request, Response } from "express";
import {
  createUserService,
  getUserProfileService,
  getUserReviewsService,
  loginUserService,
  updateUserProfileService,
} from "../services/userService";

export const createUserController = async (
  request: Request,
  response: Response
) => {
  try {
    const { name, email, password, confirmedPassword } = request.body;
    const result = await createUserService(
      name,
      email,
      password,
      confirmedPassword
    );
    return response.status(201).json(result);
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
};

export const loginUserController = async (
  request: Request,
  response: Response
) => {
  try {
    const { email, password } = request.body;
    const result = await loginUserService(email, password);
    return response.status(200).json(result);
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
};

export const getUserReviewsController = async (
  request: Request,
  response: Response
) => {
  try {
    const userId = request.userId;
    const reviews = await getUserReviewsService(userId);

    return response.status(200).json({ reviews });
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
};

export const getUserProfileController = async (
  request: Request,
  response: Response
) => {
  try {
    const userId = request.userId;
    const profile = await getUserProfileService(userId);

    return response.status(200).json(profile);
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
};

export const updateUserProfileController = async (
  request: Request,
  response: Response
) => {
  try {
    const userId = request.userId;
    const { name } = request.body;

    const newProfile = await updateUserProfileService(userId, name);

    return response.status(200).json(newProfile);
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
};
