import { Resend } from 'resend';

export class EmailService {
  private resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendOTP(email: string, otp: string, type: 'verification' | 'reset') {
    const subject = type === 'verification' 
      ? 'Verify your Email Address' 
      : 'Password Reset Request';
    
    // Simple HTML template
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>${type === 'verification' ? 'Email Verification' : 'Reset Password'}</h2>
        <p>Your One-Time Password (OTP) is:</p>
        <h1 style="color: #4A90E2; letter-spacing: 5px;">${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `;

    try {
      if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY missing. Logging OTP instead:', otp);
        return; // Dev mode fallback
      }

      await this.resend.emails.send({
        from: 'Learning Platform <onboarding@resend.dev>', // Default Resend testing domain, user can change to their verified domain
        to: email,
        subject: subject,
        html: html,
      });
      console.log(`Email sent to ${email} via Resend`);
    } catch (error) {
      console.error('Error sending email:', error);
      // In production, you might want to throw this, but for now log it
    }
  }
}
