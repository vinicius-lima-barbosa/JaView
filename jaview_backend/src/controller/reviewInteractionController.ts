import { Request, Response } from 'express';
import { Like, Comment } from '../models/reviewInteractionModel';

export const likeReviewController = async (req: Request, res: Response) => {
  try {
    const user_id = req.userId;
    const review_id = req.params.id;

    const like = new Like({ user_id, review_id });
    await like.save();

    res.status(201).json({ message: 'Review liked' });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'You already liked this review' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

export const unlikeReviewController = async (req: Request, res: Response) => {
  try {
    const user_id = req.userId;
    const review_id = req.params.id;

    await Like.findOneAndDelete({ user_id, review_id });
    res.status(200).json({ message: 'Review unliked' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const commentReviewController = async (req: Request, res: Response) => {
  try {
    const user_id = req.userId;
    const review_id = req.params.id;
    const { content } = req.body;

    const comment = new Comment({ user_id, review_id, content });
    await comment.save();

    res.status(201).json({ message: 'Comment added', comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCommentsController = async (req: Request, res: Response) => {
  try {
    const review_id = req.params.id;

    const comments = await Comment.find({ review_id })
      .populate('user_id', 'name')
      .sort({ created_at: -1 });

    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
