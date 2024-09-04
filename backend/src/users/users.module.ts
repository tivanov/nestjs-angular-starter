import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './model/user.model';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { UserSettings, UserSettingsSchema } from './model/userSettings.model';
import { AuthModule } from '../auth/auth.module';
import { LoginRecord, LoginRecordSchema } from './model/login-record.model';
import { HttpModule } from '@nestjs/axios';
import { IpLocationService } from './services/iplocation.service';
import { LoginRecordsService } from './services/login-records.service';
import { LoginRecordsController } from './controllers/login-records.controller';

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
