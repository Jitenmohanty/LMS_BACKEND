// ============================================================================
// FILE: src/models/Bundle.ts
// ============================================================================
import mongoose, { Schema, Document } from 'mongoose';

export interface IBundleDoc extends Document {
  title: string;
  description: string;
  thumbnail: string;
  courses: mongoose.Types.ObjectId[];
  price: number;
  discountPrice?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bundleSchema = new Schema<IBundleDoc>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course', required: true }],
    price: { type: Number, required: true },
    discountPrice: Number,
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model<IBundleDoc>('Bundle', bundleSchema);
