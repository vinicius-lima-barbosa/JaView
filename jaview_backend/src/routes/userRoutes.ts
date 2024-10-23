import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  getUserProfileController,
  getUserReviewsController,
} from "../controller/userController";

const router = Router();

router.get("/reviews", authMiddleware as any, getUserReviewsController as any);

router.get("/profile", authMiddleware as any, getUserProfileController as any);

export default router;
