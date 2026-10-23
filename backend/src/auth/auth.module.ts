import {
  RefreshToken,
  RefreshTokenSchema,
} from './model/refresh-token.model.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LocalUsernamePasswordStrategy } from './strategies/local-username-password.strategy.js';
import { UsersModule } from './../users/users.module.js';
import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './services/auth.service.js';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { IAuthConfig } from '../../config/model.js';
import { RolesGuard } from './guards/roles-guard.js';
import { Identity, IdentitySchema } from './model/identity.model.js';
import { IdentitiesService } from './services/identities.service.js';
import { AuthController } from './controllers/auth.controller.js';
import { IdentitiesController } from './controllers/identities.controller.js';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const authConfig: IAuthConfig = configService.get('auth');
        return {
          secret: authConfig.jwtSecret,
          signOptions: {
            expiresIn: authConfig.jwtExpirationTime, // if string then miliseconds
          },
        };
      },
    }),
    MongooseModule.forFeatureAsync([
      { name: RefreshToken.name, useFactory: () => RefreshTokenSchema },
      { name: Identity.name, useFactory: () => IdentitySchema },
    ]),
  ],
  controllers: [AuthController, IdentitiesController],
  providers: [
    AuthService,
    LocalUsernamePasswordStrategy,
    JwtStrategy,
    RolesGuard,
    IdentitiesService,
  ],
  exports: [AuthService, IdentitiesService],
})
export class AuthModule {}
