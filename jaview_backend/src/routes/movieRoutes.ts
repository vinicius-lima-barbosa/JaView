import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  addReviewController,
  getMovieReviewsController,
  removeReviewController,
} from "../controller/movieController";

const router = Router();

router.post(
  "/:movieId/reviews",
  authMiddleware as any,
  addReviewController as any
);

router.delete(
  "/:movieId/reviews/:reviewId",
  authMiddleware as any,
  removeReviewController as any
);

router.get("/:movieId/reviews", getMovieReviewsController as any);

export default router;
