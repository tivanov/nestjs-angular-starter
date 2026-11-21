import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../shared/base/base-service.js';
import { User, UserDocument } from '../model/user.model.js';
import { InjectModel } from '@nestjs/mongoose';
import { IAppConfig, IAuthConfig } from '../../../config/model.js';
import type { PaginateModel, PaginateResult, QueryFilter } from 'mongoose';
import { Types } from 'mongoose';
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
import { AppUnauthorizedException } from './../../shared/exceptions/app-unauthorized-exception.js';
import bcrypt from 'bcrypt';
import { AppBadRequestException } from '../../shared/exceptions/app-bad-request-exception.js';
import { LoginRecordsService } from './login-records.service.js';
import { Request } from 'express';
import { AppNotFoundException } from '../../shared/exceptions/app-not-found-exception.js';
import { IdentitiesService } from '../../auth/services/identities.service.js';
import path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class UsersService extends BaseService<User> {
  /** Not a real credential. Equalizes bcrypt time when login cannot pick one user. */
  private static readonly dummyPasswordHash =
    '$2b$10$Pobh.GNclq7f5.uxSpLuUeAK55p8pcRnw3Soa/f.qtztgY1sGXdue';

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

    return await (this.objectModel as PaginateModel<User>).paginate(
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
    const user = await this.findLoginUser(userName);
    if (!user) {
      await this.fakePasswordCheck(password);
      throw new AppUnauthorizedException(ErrorCode.INVALID_USERNAME_PASSWORD);
    }

    this.verifyIsAllowedToLogin(user);

    if (!(await this.passwordMatches(user, password))) {
      await this.incrementLoginAttempts(user._id);
      throw new AppUnauthorizedException(ErrorCode.INVALID_USERNAME_PASSWORD);
    }

    await this.resetLoginAttempts(user._id);
    this.loginRecords.addInBackground(user, request);
    await this.registerActivity(user._id.toHexString());
    return user;
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

  private async findLoginUser(userName: string): Promise<User | undefined> {
    const users = await this.objectModel.find({ userName }).lean();
    if (users?.length !== 1) {
      return undefined;
    }

    return users[0];
  }

  private async passwordMatches(
    user: User,
    password: string,
  ): Promise<boolean> {
    const identity = await this.identities.getValid(
      user._id.toHexString(),
      IdentityProviderEnum.UserName,
    );

    if (!identity?.secret) {
      await this.fakePasswordCheck(password);
      return false;
    }

    return bcrypt.compare(password, identity.secret);
  }

  private fakePasswordCheck(password: string): Promise<boolean> {
    return bcrypt.compare(password, UsersService.dummyPasswordHash);
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
}
