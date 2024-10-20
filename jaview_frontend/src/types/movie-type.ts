export type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  runtime?: number;
  overview?: string;
};
