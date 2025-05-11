import { Request, Response } from 'express';
import { Like, Comment } from '../models/reviewInteractionModel';

export const likeReviewController = async (
  request: Request,
  response: Response
): Promise<void> => {
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
): Promise<void> => {
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
): Promise<void> => {
  try {
    const user_id = request.userId;
    const review_id = request.params.id;
    const { comment } = request.body;

    const newComment = new Comment({ user_id, review_id, comment });
    await newComment.save();

    response.status(201).json({ message: 'Comment added', comment });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const getCommentsController = async (
  request: Request,
  response: Response
): Promise<void> => {
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

export const getLikesController = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const review_id = request.params.id;

    const likes = await Like.countDocuments({ review_id });

    response.status(200).json({ review_id, likes });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const deleteCommentController = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const user_id = request.userId;
    const { reviewId, commentId } = request.params;

    const comment = await Comment.findOne({
      _id: commentId,
      review_id: reviewId
    });

    if (!comment) {
      response.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user_id.toString() !== user_id) {
      response
        .status(403)
        .json({ message: 'You can only delete your own comments' });
    }

    await Comment.findByIdAndDelete(commentId);
    response.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};
