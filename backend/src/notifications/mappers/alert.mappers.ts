import { AlertDto, ContactRequestDto, PagedListDto } from '@app/contracts';
import { BaseMapper } from 'src/shared/base/base-mapper';
import { Alert } from '../model/alert.model';
import { PaginateResult, Types } from 'mongoose';

export class AlertMappers extends BaseMapper {
  public static toDtosPaged(
    source: PaginateResult<Alert>,
  ): PagedListDto<AlertDto> {
    return {
      docs: AlertMappers.toDtos(source.docs) as AlertDto[],
      totalDocs: source.totalDocs,
      limit: source.limit,
      page: source.page,
      totalPages: source.totalPages,
    };
  }

  public static toDtos(
    source: Alert[] | Types.ObjectId[],
  ): AlertDto[] | string[] {
    if (!this.isValidArray(source)) {
      return null;
    }

    const res = [];
    source?.forEach((u: Types.ObjectId | Alert) =>
      res.push(AlertMappers.toDto(u)),
    );
    return res;
  }

  public static toDto(source: Alert | Types.ObjectId): AlertDto | string {
    if (!this.isValidDocument(source)) {
      return BaseMapper.objectIdToString(source);
    }

    const doc = source as Alert;

    return {
      id: doc._id.toHexString(),
      createdAt: doc.createdAt.toISOString(),
      type: doc.type,
      message: doc.message,
      jsonData: doc.jsonData,
      isRead: doc.isRead,
    };
  }
}
