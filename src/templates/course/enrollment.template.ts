// Placeholder for course related templates
export const getCourseEnrollmentTemplate = (userName: string, courseTitle: string) => {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;">
          <h2 style="color: #4A90E2;">DevSkill</h2>
        </div>
        <div style="padding: 20px 0;">
          <h2>Welcome to the Course!</h2>
          <p>Hi <strong>${userName}</strong>,</p>
          <p>Congratulations on enrolling in "<strong>${courseTitle}</strong>".</p>
          <p>We are excited to have you on board. Start learning now!</p>
        </div>
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} DevSkill. All rights reserved.</p>
        </div>
      </div>
    `;
};
