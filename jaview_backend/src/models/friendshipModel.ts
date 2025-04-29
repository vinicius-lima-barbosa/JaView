import mongoose, { Schema } from 'mongoose';

const friendshipSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  friend_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

friendshipSchema.pre('save', function (next) {
  this.updated_at = new Date(Date.now());
  next();
});

export const Friendship = mongoose.model('Friendship', friendshipSchema);
