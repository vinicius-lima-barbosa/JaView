import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { addReview } from "../controller/movieController";

const router = Router();

router.post("/:movieId/reviews", authMiddleware as any, addReview as any);

export default router;
