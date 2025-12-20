// ============================================================================
// FILE: src/models/Course.ts
// ============================================================================
import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo {
  title: string;
  videoUrl: string;
  publicId: string;
  duration: number;
  isFreePreview: boolean;
  order: number;
}

export interface IModule {
  title: string;
  order: number;
  videos: IVideo[];
}

export interface ICourseDoc extends Document {
  title: string;
  description: string;
  thumbnail: string;
  banner: string;
  price: number;
  discountPrice?: number;
  instructor: mongoose.Types.ObjectId;
  category: string;
  tags: string[];
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  isFree: boolean;
  status: 'draft' | 'published';
  modules: IModule[];
  enrollmentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const videoSchema = new Schema<IVideo>({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  duration: { type: Number, required: true },
  isFreePreview: { type: Boolean, default: false },
  order: { type: Number, required: true }
});

const moduleSchema = new Schema<IModule>({
  title: { type: String, required: true },
  order: { type: Number, required: true },
  videos: [videoSchema]
});

const courseSchema = new Schema<ICourseDoc>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    banner: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: Number,
    instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    tags: [String],
    duration: { type: Number, required: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    rating: { type: Number, default: 0 },
    isFree: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    modules: [moduleSchema],
    enrollmentCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.model<ICourseDoc>('Course', courseSchema);