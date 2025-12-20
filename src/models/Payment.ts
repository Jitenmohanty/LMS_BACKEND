// ============================================================================
// FILE: src/models/Payment.ts
// ============================================================================
import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentDoc extends Document {
  user: mongoose.Types.ObjectId;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  itemType: 'course' | 'bundle' | 'subscription';
  itemId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPaymentDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: String,
    razorpaySignature: String,
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    itemType: { type: String, enum: ['course', 'bundle', 'subscription'], required: true },
    itemId: { type: Schema.Types.ObjectId, required: true, refPath: 'itemModel' }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

paymentSchema.virtual('itemModel').get(function () {
  if (this.itemType === 'course') return 'Course';
  if (this.itemType === 'subscription') return 'SubscriptionPlan';
  return 'Course'; // Default fallback
});

paymentSchema.virtual('item', {
  ref: (doc: any) => {
    if (doc.itemType === 'course') return 'Course';
    if (doc.itemType === 'subscription') return 'SubscriptionPlan';
    return 'Course';
  },
  localField: 'itemId',
  foreignField: '_id',
  justOne: true
});

export default mongoose.model<IPaymentDoc>('Payment', paymentSchema);