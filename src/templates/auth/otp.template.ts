export const getOtpTemplate = (otp: string, type: 'verification' | 'reset') => {
  const title = type === 'verification' ? 'Email Verification' : 'Reset Password';
  
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;">
        <h2 style="color: #4A90E2;">DevSkill</h2>
      </div>
      <div style="padding: 20px 0;">
        <h3>${title}</h3>
        <p>Your One-Time Password (OTP) is:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 4px; margin: 20px 0;">
          <h1 style="color: #4A90E2; letter-spacing: 5px; margin: 0;">${otp}</h1>
        </div>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} DevSkill. All rights reserved.</p>
      </div>
    </div>
  `;
};
