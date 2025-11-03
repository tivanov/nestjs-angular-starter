import { ContactRequestDto, PagedListDto } from '@app/contracts';
import { BaseMapper } from 'src/shared/base/base-mapper';
import { PaginateResult, Types } from 'mongoose';
import { ContactRequest } from '../model/contact-request.model';

export class ContactRequestMappers extends BaseMapper {
  public static toDto(
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

  public static toDtos(
    source: ContactRequest[] | Types.ObjectId[],
  ): ContactRequestDto[] | string[] {
    if (!this.isValidArray(source)) {
      return null;
    }

    const res = [];
    source?.forEach((u: Types.ObjectId | ContactRequest) =>
      res.push(ContactRequestMappers.toDto(u)),
    );
    return res;
  }

  public static toDtosPaged(
    source: PaginateResult<ContactRequest>,
  ): PagedListDto<ContactRequestDto> {
    return {
      docs: ContactRequestMappers.toDtos(source.docs) as ContactRequestDto[],
      totalDocs: source.totalDocs,
      limit: source.limit,
      page: source.page,
      totalPages: source.totalPages,
    };
  }
}
