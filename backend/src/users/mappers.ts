import { IdNameDto } from '@ibet/shared';
import { SimpleUserDto } from '@ibet/shared';
import { AccountMappers } from './../accounts/mappers';
import { BaseMapper } from '../shared/base/base-mapper';
import { UserActionDto } from '@ibet/shared';
import { UserAction } from './model/userAction';
import { UserRoleDto } from '@ibet/shared';
import { UserDto } from '@ibet/shared';
import { User } from './model/user';
import { UserRole, UserRoleDocument } from './model/userRole';
import { OrganisationMappers } from '../organisation/mappers';
import { PaginateResult, Types } from 'mongoose';
import { CreateUserRoleCommand, PagedListDto } from '@ibet/shared';


export class UserMappers extends BaseMapper {
  public static usersToDtoPaginated(source: PaginateResult<User>): PagedListDto<UserDto> {
    return {
      docs: (UserMappers.usersToDto(source.docs) as UserDto[]),
      totalDocs: source.totalDocs,
      limit: source.limit,
      page: source.page,
      totalPages: source.totalPages,
    };
  }

  public static usersToDto(source: User[] | Types.ObjectId[]): UserDto[] | string[] {
    if (!this.isValidArray(source)) {
      return null;
    }

    const res = [];
    source?.forEach((u: Types.ObjectId | User) => res.push(UserMappers.userToDto(u)));
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
      middleName: user.middleName,
      lastName: user.lastName,
      userName: user.userName,
      type: user.type,
      displayName: user.displayName,
      email: user.email,
      address: user.address,
      phone: user.phone,
      status: user.status,
      organisation: OrganisationMappers.organisationToDto(user.organisation),
      roles: UserMappers.rolesToDto(user.roles),
      accounts: AccountMappers.accountsToDto(user.accounts),
      creator: UserMappers.userToDto(user.creator),
      referer: UserMappers.userToDto(user.referer),
      agent: UserMappers.userToDto(user.agent),
    };
  }

  public static rolesToDto(source: UserRole[] | Types.ObjectId[]): UserRoleDto[] | string[] {
    if (!this.isValidArray(source)) {
      return null;
    }

    const res = [];
    source?.forEach((u: Types.ObjectId | UserRole) => res.push(UserMappers.roleToDto(u)));
    return res;
  }

  public static roleToDto(source: UserRole | Types.ObjectId): UserRoleDto | string {
    if (!this.isValidDocument(source)) {
      return BaseMapper.objectIdToString(source);
    }

    const role = source as UserRole;

    return {
      id: role._id,
      organisation: (role.organisation as Types.ObjectId)?.toHexString(),
      name: role.name,
      description: role.description,
      isActive: role.isActive,
      isDefault: role.isDefault,
      forIntegration: role.forIntegration,
      allowedActions: UserMappers.actionsToDto(role.allowedActions)
    };
  }

  public static roleToCreateCommand(source: UserRole): CreateUserRoleCommand {
    return {
      name: source.name,
      description: source.description,
      isActive: source.isActive,
      isDefault: source.isDefault,
      forIntegration: source.forIntegration,
      organisation: source.organisation?.toHexString(),
      allowedActions: source.allowedActions?.map((action) => action.toHexString())
    };
  }

  public static actionsToDto(source: UserAction[] | Types.ObjectId[]): UserActionDto[] | string[] {
    if (!this.isValidArray(source)) {
      return null;
    }

    const res = [];
    source?.forEach((u: Types.ObjectId | UserAction) => res.push(UserMappers.actionToDto(u)));
    return res;
  }

  public static actionToDto(source: UserAction | Types.ObjectId): UserActionDto | string {
    if (!this.isValidDocument(source)) {
      return BaseMapper.objectIdToString(source);
    }
    const action = source as UserAction;

    const dto: UserActionDto = {
      id: action._id,
      name: action.name,
      code: action.code,
      description: action.description,
      isActive: action.isActive,
    };

    if ((action.availableInOu?.length ?? 0) > 0) {
      dto.availableInOu = [];
      action.availableInOu.forEach((ou) => dto.availableInOu.push(BaseMapper.objectIdToString(ou)));
    }

    return dto;
  }

  public static userToSimpleDto(source: User | Types.ObjectId): SimpleUserDto | string {
    if (!this.isValidDocument(source)) {
      return BaseMapper.objectIdToString(source);
    }

    const user = source as User;

    return {
      id: user._id,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      userName: user.userName,
      type: user.type,
      displayName: user.displayName,
      email: user.email,
      address: user.address,
      phone: user.phone,
      status: user.status,
      organisation: OrganisationMappers.organisationToSimpleDto(user.organisation),
      creator: UserMappers.userToIdName(user.creator),
      referer: UserMappers.userToIdName(user.referer),
      agent: UserMappers.userToIdName(user.agent),
    };
  }

  public static userToIdName(source: User | Types.ObjectId): IdNameDto | string {
    if (!this.isValidDocument(source)) {
      return BaseMapper.objectIdToString(source);
    }

    const user = source as User;

    let name = user.displayName;

    if (!name) {
      name = user.firstName;

      if (user.lastName) {
        name += ' ' + user.lastName;
      }
    }

    return {
      id: user._id,
      name: name || 'N/A',
    };
  }
}
