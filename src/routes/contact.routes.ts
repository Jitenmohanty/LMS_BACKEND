import { Router } from 'express';
import { ContactController } from '../controllers/contact.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { contactFormSchema } from '../validators/contact.validator';
import { limiter } from '../middlewares/rateLimiter.middleware';

const router = Router();
const contactController = new ContactController();

// Apply rate limiting to prevent spam
// router.use(limiter); 

router.post('/', validateBody(contactFormSchema), contactController.submitContactForm);

export default router;
