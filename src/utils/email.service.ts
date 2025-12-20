// ============================================================================
// FILE: src/utils/email.service.ts (Dummy Email Service)
// ============================================================================
import logger from './logger';

export class EmailService {
  static async sendWelcomeEmail(email: string, name: string) {
    // In production, integrate with SendGrid, AWS SES, or similar
    logger.info(`Welcome email sent to ${email} (${name})`);
    
    // Placeholder for actual email sending
    return true;
  }

  static async sendPurchaseConfirmation(email: string, courseName: string, amount: number) {
    logger.info(`Purchase confirmation sent to ${email} for ${courseName} - ₹${amount}`);
    return true;
  }

  static async sendSubscriptionConfirmation(email: string, planName: string) {
    logger.info(`Subscription confirmation sent to ${email} for ${planName}`);
    return true;
  }

  static async sendPasswordReset(email: string, resetToken: string) {
    logger.info(`Password reset email sent to ${email}`);
    return true;
  }
}