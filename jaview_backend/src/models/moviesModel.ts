import mongoose, { Schema } from "mongoose";

const reviewSchemaMovies = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const movieSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  reviews: [reviewSchemaMovies],
});

export const Movie = mongoose.model("Movie", movieSchema);
