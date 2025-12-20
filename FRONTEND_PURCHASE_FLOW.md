# User Course & Purchase Flow (Frontend Guide)

This document outlines the step-by-step logic the frontend must implement to handle course browsing, enrollment checks, and purchasing.

## 1. Initial Setup (User Login)
When the user logs in (`POST /auth/login`), the backend returns the user object, which includes `purchasedCourses`.
**Store this list in your global state (Redux/Context).**

```json
// Login Response
{
  "user": {
    "_id": "user_123",
    "name": "Students Name",
    "purchasedCourses": ["course_abc", "course_xyz"], // <--- IMPORTANT
    ...
  }
}
```

## 2. Browsing Courses
**API Call:** `GET /api/courses`
Display the list of courses.

## 3. Viewing a Course (Enrollment Check)
**API Call:** `GET /api/courses/:id`

**Logic:**
To decide whether to show the **"Buy Now"** button or the **"Start Learning"** button, check if the `course._id` exists in the user's `purchasedCourses` array.

```javascript
/* Frontend Logic Example */
const isEnrolled = user.purchasedCourses.includes(currentCourse._id);

if (isEnrolled || currentCourse.isFree) {
  // Show "Start Learning" button
  // Allow access to modules/videos
} else {
  // Show "Buy Now" button
  // Lock content
}
```

## 4. Purchase Flow (If not enrolled)
If the user clicks **"Buy Now"**:

### Step A: Create Order
**API Call:** `POST /api/payments/create-order`
**Body:**
```json
{
  "itemType": "course",
  "itemId": "course_id_here",
  "amount": 4999  // Amount in SMALLEST unit (e.g., paise for INR)
}
```
**Response:**
```json
{
  "id": "order_razorpay_123", // Razorpay Order ID
  "amount": 4999,
  "currency": "INR"
}
```

### Step B: Open Razorpay Checkout
Use the Order ID from Step A to open the Razorpay modal.

### Step C: Verify Payment
On Razorpay success, you receive `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature`.

**API Call:** `POST /api/payments/verify`
**Body:**
```json
{
  "razorpayOrderId": "order_razorpay_123",
  "razorpayPaymentId": "pay_123456",
  "razorpaySignature": "signature_string"
}
```

### Step D: Update State
If Step C is successful:
1.  Show "Purchase Successful" toast.
2.  **Crucial:** Add the `course_id` to the local `user.purchasedCourses` state (or fetch the user profile again via `GET /users/profile`).
3.  Redirect user to the Course content.

## 5. Course Access Control (Logic)

This is the exact logic to determine if a user can watch the videos of a course.

```javascript
/**
 * @param {Object} user - The logged-in user object
 * @param {Object} course - The course object
 * @returns {Boolean} - True if access is allowed
 */
function canAccessCourse(user, course) {
  // 1. If course is Free, everyone has access
  if (course.isFree) {
    return true;
  }

  // 2. If user is NOT logged in, they can't access paid content
  if (!user) {
    return false;
  }

  // 3. If user is Admin/Instructor (optional logic), allow access
  if (user.role === 'admin' || user.role === 'instructor') {
    return true;
  }

  // 4. Check if user has purchased the course
  // Note: user.purchasedCourses contains an array of course IDs
  return user.purchasedCourses.includes(course._id);
}
```

### UI Behavior based on Access
-   **If Can Access**:
    -   Show **"Start Learning"** or **"Continue"** button.
    -   Clicking opens the Video Player page.
    -   Video Player fetches stream from `/api/courses/:id/stream` (or similar).
-   **If Cannot Access**:
    -   Show **"Buy Now"** button.
    -   Clicking triggers the Purchase Flow (Create Order -> Razorpay).
    -   Video Player is **Locked** (show lock icon).
