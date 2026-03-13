import request from 'supertest';
import app from '../../src/app';
import { User } from '../../src/models/User';

describe('POST /api/v1/auth/login', () => {
  beforeEach(async () => {
    await User.create({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: 'TestPassword123!',
      role: 'admin',
    });
  });

  it('returns 200 and sets cookies on valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@test.com', password: 'TestPassword123!' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('admin@test.com');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('returns 401 on invalid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@test.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
