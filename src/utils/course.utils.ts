// ============================================================================
// FILE: src/utils/course.utils.ts
// ============================================================================
import { Types } from 'mongoose';

/**
 * Sanitizes course data for public viewing by removing sensitive information
 * like video URLs and detailed video descriptions
 */
export const sanitizeCourseForPublic = (course: any) => {
  const courseObj = course.toObject ? course.toObject() : course;
  
  // If course has modules, sanitize them
  if (courseObj.modules && Array.isArray(courseObj.modules)) {
    courseObj.modules = courseObj.modules.map((module: any) => ({
      _id: module._id,
      title: module.title,
      order: module.order,
      // Only include video count and basic info, not actual video data
      videoCount: module.videos?.length || 0,
      // Remove video URLs and sensitive data
      videos: module.videos?.map((video: any) => ({
        _id: video._id,
        title: video.title,
        order: video.order,
        isFreePreview: video.isFreePreview,
        duration: video.duration,
        // Explicitly exclude videoUrl, publicId, and description
      })) || []
    }));
  }
  
  return courseObj;
};

/**
 * Checks if a user can access full course content including video URLs
 * @param userId - The user's ID
 * @param userRole - The user's role (admin, instructor, student)
 * @param course - The course object
 * @returns boolean indicating if user has access
 */
export const canAccessCourseContent = (
  userId: string | Types.ObjectId | undefined,
  userRole: string | undefined,
  course: any
): boolean => {
  // Admins can access everything
  if (userRole === 'admin') {
    return true;
  }
  
  // Free courses are accessible to everyone
  if (course.isFree) {
    return true;
  }
  
  // Must be logged in for paid courses
  if (!userId) {
    return false;
  }
  
  const userIdString = userId.toString();
  const courseObj = course.toObject ? course.toObject() : course;
  
  // Check if user is the instructor
  if (courseObj.instructor) {
    const instructorId = typeof courseObj.instructor === 'object' 
      ? courseObj.instructor._id?.toString() 
      : courseObj.instructor.toString();
    
    if (instructorId === userIdString) {
      return true;
    }
  }
  
  // For paid courses, user must be enrolled
  // Note: This will be checked against user.purchasedCourses in the service layer
  return false;
};

/**
 * Checks if a user is enrolled in a course
 * @param userId - The user's ID
 * @param purchasedCourses - Array of purchased course IDs
 * @param courseId - The course ID to check
 * @returns boolean indicating if user is enrolled
 */
export const isUserEnrolled = (
  userId: string | Types.ObjectId | undefined,
  purchasedCourses: any[] | undefined,
  courseId: string | Types.ObjectId
): boolean => {
  if (!userId || !purchasedCourses) {
    return false;
  }
  
  const courseIdString = courseId.toString();
  const purchasedCourseIds = purchasedCourses.map((id: any) => id.toString());
  
  return purchasedCourseIds.includes(courseIdString);
};
