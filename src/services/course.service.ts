// ============================================================================
// FILE: src/services/course.service.ts
// ============================================================================
import Course from '../models/Course';
import User from '../models/User';
import { CourseStatus, CourseLevel } from '../types';
import { sanitizeCourseForPublic, canAccessCourseContent, isUserEnrolled } from '../utils/course.utils';

export class CourseService {
  async createCourse(data: any, instructorId: string, userRole: string) {
    const status = userRole === 'admin' ? 'published' : 'draft';
    const course = await Course.create({
      ...data,
      instructor: instructorId,
      status
    });
    return course;
  }

  async getAllCourses(filters: any = {}, isPublicView: boolean = true) {
    const query: any = {};

    if (filters.status) {
      query.status = filters.status;
    } else if (!filters.ignoreStatusDefault) {
      query.status = 'published';
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name avatar')
      .sort({ createdAt: -1 });

    // Sanitize course data for public view
    if (isPublicView) {
      return courses.map(course => sanitizeCourseForPublic(course));
    }

    return courses;
  }

  async getCourseById(courseId: string, isPublicView: boolean = true) {
    const course = await Course.findById(courseId)
      .populate('instructor', 'name avatar email');
    
    if (!course) {
      throw new Error('Course not found');
    }

    // Sanitize course data for public view
    if (isPublicView) {
      return sanitizeCourseForPublic(course);
    }

    return course;
  }

  async getCourseContent(courseId: string, userId: string, userRole: string) {
    const course = await Course.findById(courseId)
      .populate('instructor', 'name avatar email');
    
    if (!course) {
      throw new Error('Course not found');
    }

    // Admins can access all content
    if (userRole === 'admin') {
      return course;
    }

    // Free courses are accessible to everyone
    if (course.isFree) {
      return course;
    }

    // Check if user is the instructor
    if (course.instructor._id.toString() === userId) {
      return course;
    }

    // For paid courses, verify enrollment
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const enrolled = isUserEnrolled(userId, user.purchasedCourses, courseId);
    if (!enrolled) {
      throw new Error('You must enroll in this course to access its content');
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

  async updateModule(courseId: string, moduleId: string, moduleData: any, userId: string, userRole: string) {
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

    if (moduleData.title) module.title = moduleData.title;
    if (moduleData.description !== undefined) module.description = moduleData.description;

    await course.save();
    return course;
  }

  async deleteModule(courseId: string, moduleId: string, userId: string, userRole: string) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    if (userRole !== 'admin' && course.instructor.toString() !== userId) {
      throw new Error('Not authorized to modify this course');
    }

    const moduleIndex = course.modules.findIndex((m: any) => m._id.toString() === moduleId);
    if (moduleIndex === -1) {
      throw new Error('Module not found');
    }

    course.modules.splice(moduleIndex, 1);
    await course.save();
    return course;
  }

  async updateVideo(courseId: string, moduleId: string, videoId: string, videoData: any, userId: string, userRole: string) {
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

    const video = module.videos.find((v: any) => v._id.toString() === videoId);
    if (!video) {
      throw new Error('Video not found');
    }

    if (videoData.title) video.title = videoData.title;
    if (videoData.videoUrl) video.videoUrl = videoData.videoUrl;
    if (videoData.publicId) video.publicId = videoData.publicId;
    if (videoData.description !== undefined) video.description = videoData.description;
    if (videoData.duration) video.duration = videoData.duration;
    if (videoData.isFreePreview !== undefined) video.isFreePreview = videoData.isFreePreview;
    if (videoData.order) video.order = videoData.order;

    await course.save();
    return course;
  }

  async deleteVideo(courseId: string, moduleId: string, videoId: string, userId: string, userRole: string) {
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

    const videoIndex = module.videos.findIndex((v: any) => v._id.toString() === videoId);
    if (videoIndex === -1) {
      throw new Error('Video not found');
    }

    module.videos.splice(videoIndex, 1);
    await course.save();
    return course;
  }

  async reorderModules(courseId: string, moduleOrders: Array<{ moduleId: string; order: number }>, userId: string, userRole: string) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    if (userRole !== 'admin' && course.instructor.toString() !== userId) {
      throw new Error('Not authorized to modify this course');
    }

    // Update order for each module
    moduleOrders.forEach(({ moduleId, order }) => {
      const module = course.modules.find((m: any) => m._id.toString() === moduleId);
      if (module) {
        module.order = order;
      }
    });

    await course.save();
    return course;
  }

  async reorderVideos(courseId: string, moduleId: string, videoOrders: Array<{ videoId: string; order: number }>, userId: string, userRole: string) {
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

    // Update order for each video
    videoOrders.forEach(({ videoId, order }) => {
      const video = module.videos.find((v: any) => v._id.toString() === videoId);
      if (video) {
        video.order = order;
      }
    });

    await course.save();
    return course;
  }
}