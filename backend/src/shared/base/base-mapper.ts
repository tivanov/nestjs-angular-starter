import { isArray } from 'class-validator';
import { Types } from 'mongoose';

export class BaseMapper {
  public static isValidDocument(source: any): boolean {
    if (!source || source === null) {
      return false;
    }

    if (source instanceof Types.ObjectId) {
      return false;
    }

    if (typeof source !== 'object') {
      return false;
    }

    return true;
  }

  public static isValidArray(source: any[]): boolean {
    if (!source) {
      return false;
    }

    if (!isArray(source)) {
      return false;
    }

    return true;
  }

  public static objectIdToString(source: any): string {
    if (!source) {
      return null;
    }

    if (!(source instanceof Types.ObjectId)) {
      if (!this.isValidDocument(source)) {
        return null;
      }

      return source._id?.toHexString();
    }

    return (source as Types.ObjectId)?.toHexString();
  }

  public static objectIdsToStrings(
    source: Types.ObjectId[] | string[],
  ): string[] {
    return source?.map((objId) => BaseMapper.objectIdToString(objId));
  }

  public static stringsToObjectIds(source: string[]): Types.ObjectId[] {
    return source?.map((strId) => new Types.ObjectId(strId));
  }

  public static stringToObjectId(source: string): Types.ObjectId {
    return new Types.ObjectId(source);
  }
}
