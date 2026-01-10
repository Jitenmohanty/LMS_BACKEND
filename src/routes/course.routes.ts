import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { 
  createCourseSchema, 
  updateCourseSchema, 
  addModuleSchema, 
  addVideoSchema,
  updateModuleSchema,
  updateVideoSchema,
  reorderModulesSchema,
  reorderVideosSchema
} from '../validators/course.validator';

const router = Router();
const courseController = new CourseController();

// Public routes
router.get('/', optionalAuthMiddleware, courseController.getAllCourses);
router.get('/:id', optionalAuthMiddleware, courseController.getCourse);

// Course management (admin only)
router.post('/', authMiddleware, roleMiddleware(['admin']), validateBody(createCourseSchema), courseController.createCourse);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), validateBody(updateCourseSchema), courseController.updateCourse);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), courseController.deleteCourse);

// Module management (admin only)
router.post('/:id/modules', authMiddleware, roleMiddleware(['admin']), validateBody(addModuleSchema), courseController.addModule);
router.put('/:id/modules/:moduleId', authMiddleware, roleMiddleware(['admin']), validateBody(updateModuleSchema), courseController.updateModule);
router.delete('/:id/modules/:moduleId', authMiddleware, roleMiddleware(['admin']), courseController.deleteModule);
router.put('/:id/modules/reorder', authMiddleware, roleMiddleware(['admin']), validateBody(reorderModulesSchema), courseController.reorderModules);

// Video management (admin only)
router.post('/:id/modules/:moduleId/videos', authMiddleware, roleMiddleware(['admin']), validateBody(addVideoSchema), courseController.addVideo);
router.put('/:id/modules/:moduleId/videos/:videoId', authMiddleware, roleMiddleware(['admin']), validateBody(updateVideoSchema), courseController.updateVideo);
router.delete('/:id/modules/:moduleId/videos/:videoId', authMiddleware, roleMiddleware(['admin']), courseController.deleteVideo);
router.put('/:id/modules/:moduleId/videos/reorder', authMiddleware, roleMiddleware(['admin']), validateBody(reorderVideosSchema), courseController.reorderVideos);

export default router;