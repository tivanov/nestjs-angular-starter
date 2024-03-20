import { PaginateResult, Types } from 'mongoose';
import { BaseMapper } from '../shared/base/base-mapper';
import { PagedListDto, UserDto, UserSettingsDto } from '@app/contracts';
import { User } from './model/user';
import { UserSettings } from './model/userSettings';

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
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      role: user.role,
      displayName: user.displayName,
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
}
