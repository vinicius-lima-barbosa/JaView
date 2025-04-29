import { Review } from './review-type';

export type User = {
  _id: string;
  name: string;
  bio?: string;
  email: string;
  avatar_url?: string;
  reviews: Review[];
};
