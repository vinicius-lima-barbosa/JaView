import { Request, Response } from "express";
import {
  createUser,
  fetchUserProfile,
  fetchUserReviews,
  loginUser,
} from "../services/userService";

export const createUserController = async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmedPassword } = req.body;
    const result = await createUser(name, email, password, confirmedPassword);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserReviews = async (request: Request, response: Response) => {
  try {
    const userId = request.userId;
    const reviews = await fetchUserReviews(userId);

    return response.status(200).json({ reviews });
  } catch (error) {
    return response
      .status(500)
      .json({ message: `Error while fetching the reviews! ${error.message}` });
  }
};

export const getUserProfile = async (request: Request, response: Response) => {
  try {
    const userId = request.userId;
    const profile = await fetchUserProfile(userId);

    return response.status(200).json(profile);
  } catch (error) {
    return response
      .status(500)
      .json({ message: `Error while fetching user profile! ${error.message}` });
  }
};
