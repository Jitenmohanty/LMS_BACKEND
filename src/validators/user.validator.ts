import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  addresses: z.array(z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional()
  })).optional()
});

export const addToWishlistSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required')
});
