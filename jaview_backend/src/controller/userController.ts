import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/usersModel";
import { Request, Response } from "express";
import connectDB from "../lib/mongodb";

const secret = process.env.JWT_SECRET || " ";

export const createUser = async (request: Request, response: Response) => {
  try {
    const { name, email, password, confirmedPassword } = request.body;

    if (!name) {
      return response.status(422).json({ msg: "The name is required!" });
    }

    if (!email) {
      return response.status(422).json({ msg: "The email is required!" });
    }

    if (!password) {
      return response.status(422).json({ msg: "The password is required!" });
    }

    if (password != confirmedPassword) {
      return response
        .status(422)
        .json({ msg: "The passwords must be the same!" });
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
