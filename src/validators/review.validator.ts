import { z } from 'zod';

export const addReviewSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, 'Comment must be at least 5 characters')
});

export const addReplySchema = z.object({
  reply: z.string().min(1, 'Reply cannot be empty')
});
