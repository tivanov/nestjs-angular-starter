import { BaseMapper } from 'src/shared/base/base-mapper';
import { Identity } from './model/identity.model';
import { PaginateResult, Types } from 'mongoose';
import { UserMappers } from 'src/users/mappers';
import { IdentityDto, PagedListDto } from '@app/contracts';

export class AuthMappers extends BaseMapper {
  public static identitiesToDto(
    source: Identity[] | Types.ObjectId[],
  ): IdentityDto[] | string[] {
    if (!this.isValidArray(source)) {
      return null;
    }

    return source.map((c) => AuthMappers.identityToDto(c) as any);
  }

  public static identityToDto(
    source: Identity | Types.ObjectId,
  ): IdentityDto | string {
    if (!this.isValidDocument(source)) {
      return BaseMapper.objectIdToString(source);
    }

    const quest = source as Identity;

    return {
      id: quest._id.toHexString(),
      createdAt: quest.createdAt?.toISOString(),
      updatedAt: quest.updatedAt?.toISOString(),
      uid: quest.uid,
      userName: quest.userName,
      provider: quest.provider,
      user: UserMappers.userToIdName(quest.user),
      version: quest.version,
      expirationDate: quest.expirationDate?.toISOString(),
    };
  }

  public static identitiesToDtoPaged(
    source: PaginateResult<Identity>,
  ): PagedListDto<IdentityDto> {
    return {
      docs: AuthMappers.identitiesToDto(source.docs) as IdentityDto[],
      totalDocs: source.totalDocs,
      limit: source.limit,
      page: source.page,
      totalPages: source.totalPages,
    };
  }
}
