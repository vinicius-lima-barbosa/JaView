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
        error: true,
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
      error: false,
      message: "User created!",
    });
  } catch (error) {
    return response.status(500).json({
      error: true,
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
