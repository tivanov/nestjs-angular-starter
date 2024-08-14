import { CqrsModule } from '@nestjs/cqrs';
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

@Module({
  imports: [
    HttpModule,
    CqrsModule,
    MongooseModule.forFeatureAsync([
      { name: User.name, useFactory: () => UserSchema },
      { name: UserSettings.name, useFactory: () => UserSettingsSchema },
      { name: LoginRecord.name, useFactory: () => LoginRecordSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService, IpLocationService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
