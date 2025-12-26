import { z } from 'zod';

export const updateHeartbeatSchema = z.object({
  timestamp: z.number().min(0)
});

export const markVideoCompletedSchema = z.object({
  // No body required usually, but we can ensure empty or specific flags if needed
});
