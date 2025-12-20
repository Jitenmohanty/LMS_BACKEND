// ============================================================================
// FILE: src/models/User.ts
// ============================================================================
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUserDoc extends Document {
  email: string;
  password?: string;
  name: string;
  role: 'user' | 'instructor' | 'admin';
  avatar?: string;
  bio?: string;
  addresses: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }[];
  wishlist: mongoose.Types.ObjectId[];
  googleId?: string;
  refreshTokens: string[];
  isBlocked: boolean;
  purchasedCourses: mongoose.Types.ObjectId[];
  subscriptionPlan?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDoc>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false },
    name: { type: String, required: true },
    role: { type: String, enum: ['user', 'instructor', 'admin'], default: 'user' },
    avatar: String,
    bio: String,
    addresses: [
      {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
      }
    ],
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    googleId: String,
    refreshTokens: [{ type: String }],
    isBlocked: { type: Boolean, default: false },
    purchasedCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    subscriptionPlan: { type: Schema.Types.ObjectId, ref: 'SubscriptionPlan' }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUserDoc>('User', userSchema);