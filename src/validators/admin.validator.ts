import { z } from 'zod';

export const changeUserRoleSchema = z.object({
  role: z.enum(['user', 'instructor', 'admin'], {
    errorMap: () => ({ message: 'Role must be user, instructor, or admin' })
  })
});

export const grantCourseAccessSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  courseId: z.string().min(1, 'Course ID is required')
});

export const revokeCourseAccessSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  courseId: z.string().min(1, 'Course ID is required')
});
