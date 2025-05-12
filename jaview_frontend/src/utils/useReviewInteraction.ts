import { useState, useCallback, useEffect } from 'react';
import { CommentType } from '../types/commentType';

const API = import.meta.env.VITE_BACKEND;

export const useReviewInteraction = (reviewId: string) => {
  const [likes, setLikes] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const token = localStorage.getItem('token');

  const fetchInteractions = useCallback(async () => {
    if (!token) return;
    setLoading(true);

    const [likesResponse, commentsResponse] = await Promise.all([
      fetch(`${API}reviews/${reviewId}/likes`),
      fetch(`${API}reviews/${reviewId}/comments`)
    ]);

    const { likes: likesCount } = await likesResponse.json();
    const { comments: commentsList } = await commentsResponse.json();
    setLikes(likesCount);
    setComments(
      commentsList.map((comment: CommentType) => ({
        id: comment.id,
        user: comment.user,
        date: comment.date,
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
    await fetch(`${API}reviews/${reviewId}/likes`, {
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
    if (response.ok) {
      await fetchInteractions();
    }
  };

  return { likes, hasLiked, comments, loading, toggleLike, addComment };
};
