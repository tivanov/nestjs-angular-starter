import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { IdentityProviderEnum } from '../enums';
import { ShapeableQuery } from './shapeable-query';

export class GetIdentitiesQuery extends ShapeableQuery {
  @IsOptional()
  uid?: string;

  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsOptional()
  @IsEnum(IdentityProviderEnum)
  provider?: IdentityProviderEnum;
}
