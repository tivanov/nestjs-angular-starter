import { PagedListDto, LoginRecordDto } from '@app/contracts';
import { PaginateResult, Types } from 'mongoose';
import { BaseMapper } from 'src/shared/base/base-mapper';
import { LoginRecord } from '../model/login-record.model';
import { UserMappers } from './user.mappers';

export class LoginRecordMappers extends BaseMapper {
  public static toDtosPaged(
    source: PaginateResult<LoginRecord>,
  ): PagedListDto<LoginRecordDto> {
    return {
      docs: LoginRecordMappers.toDtos(source.docs) as LoginRecordDto[],
      totalDocs: source.totalDocs,
      limit: source.limit,
      page: source.page,
      totalPages: source.totalPages,
    };
  }

  public static toDtos(
    source: LoginRecord[] | Types.ObjectId[],
  ): LoginRecordDto[] | string[] {
    if (!this.isValidArray(source)) {
      return null;
    }

    const res = [];
    source?.forEach((u: Types.ObjectId | LoginRecord) =>
      res.push(LoginRecordMappers.toDto(u)),
    );
    return res;
  }

  public static toDto(
    source: LoginRecord | Types.ObjectId,
  ): LoginRecordDto | string {
    if (!this.isValidDocument(source)) {
      return BaseMapper.objectIdToString(source);
    }

    const user = source as LoginRecord;

    return {
      id: user._id.toHexString(),
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
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
      user: UserMappers.toIdName(user.user),
    };
  }
}
