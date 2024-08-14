import { PaginateResult, Types } from 'mongoose';
import { BaseMapper } from '../shared/base/base-mapper';
import {
  LoginRecordDto,
  PagedListDto,
  UserDto,
  UserSettingsDto,
} from '@app/contracts';
import { User } from './model/user.model';
import { UserSettings } from './model/userSettings.model';
import { LoginRecord } from './model/login-record.model';

export class UserMappers extends BaseMapper {
  public static usersToDtoPaginated(
    source: PaginateResult<User>,
  ): PagedListDto<UserDto> {
    return {
      docs: UserMappers.usersToDto(source.docs) as UserDto[],
      totalDocs: source.totalDocs,
      limit: source.limit,
      page: source.page,
      totalPages: source.totalPages,
    };
  }

  public static usersToDto(
    source: User[] | Types.ObjectId[],
  ): UserDto[] | string[] {
    if (!this.isValidArray(source)) {
      return null;
    }

    const res = [];
    source?.forEach((u: Types.ObjectId | User) =>
      res.push(UserMappers.userToDto(u)),
    );
    return res;
  }

  public static userToDto(source: User | Types.ObjectId): UserDto | string {
    if (!this.isValidDocument(source)) {
      return BaseMapper.objectIdToString(source);
    }

    const user = source as User;

    return {
      id: user._id.toHexString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      lastLogin: user.lastLogin?.toISOString(),
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      role: user.role,
      displayName: UserMappers.userToDisplayName(user),
      email: user.email,
      address: user.address,
      phone: user.phone,
      creator: UserMappers.userToDto(user.creator),
      settings: UserMappers.userSettingsToDto(user.settings),
    };
  }

  static userSettingsToDto(settings: UserSettings): UserSettingsDto {
    if (!settings) {
      return null;
    }

    return {
      currencyCode: settings.currencyCode,
      theme: settings.theme,
      language: settings.language,
    };
  }

  public static loginRecordsToDtoPaginated(
    source: PaginateResult<LoginRecord>,
  ): PagedListDto<LoginRecordDto> {
    return {
      docs: UserMappers.loginRecordsToDto(source.docs) as LoginRecordDto[],
      totalDocs: source.totalDocs,
      limit: source.limit,
      page: source.page,
      totalPages: source.totalPages,
    };
  }

  public static loginRecordsToDto(
    source: LoginRecord[] | Types.ObjectId[],
  ): LoginRecordDto[] | string[] {
    if (!this.isValidArray(source)) {
      return null;
    }

    const res = [];
    source?.forEach((u: Types.ObjectId | LoginRecord) =>
      res.push(UserMappers.loginRecordToDto(u)),
    );
    return res;
  }

  public static loginRecordToDto(
    source: LoginRecord | Types.ObjectId,
  ): LoginRecordDto | string {
    if (!this.isValidDocument(source)) {
      return BaseMapper.objectIdToString(source);
    }

    const user = source as LoginRecord;

    return {
      id: user._id.toHexString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      ip: user.ip,
      countryCode: user.countryCode,
      countryName: user.countryName,
      regionName: user.regionName,
      cityName: user.cityName,
      clientType: user.clientType,
      clientName: user.clientName,
      osName: user.osName,
      deviceType: user.deviceType,
      deviceName: user.deviceName,
      isBot: user.isBot,
      user: UserMappers.userToDto(user.user),
    };
  }

  public static userToDisplayName(source: User): string {
    if (!source) {
      return 'N/A';
    }

    let name = source.firstName;

    if (source.lastName) {
      name += ' ' + source.lastName;
    }

    if (!name) {
      name = source.userName;
    }

    if (!name) {
      name = source.email;
    }

    return name;
  }
}
