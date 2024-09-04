import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from 'src/shared/base/base-service';
import { User, UserDocument } from '../model/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { IAuthConfig } from 'config/model';
import { FilterQuery, PaginateModel, PaginateResult, Types } from 'mongoose';
import { UserSettings } from '../model/userSettings.model';
import { ConfigService } from '@nestjs/config';
import {
  CreateUserCommand,
  ErrorCode,
  GetUsersQuery,
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

@Injectable()
export class UsersService extends BaseService<UserDocument> {
  private logger = new Logger(UsersService.name);
  private authConfig: IAuthConfig;

  constructor(
    @InjectModel(User.name) userModel: PaginateModel<UserDocument>,
    private readonly loginRecords: LoginRecordsService,
    config: ConfigService,
  ) {
    super(userModel);
    this.authConfig = config.get<IAuthConfig>('auth');
  }

  async get(query: GetUsersQuery): Promise<PaginateResult<User>> {
    const filter: { [key: string]: any } = {};

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
    user.password = command.password;
    await user.save();
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
    return await this.baseCreate(command);
  }

  public async login(
    userName: string,
    password: string,
    request: Request,
  ): Promise<User> {
    const user = await this.validateCredentialsGetUser(userName, password);
    try {
      await this.verifyIsAllowedToLogin(user);
      await this.runPostLogin(user, true, request);
      delete user.password;
      return user;
    } catch (error) {
      await this.runPostLogin(user, false, request);
      throw error;
    }
  }

  public async verifyIsAllowedToLogin(user: User) {
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
      const filter: FilterQuery<UserDocument> = {
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

      const filter: FilterQuery<UserDocument> = {
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
    const filter: FilterQuery<UserDocument> = {
      role: UserRoleEnum.Regular,
    };
    return this.objectModel.countDocuments(filter);
  }

  updateAvatar(id: string, frontendPath: string) {
    return this.baseUpdate(id, { avatar: frontendPath });
  }

  private async blockUser(user: UserDocument) {
    const blockUntil = new Date();
    blockUntil.setTime(blockUntil.getTime() + this.authConfig.userBlockTime);
    user.blockExpires = blockUntil;
    user.loginAttempts = 0;
    await user.save();
  }

  private async runPostLogin(user: User, success: boolean, request: Request) {
    if (success) {
      await this.verifyIsAllowedToLogin(user);
      await this.resetLoginAttempts(user._id as Types.ObjectId);
      this.loginRecords
        .addLoginEntry(user, request)
        .then((loginRecord) => {
          if (loginRecord?.countryCode) {
            this.setCountry(user._id as Types.ObjectId, loginRecord.countryCode)
              .then(() => null)
              .catch((err) => {
                this.logger.error(
                  'Error while saving user country',
                  err.stack,
                  err,
                );
              });
          }
        })
        .catch((err) =>
          this.logger.error('Error while saving login records', err.stack, err),
        );
      await this.registerActivity(user._id.toHexString());
    } else {
      await this.incrementLoginAttempts(user._id as Types.ObjectId);
    }
  }

  private async incrementLoginAttempts(userId: Types.ObjectId) {
    const user = await this.objectModel.findById(userId);
    user.loginAttempts += 1;
    await user.save();

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

    if (!user.password) {
      throw new AppUnauthorizedException(ErrorCode.INVALID_USERNAME_PASSWORD);
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new AppUnauthorizedException(ErrorCode.INVALID_USERNAME_PASSWORD);
    }

    return user;
  }
}
