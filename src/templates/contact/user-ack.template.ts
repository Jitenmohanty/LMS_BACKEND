export const getContactUserAckTemplate = (firstName: string, subject: string) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;">
        <h2 style="color: #4A90E2;">DevSkill</h2>
      </div>
      <div style="padding: 20px 0;">
        <h2 style="color: #2e7d32; text-align: center;">We received your message!</h2>
        <p>Hi <strong>${firstName}</strong>,</p>
        <p>Thank you for contacting us regarding "<strong>${subject}</strong>".</p>
        <p>We have successfully received your inquiry and our team is already looking into it. We aim to respond to all queries within 24 hours.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4A90E2; margin: 20px 0;">
          <p style="margin: 0; font-style: italic;">"Your learning journey is our priority."</p>
        </div>

        <p>In the meantime, feel free to browse our latest courses.</p>
      </div>
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px;">
        <p>Best regards,</p>
        <p><strong>DevSkill Team</strong></p>
        <p>&copy; ${new Date().getFullYear()} DevSkill. All rights reserved.</p>
      </div>
    </div>
  `;
};
