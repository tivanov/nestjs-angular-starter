import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { Request as ReqObj } from 'express';
import { AppUnauthorizedException } from 'src/shared/exceptions/app-unauthorized-exception';
import { ErrorCode, IdentityProviderEnum } from '@app/contracts';
import { AuthService } from '../services/auth.service';
import { LocalUsernamePasswordAuthGuard } from '../guards/local-username-password.guard';

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
