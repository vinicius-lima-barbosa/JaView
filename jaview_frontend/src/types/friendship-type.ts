export type Friendship = {
  _id: string;
  user_id: {_id: string;};
  friend_id: {_id: string;};
  status: string;
  created_at: string;
  updated_at: string;
}