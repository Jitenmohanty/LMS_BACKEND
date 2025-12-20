// ============================================================================
// FILE: src/services/course.service.ts
// ============================================================================
import Course from '../models/Course';
import { CourseStatus, CourseLevel } from '../types';

export class CourseService {
  async createCourse(data: any, instructorId: string) {
    const course = await Course.create({
      ...data,
      instructor: instructorId,
      status: 'draft'
    });
    return course;
  }

  async getAllCourses(filters: any = {}) {
    const query: any = {};

    if (filters.status) {
      query.status = filters.status;
    } else if (!filters.ignoreStatusDefault) {
      query.status = 'published';
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name avatar')
      .sort({ createdAt: -1 });

    return courses;
  }

  async getCourseById(courseId: string) {
    const course = await Course.findById(courseId)
      .populate('instructor', 'name avatar email');
    
    if (!course) {
      throw new Error('Course not found');
    }

    return course;
  }

  async updateCourse(courseId: string, data: any, userId: string, userRole: string) {
    let course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    if (userRole !== 'admin' && course.instructor.toString() !== userId) {
      throw new Error('Not authorized to update this course');
    }

    course = await Course.findByIdAndUpdate(courseId, data, { new: true });
    return course;
  }

  async deleteCourse(courseId: string, userId: string, userRole: string) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    if (userRole !== 'admin' && course.instructor.toString() !== userId) {
      throw new Error('Not authorized to delete this course');
    }

    await Course.findByIdAndDelete(courseId);
    return course;
  }

  async addModule(courseId: string, moduleData: any, userId: string, userRole: string) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    if (userRole !== 'admin' && course.instructor.toString() !== userId) {
      throw new Error('Not authorized to modify this course');
    }

    course.modules.push(moduleData);
    await course.save();
    return course;
  }

  async addVideoToModule(courseId: string, moduleId: string, videoData: any, userId: string, userRole: string) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    if (userRole !== 'admin' && course.instructor.toString() !== userId) {
      throw new Error('Not authorized to modify this course');
    }

    const module = course.modules.find((m: any) => m._id.toString() === moduleId);
    if (!module) {
      throw new Error('Module not found');
    }

    module.videos.push(videoData);
    await course.save();
    return course;
  }
}