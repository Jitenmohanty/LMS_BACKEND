import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificateDoc extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  certificateId: string;
  issueDate: Date;
  completedAt: Date;
}

const certificateSchema = new Schema<ICertificateDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    certificateId: { type: String, required: true, unique: true },
    issueDate: { type: Date, default: Date.now },
    completedAt: { type: Date, required: true }
  },
  { timestamps: true }
);

certificateSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model<ICertificateDoc>('Certificate', certificateSchema);
