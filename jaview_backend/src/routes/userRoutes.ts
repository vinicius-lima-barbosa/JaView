import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getUserProfile, getUserReviews } from "../controller/userController";

const router = Router();

router.get("/reviews", authMiddleware as any, getUserReviews as any);

router.get("/profile", authMiddleware as any, getUserProfile as any);

export default router;
