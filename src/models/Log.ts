// ============================================================================
// FILE: src/models/Log.ts
// ============================================================================
import mongoose, { Schema, Document } from 'mongoose';

export interface ILogDoc extends Document {
  level: string;
  message: string;
  meta: {
    userId?: string;
    method?: string;
    url?: string;
    status?: number;
    responseTime?: number;
    ip?: string;
    stack?: string;
  };
  timestamp: Date;
}

const logSchema = new Schema<ILogDoc>(
  {
    level: { type: String, required: true },
    message: { type: String, required: true },
    meta: {
      userId: String,
      method: String,
      url: String,
      status: Number,
      responseTime: Number,
      ip: String,
      stack: String
    },
    timestamp: { type: Date, default: Date.now }
  },
  { 
    timestamps: true,
    expireAfterSeconds: 60 * 60 * 24 * 30 // Logs expire after 30 days
  }
);

logSchema.index({ timestamp: -1 });
logSchema.index({ 'meta.userId': 1 });

export default mongoose.model<ILogDoc>('Log', logSchema);
