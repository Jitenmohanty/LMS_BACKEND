// ============================================================================
// FILE: src/models/Review.ts
// ============================================================================
import mongoose, { Schema, Document } from 'mongoose';

export interface IReviewDoc extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  reply?: string;
  replyAt?: Date;
  isReplied: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReviewDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    reply: { type: String },
    replyAt: { type: Date },
    isReplied: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Prevent multiple reviews from same user on same course
reviewSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model<IReviewDoc>('Review', reviewSchema);
