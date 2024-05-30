import { UsersService } from '../users/services/users.service';
import { MaintenanceModule } from './maintenance.module';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CreateUserCommand, UserRoleEnum } from '@app/contracts';

class DbInitializer {
  private usersService: UsersService;

  constructor(context: INestApplication) {
    this.usersService = context.get(UsersService);
  }

  public async initUsers() {
    const roles = Object.values(UserRoleEnum);

    for (const role of roles) {
      const userName = role;
      const password = role;

      const cmd: CreateUserCommand = {
        firstName: role,
        userName,
        password,
        role,
      };

      await this.usersService.baseCreate(cmd);
      console.log(`Created user ${userName} with pass: ${password}`);
    }
  }

  public async initDb() {
    await this.initUsers();
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
