import { CqrsModule } from '@nestjs/cqrs';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './model/user';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { UserSettings, UserSettingsSchema } from './model/userSettings';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeatureAsync([
      { name: User.name, useFactory: () => UserSchema },
      { name: UserSettings.name, useFactory: () => UserSettingsSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
