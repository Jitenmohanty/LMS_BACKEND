import { Request, Response } from 'express';
import { EmailService } from '../services/email.service';
import { ApiResponse } from '../utils/apiResponse';

const emailService = new EmailService();

export class ContactController {
  async submitContactForm(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, subject, message } = req.body;

      await emailService.sendContactEmail({
        firstName,
        lastName,
        email,
        subject,
        message
      });

      ApiResponse.success(res, null, 'Message sent successfully');
    } catch (error: any) {
      console.error('Contact form submission error:', error);
      ApiResponse.error(res, 'Failed to send message', 500);
    }
  }
}
