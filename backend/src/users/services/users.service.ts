import { AppBadRequestException } from './../../shared/exceptions/app-bad-request-exception';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/shared/base/base-service';
import { User } from '../model/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { IAuthConfig } from 'config/model';
import {
  ClientSession,
  Model,
  PaginateModel,
  PaginateResult,
  Types,
} from 'mongoose';
import { UserSettings } from '../model/userSettings.model';
import { ConfigService } from '@nestjs/config';
import {
  ErrorCode,
  GetUsersQuery,
  UpdateUserDataCommand,
  UpdateUserPasswordCommand,
} from '@app/contracts';
import { AppUnauthorizedException } from './../../shared/exceptions/app-unauthorized-exception';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService extends BaseService<User> {
  private authConfig: IAuthConfig;

  constructor(
    @InjectModel(User.name) userModel: PaginateModel<User>,
    @InjectModel(UserSettings.name)
    private readonly settingsModel: Model<UserSettings>,
    config: ConfigService,
  ) {
    super(userModel);
    this.authConfig = config.get<IAuthConfig>('auth');
  }

  public getDisplayName(firstName: string, lastName: string): string {
    let name = firstName;

    if (lastName) {
      name += ' ' + lastName;
    }

    return name;
  }

  async getByEmail(email: string): Promise<User | undefined> {
    return await this.objectModel
      .findOne({
        email,
      })
      .lean();
  }

  public async expectUserNotExists(
    email?: string,
    userName?: string,
    phone?: string,
    session?: ClientSession,
  ) {
    if (email) {
      if (
        await this.existsInSession(
          {
            email,
          },
          session,
        )
      ) {
        throw new AppBadRequestException(ErrorCode.USER_EMAIL_EXISTS);
      }
    }

    if (phone) {
      if (
        await this.existsInSession(
          {
            phone,
          },
          session,
        )
      ) {
        throw new AppBadRequestException(ErrorCode.USER_PHONE_EXISTS);
      }
    }

    if (userName) {
      if (
        await this.existsInSession(
          {
            userName,
          },
          session,
        )
      ) {
        throw new AppBadRequestException(ErrorCode.USER_NAME_EXISTS);
      }
    }
  }

  async get(query: GetUsersQuery): Promise<PaginateResult<User>> {
    const filter: { [key: string]: any } = {};

    if (query.userName) {
      filter.userName = query.userName;
    }

    if (query.role) {
      filter.role = query.role;
    }

    return await (this.objectModel as PaginateModel<User>).paginate(
      filter,
      this.getPaginationOptions(query),
    );
  }

  public async serviceLogin(userId: Types.ObjectId): Promise<User> {
    const user = await this.objectModel
      .findOne({
        _id: userId,
      })
      .lean();

    try {
      await this.verifyIsAllowedToLogin(user);
      await this.runPostLogin(user, true);
      return user;
    } catch (error) {
      await this.runPostLogin(user, false);
      throw error;
    }
  }

  public async login(userName: string, password: string): Promise<User> {
    const user = await this.validateCredentialsGetUser(userName, password);
    try {
      await this.verifyIsAllowedToLogin(user);
      await this.runPostLogin(user, true);
      delete user.password;
      return user;
    } catch (error) {
      await this.runPostLogin(user, false);
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

    // TODO: check if I need more
  }

  public async updateBasicData(
    id: string,
    userData: UpdateUserDataCommand,
  ): Promise<User> {
    return await this.objectModel.findByIdAndUpdate(
      id,
      {
        firstName: userData.firstName,
        lastName: userData.lastName,
        displayName:
          userData.displayName ||
          this.getDisplayName(userData.firstName, userData.lastName),
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
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

  public async updatePassword(command: UpdateUserPasswordCommand) {
    const user = await this.expectEntityExists(
      command.userId,
      ErrorCode.USER_NOT_FOUND,
    );
    // TODO: use a different counter for password reset
    await this.verifyIsAllowedToLogin(user);

    if (!(await bcrypt.compare(command.oldPassword, user.password))) {
      await this.incrementLoginAttempts(new Types.ObjectId(command.userId));
      throw new AppUnauthorizedException(ErrorCode.INVALID_PASSWORD);
    }

    user.password = command.newPassword;

    await user.save();

    return user;
  }

  public addAccount(id: any, accountId: any, session: ClientSession) {
    return this.objectModel.findByIdAndUpdate(
      id,
      {
        $push: {
          accounts: accountId,
        },
      },
      { session, lean: true, new: true },
    );
  }

  private async blockUser(user: User) {
    const blockUntil = new Date();
    blockUntil.setTime(blockUntil.getTime() + this.authConfig.userBlockTime);
    user.blockExpires = blockUntil;
    user.loginAttempts = 0;
    await user.save();
  }

  private async runPostLogin(user: User, success: boolean) {
    if (success) {
      await this.verifyIsAllowedToLogin(user);
      await this.resetLoginAttempts(user._id as Types.ObjectId);
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
