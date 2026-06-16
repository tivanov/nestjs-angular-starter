import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  closeTestApp,
  createTestApp,
} from './support/create-test-app';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await closeTestApp(app);
  });

  it('POST /v1/auth/login without credentials returns 401', () => {
    return request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({})
      .expect(401);
  });
});
