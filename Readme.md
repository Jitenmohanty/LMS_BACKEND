
# Learning Platform Backend

Production-ready backend for a modern learning platform built with Node.js, Express, TypeScript, and MongoDB.

## Features

✅ JWT Authentication (Access + Refresh Tokens)
✅ Google OAuth Integration
✅ Role-Based Access Control (Admin/User)
✅ Course Management System
✅ Video Streaming (AWS S3)
✅ Image Upload (Cloudinary)
✅ Payment Integration (Razorpay)
✅ Subscription Plans
✅ Progress Tracking
✅ Webhook Handling
✅ Rate Limiting & Security
✅ Comprehensive Logging

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + Passport (Google OAuth)
- **Payment:** Razorpay
- **Storage:** AWS S3 (videos), Cloudinary (images)
- **Validation:** Zod
- **Logging:** Winston
- **Testing:** Jest

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update environment variables with your credentials

5. Run the development server:
```bash
npm run dev
```

6. Build for production:
```bash
npm run build
npm start
```

## Project Structure

```
src/
├── config/          # Configuration files (DB, S3, Cloudinary, etc.)
├── controllers/     # Request handlers
├── services/        # Business logic layer
├── models/          # Mongoose schemas
├── routes/          # API routes
├── middlewares/     # Custom middleware
├── utils/           # Utility functions
├── validators/      # Request validation schemas
├── types/           # TypeScript type definitions
└── server.ts        # Application entry point
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (Admin)
- `PUT /api/courses/:id` - Update course (Admin)
- `DELETE /api/courses/:id` - Delete course (Admin)
- `POST /api/courses/:id/modules` - Add module (Admin)

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `POST /api/payments/webhook` - Handle Razorpay webhooks

## Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting (100 requests/15min)
- JWT token rotation
- HttpOnly cookies for refresh tokens
- Input validation with Zod
- Razorpay webhook signature verification
- SQL injection protection via Mongoose
- XSS protection

## Environment Variables

See `.env.example` for all required environment variables.

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Deployment

1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure values for JWT secrets
4. Configure AWS S3 and Cloudinary
5. Set up Razorpay production keys
6. Enable HTTPS
7. Configure proper CORS origins
8. Set up logging and monitoring

## License

MIT

## Support

For support, email support@yourplatform.com