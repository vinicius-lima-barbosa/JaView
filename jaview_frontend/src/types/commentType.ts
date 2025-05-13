export type CommentType = {
  _id: string;
  user_id: { _id: string; name: string };
  comment: string;
  created_at: string;
};
