// ============================================================================
// FILE: tests/course.test.ts
// ============================================================================
import request from 'supertest';
import app from '../src/server';

describe('Course Tests', () => {
  describe('GET /api/courses', () => {
    it('should get all published courses', async () => {
      const response = await request(app).get('/api/courses');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.courses)).toBe(true);
    });
  });

  describe('POST /api/courses', () => {
    it('should create a new course (admin only)', async () => {
      // Test implementation with admin token
    });
  });
});