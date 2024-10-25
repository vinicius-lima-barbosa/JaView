import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/usersModel";
import { userSchemaZod } from "./userValidation";

const secret = process.env.JWT_SECRET || " ";

export const createUserService = async (
  name: string,
  email: string,
  password: string,
  confirmedPassword: string
) => {
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
    throw new Error(errorMessages.join(" "));
  }

  const nameExists = await User.find({ name });
  if (nameExists) throw new Error("Name already exists");

  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("User already exists!");

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  const token = jwt.sign({ id: newUser._id, email: newUser.email }, secret, {
    expiresIn: "1d",
  });
  return { token, message: "User created!" };
};

export const loginUserService = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found!");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("Invalid credentials!");

  const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1d" });
  return { token, message: "Successful Login!" };
};

export const getUserReviewsService = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user.reviews;
};

export const getUserProfileService = async (userId: string) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return {
    name: user.name,
    email: user.email,
  };
};

export const updateUserProfileService = async (
  userId: string,
  name: string
) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { name },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return {
    name: updatedUser.name,
    email: updatedUser.email,
  };
};

export const getUserByUsernameService = async (username: string) => {
  const users = await User.find({
    name: { $regex: username, $options: "i" },
  }).select("-password");

  if (!users) {
    throw new Error("User not found");
  }

  return users || [];
};
