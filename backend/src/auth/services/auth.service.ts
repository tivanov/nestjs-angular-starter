import { AppUnauthorizedException } from './../../shared/exceptions/app-unauthorized-exception';
import { TokenPayload } from '../model/token-payload';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from '../model/refresh-token';
import { User } from '../../users/model/user';
import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import { getClientIp } from 'request-ip';
import { UserMappers } from '../../users/mappers';
import { IAuthConfig } from '../../../config/model';
import { ErrorCode } from '@app/contracts';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  private authConfig: IAuthConfig;

  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    config: ConfigService,
  ) {
    this.authConfig = config.get<IAuthConfig>('auth');
  }

  public async getRefreshTokenSuccessResponse(req: Request) {
    return {
      token: await this.createAccessToken(req.user as User),
    };
  }

  public async getLoginSuccessResponse(req: Request) {
    // I HATE TS RIGHT NOW
    const user = req.user as User;

    const userDto = UserMappers.userToDto(user) as UserDto;

    return {
      token: await this.createAccessToken(user),
      refreshToken: await this.createRefreshToken(req, user),
      user: userDto,
    };
  }

  public async validateRefreshToken(token: string): Promise<RefreshToken> {
    let user: User = null;
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.authConfig.jwtRefreshSecret,
      });
      user = await this.usersService.expectEntityExists(
        payload.sub as string,
        ErrorCode.REFRESH_TOKEN_INVALID,
      );
    } catch (error) {
      this.logger.error(error);
      if (error instanceof TokenExpiredError) {
        throw new AppUnauthorizedException(ErrorCode.REFRESH_TOKEN_EXPIRED);
      } else {
        throw new AppUnauthorizedException(ErrorCode.REFRESH_TOKEN_INVALID);
      }
    }

    await this.usersService.verifyIsAllowedToLogin(user);

    const tokenObjects = await this.refreshTokenModel.find({
      user: user._id,
      isRevoked: false,
      expires: {
        $gte: new Date(),
      },
    });

    if ((tokenObjects?.length ?? 0) === 0) {
      throw new AppUnauthorizedException(ErrorCode.REFRESH_TOKEN_INVALID);
    }

    for (const tokenObj of tokenObjects) {
      if (await bcrypt.compare(token, tokenObj.token)) {
        return tokenObj;
      }
    }

    throw new AppUnauthorizedException(ErrorCode.REFRESH_TOKEN_INVALID);
  }

  private async createAccessToken(user: User): Promise<string> {
    // secret and exp time are set when JWT module is loaded in auth module
    return await this.jwtService.signAsync(await this.getTokenPayload(user));
  }

  private async createRefreshToken(req: Request, user: User): Promise<string> {
    const tokenPayload = await this.getTokenPayload(user);
    const token = await this.jwtService.signAsync(tokenPayload, {
      secret: this.authConfig.jwtRefreshSecret,
      expiresIn: this.authConfig.jwtRefreshExpirationTime,
    });

    const expDate = new Date();
    expDate.setTime(
      expDate.getTime() + this.authConfig.jwtRefreshExpirationTime,
    );

    await this.refreshTokenModel.create({
      user: (req.user as User)._id,
      token,
      ip: this.getIp(req),
      browser: this.getBrowserInfo(req),
      country: this.getCountry(req),
      expires: expDate,
    });

    return token;
  }

  private async getTokenPayload(user: User): Promise<TokenPayload> {
    return {
      username: user.userName,
      sub: user._id,
      role: user.role,
    };
  }

  private getIp(req: Request): string {
    return getClientIp(req);
  }

  private getBrowserInfo(req: Request): string {
    return req.header['user-agent'] || 'XX';
  }

  private getCountry(req: Request): string {
    return req.header['cf-ipcountry'] ? req.header['cf-ipcountry'] : 'XX';
  }
}
