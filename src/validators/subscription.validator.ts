import { z } from 'zod';

export const createPlanSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  price: z.number().min(0),
  durationInDays: z.number().int().positive(),
  features: z.array(z.string()).optional()
});

export const updatePlanSchema = createPlanSchema.partial();
