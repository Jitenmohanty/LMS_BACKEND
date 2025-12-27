import { Resend } from 'resend';
import { getOtpTemplate } from '../templates/auth/otp.template';
import { getContactAdminTemplate } from '../templates/contact/admin-notification.template';
import { getContactUserAckTemplate } from '../templates/contact/user-ack.template';
import { getPasswordChangedTemplate } from '../templates/auth/password-changed.template';

export class EmailService {
  private resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendPasswordChangeNotification(email: string, name: string) {
    const html = getPasswordChangedTemplate(name);

    try {
      if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY missing. Logging password change email for:', email);
        return;
      }

      await this.resend.emails.send({
        from: 'Security <security@resend.dev>',
        to: email,
        subject: 'Your Password Has Been Changed',
        html: html,
      });
      console.log(`Password change notification sent to ${email}`);
    } catch (error) {
      console.error('Error sending password change email:', error);
    }
  }

  async sendOTP(email: string, otp: string, type: 'verification' | 'reset') {
    const subject = type === 'verification' 
      ? 'Verify your Email Address' 
      : 'Password Reset Request';
    
    const html = getOtpTemplate(otp, type);

    try {
      if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY missing. Logging OTP instead:', otp);
        return; // Dev mode fallback
      }

      await this.resend.emails.send({
        from: 'Learning Platform <onboarding@resend.dev>', // Default Resend testing domain
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

  async sendContactEmail(data: { firstName: string; lastName: string; email: string; subject: string; message: string }) {
    const { firstName, lastName, email, subject, message } = data;
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@devskill.com'; // Fallback or env var

    const html = getContactAdminTemplate(firstName, lastName, email, subject, message);

    try {
      if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY missing. Logging contact email instead:', data);
        return;
      }

      await this.resend.emails.send({
        from: 'Contact Form <contact@resend.dev>', // Should be a verified domain in production
        to: adminEmail,
        replyTo: email,
        subject: `New Contact Submission: ${subject}`,
        html: html,
      });

      // Send auto-reply to user
      const userHtml = getContactUserAckTemplate(firstName, subject);

      await this.resend.emails.send({
        from: 'DevSkill Support <support@resend.dev>',
        to: email,
        subject: 'We received your message',
        html: userHtml
      });

      console.log(`Contact email sent from ${email} and auto-reply sent.`);
    } catch (error) {
      console.error('Error sending contact email:', error);
      throw error;
    }
  }
}

