// ============================================================================
// FILE: src/controllers/course.controller.ts
// ============================================================================
import { Response } from 'express';
import { AuthRequest } from '../types';
import { CourseService } from '../services/course.service';
import { ApiResponse } from '../utils/apiResponse';

const courseService = new CourseService();

export class CourseController {
  async createCourse(req: AuthRequest, res: Response) {
    try {
      const course = await courseService.createCourse(req.body, req.user!._id, req.user!.role);
      ApiResponse.success(res, { course }, 'Course created successfully', 201);
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }

  async getAllCourses(req: AuthRequest, res: Response) {
    try {
      const filters: any = {
        category: req.query.category,
        level: req.query.level,
        isFree: req.query.isFree === 'true' ? true : req.query.isFree === 'false' ? false : undefined,
        status: req.query.status
      };

      const user = req.user;
      const isAdmin = user && user.role === 'admin';

      if (!isAdmin) {
        filters.status = 'published';
      } else if (!req.query.status) {
        // If admin and no status specified, show all (ignore default published)
        filters.ignoreStatusDefault = true;
      }
      const courses = await courseService.getAllCourses(filters);

      // Inject isEnrolled status
      const coursesWithStatus = courses.map((course: any) => {
        let isEnrolled = false;
        
        // DEBUG LOGGING
        // console.log('Checking Course:', course.title, course._id.toString());
        if (req.user) {
           // console.log('User found:', req.user._id);
           // console.log('User Purchased:', req.user.purchasedCourses);
           if (req.user.purchasedCourses) {
             const userIdString = req.user.purchasedCourses.map((id: any) => id.toString());
             isEnrolled = userIdString.includes(course._id.toString());
           }
        }
        
        return { ...course.toObject(), isEnrolled };
      });

      ApiResponse.success(res, { courses: coursesWithStatus }, 'Courses retrieved successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message);
    }
  }

  async getCourse(req: AuthRequest, res: Response) {
    try {
      const course = await courseService.getCourseById(req.params.id);
      
      let isEnrolled = false;
      if (req.user && req.user.purchasedCourses) {
        isEnrolled = req.user.purchasedCourses.includes(course._id.toString());
      }
      
      const courseData = { ...course.toObject(), isEnrolled };
      
      ApiResponse.success(res, { course: courseData }, 'Course retrieved successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 404);
    }
  }

  async updateCourse(req: AuthRequest, res: Response) {
    try {
      const course = await courseService.updateCourse(req.params.id, req.body, req.user!._id, req.user!.role);
      ApiResponse.success(res, { course }, 'Course updated successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }

  async addVideo(req: AuthRequest, res: Response) {
    try {
      const { id, moduleId } = req.params;
      const course = await courseService.addVideoToModule(id, moduleId, req.body, req.user!._id, req.user!.role);
      ApiResponse.success(res, { course }, 'Video added successfully', 201);
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }

  async deleteCourse(req: AuthRequest, res: Response) {
    try {
      await courseService.deleteCourse(req.params.id, req.user!._id, req.user!.role);
      ApiResponse.success(res, null, 'Course deleted successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 404);
    }
  }

  async addModule(req: AuthRequest, res: Response) {
    try {
      const course = await courseService.addModule(req.params.id, req.body, req.user!._id, req.user!.role);
      ApiResponse.success(res, { course }, 'Module added successfully', 201);
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }

  async updateModule(req: AuthRequest, res: Response) {
    try {
      const { id, moduleId } = req.params;
      const course = await courseService.updateModule(id, moduleId, req.body, req.user!._id, req.user!.role);
      ApiResponse.success(res, { course }, 'Module updated successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }

  async deleteModule(req: AuthRequest, res: Response) {
    try {
      const { id, moduleId } = req.params;
      const course = await courseService.deleteModule(id, moduleId, req.user!._id, req.user!.role);
      ApiResponse.success(res, { course }, 'Module deleted successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }

  async updateVideo(req: AuthRequest, res: Response) {
    try {
      const { id, moduleId, videoId } = req.params;
      const course = await courseService.updateVideo(id, moduleId, videoId, req.body, req.user!._id, req.user!.role);
      ApiResponse.success(res, { course }, 'Video updated successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }

  async deleteVideo(req: AuthRequest, res: Response) {
    try {
      const { id, moduleId, videoId } = req.params;
      const course = await courseService.deleteVideo(id, moduleId, videoId, req.user!._id, req.user!.role);
      ApiResponse.success(res, { course }, 'Video deleted successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }

  async reorderModules(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { moduleOrders } = req.body;
      const course = await courseService.reorderModules(id, moduleOrders, req.user!._id, req.user!.role);
      ApiResponse.success(res, { course }, 'Modules reordered successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }

  async reorderVideos(req: AuthRequest, res: Response) {
    try {
      const { id, moduleId } = req.params;
      const { videoOrders } = req.body;
      const course = await courseService.reorderVideos(id, moduleId, videoOrders, req.user!._id, req.user!.role);
      ApiResponse.success(res, { course }, 'Videos reordered successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  }
}