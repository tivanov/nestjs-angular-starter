import {
  PagedListDto,
  UserDto,
  UserSettingsDto,
  IdNameDto,
} from '@app/contracts';
import { PaginateResult, Types } from 'mongoose';
import { BaseMapper } from 'src/shared/base/base-mapper';
import { User } from '../model/user.model';
import { UserSettings } from '../model/userSettings.model';

export class UserMappers extends BaseMapper {
  public static toDtosPaged(
    source: PaginateResult<User>,
  ): PagedListDto<UserDto> {
    return {
      docs: UserMappers.toDtos(source.docs) as UserDto[],
      totalDocs: source.totalDocs,
      limit: source.limit,
      page: source.page,
      totalPages: source.totalPages,
    };
  }

  public static toDtos(
    source: User[] | Types.ObjectId[],
  ): UserDto[] | string[] {
    if (!this.isValidArray(source)) {
      return null;
    }

    const res = [];
    source?.forEach((u: Types.ObjectId | User) =>
      res.push(UserMappers.toDto(u)),
    );
    return res;
  }

  public static toDto(source: User | Types.ObjectId): UserDto | string {
    if (!this.isValidDocument(source)) {
      return BaseMapper.objectIdToString(source);
    }

    const user = source as User;

    return {
      id: user._id.toHexString(),
      avatar: user.avatar,
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
      lastLogin: user.lastLogin?.toISOString(),
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      role: user.role,
      displayName: UserMappers.userToDisplayName(user),
      email: user.email,
      address: user.address,
      phone: user.phone,
      creator: UserMappers.toDto(user.creator),
      settings: UserMappers.settingsToDto(user.settings),
    };
  }

  static settingsToDto(settings: UserSettings): UserSettingsDto {
    if (!settings) {
      return null;
    }

    return {
      currencyCode: settings.currencyCode,
      theme: settings.theme,
      language: settings.language,
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

  public static toIdName(source?: User | Types.ObjectId): IdNameDto | string {
    if (!this.isValidDocument(source)) {
      return BaseMapper.objectIdToString(source);
    }

    const doc = source as User;

    return {
      id: doc._id.toHexString(),
      name: UserMappers.userToDisplayName(doc) || 'N/A',
      name2: doc.userName,
      name3: doc.avatar,
    };
  }
}
