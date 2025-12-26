// Placeholder for certificate related templates
export const getCertificateTemplate = (userName: string, courseTitle: string, certificateLink: string) => {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;">
          <h2 style="color: #4A90E2;">DevSkill</h2>
        </div>
        <div style="padding: 20px 0; text-align: center;">
          <h2 style="color: #2e7d32;">Course Completed!</h2>
          <p>Hi <strong>${userName}</strong>,</p>
          <p>You have successfully completed "<strong>${courseTitle}</strong>".</p>
          <p>Here is your certificate of completion:</p>
          <a href="${certificateLink}" style="display: inline-block; background-color: #4A90E2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Download Certificate</a>
        </div>
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} DevSkill. All rights reserved.</p>
        </div>
      </div>
    `;
};
