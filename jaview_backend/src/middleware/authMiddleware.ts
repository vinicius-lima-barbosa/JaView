import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || " ";

type tokenPayload = {
  id: string;
  iat: number;
  exp: number;
};

export const authMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { authorization } = request.headers;

  if (!authorization) {
    return response.status(401).json({
      error: "Token not provided!",
    });
  }

  const [, token] = authorization.split(" ");

  try {
    const decoded = jwt.verify(token, secret) as tokenPayload;
    const { id } = decoded;

    request.userId = id;

    next();
  } catch (error) {
    return response.status(500).json({
      message: `Invalid token!`,
    });
  }
};
