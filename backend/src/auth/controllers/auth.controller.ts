import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import type { Request as ReqObj } from 'express';
import { AppUnauthorizedException } from '../../../src/shared/exceptions/app-unauthorized-exception.js';
import { ErrorCode, IdentityProviderEnum } from '@app/contracts';
import { AuthService } from '../services/auth.service.js';
import { LocalUsernamePasswordAuthGuard } from '../guards/local-username-password.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalUsernamePasswordAuthGuard)
  @Post('login')
  async login(@Request() req: ReqObj) {
    return this.authService.getLoginSuccessResponse(
      req,
      IdentityProviderEnum.UserName,
    );
  }

  @Post('refresh')
  async refresh(@Request() req: ReqObj) {
    const refreshToken = req.get('X-Auth-Refresh-Token');
    if (!refreshToken) {
      throw new AppUnauthorizedException(ErrorCode.REFRESH_TOKEN_MISSING);
    }

    const validateResponse = await this.authService.validateRefreshToken(
      req,
      refreshToken,
    );
    return this.authService.getRefreshTokenSuccessResponse(
      validateResponse.user,
      validateResponse.identity,
    );
  }
}
