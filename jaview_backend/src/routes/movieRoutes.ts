import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { addReview, removeReview } from "../controller/movieController";

const router = Router();

router.post("/:movieId/reviews", authMiddleware as any, addReview as any);

router.delete(
  "/:movieId/reviews/:reviewId",
  authMiddleware as any,
  removeReview as any
);

export default router;
