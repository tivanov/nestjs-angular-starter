import { Injectable } from '@nestjs/common';

type ExclusiveValues<U1, U2> = Exclude<U1, U2> | Exclude<U2, U1>;
type EnumValues<T> = T extends string ? `${T}` : never;
export type CompatibleUnions<U1, U2> =
  ExclusiveValues<U1, U2> extends never ? U1 : never;
export type CompatibleEnums<E1, E2> =
  CompatibleUnions<EnumValues<E1>, EnumValues<E2>> extends never ? never : E1;

@Injectable()
export class EnumUtilsService {
  enumToLower(enumValue: string): string {
    return enumValue.toLowerCase();
  }

  safelyConvertEnum<From extends string, To extends string>(
    fromValue: CompatibleEnums<From, To>,
  ) {
    return fromValue as any as To;
  }
}
