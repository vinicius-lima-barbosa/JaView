import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/usersModel";
import { Request, Response } from "express";
import connectDB from "../lib/mongodb";
import { userSchemaZod } from "../services/userValidation";

const secret = process.env.JWT_SECRET || " ";

export const createUser = async (request: Request, response: Response) => {
  try {
    const { name, email, password, confirmedPassword } = request.body;

    const validationResult = userSchemaZod.safeParse({
      name,
      email,
      password,
      confirmedPassword,
    });

    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors.map(
        (err) => err.message
      );
      return response.status(422).json({ msg: errorMessages.join(" ") });
    }

    const userExists = await User.findOne({
      email,
    });

    await connectDB();

    if (userExists) {
      return response.status(400).json({
        message: "User already exists!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return response.status(201).json({
      message: "User created!",
    });
  } catch (error) {
    return response.status(500).json({
      message: `Error while register: ${error}`,
    });
  }
};

export const loginUser = async (request: Request, response: Response) => {
  try {
    const { email, password } = request.body;

    const user = await User.findOne({ email });

    if (!user) {
      return response.status(404).json({
        message: "User not found!",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return response.status(400).json({
        message: "Invalid credentials!",
      });
    }

    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1d" });

    return response.status(200).json({
      token,
      message: "Successful Login!",
    });
  } catch (error) {
    return response.status(500).json({
      message: `Error while logging: ${error}`,
    });
  }
};

export const getUserReviews = async (request: Request, response: Response) => {
  try {
    const userId = request.userId;
    const user = await User.findById(userId);

    if (!user) {
      return response.status(404).json({
        message: "User not found!",
      });
    }

    const reviews = user.reviews;

    return response.status(200).json({
      reviews,
    });
  } catch (error) {
    return response.status(500).json({
      message: `Error while fetching the movies! ${error}`,
    });
  }
};

export const getUserProfile = async (request: Request, response: Response) => {
  try {
    const userId = request.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return response.status(404).json({ message: "User not found!" });
    }

    return response.status(200).json({
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return response.status(500).json({
      message: `Error while fetching user profile! ${error}`,
    });
  }
};
