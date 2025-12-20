// ============================================================================
// FILE: src/services/progress.service.ts (Extended)
// ============================================================================
import Progress from '../models/Progress';
import Course from '../models/Course';

export class ProgressService {
  async markVideoCompleted(userId: string, courseId: string, videoId: string) {
    let progress = await Progress.findOne({ user: userId, course: courseId });

    if (!progress) {
      progress = await Progress.create({
        user: userId,
        course: courseId,
        completedVideos: [],
        progressPercentage: 0
      });
    }

    if (!progress.completedVideos.includes(videoId)) {
      progress.completedVideos.push(videoId);
      progress.lastWatchedVideo = videoId;

      const course = await Course.findById(courseId);
      if (course) {
        const totalVideos = course.modules.reduce((sum, module) => sum + module.videos.length, 0);
        progress.progressPercentage = (progress.completedVideos.length / totalVideos) * 100;
      }

      await progress.save();
    }

    return progress;
  }

  async getUserProgress(userId: string) {
    const progress = await Progress.find({ user: userId })
      .populate('course', 'title thumbnail duration')
      .sort({ updatedAt: -1 });
    return progress;
  }

  async getCourseProgress(userId: string, courseId: string) {
    const progress = await Progress.findOne({ user: userId, course: courseId })
      .populate('course');
    
    if (!progress) {
      throw new Error('Progress not found');
    }

    return progress;
  }

  async getRecommendedCourses(userId: string) {
    const userProgress = await Progress.find({ user: userId })
      .populate('course', 'category tags');

    const categories = new Set();
    const tags = new Set();

    userProgress.forEach(p => {
      if (p.course) {
        const course = p.course as any;
        categories.add(course.category);
        course.tags?.forEach((tag: string) => tags.add(tag));
      }
    });

    const recommendedCourses = await Course.find({
      status: 'published',
      $or: [
        { category: { $in: Array.from(categories) } },
        { tags: { $in: Array.from(tags) } }
      ]
    })
      .limit(10)
      .select('title thumbnail price rating category');

    return recommendedCourses;
  }
}
