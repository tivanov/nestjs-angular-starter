import { BaseMapper } from 'src/shared/base/base-mapper';
import { SystemConfig } from '../model/system-config.model';
import { Types } from 'mongoose';
import { SystemConfigDto } from '@app/contracts';

export class SystemConfigMappers extends BaseMapper {
  public static toDto(
    source?: SystemConfig | Types.ObjectId,
  ): SystemConfigDto | string {
    if (!this.isValidDocument(source)) {
      return BaseMapper.objectIdToString(source);
    }

    const doc = source as SystemConfig;

    return {
      id: doc._id.toString(),
      createdAt: doc.createdAt?.toISOString(),
      updatedAt: doc.updatedAt?.toISOString(),
    };
  }
}
