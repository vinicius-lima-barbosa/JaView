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
): void => {
  try {
    const { authorization } = request.headers;

    if (!authorization) {
      throw new jwt.TokenExpiredError('Token not provided', new Date());
    }

    const [, token] = authorization.split(' ');

    const decoded = jwt.verify(token, secret) as tokenPayload;
    const { id } = decoded;

    request.userId = id;

    next();
  } catch (error) {

    if (error instanceof jwt.TokenExpiredError) {
      response.status(401).json({
        message: error.message,
        error
      });
    } else {
      response.status(500).json({
        message: `Invalid token`,
        error
      });
    }
  }
};
