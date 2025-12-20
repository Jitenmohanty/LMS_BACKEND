// ============================================================================
// FILE: src/validators/course.validator.ts
// ============================================================================
import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.number().min(0, 'Price must be positive'),
  category: z.string().min(2, 'Category is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  isFree: z.boolean().optional()
});

export const updateCourseSchema = createCourseSchema.partial();