// ============================================================================
// FILE: src/models/Progress.ts
// ============================================================================
import mongoose, { Schema, Document } from 'mongoose';

export interface IProgressDoc extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  completedVideos: string[];
  lastWatchedVideo?: string;
  progressPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

const progressSchema = new Schema<IProgressDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    completedVideos: [{ type: String }],
    lastWatchedVideo: String,
    progressPercentage: { type: Number, default: 0 }
  },
  { timestamps: true }
);

progressSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model<IProgressDoc>('Progress', progressSchema);