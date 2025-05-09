import mongoose, { Schema } from 'mongoose';

const likeSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  review_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

likeSchema.index({ user_id: 1, review_id: 1 }, { unique: true });

const commentSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  review_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export const Like = mongoose.model('Like', likeSchema);
export const Comment = mongoose.model('Comment', commentSchema);
