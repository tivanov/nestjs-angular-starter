import { UsersService } from '../users/services/users.service';
import { MaintenanceModule } from './maintenance.module';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CreateUserCommand, UserRoleEnum } from '@app/contracts';
import { faker } from '@faker-js/faker';
import { TasksService } from 'src/tasks/services/tasks.service';
import { TasksDefinition } from 'src/tasks/definitions';

class DbInitializer {
  private users: UsersService;
  private tasks: TasksService;

  constructor(context: INestApplication) {
    this.users = context.get(UsersService);
    this.tasks = context.get(TasksService);
  }

  public async initUsers() {
    const roles = Object.values(UserRoleEnum);

    for (const role of roles) {
      const userName = role;
      const password = role;

      const cmd: CreateUserCommand = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        avatar: faker.image.avatar(),
        userName,
        password,
        role,
      };

      await this.users.create(cmd);
      console.log(`Created user ${userName} with pass: ${password}`);
    }

    for (let i = 0; i < 50; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const userName = `${firstName.toLocaleLowerCase()}.${lastName.toLocaleLowerCase()}`;
      const password = '123456';
      const cmd: CreateUserCommand = {
        firstName,
        lastName,
        userName,
        password,
        avatar: faker.image.avatar(),
        role: UserRoleEnum.Regular,
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
      };

      await this.users.create(cmd);
      console.log(`Created user ${userName} with pass: ${password}`);
    }
  }

  public async initTasks() {
    for (const def of TasksDefinition) {
      await this.tasks.create(def);
    }
  }

  public async initDb() {
    await this.initUsers();
    await this.initTasks();
  }
}

const bootstrap = async () => {
  NestFactory.create(MaintenanceModule).then(async (context) => {
    try {
      await context.init();
      console.log('Created maintenance module.');
      const initializer = new DbInitializer(context);
      await initializer.initDb();
      console.log('Done');
    } catch (e) {
      console.error(e);
    } finally {
      context.close();
    }
  });
};

bootstrap();
