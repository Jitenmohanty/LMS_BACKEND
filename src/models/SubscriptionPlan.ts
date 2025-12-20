// ============================================================================
// FILE: src/models/SubscriptionPlan.ts
// ============================================================================
import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriptionPlanDoc extends Document {
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  isActive: boolean;
  razorpayPlanId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionPlanSchema = new Schema<ISubscriptionPlanDoc>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    billingCycle: { type: String, enum: ['monthly', 'yearly'], required: true },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
    razorpayPlanId: String
  },
  { timestamps: true }
);

export default mongoose.model<ISubscriptionPlanDoc>('SubscriptionPlan', subscriptionPlanSchema);