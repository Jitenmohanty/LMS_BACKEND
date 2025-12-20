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
      const course = await courseService.createCourse(req.body, req.user!._id);
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
      ApiResponse.success(res, { courses }, 'Courses retrieved successfully');
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
}