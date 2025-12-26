import { z } from 'zod';

export const createBundleSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0),
  courses: z.array(z.string()).min(1, 'Select at least one course')
});

export const updateBundleSchema = createBundleSchema.partial();
