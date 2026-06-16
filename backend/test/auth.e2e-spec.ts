import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  closeTestApp,
  createTestApp,
} from './support/create-test-app';
import { clearDatabase, seedFullDatabase } from './support/e2e-db';
import { loginAsAdmin } from './support/auth.helper';
import { TEST_ADMIN } from './support/constants';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
    await clearDatabase(app);
    await seedFullDatabase(app);
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  it('POST /v1/auth/login without credentials returns 401', () => {
    return request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({})
      .expect(401);
  });

  it('POST /v1/auth/login with invalid credentials returns 401', () => {
    return request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({ userName: 'wrong', password: 'wrong' })
      .expect(401);
  });

  it('POST /v1/auth/login with valid credentials returns token', () => {
    return request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({
        userName: TEST_ADMIN.userName,
        password: TEST_ADMIN.password,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.token).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();
        expect(res.body.user).toMatchObject({
          userName: TEST_ADMIN.userName,
          role: 'admin',
        });
      });
  });

  it('GET /v1/users without token returns 401', () => {
    return request(app.getHttpServer()).get('/v1/users').expect(401);
  });

  it('GET /v1/users with admin token returns 200', async () => {
    const token = await loginAsAdmin(app);

    return request(app.getHttpServer())
      .get('/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.docs).toBeDefined();
        expect(res.body.totalDocs).toBeGreaterThanOrEqual(1);
      });
  });
});
