import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './services/auth.service';

import { LocalUsernamePasswordAuthGuard } from './guards/local-username-password.guard';
import { Request as ReqObj } from 'express';
import { UsersService } from '../users/services/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalUsernamePasswordAuthGuard)
  @Post('login')
  async login(@Request() req: ReqObj) {
    return this.authService.getLoginSuccessResponse(req);
  }

  @Post('refresh')
  async refresh(@Request() req: ReqObj) {
    const refreshToken = req.get('X-Auth-Refresh-Token');
    const dbToken = await this.authService.validateRefreshToken(refreshToken);
    req.user = await this.usersService.expectEntityExists(
      dbToken.user.toString(),
    );
    return this.authService.getRefreshTokenSuccessResponse(req);
  }
}
