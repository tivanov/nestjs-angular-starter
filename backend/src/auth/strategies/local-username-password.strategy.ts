import { UsersService } from '../../users/services/users.service';

import { User } from '../../users/model/user.model';
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
    const user = await this.userService.login(username, password, request);
    delete user.password;
    return user;
  }
}
