import { UsersService } from '../../users/services/users.service.js';

import { User } from '../../users/model/user.model.js';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class LocalUsernamePasswordStrategy extends PassportStrategy(
  Strategy,
  'local-username-password-strategy',
) {
  constructor(private readonly userService: UsersService) {
    super({
      passReqToCallback: true,
      usernameField: 'userName',
      passwordField: 'password',
    });
  }

  async validate(
    request: Request,
    username: string,
    password: string,
  ): Promise<User> {
    return await this.userService.login(username, password, request);
  }
}
