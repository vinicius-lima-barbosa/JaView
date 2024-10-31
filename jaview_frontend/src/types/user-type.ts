import { Review } from "./review-type";

export type User = {
  _id: string;
  name: string;
  bio?: string;
  email: string;
  reviews: Review[];
};
