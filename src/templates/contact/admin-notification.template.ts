export const getContactAdminTemplate = (
  firstName: string,
  lastName: string,
  email: string,
  subject: string,
  message: string
) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;">
        <h2 style="color: #f97316;">DevSkill Admin</h2>
      </div>
      <div style="padding: 20px 0;">
        <h2 style="color: #333;">New Message from Contact Form</h2>
        <p>You have received a new inquiry from <strong>${firstName} ${lastName}</strong>.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr style="background-color: #f3f4f6;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 30%;">Name</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${firstName} ${lastName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr style="background-color: #f3f4f6;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Subject</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${subject}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Message</td>
            <td style="padding: 10px; border: 1px solid #ddd; white-space: pre-wrap;">${message}</td>
          </tr>
        </table>
      </div>
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px;">
        <p>This email was sent from the contact form on DevSkill.</p>
      </div>
    </div>
  `;
};
