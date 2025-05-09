import { Request, Response } from 'express';
import { Like, Comment } from '../models/reviewInteractionModel';

export const likeReviewController = async (
  request: Request,
  response: Response
) => {
  try {
    const user_id = request.userId;
    const review_id = request.params.id;

    const like = new Like({ user_id, review_id });
    await like.save();

    response.status(201).json({ message: 'Review liked' });
  } catch (error) {
    if (error.code === 11000) {
      response.status(400).json({ message: 'You already liked this review' });
    } else {
      response.status(500).json({ message: error.message });
    }
  }
};

export const unlikeReviewController = async (
  request: Request,
  response: Response
) => {
  try {
    const user_id = request.userId;
    const review_id = request.params.id;

    await Like.findOneAndDelete({ user_id, review_id });
    response.status(200).json({ message: 'Review unliked' });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const commentReviewController = async (
  request: Request,
  response: Response
) => {
  try {
    const user_id = request.userId;
    const review_id = request.params.id;
    const { content } = request.body;

    const comment = new Comment({ user_id, review_id, content });
    await comment.save();

    response.status(201).json({ message: 'Comment added', comment });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const getCommentsController = async (
  request: Request,
  response: Response
) => {
  try {
    const review_id = request.params.id;

    const comments = await Comment.find({ review_id })
      .populate('user_id', 'name')
      .sort({ created_at: -1 });

    response.status(200).json({ comments });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};
