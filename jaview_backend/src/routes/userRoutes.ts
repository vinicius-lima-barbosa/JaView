import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getUserReviews } from "../controller/userController";

const router = Router();

router.get("/reviews", authMiddleware as any, getUserReviews as any);

export default router;
