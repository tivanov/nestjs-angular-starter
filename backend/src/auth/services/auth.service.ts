import { AppUnauthorizedException } from './../../shared/exceptions/app-unauthorized-exception';
import { TokenPayload } from '../model/token-payload';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from '../model/refresh-token.model';
import { User } from '../../users/model/user.model';
import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import { getClientIp } from 'request-ip';
import { UserMappers } from '../../users/mappers';
import { IAuthConfig } from '../../../config/model';
import {
  CreateRefreshTokenCommand,
  ErrorCode,
  IdentityProviderEnum,
  UserDto,
} from '@app/contracts';
import * as ms from 'ms';
import { IdentitiesService } from './identities.service';
import { Identity } from '../model/identity.model';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  private authConfig: IAuthConfig;

  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly identities: IdentitiesService,
    config: ConfigService,
  ) {
    this.authConfig = config.get<IAuthConfig>('auth');
  }

  public async getRefreshTokenSuccessResponse(user: User, identity: Identity) {
    return {
      token: await this.createAccessToken(user, identity),
    };
  }

  public async getLoginSuccessResponse(
    req: Request,
    provider: IdentityProviderEnum,
  ) {
    const user = req.user as User;
    const identity = await this.identities.getValid(
      user._id.toHexString(),
      provider,
    );

    // should never happen
    if (!identity) {
      throw new AppUnauthorizedException(ErrorCode.IDENTITY_NOT_FOUND);
    }

    const refreshToken = await this.createRefreshToken(req, user, identity);

    return {
      token: await this.createAccessToken(user, identity),
      refreshToken: refreshToken.token,
      expirationDate: refreshToken.expires?.toISOString(),
      user: UserMappers.userToDto(user) as UserDto,
    };
  }

  public async validateRefreshToken(
    req: Request,
    token: string,
  ): Promise<{ refreshToken: RefreshToken; user: User; identity: Identity }> {
    if (!token) {
      throw new AppUnauthorizedException(ErrorCode.REFRESH_TOKEN_MISSING);
    }

    let payload: TokenPayload = null;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.authConfig.jwtRefreshSecret,
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new AppUnauthorizedException(ErrorCode.REFRESH_TOKEN_EXPIRED);
      } else {
        this.logger.error(error);
        throw new AppUnauthorizedException(ErrorCode.REFRESH_TOKEN_INVALID);
      }
    }

    const tokenDoc = await this.refreshTokenModel
      .findOne({
        token,
        isRevoked: false,
        browser: this.getBrowserInfo(req),
        expires: {
          $gte: new Date(),
        },
      })
      .lean();

    if (!tokenDoc) {
      throw new AppUnauthorizedException(ErrorCode.REFRESH_TOKEN_INVALID);
    }

    const identity = await this.identities.expectEntityExists(
      tokenDoc.identity?.toHexString(),
      ErrorCode.IDENTITY_NOT_FOUND,
    );

    // should never happen
    if (identity.user.toHexString() !== payload.sub) {
      throw new AppUnauthorizedException(ErrorCode.REFRESH_TOKEN_INVALID);
    }

    if (identity.provider !== payload.provider) {
      throw new AppUnauthorizedException(ErrorCode.REFRESH_TOKEN_INVALID);
    }

    if (identity.version !== payload.version) {
      throw new AppUnauthorizedException(ErrorCode.REFRESH_TOKEN_INVALID);
    }

    const user = await this.usersService.expectEntityExists(
      payload.sub as string,
      ErrorCode.USER_NOT_FOUND,
    );

    this.usersService.verifyIsAllowedToLogin(user);

    return { refreshToken: tokenDoc, user, identity };
  }

  private async createAccessToken(
    user: User,
    identity: Identity,
  ): Promise<string> {
    // secret and exp time are set when JWT module is loaded in auth module
    return await this.jwtService.signAsync(
      await this.getTokenPayload(user, identity),
    );
  }

  private async createRefreshToken(
    req: Request,
    user: User,
    identity: Identity,
  ): Promise<RefreshToken> {
    const tokenPayload = await this.getTokenPayload(user, identity);
    const token = await this.jwtService.signAsync(tokenPayload, {
      secret: this.authConfig.jwtRefreshSecret,
      expiresIn: this.authConfig.jwtRefreshExpirationTime,
    });

    const expDate = new Date();
    expDate.setTime(
      expDate.getTime() +
        ms(this.authConfig.jwtRefreshExpirationTime as ms.StringValue),
    );

    const command: CreateRefreshTokenCommand = {
      token,
      ip: this.getIp(req),
      browser: this.getBrowserInfo(req),
      country: this.getCountry(req),
      expires: expDate,
      user: (req.user as User)._id.toHexString(),
      identity: identity._id.toHexString(),
    };

    return await this.refreshTokenModel.create(command);
  }

  private async getTokenPayload(
    user: User,
    identity: Identity,
  ): Promise<TokenPayload> {
    return {
      username: user.userName,
      sub: user._id.toHexString(),
      role: user.role,
      provider: identity.provider,
      version: identity.version,
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
