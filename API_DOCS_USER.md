# LMS User API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### Register
`POST /auth/register`
- **Body:** `{ "email": "...", "password": "...", "name": "..." }`

### Login
`POST /auth/login`
- **Body:** `{ "email": "...", "password": "..." }`
- **Response:** `{ "accessToken": "...", "user": { ... } }`

## Courses (Student View)

### Browse Courses
`GET /courses`
- Lists all **Published** courses.
- **QueryParams**: `category`, `level`, `isFree=true`

### Get Course Details
`GET /courses/:id`
- Returns full course details including modules/videos (if accessible/enrolled).

## Reviews

### View Reviews
`GET /reviews/:courseId`

### Add Review
`POST /reviews` (Requires Auth)
- **Body:** `{ "courseId": "...", "rating": 1-5, "comment": "..." }`

## Transactions

### Buy Course
`POST /payments/create-order` (Requires Auth)
- **Body:** `{ "itemType": "course", "itemId": "...", "amount": 1000 }`

### Verify Payment
`POST /payments/verify`

## Profile

### View Profile
`GET /users/profile` (Currently implicitly supported via Auth token check or specific route if implemented)

### Update Profile
`PUT /users/profile` (Requires Auth)
- **Content-Type**: `multipart/form-data`
- **Fields**: `name` (text), `avatar` (file)
