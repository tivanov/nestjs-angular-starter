import { BaseMapper } from 'src/shared/base/base-mapper';
import { Identity } from '../model/identity.model';
import { PaginateResult, Types } from 'mongoose';
import { IdentityDto, PagedListDto } from '@app/contracts';
import { UserMappers } from 'src/users/mappers/user.mappers';

export class IdentityMappers extends BaseMapper {
  public static toDtos(
    source: Identity[] | Types.ObjectId[],
  ): IdentityDto[] | string[] {
    if (!this.isValidArray(source)) {
      return null;
    }

    return source.map((c) => IdentityMappers.toDto(c) as any);
  }

  public static toDto(source: Identity | Types.ObjectId): IdentityDto | string {
    if (!this.isValidDocument(source)) {
      return BaseMapper.objectIdToString(source);
    }

    const doc = source as Identity;

    return {
      id: doc._id.toHexString(),
      createdAt: doc.createdAt?.toISOString(),
      updatedAt: doc.updatedAt?.toISOString(),
      uid: doc.uid,
      userName: doc.userName,
      provider: doc.provider,
      user: UserMappers.toIdName(doc.user),
      version: doc.version,
      expirationDate: doc.expirationDate?.toISOString(),
    };
  }

  public static toDtosPaged(
    source: PaginateResult<Identity>,
  ): PagedListDto<IdentityDto> {
    return {
      docs: IdentityMappers.toDtos(source.docs) as IdentityDto[],
      totalDocs: source.totalDocs,
      limit: source.limit,
      page: source.page,
      totalPages: source.totalPages,
    };
  }
}
