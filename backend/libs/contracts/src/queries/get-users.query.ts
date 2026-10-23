import { UserRoleEnum } from '../enums/index.js';
import { ShapeableQuery } from './shapeable-query.js';
import { IsEnum, IsOptional, MaxLength, MinLength } from 'class-validator';

export class GetUsersQuery extends ShapeableQuery {
  @IsOptional()
  @MaxLength(100)
  @MinLength(3)
  userName?: string;

  @IsOptional()
  @IsEnum(UserRoleEnum)
  role?: UserRoleEnum;

  @IsOptional()
  @MaxLength(200)
  searchQuery?: string;
}
