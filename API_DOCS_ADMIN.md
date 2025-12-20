# LMS Admin API Documentation

Base URL: `http://localhost:5000/api`

**Authentication**: All headers must include `Authorization: Bearer <token>` where user role is `admin` (or `instructor` for Course Management).

## Dashboard & Analytics
- `GET /admin/dashboard`
    - Returns: Total Users, Revenue, Top Courses.

## User Management (Admin Only)
- `GET /admin/users` - List all users (pagination: `?page=1&limit=20`)
- `PUT /admin/users/:userId/block` - Block a user.
- `PUT /admin/users/:userId/unblock` - Unblock a user.
- `PUT /admin/users/:userId/role` - Change role.
    - **Body**: `{ "role": "instructor" }` (or 'admin', 'user')

## Payment Management (Admin Only)
- `GET /admin/payments` - List all transactions.

## Course Management (Admin & Instructor)

### Create Course
`POST /courses`
- **Body**:
```json
{
  "title": "New Course",
  "description": "...",
  "price": 99.99,
  "category": "Tech",
  "level": "beginner",
  "isFree": false
}
```

### Update Course
`PUT /courses/:id`
- **Note**: Instructors can only update their own courses.

### Delete Course
`DELETE /courses/:id`

### Add Module
`POST /courses/:id/modules`
- **Body**: `{ "title": "Module 1", "order": 1 }`

### View All (Hidden) Courses
`GET /courses?status=draft`
- Admins can see draft courses to review them.
