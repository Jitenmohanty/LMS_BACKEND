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
  isFree: z.boolean().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional()
});

export const addModuleSchema = z.object({
  title: z.string().min(3, 'Module title must be at least 3 characters'),
  description: z.string().optional()
});

export const addVideoSchema = z.object({
  title: z.string().min(3, 'Video title must be at least 3 characters'),
  videoUrl: z.string().url('Invalid video URL').or(z.string().min(1, 'Video ID/URL is required')),
  description: z.string().optional(),
  duration: z.number().int().positive().optional(),
  isFree: z.boolean().optional()
});

export const updateCourseSchema = createCourseSchema.partial();

export const updateModuleSchema = z.object({
  title: z.string().min(3, 'Module title must be at least 3 characters').optional(),
  description: z.string().optional()
});

export const updateVideoSchema = z.object({
  title: z.string().min(3, 'Video title must be at least 3 characters').optional(),
  videoUrl: z.string().url('Invalid video URL').or(z.string().min(1, 'Video ID/URL is required')).optional(),
  description: z.string().optional(),
  duration: z.number().int().positive().optional(),
  isFreePreview: z.boolean().optional(),
  order: z.number().int().positive().optional()
});

export const reorderModulesSchema = z.object({
  moduleOrders: z.array(z.object({
    moduleId: z.string(),
    order: z.number().int().positive()
  })).min(1, 'At least one module order is required')
});

export const reorderVideosSchema = z.object({
  videoOrders: z.array(z.object({
    videoId: z.string(),
    order: z.number().int().positive()
  })).min(1, 'At least one video order is required')
});