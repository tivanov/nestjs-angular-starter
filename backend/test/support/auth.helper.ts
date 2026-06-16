import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserRoleEnum } from '@app/contracts';
import { UsersService } from '../../src/users/services/users.service';
import { TEST_ADMIN } from './constants';

export async function seedAdminUser(app: INestApplication): Promise<void> {
  const usersService = app.get(UsersService);
  await usersService.create({
    userName: TEST_ADMIN.userName,
    password: TEST_ADMIN.password,
    role: UserRoleEnum.Admin,
    firstName: TEST_ADMIN.firstName,
    lastName: TEST_ADMIN.lastName,
    email: TEST_ADMIN.email,
  });
}

export async function loginAsAdmin(app: INestApplication): Promise<string> {
  const response = await request(app.getHttpServer())
    .post('/v1/auth/login')
    .send({
      userName: TEST_ADMIN.userName,
      password: TEST_ADMIN.password,
    })
    .expect(201);

  return response.body.token;
}
