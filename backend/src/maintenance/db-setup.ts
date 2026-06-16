import { UsersService } from '../users/services/users.service';
import { MaintenanceModule } from './maintenance.module';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CreateUserCommand, UserRoleEnum } from '@app/contracts';
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
    const { faker } = await import('@faker-js/faker');
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

export const seedDatabase = async (context: INestApplication): Promise<void> => {
  const initializer = new DbInitializer(context);
  await initializer.initDb();
};

const bootstrap = async (): Promise<void> => {
  const context = await NestFactory.create(MaintenanceModule);
  try {
    await context.init();
    console.log('Created maintenance module.');
    await seedDatabase(context);
    console.log('Done');
  } catch (e) {
    console.error(e);
  } finally {
    await context.close();
  }
};

if (require.main === module) {
  bootstrap();
}
