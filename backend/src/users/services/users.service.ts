import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from 'src/shared/base/base-service';
import { User, UserDocument } from '../model/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { IAppConfig, IAuthConfig } from 'config/model';
import { PaginateModel, PaginateResult, Types, Model, QueryFilter } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import {
  Constants,
  CreateIdentityCommand,
  CreateUserCommand,
  ErrorCode,
  GetUsersQuery,
  IdentityProviderEnum,
  UpdateUserDataCommand,
  UpdateUserPasswordCommand,
  UserRoleEnum,
} from '@app/contracts';
import { AppUnauthorizedException } from './../../shared/exceptions/app-unauthorized-exception';
import * as bcrypt from 'bcrypt';
import { AppBadRequestException } from 'src/shared/exceptions/app-bad-request-exception';
import { LoginRecordsService } from './login-records.service';
import { Request } from 'express';
import { AppNotFoundException } from 'src/shared/exceptions/app-not-found-exception';
import { IdentitiesService } from 'src/auth/services/identities.service';
import path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class UsersService extends BaseService<User> {
  private logger = new Logger(UsersService.name);
  private authConfig: IAuthConfig;
  private appConfig: IAppConfig;

  constructor(
    @InjectModel(User.name) userModel: PaginateModel<User>,
    private readonly loginRecords: LoginRecordsService,
    private readonly identities: IdentitiesService,
    config: ConfigService,
  ) {
    super(userModel);
    this.authConfig = config.get<IAuthConfig>('auth');
    this.appConfig = config.get<IAppConfig>('app');
  }

  async get(query: GetUsersQuery): Promise<PaginateResult<User>> {
    const filter: QueryFilter<User> = {};

    if (query.userName) {
      filter.userName = query.userName;
    }

    if (query.role) {
      filter.role = query.role;
    }

    if (query.searchQuery) {
      filter.$text = { $search: query.searchQuery };
    }

    return await (this.objectModel as PaginateModel<UserDocument>).paginate(
      filter,
      this.getPaginationOptions(query),
    );
  }

  public async updatePassword(
    userId: string,
    command: UpdateUserPasswordCommand,
  ): Promise<User> {
    const user = await this.objectModel.findById(userId);
    if (!user) {
      throw new AppNotFoundException(ErrorCode.USER_NOT_FOUND);
    }
    const identity = await this.identities.getValid(
      userId,
      IdentityProviderEnum.UserName,
    );
    if (!identity) {
      throw new AppBadRequestException(ErrorCode.IDENTITY_NOT_FOUND);
    }

    const password = await bcrypt.hash(command.password, 10);

    await this.identities.updateSecret(
      identity._id.toHexString(),
      password,
      command.logOutEverywhere,
    );

    return user;
  }

  public async expectUserNameNotExists(userName: string) {
    const user = await this.objectModel.exists({ userName });
    if (user) {
      throw new AppBadRequestException(ErrorCode.USER_NAME_EXISTS);
    }
  }

  public async create(command: CreateUserCommand): Promise<User> {
    await this.expectUserNameNotExists(command.userName);

    const password = await bcrypt.hash(command.password, 10);
    delete command.password;

    const user = await this.baseCreate(command);
    const identityCmd: CreateIdentityCommand = {
      uid: user.userName,
      userName: user.userName,
      provider: IdentityProviderEnum.UserName,
      secret: password,
      expirationDate: Constants.EndOfTime,
      version: 1,
      user: user._id.toHexString(),
    };
    await this.identities.baseCreate(identityCmd);
    return user;
  }

  public async login(
    userName: string,
    password: string,
    request: Request,
  ): Promise<User> {
    const user = await this.validateCredentialsGetUser(userName, password);
    try {
      await this.runPostLogin(user, true, request);
      return user;
    } catch (error) {
      await this.runPostLogin(user, false, request);
      throw error;
    }
  }

  public verifyIsAllowedToLogin(user: User) {
    const now = new Date();
    if (user.blockExpires && user.blockExpires > now) {
      throw new AppUnauthorizedException(ErrorCode.USER_IS_BLOCKED);
    }

    if (user.loginAttempts >= this.authConfig.loginAttempts) {
      throw new AppUnauthorizedException(ErrorCode.TOO_MANY_LOGIN_ATTEMPTS);
    }
  }

  public async updateBasicData(
    id: string,
    userData: UpdateUserDataCommand,
  ): Promise<User> {
    return await this.objectModel.findByIdAndUpdate(
      id,
      {
        $set: userData,
      },
      { new: true },
    );
  }

  async deleteUser(userId: string): Promise<User> {
    const existing = await this.expectEntityExists(
      userId,
      ErrorCode.USER_NOT_FOUND,
    );
    await this.objectModel.findOneAndDelete({ _id: userId });

    try {
      const savePath = path.join(this.appConfig.uploadsDir, 'avatars');
      const fileFullPath = path.join(savePath, `${existing._id}.webp`);
      await fs.unlink(fileFullPath);
    } catch (error) {
      this.logError(this.logger, error);
    }
    return existing;
  }

  registerActivity(id: string) {
    return this.objectModel.findByIdAndUpdate(id, {
      lastLogin: new Date(),
    });
  }

  setCountry(userId: Types.ObjectId, countryCode: string) {
    return this.objectModel.findByIdAndUpdate(userId, {
      country: countryCode,
    });
  }

  getRegisteredTodayCount() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const filter: QueryFilter<UserDocument> = {
        createdAt: { $gte: today },
        role: UserRoleEnum.Regular,
      };

      return this.objectModel.countDocuments(filter);
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  getInactiveUsersCount() {
    try {
      const threshold = new Date();
      threshold.setTime(threshold.getTime() - 5 * 24 * 60 * 60 * 1000);

      const filter: QueryFilter<UserDocument> = {
        $or: [
          { lastLogin: { $exists: false } },
          { lastLogin: { $lt: threshold } },
        ],
        role: UserRoleEnum.Regular,
      };

      return this.objectModel.countDocuments(filter);
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  getRegularUsersCount() {
    const filter: QueryFilter<UserDocument> = {
      role: UserRoleEnum.Regular,
    };
    return this.objectModel.countDocuments(filter);
  }

  updateAvatar(id: string, frontendPath: string): Promise<User> {
    return this.baseUpdate(id, { avatar: frontendPath });
  }

  private async blockUser(user: User) {
    const blockUntil = new Date();
    blockUntil.setTime(blockUntil.getTime() + this.authConfig.userBlockTime);
    return await this.objectModel.findByIdAndUpdate(
      user._id,
      {
        blockExpires: blockUntil,
        loginAttempts: 0,
      },
      {
        new: true,
        lean: true,
      },
    );
  }

  private async runPostLogin(user: User, success: boolean, request: Request) {
    if (success) {
      this.verifyIsAllowedToLogin(user);
      await this.resetLoginAttempts(user._id as Types.ObjectId);
      this.loginRecords.addInBackground(user, request);
      await this.registerActivity(user._id.toHexString());
    } else {
      await this.incrementLoginAttempts(user._id as Types.ObjectId);
    }
  }

  private async incrementLoginAttempts(userId: Types.ObjectId) {
    const user = await this.objectModel.findByIdAndUpdate(
      userId,
      {
        $inc: { loginAttempts: 1 },
      },
      { new: true, lean: true },
    );

    if (user.loginAttempts >= this.authConfig.loginAttempts) {
      await this.blockUser(user);
    }
  }

  private async resetLoginAttempts(userId: Types.ObjectId) {
    await this.objectModel.findByIdAndUpdate(userId, { loginAttempts: 0 });
  }

  private async validateCredentialsGetUser(
    userName: string,
    password: string,
  ): Promise<User> {
    const users = await this.objectModel
      .find({
        userName,
      })
      .lean();

    if ((users?.length ?? 0) !== 1) {
      throw new AppUnauthorizedException(ErrorCode.MULTIPLE_OR_NO_USERS_FOUND);
    }

    const user = users.pop();

    const identity = await this.identities.getValid(
      user._id.toHexString(),
      IdentityProviderEnum.UserName,
    );

    if (!identity?.secret) {
      throw new AppUnauthorizedException(ErrorCode.INVALID_USERNAME_PASSWORD);
    }

    if (!(await bcrypt.compare(password, identity.secret))) {
      throw new AppUnauthorizedException(ErrorCode.INVALID_USERNAME_PASSWORD);
    }

    return user;
  }
}
