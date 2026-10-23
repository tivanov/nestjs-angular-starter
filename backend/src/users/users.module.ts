import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './model/user.model.js';
import { UsersService } from './services/users.service.js';
import { UsersController } from './controllers/users.controller.js';
import {
  UserSettings,
  UserSettingsSchema,
} from './model/userSettings.model.js';
import { AuthModule } from '../auth/auth.module.js';
import { LoginRecord, LoginRecordSchema } from './model/login-record.model.js';
import { HttpModule } from '@nestjs/axios';
import { IpLocationService } from './services/iplocation.service.js';
import { LoginRecordsService } from './services/login-records.service.js';
import { LoginRecordsController } from './controllers/login-records.controller.js';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeatureAsync([
      { name: User.name, useFactory: () => UserSchema },
      { name: UserSettings.name, useFactory: () => UserSettingsSchema },
      { name: LoginRecord.name, useFactory: () => LoginRecordSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService, IpLocationService, LoginRecordsService],
  controllers: [UsersController, LoginRecordsController],
  exports: [UsersService, LoginRecordsService],
})
export class UsersModule {}
