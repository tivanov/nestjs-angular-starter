import { AlertDto, ContactRequestDto, PagedListDto } from '@app/contracts';
import { BaseMapper } from 'src/shared/base/base-mapper';
import { Alert } from './model/alert.model';
import { PaginateResult, Types } from 'mongoose';
import { ContactRequest } from './model/contact-request.model';

export class NotificationMappers extends BaseMapper {
  public static alertsToDtoPaged(
    source: PaginateResult<Alert>,
  ): PagedListDto<AlertDto> {
    return {
      docs: NotificationMappers.alertsToDto(source.docs) as AlertDto[],
      totalDocs: source.totalDocs,
      limit: source.limit,
      page: source.page,
      totalPages: source.totalPages,
    };
  }

  public static alertsToDto(
    source: Alert[] | Types.ObjectId[],
  ): AlertDto[] | string[] {
    if (!this.isValidArray(source)) {
      return null;
    }

    const res = [];
    source?.forEach((u: Types.ObjectId | Alert) =>
      res.push(NotificationMappers.alertToDto(u)),
    );
    return res;
  }

  public static alertToDto(source: Alert | Types.ObjectId): AlertDto | string {
    if (!this.isValidDocument(source)) {
      return BaseMapper.objectIdToString(source);
    }

    const user = source as Alert;

    return {
      id: user._id.toHexString(),
      createdAt: user.createdAt.toISOString(),
      type: user.type,
      message: user.message,
      jsonData: user.jsonData,
      isRead: user.isRead,
    };
  }

  public static contactRequestToDto(
    source: ContactRequest | Types.ObjectId,
  ): ContactRequestDto | string {
    if (!this.isValidDocument(source)) {
      return BaseMapper.objectIdToString(source);
    }

    const doc = source as ContactRequest;

    return {
      id: doc._id.toHexString(),
      createdAt: doc.createdAt.toISOString(),
      type: doc.type,
      status: doc.status,
      name: doc.name,
      company: doc.company,
      message: doc.message,
      email: doc.email,
    };
  }

  public static contactRequestsToDto(
    source: ContactRequest[] | Types.ObjectId[],
  ): ContactRequestDto[] | string[] {
    if (!this.isValidArray(source)) {
      return null;
    }

    const res = [];
    source?.forEach((u: Types.ObjectId | ContactRequest) =>
      res.push(NotificationMappers.contactRequestToDto(u)),
    );
    return res;
  }

  public static contactRequestToDtoPaged(
    source: PaginateResult<ContactRequest>,
  ): PagedListDto<ContactRequestDto> {
    return {
      docs: NotificationMappers.contactRequestsToDto(
        source.docs,
      ) as ContactRequestDto[],
      totalDocs: source.totalDocs,
      limit: source.limit,
      page: source.page,
      totalPages: source.totalPages,
    };
  }
}
