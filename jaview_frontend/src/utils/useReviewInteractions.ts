import { useState, useCallback, useEffect } from 'react';
import { CommentType } from '../types/commentType';

const API = import.meta.env.VITE_BACKEND;

export const useReviewInteractions = (reviewId: string) => {
  const [likes, setLikes] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const token = localStorage.getItem('token');

  const fetchInteractions = useCallback(async () => {
    if (!token) return;
    setLoading(true);

    const [likesResponse, commentsResponse] = await Promise.all([
      fetch(`${API}reviews/${reviewId}/likes`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
      fetch(`${API}reviews/${reviewId}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    ]);

    const { likes: likesCount, hasLiked: userLiked } =
      await likesResponse.json();
    const { comments: commentsList } = await commentsResponse.json();
    setLikes(likesCount);
    setHasLiked(Boolean(userLiked));
    setComments(
      commentsList.map((comment: CommentType) => ({
        _id: comment._id,
        user_id: {
          _id: comment.user_id._id,
          name: comment.user_id.name
        },
        date: new Date(comment.created_at).toLocaleString(),
        comment: comment.comment
      }))
    );
    setLoading(false);
  }, [reviewId, token]);

  useEffect(() => {
    fetchInteractions();
  }, [fetchInteractions]);

  const toggleLike = async () => {
    if (!token) return;
    const method = hasLiked ? 'DELETE' : 'POST';
    await fetch(`${API}reviews/${reviewId}/like`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setLikes((prev) => (hasLiked ? prev - 1 : prev + 1));
    setHasLiked((prev) => !prev);
  };

  const addComment = async (comment: string) => {
    if (!token) return;
    const response = await fetch(`${API}reviews/${reviewId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ comment })
    });
    if (response.ok) await fetchInteractions();
  };

  const deleteComment = async (commentId: string) => {
    if (!token) return;

    const response = await fetch(
      `${API}reviews/${reviewId}/comments/${commentId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    if (response.ok) fetchInteractions();
  };

  return {
    likes,
    hasLiked,
    comments,
    loading,
    toggleLike,
    addComment,
    deleteComment
  };
};
