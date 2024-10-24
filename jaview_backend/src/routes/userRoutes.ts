import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  getUserByUsernameController,
  getUserProfileController,
  getUserReviewsController,
  updateUserProfileController,
} from "../controller/userController";

const router = Router();

router.get("/reviews", authMiddleware as any, getUserReviewsController as any);

router.get("/profile", authMiddleware as any, getUserProfileController as any);

router.get(
  "/search-user",
  authMiddleware as any,
  getUserByUsernameController as any
);

router.put(
  "/update-profile",
  authMiddleware as any,
  updateUserProfileController as any
);

export default router;
