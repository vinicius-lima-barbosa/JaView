import { Movie } from "./movie-type";

export type Review = {
  _id: string;
  user_id: {
    name: string;
  };
  movie_id: string;
  review: string;
  rating: number;
  created_at: string;
  movie?: Movie;
};
