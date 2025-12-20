
// ============================================================================
// FILE: src/routes/course.routes.ts
// ============================================================================
import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createCourseSchema, updateCourseSchema } from '../validators/course.validator';

const router = Router();
const courseController = new CourseController();

router.get('/', optionalAuthMiddleware, courseController.getAllCourses);
router.get('/:id', optionalAuthMiddleware, courseController.getCourse);

router.post('/', authMiddleware, roleMiddleware(['admin']), validateBody(createCourseSchema), courseController.createCourse);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), validateBody(updateCourseSchema), courseController.updateCourse);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), courseController.deleteCourse);
router.post('/:id/modules', authMiddleware, roleMiddleware(['admin']), courseController.addModule);

export default router;