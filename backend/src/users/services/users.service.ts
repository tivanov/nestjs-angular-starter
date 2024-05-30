import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/base/base-service';
import { User, UserDocument } from '../model/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { IAuthConfig } from 'config/model';
import { Model, PaginateModel, PaginateResult, Types } from 'mongoose';
import { UserSettings } from '../model/userSettings.model';
import { ConfigService } from '@nestjs/config';
import {
  CreateUserCommand,
  ErrorCode,
  GetUsersQuery,
  UpdateUserDataCommand,
} from '@app/contracts';
import { AppUnauthorizedException } from './../../shared/exceptions/app-unauthorized-exception';
import * as bcrypt from 'bcrypt';
import { AppBadRequestException } from 'src/shared/exceptions/app-bad-request-exception';

@Injectable()
export class UsersService extends BaseService<UserDocument> {
  private authConfig: IAuthConfig;

  constructor(
    @InjectModel(User.name) userModel: PaginateModel<UserDocument>,
    @InjectModel(UserSettings.name)
    private readonly settingsModel: Model<UserSettings>,
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

    return await (this.objectModel as PaginateModel<UserDocument>).paginate(
      filter,
      this.getPaginationOptions(query),
    );
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

  private async blockUser(user: UserDocument) {
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
