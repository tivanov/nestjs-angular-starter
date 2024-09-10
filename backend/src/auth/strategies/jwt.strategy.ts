import { AppUnauthorizedException } from './../../shared/exceptions/app-unauthorized-exception';
import { TokenPayload } from './../model/token-payload';
import { UsersService } from '../../users/services/users.service';
import { ConfigService } from '@nestjs/config';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../../users/model/user.model';
import { Request } from 'express';
import { IAuthConfig } from '../../../config/model';
import { ErrorCode } from '@app/contracts';
import { IdentitiesService } from '../services/identities.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'app-jwt-strategy',
) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
    private identitiesService: IdentitiesService,
  ) {
    const authConfig = configService.get<IAuthConfig>('auth');

    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.jwtSecret,
    });
  }

  async validate(request: Request, payload: TokenPayload): Promise<User> {
    const userId = payload.sub;
    const user = await this.usersService.getByIdLean(userId);
    if (!user) {
      throw new AppUnauthorizedException(ErrorCode.USER_NOT_FOUND);
    }
    this.usersService.verifyIsAllowedToLogin(user)

    const identity = await this.identitiesService.getValid(
      userId,
      payload.provider,
      payload.version,
    );
    if (!identity) {
      throw new AppUnauthorizedException(ErrorCode.IDENTITY_NOT_FOUND);
    }
    return user;
  }
}
